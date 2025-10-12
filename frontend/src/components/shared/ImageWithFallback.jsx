import { useEffect, useState } from "react";

export default function ImageWithFallback({
    src,
    alt,
    fallbackSrc = "/placeholder-image.svg",
    onError,
    ...rest
}) {
    const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

    useEffect(() => {
        // Reset when src changes
        setCurrentSrc(src || fallbackSrc);
    }, [src, fallbackSrc]);

    const handleError = (e) => {
        if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
        }
        if (typeof onError === "function") onError(e);
    };

    return (
        <img
            src={currentSrc || fallbackSrc}
            alt={alt}
            onError={handleError}
            loading={rest.loading || "lazy"}
            decoding={rest.decoding || "async"}
            {...rest}
        />
    );
}

