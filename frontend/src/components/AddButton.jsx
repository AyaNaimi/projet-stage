import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../AuthContext";

const AddButton = ({ onClick, text, align = "left", filtre, requiredPermission }) => {
  const { permissions } = useAuth();

  // Vérifier si l'utilisateur a la permission requise
  const hasPermission = requiredPermission ? permissions.includes(requiredPermission) : true;

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
            backgroundColor: hasPermission ? "#00796b" : "#b0bec5", // Gris si désactivé
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: hasPermission ? "pointer" : "not-allowed", // Change le curseur si désactivé
            width: "350px",
            margin: "5px",
          }}
          className="AjouteBotton"
        >
          <FontAwesomeIcon
            icon={faPlus}
            style={{
              color: "white",
            }}
          />
          {"Ajouter"}
        </button>
      </div>
    </div>
  );
};

export default AddButton;
