import { useEffect } from 'react';

/**
 * @param {Object} param0 useintersection parametres
 * @param {import('react').ElementRef} param0.refElement the element to observe
 * @param {(entries: Array, observer: any) => void} [param0.callback=null]
 * @returns {void}
 */
export default function useIntersection({ refElement, callback = null }) {
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    };
    function callback2(entries, observer) {
      const { intersectionRatio, isIntersecting, isVisible, time } = entries[0];
      if (callback2)
        return callback(
          {
            intersectionRatio,
            isIntersecting,
            isVisible,
            time,
          },
          observer
        );
      console.warn('unhandled observer');
      // console.log([intersectionRatio, isIntersecting, isVisible, time ])
      // console.log(observer);
    }
    var observer = new IntersectionObserver(callback2, options);
    refElement && observer.observe(refElement);
    return () => {
      observer.disconnect();
      observer = null;
    };
  }, [refElement]);
}
