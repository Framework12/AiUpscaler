import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import UploadCard from '@/components/UploadCard';
import HowItWorks from '@/components/HowItWorks';
import UseCases from '@/components/UseCases';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <UploadCard />
      <HowItWorks />
      <UseCases />
      <CTA />
      <Footer />
    </main>
  );
}
