import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

const ImageScroller = ({ imageLinks }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const filteredImageLinks = imageLinks.filter(Boolean);

  useEffect(() => {
    if (filteredImageLinks.length <= 1) return; // Don't set interval if there's only one image

    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % filteredImageLinks.length);
        setTransitioning(false);
      }, 100); // duration of the transition
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [filteredImageLinks]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (filteredImageLinks.length <= 1) return; // Don't handle swipe if there's only one image

      setTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % filteredImageLinks.length);
        setTransitioning(false);
      }, 300);
    },
    onSwipedRight: () => {
      if (filteredImageLinks.length <= 1) return; // Don't handle swipe if there's only one image

      setTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + filteredImageLinks.length) % filteredImageLinks.length);
        setTransitioning(false);
      }, 300);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div className="relative sm:flex-none items-center justify-center">
      <img
        src={filteredImageLinks[currentImageIndex]}
        alt="Scrolling Image"
        className={` sm:max-h-64   sm:max-w-screen-xs rounded ${transitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...handlers}
      />
      { filteredImageLinks.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {filteredImageLinks.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer ${index === currentImageIndex ? 'bg-black' : 'bg-gray-400'}`}
              onClick={() => setCurrentImageIndex(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageScroller;
