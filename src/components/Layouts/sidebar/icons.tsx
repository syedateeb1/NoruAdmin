import { SVGProps } from "react";

export type PropsType = SVGProps<SVGSVGElement>;

export function ChevronUp(props: PropsType) {
  return (
    <svg
      width={16}
      height={8}
      viewBox="0 0 16 8"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.553.728a.687.687 0 01.895 0l6.416 5.5a.688.688 0 01-.895 1.044L8 2.155 2.03 7.272a.688.688 0 11-.894-1.044l6.417-5.5z"
      />
    </svg>
  );
}
export function WalletIcon(props: PropsType) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M20 7H5a2 2 0 0 1 0-4h15a1 1 0 0 1 0 2H5a.5.5 0 0 0 0 1h15a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7h18Zm0 2H4v10a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V9Zm-3 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
    </svg>
  );
}
export function HomeIcon(props: PropsType) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
  );
}


export function Calendar(props: PropsType) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M17 14a1 1 0 100-2 1 1 0 000 2zM17 18a1 1 0 100-2 1 1 0 000 2zM13 13a1 1 0 11-2 0 1 1 0 012 0zM13 17a1 1 0 11-2 0 1 1 0 012 0zM7 14a1 1 0 100-2 1 1 0 000 2zM7 18a1 1 0 100-2 1 1 0 000 2z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 1.75a.75.75 0 01.75.75v.763c.662-.013 1.391-.013 2.193-.013h4.113c.803 0 1.532 0 2.194.013V2.5a.75.75 0 011.5 0v.827c.26.02.506.045.739.076 1.172.158 2.121.49 2.87 1.238.748.749 1.08 1.698 1.238 2.87.153 1.14.153 2.595.153 4.433v2.112c0 1.838 0 3.294-.153 4.433-.158 1.172-.49 2.121-1.238 2.87-.749.748-1.698 1.08-2.87 1.238-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153-1.172-.158-2.121-.49-2.87-1.238-.748-.749-1.08-1.698-1.238-2.87-.153-1.14-.153-2.595-.153-4.433v-2.112c0-1.838 0-3.294.153-4.433.158-1.172.49-2.121 1.238-2.87.749-.748 1.698-1.08 2.87-1.238.233-.031.48-.056.739-.076V2.5A.75.75 0 017 1.75zM5.71 4.89c-1.005.135-1.585.389-2.008.812-.423.423-.677 1.003-.812 2.009-.023.17-.042.35-.058.539h18.336c-.016-.19-.035-.369-.058-.54-.135-1.005-.389-1.585-.812-2.008-.423-.423-1.003-.677-2.009-.812-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14zM2.75 12c0-.854 0-1.597.013-2.25h18.474c.013.653.013 1.396.013 2.25v2c0 1.907-.002 3.262-.14 4.29-.135 1.005-.389 1.585-.812 2.008-.423.423-1.003.677-2.009.812-1.027.138-2.382.14-4.289.14h-4c-1.907 0-3.261-.002-4.29-.14-1.005-.135-1.585-.389-2.008-.812-.423-.423-.677-1.003-.812-2.009-.138-1.027-.14-2.382-.14-4.289v-2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function User(props: PropsType) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></svg>
  );
}
export function Car(props: PropsType) {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-car-front-icon lucide-car-front"><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" /><path d="M7 14h.01" /><path d="M17 14h.01" /><rect width="18" height="8" x="3" y="10" rx="2" /><path d="M5 18v2" /><path d="M19 18v2" /></svg>);
}
export function WorldSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M21 12a9 9 0 1 0-9 9M3.6 9h16.8M3.6 15h7.9"></path>
        <path d="M11.5 3a17 17 0 0 0 0 18m1-18a17 17 0 0 1 2.574 8.62M15 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0m5.2 2.2L22 22"></path>
      </g>
    </svg>
  )
}
export function AlertWarningFill16(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M14.57 13.54L8.39 1.63c-.34-.67-1.43-.67-1.78 0L.43 13.54c-.16.31-.15.68.03.98s.51.48.86.48h12.36c.35 0 .67-.18.85-.48s.2-.67.04-.98M7 6c0-.28.22-.5.5-.5s.5.22.5.5v3.5c0 .28-.22.5-.5.5S7 9.78 7 9.5zm.5 7c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1"
      ></path>
    </svg>
  )
}
export function BaselineChatBubbleOutline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H6l-2 2V4h16z"
      ></path>
    </svg>
  )
}
export function SharpDirectionsCarFilled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M18.57 5H5.43L3 12v9h3v-2h12v2h3v-9zM7.5 16c-.83 0-1.5-.67-1.5-1.5S6.67 13 7.5 13s1.5.67 1.5 1.5S8.33 16 7.5 16m9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5M5.81 10l1.04-3h10.29l1.04 3z"
      ></path>
    </svg>
  )
}




