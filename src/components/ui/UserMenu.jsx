import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserMenu = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth() || { user: null, logout: () => {} };
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // If not logged in, show Login + Get Started
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/login')}
          className="text-[14px] px-[20px] py-[8px] rounded-lg border border-[#333] bg-transparent text-[#ccc] cursor-pointer transition-colors duration-200 hover:border-[#F5A623] hover:text-white"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="text-[14px] px-[20px] py-[8px] rounded-[8px] border-none bg-[#F5A623] text-black font-semibold cursor-pointer transition-colors duration-200 hover:brightness-110 flex items-center gap-1.5"
        >
          Get Started <span className="font-sans">&rarr;</span>
        </button>
      </div>
    );
  }

  // Logged in — show avatar
  const initials = (user.name || user.email || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isRecruiter = user.role === 'recruiter';
  const accentColor = isRecruiter ? '#F5A623' : '#00C9A7';
  const accentBg = isRecruiter ? 'rgba(245,166,35,0.12)' : 'rgba(0,201,167,0.12)';
  const accentBorder = isRecruiter ? 'rgba(245,166,35,0.3)' : 'rgba(0,201,167,0.3)';

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[10px] cursor-pointer bg-transparent border-none p-0 group"
      >
        <div
          className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-200"
          style={{
            background: accentBg,
            border: `2px solid ${accentBorder}`,
            color: accentColor,
          }}
        >
          {initials}
        </div>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] w-[240px] rounded-[14px] overflow-hidden z-[200]"
          style={{
            background: '#141414',
            border: '1px solid #222',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          }}
        >
          {/* User Info */}
          <div className="p-[16px_18px] border-b border-[#1e1e1e]">
            <div className="flex items-center gap-[12px]">
              <div
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
                style={{
                  background: accentBg,
                  border: `2px solid ${accentBorder}`,
                  color: accentColor,
                }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] text-white font-medium truncate">
                  {user.name || 'User'}
                </div>
                <div className="text-[12px] text-[#666] truncate">
                  {user.email}
                </div>
              </div>
            </div>
            {/* Role badge */}
            <div className="mt-[12px]">
              <span
                className="inline-flex items-center gap-[6px] text-[11px] font-semibold px-[10px] py-[4px] rounded-[20px] uppercase tracking-[0.05em]"
                style={{
                  background: accentBg,
                  border: `1px solid ${accentBorder}`,
                  color: accentColor,
                }}
              >
                <span
                  className="w-[6px] h-[6px] rounded-full"
                  style={{ background: accentColor }}
                />
                {isRecruiter ? 'Recruiter' : 'Candidate'}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-[6px]">
            {isRecruiter ? (
              <button
                onClick={() => { setOpen(false); navigate('/recruiter/dashboard'); }}
                className="w-full text-left px-[14px] py-[10px] rounded-[8px] text-[13px] text-[#999] bg-transparent border-none cursor-pointer transition-colors duration-150 hover:bg-[#1a1a1a] hover:text-white flex items-center gap-[10px]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => { setOpen(false); navigate('/jobs'); }}
                className="w-full text-left px-[14px] py-[10px] rounded-[8px] text-[13px] text-[#999] bg-transparent border-none cursor-pointer transition-colors duration-150 hover:bg-[#1a1a1a] hover:text-white flex items-center gap-[10px]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Browse Jobs
              </button>
            )}

            <div className="my-[4px] border-t border-[#1e1e1e]" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-[14px] py-[10px] rounded-[8px] text-[13px] text-[#f85149] bg-transparent border-none cursor-pointer transition-colors duration-150 hover:bg-[rgba(248,81,73,0.06)] flex items-center gap-[10px]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
