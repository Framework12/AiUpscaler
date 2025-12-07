'use client';

import Link from 'next/link';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const PricingCard = ({ plan, price, features, isFeatured = false }: any) => (
  <div className={`bg-slate-800/50 backdrop-blur rounded-2xl p-8 shadow-lg border ${isFeatured ? 'border-purple-500' : 'border-slate-700'}`}>
    <h3 className="text-2xl font-bold text-white mb-2">{plan}</h3>
    <p className="text-5xl font-bold text-cyan-400 mb-6">{price}</p>
    <ul className="space-y-4 mb-8">
      {features.map((feature: string, index: number) => (
        <li key={index} className="flex items-center space-x-3">
          <CheckIcon />
          <span className="text-slate-300">{feature}</span>
        </li>
      ))}
    </ul>
    <Link href="/auth/signup" className={`w-full text-center block py-3 rounded-lg font-semibold transition ${isFeatured ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/50' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
      Get Started
    </Link>
  </div>
);

export default function PremiumPage() {
  const plans = [
    {
      plan: 'Pro',
      price: '$10/mo',
      features: ['500 credits per month', '4x upscaling', 'Standard processing', '1 GB storage'],
      isFeatured: true,
    },
    {
      plan: 'Max',
      price: '$20/mo',
      features: ['2000 credits per month', '8x upscaling', 'Priority processing', '10 GB storage', 'API access'],
    },
    {
      plan: 'Ultra',
      price: '$40/mo',
      features: ['Unlimited credits', '16x upscaling', 'Highest priority processing', '100 GB storage', 'API access', 'Dedicated support'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Upgrade Your Plan</h1>
          <p className="text-xl text-slate-400">Choose the plan that fits your needs and unlock powerful features.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
}
