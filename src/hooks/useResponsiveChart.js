import { useEffect, useState } from 'react';

const getWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 1200);

export const useResponsiveChart = () => {
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = width <= 480;
  const isTablet = width <= 768;
  const isSmall = width <= 1024;

  return {
    width,
    isMobile,
    isTablet,
    isSmall,
    tick: isMobile ? 9 : isTablet ? 10 : 11,
    tickSmall: isMobile ? 8 : isTablet ? 9 : 10,
    yAxisWidth: isMobile ? 44 : isTablet ? 56 : 72,
    barSize: isMobile ? 7 : isTablet ? 9 : 12,
    pieRadius: isMobile ? 52 : isTablet ? 72 : 90,
    chartMargin: isMobile
      ? { top: 8, right: 6, left: -12, bottom: 0 }
      : isTablet
        ? { top: 10, right: 12, left: -4, bottom: 4 }
        : { top: 12, right: 16, left: 4, bottom: 5 },
    axisMargin: isMobile
      ? { top: 8, right: 8, left: 0, bottom: 0 }
      : { top: 10, right: 16, left: 0, bottom: 5 },
    legendProps: isMobile
      ? { verticalAlign: 'bottom', align: 'center', wrapperStyle: { fontSize: 10, paddingTop: 8 } }
      : { wrapperStyle: { fontSize: 11 } },
    showDualAxis: !isMobile,
  };
};

export default useResponsiveChart;
