interface FavoriteIconProps {
  svgProps?: React.SVGProps<SVGSVGElement>;
  pathProps?: React.SVGProps<SVGPathElement>;
}

export default function Favorite({ svgProps, pathProps }: FavoriteIconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      <path d="M40 80L34.2 74.2452C13.6 53.8856 0 40.4578 0 23.9782C0 10.5504 9.68 0 22 0C28.96 0 35.64 3.53134 40 9.11172C44.36 3.53134 51.04 0 58 0C70.32 0 80 10.5504 80 23.9782C80 40.4578 66.4 53.8856 45.8 74.2888L40 80Z" fill="#FF0000" {...pathProps} />
    </svg>
  );
}
