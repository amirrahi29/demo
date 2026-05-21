const MiniSparkline = ({ data = [4, 6, 3, 8, 5, 9, 7], color = '#00b2a9', width = 60, height = 20 }) => {
  if (!data.length) return <span className="tealium-sparkline tealium-sparkline-empty" />;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * (height - 2) - 1;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="tealium-sparkline-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" points={points} />
    </svg>
  );
};

export default MiniSparkline;
