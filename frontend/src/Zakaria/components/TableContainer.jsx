import TablePagination from "@mui/material/TablePagination";

const TableContainer = ({
  showFilters,
  selectedItems,
  handleDeleteSelected,
  produitsFiltres,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
  heightOffset,
  children,
}) => {
  const offset = showFilters ? heightOffset?.trueOffset ?? 420 : heightOffset?.falseOffset ?? 357;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div style={{ color: "#475569", fontWeight: 500 }}>
          {produitsFiltres.length} produit{produitsFiltres.length > 1 ? "s" : ""}
        </div>

        {selectedItems.length > 0 && (
          <button
            type="button"
            onClick={handleDeleteSelected}
            style={{
              border: "none",
              borderRadius: "999px",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              padding: "8px 14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Supprimer la selection
          </button>
        )}
      </div>

      <div
        style={{
          maxHeight: `calc(100vh - ${offset}px)`,
          overflow: "auto",
        }}
      >
        {children}
      </div>

      <TablePagination
        component="div"
        count={produitsFiltres.length}
        page={Math.max(page - 1, 0)}
        onPageChange={(event, newPage) => handleChangePage(event, newPage + 1)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </div>
  );
};

export default TableContainer;
