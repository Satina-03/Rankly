import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserMenu from '../components/ui/UserMenu';

// --- Shared Utilities & Variants ---
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const fadeLeftHero = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } };
const fadeRightCard1 = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } } };
const fadeRightCard2 = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.35 } } };
const fadeLeftSec2 = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } };
const fadeRightSec2 = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } };
const fadeDown = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const staggerSteps = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const staggerStepItem = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const zoomInCTA = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } } };

// CountUp Hook/Component
const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return <>{count}</>;
};

const NAV_LINKS = [
  { label: 'For Recruiters', path: '/for-recruiters' },
  { label: 'For Candidates', path: '/for-candidates' },
  { label: 'Browse Jobs', path: '/jobs' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Industries', path: '/#industries' },
];

const Navbar = ({ navigate }) => {
  const [active, setActive] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id, path) => {
    if (path) {
      if (path === '/') {
        navigate('/');
        window.scrollTo(0, 0);
      } else {
        navigate(path);
      }
      return;
    }
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <motion.nav variants={fadeDown} initial="hidden" animate="visible"
      className={`sticky top-0 left-0 right-0 z-50 flex items-center justify-between h-[68px] px-[80px] border-b border-[#222222] transition-shadow duration-300 ${isScrolled ? 'shadow-md shadow-black/20' : ''}`}
      style={{ background: 'rgba(17,17,17,0.85)', backdropFilter: 'blur(12px)' }}>
      
      {/* Logo */}
      <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }} className="flex items-center">
        <span className="font-heading text-[22px] tracking-tight flex items-center mr-6">
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
            <button onClick={() => scrollTo(l.id, l.path)}
              className="text-[14px] font-normal bg-transparent border-none cursor-pointer transition-colors duration-200 p-0"
              style={{ color: active === l.id ? '#fff' : '#888' }}
              onMouseEnter={(e) => (e.target.style.color = '#fff')}
              onMouseLeave={(e) => { if (active !== l.id) e.target.style.color = '#888'; }}>
              {l.label}
            </button>
            {active === l.id && <span className="absolute -bottom-[10px] w-1 h-1 rounded-full bg-primary" />}
          </div>
        ))}
      </div>
      
      {/* User Menu */}
      <UserMenu />
    </motion.nav>
  );
};

const Footer = ({ navigate }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1a1a1a]" style={{ background: '#0d0d0d' }}>
      <div className="max-w-7xl mx-auto px-[80px] py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="w-full md:w-[40%]">
          <span className="font-heading text-2xl tracking-tight cursor-pointer inline-block" onClick={() => navigate('/')}>
            <span className="text-primary">R</span><span className="text-white">ankly</span>
          </span>
          <p className="text-[13px] text-[#666] mt-2">
            AI-powered resume screening and candidate ranking.
          </p>
        </div>

        <div className="w-full md:w-[60%] flex justify-start md:justify-end gap-8">
          <button onClick={() => window.scrollTo(0,0)} className="text-[13px] text-[#555] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">For Recruiters</button>
          <button onClick={() => navigate('/')} className="text-[13px] text-[#555] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">For Candidates</button>
          <button onClick={() => navigate('/login')} className="text-[13px] text-[#555] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">Login</button>
          <button onClick={() => navigate('/signup')} className="text-[13px] text-[#555] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">Sign Up</button>
        </div>
      </div>

      <div className="border-t border-[#1a1a1a] py-4 px-[80px]">
        <p className="text-[11px] text-[#333] text-center max-w-7xl mx-auto">
          © 2026 Rankly. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

