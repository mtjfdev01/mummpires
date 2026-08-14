import Hero from "../components/Hero/Hero";
import Legacy from "../components/Legacy/Legacy";
import RsvpForm from "../components/RsvpForm/RsvpForm";
import Leadership from "../components/Leadership/Leadership";
import Concierge from "../components/Concierge/Concierge";
import SiteFooter from "../components/SiteFooter/SiteFooter";

function LandingPage() {
  return (
    <>
      <Hero />
      <Legacy />
      <RsvpForm />
      <Leadership />
      <Concierge />
      <SiteFooter />
    </>
  );
}

export default LandingPage;
