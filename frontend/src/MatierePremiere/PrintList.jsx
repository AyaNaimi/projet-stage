import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

const PrintList = ({ title, filteredMatieres }) => {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "");

    if (printWindow) {
      const newWindowDocument = printWindow.document;
      newWindowDocument.write(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
          <style>
            body { font-family: 'Arial', sans-serif; padding: 20px; }
            .page-header { text-align: center; font-size: 24px; margin-bottom: 20px; color: #00afaa; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; }
          </style>
        </head>
        <body>
          <div class="page-header">${title}</div>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prix d'achat</th>
                <th>Unité</th>
                <th>Fournisseur</th>
              </tr>
            </thead>
            <tbody>
              ${filteredMatieres.map((m) => `
                <tr>
                  <td>${m.nom}</td>
                  <td>${m.prix_achat} DH</td>
                  <td>${m.unite}</td>
                  <td>${m.fournisseur?.raison_sociale || m.fournisseur?.nom || 'N/A'}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <script>
            setTimeout(() => {
              window.print();
              window.onafterprint = function () { window.close(); };
            }, 500);
          </script>
        </body>
        </html>
      `);
      newWindowDocument.close();
    }
  };

  return (
    <FontAwesomeIcon
      style={{ cursor: "pointer", color: "grey", fontSize: "2rem" }}
      onClick={handlePrint}
      icon={faPrint}
      title="Imprimer"
    />
  );
};

export default PrintList;
