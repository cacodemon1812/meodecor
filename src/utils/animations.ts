/**
 * Intersection Observer utility for smooth fade-in animations on scroll
 * Optimized for performance with minimal redraws
 */

export const observeElements = (selector: string = ".fade-in") => {
  if (typeof window === "undefined") return;

  const options: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, options);

  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => observer.observe(element));

  return observer;
};

/**
 * Smooth scroll utility with performance optimization
 */
export const smoothScroll = (element: HTMLElement, offset: number = 80) => {
  if (!element) return;

  const targetPosition = element.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 1000;
  let start: number | null = null;

  const ease = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const animation = (currentTime: number) => {
    if (start === null) start = currentTime;
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    window.scrollTo(0, startPosition + distance * ease(progress));

    if (elapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

/**
 * Debounce utility to optimize frequent function calls
 */
export const debounce = (
  func: (...args: any[]) => void,
  delay: number,
): ((...args: any[]) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle utility to optimize scroll and resize events
 */
export const throttle = (
  func: (...args: any[]) => void,
  limit: number,
): ((...args: any[]) => void) => {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;

  return (...args: any[]) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
};

/**
 * Lazy load images for better performance
 */
export const lazyLoadImages = () => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window))
    return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || "";
        img.classList.add("loaded");
        imageObserver.unobserve(img);
      }
    });
  });

  document
    .querySelectorAll("img[data-src]")
    .forEach((img) => imageObserver.observe(img));
};

/**
 * Prefetch links for faster navigation
 */
export const prefetchLinks = () => {
  if (typeof document === "undefined") return;

  const links = document.querySelectorAll("a[href^='/']");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href) {
      const link_element = document.createElement("link");
      link_element.rel = "prefetch";
      link_element.href = href;
      document.head.appendChild(link_element);
    }
  });
};
