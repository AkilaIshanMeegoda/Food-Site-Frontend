import {
    MapPin,
    Utensils,
    CreditCard,
    UtensilsCrossed,
  } from "lucide-react";
  
  const steps = [
    {
      number: 1,
      title: "Select your Restaurant",
      icon: MapPin,
      description: "Choose from our wide variety of restaurants",
    },
    {
      number: 2,
      title: "Select your Dish",
      icon: Utensils,
      description: "Pick your favorite dishes from the menu",
    },
    {
      number: 3,
      title: "Pay Cash/Online",
      icon: CreditCard,
      description: "Easy and secure payment options",
    },
    {
      number: 4,
      title: "Enjoy Your Meal",
      icon: UtensilsCrossed,
      description: "Your delicious meal is served",
    },
  ];
  
  const OrderSteps = () => {
    return (
      <div className="relative py-20 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="mb-20 text-4xl font-bold text-center text-gray-900">
            Easy Order Steps
          </h2>
  
          {/* Curved SVG Line */}
          <svg
            className="absolute hidden md:block top-[134px] left-20 w-full z-0"
            height="200"
          >
            <path
              d="M100 100 C 300 0, 500 200, 700 100 C 900 0, 1100 200, 1300 100"
              stroke="#f97316"
              strokeWidth="6"
              fill="none"
            />
          </svg>
  
          <div className="relative grid grid-cols-1 gap-20 md:grid-cols-4 z-10">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Number Circle */}
                <div className="flex items-center justify-center w-16 h-16 mb-4 text-2xl font-bold text-white bg-orange-500 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                  {step.number}
                </div>
  
                {/* Icon */}
                <div className="flex items-center justify-center w-20 h-20 mb-4 bg-orange-100 rounded-full shadow-inner">
                  <step.icon className="w-10 h-10 text-orange-500" />
                </div>
  
                {/* Text */}
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default OrderSteps;
  