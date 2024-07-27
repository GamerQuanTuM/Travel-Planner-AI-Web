"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CarouselOne from "@/assets/Carousel/carousel-1.jpg";
import CarouselTwo from "@/assets/Carousel/carousel-2.jpg";
import CarouselThree from "@/assets/Carousel/carousel-3.jpg";
import CarouselFour from "@/assets/Carousel/carousel-4.jpg";
import CarouselFive from "@/assets/Carousel/carousel-5.jpg";

const images = [
  { src: CarouselOne, heading: 'Explore the World', subheading: 'Find the best destinations and create unforgettable experiences.' },
  { src: CarouselTwo, heading: 'Personalized Itineraries', subheading: 'Get custom plans based on your interests and budget.' },
  { src: CarouselThree, heading: 'Hotel Recommendations', subheading: 'Discover the perfect stay for every trip.' },
  { src: CarouselFour, heading: 'Flight Suggestions', subheading: 'Find the best flights for your journey.' },
  { src: CarouselFive, heading: 'Daily Itineraries', subheading: 'Plan your days with detailed travel activities.' }
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[30rem] overflow-hidden">
      <div className="flex transition-transform duration-1000 ease-in-out"
           style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div className="relative w-full h-full flex-shrink-0" key={index}>
            <Image 
              src={image.src} 
              alt={`Slide ${index + 1}`} 
              className="object-cover w-full h-full"
              height={2500}
              width={2500}
            />
            <div className="absolute inset-0 flex flex-col items-center py-52 text-center text-white bg-black bg-opacity-50 gap-4">
              <h2 className="text-6xl font-bold mb-2">{image.heading}</h2>
              <p className="text-4xl font-medium">{image.subheading}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
