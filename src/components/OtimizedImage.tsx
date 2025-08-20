"use client"; // add this at the top

import Image from "next/image";
import { useState } from "react";

type OptimizedImageProps = {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    fallback?: string;
};

const OptimizedImage = ({
    src,
    alt,
    width,
    height,
    className = "",
    fallback = "/fallback.png",
}: OptimizedImageProps) => {
    const [imgSrc, setImgSrc] = useState(src || fallback);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onError={() => setImgSrc(fallback)}
            unoptimized={true}


        />
    );
};

export default OptimizedImage;
