'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DebugPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const testResults: any = {};

    // Test 1: Check Supabase connection
    try {
      const { data, error } = await supabase.from('profiles').select('count');
      testResults.connection = {
        success: !error,
        error: error?.message,
        data,
      };
    } catch (err: any) {
      testResults.connection = {
        success: false,
        error: err.message,
      };
    }

    // Test 2: Check auth session
    try {
      const { data, error } = await supabase.auth.getSession();
      testResults.session = {
        success: !error,
        hasSession: !!data.session,
        user: data.session?.user?.email,
        error: error?.message,
      };
    } catch (err: any) {
      testResults.session = {
        success: false,
        error: err.message,
      };
    }

    // Test 3: Check if profiles table exists
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      testResults.profilesTable = {
        success: !error,
        error: error?.message,
        hint: error?.hint,
        details: error?.details,
        code: error?.code,
      };
    } catch (err: any) {
      testResults.profilesTable = {
        success: false,
        error: err.message,
      };
    }

    // Test 4: Check if images table exists
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .limit(1);
      testResults.imagesTable = {
        success: !error,
        error: error?.message,
      };
    } catch (err: any) {
      testResults.imagesTable = {
        success: false,
        error: err.message,
      };
    }

    // Test 5: Check environment variables
    testResults.env = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    };

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔍 Supabase Debug Page</h1>
        
        <button
          onClick={runTests}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 mb-8"
        >
          {loading ? 'Running Tests...' : 'Run Diagnostic Tests'}
        </button>

        {Object.keys(results).length > 0 && (
          <div className="space-y-6">
            {/* Connection Test */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                {results.connection?.success ? '✅' : '❌'} Supabase Connection
              </h2>
              <pre className="text-sm text-slate-300 overflow-auto">
                {JSON.stringify(results.connection, null, 2)}
              </pre>
            </div>

            {/* Session Test */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                {results.session?.success ? '✅' : '❌'} Auth Session
              </h2>
              <pre className="text-sm text-slate-300 overflow-auto">
                {JSON.stringify(results.session, null, 2)}
              </pre>
            </div>

            {/* Profiles Table Test */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                {results.profilesTable?.success ? '✅' : '❌'} Profiles Table
              </h2>
              <pre className="text-sm text-slate-300 overflow-auto">
                {JSON.stringify(results.profilesTable, null, 2)}
              </pre>
              {!results.profilesTable?.success && (
                <div className="mt-4 p-4 bg-red-950/50 border border-red-800 rounded-lg">
                  <p className="text-red-400 font-semibold mb-2">Possible Issues:</p>
                  <ul className="text-sm text-red-300 list-disc list-inside space-y-1">
                    <li>Table doesn't exist - Run supabase-setup.sql</li>
                    <li>RLS policy blocking access - Check policies</li>
                    <li>Wrong API key - Check NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Images Table Test */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                {results.imagesTable?.success ? '✅' : '❌'} Images Table
              </h2>
              <pre className="text-sm text-slate-300 overflow-auto">
                {JSON.stringify(results.imagesTable, null, 2)}
              </pre>
            </div>

            {/* Environment Variables */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4">🔧 Environment Variables</h2>
              <pre className="text-sm text-slate-300 overflow-auto">
                {JSON.stringify(results.env, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-blue-950/50 border border-blue-800 rounded-xl">
          <h3 className="text-lg font-bold mb-2">💡 Quick Fixes</h3>
          <ul className="text-sm text-blue-300 space-y-2">
            <li>• If connection fails: Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>• If tables don't exist: Run supabase-setup.sql in Supabase SQL Editor</li>
            <li>• If RLS error: Check that RLS policies are created correctly</li>
            <li>• If using service_role key: Replace with anon key (see GET_ANON_KEY_GUIDE.md)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
