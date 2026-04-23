import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { signupUser } from '../api';

const AnimatedGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0" style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      backgroundSize: '64px 64px',
    }} />
  </div>
);

const EyeIcon = ({ closed }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {closed ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </>
    )}
  </svg>
);

const PersonIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BriefcaseIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth() || { login: () => {} };
  
  const [role, setRole] = useState('candidate');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;
    
    setLoading(true);
    setError('');
    try {
      const res = await signupUser({ name: fullName, email, password, role });
      login(res.data);
      if (res.data.role === 'candidate') {
        navigate('/jobs');
      } else {
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const accentColor = role === 'candidate' ? '#00C9A7' : '#F5A623';

  const getPasswordStrength = () => {
    const len = password.length;
    if (len === 0) return { bars: 0, text: '', color: '#222' };
    if (len >= 1 && len <= 3) return { bars: 1, text: 'Weak', color: '#f85149' };
    if (len >= 4 && len <= 7) return { bars: 2, text: 'Fair', color: '#F5A623' };
    return { bars: 4, text: 'Strong', color: '#00C9A7' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="relative min-h-screen flex items-center justify-center font-body overflow-hidden py-10" style={{ background: '#0a0a0a' }}>
      <AnimatedGrid />
      
      {/* Logo */}
      <div 
        className="absolute top-[24px] left-[40px] font-heading text-[20px] tracking-tight cursor-pointer z-10 flex items-center"
        onClick={() => navigate('/')}
      >
        <span className="text-[#F5A623]">R</span><span className="text-white">ankly</span>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="relative z-10 w-[480px] rounded-[20px] p-[40px_44px] flex flex-col"
        style={{ 
          background: '#111111', 
          border: '1px solid #222222',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)'
        }}
      >
        <h1 className="font-heading text-[28px] text-white text-center m-0">Create your account</h1>
        <p className="text-[14px] text-[#666] text-center mt-[6px] mb-[28px]">Join Rankly and hire or get hired smarter</p>

        {/* Role Selector */}
        <div className="w-full flex flex-col mb-[28px]">
          <label className="text-[12px] text-[#888] mb-[10px]">I am a...</label>
          <div className="flex gap-[12px]">
            {/* Candidate Card */}
            <div 
              className="flex-1 p-[16px] rounded-[12px] cursor-pointer text-center transition-all duration-200 flex flex-col items-center"
              style={{
                border: `2px solid ${role === 'candidate' ? '#00C9A7' : '#222'}`,
                background: role === 'candidate' ? 'rgba(0,201,167,0.06)' : '#1a1a1a',
                boxShadow: role === 'candidate' ? '0 0 20px rgba(0,201,167,0.1)' : 'none'
              }}
              onClick={() => setRole('candidate')}
            >
              <div 
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center mb-[8px]"
                style={{ background: 'rgba(0,201,167,0.1)' }}
              >
                <PersonIcon color="#00C9A7" />
              </div>
              <div className="text-[14px] font-semibold" style={{ color: role === 'candidate' ? '#fff' : '#666' }}>Candidate</div>
              <div className="text-[11px] text-[#666] mt-[4px]">I'm looking for jobs</div>
            </div>

            {/* Recruiter Card */}
            <div 
              className="flex-1 p-[16px] rounded-[12px] cursor-pointer text-center transition-all duration-200 flex flex-col items-center"
              style={{
                border: `2px solid ${role === 'recruiter' ? '#F5A623' : '#222'}`,
                background: role === 'recruiter' ? 'rgba(245,166,35,0.06)' : '#1a1a1a',
                boxShadow: role === 'recruiter' ? '0 0 20px rgba(245,166,35,0.1)' : 'none'
              }}
              onClick={() => setRole('recruiter')}
            >
              <div 
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center mb-[8px]"
                style={{ background: 'rgba(245,166,35,0.1)' }}
              >
                <BriefcaseIcon color="#F5A623" />
              </div>
              <div className="text-[14px] font-semibold" style={{ color: role === 'recruiter' ? '#fff' : '#666' }}>Recruiter</div>
              <div className="text-[11px] text-[#666] mt-[4px]">I'm hiring talent</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          {error && (
            <div className="mb-[16px] p-[10px_14px] rounded-[10px] text-[13px] text-[#f85149] bg-[rgba(248,81,73,0.08)] border border-[rgba(248,81,73,0.2)]">
              {error}
            </div>
          )}
          <div className="mb-[16px] flex flex-col">
            <label className="text-[12px] text-[#888] mb-[6px]">Full Name</label>
            <input 
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Arjun Mehta"
              required
              className="w-full rounded-[10px] p-[12px_16px] text-[14px] text-white transition-colors duration-200"
              style={{
                background: '#1a1a1a',
                border: '1px solid #252525',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = accentColor}
              onBlur={(e) => e.target.style.borderColor = '#252525'}
            />
          </div>

          <div className="mb-[16px] flex flex-col">
            <label className="text-[12px] text-[#888] mb-[6px]">Email address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-[10px] p-[12px_16px] text-[14px] text-white transition-colors duration-200"
              style={{
                background: '#1a1a1a',
                border: '1px solid #252525',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = accentColor}
              onBlur={(e) => e.target.style.borderColor = '#252525'}
            />
          </div>

          <div className="mb-[8px] flex flex-col relative">
            <label className="text-[12px] text-[#888] mb-[6px]">Password</label>
            <div className="relative w-full">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                className="w-full rounded-[10px] p-[12px_16px] pr-[40px] text-[14px] text-white transition-colors duration-200"
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #252525',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = accentColor}
                onBlur={(e) => e.target.style.borderColor = '#252525'}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[12px] top-[12px] text-[#888] hover:text-[#bbb] bg-transparent border-none cursor-pointer p-0"
              >
                <EyeIcon closed={!showPassword} />
              </button>
            </div>
          </div>

          {/* Password Strength */}
          <div className="mb-[20px] flex flex-col">
            <div className="flex gap-[4px] w-full mb-[6px]">
              {[1, 2, 3, 4].map((barIndex) => (
                <div 
                  key={barIndex} 
                  className="flex-1 h-[3px] rounded-[2px] transition-colors duration-300"
                  style={{
                    background: strength.bars >= barIndex ? strength.color : '#222'
                  }}
                />
              ))}
            </div>
            {password.length > 0 && (
              <div className="text-[12px] transition-colors duration-300" style={{ color: strength.color }}>
                {strength.text}
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full p-[13px] rounded-[10px] text-[14px] font-semibold border-none cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: role === 'candidate' ? 'linear-gradient(135deg, #00C9A7, #00a88a)' : 'linear-gradient(135deg, #F5A623, #e09400)',
              color: '#000',
              boxShadow: role === 'candidate' ? '0 4px 20px rgba(0,201,167,0.25)' : '0 4px 20px rgba(245,166,35,0.25)',
            }}
            onMouseEnter={(e) => {
              if(!loading) {
                e.target.style.boxShadow = role === 'candidate' ? '0 8px 30px rgba(0,201,167,0.4)' : '0 8px 30px rgba(245,166,35,0.4)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if(!loading) {
                e.target.style.boxShadow = role === 'candidate' ? '0 4px 20px rgba(0,201,167,0.25)' : '0 4px 20px rgba(245,166,35,0.25)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              `Create ${role === 'candidate' ? 'Candidate' : 'Recruiter'} Account`
            )}
          </button>
        </form>

        <div className="text-[13px] text-[#666] text-center mt-[24px]">
          Already have an account? <span 
            className="cursor-pointer transition-colors duration-200" 
            style={{ color: accentColor }}
            onClick={() => navigate('/login')}
          >Sign in</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
