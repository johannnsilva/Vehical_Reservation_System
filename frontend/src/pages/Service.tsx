import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTaxi, 
  faCar, 
  faTruckPickup, 
  faVanShuttle,
  faBoxes,
  faLocationDot,
  faClock,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';

const Service: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-gray-50">
        <div className="p-8 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Our Services</h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Experience premium transportation solutions with our diverse fleet and innovative services.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vehicle Services */}
            <div className="p-6 rounded-xl shadow-lg bg-white hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <FontAwesomeIcon icon={faTaxi} className="text-4xl text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Standard Cabs</h3>
              <p className="text-gray-600 leading-relaxed">
                Comfortable and economical taxi services for your daily commute. Available 24/7 with professional drivers.
              </p>
            </div>

            <div className="p-6 rounded-xl shadow-lg bg-white hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <FontAwesomeIcon icon={faCar} className="text-4xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Luxury Cars</h3>
              <p className="text-gray-600 leading-relaxed">
                Premium sedan cars for executive travel and special occasions. Experience comfort in style.
              </p>
            </div>

            <div className="p-6 rounded-xl shadow-lg bg-white hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <FontAwesomeIcon icon={faTruckPickup} className="text-4xl text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-gray-800">SUV Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Spacious SUVs perfect for family trips and group travel. Extra comfort for long journeys.
              </p>
            </div>

            <div className="p-6 rounded-xl shadow-lg bg-white hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <FontAwesomeIcon icon={faVanShuttle} className="text-4xl text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Van Transport</h3>
              <p className="text-gray-600 leading-relaxed">
                Versatile van services for larger groups and luggage. Ideal for airport transfers and tours.
              </p>
            </div>

            <div className="p-6 rounded-xl shadow-lg bg-white hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <FontAwesomeIcon icon={faBoxes} className="text-4xl text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Goods Transportation</h3>
              <p className="text-gray-600 leading-relaxed">
                Secure and reliable goods transportation services with careful handling and timely delivery.
              </p>
            </div>

            <div className="p-6 rounded-xl shadow-lg bg-white hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
              <FontAwesomeIcon icon={faLocationDot} className="text-4xl text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-gray-800">GPS Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time GPS tracking and live updates for all services. Monitor your shipment or ride status instantly.
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <FontAwesomeIcon icon={faClock} className="text-3xl text-blue-600 animate-pulse" />
              <h4 className="text-lg font-semibold mt-3">24/7 Service</h4>
              <p className="text-gray-600">Available round the clock</p>
            </div>
            <div className="text-center p-4">
              <FontAwesomeIcon icon={faLocationDot} className="text-3xl text-green-600 animate-bounce" />
              <h4 className="text-lg font-semibold mt-3">Live Tracking</h4>
              <p className="text-gray-600">Real-time location updates</p>
            </div>
            <div className="text-center p-4">
              <FontAwesomeIcon icon={faShieldHalved} className="text-3xl text-red-600" />
              <h4 className="text-lg font-semibold mt-3">Secure Service</h4>
              <p className="text-gray-600">Safety guaranteed</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Service;