// --- Page Components ---
const ForRecruiters = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen text-white font-sans selection:bg-primary/30" style={{ background: '#0a0a0a' }}>
      <Navbar navigate={navigate} />

      {/* Section 1: Hero */}
      <section id="hero" className="flex flex-col lg:flex-row items-center justify-between gap-16 max-w-7xl mx-auto px-[80px] py-[80px]">
        {/* Left */}
        <motion.div variants={fadeLeftHero} initial="hidden" animate="visible" className="flex-1 relative z-10">
          <div className="absolute -top-[100px] -left-[100px] w-[500px] h-[500px] rounded-full z-0 blur-[80px] pointer-events-none" style={{ background: 'rgba(245,166,35,0.04)' }} />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
              style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.3)', boxShadow: '0 0 20px rgba(245,166,35,0.15)', color: '#F5A623' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[13px]">For Recruiters</span>
            </div>
            <h1 className="font-heading text-[64px] leading-[1.05] mb-6">
              <span className="block text-white">Better Hires.</span>
              <span className="block text-white">Zero Manual</span>
              <span className="block text-primary" style={{ textShadow: '0 0 40px rgba(245,166,35,0.3)' }}>Screening.</span>
            </h1>
            <p className="text-[16px] text-[#777] leading-[1.9] max-w-[460px]">
              Transform your recruitment with AI-driven candidate ranking that saves hours of manual work and delivers precision shortlists in minutes — not days.
            </p>
            <div className="flex gap-[12px] mt-[32px]">
              <button onClick={() => navigate('/signup')}
                className="px-[28px] py-[14px] rounded-lg bg-primary text-black font-semibold text-[14px] border-none cursor-pointer transition-colors hover:brightness-110 flex items-center justify-center group">
                Start Hiring Free <span className="ml-1 font-sans group-hover:animate-pulse">&rarr;</span>
              </button>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-[28px] py-[14px] rounded-lg bg-transparent border border-[#333] text-white text-[14px] cursor-pointer transition-colors hover:border-primary hover:text-primary">
                See How It Works &darr;
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right */}
        <div className="w-full lg:w-[420px] flex flex-col gap-[16px] shrink-0">
          <motion.div variants={fadeRightCard1} initial="hidden" animate="visible" className="p-[24px] rounded-[16px] flex flex-col" 
            style={{ background: '#141414', border: '1px solid #252525', borderTop: '2px solid #F5A623', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', minHeight: '260px' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[11px] uppercase text-[#555] font-medium tracking-wide">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                SAMPLE JOB POSTING
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary">Active</span>
            </div>
            <div className="mb-6 flex-1">
              <div className="font-heading text-[64px] text-primary leading-none mb-1"><CountUp end={247} /></div>
              <div className="text-[13px] text-[#666]">Applications received</div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between mb-1.5"><span className="text-[12px] text-[#666]">Avg AI Score</span><span className="text-[12px] text-white font-medium">67/100</span></div>
                <div className="h-[6px] bg-[#222] rounded-[3px] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '67%' }} transition={{ duration: 1.2, delay: 0.8 }} className="h-full rounded-[3px]" style={{ background: 'linear-gradient(90deg, #F5A623, #ffcd6b)' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5"><span className="text-[12px] text-[#666]">Shortlisted</span><span className="text-[12px] text-white font-medium">18 candidates</span></div>
                <div className="h-[6px] bg-[#222] rounded-[3px] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '18%' }} transition={{ duration: 1.2, delay: 1.0 }} className="h-full rounded-[3px]" style={{ background: 'linear-gradient(90deg, #00C9A7, #00e5c0)' }} />
                </div>
              </div>
            </div>
            <div className="text-[11px] text-[#444] border-t border-[#1e1e1e] pt-[12px] mt-[12px]">Posted 2 days ago &middot; Senior Frontend Developer &middot; TCS</div>
          </motion.div>

          <motion.div variants={fadeRightCard2} initial="hidden" animate="visible" className="p-[24px] rounded-[16px] flex flex-col" 
            style={{ background: '#141414', border: '1px solid #252525', borderTop: '2px solid #00C9A7', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', minHeight: '240px' }}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#222]">
              <div className="text-[11px] uppercase text-[#555] font-medium tracking-wide">TOP RANKED CANDIDATES</div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-secondary/10 text-secondary">AI Ranked</span>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-3 py-[12px] px-2 -mx-2 rounded-lg group transition-colors duration-200 hover:bg-[rgba(255,255,255,0.02)] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-secondary -translate-x-[3px] group-hover:translate-x-0 transition-transform duration-200" />
                <span className="text-[10px] w-5 h-5 rounded-md flex items-center justify-center font-medium bg-primary/10 text-primary">1</span>
                <span className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 bg-primary/10 text-primary">AM</span>
                <div className="flex-1 text-[13px] text-white font-medium">Arjun M.</div>
                <div className="w-[90px] h-[5px] bg-[#222] rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1, delay: 1 }} className="h-full bg-secondary rounded-full" /></div>
                <span className="text-[14px] font-semibold text-secondary min-w-[20px] text-right">92</span>
              </div>
              <div className="flex items-center gap-3 py-[12px] px-2 -mx-2 rounded-lg group transition-colors duration-200 hover:bg-[rgba(255,255,255,0.02)] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-secondary -translate-x-[3px] group-hover:translate-x-0 transition-transform duration-200" />
                <span className="text-[10px] w-5 h-5 rounded-md flex items-center justify-center font-medium bg-white/5 text-[#888]">2</span>
                <span className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 bg-secondary/10 text-secondary">SK</span>
                <div className="flex-1 text-[13px] text-white font-medium">Sneha K.</div>
                <div className="w-[90px] h-[5px] bg-[#222] rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ duration: 1, delay: 1.1 }} className="h-full bg-secondary rounded-full" /></div>
                <span className="text-[14px] font-semibold text-secondary min-w-[20px] text-right">78</span>
              </div>
              <div className="flex items-center gap-3 py-[12px] px-2 -mx-2 rounded-lg group transition-colors duration-200 hover:bg-[rgba(255,255,255,0.02)] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary -translate-x-[3px] group-hover:translate-x-0 transition-transform duration-200" />
                <span className="text-[10px] w-5 h-5 rounded-md flex items-center justify-center font-medium bg-white/5 text-[#888]">3</span>
                <span className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 bg-purple-500/10 text-purple-400">RS</span>
                <div className="flex-1 text-[13px] text-white font-medium">Rohan S.</div>
                <div className="w-[90px] h-[5px] bg-[#222] rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '61%' }} transition={{ duration: 1, delay: 1.2 }} className="h-full bg-primary rounded-full" /></div>
                <span className="text-[14px] font-semibold text-primary min-w-[20px] text-right">61</span>
              </div>
            </div>
            <div className="text-[10px] text-[#444] font-mono text-center mt-2 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
              Ranked by AWS Bedrock AI
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: The Problem + Solution */}
      <section className="border-t border-[#1a1a1a] px-[80px] py-[80px]" style={{ background: '#0d0d0d' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <motion.div variants={fadeLeftSec2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="w-full md:w-[48%]">
            <h2 className="font-heading text-[36px] text-white">The Screening Bottleneck</h2>
            <div className="w-[40px] h-[3px] bg-primary rounded-[2px] mt-[12px] mb-[20px]" />
            <p className="text-[15px] text-[#777] leading-[1.9]">
              Manual resume screening is the slowest part of hiring. Great candidates get buried in the pile, and hiring managers spend 70% of their time on unqualified applicants.
            </p>
            <h2 className="font-heading text-[32px] text-white mt-[32px]">The Rankly Advantage</h2>
            <div className="w-[40px] h-[3px] bg-primary rounded-[2px] mt-[12px] mb-[20px]" />
            <p className="text-[15px] text-[#777] leading-[1.9]">
              Rankly uses AWS Bedrock AI to analyze every resume against your job description and rank candidates 0–100 with a full breakdown of strengths and gaps. Go from job post to shortlist in minutes.
            </p>
            <div className="flex flex-wrap gap-[10px] mt-[24px]">
              {[
                { label: 'Faster screening', icon: '⚡' },
                { label: 'AI candidate matching', icon: '🎯' },
                { label: 'Instant shortlists', icon: '✓' },
                { label: 'Strength & gap analysis', icon: '📊' }
              ].map(pill => (
                <span key={pill.label} className="text-[13px] text-[#ccc] bg-[#161616] border border-[#2a2a2a] px-[18px] py-[10px] rounded-[8px] font-normal transition-all duration-200 hover:border-primary hover:text-primary hover:bg-[rgba(245,166,35,0.05)] cursor-default flex items-center gap-2">
                  <span>{pill.icon}</span> {pill.label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeRightSec2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} 
            className="w-full md:w-[48%] rounded-[20px] p-[36px]" style={{ background: '#111111', border: '1px solid #222', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
            <div className="flex items-center gap-2 mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-secondary"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
              <span className="text-[11px] text-secondary font-medium uppercase tracking-[0.08em]">BUILT FOR SPEED</span>
            </div>
            <h3 className="font-heading text-[34px] text-white mb-[24px]">Smart Decisions</h3>
            <div className="flex flex-col">
              {[
                { title: 'For HR Teams', desc: 'Reduce screening volume by 80% with automated AI scoring.' },
                { title: 'For Recruiters', desc: 'Instantly identify top candidates across all your applicants.' },
                { title: 'For Hiring Managers', desc: 'Make decisions based on verified skill insights, not gut feel.' }
              ].map((item) => (
                <div key={item.title} className="flex gap-[16px] items-start p-[20px] mb-[12px] bg-[#161616] border border-[#222] rounded-[12px] group transition-all duration-250 hover:border-[#00C9A7]/40 hover:shadow-[0_0_20px_rgba(0,201,167,0.05)]">
                  <div className="w-[36px] h-[36px] rounded-full bg-[#00C9A7]/10 border border-[#00C9A7]/30 text-secondary flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[15px] text-white font-medium">{item.title}</h4>
                    <p className="text-[13px] text-[#666] mt-[4px] leading-[1.6]">{item.desc}</p>
                  </div>
                  <div className="ml-auto text-[#333] group-hover:text-secondary transition-colors duration-250 self-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section id="how-it-works" className="px-[80px] py-[72px] border-t border-[#1a1a1a]" style={{ background: '#0d0d0d' }}>
        <div className="max-w-7xl mx-auto w-full">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mb-[40px]">
            <div className="text-secondary text-[11px] uppercase tracking-[0.1em] mb-[8px] font-medium">SIMPLE 3-STEP PROCESS</div>
            <h2 className="font-heading text-[36px] text-white mb-0">How Rankly works for recruiters</h2>
            <div className="w-[40px] h-[3px] bg-primary rounded-[2px] mt-[12px]" />
          </motion.div>
          <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            className="relative grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            {/* Dashed connector line */}
            <div className="hidden md:block absolute top-[48px] border-t border-dashed border-[#2a2a2a] z-0" style={{ width: 'calc(100% - 80px)', left: '40px' }} />
            {[
              { num: 1, title: 'Post JD', desc: 'Post your job title, required skills, and experience level. Takes less than 2 minutes.', pill: 'Job Title + Skills + Experience' },
              { num: 2, title: 'Candidates Apply', desc: 'Candidates browse your listing and upload their resume PDF directly through Rankly.', pill: 'PDF Upload · Instant Parse' },
              { num: 3, title: 'AI Rankings Ready', desc: 'Every resume is scored 0–100 with a full breakdown of strengths, gaps, and a summary.', pill: 'Score · Strengths · Gaps' }
            ].map((s) => (
              <motion.div key={s.num} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="flex z-10">
                <div className="w-full bg-[#111111] border border-[#222222] rounded-[16px] px-[24px] py-[28px] relative overflow-hidden transition-all duration-250 hover:border-primary/35 hover:shadow-[0_0_24px_rgba(245,166,35,0.06)] flex flex-col">
                  <div className="w-[40px] h-[40px] rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center text-[15px] font-semibold mb-[20px]">
                    {s.num}
                  </div>
                  <h3 className="font-heading text-[17px] text-white mb-[10px] font-medium">{s.title}</h3>
                  <p className="text-[14px] text-[#666] leading-[1.75] flex-1">{s.desc}</p>
                  <div className="mt-[20px]">
                    <span className="text-[11px] text-[#555] bg-[#1a1a1a] border border-[#2a2a2a] px-[12px] py-[5px] rounded-[20px] inline-block">{s.pill}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 4: CTA Banner */}
      <section className="px-[80px] py-[80px] border-t border-[#1a1a1a]" style={{ background: '#0d0d0d' }}>
        <motion.div variants={zoomInCTA} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          className="max-w-7xl mx-auto rounded-[24px] px-[64px] py-[56px] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f1929 0%, #111827 100%)', border: '1px solid #1e3a5f' }}>
          
          <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] rounded-full bg-[#58a6ff]/[0.04] pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] mb-4" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Start Hiring Faster
            </div>
            <h2 className="font-heading text-[42px] text-white leading-[1.1]">Hire faster with better clarity.</h2>
            <p className="text-[16px] text-[#6b7280] mt-[12px] leading-[1.8] max-w-[500px]">
              Use AI to reduce noise, improve candidate quality, and make confident hiring decisions.
            </p>
          </div>
          <div className="flex flex-col gap-[12px] relative z-10">
            <button onClick={() => navigate('/signup')} className="w-[220px] px-[28px] py-[14px] rounded-[10px] bg-primary text-black font-semibold text-[14px] border-none cursor-pointer hover:brightness-110 flex items-center justify-center">
              Start Hiring Free &rarr;
            </button>
            <button onClick={() => navigate('/login')} className="w-[220px] px-[28px] py-[14px] rounded-[10px] bg-transparent border border-[#374151] text-[#9ca3af] text-[14px] cursor-pointer hover:border-primary hover:text-white transition-colors duration-200">
              Log in
            </button>
          </div>
        </motion.div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
};

export default ForRecruiters;
