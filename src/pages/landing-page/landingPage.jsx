import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import WhyUs from "../../components/WhyUs";
import Steps from "../../components/Steps";
import Comments from "../../components/Comments";
import WhoAre from "../../components/WhoAre";
import ContactUs from "../../components/ContactUs";
import FAQ from "../../components/FAQ";
import Footer from "../../components/Footer";

export default function LandingPage() {
  return (
    <div dir="rtl">
      <Navbar />
      <Hero />
      <WhyUs />
      <WhoAre />
      <Comments />
      <Steps />
      <ContactUs />
      <FAQ />
      <Footer />
    </div>
  );
}






