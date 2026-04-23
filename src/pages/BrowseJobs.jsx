import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllJobs } from '../api';
import { MOCK_JOBS } from '../mockData';
import ApplyModal from '../components/modals/ApplyModal';
import UserMenu from '../components/ui/UserMenu';

/* ── Navbar ── */
const NAV_LINKS = [
  { label: 'For Recruiters', path: '/for-recruiters' },
  { label: 'For Candidates', path: '/for-candidates' },
  { label: 'Browse Jobs', path: '/jobs' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Industries', id: 'industries' },
];

const Navbar = ({ navigate }) => {
  const [active, setActive] = useState('Browse Jobs');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (l) => {
    if (l.id) {
      navigate('/');
      setTimeout(() => {
        document.getElementById(l.id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    if (l.path) {
      navigate(l.path);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <nav className={`sticky top-0 left-0 right-0 z-50 flex items-center justify-between h-[68px] px-[80px] border-b border-[#222222] transition-shadow duration-300 ${isScrolled ? 'shadow-md shadow-black/20' : ''}`}
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
    </nav>
  );
};

/* ── Icons ── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

/* ── Main Component ── */
const BrowseJobs = () => {
  const navigate = useNavigate();
  
  // State
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [workType, setWorkType] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('Latest first');
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);

  // Fetch jobs from API on mount
  useEffect(() => {
    const loadJobs = async () => {
      setJobsLoading(true);
      try {
        const res = await fetchAllJobs();
        setJobs(res.data || []);
      } catch (err) {
        console.error('Failed to fetch jobs, using mock data:', err);
        setJobs(MOCK_JOBS);
      } finally {
        setJobsLoading(false);
      }
    };
    loadJobs();
  }, []);

  // Derived filtered jobs
  const filteredJobs = jobs.filter(job => {
    // Search query match (title, company, skills)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = job.title.toLowerCase().includes(q);
      const matchesCompany = job.company.toLowerCase().includes(q);
      const matchesSkills = job.skills.some(s => s.toLowerCase().includes(q));
      if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
    }
    
    // Industry match
    if (selectedIndustry !== 'All' && job.category !== selectedIndustry) {
      return false;
    }

    // Work type match
    if (workType !== 'All' && job.workType !== workType) {
      return false;
    }

    // Experience match
    if (experienceLevel !== 'All Levels') {
      if (experienceLevel === 'Fresher (0-1 yr)' && !job.experience.includes('0-1')) return false; // mock data doesn't perfectly match
      if (experienceLevel === 'Mid-level (2-4 yrs)' && (!job.experience.includes('2') && !job.experience.includes('3') && !job.experience.includes('4'))) return false;
      if (experienceLevel === 'Senior (5+ yrs)' && !job.experience.includes('5')) return false;
    }

    return true;
  });

  // Sort logic
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'Latest first') {
      return a.postedDaysAgo - b.postedDaysAgo;
    }
    if (sortBy === 'Most applicants') {
      return b.applicantCount - a.applicantCount;
    }
    return 0; // "Highest match" logic mocked out for now
  });

  const industries = ['All', 'IT & Software', 'Banking & Finance', 'Healthcare & Medical', 'HR & Recruitment', 'Engineering', 'Sales & Marketing', 'Legal'];
  const workTypes = ['All', 'Remote', 'Hybrid', 'On-site'];
  const experienceLevels = ['All Levels', 'Fresher (0-1 yr)', 'Mid-level (2-4 yrs)', 'Senior (5+ yrs)'];
  const shortcuts = ['High match jobs', 'Fresher-friendly', 'Remote jobs', 'High salary jobs'];

  const resetAll = () => {
    setSearchQuery('');
    setSelectedIndustry('All');
    setWorkType('All');
    setExperienceLevel('All Levels');
    setSortBy('Latest first');
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-body pb-[60px]">
      <Navbar navigate={navigate} />

      {/* SECTION 1: Page Header */}
      <motion.section 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-[40px_80px_32px] border-b border-[#1a1a1a] flex justify-between items-end"
      >
        <div>
          <div className="text-[11px] uppercase text-[#00C9A7] tracking-[0.1em] mb-[8px]">FIND YOUR NEXT ROLE</div>
          <h1 className="font-heading text-[36px] text-white m-0 leading-tight">Browse Open Jobs</h1>
          <p className="text-[14px] text-[#666] mt-[6px]">Explore opportunities matched to your skills</p>
        </div>
        
        <div className="relative">
          <div className="absolute left-[16px] top-[50%] -translate-y-[50%] text-[#444] pointer-events-none flex items-center">
            <SearchIcon />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, company, skill..."
            className="w-[320px] bg-[#161616] border border-[#252525] rounded-[10px] p-[11px_16px] pl-[44px] text-[14px] text-white outline-none transition-colors duration-200 placeholder-[#444]"
            onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
            onBlur={(e) => e.target.style.borderColor = '#252525'}
          />
        </div>
      </motion.section>

      {/* SECTION 2: Industry Filter Bar */}
      <section className="px-[80px] py-[16px] border-b border-[#1a1a1a] bg-[#0d0d0d] flex items-center overflow-x-auto">
        <span className="text-[11px] text-[#555] uppercase tracking-[0.08em] mr-[16px] shrink-0 font-medium">Browse by Industry</span>
        <div className="flex gap-[10px]">
          {industries.map((ind, i) => (
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className="text-[12px] p-[7px_16px] rounded-[20px] cursor-pointer whitespace-nowrap transition-all duration-200"
              style={selectedIndustry === ind ? {
                background: 'rgba(0,201,167,0.1)',
                border: '1px solid #00C9A7',
                color: '#00C9A7',
                fontWeight: 500
              } : {
                background: '#161616',
                border: '1px solid #222',
                color: '#666',
                fontWeight: 400
              }}
              onMouseEnter={(e) => {
                if (selectedIndustry !== ind) {
                  e.target.style.borderColor = '#00C9A7';
                  e.target.style.color = '#00C9A7';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedIndustry !== ind) {
                  e.target.style.borderColor = '#222';
                  e.target.style.color = '#666';
                }
              }}
            >
              {ind}
            </motion.button>
          ))}
        </div>
      </section>

      {/* SECTION 3: Main Content */}
      <section className="p-[32px_80px] flex gap-[28px]">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-[260px] shrink-0 bg-[#111111] border border-[#1e1e1e] rounded-[14px] p-[20px] h-fit sticky top-[80px]">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase text-[#555] tracking-[0.08em] font-medium">FILTERS</span>
            <span onClick={resetAll} className="text-[12px] text-[#00C9A7] cursor-pointer hover:underline">Reset all</span>
          </div>

          <div className="my-[14px] border-t border-[#1e1e1e]" />

          {/* Work Type */}
          <div className="mb-[20px]">
            <div className="text-[11px] uppercase text-[#555] tracking-[0.06em] mb-[12px] font-medium">WORK TYPE</div>
            <div className="flex flex-col">
              {workTypes.map(wt => (
                <div key={wt} onClick={() => setWorkType(wt)} className="flex items-center gap-[10px] py-[8px] cursor-pointer group">
                  <div className="w-[16px] h-[16px] rounded-full flex items-center justify-center transition-colors duration-200"
                    style={{ border: `1px solid ${workType === wt ? '#00C9A7' : '#333'}` }}
                  >
                    {workType === wt && <div className="w-[8px] h-[8px] rounded-full bg-[#00C9A7]" />}
                  </div>
                  <span className={`text-[13px] transition-colors duration-200 ${workType === wt ? 'text-white' : 'text-[#888] group-hover:text-white'}`}>{wt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="my-[14px] border-t border-[#1e1e1e]" />

          {/* Experience Level */}
          <div className="mb-[20px]">
            <div className="text-[11px] uppercase text-[#555] tracking-[0.06em] mb-[12px] font-medium">EXPERIENCE LEVEL</div>
            <div className="flex flex-col">
              {experienceLevels.map(exp => (
                <div key={exp} onClick={() => setExperienceLevel(exp)} className="flex items-center gap-[10px] py-[8px] cursor-pointer group">
                  <div className="w-[16px] h-[16px] rounded-full flex items-center justify-center transition-colors duration-200"
                    style={{ border: `1px solid ${experienceLevel === exp ? '#00C9A7' : '#333'}` }}
                  >
                    {experienceLevel === exp && <div className="w-[8px] h-[8px] rounded-full bg-[#00C9A7]" />}
                  </div>
                  <span className={`text-[13px] transition-colors duration-200 ${experienceLevel === exp ? 'text-white' : 'text-[#888] group-hover:text-white'}`}>{exp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="my-[14px] border-t border-[#1e1e1e]" />

          {/* Popular Shortcuts */}
          <div>
            <div className="text-[11px] uppercase text-[#555] tracking-[0.06em] mb-[12px] font-medium">POPULAR SHORTCUTS</div>
            <div className="flex flex-col">
              {shortcuts.map(sc => (
                <div 
                  key={sc} 
                  className="py-[7px] text-[13px] text-[#666] cursor-pointer transition-colors duration-150"
                  onMouseEnter={(e) => e.target.style.color = '#00C9A7'}
                  onMouseLeave={(e) => e.target.style.color = '#666'}
                >
                  {sc}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <div className="flex-1">
          {/* Top Row */}
          <div className="flex justify-between items-start mb-[20px]">
            <div>
              <div className="font-heading text-[20px] text-white">{sortedJobs.length} Opportunities Found</div>
              <div className="text-[13px] text-[#555] mt-[4px]">Showing roles across all industries</div>
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#161616] border border-[#222] rounded-[8px] p-[8px_14px] text-[#888] text-[13px] outline-none cursor-pointer"
            >
              <option value="Latest first">Latest first</option>
              <option value="Highest match">Highest match</option>
              <option value="Most applicants">Most applicants</option>
            </select>
          </div>

          {/* Jobs List */}
          <div className="flex flex-col gap-[14px]">
            {sortedJobs.map((job, i) => (
              <motion.div 
                key={job.jobId}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-[#111111] border border-[#1e1e1e] rounded-[14px] p-[24px_28px] flex justify-between items-start transition-all duration-200"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#252525';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e1e1e';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="flex-1 pr-[20px]">
                  <div className="flex items-center gap-[6px] text-[12px] text-[#555] mb-[8px]">
                    <span className="text-[#666] font-medium">{job.company}</span>
                    <span>·</span>
                    <span>{job.location}</span>
                    <span>·</span>
                    <span>{job.experience}</span>
                  </div>
                  
                  <div className="font-heading text-[18px] text-white font-medium mb-[10px]">{job.title}</div>
                  
                  <div className="flex flex-wrap gap-[8px] mb-[14px]">
                    <span className="bg-[rgba(0,201,167,0.08)] border border-[rgba(0,201,167,0.2)] text-[#00C9A7] text-[11px] p-[4px_10px] rounded-[6px]">
                      {job.category}
                    </span>
                    <span className="bg-[#1a1a1a] border border-[#252525] text-[#888] text-[11px] p-[4px_10px] rounded-[6px]">
                      {job.workType}
                    </span>
                    {job.salary && (
                      <span className="bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.2)] text-[#F5A623] text-[11px] p-[4px_10px] rounded-[6px]">
                        {job.salary}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[13px] text-[#666] leading-[1.7] mb-[14px] line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.description}
                  </p>
                  
                  <div className="flex items-center text-[11px] text-[#444]">
                    <span>Posted {job.postedDaysAgo} days ago</span>
                    <span className="mx-[6px]">·</span>
                    <span>{job.applicantCount} applicants</span>
                  </div>
                </div>

                <div className="shrink-0 ml-[20px]">
                  <button 
                    onClick={() => setSelectedJobForModal(job)}
                    className="bg-transparent border border-[#00C9A7] text-[#00C9A7] text-[13px] font-medium p-[10px_20px] rounded-[8px] cursor-pointer whitespace-nowrap transition-all duration-200"
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(0,201,167,0.1)';
                      e.target.style.boxShadow = '0 0 20px rgba(0,201,167,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}

            {sortedJobs.length === 0 && (
              <div className="text-center py-[60px] text-[#666] text-[14px]">
                No jobs found matching your filters.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {selectedJobForModal && (
          <ApplyModal 
            job={selectedJobForModal} 
            onClose={() => setSelectedJobForModal(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrowseJobs;
