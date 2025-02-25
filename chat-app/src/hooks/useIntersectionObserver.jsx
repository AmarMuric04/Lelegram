import { useEffect, useState, useRef } from "react";

const useIntersectionObserver = ({
  threshold = 0.1,
  root = null,
  rootMargin = "0px",
} = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { root, rootMargin, threshold }
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin]);

  return { targetRef, isIntersecting };
};

export default useIntersectionObserver;
