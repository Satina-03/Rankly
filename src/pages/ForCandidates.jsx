import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
const zoomInCTA = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } } };

const NAV_LINKS = [
  { label: 'For Recruiters', path: '/for-recruiters' },
  { label: 'For Candidates', path: '/for-candidates' },
  { label: 'Browse Jobs', path: '/jobs' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Industries', path: '/' },
];

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
    if (location.pathname === '/for-candidates') {
      setActive('For Candidates');
    }
  }, [location.pathname]);

  const handleNavClick = (l) => {
    if (l.id === 'how-it-works') {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      setActive(l.label);
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
      
      <div className="flex items-center">
        <span className="font-heading text-[22px] tracking-tight cursor-pointer flex items-center mr-6" onClick={() => { navigate('/'); window.scrollTo(0, 0); }}>
          <span className="w-2 h-2 bg-primary rounded-[3px] mr-[6px] inline-block" />
          <span className="text-primary">R</span><span className="text-white">ankly</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-[40px]">
        {location.pathname === '/for-candidates' && (
          <button onClick={() => { navigate('/'); window.scrollTo(0, 0); }} className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] text-[12px] px-[14px] py-[6px] rounded-[20px] cursor-pointer hover:border-[#00C9A7] hover:text-[#00C9A7] transition-colors">
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
            {active === l.label && <span className="absolute -bottom-[10px] w-1 h-1 rounded-full bg-[#00C9A7]" />}
          </div>
        ))}
      </div>
      
      {/* User Menu */}
      <UserMenu />
    </motion.nav>
  );
};

