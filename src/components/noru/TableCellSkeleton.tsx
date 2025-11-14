import { Star } from "lucide-react";
import OptimizedImage from "../OtimizedImage";


export const TableCellSkeleton = ({ image, name, heading }: { image?: string, name: string, heading?: string }) => {
    if (heading === 'Rating') {

        const rating = parseFloat(name) || 0; // Parse as float, default to 0
        const maxStars = 5;
        const fullStars = Math.floor(rating); // Full stars (e.g., 4 for 4.5)
        const hasHalfStar = rating % 1 >= 0.5; // Half star if decimal >= 0.5
        const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

        return (
            <div className="flex flex-col py-2">
                <h5 className='font-bold px-1'>{heading}</h5>
                <div className="flex items-center sm:flex-col md:flex-row gap-1">
                    <div className="flex gap-1">
                        {/* Full stars */}
                        {Array.from({ length: fullStars }, (_, index) => (
                            <Star
                                key={`full-${index}`}
                                className="w-4 h-4 fill-yellow-dark text-yellow-dark"
                            />
                        ))}
                        {/* Half star */}
                        {hasHalfStar && (
                            <div className="relative w-4 h-4">
                                <Star className="w-4 h-4 text-dark-4" />
                                <div className="absolute inset-0 overflow-hidden w-[50%]">
                                    <Star className="w-4 h-4 fill-yellow-dark text-yellow-dark" />
                                </div>
                            </div>
                        )}
                        {/* Empty stars */}
                        {Array.from({ length: emptyStars }, (_, index) => (
                            <Star
                                key={`empty-${index}`}
                                className="w-4 h-4 text-dark-4"
                            />
                        ))}
                    </div>

                    <span className="font-sans text-body-md font-medium text-dark ">({name}) </span>
                </div>
            </div>
        );
    }
    return (
        <div className="flex gap-2 items-center overflow-hidden max-w-full  px-[2px]">
            {image && (

                <OptimizedImage
                    src={image}
                    alt="Avatar"
                    width={40}
                    height={40}
                />
            )}

            <div
                className={`flex flex-col py-2 overflow-hidden w-full`}
            >
                <h5 className="font-sans text-heading-7 font-bold text-dark-4 truncate ml-1">
                    {heading}
                </h5>
                <p className="font-sans text-body-lg text-start font-medium text-dark break-words whitespace-normal px-1">
                    {name}
                </p>
            </div>
        </div>



    )
}