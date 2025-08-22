import { LOADING_MESSAGES } from "../constants/homeConstants.js";

export default function LoadingState() {
    return (
        <div className="loading-state">
            <p>{LOADING_MESSAGES.STUDIOS}</p>
        </div>
    );
}