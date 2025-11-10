
import React, { Suspense } from 'react'
import { OverviewCardsSkeleton } from './overview-cards/skeleton';
import { OverviewCardsGroup } from './overview-cards';
import { RecentRides } from './recent-rides';

type Props = {
    searchParams: Promise<{
        selected_time_frame?: string;
    }>;
}

const DashboardPage = async ({ searchParams }: Props) => {

    return (
        <>
            <Suspense fallback={<OverviewCardsSkeleton />}>
                <div className='mt-10 mx-10'>
                    <OverviewCardsGroup />
                    <RecentRides />
                </div>
            </Suspense>
            {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
                <PaymentsOverview
                    className="col-span-12 xl:col-span-7"
                    key={extractTimeFrame("payments_overview")}
                    timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
                />

                <WeeksProfit
                key={extractTimeFrame("weeks_profit")}
                timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
                className="col-span-12 xl:col-span-5"
            />

            <UsedDevices
                className="col-span-12 xl:col-span-5"
                key={extractTimeFrame("used_devices")}
                timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
            />

            <RegionLabels />

            <div className="col-span-12 grid xl:col-span-8">
                <Suspense fallback={<TopChannelsSkeleton />}>
                    <TopChannels />
                </Suspense>
            </div>

            <Suspense fallback={null}>
                <ChatsCard />
            </Suspense>
            </div> */}

        </>
    )
}

export default DashboardPage