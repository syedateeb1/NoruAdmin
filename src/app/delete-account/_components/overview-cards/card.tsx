"use client";
import { ArrowDownIcon, ArrowUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import type { JSX, SVGProps } from "react";

type PropsType = {
  label: string;
  data: {
    value: string;
    growthRate: string;
  };
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  onClick?: () => void;
};

export function OverviewCard({ label, data, Icon, onClick }: PropsType) {


  return (
    <div className="rounded-2xl flex gap-4 items-center  bg-white px-6 py-4 shadow-3 dark:bg-gray-dark" onClick={onClick}>
      <Icon />
      <div className=" flex flex-col justify-between">
        <dl>
          <dd className="text-lg font-bold text-gray-4 dark:text-white">  {label === "Agencys" ? "Agencies" : label}</dd>
          {data.value &&
            <dt className="mb-1.5 text-heading-6 font-extrabold text-dark dark:text-white">
              {data.value}
            </dt>
          }
        </dl>
      </div>
    </div>
  );
}
