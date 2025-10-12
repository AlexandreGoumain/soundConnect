import { Fragment } from "react";
import ImageWithFallback from "../../../../components/shared/ImageWithFallback.jsx";

export default function StudioGallery({
    carouselImages,
    currentImageIndex,
    activeImage,
    hasMultipleImages,
    showPrevImage,
    showNextImage,
    handleCarouselIndicatorClick,
    studioName,
}) {
    return (
        <div className="studio-gallery">
            <div className="main-image">
                {activeImage ? (
                    <ImageWithFallback
                        src={activeImage}
                        alt={`Photo ${currentImageIndex + 1} du studio ${studioName}`}
                    />
                ) : (
                    <div className="image-placeholder">
                        <span>Image du studio</span>
                    </div>
                )}
                {hasMultipleImages && (
                    <Fragment>
                        <button
                            type="button"
                            className="carousel-btn prev"
                            onClick={showPrevImage}
                        >
                            {"‹"}
                        </button>
                        <button
                            type="button"
                            className="carousel-btn next"
                            onClick={showNextImage}
                        >
                            {"›"}
                        </button>
                    </Fragment>
                )}
            </div>
            <div className="carousel-indicators">
                {carouselImages.length > 0 ? (
                    carouselImages.map((_, index) => (
                        <span
                            key={index}
                            className={`indicator ${
                                index === currentImageIndex
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => handleCarouselIndicatorClick(index)}
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    handleCarouselIndicatorClick(index);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                        ></span>
                    ))
                ) : (
                    <span className="indicator active"></span>
                )}
            </div>
        </div>
    );
}
