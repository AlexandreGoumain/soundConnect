export default function DateInput({
    label,
    value,
    onChange,
    min,
    max,
    error,
    className = "",
    required = false,
    id,
    ...props
}) {
    const inputClassName = `input ${error ? "error" : ""} ${className}`.trim();

    return (
        <div className="date-selection">
            {label && (
                <label htmlFor={id}>
                    {label}
                    {required && " *"}
                </label>
            )}
            <input
                id={id}
                type="date"
                className={inputClassName}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                required={required}
                {...props}
            />
            {error && <span className="field-error">{error}</span>}
        </div>
    );
}
