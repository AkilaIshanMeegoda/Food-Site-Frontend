import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const Success = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4 py-10">
      <div className="bg-white border border-gray-100 shadow-md rounded-2xl max-w-lg w-full p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-green-700 mb-3">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-md mb-6">
          Thank you for your purchase. Your transaction was completed successfully.
        </p>

        <a
          href="/order"
          className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go to My Orders
        </a>
      </div>
    </div>
  );
};

export default Success;
