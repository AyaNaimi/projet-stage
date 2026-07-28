import React from "react";
import { resolveImageUrl } from "../utils/imageUtils";

/**
 * ProductCard — Carte moderne pour afficher un produit dans un layout grille.
 * Affiche : logo, code, designation, famille, prix, état + actions au survol.
 */
const ProductCard = ({ product, onEdit, onDelete, isSelected, onSelect }) => {
  const imageSrc = resolveImageUrl(
    product.logoP || product.logo_url || product.imageUrl || product.photo_url,
    ""
  );

  const etat = product.etat_produit || "actif";
  const isActif = etat === "actif";
  const prixVente = product.prix_produits_last?.prixProduit;
  const famille = product.categorie?.categorie || "—";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: isSelected ? "2px solid #00afaa" : "1px solid #e5e7eb",
        overflow: "hidden",
        transition: "all 0.2s ease",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Checkbox sélection */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(product.id)}
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 2,
          width: 16,
          height: 16,
          cursor: "pointer",
          accentColor: "#00afaa",
        }}
      />

      {/* Badge état */}
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          padding: "2px 10px",
          borderRadius: 12,
          fontSize: 10,
          fontWeight: 700,
          background: isActif ? "#dcfce7" : "#fee2e2",
          color: isActif ? "#16a34a" : "#dc2626",
        }}
      >
        {etat}
      </div>

      {/* Zone image / logo */}
      <div
        style={{
          height: 120,
          background: "linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.designation}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
        ) : (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 24,
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {product.designation?.charAt(0)?.toUpperCase() || "P"}
          </div>
        )}
      </div>

      {/* Contenu texte */}
      <div style={{ padding: "12px 14px" }}>
        {/* Code */}
        <div
          style={{
            fontSize: 11,
            color: "#0d9488",
            fontWeight: 600,
            letterSpacing: "0.5px",
            marginBottom: 4,
          }}
        >
          {product.Code_produit}
        </div>

        {/* Désignation */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#1e293b",
            lineHeight: 1.3,
            marginBottom: 6,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={product.designation}
        >
          {product.designation}
        </div>

        {/* Famille */}
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginBottom: 10,
          }}
        >
          {famille}
        </div>

        {/* Prix + Marge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #f3f4f6",
            paddingTop: 8,
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>Prix vente</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e40af" }}>
              {prixVente ? `${Number(prixVente).toFixed(2)} DH` : "—"}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(product); }}
              title="Modifier"
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: "none",
                background: "#f0f9ff",
                color: "#2563eb",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#dbeafe"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#f0f9ff"}
            >
              ✎
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
              title="Supprimer"
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: "none",
                background: "#fef2f2",
                color: "#dc2626",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#fef2f2"}
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
