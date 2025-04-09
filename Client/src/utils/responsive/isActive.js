/**
 * Vérifie si un chemin est actif dans la navigation
 * @param {string} path - Le chemin à vérifier
 * @param {string} currentPath - Le chemin actuel (location.pathname)
 * @returns {boolean} - Vrai si le chemin est actif
 */
export const isActive = (path, currentPath) => {
    return currentPath === path;
};

export default isActive;
