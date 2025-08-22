import { ERROR_MESSAGES } from "../constants/homeConstants.js";

export default function ErrorState({ error }) {
    return (
        <div className="error-state">
            <p>
                {ERROR_MESSAGES.FETCH_STUDIOS} {error}
            </p>
        </div>
    );
}