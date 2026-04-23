import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_RECRUITER_JOBS, MOCK_APPLICANTS_BY_JOB } from '../../mockData';
import { fetchApplicants, fetchAllJobs, getDownloadUrl } from '../../api';
import UserMenu from '../../components/ui/UserMenu';

/* ── Navbar ── */
const NAV_LINKS = [
  { label: 'For Recruiters', path: '/for-recruiters' },
  { label: 'For Candidates', path: '/for-candidates' },
  { label: 'Browse Jobs', path: '/jobs' },
  { label: 'How it works', path: '/#how-it-works' },
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

  const handleNavClick = (l) => {
    if (l.path) {
      if (l.path.startsWith('/#')) {
        navigate('/');
        setTimeout(() => {
          document.getElementById(l.path.substring(2))?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        navigate(l.path);
        window.scrollTo(0, 0);
      }
    }
  };
  
  return (
    <nav className={`sticky top-0 left-0 right-0 z-50 flex items-center justify-between h-[68px] px-[80px] border-b border-[#222222] transition-shadow duration-300 ${isScrolled ? 'shadow-md shadow-black/20' : ''}`}
      style={{ background: 'rgba(17,17,17,0.85)', backdropFilter: 'blur(12px)' }}>
      
      <div className="flex items-center">
        <span className="font-heading text-[22px] tracking-tight cursor-pointer flex items-center mr-6" onClick={() => { navigate('/'); window.scrollTo(0, 0); }}>
          <span className="w-2 h-2 bg-[#F5A623] rounded-[3px] mr-[6px] inline-block" />
          <span className="text-[#F5A623]">R</span><span className="text-white">ankly</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-[40px]">
        {NAV_LINKS.map((l) => (
          <div key={l.label} className="relative flex flex-col items-center">
            <button onClick={() => handleNavClick(l)}
              className="text-[14px] font-normal bg-transparent border-none cursor-pointer transition-colors duration-200 p-0"
              style={{ color: active === l.label ? '#fff' : '#888' }}
              onMouseEnter={(e) => (e.target.style.color = '#fff')}
              onMouseLeave={(e) => { if (active !== l.label) e.target.style.color = '#888'; }}>
              {l.label}
            </button>
            {active === l.label && <span className="absolute -bottom-[10px] w-1 h-1 rounded-full bg-[#F5A623]" />}
          </div>
        ))}
      </div>
      {/* User Menu */}
      <UserMenu />
    </nav>
  );
};

/* ── Candidate Detail Modal ── */
const CandidateDetailModal = ({ candidate, job, onClose }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return '#00C9A7';
    if (score >= 60) return '#F5A623';
    return '#f85149';
  };
  const getScoreBg = (score) => {
    if (score >= 80) return 'rgba(0,201,167,0.1)';
    if (score >= 60) return 'rgba(245,166,35,0.1)';
    return 'rgba(248,81,73,0.1)';
  };
  const getScoreBorder = (score) => {
    if (score >= 80) return 'rgba(0,201,167,0.25)';
    if (score >= 60) return 'rgba(245,166,35,0.25)';
    return 'rgba(248,81,73,0.25)';
  };

  const scoreColor = getScoreColor(candidate.score);
  const [viewingResume, setViewingResume] = useState(false);

  const handleViewResume = async () => {
    if (!candidate.resumeS3Key) {
      alert("No resume file uploaded for this candidate.");
      return;
    }
    setViewingResume(true);
    try {
      const { data } = await getDownloadUrl(candidate.resumeS3Key);
      window.open(data.downloadUrl, '_blank');
    } catch (error) {
      console.error("Error fetching download URL:", error);
      alert("Failed to load resume. Check S3 permissions/CORS.");
    } finally {
      setViewingResume(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-body"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col max-h-[90vh] overflow-y-auto w-[520px] p-[36px_40px] rounded-[20px]"
        style={{ background: '#111111', border: '1px solid #222' }}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold bg-[#1a1a1a] text-[#555]">
                #{candidate.rank}
              </span>
              <h2 className="font-heading text-[24px] text-white m-0">{candidate.name}</h2>
            </div>
            <p className="text-[13px] text-[#666] mt-[4px]">Applied for: {job.title}</p>
          </div>
          <div className="flex items-center gap-4">
            <span style={{ background: getScoreBg(candidate.score), border: `1px solid ${getScoreBorder(candidate.score)}`, color: scoreColor }}
              className="text-[16px] font-bold p-[6px_14px] rounded-[20px]"
            >
              {candidate.score}
            </span>
            <button onClick={onClose}
              className="w-[32px] h-[32px] rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 border border-[#252525] p-0"
              style={{ background: '#1a1a1a', color: '#666', fontSize: '16px' }}
              onMouseEnter={(e) => { e.target.style.borderColor = '#f85149'; e.target.style.color = '#f85149'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = '#252525'; e.target.style.color = '#666'; }}
            >✕</button>
          </div>
        </div>

        <div className="my-[20px] border-t border-[#1e1e1e]" />

        {/* Contact Info */}
        <div>
          <div className="text-[11px] uppercase text-[#555] tracking-[0.08em] mb-[14px]">CONTACT INFORMATION</div>
          <div className="flex items-center gap-[12px] py-[10px] border-b border-[#1a1a1a]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span className="text-[12px] text-[#555] min-w-[80px]">Email</span>
            <span className="text-[13px] text-white">{candidate.email}</span>
          </div>
          <div className="flex items-center gap-[12px] py-[10px] border-b border-[#1a1a1a]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span className="text-[12px] text-[#555] min-w-[80px]">Phone</span>
            <span className="text-[13px] text-white">{candidate.phone}</span>
          </div>
          <div className="flex items-center gap-[12px] py-[10px] border-b border-[#1a1a1a]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span className="text-[12px] text-[#555] min-w-[80px]">Applied</span>
            <span className="text-[13px] text-white">{candidate.appliedDate}</span>
          </div>
          
          {/* View Resume Button */}
          <button 
            onClick={handleViewResume}
            disabled={viewingResume}
            className="w-full mt-[16px] bg-[#1a1a1a] border border-[#333] text-white text-[13px] font-medium p-[10px] rounded-[8px] cursor-pointer transition-all hover:border-primary hover:bg-[rgba(245,166,35,0.05)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            {viewingResume ? "Generating Link..." : candidate.resumeS3Key ? "View Full Resume" : "No Resume Uploaded"}
          </button>
        </div>

        <div className="my-[16px] border-t border-[#1e1e1e]" />

        {/* AI Score */}
        <div>
          <div className="text-[11px] uppercase text-[#555] tracking-[0.08em] mb-[14px]">AI MATCH SCORE</div>
          <div className="flex flex-col gap-2">
            <div className="font-heading text-[52px] leading-none" style={{ color: scoreColor }}>
              {candidate.score}
            </div>
            <div className="w-full h-[8px] rounded-[4px] bg-[#1e1e1e] overflow-hidden relative">
              <motion.div initial={{ width: 0 }} animate={{ width: `${candidate.score}%` }} transition={{ duration: 1 }} className="h-full rounded-[4px]" style={{ background: scoreColor }} />
              <motion.div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full" animate={{ translateX: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
            </div>
          </div>
        </div>

        <div className="my-[16px] border-t border-[#1e1e1e]" />

        {/* Strengths & Gaps */}
        <div>
          <div className="text-[11px] uppercase text-[#00C9A7] tracking-[0.08em] mb-[10px]">✓ STRENGTHS</div>
          <div className="flex flex-wrap gap-[8px]">
            {candidate.strengths.map((s, i) => (
              <span key={i} className="bg-[rgba(0,201,167,0.08)] border border-[rgba(0,201,167,0.2)] text-[#00C9A7] text-[11px] p-[3px_10px] rounded-[6px]">
                {s}
              </span>
            ))}
          </div>

          <div className="text-[11px] uppercase text-[#f85149] tracking-[0.08em] mb-[10px] mt-[16px]">✗ GAPS</div>
          <div className="flex flex-wrap gap-[8px]">
            {candidate.gaps.map((g, i) => (
              <span key={i} className="bg-[rgba(248,81,73,0.08)] border border-[rgba(248,81,73,0.2)] text-[#f85149] text-[11px] p-[3px_10px] rounded-[6px]">
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="my-[16px] border-t border-[#1e1e1e]" />

        {/* AI Summary */}
        <div>
          <div className="text-[11px] uppercase text-[#555] tracking-[0.08em] mb-[10px]">AI SUMMARY</div>
          <p className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[10px] p-[16px] text-[14px] text-[#888] italic leading-[1.8] m-0">
            "{candidate.summary}"
          </p>
        </div>

        <button onClick={onClose}
          className="w-full mt-[24px] bg-transparent border border-[#252525] text-[#666] text-[13px] p-[12px] rounded-[10px] cursor-pointer transition-colors duration-200"
          onMouseEnter={(e) => { e.target.style.borderColor = '#F5A623'; e.target.style.color = '#F5A623'; }}
          onMouseLeave={(e) => { e.target.style.borderColor = '#252525'; e.target.style.color = '#666'; }}
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

/* ── Main Component ── */
const ViewApplicants = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch applicants from API
        const applicantsRes = await fetchApplicants(jobId);
        const applicantsData = applicantsRes.data || [];
        // API returns pre-sorted and ranked
        setCandidates(
          applicantsData.map((c, i) => ({ ...c, rank: c.rank || i + 1 }))
        );

        // Fetch job details
        const jobsRes = await fetchAllJobs();
        const foundJob = (jobsRes.data || []).find((j) => j.jobId === jobId);
        setJob(foundJob || MOCK_RECRUITER_JOBS.find((j) => j.jobId === jobId));
      } catch (err) {
        console.error('Failed to fetch from API, using mock data:', err);
        // Fallback to mock data
        setJob(MOCK_RECRUITER_JOBS.find((j) => j.jobId === jobId));
        const rawCandidates = MOCK_APPLICANTS_BY_JOB[jobId] || [];
        setCandidates(
          [...rawCandidates]
            .sort((a, b) => b.score - a.score)
            .map((c, i) => ({ ...c, rank: i + 1 }))
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [jobId]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#00C9A7';
    if (score >= 60) return '#F5A623';
    return '#f85149';
  };

  const highestScore = candidates.length > 0 ? Math.max(...candidates.map(c => c.score)) : 0;
  const avgScore = candidates.length > 0 ? Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length) : 0;

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-white flex flex-col font-body">
        <Navbar navigate={navigate} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-[#F5A623]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-[#666] text-[14px]">Loading applicants...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen text-white flex flex-col font-body">
        <Navbar navigate={navigate} />
        <div className="flex-1 flex items-center justify-center">Job not found</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-body pb-[60px]">
      <Navbar navigate={navigate} />

      <div className="p-[40px_80px]">
        {/* Top Bar */}
        <button onClick={() => navigate('/recruiter/dashboard')}
          className="bg-transparent border-none text-[#666] text-[13px] cursor-pointer flex items-center gap-[6px] mb-[24px] p-0 transition-colors duration-200 hover:text-[#F5A623]"
        >
          &larr; Back to Dashboard
        </button>

        <motion.div initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.4 }}>
          <h1 className="font-heading text-[32px] text-white m-0 mb-[32px]">
            {job.title}
            <div className="text-[13px] text-[#666] mt-[6px] font-sans font-normal flex items-center gap-[8px]">
              {job.company} · {job.location} · {job.workType}
            </div>
            <div className="text-[13px] text-[#555] mt-[4px] font-sans font-normal">
              {candidates.length} candidates applied
            </div>
          </h1>
        </motion.div>

        {/* Stats Strip */}
        <div className="flex flex-row gap-[24px] border-b border-[#1a1a1a] pb-[24px] mb-[32px]">
          <div className="flex flex-col">
            <span className="font-heading text-[20px] text-[#00C9A7] leading-none">{highestScore}</span>
            <span className="text-[11px] text-[#555] mt-[2px]">Highest Score</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-[20px] text-[#F5A623] leading-none">{avgScore}</span>
            <span className="text-[11px] text-[#555] mt-[2px]">Average Score</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-[20px] text-white leading-none">{candidates.length}</span>
            <span className="text-[11px] text-[#555] mt-[2px]">Total Applied</span>
          </div>
        </div>

        {/* Candidate Cards */}
        {candidates.length > 0 ? (
          <div className="flex flex-col gap-[16px]">
            {candidates.map((c, i) => {
              const scoreColor = getScoreColor(c.score);
              let rankStyle = { background: '#1a1a1a', color: '#555' };
              if (c.rank === 1) rankStyle = { background: 'rgba(245,166,35,0.15)', color: '#F5A623' };
              else if (c.rank === 2) rankStyle = { background: 'rgba(180,180,180,0.1)', color: '#888' };
              else if (c.rank === 3) rankStyle = { background: 'rgba(180,120,60,0.15)', color: '#b47840' };

              return (
                <motion.div key={c.candidateId}
                  initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.08 }}
                  className="bg-[#111111] border border-[#1e1e1e] rounded-[16px] p-[24px_28px] flex justify-between items-center gap-[24px] transition-all duration-200"
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#252525'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div className="flex-1">
                    {/* Row 1 */}
                    <div className="flex items-center gap-[14px] mb-[12px]">
                      <div className="w-[32px] h-[32px] rounded-full text-[13px] font-semibold flex-shrink-0 flex items-center justify-center" style={rankStyle}>
                        {c.rank}
                      </div>
                      <div className="font-heading text-[18px] text-white">{c.name}</div>
                      <div className="bg-[#1a1a1a] border border-[#252525] text-[#777] text-[11px] p-[3px_10px] rounded-[20px]">
                        {c.experience}
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="flex flex-wrap gap-[8px] mb-[8px]">
                      <span className="text-[11px] text-[#555] self-center mr-[4px]">Strengths:</span>
                      {c.strengths.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="bg-[rgba(0,201,167,0.08)] border border-[rgba(0,201,167,0.2)] text-[#00C9A7] text-[11px] p-[3px_10px] rounded-[6px]">
                          {s}
                        </span>
                      ))}
                      {c.strengths.length > 4 && <span className="text-[11px] text-[#555] self-center">+{c.strengths.length - 4}</span>}
                    </div>

                    {/* Row 3 */}
                    <div className="flex flex-wrap gap-[8px]">
                      <span className="text-[11px] text-[#555] self-center mr-[4px]">Gaps:</span>
                      {c.gaps.slice(0, 3).map((g, idx) => (
                        <span key={idx} className="bg-[rgba(248,81,73,0.08)] border border-[rgba(248,81,73,0.2)] text-[#f85149] text-[11px] p-[3px_10px] rounded-[6px]">
                          {g}
                        </span>
                      ))}
                      {c.gaps.length > 3 && <span className="text-[11px] text-[#555] self-center">+{c.gaps.length - 3}</span>}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end">
                    {/* Score */}
                    <div className="flex items-baseline gap-[4px]">
                      <span className="font-heading text-[42px] font-semibold leading-none" style={{ color: scoreColor }}>{c.score}</span>
                      <span className="text-[16px] text-[#333] font-heading leading-none">/ 100</span>
                    </div>
                    <div className="w-[120px] h-[6px] bg-[#1e1e1e] rounded-[3px] mt-[6px] mb-[12px] overflow-hidden relative">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${c.score}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full rounded-[3px]" style={{ background: scoreColor }} />
                    </div>

                    <button onClick={() => setSelectedCandidate(c)}
                      className="bg-transparent border border-[#333] text-[#888] text-[12px] p-[8px_16px] rounded-[8px] cursor-pointer whitespace-nowrap transition-all duration-200"
                      onMouseEnter={e => { e.target.style.borderColor = '#F5A623'; e.target.style.color = '#F5A623'; }}
                      onMouseLeave={e => { e.target.style.borderColor = '#333'; e.target.style.color = '#888'; }}
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center mt-[80px]">
            <div className="text-[48px] text-[#333]">📭</div>
            <div className="font-heading text-[20px] text-[#555] mt-[16px]">No applicants yet</div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCandidate && (
          <CandidateDetailModal 
            candidate={selectedCandidate} 
            job={job}
            onClose={() => setSelectedCandidate(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewApplicants;
