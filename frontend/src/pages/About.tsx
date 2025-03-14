import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Mega City Cab</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-6 rounded-xl shadow-lg bg-white hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Mega City Cab has been serving the Colombo community since 2010. 
                We started with a small fleet of just 5 cars and have grown to become 
                one of the most trusted taxi services in the city.
              </p>
              <p className="text-gray-600 mb-4">
                Our mission is to provide safe, reliable, and comfortable transportation 
                services to our valued customers at competitive prices.
              </p>
            </div>
            
            <div className="p-6 rounded-xl shadow-lg bg-white hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  24/7 Service Availability
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Professional and Trained Drivers
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Well-maintained Vehicle Fleet
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Competitive Pricing
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  GPS-tracked Vehicles
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Customer Safety First
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
