export default function Loading() {
    return (
        <div className="loading-container">
            <div className="loading-spinner">
                <FaSpinner className="spin-animation" />
            </div>
            <p>Loading...</p>
        </div>
    );
}
