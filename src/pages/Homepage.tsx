import { motion } from 'framer-motion';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[#0c1008] text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FroshMeet Logo" width={36} height={36} className="rounded-xl" />
          <span className="font-bold text-lg tracking-wide">FROSHMEET</span>
        </div>
        <div className="hidden md:flex gap-8 text-zinc-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#community" className="hover:text-white transition">Community</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
          <a href="#about" className="hover:text-white transition">About</a>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl text-zinc-300 hover:text-white">Sign In</button>
          <button className="bg-[#0661d8] hover:brightness-110 px-4 py-2 rounded-2xl font-semibold">Join FroshMeet</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div
            className="w-[900px] h-[900px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(40% 40% at 50% 20%, rgba(6,97,216,.35), transparent 70%)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-6xl font-extrabold leading-tight"
            >
              Meet your <span className="text-[#0661d8]">Class of 2030</span><br /> before Day One.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-zinc-300 mt-4 max-w-xl"
            >
              Find roommates, group chats, and new friends at your school — before the year even starts.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-3 font-semibold text-[#0661d8]"
            >
              🎓 Launching for Class of 2030 at 100+ colleges.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 flex flex-col sm:flex-row gap-3"
            >
              <input
                placeholder="Search for your school…"
                className="rounded-2xl px-4 py-3 w-full bg-[#1a1f15] text-white placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-blue-700/40"
              />
              <button className="bg-[#0661d8] hover:brightness-110 px-5 py-3 rounded-2xl font-semibold">
                Explore School
              </button>
            </motion.div>

            <div className="mt-5 text-xs text-zinc-400">Freshmen-only • Safe • Free</div>
          </div>

          {/* Phone/UI mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <img
              src="/app-mockup.png"
              alt="FroshMeet App Preview"
              width={420}
              height={600}
              className="rounded-2xl shadow-2xl border border-white/10"
            />
          </motion.div>
        </div>
      </section>

      {/* Instagram feature box */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
             style={{ background: 'linear-gradient(90deg, #ec4899, #f59e0b)' }}>
          <div>
            <h3 className="text-xl font-bold">✨ Get Featured on Instagram</h3>
            <p className="text-sm text-zinc-100 mt-1">Be one of the first Class of 2030 students featured across 100+ campuses.</p>
          </div>
          <button className="bg-white text-black rounded-2xl px-5 py-3 font-semibold hover:brightness-95">
            Start Your Feature Application
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 pb-10 text-zinc-400 text-sm">
        ⚠️ FroshMeet is a student-run platform and is not officially affiliated with or endorsed by any college or university.
      </footer>
    </div>
  );
}