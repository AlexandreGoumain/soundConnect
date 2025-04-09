export default function Error() {
    return (
        <div className="error-container">
            <div className="error-icon">
                <FaExclamationTriangle />
            </div>
            <h1>Error</h1>
            <p>Something went wrong. Please try again later.</p>
        </div>
    );
}
