export default function SelectDropdown({
    label,
    value,
    onChange,
    options,
    error,
    className = "",
    required = false,
    id,
    placeholder,
    ...props
}) {
    const selectClassName = `input ${error ? "error" : ""} ${className}`.trim();

    return (
        <div className="select-group">
            {label && (
                <label htmlFor={id}>
                    {label}
                    {required && " *"}
                </label>
            )}
            <select
                id={id}
                className={selectClassName}
                value={value}
                onChange={onChange}
                required={required}
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="field-error">{error}</span>}
        </div>
    );
}
