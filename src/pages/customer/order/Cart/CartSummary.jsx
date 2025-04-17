// src/components/Cart/CartSummary.js
const CartSummary = ({ 
    subtotal, 
    deliveryFee, 
    tax, 
    total, 
    onPlaceOrder,
    deliveryAddress,
    deliveryInstructions,
    paymentMethod,
    onAddressChange,
    onInstructionsChange,
    onPaymentMethodChange
  }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => onAddressChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Instructions</label>
            <textarea
              value={deliveryInstructions}
              onChange={(e) => onInstructionsChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows="2"
              placeholder="Any special instructions for delivery?"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => onPaymentMethodChange('credit_card')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Credit/Debit Card</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={paymentMethod === 'payhere'}
                  onChange={() => onPaymentMethodChange('payhere')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">PayHere</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={paymentMethod === 'cash'}
                  onChange={() => onPaymentMethodChange('cash')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">Rs. {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (8%)</span>
              <span className="font-medium">Rs. {tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 mt-3 flex justify-between">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="font-bold text-lg text-blue-600">
                Rs. {total.toFixed(2)}
              </span>
            </div>
          </div>
          
          <button
            onClick={onPlaceOrder}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Place Order
          </button>
        </div>
      </div>
    );
  };
  
  export default CartSummary;