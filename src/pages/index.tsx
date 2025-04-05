import About from "@/components/features/LandingPage/About";
import Contribution from "@/components/features/LandingPage/Contribution/Contribution";
import Footer from "@/components/features/LandingPage/Footer";
import Hero from "@/components/features/LandingPage/Hero/Hero";
import Impact from "@/components/features/LandingPage/Impact/Impact";
import Banks from "@/components/features/LandingPage/Banks/Banks";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Hero />
      {/* <About /> */}
      <Impact />
      <Contribution />
      <Banks />
      <Footer />
    </div>
  );
}
