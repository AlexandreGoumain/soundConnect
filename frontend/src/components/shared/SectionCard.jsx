export default function SectionCard({
    title,
    subtitle,
    children,
    className,
    error,
}) {
    const classes = className ? `card ${className}` : "card";

    return (
        <section className={classes}>
            <div className="card-header">
                <div className="card-header-title">
                    <h2 className="card-title">{title}</h2>
                    {subtitle && <p className="card-subtitle">{subtitle}</p>}
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>
            <div className="card-body">{children}</div>
        </section>
    );
}