const Footer = ({ navigate }) => {
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
          <button onClick={() => navigate('/for-recruiters')} className="text-[13px] text-[#555] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">For Recruiters</button>
          <button onClick={() => window.scrollTo(0,0)} className="text-[13px] text-[#555] hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">For Candidates</button>
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

const ForCandidates = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen text-white font-sans selection:bg-[#00C9A7]/30" style={{ background: '#0a0a0a' }}>
      <Navbar navigate={navigate} />

      {/* Section 1: Hero */}
      <section id="hero" className="flex flex-col lg:flex-row items-center justify-between gap-16 max-w-7xl mx-auto px-[80px] py-[80px] min-h-[90vh]">
        {/* Left */}
        <motion.div variants={fadeLeftHero} initial="hidden" animate="visible" className="flex-1 relative z-10">
          <div className="absolute -top-[100px] -left-[100px] w-[500px] h-[500px] rounded-full z-0 blur-[80px] pointer-events-none" style={{ background: 'rgba(0,201,167,0.04)' }} />
          
          <div className="relative z-10">
            <div className="inline-flex items-center px-[16px] py-[7px] rounded-[20px] mb-8"
              style={{ background: 'rgba(0,201,167,0.12)', border: '1px solid rgba(0,201,167,0.4)', color: '#00C9A7', fontSize: '13px', fontWeight: 500 }}>
              <span className="w-[7px] h-[7px] rounded-full bg-[#00C9A7] mr-[8px] animate-[pulse_2s_infinite]" />
              For Candidates
            </div>
            <h1 className="font-heading text-[68px] leading-[1.05] mb-6">
              <span className="block text-white">Find Jobs That</span>
              <span className="block text-white">Actually Match</span>
              <span className="block text-[#00C9A7]" style={{ textShadow: '0 0 60px rgba(0,201,167,0.4)' }}>Your Skills.</span>
            </h1>
            <p className="text-[16px] text-[#777] leading-[1.9] max-w-[460px]">
              Upload your resume once and let AI match you to the right jobs. See exactly how you score against every role — with a full breakdown of your strengths and gaps before you even apply.
            </p>
            <div className="flex gap-[12px] mt-[32px]">
              <button onClick={() => navigate('/jobs')}
                className="px-[32px] py-[15px] rounded-[12px] text-black font-bold text-[15px] border-none cursor-pointer transition-all hover:-translate-y-[2px] flex items-center justify-center group"
                style={{ background: 'linear-gradient(135deg, #00C9A7, #00a88a)', boxShadow: '0 8px 32px rgba(0,201,167,0.35)' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,201,167,0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,201,167,0.35)'}>
                Browse Open Jobs <span className="ml-1 font-sans group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-[32px] py-[15px] rounded-[12px] bg-transparent border border-[#333] text-[#888] text-[15px] cursor-pointer transition-all hover:border-[#00C9A7] hover:text-[#00C9A7]">
                See How It Works &darr;
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right */}
        <div className="w-full lg:w-[420px] flex flex-col gap-[16px] shrink-0">
          {/* Card 1 */}
          <motion.div variants={fadeRightCard1} initial="hidden" animate="visible" className="p-[24px] rounded-[16px] flex flex-col" 
            style={{ background: '#141414', border: '1px solid #252525', borderTop: '2px solid #00C9A7', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[11px] uppercase text-[#555] font-medium tracking-wide">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                YOUR AI SCORE
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(0,201,167,0.1)', color: '#00C9A7' }}>Instant Result</span>
            </div>
            
            <div className="flex flex-col items-center justify-center py-[16px] border-b border-[#1e1e1e] mb-[16px]">
              <div className="font-heading text-[72px] text-[#00C9A7] leading-none">84</div>
              <div className="text-[13px] text-[#666] mt-[4px]">Resume Match Score</div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between mb-1.5"><span className="text-[12px] text-[#666]">Job Match</span><span className="text-[14px] text-[#00C9A7] font-semibold">84%</span></div>
                <div className="h-[8px] bg-[#1e1e1e] rounded-[4px] overflow-hidden relative">
                  <motion.div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full" animate={{ translateX: ['-100%', '100%'] }} transition={{ duration: 1.5, ease: 'linear' }} />
                  <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} transition={{ duration: 1.2, delay: 0.8 }} className="h-full rounded-[4px] bg-[#00C9A7]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5"><span className="text-[12px] text-[#666]">Skills Matched</span><span className="text-[14px] text-[#F5A623] font-semibold">71%</span></div>
                <div className="h-[8px] bg-[#1e1e1e] rounded-[4px] overflow-hidden relative">
                  <motion.div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full" animate={{ translateX: ['-100%', '100%'] }} transition={{ duration: 1.5, ease: 'linear', delay: 0.2 }} />
                  <motion.div initial={{ width: 0 }} animate={{ width: '71%' }} transition={{ duration: 1.2, delay: 1.0 }} className="h-full rounded-[4px] bg-[#F5A623]" />
                </div>
              </div>
            </div>

            <div className="text-[12px] text-[#555] border-t border-[#1e1e1e] pt-[12px] mt-[4px]">Applied to: Senior Frontend Developer &middot; TCS</div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={fadeRightCard2} initial="hidden" animate="visible" className="p-[24px] rounded-[16px] flex flex-col" 
            style={{ background: '#141414', border: '1px solid #252525', borderTop: '2px solid #F5A623', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] uppercase text-[#555] font-medium tracking-wide">AI FEEDBACK</div>
              <span className="px-2 py-0.5 rounded-full text-[11px]" style={{ background: 'rgba(245,166,35,0.12)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>Personalized</span>
            </div>
            
            <div className="grid grid-cols-2 gap-[12px]">
              <div className="flex flex-col">
                <div className="text-[13px] text-[#00C9A7] font-semibold mb-[8px]">✓ Strengths</div>
                <div className="flex flex-wrap">
                  {['React', 'TypeScript', 'AWS'].map(tag => (
                    <span key={tag} className="m-[3px] px-[14px] py-[6px] text-[12px] rounded-[8px]" 
                      style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.25)', color: '#00C9A7' }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-[13px] text-[#f85149] font-semibold mb-[8px]">✗ Gaps</div>
                <div className="flex flex-wrap">
                  {['GraphQL', 'Testing'].map(tag => (
                    <span key={tag} className="m-[3px] px-[14px] py-[6px] text-[12px] rounded-[8px]" 
                      style={{ background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.25)', color: '#f85149' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#1e1e1e] pt-[12px] mt-[12px]">
              <p className="text-[13px] text-[#666] leading-[1.7] italic">
                "Strong profile overall. Upskill in GraphQL to significantly improve your match rate."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: The Problem + Solution */}
      <section className="border-t border-[#1a1a1a] px-[80px] py-[80px]" style={{ background: '#0d0d0d' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <motion.div variants={fadeLeftSec2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="w-full md:w-[48%]">
            <h2 className="font-heading text-[36px] text-white mb-0">The Job Hunt Problem</h2>
            <span className="block w-[40px] h-[3px] bg-[#F5A623] rounded-[2px] mt-[10px] mb-[20px]" />
            <p className="text-[15px] text-[#777] leading-[1.9]">
              Sending out dozens of applications and hearing nothing back is exhausting. Most candidates never know why they got rejected — or what they could have done differently.
            </p>
            <h2 className="font-heading text-[32px] text-white mt-[32px] mb-0">The Rankly Advantage</h2>
            <span className="block w-[40px] h-[3px] bg-[#F5A623] rounded-[2px] mt-[10px] mb-[20px]" />
            <p className="text-[15px] text-[#777] leading-[1.9]">
              Rankly shows you exactly how your resume scores against any job description — before you apply. Know your strengths, fix your gaps, and only apply to roles where you genuinely have a strong match.
            </p>
            <div className="flex flex-wrap gap-[10px] mt-[24px]">
              {['Know your score', 'See your gaps', 'Apply smarter', 'Track applications'].map(pill => (
                <span key={pill} className="text-[13px] text-[#aaa] bg-[#161616] border border-[#2a2a2a] px-[18px] py-[10px] rounded-[8px] transition-all duration-200 hover:border-[#00C9A7] hover:text-[#00C9A7] hover:bg-[rgba(0,201,167,0.05)] cursor-pointer">
                  {pill}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeRightSec2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} 
            className="w-full md:w-[48%] rounded-[20px] p-[36px]" style={{ background: '#111111', border: '1px solid #222', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
            <div className="flex items-center gap-2 mb-[16px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#00C9A7]"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
              <span className="text-[11px] text-[#00C9A7] font-medium uppercase tracking-[0.08em]">BUILT FOR CANDIDATES</span>
            </div>
            <h3 className="font-heading text-[34px] text-white mb-[24px]">Know Before You Apply</h3>
            <div className="flex flex-col">
              {[
                { title: 'See Your Score Instantly', desc: 'Get an AI match score for any job before you apply.' },
                { title: 'Understand Your Gaps', desc: 'Know exactly which skills to improve to get shortlisted.' },
                { title: 'Track All Applications', desc: 'See your application status and score in one dashboard.' }
              ].map((item) => (
                <div key={item.title} className="flex gap-[16px] items-start p-[20px] px-[24px] mb-[12px] bg-[#1a1a1a] border border-[#242424] rounded-[12px] group transition-all duration-250 hover:border-[rgba(0,201,167,0.35)] hover:bg-[rgba(0,201,167,0.03)] hover:shadow-[0_0_20px_rgba(0,201,167,0.06)] cursor-default">
                  <div className="w-[38px] h-[38px] rounded-full bg-[rgba(0,201,167,0.1)] border border-[rgba(0,201,167,0.3)] flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[15px] text-white font-medium">{item.title}</h4>
                    <p className="text-[13px] text-[#666] mt-[4px] leading-[1.7]">{item.desc}</p>
                  </div>
                  <div className="ml-auto text-[#333] group-hover:text-[#00C9A7] transition-colors duration-200 self-center shrink-0 text-[16px]">
                    &rarr;
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section id="how-it-works" className="px-[80px] py-[80px] border-t border-[#1a1a1a]" style={{ background: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto w-full">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mb-[40px]">
            <div className="text-[#00C9A7] text-[11px] uppercase tracking-[0.1em] mb-[8px] font-medium">SIMPLE 3-STEP PROCESS</div>
            <h2 className="font-heading text-[36px] text-white mb-0">How Rankly works for candidates</h2>
            <div className="w-[40px] h-[3px] bg-[#F5A623] rounded-[2px] mt-[12px]" />
          </motion.div>
          <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            className="relative grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            <div className="hidden md:block absolute top-[49px] border-t border-dashed border-[#2a2a2a] z-0" style={{ width: 'calc(100% - 80px)', left: '40px' }} />
            {[
              { num: 1, title: 'Browse Open Jobs', desc: 'Explore jobs posted by top companies across IT, banking, healthcare, and HR.', pill: 'IT · Banking · Healthcare · HR' },
              { num: 2, title: 'Upload Your Resume', desc: 'Upload your PDF resume and apply to any role with one click. No forms, no hassle.', pill: 'PDF Upload · One Click Apply' },
              { num: 3, title: 'Get Your AI Score', desc: 'Instantly receive your match score with a full breakdown of strengths and gaps.', pill: 'Score · Strengths · Gaps' }
            ].map((s) => (
              <motion.div key={s.num} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="flex z-10">
                <div className="w-full bg-[#111111] border border-[#222222] rounded-[16px] px-[24px] py-[28px] relative overflow-hidden transition-all duration-250 hover:border-[rgba(0,201,167,0.4)] hover:shadow-[0_0_30px_rgba(0,201,167,0.08)] flex flex-col">
                  <div className="w-[42px] h-[42px] rounded-full bg-[rgba(0,201,167,0.12)] border border-[rgba(0,201,167,0.35)] text-[#00C9A7] flex items-center justify-center text-[15px] font-semibold mb-[20px]">
                    {s.num}
                  </div>
                  <h3 className="font-heading text-[17px] text-white mb-[10px] font-medium">{s.title}</h3>
                  <p className="text-[14px] text-[#666] leading-[1.75] flex-1">{s.desc}</p>
                  <div className="mt-[20px]">
                    <span className="text-[11px] text-[#666] bg-[#1a1a1a] border border-[#2a2a2a] px-[12px] py-[5px] rounded-[20px] inline-block transition-colors duration-200 hover:border-[#00C9A7] hover:text-[#00C9A7] cursor-default">{s.pill}</span>
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
          className="max-w-7xl mx-auto rounded-[20px] px-[64px] py-[56px] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(0,201,167,0.08) 0%, transparent 60%), #0d1f1a', border: '1px solid rgba(0,201,167,0.2)' }}>
          
          <div className="relative z-10 w-full md:w-auto">
            <div className="inline-flex items-center gap-[6px] px-[14px] py-[6px] rounded-[20px] mb-[20px]" style={{ background: 'rgba(0,201,167,0.1)', color: '#00C9A7', border: '1px solid rgba(0,201,167,0.25)', fontSize: '12px' }}>
              <span className="text-[#00C9A7]">★</span> Find Your Next Role
            </div>
            <h2 className="font-heading text-[40px] text-white font-medium leading-[1.15] mb-[14px]">Apply smarter. Get shortlisted faster.</h2>
            <p className="text-[15px] text-[#9ca3af] leading-[1.8] max-w-[500px]">
              Stop guessing. Know your score, fix your gaps, and apply only where you have a genuine chance.
            </p>
          </div>
          <div className="flex flex-col gap-[12px] relative z-10">
            <button onClick={() => navigate('/jobs')} 
              className="w-[220px] px-[28px] py-[14px] rounded-[10px] text-[#000] font-bold text-[14px] border-none cursor-pointer transition-all hover:-translate-y-[1px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00C9A7, #00a88a)', boxShadow: '0 4px 20px rgba(0,201,167,0.3)' }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,201,167,0.45)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,201,167,0.3)'}>
              Browse Open Jobs &rarr;
            </button>
            <button onClick={() => navigate('/login')} 
              className="w-[220px] px-[28px] py-[14px] rounded-[10px] bg-transparent border border-[#374151] text-[#9ca3af] text-[14px] cursor-pointer hover:border-[#00C9A7] hover:text-white transition-colors duration-200">
              Log in
            </button>
          </div>
        </motion.div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
};

export default ForCandidates;
