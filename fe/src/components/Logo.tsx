import { JSX } from "solid-js";

export function Logo(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 2.667A2.667 2.667 0 012.667 0h18.666A2.667 2.667 0 0124 2.667v18.666A2.667 2.667 0 0121.333 24H2.667A2.667 2.667 0 010 21.333V2.667z"
        fill="#0094FF"
      />
      <path
        d="M6.654 8.687V6.14h10.114v2.546h-3.5v9.09h-3.114v-9.09h-3.5z"
        fill="#fff"
      />
    </svg>
  );
}

