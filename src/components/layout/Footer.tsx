import { Instagram, Music2, Youtube, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import froshIcon from "@/assets/frosh-logo-new.png";
const Footer = () => {
  const navigate = useNavigate();
  return <footer className="bg-[#0c1008] text-[#e5e7eb]/90 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 md:px-6 py-6 md:py-5">
        <div className="grid gap-6 md:gap-3 md:grid-cols-[1fr_2fr] items-start md:items-center">
          
          {/* Brand + Social */}
          <div className="space-y-3 md:space-y-2">
            <div className="flex items-center gap-2">
              <img 
                src={froshIcon} 
                alt="Frosh" 
                width="32" 
                height="32"
                className="h-7 md:h-8 w-auto border border-[#015cd2] rounded-sm" 
              />
            </div>
            <p className="text-[13px] md:text-sm text-zinc-400/75 max-w-md leading-relaxed">
              The trusted platform for college freshmen to connect, network, and build lasting friendships 
              before stepping foot on campus.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button aria-label="Instagram" onClick={() => window.open('https://www.instagram.com/getfrosh/', '_blank', 'noopener,noreferrer')} className="opacity-80 hover:opacity-100 hover:text-[#015cd2] focus:outline-none focus:ring-2 focus:ring-[#015cd2] rounded transition-all duration-200">
                <Instagram className="h-5 w-5" />
              </button>
              <button aria-label="TikTok" onClick={() => window.open('https://www.tiktok.com/@getfrosh', '_blank', 'noopener,noreferrer')} className="opacity-80 hover:opacity-100 hover:text-[#015cd2] focus:outline-none focus:ring-2 focus:ring-[#015cd2] rounded transition-all duration-200">
                <Music2 className="h-5 w-5" />
              </button>
              <button aria-label="YouTube" onClick={() => window.open('https://www.youtube.com/@getfrosh', '_blank', 'noopener,noreferrer')} className="opacity-80 hover:opacity-100 hover:text-[#015cd2] focus:outline-none focus:ring-2 focus:ring-[#015cd2] rounded transition-all duration-200">
                <Youtube className="h-5 w-5" />
              </button>
              <button aria-label="LinkedIn" onClick={() => window.open('https://linkedin.com/company/froshapp', '_blank', 'noopener,noreferrer')} className="opacity-80 hover:opacity-100 hover:text-[#015cd2] focus:outline-none focus:ring-2 focus:ring-[#015cd2] rounded transition-all duration-200">
                <Linkedin className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="md:self-center">
            <div className="flex flex-row items-start justify-start md:justify-end gap-12 md:gap-8 md:pr-4">
              
              {/* Company Links Column */}
              <div className="flex-1 md:flex-none md:w-auto text-left">
                <h3 className="text-xs uppercase tracking-wide text-zinc-400/75 font-medium mb-3">
                  Company
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => navigate('/about')} className="text-[13px] md:text-[14px] hover:text-[#015cd2] underline-offset-4 hover:underline transition-all duration-200 block">
                      About
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/features')} className="text-[13px] md:text-[14px] hover:text-[#015cd2] underline-offset-4 hover:underline transition-all duration-200 block">
                      Features
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/contact')} className="text-[13px] md:text-[14px] hover:text-[#015cd2] underline-offset-4 hover:underline transition-all duration-200 block">
                      Contact
                    </button>
                  </li>
                </ul>
              </div>
              
              {/* Legal Links Column */}
              <div className="flex-1 md:flex-none md:w-auto text-left">
                <h3 className="text-xs uppercase tracking-wide text-zinc-400/75 font-medium mb-3">
                  Legal
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => navigate('/privacy-policy')} className="text-[13px] md:text-[14px] hover:text-[#015cd2] underline-offset-4 hover:underline transition-all duration-200 block">
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/terms-of-service')} className="text-[13px] md:text-[14px] hover:text-[#015cd2] underline-offset-4 hover:underline transition-all duration-200 block">
                      Terms
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/cookie-policy')} className="text-[13px] md:text-[14px] hover:text-[#015cd2] underline-offset-4 hover:underline transition-all duration-200 block">
                      Cookies
                    </button>
                  </li>
                </ul>
              </div>
              
            </div>
          </nav>
        </div>
      </div>

      {/* Micro-bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-4 md:py-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-2 text-xs md:text-[13px] text-zinc-300/90">
            <p className="text-left leading-relaxed">
              By using Frosh, you agree to our Privacy Policy & Terms. <br className="md:hidden" />
              © 2025 Frosh™ All rights reserved.
            </p>
            <p className="text-center md:text-right text-xs md:text-[13px] text-zinc-400/75 md:whitespace-nowrap w-full md:w-auto">
              Built for the class of 2030 🎓
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;