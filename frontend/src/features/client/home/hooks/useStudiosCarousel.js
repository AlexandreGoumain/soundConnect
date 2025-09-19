import { useEffect, useMemo, useState } from "react";

export function useStudiosCarousel(studios, displayLimit) {
    const [startIndex, setStartIndex] = useState(0);
    const hasStudios = studios.length > 0;
    const canNavigate = studios.length > displayLimit;

    useEffect(() => {
        if (!hasStudios) {
            setStartIndex(0);
            return;
        }

        setStartIndex((current) => (current >= studios.length ? 0 : current));
    }, [hasStudios, studios.length]);

    const displayedStudios = useMemo(() => {
        if (!hasStudios) {
            return [];
        }

        if (!canNavigate) {
            return studios.slice(0, displayLimit);
        }

        const items = [];
        for (let offset = 0; offset < displayLimit; offset += 1) {
            const index = (startIndex + offset) % studios.length;
            items.push(studios[index]);
        }
        return items;
    }, [canNavigate, displayLimit, hasStudios, startIndex, studios]);

    const showPrevious = () => {
        if (!canNavigate) return;
        setStartIndex((prev) => (prev === 0 ? studios.length - 1 : prev - 1));
    };

    const showNext = () => {
        if (!canNavigate) return;
        setStartIndex((prev) => (prev + 1) % studios.length);
    };

    return {
        displayedStudios,
        canNavigate,
        hasStudios,
        showNext,
        showPrevious,
    };
}
