// src/components/shared/Layout.js
import { FiShoppingCart } from 'react-icons/fi';

const Layout = ({ 
  children, 
  activeTab, 
  onTabChange, 
  cartItemCount 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FoodExpress</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => onTabChange('menu')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'menu' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Menu
            </button>
            <button 
              onClick={() => onTabChange('cart')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'cart' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiShoppingCart className="mr-2" />
              Cart {cartItemCount > 0 && `(${cartItemCount})`}
            </button>
            <button 
              onClick={() => onTabChange('orders')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              My Orders
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;