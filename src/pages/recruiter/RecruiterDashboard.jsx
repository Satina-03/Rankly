import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_RECRUITER_JOBS } from '../../mockData';
import { fetchRecruiterJobs, createJob as createJobApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
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
      
      {/* Logo */}
      <div className="flex items-center">
        <span className="font-heading text-[22px] tracking-tight cursor-pointer flex items-center mr-6" onClick={() => { navigate('/'); window.scrollTo(0, 0); }}>
          <span className="w-2 h-2 bg-[#F5A623] rounded-[3px] mr-[6px] inline-block" />
          <span className="text-[#F5A623]">R</span><span className="text-white">ankly</span>
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
            {active === l.label && <span className="absolute -bottom-[10px] w-1 h-1 rounded-full bg-[#F5A623]" />}
          </div>
        ))}
      </div>
      
      {/* User Menu */}
      <UserMenu />
    </nav>
  );
};

/* ── Post Job Modal ── */
const PostJobModal = ({ onClose, onAddJob, recruiterId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', company: '', category: 'IT & Software', workType: 'Remote',
    experience: '', salary: '', location: '', description: '', skills: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const jobData = {
        title: formData.title,
        company: formData.company,
        category: formData.category,
        workType: formData.workType,
        experience: formData.experience,
        salary: formData.salary,
        location: formData.location,
        description: formData.description,
        skills: formData.skills.split(',').map(s => s.trim()),
        recruiterId: recruiterId || 'unknown',
      };
      const res = await createJobApi(jobData);
      onAddJob(res.data);
    } catch (err) {
      console.error('Failed to create job via API, using local:', err);
      onAddJob({
        jobId: 'rjob_' + Date.now(),
        title: formData.title,
        company: formData.company,
        category: formData.category,
        workType: formData.workType,
        experience: formData.experience,
        salary: formData.salary,
        location: formData.location,
        description: formData.description,
        skills: formData.skills.split(',').map(s => s.trim()),
        postedDaysAgo: 0,
        applicantCount: 0,
        status: 'Active'
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#1a1a1a', border: '1px solid #252525', 
    borderRadius: '10px', padding: '11px 14px', color: 'white', 
    fontSize: '13px', outline: 'none'
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
            <h2 className="font-heading text-[24px] text-white m-0">Post a New Job</h2>
            <p className="text-[13px] text-[#666] mt-[4px]">Fill in the details below</p>
          </div>
          <button onClick={onClose}
            className="w-[32px] h-[32px] rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 border border-[#252525] p-0"
            style={{ background: '#1a1a1a', color: '#666', fontSize: '16px' }}
            onMouseEnter={(e) => { e.target.style.borderColor = '#f85149'; e.target.style.color = '#f85149'; }}
            onMouseLeave={(e) => { e.target.style.borderColor = '#252525'; e.target.style.color = '#666'; }}
          >✕</button>
        </div>

        <div className="my-[20px] border-t border-[#1e1e1e]" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          {/* Row 1 */}
          <div className="flex flex-col">
            <label className="text-[12px] text-[#888] mb-[6px]">Job Title *</label>
            <input required placeholder="e.g. Senior Frontend Developer" style={inputStyle}
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              onFocus={e => e.target.style.borderColor = '#F5A623'} onBlur={e => e.target.style.borderColor = '#252525'} />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="flex flex-col">
              <label className="text-[12px] text-[#888] mb-[6px]">Company *</label>
              <input required placeholder="e.g. TCS" style={inputStyle}
                value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
                onFocus={e => e.target.style.borderColor = '#F5A623'} onBlur={e => e.target.style.borderColor = '#252525'} />
            </div>
            <div className="flex flex-col">
              <label className="text-[12px] text-[#888] mb-[6px]">Category *</label>
              <select style={inputStyle} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                onFocus={e => e.target.style.borderColor = '#F5A623'} onBlur={e => e.target.style.borderColor = '#252525'}>
                {['IT & Software', 'Banking & Finance', 'Healthcare & Medical', 'HR & Recruitment', 'Engineering', 'Sales & Marketing', 'Legal'].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="flex flex-col">
              <label className="text-[12px] text-[#888] mb-[6px]">Work Type *</label>
              <select style={inputStyle} value={formData.workType} onChange={e => setFormData({...formData, workType: e.target.value})}
                onFocus={e => e.target.style.borderColor = '#F5A623'} onBlur={e => e.target.style.borderColor = '#252525'}>
                {['Remote', 'Hybrid', 'On-site'].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[12px] text-[#888] mb-[6px]">Experience *</label>
              <input required placeholder="e.g. 2-4 years" style={inputStyle}
                value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}
                onFocus={e => e.target.style.borderColor = '#F5A623'} onBlur={e => e.target.style.borderColor = '#252525'} />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-[16px]">
            <div className="flex flex-col">
              <label className="text-[12px] text-[#888] mb-[6px]">Salary Range</label>
              <input placeholder="e.g. 12-18 LPA" style={inputStyle}
                value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})}
                onFocus={e => e.target.style.borderColor = '#F5A623'} onBlur={e => e.target.style.borderColor = '#252525'} />
            </div>
            <div className="flex flex-col">
              <label className="text-[12px] text-[#888] mb-[6px]">Location</label>
              <input placeholder="e.g. Mumbai" style={inputStyle}
                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                onFocus={e => e.target.style.borderColor = '#F5A623'} onBlur={e => e.target.style.borderColor = '#252525'} />
            </div>
          </div>

          {/* Job Description */}
          <div className="flex flex-col">
            <label className="text-[12px] text-[#888] mb-[6px]">Job Description *</label>
            <textarea required placeholder="Describe the role and responsibilities..." style={{...inputStyle, height: '100px', resize: 'none'}}
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              onFocus={e => e.target.style.borderColor = '#F5A623'} onBlur={e => e.target.style.borderColor = '#252525'} />
          </div>

          {/* Key Skills */}
          <div className="flex flex-col">
            <label className="text-[12px] text-[#888] mb-[6px]">Key Skills *</label>
            <input required placeholder="React, Node.js, AWS (comma separated)" style={inputStyle}
              value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})}
              onFocus={e => e.target.style.borderColor = '#F5A623'} onBlur={e => e.target.style.borderColor = '#252525'} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full mt-[8px] p-[13px] rounded-[10px] text-[14px] font-bold border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #F5A623, #e09400)', color: '#000' }}
            onMouseEnter={e => { if(!loading) { e.target.style.boxShadow = '0 8px 30px rgba(245,166,35,0.4)'; e.target.style.transform = 'translateY(-1px)'; } }}
            onMouseLeave={e => { if(!loading) { e.target.style.boxShadow = 'none'; e.target.style.transform = 'translateY(0)'; } }}
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

