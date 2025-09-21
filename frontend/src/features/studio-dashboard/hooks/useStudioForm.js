import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "../../../lib/apiClient.js";
import { parseStudioImagesField } from "../lib/studioImages.js";
import {
    buildSchedulePayload,
    createDefaultSchedule,
    getDefaultDaySchedule,
    validateSchedule,
} from "../lib/studioSchedule.js";
import {
    sanitizeStudioForm,
    validateStudioForm,
} from "../lib/studioValidation.js";

export const normalizeStudioToForm = (studio) => {
    if (!studio) return sanitizeStudioForm();

    return sanitizeStudioForm({
        name: studio.name ?? "",
        description: studio.description ?? "",
        street_number: studio.street_number ?? "",
        street_name: studio.street_name ?? "",
        postal_code: studio.postal_code ?? "",
        city: studio.city ?? "",
        country: studio.country ?? "",
        hourly_rate:
            studio.hourly_rate !== undefined && studio.hourly_rate !== null
                ? String(studio.hourly_rate)
                : "",
        phone: studio.phone ?? "",
        email: studio.email ?? "",
        website: studio.website ?? "",
        equipment_list: studio.equipment_list ?? "",
        tags: studio.tags ?? "",
    });
};

export function useStudioForm({ id, isEdit, showToast, onSuccess }) {
    const [form, setForm] = useState(() => sanitizeStudioForm());
    const [schedule, setSchedule] = useState(createDefaultSchedule);
    const [errors, setErrors] = useState({});
    const [images, setImages] = useState([]);
    const [isFetching, setIsFetching] = useState(isEdit);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isEdit) {
            setForm(sanitizeStudioForm());
            setSchedule(createDefaultSchedule());
            setImages([]);
            setErrors({});
            setIsFetching(false);
            return;
        }

        let active = true;

        const loadStudio = async () => {
            try {
                setIsFetching(true);
                const response = await apiClient.get(
                    `/dashboard/studios/${id}`
                );
                if (!active) return;

                const studio = response.data?.data?.studio;
                if (studio) {
                    setForm(normalizeStudioToForm(studio));

                    // Use backend data directly, fill missing days with defaults
                    const scheduleFromBackend = studio.schedule || {};
                    const completeSchedule = {};

                    for (const day of [
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                    ]) {
                        if (scheduleFromBackend[day]) {
                            // Use backend data as-is
                            completeSchedule[day] = scheduleFromBackend[day];
                        } else {
                            // Add default for missing days
                            const defaults = {
                                monday: {
                                    is_open: true,
                                    open_time: "09:00",
                                    close_time: "18:00",
                                },
                                tuesday: {
                                    is_open: true,
                                    open_time: "09:00",
                                    close_time: "18:00",
                                },
                                wednesday: {
                                    is_open: true,
                                    open_time: "09:00",
                                    close_time: "18:00",
                                },
                                thursday: {
                                    is_open: true,
                                    open_time: "09:00",
                                    close_time: "18:00",
                                },
                                friday: {
                                    is_open: true,
                                    open_time: "09:00",
                                    close_time: "18:00",
                                },
                                saturday: {
                                    is_open: false,
                                    open_time: "10:00",
                                    close_time: "16:00",
                                },
                                sunday: {
                                    is_open: false,
                                    open_time: "10:00",
                                    close_time: "16:00",
                                },
                            };
                            completeSchedule[day] = defaults[day];
                        }
                    }

                    setSchedule(completeSchedule);
                    setImages(parseStudioImagesField(studio.images));
                    setErrors({});
                }
            } catch (error) {
                if (!active) return;
                const message =
                    error.response?.data?.message ||
                    "Erreur de chargement du studio";
                showToast?.(message, "error");
            } finally {
                if (active) setIsFetching(false);
            }
        };

        loadStudio();

        return () => {
            active = false;
        };
    }, [id, isEdit, showToast]);

    const clearFieldError = useCallback((name) => {
        setErrors((previous) => {
            if (!previous[name]) return previous;
            const { [name]: _omitted, ...rest } = previous;
            return rest;
        });
    }, []);

    const handleChange = useCallback(
        (event) => {
            const { name, value } = event.target;
            setForm((previous) => ({ ...previous, [name]: value }));
            clearFieldError(name);
        },
        [clearFieldError]
    );

    const setFieldValue = useCallback(
        (name, value) => {
            setForm((previous) => ({ ...previous, [name]: value }));
            clearFieldError(name);
        },
        [clearFieldError]
    );

    const handleScheduleToggle = useCallback(
        (day, isOpen) => {
            setSchedule((previous) => {
                const current = previous[day] ?? getDefaultDaySchedule(day);
                const defaults = getDefaultDaySchedule(day);
                return {
                    ...previous,
                    [day]: {
                        ...current,
                        is_open: isOpen,
                        open_time: current.open_time || defaults.open_time,
                        close_time: current.close_time || defaults.close_time,
                    },
                };
            });
            clearFieldError("schedule");
        },
        [clearFieldError]
    );

    const handleScheduleTimeChange = useCallback(
        (day, field, value) => {
            setSchedule((previous) => {
                const current = previous[day] ?? getDefaultDaySchedule(day);
                return {
                    ...previous,
                    [day]: {
                        ...current,
                        [field]: value,
                    },
                };
            });
            clearFieldError("schedule");
        },
        [clearFieldError]
    );

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();

            const sanitizedForm = sanitizeStudioForm(form);
            const { isValid, errors: validationErrors } =
                validateStudioForm(sanitizedForm);
            const scheduleError = validateSchedule(schedule);

            if (!isValid || scheduleError) {
                const combinedErrors = { ...validationErrors };
                if (scheduleError) {
                    combinedErrors.schedule = scheduleError;
                }
                setErrors(combinedErrors);

                const firstEntry = Object.values(combinedErrors)[0];
                const firstMessage =
                    typeof firstEntry === "string"
                        ? firstEntry
                        : firstEntry?.message;
                if (firstMessage) {
                    showToast?.(firstMessage, "error");
                }
                setForm(sanitizedForm);
                return;
            }

            setErrors({});
            setForm(sanitizedForm);

            const schedulePayload = buildSchedulePayload(schedule);

            const payload = {
                ...sanitizedForm,
                hourly_rate: Number(sanitizedForm.hourly_rate),
                schedule: schedulePayload,
            };

            try {
                setIsSaving(true);

                if (isEdit) {
                    const response = await apiClient.put(
                        `/dashboard/studios/${id}`,
                        payload
                    );
                    const studio = response.data?.data?.studio;
                    if (studio) {
                        setForm(normalizeStudioToForm(studio));

                        // Use backend data directly after update
                        const scheduleFromBackend = studio.schedule || {};

                        setSchedule(scheduleFromBackend);
                        setImages(parseStudioImagesField(studio.images));
                    }
                    showToast?.("Studio mis a jour", "success");
                } else {
                    await apiClient.post(`/dashboard/studios`, payload);
                    showToast?.("Studio cree", "success");
                }

                onSuccess?.();
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Erreur lors de l'enregistrement";
                showToast?.(message, "error");
            } finally {
                setIsSaving(false);
            }
        },
        [form, schedule, id, isEdit, onSuccess, showToast]
    );

    const disableForm = useMemo(
        () => isFetching || isSaving,
        [isFetching, isSaving]
    );

    return {
        form,
        schedule,
        errors,
        images,
        setImages,
        isFetching,
        isSaving,
        disableForm,
        handleChange,
        handleSubmit,
        handleScheduleToggle,
        handleScheduleTimeChange,
        setFieldValue,
    };
}
