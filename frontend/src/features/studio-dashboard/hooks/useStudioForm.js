import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "../../../lib/apiClient.js";
import { parseStudioImagesField } from "../lib/studioImages.js";

const EMPTY_FORM = {
    name: "",
    description: "",
    street_number: "",
    street_name: "",
    postal_code: "",
    city: "",
    country: "France",
    hourly_rate: "",
    phone: "",
    email: "",
    website: "",
    equipment_list: "",
    tags: "",
};

export const normalizeStudioToForm = (studio) => {
    if (!studio) return { ...EMPTY_FORM };

    return {
        name: studio.name ?? "",
        description: studio.description ?? "",
        street_number: studio.street_number ?? "",
        street_name: studio.street_name ?? "",
        postal_code: studio.postal_code ?? "",
        city: studio.city ?? "",
        country: studio.country ?? "France",
        hourly_rate:
            studio.hourly_rate !== undefined && studio.hourly_rate !== null
                ? String(studio.hourly_rate)
                : "",
        phone: studio.phone ?? "",
        email: studio.email ?? "",
        website: studio.website ?? "",
        equipment_list: studio.equipment_list ?? "",
        tags: studio.tags ?? "",
    };
};

export function useStudioForm({ id, isEdit, showToast, onSuccess }) {
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [images, setImages] = useState([]);
    const [isFetching, setIsFetching] = useState(isEdit);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isEdit) {
            setForm({ ...EMPTY_FORM });
            setImages([]);
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
                    setImages(parseStudioImagesField(studio.images));
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

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    }, []);

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();

            try {
                setIsSaving(true);
                if (isEdit) {
                    const response = await apiClient.put(
                        `/dashboard/studios/${id}`,
                        form
                    );
                    const studio = response.data?.data?.studio;
                    if (studio) {
                        setForm(normalizeStudioToForm(studio));
                        setImages(parseStudioImagesField(studio.images));
                    }
                    showToast?.("Studio mis a jour", "success");
                } else {
                    await apiClient.post(`/dashboard/studios`, form);
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
        [form, id, isEdit, onSuccess, showToast]
    );

    const disableForm = useMemo(
        () => isFetching || isSaving,
        [isFetching, isSaving]
    );

    return {
        form,
        images,
        setImages,
        isFetching,
        isSaving,
        disableForm,
        handleChange,
        handleSubmit,
    };
}
