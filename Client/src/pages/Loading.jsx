import { FaSpinner } from "react-icons/fa";

export default function Loading() {
    return (
        <div className="loading-container">
            <div className="loading-spinner">
                <FaSpinner className="spin-animation" />
            </div>
            <p>Chargement...</p>
        </div>
    );
}
