import React from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import './AnimatedSection.css';

export default function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0,
  animation = 'fadeUp',
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px'
}) {
  const { ref, isVisible } = useIntersectionObserver({ threshold, rootMargin });

  return (
    <div 
      ref={ref} 
      className={`animated-section ${isVisible ? `animate-${animation} visible` : ''} ${className}`}
      style={{ animationDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}