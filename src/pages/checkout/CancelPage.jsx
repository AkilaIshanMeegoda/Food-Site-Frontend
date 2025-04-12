import React from 'react';

const Cancel = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-red-700 mb-4 text-center">
          Payment Cancelled
        </h1>
        <p className="text-gray-700 text-lg mb-6 text-center">
          Your payment process was cancelled. Please try again or contact support if you need assistance.
        </p>
        <div className="flex justify-center mb-6">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="flex justify-center">
          <a
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
