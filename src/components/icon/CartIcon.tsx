interface CartIconProps {
  svgProps?: React.SVGProps<SVGSVGElement>;
  pathProps?: React.SVGProps<SVGPathElement>;
}

export default function CartIcon({ svgProps, pathProps }: CartIconProps) {
  return (
    <svg width="35" height="43" viewBox="0 0 35 43" fill="none" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      <path
        d="M10.7315 10.4583H8.16537C5.79804 10.4583 3.83262 12.2471 3.66479 14.5614L2.05271 36.6447C1.86721 39.1998 3.93641 41.375 6.55329 41.375H28.4467C31.0636 41.375 33.1328 39.1998 32.9473 36.6447L31.3352 14.5614C31.1674 12.2471 29.202 10.4583 26.8346 10.4583H24.2685M10.7315 10.4583V6.04167C10.7315 3.60146 12.7521 1.625 15.2431 1.625H19.7569C22.2479 1.625 24.2685 3.60146 24.2685 6.04167V10.4583M10.7315 10.4583H24.2685"
        stroke="black"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...pathProps}
      />
    </svg>
  );
}
