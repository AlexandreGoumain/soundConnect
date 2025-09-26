export default function StudioEquipment({ equipmentList }) {
    if (!equipmentList) return null;

    return (
        <div className="studio-equipment">
            <h2>Équipements</h2>
            <div className="equipment-list">
                {equipmentList.split(",").map((equipment, index) => (
                    <div key={index} className="equipment-item">
                        <span className="equipment-icon">
                            {/* TODO : replace by icon */}✓
                        </span>
                        <span className="equipment-name">
                            {equipment.trim()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
