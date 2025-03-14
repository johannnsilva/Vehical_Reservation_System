import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-indigo-600 mb-4">Mega City Cab</h3>
          <p className="text-gray-300">Your trusted cab service in Colombo City</p>
          <p className="text-gray-300">Available 24/7</p>
        </div>
        
        <div>
          <h4 className="text-lg font-bold text-indigo-600 mb-4">Contact Info</h4>
          <div className="space-y-2 text-gray-300">
            <p>123 Main Street</p>
            <p>Colombo, Sri Lanka</p>
            <p>Email: info@megacitycab.com</p>
            <p>Phone: +94 123 456 789</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-bold text-indigo-600 mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#facebook" className="text-gray-300 hover:text-indigo-600 transition-colors">Facebook</a>
            <a href="#twitter" className="text-gray-300 hover:text-indigo-600 transition-colors">Twitter</a>
            <a href="#instagram" className="text-gray-300 hover:text-indigo-600 transition-colors">Instagram</a>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-gray-700 text-center">
        <p className="text-gray-400">&copy; 2023 Mega City Cab. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
