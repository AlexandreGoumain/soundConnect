import {
    ReservationError,
    createReservationForUser,
    deleteReservationForActor,
    getReservationWithPermissions,
    getReservationsForActor,
    getReservationsForStudio,
    getReservationsForUser,
    updateReservationForActor,
} from "../services/reservationService.js";

export const createReservation = async (req, res) => {
    try {
        const reservation = await createReservationForUser(req.user, req.body);

        res.status(201).json({
            success: true,
            message: "Reservation created successfully",
            data: { reservation },
        });
    } catch (error) {
        handleReservationError(res, error, "Error creating reservation");
    }
};

export const getAllReservations = async (req, res) => {
    try {
        const reservations = await getReservationsForActor(req.user);

        res.json({
            success: true,
            data: { reservations },
        });
    } catch (error) {
        handleReservationError(res, error, "Error retrieving reservations");
    }
};

export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await getReservationWithPermissions(req.user, id);

        res.json({
            success: true,
            data: { reservation },
        });
    } catch (error) {
        handleReservationError(res, error, "Error retrieving reservation");
    }
};

export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await updateReservationForActor(req.user, id, req.body);

        res.json({
            success: true,
            message: "Reservation updated successfully",
            data: { reservation: updated },
        });
    } catch (error) {
        handleReservationError(res, error, "Error updating reservation");
    }
};

export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteReservationForActor(req.user, id);

        res.json({
            success: true,
            message: "Reservation deleted successfully",
        });
    } catch (error) {
        handleReservationError(res, error, "Error deleting reservation");
    }
};

export const getReservationsByUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const reservations = await getReservationsForUser(user_id, req.user);

        res.json({
            success: true,
            data: { reservations },
        });
    } catch (error) {
        handleReservationError(
            res,
            error,
            "Error retrieving user reservations"
        );
    }
};

export const getReservationsByStudio = async (req, res) => {
    try {
        const { studio_id } = req.params;
        const reservations = await getReservationsForStudio(
            studio_id,
            req.user
        );

        res.json({ success: true, data: { reservations } });
    } catch (error) {
        handleReservationError(
            res,
            error,
            "Error retrieving studio reservations"
        );
    }
};

function handleReservationError(res, error, fallbackMessage) {
    if (error instanceof ReservationError || typeof error?.statusCode === "number") {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    console.error(fallbackMessage, error);
    return res.status(500).json({
        success: false,
        message: fallbackMessage,
    });
}
