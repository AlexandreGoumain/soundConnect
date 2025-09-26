import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordField({
    label,
    name,
    id,
    value,
    onChange,
    showPassword,
    onTogglePassword,
    error,
    className = "",
    required = false,
    placeholder,
    ...props
}) {
    const fieldId = id || name;
    const inputClassName = `input auth-form__password-input ${
        error ? "input-error" : ""
    } ${className}`.trim();

    return (
        <div className="form-group">
            {label && (
                <label className="label" htmlFor={fieldId}>
                    {label}
                    {required && " *"}
                </label>
            )}
            <div className="auth-form__password-field">
                <input
                    id={fieldId}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    className={inputClassName}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    {...props}
                />
                <button
                    type="button"
                    className="auth-form__password-toggle"
                    onClick={onTogglePassword}
                    aria-label={
                        showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                    }
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            {error && <span className="field-error">{error}</span>}
        </div>
    );
}
