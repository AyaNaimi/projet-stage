import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";

const exportToPdf = (matieres, selectedItems) => {
  if (!matieres || matieres.length === 0) {
    alert("Aucune donnée à exporter !");
    return;
  }

  const pdf = new jsPDF();

  const columns = [
    "Nom",
    "Prix d'achat",
    "Unite",
    "Fournisseur",
  ];

  const selectedMatieres = matieres.filter((m) =>
    selectedItems.includes(m.id)
  );

  const rows = selectedMatieres.map((m) => [
    m.nom,
    `${m.prix_achat} DH`,
    m.unite,
    m.fournisseur?.raison_sociale || m.fournisseur?.nom || 'N/A',
  ]);

  pdf.setFont("helvetica", "bold");
  pdf.text("Liste des Matières Premières", 14, 15);

  pdf.autoTable({
    head: [columns],
    body: rows,
    startY: 25,
    theme: 'striped',
    headStyles: {
      fillColor: [0, 175, 170],
      textColor: [255, 255, 255],
    },
  });

  const filename = `matieres_premieres_${new Date().toISOString()}.pdf`;
  pdf.save(filename);
};

const ExportPdfButton = ({ matieres, selectedItems }) => {
  const isDisabled = !selectedItems || selectedItems.length === 0;
  return (
    <FontAwesomeIcon
      style={{
        cursor: isDisabled ? "not-allowed" : "pointer",
        color: "red",
        fontSize: "2rem",
        marginLeft: "15px",
        opacity: isDisabled ? 0.5 : 1
      }}
      onClick={() => !isDisabled && exportToPdf(matieres, selectedItems)}
      icon={faFilePdf}
      title="Exporter en PDF"
    />
  );
};

export default ExportPdfButton;
