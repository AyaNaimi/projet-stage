import React from "react";
import { Form, Button } from "react-bootstrap";
import { Tag, Barcode } from "lucide-react";
import { width } from "@mui/system";

const RecetteForm = ({
  show,
  formData,
  setFormData,
  handleSubmit,
  loading,
  matierePremieres = [],
  closeForm,
  formContainerStyle,
}) => {



  if (!show) {
    return null;
  }


  const inputStyle = {
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    padding: "0.6rem 1rem",
    fontSize: "15px",
    background: "#fff",
    width:"100%",
  };



  const handleChange = (index, field, value) => {
    const updatedRecettes = [...(formData.recette || [])];
  
    updatedRecettes[index] = {
      ...updatedRecettes[index],
      [field]: value,
    };
  
    const quantite =
      parseFloat(updatedRecettes[index].quantite) || 0;
  
    const perte =
      parseFloat(updatedRecettes[index].perte) || 0;
  
    updatedRecettes[index].quantite_reelle = (
      quantite +
      (quantite * perte) / 100
    ).toFixed(2);
  
    setFormData((prev) => ({
      ...prev,
      recette: updatedRecettes,
    }));
  };

  

  return (
    <div
      id="formContainerunique"
      style={{
        ...formContainerStyle,

        position: "fixed",
        //top: "90px",
        bottom:"20px",

        right: show ? 0 : "-100%",

        width: "42%",
        height: "62vh",

        overflowY: "auto",

        background: "#fff",

        padding: "18px",

        borderRadius: "16px 0 0 16px",

        boxShadow:
          "-5px 0 20px rgba(0,0,0,0.08)",

        zIndex: 999,

        transition: "all 0.3s ease",
      }}
    >



      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h4
          style={{
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          Composition de la recette
        </h4>
      </div>



      <div
        style={{
          display: "flex",
          flexDirection:"column",
          gap: "15px",
          marginBottom: "25px",
        }}
      >


        <div style={{ flex: 1 }}>
          <label
            style={{
              fontWeight: 600,
              marginBottom: "8px",
              display: "block",
            }}
          >
            <Tag size={16} /> Produit
          </label>

          <input
            type="text"
            className="form-control"
            value={formData.designation || ""}
            readOnly
            style={{
              ...inputStyle,
              background: "#f3f4f6",
            }}
          />
        </div>

       

        <div style={{ flex: 1 }}>
          <label
            style={{
              fontWeight: 600,
              marginBottom: "8px",
              display: "block",
            }}
          >
            <Barcode size={16} /> Code Produit
          </label>

          <input
            type="text"
            className="form-control"
            value={
              formData.Code_produit || ""
            }
            readOnly
            style={{
              ...inputStyle,
              background: "#f3f4f6",
            }}
          />
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        
        {(formData.recette || []).map((line, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "15px",
              marginBottom: "15px",
              background: "#fafafa",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Matière première
                </label>
        
                <select
                  className="form-select"
                  style={inputStyle}
                  value={line.matiere_premiere_id || ""}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "matiere_premiere_id",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Sélectionner
                  </option>
        
                  {matierePremieres.map((m) => (
                    <option
                      key={m.id}
                      value={m.id}
                    >
                      {m.nom || m.designation}
                    </option>
                  ))}
                </select>
              </div>
        
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Quantité
                </label>
        
                <input
                  type="number"
                  className="form-control"
                  style={inputStyle}
                  value={line.quantite || ""}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "quantite",
                      e.target.value
                    )
                  }
                />
              </div>
        
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Unité
                </label>
        
                <input
                  type="text"
                  className="form-control"
                  style={inputStyle}
                  value={line.unite || ""}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "unite",
                      e.target.value
                    )
                  }
                />
              </div>
        
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Perte (%)
                </label>
        
                <input
                  type="number"
                  className="form-control"
                  style={inputStyle}
                  value={line.perte || ""}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "perte",
                      e.target.value
                    )
                  }
                />
              </div>
        
              <div>
                <label
                  style={{
                    fontWeight: 600,
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Quantité réelle
                </label>
        
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  style={{
                    ...inputStyle,
                    background: "#f3f4f6",
                  }}
                  value={line.quantite_reelle || ""}
                />
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: "35px",
            textAlign: "center",
          }}
        >
          <Button
            type="submit"
            disabled={loading}
            style={{
              background: "#00afaa",
              border: "none",
              padding:
                "10px 35px",
              marginRight: "10px",
            }}
          >
            {loading
              ? "Chargement..."
              : "Enregistrer"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={closeForm}
            style={{
              padding:
                "10px 35px"
            }}
          >
            Annuler
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RecetteForm;