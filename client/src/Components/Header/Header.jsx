import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Heart, MapPin, Minus, Plus, LogIn } from 'lucide-react';
import logo from './logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios'

const Header = () => {
  const [isToken, setIsToken] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  useEffect(() => {
    sessionStorage.getItem('token_login') ? setIsToken(true) : setIsToken(false)
  }, [])

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to shop page with search query
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      // Clear search input
      setSearchQuery('');
      // Close mobile search if open
      setIsSearchOpen(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header className="bg-white sticky shadow-lg top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin size={14} />
              <span>Free shipping on orders over ₹99</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to={'/track-your-order'}>Track Your Order</Link>
            <span>|</span>
            <Link to={'/contact'}>Help & Support</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-gray-900">
              {/* Shoe<span className="text-[#000000]">Hub</span> */}
              <img src={logo} className='w-18 rounded-lg' alt="Nypers" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#000000] font-medium transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-[#000000] font-medium transition-colors">
              About Us
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-[#000000] font-medium transition-colors">
              Shop
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#000000] font-medium transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search for shoes, brands..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#000000] transition-colors"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 text-gray-700 hover:text-[#000000] transition-colors"
            >
              <Search size={24} />
            </button>

            {isToken ? (
              <Link to="/profile" className="hidden sm:flex p-2 text-gray-700 hover:text-[#000000] transition-colors">
                <User size={24} />
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:flex p-2 text-gray-700 hover:text-[#000000] transition-colors">
                <LogIn size={24} />
              </Link>
            )}

            {/* Shopping Cart */}
            <Link
              to={'/cart'}
              className="p-2 text-gray-700 hover:text-[#000000] transition-colors relative"
            >
              <ShoppingCart size={24} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-gray-700 hover:text-[#000000] transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden mt-4 pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for shoes, brands..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#000000] transition-colors"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-[#000000] font-medium py-2 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-[#000000] font-medium py-2 transition-colors">
                About Us
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-[#000000] font-medium py-2 transition-colors">
                Shop
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-[#000000] font-medium py-2 transition-colors">
                Contact Us
              </Link>
              <hr className="my-2" />
              <div className="flex items-center space-x-4 pt-2">
                {isToken ? (
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-[#000000] transition-colors">
                    <User size={20} />
                    <span>Account</span>
                  </Link>
                ) : (
                  <Link to="/login" className="flex items-center space-x-2 text-gray-700 hover:text-[#000000] transition-colors">
                    <LogIn size={20} />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;