const FilterToggleButton = ({ showFilters, toggleFilters }) => {
  return (
    <button
      type="button"
      onClick={toggleFilters}
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: "999px",
        backgroundColor: showFilters ? "#e0f2f1" : "#ffffff",
        color: "#1f2937",
        padding: "10px 16px",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {showFilters ? "Masquer filtres" : "Afficher filtres"}
    </button>
  );
};

export default FilterToggleButton;
