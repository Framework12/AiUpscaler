import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;   

const CLIPDROP_URL = 'https://clipdrop-api.co/image-upscaling/v1/upscale';
const BASE_SIZE = 1024;
const MIN_SCALE = 1;
const MAX_SCALE = 4; 

function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json(
    { error: message, ...(extra ?? {}) },
    { status }
  );
}

function isDataUrl(url: string) {
  return url.startsWith('data:');
}

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// --- Route handler --- //

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.CLIPBOARD_API_KEY;

    if (!apiKey) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('CLIPBOARD_API_KEY is not set');
      }
      return jsonError('Server configuration error', 500);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid JSON body', 400);
    }

    const { imageUrl, scale } = body as {
      imageUrl?: string;
      scale?: number | string;
    };

    if (!imageUrl || typeof imageUrl !== 'string') {
      return jsonError('Image URL is required', 400);
    }

    if (!isDataUrl(imageUrl) && !isValidHttpUrl(imageUrl)) {
      return jsonError('Invalid image URL format', 400);
    }

    // Normalize scale
    const numericScale = Number(scale) || 2;
    const safeScale = Math.min(Math.max(numericScale, MIN_SCALE), MAX_SCALE);

    if (process.env.NODE_ENV !== 'production') {
      console.info('Starting upscale with Clipdrop API', {
        imageUrlPreview: imageUrl.slice(0, 50) + (imageUrl.length > 50 ? '…' : ''),
        scale: safeScale,
      });
    }

    let imageBlob: Blob;

    // Data URL (base64) vs remote URL
    if (isDataUrl(imageUrl)) {
      const parts = imageUrl.split(',');
      const base64Data = parts[1];

      if (!base64Data) {
        return jsonError('Invalid data URL format', 400);
      }

      const buffer = Buffer.from(base64Data, 'base64');
      imageBlob = new Blob([buffer]);
    } else {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 15_000); // 15s timeout

      const imageResponse = await fetch(imageUrl, {
        signal: abortController.signal,
      }).catch((err) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error fetching source image:', err);
        }
        return null;
      });

      clearTimeout(timeoutId);

      if (!imageResponse || !imageResponse.ok) {
        return jsonError('Failed to fetch image from URL', 400);
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      if (!imageBuffer || imageBuffer.byteLength === 0) {
        return jsonError('Fetched image is empty or invalid', 400);
      }

      imageBlob = new Blob([imageBuffer]);
    }


    const targetSize = BASE_SIZE * safeScale;

    const formData = new FormData();
    formData.append('image_file', imageBlob, 'image.png');
    formData.append('target_width', String(targetSize));
    formData.append('target_height', String(targetSize));

    // Call Clipdrop API
    const clipdropResponse = await fetch(CLIPDROP_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: formData,
    });

    if (!clipdropResponse.ok) {
      const status = clipdropResponse.status;

      let errorMessage = 'Failed to upscale image';
      if (status === 401 || status === 403) {
        errorMessage = 'Authentication to upstream service failed';
      } else if (status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (status === 400) {
        errorMessage = 'Invalid image or request for upscaling';
      }

      if (process.env.NODE_ENV !== 'production') {
        console.error(`Clipdrop API error (${status}):`, errorMessage);
      }

      return jsonError(errorMessage, status);
    }

    const upscaledBuffer = await clipdropResponse.arrayBuffer();

    if (!upscaledBuffer || upscaledBuffer.byteLength === 0) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('No image data received from Clipdrop');
      }
      return jsonError('No image data received from upstream service', 500);
    }

    const base64Image = Buffer.from(upscaledBuffer).toString('base64');
    const imageDataUrl = `data:image/png;base64,${base64Image}`;

    if (process.env.NODE_ENV !== 'production') {
      console.info('Upscale completed successfully, bytes:', upscaledBuffer.byteLength);
    }

    return NextResponse.json({
      success: true,
      url: imageDataUrl,
      meta: {
        scale: safeScale,
        width: targetSize,
        height: targetSize,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (process.env.NODE_ENV !== 'production') {
      console.error('Upscaling route error:', message);
    }

    return NextResponse.json(
      {
        error: 'Failed to upscale image',
        details: process.env.NODE_ENV === 'development' ? message : undefined,
      },
      { status: 500 }
    );
  }
}
