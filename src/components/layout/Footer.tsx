import { Instagram, Music2, Youtube, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0c1008] text-zinc-300/90 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid gap-6 md:gap-4 md:grid-cols-[1fr_auto_1fr] items-start">
          
          {/* Brand + Social */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/a880e910-33fe-4ce7-b556-01f73d623057.png" 
                alt="FroshMeet" 
                className="h-6 md:h-7" 
              />
            </div>
            <p className="text-[13px] md:text-sm text-zinc-400/80 max-w-md leading-6">
              The trusted platform for college freshmen to connect, network, and build lasting friendships 
              before stepping foot on campus.
            </p>
            <div className="flex items-center gap-3">
              <button
                aria-label="Instagram"
                onClick={() => window.open('https://www.instagram.com/froshmeet/', '_blank', 'noopener,noreferrer')}
                className="opacity-80 hover:opacity-100 hover:text-[#015cd2] focus:outline-none focus:ring-2 focus:ring-[#015cd2] rounded transition-all duration-200"
              >
                <Instagram className="h-5 w-5" />
              </button>
              <button
                aria-label="TikTok"
                onClick={() => window.open('https://www.tiktok.com/@froshmeet', '_blank', 'noopener,noreferrer')}
                className="opacity-80 hover:opacity-100 hover:text-[#015cd2] focus:outline-none focus:ring-2 focus:ring-[#015cd2] rounded transition-all duration-200"
              >
                <Music2 className="h-5 w-5" />
              </button>
              <button
                aria-label="YouTube"
                onClick={() => window.open('https://www.youtube.com/@FroshMeet', '_blank', 'noopener,noreferrer')}
                className="opacity-80 hover:opacity-100 hover:text-[#015cd2] focus:outline-none focus:ring-2 focus:ring-[#015cd2] rounded transition-all duration-200"
              >
                <Youtube className="h-5 w-5" />
              </button>
              <button
                aria-label="Email"
                onClick={() => window.open('mailto:hello@froshmeet.com')}
                className="opacity-80 hover:opacity-100 hover:text-[#015cd2] focus:outline-none focus:ring-2 focus:ring-[#015cd2] rounded transition-all duration-200"
              >
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="md:self-center">
            <ul className="flex flex-wrap justify-center md:justify-center gap-x-5 gap-y-2 text-sm md:text-[15px] tracking-tight">
              <li>
                <button 
                  onClick={() => navigate('/about')} 
                  className="hover:text-[#015cd2] underline-offset-4 hover:underline transition-all duration-200"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/features')} 
                  className="hover:text-[#015cd2] underline-offset-4 hover:underline transition-all duration-200"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/contact')} 
                  className="hover:text-[#015cd2] underline-offset-4 hover:underline transition-all duration-200"
                >
                  Contact
                </button>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav className="md:justify-self-end">
            <ul className="flex flex-wrap md:justify-end gap-x-5 gap-y-2 text-sm md:text-[15px] tracking-tight">
              <li>
                <button 
                  onClick={() => navigate('/privacy-policy')} 
                  className="hover:text-[#015cd2] underline-offset-4 hover:underline transition-all duration-200"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/terms-of-service')} 
                  className="hover:text-[#015cd2] underline-offset-4 hover:underline transition-all duration-200"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/cookie-policy')} 
                  className="hover:text-[#015cd2] underline-offset-4 hover:underline transition-all duration-200"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Micro-bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs md:text-[13px] text-zinc-400/70">
            <p className="text-center md:text-left">
              FroshMeet is student-run and not affiliated with any college or university. Use of this website constitutes acceptance of our Privacy Policy and Terms of Service.
            </p>
            <p className="text-center md:text-right">
              © 2025 FroshMeet · Built for the Class of 2030 🎓
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;