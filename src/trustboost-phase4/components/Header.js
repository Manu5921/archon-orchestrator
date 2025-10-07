// TrustBoost Phase 4 - Header Component
// Agent 4: Business & Commercial Engineer
// Optimisé pour conversion et navigation intuitive

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * Header avec navigation optimisée pour conversion
 * CTA visible, navigation claire, mobile-first
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Effect pour sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navigationItems = [
    { name: 'Accueil', href: '/', exact: true },
    { name: 'Fonctionnalités', href: '/features' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'Ressources', href: '/resources', hasDropdown: true },
    { name: 'À propos', href: '/about' }
  ];

  const resourcesDropdown = [
    { name: 'Documentation', href: '/docs', icon: '📚' },
    { name: 'Guides', href: '/guides', icon: '🎯' },
    { name: 'API', href: '/api-docs', icon: '⚡' },
    { name: 'Support', href: '/support', icon: '🤝' },
    { name: 'Blog', href: '/blog', icon: '✍️' },
    { name: 'Démos', href: '/demos', icon: '🎮' }
  ];

  // Check if current route is active
  const isActiveRoute = (href, exact = false) => {
    if (exact) {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              TrustBoost
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.hasDropdown ? (
                  // Dropdown menu
                  <div className="relative">
                    <button className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                      isActiveRoute(item.href) ? 'text-blue-600' : ''
                    }`}>
                      {item.name}
                      <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown content */}
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                      <div className="py-2">
                        {resourcesDropdown.map((resource) => (
                          <Link
                            key={resource.name}
                            href={resource.href}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          >
                            <span className="mr-3">{resource.icon}</span>
                            {resource.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular link
                  <Link
                    href={item.href}
                    className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                      isActiveRoute(item.href, item.exact) ? 'text-blue-600' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Se connecter
            </Link>
            
            <Link
              href="/onboarding/step1"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => {
                // Track CTA click
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'cta_click', {
                    event_category: 'Header',
                    event_label: 'Free Trial',
                    value: 'header_cta'
                  });
                }
              }}
            >
              Essai gratuit
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-sm rounded-lg mt-2 shadow-lg">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div>
                    <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
                      {item.name}
                    </div>
                    {resourcesDropdown.map((resource) => (
                      <Link
                        key={resource.name}
                        href={resource.href}
                        className="flex items-center px-6 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                      >
                        <span className="mr-2">{resource.icon}</span>
                        {resource.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-4 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 transition-colors ${
                      isActiveRoute(item.href, item.exact) 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Mobile CTA */}
            <div className="px-4 pt-4 space-y-2 border-t border-gray-100">
              <Link
                href="/login"
                className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                Se connecter
              </Link>
              
              <Link
                href="/onboarding/step1"
                className="block w-full px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}