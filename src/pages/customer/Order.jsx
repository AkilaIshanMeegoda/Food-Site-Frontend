// src/Order.js
import { useState, useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import Layout from './order/shared/Layout';
import Menu from './order/Menu/Menu';
import Cart from './order/Cart/Cart';
import MyOrders from './order/MyOrders/MyOrders';
import StatusBadge from './order/shared/StatusBadge';


const Order = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('123 Main Street, Colombo');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  // Sample restaurant data
  const restaurants = [
    {
      id: '1',
      name: 'Burger King',
      cuisine: 'American • Burgers',
      image: 'https://source.unsplash.com/random/300x200/?burger',
      rating: 4.2,
      deliveryTime: '20-30 min',
      menuItems: [
        {
          id: '101',
          name: 'Whopper Meal',
          description: 'Flame-grilled beef patty with tomatoes, lettuce, mayo, ketchup, pickles, and onions',
          price: 1200,
          category: 'Meals',
          image: 'https://source.unsplash.com/random/300x200/?whopper'
        },
        {
          id: '102',
          name: 'Cheeseburger',
          description: 'Classic cheeseburger with American cheese, ketchup, and mustard',
          price: 800,
          category: 'Burgers',
          image: 'https://source.unsplash.com/random/300x200/?cheeseburger'
        }
      ]
    },
    {
      id: '2',
      name: 'Pizza Hut',
      cuisine: 'Italian • Pizza',
      image: 'https://source.unsplash.com/random/300x200/?pizza',
      rating: 4.5,
      deliveryTime: '30-45 min',
      menuItems: [
        {
          id: '201',
          name: 'Pepperoni Pizza',
          description: 'Classic pepperoni pizza with mozzarella cheese',
          price: 1800,
          category: 'Pizzas',
          image: 'https://source.unsplash.com/random/300x200/?pepperoni+pizza'
        },
        {
          id: '202',
          name: 'Vegetarian Pizza',
          description: 'Mixed vegetables with mozzarella cheese',
          price: 1600,
          category: 'Pizzas',
          image: 'https://source.unsplash.com/random/300x200/?vegetarian+pizza'
        }
      ]
    }
    // ... (same as before)
  ];

  // Sample order history
  const sampleOrders = [
    {
      id: 'ORD-001',
      date: '2023-06-15T12:30:00Z',
      restaurants: [
        {
          id: '1',
          name: 'Burger King',
          items: [
            { id: '101', name: 'Whopper Meal', quantity: 2, price: 1200 },
            { id: '102', name: 'Cheeseburger', quantity: 1, price: 800 }
          ],
          status: 'delivered',
          subtotal: 3200
        }
      ],
      totalAmount: 3200,
      status: 'delivered',
      deliveryPerson: 'John D.'
    },
    {
      id: 'ORD-002',
      date: '2023-06-18T18:45:00Z',
      restaurants: [
        {
          id: '1',
          name: 'Burger King',
          items: [
            { id: '102', name: 'Cheeseburger', quantity: 3, price: 800 }
          ],
          status: 'delivered',
          subtotal: 2400
        },
        {
          id: '2',
          name: 'Pizza Hut',
          items: [
            { id: '201', name: 'Pepperoni Pizza', quantity: 1, price: 1800 }
          ],
          status: 'delivered',
          subtotal: 1800
        }
      ],
      totalAmount: 4200,
      status: 'delivered',
      deliveryPerson: 'Sarah M.'
    }
    // ... (same as before)
  ];

  useEffect(() => {
    // Load sample orders
    setOrders(sampleOrders);
  }, []);

  const addToCart = (restaurantId, item) => {
    setCart(prevCart => {
      // Check if we already have items from this restaurant
      const restaurantInCart = prevCart.find(r => r.restaurantId === restaurantId);
      
      if (restaurantInCart) {
        // Check if item already exists in cart
        const existingItem = restaurantInCart.items.find(i => i.id === item.id);
        
        if (existingItem) {
          // Increase quantity
          return prevCart.map(r => 
            r.restaurantId === restaurantId
              ? {
                  ...r,
                  items: r.items.map(i => 
                    i.id === item.id 
                      ? { ...i, quantity: i.quantity + 1 } 
                      : i
                  )
                }
              : r
          );
        } else {
          // Add new item to existing restaurant
          return prevCart.map(r => 
            r.restaurantId === restaurantId
              ? { ...r, items: [...r.items, { ...item, quantity: 1 }] }
              : r
          );
        }
      } else {
        // Add new restaurant with this item
        return [
          ...prevCart,
          {
            restaurantId,
            restaurantName: restaurants.find(r => r.id === restaurantId).name,
            items: [{ ...item, quantity: 1 }]
          }
        ];
      }
    });
  };

  const updateQuantity = (restaurantId, itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(r => 
        r.restaurantId === restaurantId
          ? {
              ...r,
              items: r.items.map(i => 
                i.id === itemId 
                  ? { ...i, quantity: newQuantity } 
                  : i
              )
            }
          : r
      )
    );
  };

  const removeFromCart = (restaurantId, itemId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(r => 
        r.restaurantId === restaurantId
          ? {
              ...r,
              items: r.items.filter(i => i.id !== itemId)
            }
          : r
      );
      
      // Remove restaurant if no items left
      return updatedCart.filter(r => r.items.length > 0);
    });
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, restaurant) => {
      const restaurantTotal = restaurant.items.reduce((subtotal, item) => {
        return subtotal + (item.price * item.quantity);
      }, 0);
      return total + restaurantTotal;
    }, 0);
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      restaurants: cart.map(restaurant => ({
        id: restaurant.restaurantId,
        name: restaurant.restaurantName,
        items: restaurant.items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        status: 'preparing',
        subtotal: restaurant.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      })),
      totalAmount: calculateCartTotal(),
      status: 'processing',
      deliveryPerson: ''
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setActiveTab('order-confirmation');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'menu':
        return (
          <Menu 
            restaurants={restaurants} 
            onAddToCart={addToCart}
            onBackToRestaurants={() => setActiveTab('menu')}
          />
        );
      case 'cart':
        return (
          <Cart
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onPlaceOrder={placeOrder}
            onBrowseRestaurants={() => setActiveTab('menu')}
            deliveryAddress={deliveryAddress}
            deliveryInstructions={deliveryInstructions}
            paymentMethod={paymentMethod}
            onAddressChange={setDeliveryAddress}
            onInstructionsChange={setDeliveryInstructions}
            onPaymentMethodChange={setPaymentMethod}
          />
        );
      case 'order-confirmation':
        return renderOrderConfirmation();
      case 'orders':
        return (
          <MyOrders
            orders={orders}
            selectedOrder={selectedOrder}
            onSelectOrder={setSelectedOrder}
            onBrowseRestaurants={() => setActiveTab('menu')}
            paymentMethod={paymentMethod}
          />
        );
      default:
        if (activeTab.startsWith('menu-')) {
          const restaurantId = activeTab.split('-')[1];
          return (
            <Menu 
              restaurants={restaurants} 
              onAddToCart={addToCart}
              onBackToRestaurants={() => setActiveTab('menu')}
              initialRestaurantId={restaurantId}
            />
          );
        }
        return null;
    }
  };

  const renderOrderConfirmation = () => {
    const latestOrder = orders[0];
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto">
        <FiCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">Your order #{latestOrder.id} has been placed successfully.</p>
        
        <div className="text-left space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Number</span>
            <span className="font-medium">#{latestOrder.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time</span>
            <span className="font-medium">{new Date(latestOrder.date).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-medium">Rs. {latestOrder.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium">
              {paymentMethod === 'credit_card' ? 'Credit/Debit Card' : 
               paymentMethod === 'payhere' ? 'PayHere' : 'Cash on Delivery'}
            </span>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">Restaurants in your order:</h3>
          <div className="space-y-3">
            {latestOrder.restaurants.map(restaurant => (
              <div key={restaurant.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">{restaurant.name}</span>
                <StatusBadge status={restaurant.status} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setActiveTab('orders');
              setSelectedOrder(latestOrder.id);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Order Details
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className="bg-white text-blue-600 px-6 py-2 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  };

  const cartItemCount = cart.reduce((sum, r) => sum + r.items.length, 0);

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      cartItemCount={cartItemCount}
    >
      {renderActiveTab()}
    </Layout>
  );
};

export default Order;