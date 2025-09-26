export default function InputField({
    label,
    name,
    id,
    hint,
    required = false,
    error,
    className = "",
    type = "text",
    ...props
}) {
    const fieldId = id || name;
    const inputClassName = `input ${
        error ? "input-error" : ""
    } ${className}`.trim();

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={fieldId}>
                    {label}
                    {required && " *"}
                </label>
            )}
            <input
                id={fieldId}
                name={name}
                type={type}
                className={inputClassName}
                {...props}
            />
            {hint && <small className="hint">{hint}</small>}
            {error && <span className="error-message">{error}</span>}
        </div>
    );
}
