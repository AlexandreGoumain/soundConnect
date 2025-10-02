import { useState } from "react";
import ReviewModal from "../../components/shared/ReviewModal.jsx";
import SelectDropdown from "../../components/shared/SelectDropdown.jsx";
import "../../styles/components/_reservation-card.scss";
import "../../styles/components/_studio-dashboard.scss";
import ReservationCard from "./components/ReservationCard.jsx";
import { useMyReservations } from "./hooks/useMyReservations.js";

export default function MyReservations() {
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    const {
        statusFilter,
        sortBy,
        expandedDetails,
        loading,
        error,
        filteredReservations,
        currentPage,
        totalPages,
        totalReservations,
        hasNextPage,
        hasPrevPage,
        handleStatusFilterChange,
        handleSortByChange,
        cancelReservation,
        toggleDetails,
        handleModifyReservation,
        submitReview,
        nextPage,
        prevPage,
        goToPage,
        getStatusLabel,
        getStatusIcon,
        formatDateTime,
        calculateDuration,
        isReservationModifiable,
        isReservationCancellable,
        canLeaveReview,
    } = useMyReservations();

    const handleLeaveReview = (reservation) => {
        setSelectedReservation(reservation);
        setReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setReviewModalOpen(false);
        setSelectedReservation(null);
    };

    const handleSubmitReview = async (reviewData) => {
        try {
            await submitReview({
                ...reviewData,
                studio_id: selectedReservation?.studio_id,
            });
            handleCloseReviewModal();
        } catch (error) {
            console.error("Error in handleSubmitReview:", error);
            // On ne ferme PAS la modal en cas d'erreur
        }
    };

    if (loading) return <div className="container">Chargement…</div>;
    if (error) return <div className="container">Erreur: {error}</div>;

    return (
        <div className="container">
            <div className="dashboard-layout-main">
                <div className="dashboard-header">
                    <div>
                        <h1 className="title">Mes réservations</h1>
                        <p className="subtitle">
                            {totalReservations} réservation
                            {totalReservations > 1 ? "s" : ""}
                            {statusFilter !== "all" &&
                                ` (${getStatusLabel(
                                    statusFilter
                                ).toLowerCase()})`}
                            {totalPages > 1 &&
                                ` - Page ${currentPage} sur ${totalPages}`}
                        </p>
                    </div>

                    <div className="reservations-controls">
                        <div className="control-group">
                            <SelectDropdown
                                label="Statut :"
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                className="select-control"
                                options={[
                                    { value: "all", label: "Tous les statuts" },
                                    { value: "pending", label: "En attente" },
                                    { value: "confirmed", label: "Confirmées" },
                                    { value: "completed", label: "Terminées" },
                                    { value: "cancelled", label: "Annulées" },
                                    { value: "expired", label: "Expirées" },
                                ]}
                            />
                        </div>

                        <div className="control-group">
                            <SelectDropdown
                                label="Trier par :"
                                value={sortBy}
                                onChange={handleSortByChange}
                                className="select-control"
                                options={[
                                    { value: "date", label: "Date" },
                                    { value: "status", label: "Statut" },
                                    { value: "studio", label: "Studio" },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                {filteredReservations.length === 0 ? (
                    <div className="empty-state">
                        <h3>Aucune réservation</h3>
                        <p>
                            {statusFilter === "all"
                                ? "Vous n'avez pas encore effectué de réservation."
                                : `Aucune réservation avec le statut "${getStatusLabel(
                                      statusFilter
                                  ).toLowerCase()}".`}
                        </p>
                    </div>
                ) : (
                    <div className="reservations-list">
                        {filteredReservations.map((reservation) => (
                            <ReservationCard
                                key={reservation.id}
                                reservation={reservation}
                                expandedDetails={expandedDetails}
                                onToggleDetails={toggleDetails}
                                onCancelReservation={cancelReservation}
                                onModifyReservation={handleModifyReservation}
                                onLeaveReview={handleLeaveReview}
                                formatDateTime={formatDateTime}
                                calculateDuration={calculateDuration}
                                getStatusLabel={getStatusLabel}
                                getStatusIcon={getStatusIcon}
                                isReservationModifiable={
                                    isReservationModifiable
                                }
                                isReservationCancellable={
                                    isReservationCancellable
                                }
                                canLeaveReview={canLeaveReview}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button
                            onClick={prevPage}
                            disabled={!hasPrevPage}
                            className="pagination-btn"
                        >
                            ← Précédent
                        </button>

                        <div className="pagination-pages">
                            {[...Array(totalPages)].map((_, index) => {
                                const page = index + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`pagination-page ${
                                            currentPage === page ? "active" : ""
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={nextPage}
                            disabled={!hasNextPage}
                            className="pagination-btn"
                        >
                            Suivant →
                        </button>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            <ReviewModal
                isOpen={reviewModalOpen}
                onClose={handleCloseReviewModal}
                onSubmit={handleSubmitReview}
                studioName={selectedReservation?.studio_name}
                reservationId={selectedReservation?.id}
            />
        </div>
    );
}
