export default function SelectField({
    label,
    name,
    id,
    hint,
    required = false,
    error,
    className = "",
    options = [],
    placeholder = "",
    ...props
}) {
    const fieldId = id || name;
    const selectClassName = `select ${
        error ? "select-error" : ""
    } ${className}`.trim();

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={fieldId}>
                    {label}
                    {required && " *"}
                </label>
            )}
            <select
                id={fieldId}
                name={name}
                className={selectClassName}
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {hint && <small className="hint">{hint}</small>}
            {error && <span className="error-message">{error}</span>}
        </div>
    );
}