import { useEffect, useRef, useState } from 'react';

/**
 * Hook: devuelve [ref, isInView].
 * Pone ref en el elemento que querés observar.
 * isInView pasa a true cuando el elemento entra en pantalla.
 * Si once=true (default), queda true para siempre después del primer trigger.
 */
export function useInView({ threshold = 0.15, rootMargin = "0px", once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback para navegadores sin IntersectionObserver (muy raros ya)
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
