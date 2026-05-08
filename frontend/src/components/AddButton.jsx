import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../AuthContext";

const AddButton = ({ onClick, text, align = "left", filtre, requiredPermission }) => {
  const { permissions } = useAuth();

  // Vérifier si l'utilisateur a la permission requise
  const hasPermission = true;

  return (
    <div
      style={{
        width: "auto",
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
            backgroundColor: hasPermission ? "#00796b" : "#b0bec5", // Gris si désactivé
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "6px 60px",
            fontSize: "15px",
            fontWeight: "600",
            minWidth: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            cursor: hasPermission ? "pointer" : "not-allowed", // Change le curseur si désactivé
            margin: "5px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
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