export function Alphabet(props: PropsType) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.25 7A.75.75 0 013 6.25h10a.75.75 0 010 1.5H3A.75.75 0 012.25 7zm14.25-.75a.75.75 0 01.684.442l4.5 10a.75.75 0 11-1.368.616l-1.437-3.194H14.12l-1.437 3.194a.75.75 0 11-1.368-.616l4.5-10a.75.75 0 01.684-.442zm-1.704 6.364h3.408L16.5 8.828l-1.704 3.786zM2.25 12a.75.75 0 01.75-.75h7a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 5a.75.75 0 01.75-.75h5a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Table(props: PropsType) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.29 4.89c-1.028-.138-2.383-.14-4.29-.14h-4c-1.907 0-3.261.002-4.29.14-1.005.135-1.585.389-2.008.812-.423.423-.677 1.003-.812 2.009-.138 1.028-.14 2.382-.14 4.289 0 1.907.002 3.261.14 4.29.135 1.005.389 1.585.812 2.008.423.423 1.003.677 2.009.812 1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14 1.005-.135 1.585-.389 2.008-.812.423-.423.677-1.003.812-2.009.138-1.028.14-2.382.14-4.289 0-1.907-.002-3.261-.14-4.29-.135-1.005-.389-1.585-.812-2.008-.423-.423-1.003-.677-2.009-.812zm.199-1.487c1.172.158 2.121.49 2.87 1.238.748.749 1.08 1.698 1.238 2.87.153 1.14.153 2.595.153 4.433v.112c0 1.838 0 3.294-.153 4.433-.158 1.172-.49 2.121-1.238 2.87-.749.748-1.698 1.08-2.87 1.238-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153-1.172-.158-2.121-.49-2.87-1.238-.748-.749-1.08-1.698-1.238-2.87-.153-1.14-.153-2.595-.153-4.433v-.112c0-1.838 0-3.294.153-4.433.158-1.172.49-2.121 1.238-2.87.749-.748 1.698-1.08 2.87-1.238 1.14-.153 2.595-.153 4.433-.153h4.112c1.838 0 3.294 0 4.433.153zM8.25 17a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
      />
    </svg>
  );
}

export function PieChart(props: PropsType) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.254 1.365c-1.096-.306-2.122.024-2.851.695-.719.66-1.153 1.646-1.153 2.7v6.695a2.295 2.295 0 002.295 2.295h6.694c1.055 0 2.042-.434 2.701-1.153.67-.729 1.001-1.755.695-2.851a12.102 12.102 0 00-8.38-8.381zM11.75 4.76c0-.652.27-1.232.668-1.597.386-.355.886-.508 1.433-.355 3.55.991 6.349 3.79 7.34 7.34.153.548 0 1.048-.355 1.434-.365.397-.945.667-1.597.667h-6.694a.795.795 0 01-.795-.795V4.761z"
        fill="currentColor"
      />
      <path
        d="M8.672 4.716a.75.75 0 00-.45-1.432C4.183 4.554 1.25 8.328 1.25 12.79c0 5.501 4.46 9.961 9.96 9.961 4.462 0 8.236-2.932 9.505-6.973a.75.75 0 10-1.43-.45 8.465 8.465 0 01-8.074 5.923 8.46 8.46 0 01-8.461-8.46 8.465 8.465 0 015.922-8.074z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FourCircle(props: PropsType) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 1.75a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zM3.25 6.5a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zM17.5 12.75a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zm-3.25 4.75a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0zM12.75 6.5a4.75 4.75 0 119.5 0 4.75 4.75 0 01-9.5 0zm4.75-3.25a3.25 3.25 0 100 6.5 3.25 3.25 0 000-6.5zM6.5 12.75a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zM3.25 17.5a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Authentication(props: PropsType) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M14.945 1.25c-1.367 0-2.47 0-3.337.117-.9.12-1.658.38-2.26.981-.524.525-.79 1.17-.929 1.928-.135.737-.161 1.638-.167 2.72a.75.75 0 001.5.008c.006-1.093.034-1.868.142-2.457.105-.566.272-.895.515-1.138.277-.277.666-.457 1.4-.556.755-.101 1.756-.103 3.191-.103h1c1.436 0 2.437.002 3.192.103.734.099 1.122.28 1.4.556.276.277.456.665.555 1.4.102.754.103 1.756.103 3.191v8c0 1.435-.001 2.436-.103 3.192-.099.734-.279 1.122-.556 1.399-.277.277-.665.457-1.399.556-.755.101-1.756.103-3.192.103h-1c-1.435 0-2.436-.002-3.192-.103-.733-.099-1.122-.28-1.399-.556-.243-.244-.41-.572-.515-1.138-.108-.589-.136-1.364-.142-2.457a.75.75 0 10-1.5.008c.006 1.082.032 1.983.167 2.72.14.758.405 1.403.93 1.928.601.602 1.36.86 2.26.982.866.116 1.969.116 3.336.116h1.11c1.368 0 2.47 0 3.337-.116.9-.122 1.658-.38 2.26-.982.602-.602.86-1.36.982-2.26.116-.867.116-1.97.116-3.337v-8.11c0-1.367 0-2.47-.116-3.337-.121-.9-.38-1.658-.982-2.26-.602-.602-1.36-.86-2.26-.981-.867-.117-1.97-.117-3.337-.117h-1.11z" />
      <path d="M2.001 11.249a.75.75 0 000 1.5h11.973l-1.961 1.68a.75.75 0 10.976 1.14l3.5-3a.75.75 0 000-1.14l-3.5-3a.75.75 0 00-.976 1.14l1.96 1.68H2.002z" />
    </svg>
  );
}

export function ArrowLeftIcon(props: PropsType) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.89775 4.10225C8.11742 4.32192 8.11742 4.67808 7.89775 4.89775L4.358 8.4375H15C15.3107 8.4375 15.5625 8.68934 15.5625 9C15.5625 9.31066 15.3107 9.5625 15 9.5625H4.358L7.89775 13.1023C8.11742 13.3219 8.11742 13.6781 7.89775 13.8977C7.67808 14.1174 7.32192 14.1174 7.10225 13.8977L2.60225 9.39775C2.38258 9.17808 2.38258 8.82192 2.60225 8.60225L7.10225 4.10225C7.32192 3.88258 7.67808 3.88258 7.89775 4.10225Z"
        fill=""
      />
    </svg>
  );
}
