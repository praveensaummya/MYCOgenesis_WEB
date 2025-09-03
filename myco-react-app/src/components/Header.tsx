'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { currentUser, userProfile, logout, loading } = useAuth();
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300">
      <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Image 
            src="/images/logo/MYCOgenesis.svg" 
            alt="MYCOgenesis Logo" 
            width={48} 
            height={48}
            className="h-10 w-10 sm:h-12 sm:w-12 mr-2 sm:mr-3"
          />
          <span className="font-bold text-lg sm:text-xl text-slate-700">MYCOGen</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2 xl:space-x-6">
          <Link href="/" className="text-slate-600 hover:text-teal-600 px-1 py-2 rounded-md text-sm font-medium hover:bg-teal-50/50 transition-all duration-200">
            Home
          </Link>
          <Link href="/business/technology" className="text-slate-600 hover:text-teal-600 px-1 py-2 rounded-md text-sm font-medium hover:bg-teal-50/50 transition-all duration-200">
            About Us
          </Link>
          
          <Link href="/our-mushrooms" className="text-slate-600 hover:text-teal-600 px-1 py-2 rounded-md text-sm font-medium hover:bg-teal-50/50 transition-all duration-200">
            Our Mushrooms
          </Link>
          
          <Link href="/shop" className="text-slate-600 hover:text-teal-600 px-1 py-2 rounded-md text-sm font-medium hover:bg-teal-50/50 transition-all duration-200">
            Shop
          </Link>
          <Link href="/blog" className="text-slate-600 hover:text-teal-600 px-1 py-2 rounded-md text-sm font-medium hover:bg-teal-50/50 transition-all duration-200">
            Blog
          </Link>
          <Link href="/contact" className="text-slate-600 hover:text-teal-600 px-1 py-2 rounded-md text-sm font-medium hover:bg-teal-50/50 transition-all duration-200">
            Contact
          </Link>
        </div>

        {/* Authentication Section */}
        <div className="hidden lg:flex items-center space-x-4 ml-4 pl-4 border-l border-slate-200">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
          ) : currentUser ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {userProfile?.profile?.photoURL ? (
                  <Image
                    src={userProfile.profile.photoURL}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full h-8 w-8"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-teal-600">
                      {userProfile?.profile?.displayName?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700">
                  {userProfile?.profile?.displayName || currentUser.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-50/50 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-50/50 transition-all duration-200">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button className="text-slate-600 hover:text-teal-600 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;