import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Mobile gesture detection
export function useMobileGestures() {
  const [touchStart, setTouchStart] = React.useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const getSwipeDirection = () => {
    if (!touchStart || !touchEnd) return null;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isUpSwipe = distanceY > 50;
    const isDownSwipe = distanceY < -50;

    if (isLeftSwipe && Math.abs(distanceX) > Math.abs(distanceY)) {
      return 'left';
    }
    if (isRightSwipe && Math.abs(distanceX) > Math.abs(distanceY)) {
      return 'right';
    }
    if (isUpSwipe && Math.abs(distanceY) > Math.abs(distanceX)) {
      return 'up';
    }
    if (isDownSwipe && Math.abs(distanceY) > Math.abs(distanceX)) {
      return 'down';
    }
    return null;
  };

  return {
    onTouchStart,
    onTouchMove,
    getSwipeDirection,
    touchStart,
    touchEnd,
  };
}

// Haptic feedback for mobile
export function useHapticFeedback() {
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const lightTap = () => vibrate(50);
  const mediumTap = () => vibrate(100);
  const heavyTap = () => vibrate([100, 50, 100]);

  return {
    lightTap,
    mediumTap,
    heavyTap,
    vibrate,
  };
}
