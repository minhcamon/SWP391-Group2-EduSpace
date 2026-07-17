import { useAuth } from '@/contexts/AuthContext'
import { Menu, X, Search, ArrowLeftRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router'
import AvatarDropDown from '../common/AvatarDropDown'
import Avatar from '../common/Avatar'
import Logo from '../common/Logo'
import NotificationDropdown from '../common/NotificationDropdown'

const Header = () => {
  const { user, setMode } = useAuth()
  const navigate = useNavigate()
  const [showDropDown, setShowDropDown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  const [searchParams] = useSearchParams()
  const currentSearch = searchParams.get('search') || ''
  const [searchQuery, setSearchQuery] = useState(currentSearch)
  const [prevSearch, setPrevSearch] = useState(currentSearch)
  const inputRef = useRef(null)
  const avatarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowDropDown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (currentSearch !== prevSearch) {
    setPrevSearch(currentSearch)
    setSearchQuery(currentSearch)
  }

  useEffect(() => {
    if (currentSearch && inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus()
      // Move cursor to end of text
      const len = inputRef.current.value.length
      inputRef.current.setSelectionRange(len, len)
    }
  }, [currentSearch])

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    navigate(`/courses?search=${encodeURIComponent(val)}`, { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border-light/35 shadow-sm transition-all duration-200">
      <div className="max-w-screen mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {/* Logo Section */}
          <div className="max-w-40">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-semibold transition-all duration-200 py-1.5 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-medium hover:text-primary'
                }`
              }
            >
              Trang chủ
            </NavLink>

            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `text-sm font-semibold transition-all duration-200 py-1.5 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-medium hover:text-primary'
                }`
              }
            >
              Khóa học
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/my-learning"
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-all duration-200 py-1.5 ${
                      isActive
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-neutral-medium hover:text-primary'
                    }`
                  }
                >
                  Học tập của tôi
                </NavLink>

                <NavLink
                  to="/my-incidents"
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-all duration-200 py-1.5 ${
                      isActive
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-neutral-medium hover:text-primary'
                    }`
                  }
                >
                  Khiếu nại của tôi
                </NavLink>
              </>
            )}
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="relative hidden md:block">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary rounded-full py-1.5 pl-9 pr-4 text-xs w-40 transition-all duration-200 focus:w-56 outline-none"
            />
          </div>

          {/* Right Action Section */}
          <div className="flex items-center gap-3">
            {/* Switch to Mentor Mode Button (Desktop) */}
            {user &&
              (user.isMentor ||
                user.role === 'CREATOR' ||
                user.role === 'ADMIN') && (
                <button
                  onClick={() => {
                    setMode('MENTOR')
                    navigate('/mentor')
                  }}
                  className="hidden lg:flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold px-3.5 py-2 rounded-full border border-primary/10 transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  <ArrowLeftRight size={13} />
                  <span>Trang quản lý Mentor</span>
                </button>
              )}

            {/* Notification Bell */}
            <NotificationDropdown />

             {/* User Profile Dropdown or Authentication Buttons */}
            {user ? (
              <div ref={avatarRef} className="relative inline-block text-left">
                <button
                  onClick={() => setShowDropDown(!showDropDown)}
                  className="hover:cursor-pointer flex items-center justify-center rounded-full p-0.5 border border-slate-200 hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                >
                  <Avatar
                    src={user.avatarUrl}
                    alt="User Avatar"
                    className="w-8 h-8"
                  />
                </button>
                {showDropDown && <AvatarDropDown />}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-neutral-medium hover:text-primary px-4 py-2 transition-colors duration-200"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary hover:bg-primary/40 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:shadow-[0_4px_12px_rgba(79,70,229,0.2)] transition-all duration-200 active:scale-[0.98]"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Hamburger Menu Toggle Button (Mobile Only) */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-neutral-medium hover:text-primary focus:outline-none p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top duration-200 px-4 py-4 space-y-4 absolute top-16 left-0 w-full z-30">
          {/* Search Bar for Mobile */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary rounded-full py-2 pl-9 pr-4 text-xs outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            {/* <NavLink
                            to="/roadmaps"
                            onClick={() => setShowMobileMenu(false)}
                            className={({ isActive }) =>
                                `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-neutral-medium hover:bg-slate-50 hover:text-primary"
                                }`
                            }
                        >
                            Lộ trình
                        </NavLink> */}
            <NavLink
              to="/"
              onClick={() => setShowMobileMenu(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-neutral-medium hover:bg-slate-50 hover:text-primary'
                }`
              }
            >
              Trang chủ
            </NavLink>

            <NavLink
              to="/courses"
              onClick={() => setShowMobileMenu(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-neutral-medium hover:bg-slate-50 hover:text-primary'
                }`
              }
            >
              Khóa học
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/my-learning"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-neutral-medium hover:bg-slate-50 hover:text-primary'
                    }`
                  }
                >
                  Học tập của tôi
                </NavLink>

                <NavLink
                  to="/my-incidents"
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-neutral-medium hover:bg-slate-50 hover:text-primary'
                    }`
                  }
                >
                  Khiếu nại của tôi
                </NavLink>
              </>
            )}

            {/* Switch to Mentor Mode Button (Mobile) */}
            {user &&
              (user.isMentor ||
                user.role === 'CREATOR' ||
                user.role === 'ADMIN' ||
                user.username?.startsWith('mentor')) && (
                <button
                  onClick={() => {
                    setShowMobileMenu(false)
                    setMode('MENTOR')
                    navigate('/mentor')
                  }}
                  className="flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold py-2.5 rounded-xl border border-primary/10 transition-all duration-200 mt-2 cursor-pointer w-full"
                >
                  <ArrowLeftRight size={14} />
                  <span>Trang quản lý Mentor</span>
                </button>
              )}
            {/* {user && (
                            <NavLink
                                to="/my-learning"
                                onClick={() => setShowMobileMenu(false)}
                                className={({ isActive }) =>
                                    `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-neutral-medium hover:bg-slate-50 hover:text-primary"
                                    }`
                                }
                            >
                                Học tập của tôi
                            </NavLink>
                        )}
                        {user && (
                            <NavLink
                                to="/my-learning"
                                onClick={() => setShowMobileMenu(false)}
                                className={({ isActive }) =>
                                    `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-neutral-medium hover:bg-slate-50 hover:text-primary"
                                    }`
                                }
                            >
                                Học tập của tôi
                            </NavLink>
                        )}
                        {user && (
                            <NavLink
                                to="/leaderboard"
                                onClick={() => setShowMobileMenu(false)}
                                className={({ isActive }) =>
                                    `px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-neutral-medium hover:bg-slate-50 hover:text-primary"
                                    }`
                                }
                            >
                                Bảng xếp hạng
                            </NavLink>
                        )} */}
          </div>

          {!user && (
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setShowMobileMenu(false)}
                className="text-center text-sm font-semibold text-neutral-medium hover:text-primary py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/signup"
                onClick={() => setShowMobileMenu(false)}
                className="text-center bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#3f38c9] transition-all hover:shadow-md"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
