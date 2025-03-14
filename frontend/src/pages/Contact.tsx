import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faPhone} className="text-yellow-500 text-xl" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p>+94 123 456 789</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faEnvelope} className="text-yellow-500 text-xl" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p>info@megacitycab.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faLocationDot} className="text-yellow-500 text-xl" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p>123 Main Street, Colombo, Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.80942623553!2d79.83795325!3d6.9218374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1655991774757!5m2!1sen!2sus"
                className="w-full h-full border-0 rounded-lg shadow-lg"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
