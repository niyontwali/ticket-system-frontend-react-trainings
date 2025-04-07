import React, { useEffect, useRef, useState } from 'react';
import { Menu, Ticket, LogOut, User, X, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Import RTK Query hooks
import { useGetCurrentUserQuery, useLogoutMutation } from '../redux/api/apiSlice';

// Assuming logo is imported this way
import logo from '../assets/mmi_logo.png';
import { logout } from '../redux/reducers/authSlice';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const dropdownRef = useRef(null);


  // RTK Query hooks
  const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigation = (link) => {
    navigate(link);
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Call the logout mutation
      await logoutUser().unwrap();

      // Dispatch the Redux logout action to clear local state
      dispatch(logout());

      // Navigate to login page
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, we still want to log out locally
      dispatch(logout());
      navigate('/');
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // User's first initial for avatar
  const userInitial = user?.data?.name?.[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-[#cfd1d5] bg-transparent backdrop-blur-md transition-all duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex h-16 items-center justify-between">
            {/* Logo (Left) */}
            <div className="flex-1 flex justify-start">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-auto transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Navigation (Center) - Absolutely positioned to center */}
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
              <nav className="flex items-center">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-all duration-500
                  ${isActiveRoute('/tickets')
                      ? 'text-primary font-medium'
                      : 'text-foreground hover:translate-y-px'}`}
                  onClick={() => handleNavigation('/tickets')}
                >
                  <Ticket className={`h-4 w-4 transition-all duration-700 ${isActiveRoute('/tickets') ? 'text-primary' : 'group-hover:scale-110'}`} />
                  <span className="transition-all duration-500">Tickets</span>
                </button>
              </nav>
            </div>

            {/* User Actions (Right) */}
            <div className="flex-1 flex justify-end items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted transition-colors duration-500 lg:hidden"
              >
                <Menu className="h-5 w-5 transition-transform duration-500 hover:scale-110" />
                <span className="sr-only">Menu</span>
              </button>

              {/* User Dropdown - Desktop */}
              <div className="relative hidden lg:block" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/10 transition-all duration-500 hover:scale-105"
                  aria-expanded={isDropdownOpen}
                  disabled={isUserLoading}
                >
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium transition-all duration-700 hover:shadow-md">
                    {isUserLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      userInitial
                    )}
                  </div>
                </button>

                {/* Dropdown Menu with Animation */}
                {isDropdownOpen && !isUserLoading && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-popover shadow-lg animate-in fade-in slide-in-from-top-5 duration-500"
                    onBlur={() => setIsDropdownOpen(false)}
                  >
                    <div className="py-2 px-4 font-medium border-b border-border">My Account</div>
                    <div className="py-1">
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted transition-colors duration-300"
                        onClick={() => {
                          handleNavigation('/account');
                          setIsDropdownOpen(false);
                        }}
                      >
                        <User className="mr-2 h-4 w-4 transition-transform duration-500 group-hover:scale-110" />
                        Account
                      </button>
                    </div>
                    <div className="border-t border-border"></div>
                    <div className="py-1">
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted text-danger transition-colors duration-300"
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        disabled={isLoggingOut}
                      >
                        <LogOut className="mr-2 h-4 w-4 transition-transform duration-500 group-hover:scale-110" />
                        {isLoggingOut ? (
                          <span className="flex items-center gap-2">
                            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Logging out...
                          </span>
                        ) : (
                          'Log out'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar with Animation */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-700">
          <div className="fixed inset-y-0 left-0 w-[300px] bg-background shadow-lg animate-in slide-in-from-left-full duration-1000">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <img src={logo} alt="Logo" className="h-14 w-auto" />
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-md p-2 hover:bg-muted transition-colors duration-500"
              >
                <X className="h-5 w-5 transition-transform duration-500 hover:scale-110" />
              </button>
            </div>
            <div className="py-4 px-2">
              {/* Mobile Navigation */}
              <div className="px-4 py-4  mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-700 hover:scale-105">
                    {isUserLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      userInitial
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{isUserLoading ? 'Loading...' : user?.data?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {isUserLoading ? 'user@example.com' : user?.data?.email}
                    </p>
                  </div>
                </div>
              </div>
              <nav className="grid gap-1">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-all duration-500
                  ${isActiveRoute('/tickets') ? 'font-medium text-primary' : 'text-foreground'}`}
                  onClick={() => handleNavigation('/tickets')}
                >
                  <Ticket className="h-4 w-4 transition-transform duration-500 group-hover:scale-110" />
                  <span>Tickets</span>
                </button>

                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted text-foreground transition-all duration-500"
                  onClick={() => handleNavigation('/account')}
                >
                  <User className="h-4 w-4 transition-transform duration-500 group-hover:scale-110" />
                  <span>Account</span>
                </button>

                <div className="my-2 border-t border-border"></div>

                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted text-danger transition-all duration-500"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4 transition-transform duration-500 group-hover:scale-110" />
                  <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                </button>
              </nav>


            </div>
          </div>
        </div>
      )}

      {/* Main Content with subtle animation */}
      <main className="flex-1 bg-muted/40 py-8 animate-in fade-in duration-1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;