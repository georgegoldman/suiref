import { Link } from "react-router-dom";
import heroShape from "../assets/hero-shape.png";

const LandingPage = () => {
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
      <nav className="relative z-10 w-full px-8 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {/* <img src={suirefLogo} alt="SuiRef" className="h-8 w-auto invert" /> */}
          <span className="text-2xl font-bold tracking-tighter">SUIREF</span>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/ecosystem" className="hover:opacity-60 transition-opacity">Ecosystem +</Link>
          <Link to="/dashboard" className="hover:opacity-60 transition-opacity">Community +</Link>
        </div>

        {/* Right Action */}
        <div>
           <Link 
            to="/ecosystem"
            className="hidden md:block bg-black text-white px-6 py-2 rounded-none text-sm font-medium hover:bg-black/80 transition-colors"
           >
            Explore Ecosystem &rarr;
           </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Left: Text */}
        <div className="flex flex-col items-start gap-8">
          <h1 className="text-6xl md:text-8xl w-full font-medium tracking-tight leading-[0.9]">
            Visualize Impact. <br />
            Reward Growth.
          </h1>
          
          <div className="flex items-center gap-0 border border-black w-fit mt-8">
             <button className="bg-[#f0f0f0] text-black px-8 py-4 text-sm font-bold hover:bg-[#e0e0e0] transition-colors">
                Learn more
             </button>
             <Link to="/ecosystem" className="bg-black text-white px-8 py-4 text-sm font-bold hover:bg-zinc-800 transition-colors">
                Explore Ecosystem &rarr;
             </Link>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="relative h-full w-full flex items-center justify-center">
             <img 
                src={heroShape} 
                alt="Abstract Shape" 
                className="w-[120%] h-auto max-w-none object-contain drop-shadow-2xl mix-blend-multiply"
                style={{
                    filter: "hue-rotate(45deg) saturate(1.2)"
                }}
             />
             {/* Text box overlay like Talus */}
             <div className="absolute bottom-20 left-0 bg-[#f5f5f5] p-6 max-w-xs border border-white/50 shadow-sm backdrop-blur-sm">
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