/* ── Main Component ── */
const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth() || { user: null };
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch recruiter's jobs from API
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        if (user?.userId) {
          const res = await fetchRecruiterJobs(user.userId);
          setJobs(res.data || []);
        } else {
          setJobs(MOCK_RECRUITER_JOBS);
        }
      } catch (err) {
        console.error('Failed to fetch jobs, using mock data:', err);
        setJobs(MOCK_RECRUITER_JOBS);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [user]);

  const handleAddJob = (newJob) => {
    setJobs([newJob, ...jobs]);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-body pb-[60px]">
      <Navbar navigate={navigate} />

      <div className="p-[40px_80px]">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-[36px]">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="text-[11px] uppercase text-[#F5A623] tracking-[0.1em] mb-[6px]">RECRUITER PORTAL</div>
            <h1 className="font-heading text-[32px] text-white m-0">My Job Postings</h1>
          </motion.div>

          <button onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-[8px] p-[12px_24px] rounded-[10px] text-[14px] font-bold border-none cursor-pointer transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #F5A623, #e09400)', color: '#000', boxShadow: '0 4px 20px rgba(245,166,35,0.25)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,166,35,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,166,35,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span className="text-[18px] leading-none">+</span> Post a Job
          </button>
        </div>

        {/* Jobs List */}
        {jobs.length > 0 ? (
          <div className="flex flex-col gap-[16px]">
            {jobs.map((job, i) => (
              <motion.div key={job.jobId}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
                className="bg-[#111111] border border-[#1e1e1e] rounded-[16px] p-[24px_32px] flex justify-between items-center transition-all duration-200"
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#252525'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div className="flex-1 pr-[20px]">
                  {/* Row 1 */}
                  <div className="flex items-center gap-[12px] mb-[10px]">
                    <div className="font-heading text-[20px] text-white font-medium">{job.title}</div>
                    <span className="bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.2)] text-[#F5A623] text-[11px] p-[3px_10px] rounded-[20px]">
                      {job.category}
                    </span>
                    <span className="bg-[#1a1a1a] border border-[#252525] text-[#888] text-[11px] p-[3px_10px] rounded-[20px]">
                      {job.workType}
                    </span>
                  </div>

                  {/* Row 2 */}
                  <div className="flex gap-[20px] mb-[8px]">
                    <span className="text-[14px] text-[#888]">{job.company}</span>
                    <span className="text-[13px] text-[#555]">· {job.experience}</span>
                    {job.salary && <span className="text-[13px] text-[#555]">· {job.salary}</span>}
                  </div>

                  {/* Row 3 */}
                  <div className="flex gap-[16px]">
                    <span className="text-[11px] text-[#444]">Posted {job.postedDaysAgo} days ago</span>
                    <span className="text-[11px]" style={{ color: job.applicantCount > 0 ? '#00C9A7' : '#444' }}>
                      · {job.applicantCount} applicants
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <button onClick={() => navigate('/recruiter/applicants/' + job.jobId)}
                    className="bg-transparent border border-[#F5A623] text-[#F5A623] text-[13px] font-medium p-[10px_20px] rounded-[8px] cursor-pointer whitespace-nowrap transition-all duration-200"
                    onMouseEnter={e => { e.target.style.background = 'rgba(245,166,35,0.08)'; e.target.style.boxShadow = '0 0 20px rgba(245,166,35,0.15)'; }}
                    onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none'; }}
                  >
                    View Applicants &rarr;
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-[80px]">
            <div className="text-[48px] text-[#333]">📋</div>
            <div className="font-heading text-[20px] text-[#555] mt-[16px]">No jobs posted yet</div>
            <div className="text-[13px] text-[#444] mt-[8px]">Click Post a Job to get started</div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && <PostJobModal onClose={() => setIsModalOpen(false)} onAddJob={handleAddJob} recruiterId={user?.userId} />}
      </AnimatePresence>
    </div>
  );
};

export default RecruiterDashboard;
