import { useState, useRef, useEffect } from "react";

export const useObserveElementWidth = <T extends HTMLElement>() => {
    const [width, setWidth] = useState(0);
    const ref = useRef<T>(null);
    useEffect(() => {
      const node = ref.current;
      const observer = new ResizeObserver((entries) => {
        setWidth(entries[0].contentRect.width);
      });
      if (node) {
        observer.observe(node);
      }
      return () => {
         if (node) {
           observer.unobserve(node);
         }
      };
    }, []);
    return {
        width,
        ref
    };
};