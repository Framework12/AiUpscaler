import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const { userId, originalUrl, upscaledUrl, scale, fileSizeBytes } = await request.json();

    if (!userId || !originalUrl || !upscaledUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save image record to database
    const { data: image, error } = await supabaseAdmin
      .from('images')
      .insert({
        user_id: userId,
        original_url: originalUrl,
        upscaled_url: upscaledUrl,
        scale: scale || 2,
        file_size_bytes: fileSizeBytes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving image:', error);
      return NextResponse.json(
        { error: 'Failed to save image record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error('Image save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
