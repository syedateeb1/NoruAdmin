"use client";
import { useRouter } from "next/navigation";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { fetchOverviewDashboardUrl } from "@/services/authService";
import { useEffect, useState } from "react";
interface usersByType {
  count: string;
  country: string
}
interface OverviewData {
  usersByType: usersByType[];
  totalRevenue: string;
  totalRides: string;
}
export function OverviewCardsGroup() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await fetchOverviewDashboardUrl();
        console.log({ response });
        setDashboardData(response.data);
      } catch (err) {
        console.error("Failed to fetch rides:", err);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);
  const handleCardClick = (name: string) => {
    switch (name) {
      case '1':
        router.push(`/customers`);
        break;
      case '2':
        router.push(`/drivers`);
        break;
      case '3':
        router.push(`/travellers`);
        break;
      case 'rides':
        router.push(`/rides`);
        break;
      default:
        break;
    }
    // router.push(`/users?type=${name}`);
  }
  if (loading) return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-5 2xl:gap-7.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[10px] bg-white p-3  shadow-1 dark:bg-gray-dark"
        >
          <icons.Users />
          <div className="mt-6 flex items-end justify-between">
            <div>
              <div className="mb-1.5 h-2 w-18" />
              <div className="h-1 w-20" />
            </div>
            <div className="h-2 w-15" />
          </div>
        </div>
      ))}
    </div>
  )
  const userCards = dashboardData?.usersByType?.slice(0, 3).map((user, index) => (
    <OverviewCard
      key={index}
      label={user?.country ? `${user.country}s` : `User Type ${index + 1}`}
      data={{
        value: user?.count || "0",
        growthRate: user?.count || "0",
      }}
      Icon={user?.country === "Total Revenue" ? icons.Profit : icons.Users}
      onClick={() => handleCardClick(String(index + 1))}
    />
  ));
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-5 2xl:gap-7.5">
      {userCards}

      <OverviewCard
        label="Total Rides"
        data={{
          value: dashboardData?.totalRides || '0',
          growthRate: dashboardData?.totalRides || '0',
        }}
        Icon={icons.Users}
        onClick={() => handleCardClick('rides')}
      />

      <OverviewCard
        label="Total Revenue"
        data={{
          value: dashboardData?.totalRevenue || '0',
          growthRate: dashboardData?.totalRevenue || '0',
        }}
        Icon={icons.Product}
        onClick={() => handleCardClick('revenue')}
      />
    </div>
  );
}
