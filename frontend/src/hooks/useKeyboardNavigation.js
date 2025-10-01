import { useEffect } from "react";

/**
 * Hook pour gérer la navigation au clavier dans les carousels
 * @param {Object} options - Options de configuration
 * @param {Function} options.onPrevious - Callback pour aller à l'élément précédent
 * @param {Function} options.onNext - Callback pour aller à l'élément suivant
 * @param {boolean} options.enabled - Activer/désactiver la navigation
 * @param {React.RefObject} options.containerRef - Référence du conteneur (optionnel)
 */
export const useKeyboardNavigation = ({
    onPrevious,
    onNext,
    enabled = true,
    containerRef = null,
}) => {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event) => {
            // Navigation avec les flèches
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                onPrevious?.();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                onNext?.();
            }
        };

        const target = containerRef?.current || window;
        target.addEventListener("keydown", handleKeyDown);

        return () => {
            target.removeEventListener("keydown", handleKeyDown);
        };
    }, [onPrevious, onNext, enabled, containerRef]);
};

/**
 * Hook pour gérer le focus trap dans les modals
 * @param {React.RefObject} modalRef - Référence de la modal
 * @param {boolean} isOpen - État d'ouverture de la modal
 */
export const useFocusTrap = (modalRef, isOpen) => {
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const modal = modalRef.current;
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus le premier élément à l'ouverture
        firstElement?.focus();

        const handleKeyDown = (event) => {
            if (event.key !== "Tab") return;

            if (event.shiftKey) {
                // Shift + Tab - Navigation arrière
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab - Navigation avant
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        modal.addEventListener("keydown", handleKeyDown);

        return () => {
            modal.removeEventListener("keydown", handleKeyDown);
        };
    }, [modalRef, isOpen]);
};

/**
 * Hook pour gérer l'échappement avec la touche Escape
 * @param {Function} onEscape - Callback à exécuter lors de l'appui sur Escape
 * @param {boolean} enabled - Activer/désactiver le listener
 */
export const useEscapeKey = (onEscape, enabled = true) => {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onEscape?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onEscape, enabled]);
};
