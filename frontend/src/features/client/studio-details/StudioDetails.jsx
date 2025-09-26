import ReviewsSection from "../../../components/ReviewsSection.jsx";
import StudioBookingForm from "./components/StudioBookingForm.jsx";
import StudioDescription from "./components/StudioDescription.jsx";
import StudioEquipment from "./components/StudioEquipment.jsx";
import StudioGallery from "./components/StudioGallery.jsx";
import StudioOverview from "./components/StudioOverview.jsx";
import { useStudioDetailsLogic } from "./hooks/useStudioDetailsLogic";
import "./StudioDetails.scss";

const StudioDetails = () => {
    const {
        // Studio data
        studio,
        loading,
        error,

        // Image carousel
        carouselImages,
        currentImageIndex,
        activeImage,
        hasMultipleImages,
        showPrevImage,
        showNextImage,
        handleCarouselIndicatorClick,

        // Booking form
        selectedDate,
        selectedTimeSlot,
        selectedDuration,
        specialRequests,
        isBooking,
        handleDateChange,
        handleDurationChange,
        handleTimeSlotSelect,
        handleSpecialRequestsChange,
        handleBookStudio,

        // Availability
        availableSlots,
        availabilityLoading,
        formatTime,

        // Utilities
        formatAddress,
        getTotalPrice,
        getMinDate,
        getMaxDate,
        calculateEndTime,
        getNoSlotsMessage,

        // Navigation
        navigate,
    } = useStudioDetailsLogic();


    if (loading) {
        return (
            <div className="studio-details loading">
                <div className="container">
                    <div className="loading-spinner">Chargement...</div>
                </div>
            </div>
        );
    }

    if (error || !studio) {
        return (
            <div className="studio-details error">
                <div className="container">
                    <div className="error-message">
                        <h2>Studio non trouvé</h2>
                        <p>
                            Le studio que vous recherchez n'existe pas ou a été
                            supprimé.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate("/")}
                        >
                            Retour à l'accueil
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="studio-details">
            <div className="container">
                <StudioGallery
                    carouselImages={carouselImages}
                    currentImageIndex={currentImageIndex}
                    activeImage={activeImage}
                    hasMultipleImages={hasMultipleImages}
                    showPrevImage={showPrevImage}
                    showNextImage={showNextImage}
                    handleCarouselIndicatorClick={handleCarouselIndicatorClick}
                    studioName={studio.name}
                />

                <StudioOverview
                    studio={studio}
                    formatAddress={formatAddress}
                />

                <StudioEquipment equipmentList={studio.equipment_list} />

                <StudioDescription description={studio.description} />

                <StudioBookingForm
                    studio={studio}
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    selectedDuration={selectedDuration}
                    specialRequests={specialRequests}
                    isBooking={isBooking}
                    availableSlots={availableSlots}
                    availabilityLoading={availabilityLoading}
                    handleDateChange={handleDateChange}
                    handleDurationChange={handleDurationChange}
                    handleTimeSlotSelect={handleTimeSlotSelect}
                    handleSpecialRequestsChange={handleSpecialRequestsChange}
                    handleBookStudio={handleBookStudio}
                    formatTime={formatTime}
                    getTotalPrice={getTotalPrice}
                    getMinDate={getMinDate}
                    getMaxDate={getMaxDate}
                    calculateEndTime={calculateEndTime}
                    getNoSlotsMessage={getNoSlotsMessage}
                />

                <ReviewsSection studioId={studio.id} studioName={studio.name} />
            </div>
        </div>
    );
};

export default StudioDetails;
