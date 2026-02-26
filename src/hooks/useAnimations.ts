import { useEffect, useRef } from "react";
import {
  observeElements,
  debounce,
  throttle,
  lazyLoadImages,
} from "@/utils/animations";

/**
 * Hook to initialize scroll animations
 */
export const useScrollAnimation = (selector: string = ".fade-in") => {
  useEffect(() => {
    const observer = observeElements(selector);
    return () => observer?.disconnect();
  }, [selector]);
};

/**
 * Hook to debounce resize events
 */
export const useWindowResize = (callback: () => void, delay: number = 250) => {
  useEffect(() => {
    const debouncedResize = debounce(callback, delay);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, [callback, delay]);
};

/**
 * Hook to throttle scroll events
 */
export const useWindowScroll = (callback: () => void, limit: number = 100) => {
  useEffect(() => {
    const throttledScroll = throttle(callback, limit);
    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [callback, limit]);
};

/**
 * Hook to initialize lazy loading for images
 */
export const useLazyLoadImages = () => {
  useEffect(() => {
    lazyLoadImages();
  }, []);
};

/**
 * Hook to animate elements on entry
 */
export const useAnimateOnEntry = (ref: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__animated");
          entry.target.classList.add("animate__fadeInUp");
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
};
