import { useEffect } from 'react';

export default function Toast({ id, type, message, onRemove, duration = 5000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, onRemove, duration]);

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-message">
                {message}
            </div>
            <button 
                className="toast-close"
                onClick={() => onRemove(id)}
                aria-label="Fermer la notification"
            >
                ✕
            </button>
        </div>
    );
}