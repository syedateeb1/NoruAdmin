import type { SVGProps } from "react";

type SVGPropsType = SVGProps<SVGSVGElement>;

export function Views(props: SVGPropsType) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <circle cx={29} cy={29} r={29} fill="#3FD97F" />
      <path
        d="M26.562 29a2.437 2.437 0 114.875 0 2.437 2.437 0 01-4.875 0z"
        fill="#fff"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.166 29c0 1.776.46 2.374 1.382 3.57 1.838 2.389 4.922 5.097 9.452 5.097s7.614-2.708 9.452-5.096c.92-1.197 1.381-1.795 1.381-3.57 0-1.777-.46-2.375-1.381-3.571-1.838-2.389-4.922-5.096-9.452-5.096s-7.614 2.707-9.452 5.096c-.921 1.196-1.381 1.794-1.381 3.57zM29 24.938a4.063 4.063 0 100 8.125 4.063 4.063 0 000-8.125z"
        fill="#fff"
      />
    </svg>
  );
}

export function Profit(props: SVGPropsType) {
  return (
    <svg className="w-10 h-10 text-[#f5bb1d] dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2" />
    </svg>

  );
}

export function Product(props: SVGPropsType) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <circle cx={29} cy={29} r={29} fill="#8155FF" />
      <path
        d="M35.043 20.8l-2.167-1.136c-1.902-.998-2.853-1.498-3.876-1.498-1.023 0-1.974.5-3.876 1.498L22.958 20.8c-1.922 1.008-3.051 1.6-3.752 2.394L29 28.09l9.794-4.896c-.7-.793-1.83-1.386-3.751-2.394zM39.56 24.628l-9.747 4.874v10.227c.777-.194 1.662-.658 3.063-1.393l2.167-1.137c2.33-1.223 3.496-1.835 4.143-2.934.647-1.099.647-2.467.647-5.202v-.127c0-2.05 0-3.332-.272-4.308zM28.188 39.73V29.501l-9.749-4.874c-.272.976-.272 2.258-.272 4.308v.127c0 2.735 0 4.103.647 5.202.647 1.1 1.813 1.71 4.144 2.934l2.166 1.137c1.4.735 2.286 1.2 3.064 1.393z"
        fill="#fff"
      />
    </svg>
  );
}

export function Users(props: SVGPropsType) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <circle cx={29} cy={29} r={29} fill="#18BFFF" />
      <ellipse
        cx={25.7511}
        cy={22.4998}
        rx={4.33333}
        ry={4.33333}
        fill="#fff"
      />
      <ellipse
        cx={25.7511}
        cy={34.4178}
        rx={7.58333}
        ry={4.33333}
        fill="#fff"
      />
      <path
        d="M38.75 34.417c0 1.795-2.206 3.25-4.898 3.25.793-.867 1.339-1.955 1.339-3.248 0-1.295-.547-2.384-1.342-3.252 2.693 0 4.9 1.455 4.9 3.25zM35.5 22.501a3.25 3.25 0 01-4.364 3.054 6.163 6.163 0 00.805-3.055c0-1.11-.293-2.152-.804-3.053A3.25 3.25 0 0135.5 22.5z"
        fill="#fff"
      />
    </svg>
  );
}

export function AdminUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      {/* Circle background - gold color */}
      <circle cx={29} cy={29} r={29} fill="#F59E0B" />

      {/* Head */}
      <ellipse cx={25.7511} cy={22.4998} rx={4.33333} ry={4.33333} fill="#fff" />

      {/* Body */}
      <ellipse cx={25.7511} cy={34.4178} rx={7.58333} ry={4.33333} fill="#fff" />

      {/* Secondary head and body (admin's second person / partner / team) */}
      <path
        d="M38.75 34.417c0 1.795-2.206 3.25-4.898 3.25.793-.867 1.339-1.955 1.339-3.248 0-1.295-.547-2.384-1.342-3.252 2.693 0 4.9 1.455 4.9 3.25zM35.5 22.501a3.25 3.25 0 01-4.364 3.054 6.163 6.163 0 00.805-3.055c0-1.11-.293-2.152-.804-3.053A3.25 3.25 0 0135.5 22.5z"
        fill="#fff"
      />

      {/* Crown for admin (above the head) */}
      <path
        d="M22.5 15l2 3 2-3 2 3 2-3v5h-8v-5z"
        fill="#fff"
      />
    </svg>
  );
}
