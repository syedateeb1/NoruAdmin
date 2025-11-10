"use client"
import { RidesDetail } from "./rides-detail"
const innerData = [
    {
        details: [
            { heading: 'Pickup Location', name: 'Johannesburg' },
            { heading: 'Drop Location', name: 'Cape Town' },
            { heading: 'Driver', name: 'John Doe' },
            { heading: 'Driver', name: 'John Doe' },
        ],
        _id: "1",
        status: 'completed',

    },
    {
        details: [
            { heading: 'Pickup Location', name: 'Pretoria' },
            { heading: 'Drop Location', name: 'Durban' },
            { heading: 'Driver', name: 'Jane Smith' },
            { heading: 'Driver', name: 'Jane Smith' },
        ],
        _id: "2",
        status: 'inprogress',

    },
    {
        details: [
            { heading: 'Pickup Location', name: 'Bloemfontein' },
            { heading: 'Drop Location', name: 'Port Elizabeth' },
            { heading: 'Driver', name: 'Mike Johnson' },
            { heading: 'Driver', name: 'Mike Johnson' },
        ],
        _id: "3",
        status: 'completed',

    },
    {
        details: [
            { heading: 'Pickup Location', name: 'East London' },
            { heading: 'Drop Location', name: 'Soweto' },
            { heading: 'Driver', name: 'Sarah Brown' },
            { heading: 'Driver', name: 'Sarah Brown' },
        ],
        _id: "4",
        status: 'pending',

    },
];
const options = [
    { id: 'view', label: 'View' },
    { id: 'edit', label: 'Edit' },
    { id: 'cancel', label: 'Cancel' },
]
export const RecentRides = () => {
    const onClickHandle = (name: string, id: string) => {
        console.log(name, id, "name");
    };
    return (
        <div className="flex flex-col mt-6 space-y-6">
            <h1 className="text-heading-6 font-bold text-black">Customers</h1>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex flex-col gap-4 h-[650px] overflow-y-auto no-scrollbar">
                {innerData.map((item, index) => {
                    return (
                        <RidesDetail
                            key={index}
                            _id={item._id}
                            innerData={item.details}
                            status={item.status}
                            option={false} // Matches usage: option="asd"
                            options={options}
                            onClick={onClickHandle}
                        />
                    )
                })}
            </div>
        </div>
    )
} 