import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

import { chromium } from 'playwright';
import { createServiceRoleClient } from '../src/lib/supabase';
import type { Database } from '../src/types/supabase';

type AdInsert = Database['public']['Tables']['ads']['Insert'];

const VIDEO_TIMEOUT_MS = 30_000;
const AD_MEDIA_BUCKET = 'ad-media';
const FBCDN_HOST = 'fbcdn.net';

function getTargetUrl(): string {
  const url = process.argv[2];
  if (url?.startsWith('http')) return url;
  // Hardcoded fallback for testing
  return (
    url ||
    'https://www.facebook.com/ads/library/?id=example'
  );
}

async function run() {
  const targetUrl = getTargetUrl();
  console.log('🔍 Visiting URL...', targetUrl);

  const videoUrlPromise = new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('No video stream detected within 30 seconds'));
    }, VIDEO_TIMEOUT_MS);
    (global as unknown as { __resolveVideoUrl: (url: string) => void }).__resolveVideoUrl = (url: string) => {
      clearTimeout(timer);
      resolve(url);
    };
  });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  page.on('response', (response) => {
    const contentType = response.headers()['content-type'] || '';
    const isVideo =
      contentType.includes('video/mp4') || contentType.includes('video/webm');
    const url = response.url();
    if (isVideo) {
      console.log('📺 Video response:', contentType, url.slice(0, 80) + (url.length > 80 ? '...' : ''));
    }
    if (!isVideo) return;
    if (!url.includes(FBCDN_HOST)) return;

    const g = global as unknown as { __videoUrlCaptured?: boolean; __resolveVideoUrl?: (url: string) => void };
    if (g.__videoUrlCaptured) return;
    g.__videoUrlCaptured = true;
    console.log('✅ Found video URL:', url);
    g.__resolveVideoUrl?.(url);
  });

  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 }).catch(() => {
    console.warn('⚠️ Page load had issues; continuing...');
  });

  // Interstitial: "See ad details" (link to ad modal)
  const seeAdDetails = page
    .getByRole('button', { name: /See ad details/i })
    .or(page.getByText('See ad details').first());
  const seeAdVisible = await seeAdDetails.first().isVisible().catch(() => false);
  if (seeAdVisible) {
    await seeAdDetails.first().click();
    console.log("👉 Clicked 'See ad details'");
    await page.waitForLoadState('networkidle').catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));
  }

  // ——— METADATA SCRAPING (first, while page is stable) ———
  let brand_name = 'Unknown Brand';
  let headline = '';
  let primary_text = '';

  try {
    console.log('📋 Scraping metadata...');
    // Brand: header-like elements or first clickable in ad header
    const brandSelectors = [
      'h4',
      'span[dir="auto"]',
      'a[role="link"] strong',
      '[data-pagelet] a strong',
      'h2 a',
    ];
    for (const sel of brandSelectors) {
      const el = await page.$(sel).catch(() => null);
      if (el) {
        const t = (await el.textContent())?.trim();
        if (t && t.length > 0 && t.length < 200) {
          brand_name = t;
          break;
        }
      }
    }
    // Primary text: pre-wrap body or standard ad body
    const bodySelectors = [
      'div[style*="white-space: pre-wrap"]',
      'div[data-ad-preview="message"]',
      'div[dir="auto"][style]',
    ];
    for (const sel of bodySelectors) {
      const el = await page.$(sel).catch(() => null);
      if (el) {
        const t = (await el.textContent())?.trim()?.slice(0, 2000);
        if (t) {
          primary_text = t;
          break;
        }
      }
    }
    // Headline: bold text near CTA / bottom
    const headlineSelectors = [
      'div[dir="auto"] strong',
      '[data-ad-preview="message"] strong',
      'div[role="button"] strong',
    ];
    for (const sel of headlineSelectors) {
      const el = await page.$(sel).catch(() => null);
      if (el) {
        const t = (await el.textContent())?.trim();
        if (t && t.length > 0) {
          headline = t;
          break;
        }
      }
    }
    if (!primary_text && headline) primary_text = headline;
    console.log('📋 Metadata extracted:', { brand_name, headline: headline.slice(0, 50) || '(none)' });
  } catch (err) {
    console.warn('⚠️ Scraping failed, using defaults:', (err as Error).message);
  }

  // ——— VIDEO: play click, wait for URL, download, then close browser ———
  const g = global as unknown as { __videoUrlCaptured?: boolean };
  if (!g.__videoUrlCaptured) {
    const videoEl = await page.$('video').catch(() => null);
    const playButton = await page.locator('div[aria-label="Play"]').first().elementHandle().catch(() => null);
    const playRoleButton = await page.locator('div[role="button"]').filter({ hasText: /Play/i }).first().elementHandle().catch(() => null);
    const mediaContainer = await page.$('[data-video-permalink], [data-pagelet*="Video"], video').catch(() => null);
    const playTarget = playButton ?? playRoleButton;
    try {
      if (playTarget) {
        await playTarget.scrollIntoViewIfNeeded().catch(() => {});
        await page.evaluate((el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, view: window })), playTarget);
        console.log('▶️ Clicked Play Button');
        await new Promise((r) => setTimeout(r, 2000));
      } else if (videoEl) {
        await page.evaluate((el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, view: window })), videoEl);
        console.log('▶️ Clicked Play Button (center of video)');
        await new Promise((r) => setTimeout(r, 2000));
      } else if (mediaContainer) {
        await page.evaluate((el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, view: window })), mediaContainer);
        console.log('▶️ Clicked Play Button (center of media container)');
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        console.log('⚠️ No Play button or video found; waiting for network...');
      }
    } catch {
      console.log('⚠️ Could not click play, but checking for video...');
    }
  } else {
    console.log('✅ Video URL already captured, skipping play click.');
  }

  const POST_CLICK_WAIT_MS = 10_000;
  let videoUrl: string;
  try {
    videoUrl = await Promise.race([
      videoUrlPromise,
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('No video URL within 10 seconds after click attempt')), POST_CLICK_WAIT_MS)
      ),
    ]);
  } catch (err) {
    console.log('📸 Saving debug screenshot...');
    await page.screenshot({ path: path.join(process.cwd(), 'error-screenshot.png') }).catch(() => {});
    console.log('📸 Screenshot saved');
    await browser.close();
    console.error('❌', (err as Error).message);
    process.exit(1);
  }

  console.log('📥 Downloading video via request.get (chunked-safe)...');
  const downloadResponse = await context.request.get(videoUrl);
  const body = await downloadResponse.body();
  const buffer = Buffer.from(body);
  console.log('📥 Video buffer captured:', `${(buffer.length / 1024).toFixed(1)} KB`);

  await browser.close();
  console.log('🔒 Browser closed.');

  // ——— UPLOAD (after browser closed, using stored metadata and buffer) ———

  const supabase = createServiceRoleClient();
  const fileId = crypto.randomUUID();
  const filePath = `${fileId}.mp4`;

  console.log('☁️ Uploading to Supabase storage...');
  const { error: uploadError } = await supabase.storage
    .from(AD_MEDIA_BUCKET)
    .upload(filePath, buffer, { contentType: 'video/mp4', upsert: true });

  if (uploadError) {
    console.error('❌ Upload failed:', uploadError.message);
    process.exit(1);
  }

  const { data: urlData } = supabase.storage.from(AD_MEDIA_BUCKET).getPublicUrl(filePath);
  const media_url = urlData.publicUrl;
  console.log('✅ Uploaded to Supabase:', media_url);

  const row: AdInsert = {
    brand_name,
    headline: headline || primary_text.slice(0, 100),
    primary_text: primary_text || headline,
    format: 'video',
    media_url,
    thumbnail_url: media_url,
    landing_page_url: targetUrl,
    hook_rating: 0,
    industry: 'Unknown',
  };

  const { error: insertError } = await supabase.from('ads').insert(row as any);
  if (insertError) {
    console.error('❌ Database insert failed:', insertError.message);
    process.exit(1);
  }

  console.log('✅ Row inserted into ads table.');
  console.log('✅ Ingest complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
