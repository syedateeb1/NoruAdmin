"use client";

import Image from "next/image";
import { useState } from "react";

type OptimizedImageProps = {
    src?: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    fallback?: string;
};

const OptimizedImage = ({
    src,
    alt,
    width = 100,
    height = 100,
    className = "",
    fallback = "/images/icon/user.png",
}: OptimizedImageProps) => {
    const [imgSrc, setImgSrc] = useState(src || fallback);

    return (
        <div
            className={`rounded-full overflow-hidden flex justify-center items-center ${className}`}
            style={{ width, height }}
        >
            <Image
                src={imgSrc || fallback}
                alt={alt}
                width={width}
                height={height}
                className="object-cover"
                onError={() => setImgSrc(fallback)}
                unoptimized
            />
        </div>
    );
};

export default OptimizedImage;
