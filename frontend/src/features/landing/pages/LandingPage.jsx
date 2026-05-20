import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
// import StatsSection from "../components/StatsSection";
import WhySection from "../components/WhySection";
import FeatureCards from "../components/FeatureCards";
import Footer from "../components/Footer";
import ChatSection from "../components/ChatSection";
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      {/* <StatsSection /> */}
      <WhySection/>
      <ChatSection/>
      <FeatureCards/>
      <Footer/>
    </>
  );
}