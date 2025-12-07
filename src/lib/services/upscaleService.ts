export interface UpscaleResponse {
  success: boolean;
  url?: string;
  error?: string;
}

import { supabase } from '@/lib/supabaseClient';

export async function upscaleImage(
  imageUrl: string,
  scale: number = 2,
  userId?: string
): Promise<UpscaleResponse> {
  try {
    console.log('Upscaling image with scale:', scale);
    
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
      
      // Handle specific status codes
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
      await supabase.from('images').insert([{
        user_id: userId,
        original_url: imageUrl,
        upscaled_url: data.url,
        scale: scale,
      }]);
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
