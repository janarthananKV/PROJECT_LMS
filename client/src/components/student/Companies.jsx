import React, { useEffect, useRef } from 'react';
import { assets } from '../../assets/assets';

const Companies = () => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const ul = container.querySelector('ul');

    // Clone the original list to create a seamless loop
    const cloned = ul.cloneNode(true);
    cloned.setAttribute('aria-hidden', 'true');
    container.appendChild(cloned);
  }, []);

  return (
    <div className='pt-16'>
      <p className='text-base text-gray-500 text-center mb-4'>
        Trusted by learners from
      </p>

      {/* Gradient mask wrapper with 65% width and center alignment */}
      <div className="w-[65%] mx-auto overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_80px,_black_calc(100%-80px),transparent_100%)]">
        {/* Scrolling content */}
        <div
          ref={scrollContainerRef}
          className='inline-flex flex-nowrap'
        >
          <ul className="flex items-center [&_li]:mx-6 md:[&_li]:mx-12 [&_img]:max-w-none animate-loop-scroll">
            <li><img src={assets.microsoft_logo} alt="Microsoft" className='w-20 md:w-28' /></li>
            <li><img src={assets.walmart_logo} alt="Walmart" className='w-20 md:w-28' /></li>
            <li><img src={assets.accenture_logo} alt="Accenture" className='w-20 md:w-28' /></li>
            <li><img src={assets.adobe_logo} alt="Adobe" className='w-20 md:w-28' /></li>
            <li><img src={assets.paypal_logo} alt="PayPal" className='w-20 md:w-28' /></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Companies;
