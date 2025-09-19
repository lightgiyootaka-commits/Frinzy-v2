import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { SunIcon, MoonIcon, UserCircleIcon, ArrowLeftOnRectangleIcon, ChatBubbleLeftRightIcon, HeartIcon, CompassIcon, CalendarIcon } from './icons/Icons';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const desktopNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-secondary/20 text-secondary dark:text-white'
        : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
    }`;
  
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
      isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
    }`;

  return (
    <>
      {/* --- Mobile Top Header --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-light-bg dark:bg-dark-bg p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <NavLink to="/discover">
           <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
            Frinzy
          </div>
        </NavLink>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <header className="
        md:sticky md:top-0 md:z-50 md:bg-light-card/80 md:dark:bg-dark-card/80 md:backdrop-blur-xl md:shadow-glass
        fixed bottom-0 left-0 right-0 z-50 bg-light-bg dark:bg-dark-bg border-t border-gray-200 dark:border-gray-700
        md:border-t-0
      ">
        {/* --- Desktop Header --- */}
        <div className="hidden md:flex container mx-auto px-4 sm:px-6 py-3 justify-between items-center">
          <NavLink to="/discover" className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
              Frinzy
            </div>
          </NavLink>
          
          <nav className="flex items-center gap-2 lg:gap-4">
            <NavLink to="/discover" className={desktopNavLinkClass}><CompassIcon /> Discover</NavLink>
            <NavLink to="/likes" className={desktopNavLinkClass}>
              <div className="relative">
                  <HeartIcon />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
              </div>
              Likes
              </NavLink>
            <NavLink to="/chat" className={desktopNavLinkClass}><ChatBubbleLeftRightIcon /> Chats</NavLink>
            <NavLink to="/events" className={desktopNavLinkClass}><CalendarIcon /> Events</NavLink>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2">
                <img src={user?.avatarUrl} alt="User Avatar" className="w-9 h-9 rounded-full object-cover border-2 border-primary" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-light-bg dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-white/10">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.points} points</p>
                  </div>
                  <NavLink to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5">
                    <UserCircleIcon /> My Profile
                  </NavLink>
                  <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-black/5 dark:hover:bg-white/5">
                    <ArrowLeftOnRectangleIcon /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Mobile Bottom Nav --- */}
        <nav className="md:hidden flex justify-around items-center h-16">
          <NavLink to="/discover" className={mobileNavLinkClass}>
              <CompassIcon className="w-6 h-6" />
              <span className="text-xs">Discover</span>
          </NavLink>
          <NavLink to="/likes" className={mobileNavLinkClass}>
              <HeartIcon className="w-6 h-6" />
              <span className="text-xs">Likes</span>
          </NavLink>
          <NavLink to="/chat" className={mobileNavLinkClass}>
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              <span className="text-xs">Chats</span>
          </NavLink>
          <NavLink to="/events" className={mobileNavLinkClass}>
              <CalendarIcon className="w-6 h-6" />
              <span className="text-xs">Events</span>
          </NavLink>
          <NavLink to="/profile" className={mobileNavLinkClass}>
              <UserCircleIcon className="w-6 h-6" />
              <span className="text-xs">Profile</span>
          </NavLink>
        </nav>
      </header>
    </>
  );
};

export default Header;
