import React, { useEffect, useState, useRef } from "react";
import diet from "../../../images/dietFood.png";

const FoodDescription = () => {
  const targetFoodDelivered = 10000;
  const targetSatisfied = 5000;
  const targetExperience = 25;

  const [foodDelivered, setFoodDelivered] = useState(9874);
  const [satisfied, setSatisfied] = useState(2034);
  const [experience, setExperience] = useState(22);
  const [startCounting, setStartCounting] = useState(false);
  
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStartCounting(true);
        }
      },
      { threshold: 0.5 } 
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!startCounting) return;

    const duration = 1500; 
    const intervalTime = 50;
    const steps = duration / intervalTime;

    const incrementValues = {
      foodDelivered: (targetFoodDelivered - 9874) / steps,
      satisfied: (targetSatisfied - 2034) / steps,
      experience: (targetExperience - 22) / steps,
    };

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setFoodDelivered((prev) =>
        Math.min(targetFoodDelivered, Math.floor(prev + incrementValues.foodDelivered))
      );
      setSatisfied((prev) =>
        Math.min(targetSatisfied, Math.floor(prev + incrementValues.satisfied))
      );
      setExperience((prev) =>
        Math.min(targetExperience, Math.floor(prev + incrementValues.experience))
      );

      if (count >= steps) {
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [startCounting]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-between p-10 bg-white md:flex-row">
      <div className="relative flex justify-center w-full md:w-1/2">
        <img
          src={diet}
          alt="Healthy Food"
          className="w-full max-w-md rounded-lg"
        />
      </div>

      <div className="w-full mt-8 text-center md:w-1/2 md:mt-0 md:text-left mr-28">
        <h2 className="text-4xl font-bold text-main-color">
          Food Is An Important Part Of A Balanced Diet
        </h2>
        <p className="mt-4 text-gray-600">
          A balanced diet provides your body with essential nutrients, vitamins, and minerals 
          that are crucial for maintaining good health and well-being.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6 md:justify-start">
          <div className="p-4 text-center bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-orange-500">{foodDelivered}+</h3>
            <p className="text-gray-700">Food Delivered</p>
          </div>
          <div className="p-4 text-center bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-orange-500">{satisfied}+</h3>
            <p className="text-gray-700">Satisfied Customers</p>
          </div>
          <div className="p-4 text-center bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-orange-500">{experience}+</h3>
            <p className="text-gray-700">Years of Experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDescription;
