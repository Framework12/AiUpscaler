import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-cyan-900/50 border-y border-slate-700">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-6 text-white">Ready to Transform Your Images?</h2>
        <p className="text-xl mb-8 text-slate-300 max-w-2xl mx-auto">
          Join thousands of professionals and enthusiasts who have already discovered the power of AI-powered image upscaling.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth/signup"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/50 transition inline-block"
          >
            Start Free Trial
          </Link>
          <Link 
            href="/premium"
            className="border-2 border-purple-500/50 text-cyan-400 px-8 py-4 rounded-lg font-bold hover:bg-slate-800/50 transition hover:border-purple-500 inline-block"
          >
            View Pricing
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-400">
          Get 10 free upscales to try it out.
        </p>
      </div>
    </section>
  );
}
