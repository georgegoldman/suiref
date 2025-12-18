import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
// import heroShape from "../assets/hero-shape.png"; // Removed
import { HeroGrid } from "./HeroGrid";

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-white overflow-hidden flex flex-col relative text-black font-['Space_Grotesk']">
      {/* Vertical Grid Lines Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none flex justify-between px-[5%] z-0">
        <div className="h-full w-[3px] bg-black/5"></div>
        <div className="h-full w-[3px] bg-black/5"></div>
        <div className="h-full w-[3px] bg-black/5"></div>
        <div className="h-full w-[3px] bg-black/5"></div>
        <div className="h-full w-[3px] bg-black/5"></div>
        <div className="h-full w-[3px] bg-black/5"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-20 w-full px-6 md:px-8 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {/* <img src={suirefLogo} alt="SuiRef" className="h-8 w-auto invert" /> */}
          <span className="text-2xl font-bold tracking-tighter">SUIREF</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/leaderboard" className="hover:opacity-60 transition-opacity">Leaderboard +</Link>
          <Link to="/dashboard" className="hover:opacity-60 transition-opacity">Events +</Link>
        </div>

        {/* Right Action (Desktop) */}
        <div className="hidden md:block">
           <Link 
            to="/ecosystem"
            className="bg-black text-white px-6 py-2 rounded-none text-sm font-medium hover:bg-black/80 transition-colors"
           >
            Explore Ecosystem &rarr;
           </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-black z-30"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-20 flex flex-col items-center justify-center gap-8 p-8 md:hidden">
            <Link 
              to="/leaderboard" 
              className="text-2xl font-bold hover:opacity-60 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Leaderboard +
            </Link>
            <Link 
              to="/dashboard" 
              className="text-2xl font-bold hover:opacity-60 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Events +
            </Link>
            <Link 
              to="/ecosystem"
              className="mt-4 bg-black text-white px-8 py-3 text-lg font-medium hover:bg-black/80 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore Ecosystem &rarr;
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 w-full mx-auto px-6 md:px-28 grid grid-cols-1 md:grid-cols-2 items-center overflow-y-auto md:overflow-visible">
        {/* Left: Text */}
        <div className="flex flex-col items-start gap-6 md:gap-8 pt-10 md:pt-0 pb-10 md:pb-0">
          <h1 className="text-5xl md:text-8xl w-full font-medium tracking-tight leading-[0.9]">
            Visualize Impact. <br />
            Reward Growth.
          </h1>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 border border-black w-full sm:w-fit mt-4 md:mt-8">
             <button className="bg-[#f0f0f0] text-black px-8 py-4 text-sm font-bold hover:bg-[#e0e0e0] transition-colors text-center">
                Learn more
             </button>
             <Link to="/ecosystem" className="bg-black text-white px-8 py-4 text-sm font-bold hover:bg-zinc-800 transition-colors text-center border-t sm:border-t-0 sm:border-l border-white/20 sm:border-transparent">
                Explore Ecosystem &rarr;
             </Link>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="relative h-[300px] md:h-full w-full flex items-center justify-center">
             <HeroGrid />
             {/* Text box overlay like Talus */}
             <div className="absolute bottom-4 md:bottom-20 left-0 md:left-0 bg-[#f5f5f5] p-4 md:p-6 max-w-[280px] md:max-w-xs border border-white/50 shadow-sm backdrop-blur-sm mx-auto right-0 md:right-auto md:mx-0">
                 <p className="text-xs text-black/70 leading-relaxed">
                     SuiRef is the definitive layer for tracking Sui developer contributions and incentivizing community expansion through on-chain verified referrals.
                 </p>
             </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
