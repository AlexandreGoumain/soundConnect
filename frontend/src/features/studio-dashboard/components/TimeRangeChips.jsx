export default function TimeRangeChips({ value = "year", onChange }) {
    const options = [
        { key: "week", label: "Cette semaine" },
        { key: "month", label: "Ce mois" },
        { key: "year", label: "Cette année" },
    ];

    return (
        <div className="chip-group">
            {options.map((opt) => (
                <button
                    type="button"
                    key={opt.key}
                    className={"chip" + (value === opt.key ? " active" : "")}
                    onClick={() => onChange?.(opt.key)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

