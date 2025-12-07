import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-6 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex md:flex-row flex-col justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-slate-950 font-bold">AI</span>
            </div>
            <span className="font-bold text-white">ImageUpscaler</span>
          </div>

          <div className="text-sm text-slate-400 flex gap-6 flex-wrap justify-center md:justify-end hover:text-cyan-400 transition">
            <Link href="#" className="hover:text-cyan-400 transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-cyan-400 transition">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-cyan-400 transition">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
