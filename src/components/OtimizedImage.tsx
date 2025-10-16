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
        <Image
            src={imgSrc || fallback}
            alt={alt}
            width={width}
            height={height}
            className={`object-cover rounded-full border shadow-md ${className}`}
            onError={() => setImgSrc(fallback)}
            unoptimized
        />
    );
};

export default OptimizedImage;
