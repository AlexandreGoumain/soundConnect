import { FaExclamationTriangle } from "react-icons/fa";

export default function Error() {
    return (
        <div className="error-container">
            <div className="error-icon">
                <FaExclamationTriangle />
            </div>
            <h1>Erreur</h1>
            <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>
        </div>
    );
}
