import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { authApi } from "../../../../lib/apiClient.js";
import {
    ACCEPTED_AVATAR_TYPES,
    DEFAULT_PROFILE,
    MAX_AVATAR_SIZE,
    PROFILE_FIELDS,
    computeInitials,
    deriveDisplayName,
    deriveRoleLabel,
    hasProfileChanges,
    normalizeProfile,
    resolveAssetUrl,
} from "../lib/profileUtils.js";

export function useProfile({
    user,
    refresh,
    showError,
    showSuccess,
    showInfo,
}) {
    const [formData, setFormData] = useState(DEFAULT_PROFILE);
    const [initialData, setInitialData] = useState(null);
    const [profileInfo, setProfileInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const avatarInputRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        const normalized = normalizeProfile(user);
        setFormData(normalized);
        setInitialData({ ...normalized });
        setProfileInfo((previous) => previous ?? user);
    }, [user]);

    useEffect(() => {
        let active = true;

        async function loadProfile() {
            try {
                setFetchError(null);
                setIsLoading(true);

                const response = await authApi.profile();

                if (!active) return;

                const profile = response?.data?.user ?? null;
                setProfileInfo(profile);

                const normalized = normalizeProfile(profile);

                setFormData(normalized);
                setInitialData({ ...normalized });
            } catch (error) {
                if (!active) return;

                const message =
                    error.response?.data?.message ||
                    "Impossible de charger votre profil.";

                setFetchError(message);
            } finally {
                if (active) setIsLoading(false);
            }
        }

        loadProfile();

        return () => {
            active = false;
        };
    }, []);

    const profileId = profileInfo?.id ?? user?.id ?? null;

    const handleAvatarUpload = useCallback(
        async (event) => {
            const file = event.target?.files?.[0];
            if (!file) return;

            if (!ACCEPTED_AVATAR_TYPES.has(file.type)) {
                showError?.(
                    "Format de fichier non supporté (jpg, png, webp, gif)."
                );
                event.target.value = "";
                return;
            }

            if (file.size > MAX_AVATAR_SIZE) {
                showError?.("L'image doit faire moins de 2 Mo.");
                event.target.value = "";
                return;
            }

            if (!profileId) {
                showError?.("Profil utilisateur introuvable.");
                event.target.value = "";
                return;
            }

            try {
                setIsAvatarUploading(true);
                const response = await authApi.uploadAvatar(profileId, file);
                const newAvatar = response?.data?.avatar_url ?? null;
                if (newAvatar) {
                    setProfileInfo((previous) => {
                        const base = previous ?? profileInfo ?? {};
                        return {
                            ...base,
                            avatar_url: newAvatar,
                        };
                    });
                }
                await refresh?.();
                showSuccess?.(response?.message || "Avatar mis a jour");
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "echec de la mise a jour de l'avatar.";
                showError?.(message);
            } finally {
                setIsAvatarUploading(false);
                if (event.target) event.target.value = "";
            }
        },
        [profileId, profileInfo, refresh, showError, showSuccess]
    );

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;

        if (!PROFILE_FIELDS.includes(name)) return;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const handleReset = useCallback(() => {
        if (!initialData) return;
        setFormData({ ...initialData });
    }, [initialData]);

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();

            if (!initialData) return;

            const payload = {};
            const sanitizedForm = { ...formData };

            for (const field of PROFILE_FIELDS) {
                const rawValue = formData[field] ?? "";
                const sanitized =
                    typeof rawValue === "string" ? rawValue.trim() : rawValue;
                sanitizedForm[field] = sanitized;

                const baseline = initialData[field] ?? "";

                if (sanitized !== baseline) {
                    payload[field] = sanitized;
                }
            }

            if (Object.keys(payload).length === 0) {
                setFormData(sanitizedForm);
                showInfo?.("Aucune modification a enregistrer.");
                return;
            }

            try {
                setIsSubmitting(true);
                setFormData(sanitizedForm);
                const response = await authApi.updateProfile(payload);
                const updatedProfile = response?.data?.user ?? null;
                if (updatedProfile) {
                    const normalized = normalizeProfile(updatedProfile);
                    setFormData(normalized);
                    setInitialData({ ...normalized });
                    setProfileInfo(updatedProfile);
                } else {
                    const normalizedFallback = normalizeProfile(sanitizedForm);
                    setInitialData({ ...normalizedFallback });
                }
                await refresh?.();
                showSuccess?.("Profil mis a jour");
            } catch (error) {
                const validationErrors = error.response?.data?.errors;
                const message =
                    (Array.isArray(validationErrors) &&
                    validationErrors.length > 0
                        ? validationErrors[0]?.message
                        : error.response?.data?.message) ||
                    "La mise a jour du profil a echoue.";
                showError?.(message);
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, initialData, refresh, showError, showInfo, showSuccess]
    );

    const hasChanges = useMemo(
        () => hasProfileChanges(initialData, formData),
        [formData, initialData]
    );

    const initials = useMemo(() => computeInitials(profileInfo), [profileInfo]);

    const roleLabel = useMemo(
        () => deriveRoleLabel(profileInfo?.role_name),
        [profileInfo?.role_name]
    );

    const displayName = useMemo(
        () => deriveDisplayName(profileInfo),
        [profileInfo]
    );

    const avatarUrl = useMemo(
        () => resolveAssetUrl(profileInfo?.avatar_url),
        [profileInfo?.avatar_url]
    );

    return {
        avatarInputRef,
        avatarUrl,
        displayName,
        fetchError,
        formData,
        handleAvatarUpload,
        handleChange,
        handleReset,
        handleSubmit,
        hasChanges,
        initials,
        isAvatarUploading,
        isLoading,
        isSubmitting,
        profileInfo,
        roleLabel,
    };
}
