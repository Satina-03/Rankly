import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import UserMenu from '../components/ui/UserMenu';

/* ── Aceternity-style: Animated Grid ── */
const AnimatedGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0" style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)',
      backgroundSize: '64px 64px', opacity: 0.04,
    }} />
    <div className="absolute inset-0" style={{
      backgroundImage: 'linear-gradient(rgba(245,166,35,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.3) 1px, transparent 1px)',
      backgroundSize: '64px 64px', opacity: 0.02, animation: 'gridScroll 25s linear infinite',
    }} />
  </div>
);

/* ── Aceternity-style: Spotlight ── */
const Spotlight = ({ containerRef }) => {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const handler = (e) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, [containerRef]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{
      background: `radial-gradient(700px circle at ${pos.x}px ${pos.y}px, rgba(245,166,35,0.05), transparent 50%)`,
    }} />
  );
};

/* ── Aceternity-style: Glowing Card ── */
const GlowingCard = ({ children, className = '' }) => {
  const [mp, setMp] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setMp({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  return (
    <div ref={ref} onMouseMove={onMove} className={`relative group ${className}`}>
      <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
        background: `radial-gradient(280px circle at ${mp.x}px ${mp.y}px, rgba(245,166,35,0.12), transparent 50%)`,
      }} />
      <div className="relative bg-card border border-line rounded-xl h-full">{children}</div>
    </div>
  );
};

/* ── Animation Variants ── */
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const fadeLeft = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };
const fadeDown = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const staggerItem = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const rowStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.25, delayChildren: 0.6 } } };
const rowItem = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.45 } } };

/* ── Counter Hook ── */
const useCountUp = (end, inView) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.max(1, Math.floor(end / 60));
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(id); }
      else setVal(start);
    }, 25);
    return () => clearInterval(id);
  }, [end, inView]);
  return val;
};

/* ── Data ── */
const NAV_LINKS = [
  { label: 'For Recruiters', path: '/for-recruiters' },
  { label: 'For Candidates', path: '/for-candidates' },
  { label: 'Browse Jobs', path: '/jobs' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Industries', id: 'industries' },
];

const CANDIDATES = [
  { rank: 1, initials: 'AM', name: 'Arjun Mehta', exp: '5 yrs · React AWS', score: 92, avatarBg: 'rgba(245,166,35,0.12)', avatarText: '#F5A623', barColor: '#00C9A7', rankColor: '#F5A623', borderColor: '#00C9A7' },
  { rank: 2, initials: 'SK', name: 'Sneha Kulkarni', exp: '3 yrs · Node CSS', score: 78, avatarBg: 'rgba(0,201,167,0.12)', avatarText: '#00C9A7', barColor: '#00C9A7', rankColor: '#666', borderColor: '#00C9A7' },
  { rank: 3, initials: 'RS', name: 'Rohan Sharma', exp: '2 yrs · Redux', score: 61, avatarBg: 'rgba(168,85,247,0.12)', avatarText: '#a855f7', barColor: '#F5A623', rankColor: '#d97706', borderColor: '#F5A623' },
];

const INDUSTRIES = [
  { title: 'IT & Tech', desc: 'Screen developers, engineers and designers with precision.', tag: 'Dev · Design · Cloud roles', iconBg: 'rgba(245,166,35,0.1)', iconColor: '#F5A623',
    icon: <><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5"/></> },
  { title: 'Banking & Finance', desc: 'Evaluate compliance and analytical talent at scale.', tag: 'Analysts · Risk · Compliance', iconBg: 'rgba(0,201,167,0.1)', iconColor: '#00C9A7',
    icon: <><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/></> },
  { title: 'Healthcare', desc: 'Match certified professionals to critical care roles.', tag: 'Doctors · Nurses · Pharma', iconBg: 'rgba(168,85,247,0.1)', iconColor: '#a855f7',
    icon: <><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5"/><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/></> },
  { title: 'HR Agencies', desc: 'Bulk screen candidates across any industry instantly.', tag: 'Staffing · Temp · Executive', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3b82f6',
    icon: <><circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M19 8v6M16 11h6" stroke="currentColor" strokeWidth="1.5"/></> },
];

const STEPS = [
  { num: 1, title: 'Post a job description', desc: 'Define the role, required skills, and experience level for your open position.' },
  { num: 2, title: 'Candidates apply', desc: 'Applicants upload resumes directly through the platform with one click.' },
  { num: 3, title: 'AI ranks everyone', desc: 'Every resume is scored 0–100 with strengths, gaps, and a summary in seconds.' },
];

/* ══════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════ */
const Navbar = ({ navigate }) => {
  const [active, setActive] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === '/for-recruiters') {
      setActive('For Recruiters');
    } else if (location.pathname === '/') {
      setActive('For Candidates');
    }
  }, [location.pathname]);

  const handleNavClick = (l) => {
    if (l.id === 'how-it-works') {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      setActive(l.label);
      return;
    }
    if (l.label === 'Industries') {
      if (location.pathname === '/') {
        document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
        setActive(l.label);
      } else {
        navigate('/');
      }
      return;
    }
    if (l.path) {
      if (l.path === '/') {
        navigate('/');
        window.scrollTo(0, 0);
      } else {
        navigate(l.path);
      }
    }
  };
  
  return (
    <motion.nav variants={fadeDown} initial="hidden" animate="visible"
      className={`sticky top-0 left-0 right-0 z-50 flex items-center justify-between h-[68px] px-[80px] border-b border-[#222222] transition-shadow duration-300 ${isScrolled ? 'shadow-md shadow-black/20' : ''}`}
      style={{ background: 'rgba(17,17,17,0.85)', backdropFilter: 'blur(12px)' }}>
      
      {/* Logo */}
      <div className="flex items-center">
        <span className="font-heading text-[22px] tracking-tight cursor-pointer flex items-center mr-6" onClick={() => { navigate('/'); window.scrollTo(0, 0); }}>
          <span className="w-2 h-2 bg-primary rounded-[3px] mr-[6px] inline-block" />
          <span className="text-primary">R</span><span className="text-white">ankly</span>
        </span>
      </div>
      
      {/* Links */}
      <div className="hidden md:flex items-center gap-[40px]">
        {location.pathname === '/for-recruiters' && (
          <button onClick={() => { navigate('/'); window.scrollTo(0, 0); }} className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] text-[12px] px-[14px] py-[6px] rounded-[20px] cursor-pointer hover:border-primary hover:text-primary transition-colors">
            &larr; Home
          </button>
        )}
        {NAV_LINKS.map((l) => (
          <div key={l.label} className="relative flex flex-col items-center">
            <button onClick={() => handleNavClick(l)}
              className="text-[14px] font-normal bg-transparent border-none cursor-pointer transition-colors duration-200 p-0"
              style={{ color: active === l.label ? '#fff' : '#888' }}
              onMouseEnter={(e) => (e.target.style.color = '#fff')}
              onMouseLeave={(e) => { if (active !== l.label) e.target.style.color = '#888'; }}>
              {l.label}
            </button>
            {active === l.label && <span className="absolute -bottom-[10px] w-1 h-1 rounded-full bg-primary" />}
          </div>
        ))}
      </div>
      
      {/* User Menu */}
      <UserMenu />
    </motion.nav>
  );
};

