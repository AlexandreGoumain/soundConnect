import { useState } from "react";
import "./TagsInput.scss";

/**
 * TagsInput - A component for entering and displaying tags as badges
 *
 * @param {string} id - Input field ID
 * @param {string} name - Input field name
 * @param {string} label - Label text
 * @param {string} hint - Optional hint text
 * @param {string} value - Comma-separated tag string
 * @param {function} onChange - Change handler that receives comma-separated string
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message
 */
export default function TagsInput({
    id,
    name,
    label,
    hint,
    value = "",
    onChange,
    placeholder = "Ajouter un tag...",
    error,
}) {
    const [inputValue, setInputValue] = useState("");

    // Convert comma-separated string to array
    const tags = value
        ? value
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
        : [];

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e) => {
        // Add tag on Enter or comma
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(inputValue.trim());
        }
        // Remove last tag on Backspace if input is empty
        else if (
            e.key === "Backspace" &&
            inputValue === "" &&
            tags.length > 0
        ) {
            removeTag(tags.length - 1);
        }
    };

    const handleInputBlur = () => {
        // Add tag on blur if there's text
        if (inputValue.trim()) {
            addTag(inputValue.trim());
        }
    };

    const addTag = (tag) => {
        if (!tag) {
            setInputValue("");
            return;
        }

        // Avoid duplicates
        if (!tags.includes(tag)) {
            const newTags = [...tags, tag];
            onChange({ target: { name, value: newTags.join(", ") } });
        }
        setInputValue("");
    };

    const removeTag = (indexToRemove) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        onChange({ target: { name, value: newTags.join(", ") } });
    };

    return (
        <div className={`tags-input ${error ? "tags-input--error" : ""}`}>
            {label && (
                <label htmlFor={id} className="tags-input__label">
                    {label}
                    {hint && <span className="tags-input__hint">{hint}</span>}
                </label>
            )}

            <div className="tags-input__container">
                {tags.map((tag, index) => (
                    <span key={index} className="tags-input__tag">
                        {tag}
                        <button
                            type="button"
                            className="tags-input__tag-remove"
                            onClick={() => removeTag(index)}
                            aria-label={`Retirer ${tag}`}
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    id={id}
                    name={name}
                    className="tags-input__input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleInputBlur}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
            </div>

            {error && (
                <span className="tags-input__error" id={`${id}-error`}>
                    {error}
                </span>
            )}
        </div>
    );
}
