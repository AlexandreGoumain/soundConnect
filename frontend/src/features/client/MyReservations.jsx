import SelectDropdown from "../../components/shared/SelectDropdown.jsx";
import ReservationCard from "./components/ReservationCard.jsx";
import "../../styles/components/_studio-dashboard.scss";
import "../../styles/components/_reservation-card.scss";
import { useMyReservations } from "./hooks/useMyReservations.js";


export default function MyReservations() {
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
        nextPage,
        prevPage,
        goToPage,
        getStatusLabel,
        getStatusIcon,
        formatDateTime,
        calculateDuration,
        isReservationModifiable,
        isReservationCancellable,
    } = useMyReservations();

    if (loading) return <div className="container">Chargement…</div>;
    if (error) return <div className="container">Erreur: {error}</div>;

    return (
        <div className="container">
            <div className="dashboard-layout-main">
                <div className="dashboard-header">
                    <div>
                        <h1 className="title">Mes réservations</h1>
                        <p className="subtitle">
                            {totalReservations} réservation{totalReservations > 1 ? "s" : ""}
                            {statusFilter !== "all" &&
                                ` (${getStatusLabel(statusFilter).toLowerCase()})`}
                            {totalPages > 1 && ` - Page ${currentPage} sur ${totalPages}`}
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
                                formatDateTime={formatDateTime}
                                calculateDuration={calculateDuration}
                                getStatusLabel={getStatusLabel}
                                getStatusIcon={getStatusIcon}
                                isReservationModifiable={isReservationModifiable}
                                isReservationCancellable={isReservationCancellable}
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
        </div>
    );
}
