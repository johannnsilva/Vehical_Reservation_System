import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faCar, 
  faInfoCircle, 
  faEnvelope, 
  faPhone,
  faBars,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-indigo-600">Mega City Cab</h1>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 hover:text-indigo-600"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} size="lg" />
          </button>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-8">
            <li>
              <a href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2">
                <FontAwesomeIcon icon={faHome} /> Login
              </a>
            </li>
            <li>
              <a href="/services" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2">
                <FontAwesomeIcon icon={faCar} /> Our Services
              </a>
            </li>
            <li>
              <a href="/about" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2">
                <FontAwesomeIcon icon={faInfoCircle} /> About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} /> Contact
              </a>
            </li>
          </ul>

          <div className="hidden md:block flex-shrink-0">
            <a 
              href="tel:+94123456789" 
              className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPhone} /> Call Now: +94 123 456 789
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="pt-2 pb-3 space-y-1">
            <li>
              <a href="/" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                <FontAwesomeIcon icon={faHome} className="mr-2" /> Login
              </a>
            </li>
            <li>
              <a href="/services" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                <FontAwesomeIcon icon={faCar} className="mr-2" /> Our Services
              </a>
            </li>
            <li>
              <a href="/about" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" /> About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Contact
              </a>
            </li>
            <li>
              <a 
                href="tel:+94123456789" 
                className="block px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                <FontAwesomeIcon icon={faPhone} className="mr-2" /> Call Now: +94 123 456 789
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
