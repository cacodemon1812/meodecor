/**
 * useGalleryIntersection Hook
 * Handles smooth fade-in animations as gallery items enter the viewport
 */

import { useEffect, useRef, useState } from "react";

interface UseGalleryIntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useGalleryIntersection = (
  options: UseGalleryIntersectionOptions = {},
) => {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};

/**
 * useImageLoad Hook
 * Tracks image loading state with error handling
 */
export const useImageLoad = (src?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();

    const handleLoad = () => {
      setIsLoading(false);
      setIsError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setIsError(true);
    };

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);
    img.src = src;

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [src]);

  return { isLoading, isError };
};

/**
 * useLazyImages Hook
 * Lazy loads images with intersection observer
 */
export const useLazyImages = (selector: string = "[data-lazy]") => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const images = document.querySelectorAll<HTMLImageElement>(selector);
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;

          if (src) {
            img.src = src;
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));

    return () => {
      images.forEach((img) => imageObserver.unobserve(img));
    };
  }, [selector]);
};

/**
 * useGalleryAnimation Hook
 * Handles global gallery animation states and timings
 */
export const useGalleryAnimation = () => {
  const [animationLoaded, setAnimationLoaded] = useState(false);

  useEffect(() => {
    // Slight delay to ensure smooth initial load
    const timer = setTimeout(() => {
      setAnimationLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { animationLoaded };
};

/**
 * useFilterAnimation Hook
 * Handles smooth transitions when filtering gallery items
 */
export const useFilterAnimation = (activeFilter: string) => {
  const [prevFilter, setPrevFilter] = useState(activeFilter);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (activeFilter !== prevFilter) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setPrevFilter(activeFilter);
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [activeFilter, prevFilter]);

  return { isTransitioning, shouldRender: prevFilter === activeFilter };
};

/**
 * useResize Hook
 * Tracks window resize for responsive gallery layouts
 */
export const useResize = (
  callback?: (width: number, height: number) => void,
) => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      callback?.(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [callback]);

  return dimensions;
};

/**
 * usePrefersReducedMotion Hook
 * Respects user's motion preferences for accessibility
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
};
