import { useEffect, useRef, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { FiLogOut, FiMenu, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useUser } from './context/UserContext';

export const Header = () => {
  const {token, clearToken} = useUser()
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-0 w-full text-rust p-2 bg-sandy flex z-20">
      <span className="text-3xl md:text-4xl lg:text-5xl font-display">TastyBoi</span>
      {(isMobileOnly && !!token) && (
        <div className="ml-auto relative" ref={menuRef}>
          <FiMenu size={32} className="text-rust cursor-pointer" onClick={toggleMenu} />
          {menuOpen && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white shadow-md rounded-md">
              <div className='flex px-4 py-2 text-black items-center gap-2'>
                <FiUser/>
                <Link to="/profile">
                  Profile
                </Link>
              </div>
              <button className='flex px-4 py-2 text-black items-center gap-2' onClick={()=>clearToken()}>
                <FiLogOut/>
                  Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
