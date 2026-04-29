import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faClose } from "@fortawesome/free-solid-svg-icons";

const FilterToggleButton = ({ showFilters, toggleFilters, align = "left" }) => {
  return (
    <div style={styles.container(align)}>
      <FontAwesomeIcon
        onClick={toggleFilters}
        icon={showFilters ? faClose : faFilter}
        color={showFilters ? "green" : "#0d6efd"}
        style={styles.icon}
      />
    </div>
  );
};

const styles = {
  container: (align) => ({
    display: "flex",
    justifyContent: align === "right" ? "flex-end" : "flex-start",
    width: "100%", // Prend toute la largeur disponible
    padding: "10px",
  }),
  icon: {
    fontSize: "2rem",
    cursor: "pointer",
  },
};

export default FilterToggleButton;
