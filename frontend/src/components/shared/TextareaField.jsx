export default function TextareaField({
    label,
    value,
    onChange,
    error,
    className = "",
    required = false,
    id,
    placeholder,
    rows = 3,
    maxLength,
    showCharCount = false,
    ...props
}) {
    const textareaClassName = `input ${
        error ? "error" : ""
    } ${className}`.trim();

    return (
        <div className="textarea-group">
            {label && (
                <label htmlFor={id}>
                    {label}
                    {required && " *"}
                </label>
            )}
            <textarea
                id={id}
                className={textareaClassName}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                required={required}
                {...props}
            />
            {showCharCount && maxLength && (
                <div className="character-count">
                    {value.length}/{maxLength} caractères
                </div>
            )}
            {error && <span className="field-error">{error}</span>}
        </div>
    );
}
