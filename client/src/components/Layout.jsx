import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, Utensils, Dumbbell, TrendingUp, MessageCircle, LogOut, Search, Bell, Mail, User as UserIcon, Menu, X, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin' || user?.role === 'nutritionist';
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Different navigation items for admin vs regular users
  const navItems = isAdmin ? [
    { path: '/admin', icon: UserIcon, label: 'Admin Panel' }
  ] : [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/diet', icon: Utensils, label: 'Diet Plan' },
    { path: '/workout', icon: Dumbbell, label: 'Workouts' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/food-database', icon: Database, label: 'Food Database' },
    { path: '/chat', icon: MessageCircle, label: 'AI Chat' },

    { path: '/profile', icon: UserIcon, label: 'Profile' }
  ];

  return ( 
    <div className="min-h-screen relative" style={{ background: '#000d1a' }}>
      {/* TOP BAR */}
      <nav style={{ background: 'linear-gradient(160deg, #0d1520 0%, #0a1a2e 100%)', borderBottom: '1px solid rgba(47,232,255,0.15)', boxShadow: '0 2px 20px rgba(47,232,255,0.08)' }} className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left side - Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-2 rounded-lg transition-all duration-300"
              style={{ background: 'rgba(47,232,255,0.08)', border: '1px solid rgba(47,232,255,0.2)' }}
            >
              {sidebarExpanded ? <X size={20} style={{ color: '#2FE8FF' }} /> : <Menu size={20} style={{ color: '#2FE8FF' }} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)', border: '1px solid rgba(47,232,255,0.3)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&h=100&fit=crop" 
                  alt="HealthAI Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: 'Montserrat, sans-serif', color: '#2FE8FF', letterSpacing: '2px' }}>FIT<span style={{ color: '#fff' }}>PULSE</span></span>
            </div>
          </div>
          
          {/* Center - Search Bar */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: '#2FE8FF', opacity: 0.5 }} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 text-sm focus:outline-none transition-all"
                style={{ background: 'rgba(47,232,255,0.05)', border: '1px solid rgba(47,232,255,0.2)', color: '#2FE8FF', fontFamily: 'Inter, sans-serif', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
              />
            </div>
          </div>
          
          {/* Right side - Icons & User */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg transition-all duration-300 relative group" style={{ background: 'rgba(47,232,255,0.05)', border: '1px solid rgba(47,232,255,0.1)' }}>
              <Bell size={20} style={{ color: '#2FE8FF', opacity: 0.7 }} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse" style={{ background: '#FF9800' }}></span>
            </button>
            
            <button className="p-2 rounded-lg transition-all duration-300 group" style={{ background: 'rgba(47,232,255,0.05)', border: '1px solid rgba(47,232,255,0.1)' }}>
              <Mail size={20} style={{ color: '#2FE8FF', opacity: 0.7 }} />
            </button>
            
            <button className="p-2 rounded-lg transition-all duration-300 group" style={{ background: 'rgba(47,232,255,0.05)', border: '1px solid rgba(47,232,255,0.1)' }}>
              <MessageCircle size={20} style={{ color: '#2FE8FF', opacity: 0.7 }} />
            </button>
            
            <div className="flex items-center gap-2 ml-2">
              <div className="w-9 h-9 flex items-center justify-center" style={{ background: 'rgba(47,232,255,0.15)', border: '1px solid rgba(47,232,255,0.4)', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}>
                <span className="text-sm font-semibold" style={{ color: '#2FE8FF', fontFamily: 'Montserrat, sans-serif' }}>
                  {(user?.profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex pt-16">
        {/* LEFT SIDEBAR */}
        {!isAdmin && (
          <motion.aside 
            initial={false}
            animate={{ width: sidebarExpanded ? 240 : 72 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-16 bottom-0 z-40"
            style={{ background: 'linear-gradient(160deg, #0d1520 0%, #0a1a2e 100%)', borderRight: '1px solid rgba(47,232,255,0.12)' }}
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => setSidebarExpanded(false)}
          >
            {/* Navigation */}
            <nav className="p-3 space-y-2 flex-1">
              {navItems.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 px-3 py-3 transition-all duration-300 group relative overflow-hidden${isActive ? ' nav-active-glow' : ''}`}
                    style={{
                      background: isActive ? 'rgba(47,232,255,0.12)' : 'transparent',
                      borderLeft: isActive ? '2px solid #2FE8FF' : '2px solid transparent',
                      color: isActive ? '#2FE8FF' : 'rgba(47,232,255,0.45)',
                    }}
                  >
                    <Icon 
                      size={22} 
                      style={{ color: isActive ? '#2FE8FF' : 'rgba(47,232,255,0.45)', flexShrink: 0, position: 'relative', zIndex: 10 }}
                    />
                    <AnimatePresence>
                      {sidebarExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium text-sm relative z-10 whitespace-nowrap"
                          style={{ fontFamily: 'Inter, sans-serif', color: isActive ? '#2FE8FF' : 'rgba(47,232,255,0.55)', letterSpacing: '0.5px' }}
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </nav>
            
            {/* User Info at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3" style={{ borderTop: '1px solid rgba(47,232,255,0.1)' }}>
              <div className="flex items-center gap-3 px-2 py-2 cursor-pointer transition-all duration-300">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(47,232,255,0.12)', border: '1px solid rgba(47,232,255,0.3)', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}>
                  <span className="text-sm font-semibold" style={{ color: '#2FE8FF', fontFamily: 'Montserrat, sans-serif' }}>
                    {(user?.profile?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <AnimatePresence>
                  {sidebarExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 min-w-0"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <div className="text-sm font-medium truncate" style={{ color: '#2FE8FF' }}>{user?.profile?.name || 'User'}</div>
                      <div className="text-xs truncate" style={{ color: 'rgba(47,232,255,0.4)' }}>{user?.email}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button 
                  onClick={handleLogout}
                  className={`transition-all duration-300 ${sidebarExpanded ? 'opacity-100' : 'opacity-0'}`}
                  title="Logout"
                >
                  <LogOut size={16} style={{ color: 'rgba(47,232,255,0.5)' }} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
        
        {/* MAIN CONTENT AREA */}
        <motion.main 
          animate={{ marginLeft: !isAdmin ? (sidebarExpanded ? 240 : 72) : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-1 p-6 relative z-10 min-h-screen"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
