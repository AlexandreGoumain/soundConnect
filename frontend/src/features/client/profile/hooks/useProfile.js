import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { authApi } from "../../../../lib/apiClient.js";
import {
    MAX_AVATAR_SIZE,
    validateCity,
    validateEmail,
    validateHumanName,
    validateImageFile,
    validatePhone,
    validatePostalCode,
    validateUsername,
} from "../../../../lib/validation.js";
import {
    DEFAULT_PROFILE,
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
    const [fieldErrors, setFieldErrors] = useState({});

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

            // Utiliser la validation centralisée
            const validationError = validateImageFile(
                file,
                MAX_AVATAR_SIZE,
                "avatar"
            );

            if (validationError) {
                // Essayer showError d'abord, puis fallback sur alert si nécessaire
                if (showError) {
                    showError(validationError);
                } else {
                    alert(validationError);
                }

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

    const handleChange = useCallback(
        (event) => {
            const { name, value } = event.target;

            if (!PROFILE_FIELDS.includes(name)) return;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));

            // Effacer l'erreur du champ quand l'utilisateur tape
            if (fieldErrors[name]) {
                setFieldErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        },
        [fieldErrors]
    );

    const handleReset = useCallback(() => {
        if (!initialData) return;
        setFormData({ ...initialData });
    }, [initialData]);

    // Form validation function (adapted from useRegisterForm)
    const validateForm = useCallback((dataToValidate) => {
        const errors = {};

        // Utilisation des utilitaires de validation
        const firstNameError = validateHumanName(
            dataToValidate.first_name,
            "prénom"
        );
        if (firstNameError) errors.first_name = firstNameError;

        const lastNameError = validateHumanName(
            dataToValidate.last_name,
            "nom"
        );
        if (lastNameError) errors.last_name = lastNameError;

        const usernameError = validateUsername(dataToValidate.username);
        if (usernameError) errors.username = usernameError;

        const emailError = validateEmail(dataToValidate.email);
        if (emailError) errors.email = emailError;

        // Champs optionnels - seulement valider s'ils ne sont pas vides
        if (dataToValidate.phone && dataToValidate.phone.trim()) {
            const phoneError = validatePhone(dataToValidate.phone);
            if (phoneError) errors.phone = phoneError;
        }

        if (dataToValidate.city && dataToValidate.city.trim()) {
            const cityError = validateCity(dataToValidate.city);
            if (cityError) errors.city = cityError;
        }

        if (dataToValidate.postal_code && dataToValidate.postal_code.trim()) {
            const postalCodeError = validatePostalCode(
                dataToValidate.postal_code
            );
            if (postalCodeError) errors.postal_code = postalCodeError;
        }

        setFieldErrors(errors);
        const isValid = Object.keys(errors).length === 0;

        return isValid;
    }, []);

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();

            if (!initialData) return;

            // D'abord, nettoyer les données
            const sanitizedForm = { ...formData };
            for (const field of PROFILE_FIELDS) {
                const rawValue = formData[field] ?? "";
                const sanitized =
                    typeof rawValue === "string" ? rawValue.trim() : rawValue;
                sanitizedForm[field] = sanitized;
            }

            // Validation frontend - si elle échoue, on arrête tout
            if (!validateForm(sanitizedForm)) {
                return;
            }

            // Si on arrive ici, la validation frontend a réussi
            setFieldErrors({});

            // Construire le payload des champs modifiés
            const payload = {};
            for (const field of PROFILE_FIELDS) {
                const sanitized = sanitizedForm[field];
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
                const errorMessage = error?.response?.data?.message;
                const validationErrors = error?.response?.data?.errors;

                if (validationErrors && Array.isArray(validationErrors)) {
                    // Transformer le tableau d'erreurs en objet fieldErrors
                    const errors = {};
                    validationErrors.forEach((error) => {
                        errors[error.field] = error.message;
                    });
                    setFieldErrors(errors);
                } else {
                    // Sinon, afficher l'erreur générale
                    const message =
                        errorMessage || "La mise à jour du profil a échoué";
                    showError?.(message);
                }
            } finally {
                setIsSubmitting(false);
            }
        },
        [
            formData,
            initialData,
            validateForm,
            refresh,
            showError,
            showInfo,
            showSuccess,
        ]
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
        fieldErrors,
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
