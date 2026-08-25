import Hero from "../components/Hero/Hero";
import Legacy from "../components/Legacy/Legacy";
import RsvpForm from "../components/RsvpForm/RsvpForm";
import Leadership from "../components/Leadership/Leadership";
import SiteFooter from "../components/SiteFooter/SiteFooter";
import Reveal from "../components/Reveal/Reveal";

function LandingPage() {
  return (
    <>
      <Hero />
      <Reveal>
        <Legacy />
      </Reveal>
      <Reveal delay={100}>
        <RsvpForm />
      </Reveal>
      <Reveal delay={140}>
        <Leadership />
      </Reveal>
      <Reveal delay={80}>
        <SiteFooter />
      </Reveal>
    </>
  );
}

export default LandingPage;
