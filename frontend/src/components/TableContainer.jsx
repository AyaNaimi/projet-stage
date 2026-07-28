import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPrint } from "@fortawesome/free-solid-svg-icons";
import TablePagination from "@mui/material/TablePagination";
import { Pagination } from "@mui/material";
import { Button } from "react-bootstrap";

const TableContainer = ({
  
  children,
  showFilters,
  selectedItems,
  handleDeleteSelected,
  handleGenerateCombined,
  produitsFiltres,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
  heightOffset = { trueOffset: 500, falseOffset: 435 }, // Valeurs par défaut
  selectedFactures,
  handlePrintSelected
}) => {
  return (
    <>
        <div
      style={{
        maxWidth: "100%",
        overflow: "auto",
        height: `calc(100vh - ${showFilters ? heightOffset.trueOffset : heightOffset.falseOffset}px)`,
        padding: "0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" ,marginTop:'10px'}}>
    <div className="pagination-container" style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between',
  margin: '20px 0',
  gap: '10px'
}}>
        <a href="#">
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDeleteSelected}
            disabled={selectedItems?.length === 0}
          >
            <FontAwesomeIcon icon={faTrash} style={{ marginRight: "0.5rem" }} />
            Supprimer
          </button>
        </a>
        {handleGenerateCombined ?
        <a href="#">
         <Button
                className="btn btn-primary "
                onClick={handleGenerateCombined}
                disabled={selectedItems.length === 0} // Désactiver si aucune facture sélectionnée
            >
                Générer Facture
            </Button>
            </a>:''
        }
        {handlePrintSelected && selectedFactures && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button
              variant="danger"
              onClick={handlePrintSelected}
              disabled={selectedFactures.length === 0}
              className="btn btn-sm"
            >
              <FontAwesomeIcon icon={faPrint} style={{ marginRight: '8px' }} />
              Imprimer Sélectionnées ({selectedFactures.length})
            </Button>
          </div>
        )}
        </div>
        <div className="pagination-container" style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between',
  margin: '20px 0'
}}>
  {/* Sélecteur d'entrées par page */}
  <div className="entries-per-page-container" style={{ display: 'flex', alignItems: 'center' }}>
  <span style={{ fontSize: "14px", color: "#666",marginRight:'10px' }}>
      Nombre des lignes: <strong style={{ color: "#333" }}>{produitsFiltres.length}</strong>
    </span>
    <select
      value={rowsPerPage}
      onChange={handleChangeRowsPerPage}
      style={{
        width: "60px",
        padding: "5px 8px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px",
        backgroundColor: "#f8f8f8",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%23555\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 5px center",
        paddingRight: "25px"
      }}
    >
      {[5, 10, 15, 20, 25,700].map((row) => (
        <option value={row} key={row}>{row}</option>
      ))}
    </select>
    <span style={{ marginLeft: "8px", fontSize: "14px", color: "#666" }}>lignes par page</span>
  </div>

  {/* Pagination avec nombre de BL */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
   
    <Pagination
      count={(Math.ceil(produitsFiltres.length / rowsPerPage))}
      page={page}
      onChange={handleChangePage}
      color="primary"
    />
  </div>
</div>
      </div>

    </div>

    </>

  );
};

export default TableContainer;
