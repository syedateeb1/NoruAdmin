import { Star } from "lucide-react";


export const TableCellSkeleton = ({ image, name, heading }: { image?: string, name: string, heading?: string }) => {
    if (heading === 'Rating') {

        const rating = parseFloat(name) || 0; // Parse as float, default to 0
        const maxStars = 5;
        const fullStars = Math.floor(rating); // Full stars (e.g., 4 for 4.5)
        const hasHalfStar = rating % 1 >= 0.5; // Half star if decimal >= 0.5
        const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars

        return (
            <div className="flex flex-col py-2">
                <h5 className='font-bold '>{heading}</h5>
                <div className="flex items-center gap-1">
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
                    <span className="font-sans text-body-md font-medium text-dark">({name})</span>
                </div>
            </div>
        );
    }
    return (
        <div className="flex gap-2 items-center  overflow-hidden max-w-full">
            {image && <img src={image} className="w-10 h-10 rounded-full object-cover" />}
            <div className="flex flex-col py-2 overflow-hidden">
                <h5 className="font-sans text-heading-7 font-bold text-dark-4 break-words whitespace-normal">{heading}</h5>
                <p className="font-sans text-body-lg font-medium text-dark break-words whitespace-normal">{name}</p>
            </div>
        </div>

    )
}