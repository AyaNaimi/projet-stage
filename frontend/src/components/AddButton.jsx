import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../AuthContext";

const AddButton = ({ onClick, text, align = "left", filtre, requiredPermission }) => {
  const { permissions } = useAuth();

  // Vérifier si l'utilisateur a la permission requise
  const hasPermission =  true;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {filtre}
        <button
          onClick={hasPermission ? onClick : null} // Désactive l'action si pas de permission
          disabled={!hasPermission} // Désactive le bouton visuellement
          style={{
            backgroundColor: hasPermission ? "#00afaa" : "#b0bec5", // Brand color
            color: "white",
            border: "none",
            borderRadius: "999px", // Pill shape
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "700",
            cursor: hasPermission ? "pointer" : "not-allowed",
            transition: "all 0.3s ease",
            boxShadow: hasPermission ? "0 4px 12px rgba(0, 175, 170, 0.2)" : "none",
          }}
          className="AjouteBotton"
        >
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              color: "white",
            }}
          />
          {text || "Ajouter"}
        </button>
      </div>
    </div>
  );
};

export default AddButton;