/* ══════════════════════════════════════════
   HERO
   ══════════════════════════════════════════ */
const ScoreBar = ({ pct, color }) => (
  <div className="w-[100px] h-1 rounded-full bg-[#1e1e1e] overflow-hidden">
    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
      transition={{ duration: 1, delay: 0.8 }}
      className="h-full rounded-full" style={{ background: color }} />
  </div>
);

const HeroCard = () => (
  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    className="w-full min-w-[400px] max-w-[440px] rounded-2xl border border-line overflow-hidden flex flex-col self-stretch"
    style={{ background: '#161616', boxShadow: '0 0 30px rgba(245,166,35,0.08)' }}>
    {/* header */}
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-line shrink-0" style={{ background: '#1a1a1a' }}>
      <span className="text-[11px] uppercase tracking-wider text-muted">AI Candidate Rankings</span>
      <span className="text-[10px] px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(0,201,167,0.1)', color: '#00C9A7' }}>Live results</span>
    </div>
    {/* body */}
    <div className="p-5 flex-1 flex flex-col justify-center">
      <div className="text-center pb-5 mb-5 border-b border-[#1e1e1e]">
        <div className="text-[68px] font-heading leading-none text-primary">92</div>
        <div className="text-[11px] text-muted mt-2">Top candidate AI score</div>
      </div>
      <motion.div variants={rowStagger} initial="hidden" animate="visible" className="flex flex-col">
        {CANDIDATES.map((c, i) => (
          <motion.div variants={rowItem} key={c.rank}
            className="flex items-center gap-3 rounded-lg"
            style={{ borderBottom: i < 2 ? '1px solid #1a1a1a' : 'none', borderLeft: `2px solid ${c.borderColor}`, padding: '16px 12px' }}>
            <span className="text-[10px] w-5 h-5 rounded-md flex items-center justify-center font-medium"
              style={{ background: 'rgba(255,255,255,0.04)', color: c.rankColor }}>{c.rank}</span>
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0"
              style={{ background: c.avatarBg, color: c.avatarText }}>{c.initials}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-white truncate">{c.name}</div>
              <div className="text-[10px] text-muted mt-0.5">{c.exp}</div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <ScoreBar pct={c.score} color={c.barColor} />
              <span className="text-[13px] font-semibold w-7 text-right" style={{ color: c.barColor }}>{c.score}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </motion.div>
);

const Hero = ({ navigate, heroRef }) => (
  <section ref={heroRef} className="relative min-h-[90vh] flex flex-col px-[80px] pt-[100px] pb-[60px] overflow-hidden border-t border-[#1a1a1a]" style={{ background: '#0a0a0a' }}>
    <AnimatedGrid />
    <Spotlight containerRef={heroRef} />
    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full gap-16 max-w-7xl mx-auto flex-1 h-full">
      {/* Left */}
      <motion.div variants={fadeLeft} initial="hidden" animate="visible" className="flex-1 max-w-[520px] flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-9 text-[12px]"
          style={{ background: '#1a1a1a', borderColor: '#2a2a2a' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          <span className="text-white">AI-Powered Hiring Platform</span>
        </div>
        <h1 className="font-heading leading-[1.15] mb-7 text-[52px]">
          <span className="block text-primary">AI Resume Screening</span>
          <span className="block text-secondary">&amp; Candidate Ranking</span>
          <span className="block text-[40px] text-white mt-2">Hire smarter.</span>
        </h1>
        <p className="text-[15px] text-muted leading-[1.8] mb-9">
          Post a job description and let AI rank every applicant 0–100 with strengths, gaps, and a full summary. Built for IT, banking, healthcare, and HR agencies.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/signup', { state: { role: 'recruiter' } })}
            className="px-6 py-3 rounded-lg bg-primary text-black font-medium text-[14px] border-none cursor-pointer transition-all duration-200 hover:brightness-110">
            I'm a Recruiter — Post Jobs
          </button>
          <button onClick={() => navigate('/signup', { state: { role: 'candidate' } })}
            className="px-6 py-3 rounded-lg bg-transparent text-white text-[14px] border border-[#333] cursor-pointer transition-all duration-200 hover:border-primary">
            I'm a Candidate — Find Jobs
          </button>
        </div>
      </motion.div>
      {/* Right */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        transition={{ delay: 0.3 }} className="flex-shrink-0 flex items-stretch self-stretch py-10">
        <HeroCard />
      </motion.div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   STATS BAR
   ══════════════════════════════════════════ */
const StatItem = ({ value, suffix, label, sublabel, isString }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCountUp(isString ? 0 : value, inView);
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" whileInView="visible"
      viewport={{ once: true, margin: "-50px" }} className="flex-1 text-center">
      <div className="text-[28px] font-heading text-primary">
        {isString ? value : count.toLocaleString()}{suffix}
      </div>
      <div className="text-[12px] mt-1.5 text-white/70">{label}</div>
      <div className="text-[11px] mt-0.5" style={{ color: '#444' }}>{sublabel}</div>
    </motion.div>
  );
};

const StatsBar = () => (
  <section className="flex flex-col md:flex-row border-t border-[#1a1a1a]" style={{ background: '#0d0d0d', padding: '28px 80px' }}>
    <StatItem value={2000} suffix="+" label="Resumes Screened" sublabel="and counting" />
    <div className="hidden md:block w-px bg-[#2a2a2a] mx-8" />
    <StatItem value={4} suffix="" label="Industries Supported" sublabel="IT, Banking, Healthcare, HR" />
    <div className="hidden md:block w-px bg-[#2a2a2a] mx-8" />
    <StatItem value="0–100" suffix="" label="AI Match Score" sublabel="AI match accuracy" isString />
  </section>
);

/* ══════════════════════════════════════════
   INDUSTRIES
   ══════════════════════════════════════════ */
const IndustriesSection = () => (
  <section id="industries" className="px-[80px] py-[48px] border-t border-[#1a1a1a]" style={{ background: '#0a0a0a' }}>
    <div className="max-w-7xl mx-auto w-full">
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
      <p className="text-[11px] tracking-[0.1em] uppercase mb-3" style={{ color: '#444' }}>BUILT FOR EVERY INDUSTRY</p>
      <h2 className="font-heading text-[28px] text-white mb-10">Who uses Rankly</h2>
    </motion.div>
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
      {INDUSTRIES.map((ind) => (
        <motion.div key={ind.title} variants={staggerItem} className="flex">
          <GlowingCard className="w-full">
            <div className="p-6 flex flex-col" style={{ minHeight: 220 }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-0"
                style={{ background: ind.iconBg }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: ind.iconColor }}>{ind.icon}</svg>
              </div>
              <h3 className="text-[16px] text-white font-medium mt-4">{ind.title}</h3>
              <p className="text-[13px] text-[#666] leading-[1.6] mt-2 flex-1">{ind.desc}</p>
              <span className="text-[11px] tracking-wide px-2.5 py-1 rounded-full self-start mt-5"
                style={{ background: 'rgba(255,255,255,0.03)', color: '#555', border: '1px solid #1e1e1e' }}>
                {ind.tag}
              </span>
            </div>
          </GlowingCard>
        </motion.div>
      ))}
    </motion.div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   HOW IT WORKS
   ══════════════════════════════════════════ */
const HowItWorks = () => (
  <section id="how-it-works" className="px-[80px] py-[48px] border-t border-[#1a1a1a]" style={{ background: '#0d0d0d' }}>
    <div className="max-w-7xl mx-auto w-full">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
        <p className="text-[11px] tracking-[0.1em] uppercase mb-3" style={{ color: '#444' }}>SIMPLE WORKFLOW</p>
        <h2 className="font-heading text-[28px] text-white mb-8">How Rankly works</h2>
      </motion.div>
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        className="relative grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {/* Dashed connector line */}
        <div className="hidden md:block absolute top-[42px] left-[20%] right-[20%] border-t border-dashed border-[#2a2a2a] pointer-events-none" />
        {STEPS.map((s) => (
          <motion.div key={s.num} variants={staggerItem} className="flex">
            <GlowingCard className="w-full">
              <div className="p-7 flex flex-col" style={{ minHeight: 180 }}>
                <div className="w-9 h-9 rounded-full bg-primary text-black flex items-center justify-center text-[14px] font-semibold mb-4 relative z-10">
                  {s.num}
                </div>
                <h3 className="text-[14px] text-white font-medium mb-1.5">{s.title}</h3>
                <p className="text-[12px] text-muted leading-relaxed flex-1">{s.desc}</p>
              </div>
            </GlowingCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   BOTTOM CTA
   ══════════════════════════════════════════ */
const BottomCTA = ({ navigate }) => (
  <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
    className="border-t border-[#1a1a1a] px-[80px] py-[48px]"
    style={{ background: '#0a0a0a' }}>
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
    <div>
      <h2 className="font-heading text-[22px] text-white mb-1">Ready to eliminate manual shortlisting?</h2>
      <p className="text-[13px] text-muted">Works for IT, banking, healthcare, and recruitment agencies.</p>
    </div>
    <div className="flex gap-3">
      <button onClick={() => navigate('/signup')}
        className="px-6 py-3 rounded-lg bg-primary text-black font-medium text-[14px] border-none cursor-pointer transition-all duration-200 hover:brightness-110">
        Create free account
      </button>
      <button onClick={() => navigate('/login')}
        className="px-6 py-3 rounded-lg bg-transparent text-white text-[14px] border border-[#333] cursor-pointer transition-all duration-200 hover:border-primary">
        Login
      </button>
    </div>
    </div>
  </motion.section>
);

/* ══════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════ */
const Footer = ({ navigate }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1a1a1a]" style={{ background: '#0d0d0d' }}>
      <div className="max-w-7xl mx-auto px-[80px] py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Left column (40%) */}
        <div className="w-full md:w-[40%]">
          <span className="font-heading text-2xl tracking-tight cursor-pointer inline-block">
            <span className="text-primary">R</span><span className="text-white">ankly</span>
          </span>
          <p className="text-[13px] text-[#666] mt-2">
            AI-powered resume screening and candidate ranking.
          </p>
        </div>

        {/* Right column (60%) */}
        <div className="w-full md:w-[60%] flex justify-start md:justify-end gap-8">
          <button onClick={() => document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' })} className="text-[13px] text-[#555] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">For Recruiters</button>
          <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="text-[13px] text-[#555] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">For Candidates</button>
          <button onClick={() => navigate('/login')} className="text-[13px] text-[#555] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">Login</button>
          <button onClick={() => navigate('/signup')} className="text-[13px] text-[#555] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">Sign Up</button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a1a1a] py-4 px-[80px]">
        <p className="text-[11px] text-[#333] text-center max-w-7xl mx-auto">
          © 2026 Rankly. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

/* ══════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════ */
const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  return (
    <div className="bg-bg min-h-screen text-white font-body">
      <Navbar navigate={navigate} />
      <Hero navigate={navigate} heroRef={heroRef} />
      <StatsBar />
      <IndustriesSection />
      <HowItWorks />
      <BottomCTA navigate={navigate} />
      <Footer navigate={navigate} />
    </div>
  );
};

export default LandingPage;
