const SortableColumn = ({ column, sortColumn, sortOrder, onSort }) => {
  const isActive = sortColumn === column;
  const indicator = !isActive ? "↕" : sortOrder === "asc" ? "↑" : "↓";

  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      style={{
        border: "none",
        background: "transparent",
        color: "#0f172a",
        marginLeft: "6px",
        cursor: "pointer",
        fontSize: "12px",
      }}
      aria-label={`Trier par ${column}`}
    >
      {indicator}
    </button>
  );
};

export default SortableColumn;
