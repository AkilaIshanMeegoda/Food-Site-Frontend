import React from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare 
} from "lucide-react";
import Navbar from "./Navbar/Navbar";

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEC6A1] to-[#FDE1D3]">
        <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#F97316] to-[#FEC6A1] py-16 text-white shadow-lg">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
              Get in Touch
            </h1>
            <p className="text-xl mb-6 text-white/90">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Information */}
          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-[#F97316] p-3 rounded-full">
                  <Phone className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Phone</h3>
                  <p className="text-gray-600">034 2227 890</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-[#F97316] p-3 rounded-full">
                  <Mail className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">contact@epiceats.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-[#F97316] p-3 rounded-full">
                  <MapPin className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Address</h3>
                  <p className="text-gray-600">123 Delivery Street, Food City, Colombo 03</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Your message"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none min-h-[150px]"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Send Message
                <MessageSquare className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

