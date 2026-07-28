import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Tag, Trash2 } from "lucide-react";
import { computeRealQuantity, formatRealQuantity } from "./recetteUtils";
import { resolveImageUrl } from "../utils/imageUtils";

const createBlankRecipeLine = (unit = "K") => ({
  matiere_premiere_id: "",
  matiere_premiere_nom: "",
  quantite: "",
  unite: unit,
  perte: "",
  quantite_reelle: "",
});

const RecetteForm = ({
  show,
  formData,
  setFormData,
  handleSubmit,
  loading,
  matierePremieres = [],
  closeForm,
  formContainerStyle,
  selectedProduct = null,
  showRecipeIdentity = true,
  showOnlyIngredientForm = false,
}) => {
  // État local pour les ingrédients temporaires (en attente de confirmation)
  const [temporaryIngredients, setTemporaryIngredients] = useState([]);
  // État local pour l'ingrédient actuel en cours de saisie
  const [currentIngredient, setCurrentIngredient] = useState(createBlankRecipeLine(formData?.type_quantite || "K"));

  if (!show) return null;

  const defaultFormStyle = {
    width: "100% !important",
    maxWidth: "100% !important",
    height: "100%",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    boxSizing: "border-box",
  };

  const toFullUrl = (path) => {
    return resolveImageUrl(path || "");
  };

  const inputStyle = {
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    padding: "0.6rem 1rem",
    fontSize: "15px",
    background: "#fff",
    width: "100%",
    minHeight: "44px",
    boxSizing: "border-box",
  };

  // Gérer les changements du formulaire actuel
  const handleCurrentIngredientChange = (field, value) => {
    const updated = { ...currentIngredient };

    if (field === "matiere_premiere_id") {
      if (!value) {
        updated.matiere_premiere_nom = "";
      } else {
        const selectedMatiere = matierePremieres.find((m) => String(m.id) === String(value));
        if (selectedMatiere) {
          updated.matiere_premiere_nom = selectedMatiere.nom || selectedMatiere.designation || "";
        }
      }
      updated[field] = value;
    } else if (field === "quantite" || field === "perte") {
      updated[field] = value;
      // Recalculer quantité réelle si pas définie
      const quantite = field === "quantite" ? parseFloat(value) || 0 : parseFloat(updated.quantite) || 0;
      const perte = field === "perte" ? parseFloat(value) || 0 : parseFloat(updated.perte) || 0;
      if (updated.quantite_reelle === "" || updated.quantite_reelle === undefined) {
        updated.quantite_reelle = computeRealQuantity(quantite, perte).toFixed(2);
      }
    } else {
      updated[field] = value;
    }

    setCurrentIngredient(updated);
  };

  // Ajouter l'ingrédient actuel à la liste temporaire
  const handleAddAnother = () => {
    // Valider que le produit est sélectionné
    if (!currentIngredient.matiere_premiere_id) {
      alert("Veuillez sélectionner un produit lié");
      return;
    }
    if (!currentIngredient.quantite) {
      alert("Veuillez saisir une quantité");
      return;
    }

    // Ajouter à la liste temporaire
    setTemporaryIngredients([...temporaryIngredients, { ...currentIngredient }]);

    // Vider le formulaire pour la prochaine saisie
    setCurrentIngredient(createBlankRecipeLine(formData?.type_quantite || "K"));
  };

  // Supprimer un ingrédient temporaire
  const handleRemoveTemporary = (index) => {
    setTemporaryIngredients(temporaryIngredients.filter((_, i) => i !== index));
  };

  // Enregistrer tous les ingrédients (temporaires + courant si rempli)
  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    // Préparer la liste finale des ingrédients
    let finalIngredients = [...temporaryIngredients];

    // Ajouter l'ingrédient actuel s'il y a quelque chose de saisi
    if (currentIngredient.matiere_premiere_id) {
      finalIngredients.push(currentIngredient);
    }

    if (finalIngredients.length === 0) {
      alert("Veuillez ajouter au moins un ingrédient");
      return;
    }

    // Mettre à jour formData avec tous les ingrédients
    setFormData((prev) => ({
      ...prev,
      recette: finalIngredients,
    }));

    // Appeler le handleSubmit original avec les ingrédients
    await handleSubmit(e);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setFormData((prev) => ({ ...prev, imageFile: null, imagePreview: prev.imagePreview || null }));
      return;
    }

    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, imageFile: file, imagePreview: preview }));
  };

  const renderTemporaryIngredientItem = (ingredient, index) => {
    const mpName = ingredient.matiere_premiere_nom || "À définir";
    return (
      <div key={`temp-${index}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderBottom: "1px solid #d1d5db", fontSize: "14px", color: "#334155" }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 600 }}>{mpName}</span>
          {" — "}
          Qté: {ingredient.quantite} {ingredient.unite || "K"}
          {ingredient.perte ? ` — Perte: ${ingredient.perte}%` : ""}
          {ingredient.quantite_reelle ? ` — Réel: ${formatRealQuantity(ingredient.quantite_reelle)}` : ""}
        </div>
        <button
          type="button"
          onClick={() => handleRemoveTemporary(index)}
          style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer", padding: "4px 8px" }}
          title="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    );
  };

  return (
    <div id="formContainerunique" style={{ ...defaultFormStyle, ...formContainerStyle, width: "100% !important", maxWidth: "100% !important", margin: 0, marginLeft: 0, marginRight: 0, height: "100%", minHeight: 0, maxHeight: "90vh", overflowY: "auto", paddingRight: "8px", position: "relative", background: "#fff", padding: "18px", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", transition: "all 0.3s ease", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "25px", flexShrink: 0 }}>
        <h4 style={{ fontWeight: 700, color: "#0f172a" }}>{showOnlyIngredientForm ? "Ajouter des ingrédients" : "Composition de la recette"}</h4>
      </div>

      {showRecipeIdentity && (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "25px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {((selectedProduct?.logoP || selectedProduct?.image || selectedProduct?.image_url || selectedProduct?.logo_url || selectedProduct?.photo_url) || formData.imagePreview) ? (
              <img src={formData.imagePreview || toFullUrl(selectedProduct?.logoP || selectedProduct?.image || selectedProduct?.image_url || selectedProduct?.logo_url || selectedProduct?.photo_url)} alt={selectedProduct?.designation || selectedProduct?.Code_produit || "Produit"} style={{ width: 80, height: 80, borderRadius: 16, objectFit: "cover", border: "1px solid #e5e7eb" }} />
            ) : null}
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600, marginBottom: "8px", display: "block" }}>
                <Tag size={16} /> Nom de la recette
              </label>
              <input type="text" className="form-control" style={inputStyle} value={formData.recipeName || ""} placeholder="Saisir le nom de la recette" onChange={(e) => setFormData((prev) => ({ ...prev, recipeName: e.target.value }))} />
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 600, marginBottom: "8px", display: "block" }}>Photo de la recette</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} />
          </div>
        </div>
      )}

      {/* Formulaire actuel d'ajout d'ingrédient */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "15px", marginBottom: "15px", background: "#fafafa", flexShrink: 0 }}>
        <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "15px" }}>Nouvel ingrédient</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ fontWeight: 600, marginBottom: "6px", display: "block", fontSize: "14px" }}>Produit lié</label>
            <select className="form-select" style={inputStyle} value={currentIngredient.matiere_premiere_id || ""} onChange={(e) => handleCurrentIngredientChange("matiere_premiere_id", e.target.value)}>
              <option value="">Sélectionner un produit lié</option>
              {matierePremieres.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nom || m.designation || m.Code_produit || `Produit ${m.id}`}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontWeight: 600, marginBottom: "6px", display: "block", fontSize: "14px" }}>Quantité</label>
              <input type="number" className="form-control" style={inputStyle} value={currentIngredient.quantite || ""} onChange={(e) => handleCurrentIngredientChange("quantite", e.target.value)} />
            </div>
            <div>
              <label style={{ fontWeight: 600, marginBottom: "6px", display: "block", fontSize: "14px" }}>Unité</label>
              <input type="text" className="form-control" style={inputStyle} value={currentIngredient.unite || ""} onChange={(e) => handleCurrentIngredientChange("unite", e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontWeight: 600, marginBottom: "6px", display: "block", fontSize: "14px" }}>Perte (%)</label>
              <input type="number" className="form-control" style={inputStyle} value={currentIngredient.perte || ""} onChange={(e) => handleCurrentIngredientChange("perte", e.target.value)} />
            </div>
            <div>
              <label style={{ fontWeight: 600, marginBottom: "6px", display: "block", fontSize: "14px" }}>Quantité réelle</label>
              <input type="number" className="form-control" step="0.01" style={inputStyle} value={currentIngredient.quantite_reelle ?? ""} onChange={(e) => handleCurrentIngredientChange("quantite_reelle", e.target.value)} />
            </div>
          </div>

          {(formData?.id == null || showOnlyIngredientForm) && (
            <button
              type="button"
              onClick={handleAddAnother}
              style={{ border: "none", background: "#0f766e", color: "white", borderRadius: "8px", padding: "10px 16px", cursor: "pointer", fontWeight: 600, marginTop: "8px" }}
            >
              + Ajouter un autre
            </button>
          )}
        </div>
      </div>

      {/* Zone grise - Ingrédients temporaires */}
      {temporaryIngredients.length > 0 && (
        <div style={{ border: "1px solid #d1d5db", borderRadius: "8px", background: "#f3f4f6", marginBottom: "15px", flexShrink: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 15px", background: "#e5e7eb", fontWeight: 700, color: "#0f172a", fontSize: "14px" }}>
            Ingrédients ajoutés ({temporaryIngredients.length})
          </div>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {temporaryIngredients.map((ingredient, index) => renderTemporaryIngredientItem(ingredient, index))}
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexShrink: 0, marginTop: "auto", paddingTop: "15px" }}>
        <Button
          type="button"
          onClick={handleFinalSubmit}
          disabled={loading || (temporaryIngredients.length === 0 && !currentIngredient.matiere_premiere_id)}
          style={{ background: "#00afaa", border: "none", padding: "10px 35px" }}
        >
          {loading ? "Chargement..." : (showOnlyIngredientForm ? "Ajouter et Fermer" : "Enregistrer")}
        </Button>
        <Button type="button" variant="secondary" onClick={closeForm} style={{ padding: "10px 35px" }}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default RecetteForm;