interface TriangleIconProps {
  svgProps?: React.SVGProps<SVGSVGElement>;
  pathProps?: React.SVGProps<SVGPathElement>;
  polygonProps?: React.SVGProps<SVGPolygonElement>;
}

export default function TriangleIcon({ svgProps, polygonProps }: TriangleIconProps) {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      <polygon points="50,10 90,90 10,90" fill="black" {...polygonProps} />
    </svg>
  );
}
