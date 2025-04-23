import React from "react";
import { 
  Users, 
  MapPin, 
  Globe, 
  Info 
} from "lucide-react";
import Navbar from "./Navbar/Navbar";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
        <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Bringing Delicious Food To Your Doorstep</h1>
            <p className="text-xl mb-8">We connect hungry customers with the best local restaurants, ensuring quick and reliable delivery every time.</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}></div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-10">
            <Info className="text-orange-500 mr-3" size={28} />
            <h2 className="text-3xl font-bold text-gray-800">Our Story</h2>
          </div>
          <div className="text-gray-600 text-lg space-y-6">
            <p>
              Founded in 2025, our food delivery service was born from a simple idea: make it easier for people to enjoy their favorite meals at home or work. What started as a small operation in one city has now expanded to serve customers throughout the region.
            </p>
            <p>
              Our platform connects hungry customers with the best local restaurants, offering a seamless ordering experience and reliable delivery. We're committed to supporting local businesses while providing exceptional service to our customers.
            </p>
            <p>
              Whether you're craving comfort food after a long day, planning a family dinner, or organizing a corporate lunch, we're here to make food delivery simple, reliable, and delicious.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
              <p className="text-gray-600 text-lg">Delivering more than just food - we're delivering experiences.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <Globe className="text-orange-500" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Wide Restaurant Selection</h3>
                <p className="text-gray-600">
                  From local favorites to international cuisine, we partner with hundreds of restaurants to offer you the widest selection of food options.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="text-orange-500" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Fast & Reliable Delivery</h3>
                <p className="text-gray-600">
                  Our optimized delivery network ensures your food arrives hot and fresh, with real-time tracking so you know exactly when your meal will arrive.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <Users className="text-orange-500" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Customer-Focused Service</h3>
                <p className="text-gray-600">
                  Our dedicated support team is available to help with any questions or concerns. Your satisfaction is our top priority.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <Info className="text-orange-500" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Easy Ordering</h3>
                <p className="text-gray-600">
                  Our intuitive platform makes it simple to browse menus, customize orders, and pay securely - all in just a few clicks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-10">
            <Users className="text-orange-500 mr-3" size={28} />
            <h2 className="text-3xl font-bold text-gray-800">Our Team</h2>
          </div>
          
          <div className="text-center mb-10">
            <p className="text-gray-600 text-lg">
              Behind our platform is a dedicated team of food enthusiasts, tech experts, and customer service professionals working together to revolutionize food delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1664536392779-049ba8fde933?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww" 
                  alt="Team Member" 
                  className=" object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Akila Ishan</h3>
              <p className="text-gray-600">Co-Founder & CEO</p>
            </div>

            <div className="text-center">
              <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww" 
                  alt="Team Member" 
                  className=" object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Dinithi Gamage</h3>
              <p className="text-gray-600">Executive Manager</p>
            </div>
            
            <div className="text-center">
              <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1722322426803-101270837197?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGUlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D" 
                  alt="Team Member" 
                  className="h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Savishka Dilshan</h3>
              <p className="text-gray-600">Co-Founder & CTO</p>
            </div>
            
            <div className="text-center">
              <div className="w-40 h-40 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww" 
                  alt="Team Member" 
                  className=" object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Chalana Kaveesha</h3>
              <p className="text-gray-600">Head of Operations</p>
            </div>
          </div>
        </div>
      </div>


      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">EpicEats</h3>
            <p className="mb-6">Bringing delicious food to your doorstep since 2025</p>
            <p>&copy; {new Date().getFullYear()} FoodDelivery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;