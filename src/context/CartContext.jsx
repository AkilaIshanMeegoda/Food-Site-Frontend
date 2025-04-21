// src/context/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: ''
};

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : initialState;
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return initialState;
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const cartReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case 'ADD_TO_CART':
      // Check if we're adding from a different restaurant
      if (state.restaurantId && state.restaurantId !== action.payload.restaurantId && state.items.length > 0) {
        return {
          items: [{ ...action.payload.item, quantity: action.payload.quantity || 1 }],
          restaurantId: action.payload.restaurantId,
          restaurantName: action.payload.restaurantName
        };
      }
      
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(
        item => item._id === action.payload.item._id
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity || 1;
        
        newState = {
          ...state,
          items: updatedItems
        };
      } else {
        // Add new item
        newState = {
          items: [...state.items, { ...action.payload.item, quantity: action.payload.quantity || 1 }],
          restaurantId: action.payload.restaurantId || state.restaurantId,
          restaurantName: action.payload.restaurantName || state.restaurantName
        };
      }
      break;
      
    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        items: state.items.filter(item => item._id !== action.payload.itemId)
      };
      break;
      
    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items.map(item => 
          item._id === action.payload.itemId 
            ? { ...item, quantity: action.payload.quantity } 
            : item
        )
      };
      break;
      
    case 'CLEAR_CART':
      newState = initialState;
      break;
      
    default:
      return state;
  }
  
  // Save to localStorage after every change
  saveCartToStorage(newState);
  return newState;
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState, loadCartFromStorage);
  
  // Calculate total amount
  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Add item to cart
  const addToCart = (item, restaurantId, restaurantName, quantity = 1) => {
    if (cart.restaurantId && cart.restaurantId !== restaurantId && cart.items.length > 0) {
      if (!window.confirm("Adding items from a different restaurant will clear your current cart. Continue?")) {
        return false;
      }
    }
    
    dispatch({
      type: 'ADD_TO_CART',
      payload: { item, restaurantId, restaurantName, quantity }
    });
    
    return true;
  };
  
  // Remove item from cart
  const removeFromCart = (itemId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { itemId }
    });
  };
  
  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { itemId, quantity }
    });
  };
  
  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        totalAmount: calculateTotal(),
        itemCount: cart.items.reduce((count, item) => count + item.quantity, 0)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
