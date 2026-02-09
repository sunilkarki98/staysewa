import Hero from "../components/sections/Hero";
import PopularHostels from "../components/sections/PopularHostels";
import HowItWorks from "../components/sections/HowItWorks";
import CallToAction from "../components/sections/CallToAction";
import WhyChooseUs from "../components/sections/WhyChooseUs";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Hero + Search */}
      <Hero />

      {/* Popular Hostels / Flats */}
      <PopularHostels />

      <WhyChooseUs />
      {/* How it works */}
      <HowItWorks />

      {/* CTA */}
      <CallToAction />
    </div>
  );
}
