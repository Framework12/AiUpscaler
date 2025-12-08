export interface UpscaleResponse {
  success: boolean;
  url?: string;
  error?: string;
  credits?: number;
  totalUpscales?: number;
}

export async function upscaleImage(
  imageUrl: string,
  scale: number = 2,
  userId?: string
): Promise<UpscaleResponse> {
  try {
    console.log('Upscaling image with scale:', scale);

    if (userId) {
      const creditResponse = await fetch('/api/credits/deduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, amount: 1 }),
      });

      const creditData = await creditResponse.json();

      if (!creditResponse.ok) {
        if (creditResponse.status === 402) {
          return {
            success: false,
            error: 'Insufficient credits. Please upgrade to premium or purchase more credits.',
            credits: creditData.credits,
          };
        }
        return {
          success: false,
          error: creditData.error || 'Failed to process credits',
        };
      }
    }

    const response = await fetch('/api/upscale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        scale,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API error response:', data);

      if (response.status === 401) {
        return {
          success: false,
          error: 'Invalid or expired API key. Please check your Clipboard API configuration.',
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment and try again.',
        };
      }

      return {
        success: false,
        error: data.error || `API Error: ${response.status}`,
      };
    }

    if (!data.url) {
      console.error('No URL in response:', data);
      return {
        success: false,
        error: 'No upscaled image URL returned from server',
      };
    }

    console.log('Upscale successful, URL:', data.url.substring(0, 50) + '...');

    if (userId) {
      await fetch('/api/images/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          originalUrl: imageUrl,
          upscaledUrl: data.url,
          scale,
        }),
      }).catch((err) => {
        console.error('Failed to save image record:', err);
      });
    }

    return {
      success: true,
      url: data.url,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Network error';
    console.error('Upscale service error:', errorMsg);
    return {
      success: false,
      error: `Network error: ${errorMsg}`,
    };
  }
}
