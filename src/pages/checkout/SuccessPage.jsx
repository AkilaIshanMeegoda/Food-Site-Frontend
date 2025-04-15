import React from 'react';

const Success = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-4 text-center">
          Payment Successful!
        </h1>
        <p className="text-gray-700 text-lg mb-6 text-center">
          Thank you for your purchase. Your transaction was processed successfully.
        </p>
        <div className="flex justify-center mb-6">
          <svg
            className="w-16 h-16 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414L9 13.414l4.707-4.707z"
              clipRule="evenodd"
            />
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

export default Success;
