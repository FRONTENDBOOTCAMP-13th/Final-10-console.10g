interface FilterIconProps {
  svgProps?: React.SVGProps<SVGSVGElement>;
  pathProps?: React.SVGProps<SVGPathElement>;
}

export default function FilterIcon({ svgProps, pathProps }: FilterIconProps) {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      <path
        d="M22.9168 41.6668C22.3265 41.6668 21.8317 41.4672 21.4324 41.0679C21.0331 40.6686 20.8334 40.1738 20.8334 39.5835V27.0835L8.75009 11.6668C8.22925 10.9724 8.15113 10.2432 8.51571 9.47933C8.88029 8.71544 9.51398 8.3335 10.4168 8.3335H39.5834C40.4862 8.3335 41.1199 8.71544 41.4845 9.47933C41.849 10.2432 41.7709 10.9724 41.2501 11.6668L29.1668 27.0835V39.5835C29.1668 40.1738 28.9671 40.6686 28.5678 41.0679C28.1685 41.4672 27.6737 41.6668 27.0834 41.6668H22.9168ZM25.0001 25.6252L35.3126 12.5002H14.6876L25.0001 25.6252Z"
        fill="#A97452"
        {...pathProps}
      />
    </svg>
  );
}
