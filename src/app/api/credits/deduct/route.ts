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
    const { userId, amount = 1 } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('credits, is_premium, total_upscales')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    if (profile.is_premium) {
      return NextResponse.json({
        success: true,
        credits: Infinity,
        isPremium: true,
      });
    }

    if (profile.credits < amount) {
      return NextResponse.json(
        { error: 'Insufficient credits', credits: profile.credits },
        { status: 402 }
      );
    }

    const newCredits = profile.credits - amount;
    const newTotalUpscales = (profile.total_upscales || 0) + 1;

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        credits: newCredits,
        total_upscales: newTotalUpscales,
      })
      .eq('id', userId)
      .select('credits, total_upscales')
      .single();

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return NextResponse.json(
        { error: 'Failed to update credits' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      credits: updated.credits,
      totalUpscales: updated.total_upscales,
      isPremium: false,
    });
  } catch (error) {
    console.error('Credit deduction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
