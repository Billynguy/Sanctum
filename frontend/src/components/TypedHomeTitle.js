import React, { useRef, useEffect } from 'react';
import Typed from 'typed.js';

const TypedHomeTitle = () => {
  const typedElement = useRef(null);

  useEffect(() => {
    const options = {
      strings: ["Welcome to Sanctum."],
      typeSpeed: 40,
      loop: false,
      showCursor: false
    };

    if (typedElement.current) {
      const typed = new Typed(typedElement.current, options);

      return () => {
        typed.destroy();
      };
    }
  }, []);

  return <h1 ref={typedElement} style={{ fontSize: '96px' }}></h1>;
};

export default TypedHomeTitle;
