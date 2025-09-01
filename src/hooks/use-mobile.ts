import { useEffect, useState } from "react";

export const MOBILE_BREAKPOINT = 900;
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>();
  const isSmallScreen = useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
