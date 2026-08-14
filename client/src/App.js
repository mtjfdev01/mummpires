import Hero from "./components/Hero/Hero";
import Legacy from "./components/Legacy/Legacy";
import Leadership from "./components/Leadership/Leadership";
import Concierge from "./components/Concierge/Concierge";
import SiteFooter from "./components/SiteFooter/SiteFooter";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Hero />
      <Legacy />
      <Leadership />
      <Concierge />
      <SiteFooter />
    </div>
  );
}

export default App;
