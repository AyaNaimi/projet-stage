import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
import TableToolbar from './TableToolbar';
import PeopleIcon from "@mui/icons-material/People";

/**
 * TableMui: composant réutilisable pour toutes les tables MUI simples.
 * Props :
 * - columns: array [{ id, label, minWidth, align, format, render }]
 * - rows: array of data objects
 * - page, setPage, rowsPerPage, setRowsPerPage (optionnels, sinon gérés en interne)
 * - maxHeight: hauteur max du scroll (optionnel)
 */

import TablePagination from '@mui/material/TablePagination';
import { Pagination } from '@mui/material';
import { Button } from 'react-bootstrap';

export default function TableMui({
  columns,
  rows,
  maxHeight,
  renderDetail,
  hasActions = false,
  handleEdit,
  handleDelete,
  handleDuplicate,
  supportPDF,
  renderCustomActions,
  showFilters,
  selectedItems = [],
  handleDeleteSelected,
  handleGenerateCombined,
  produitsFiltres = [],
  rowsPerPage = 10,
  page = 1,
  handleChangePage,
  handleChangeRowsPerPage,
  heightOffset = { trueOffset: 0, falseOffset: 0 },
  AddButton,
  ChartActionButton,
  handleShowFormButtonClickChart,
  FilterToggleButton,
  handleShowFormButtonClick,
  toggleFilters,
  FiltreInput,
  tableContainerStyle,
  toggleDetail,
  openDetails,
  hasChart,
  handleShowFormButtonClickSC,
  handleSelectItem,
  width,
  getRowStyle, // Ajout du support pour getRowStyle
  addButtonText
}) {
  // Gestion de la visibilité des colonnes en interne
  const defaultVisibility = React.useMemo(() => {
    const vis = {};
    columns.forEach(col => {
      vis[col.id || col.key] = true;
    });
    return vis;
  }, [columns]);
  const [columnVisibility, setColumnVisibility] = React.useState(defaultVisibility);

  // Pour synchroniser si columns change dynamiquement
  React.useEffect(() => {
    setColumnVisibility(defaultVisibility);
  }, [defaultVisibility]);

  // Menu d'affichage/masquage des colonnes
  const [showColumnMenu, setShowColumnMenu] = React.useState(false);
  const columnMenuRef = React.useRef();

  // Fermer le menu si on clique en dehors
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target)) {
        setShowColumnMenu(false);
      }
    }
    if (showColumnMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColumnMenu]);

  const handleToggleColumnMenu = () => {
    setShowColumnMenu((prev) => !prev);
  };

  const handleColumnCheckboxChange = (colKey) => {
    setColumnVisibility((prev) => ({ ...prev, [colKey]: !prev[colKey] }));
  };
  // Multi-detail: openDetails = { [rowId]: { [section]: true/false } }
  // Ces props doivent être gérés par le parent (ex: ClientList) et passés ici
  // Si non fournis, fallback à aucun détail ouvert
  const openDetailsSafe = openDetails || {};
  const toggleDetailSafe = toggleDetail || (() => {});

  const headerCellStyles = {
    borderBottom: '2px solid #e0e0e0',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#4b5563',
    backgroundColor: '#f9fafb' ,
    whiteSpace: 'nowrap',
    padding: '0.75rem 1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    
  };
  const tableStyles = {
    boxShadow: 'none',
    borderCollapse: 'separate',
    borderSpacing: 0,
    width: '100%',
  };
// console.log('TableMui rendered with rows:', openDetails, rows);
  return (
        <div 
            style={{
              marginTop: '-45px',
              ...tableContainerStyle,
              maxWidth: width ? width : '100%',
              padding: '0',
              backgroundColor: "#ffff", 
              border: "1px solid #e0e0e0", 
              borderCollapse: "collapse", 
              borderRadius: 10,
              boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            }}>
      <TableToolbar
        AddButton={AddButton}
        ChartActionButton={ChartActionButton}
        handleShowFormButtonClickChart={handleShowFormButtonClickChart}
hasChart={hasChart}
        FilterToggleButton={FilterToggleButton}
        handleShowFormButtonClick={handleShowFormButtonClick}
        showFilters={showFilters}
        toggleFilters={toggleFilters}
        columns={columns}
        columnVisibility={columnVisibility}
        handleColumnCheckboxChange={handleColumnCheckboxChange}
        showColumnMenu={showColumnMenu}
        handleToggleColumnMenu={handleToggleColumnMenu}
        columnMenuRef={columnMenuRef}
        addButtonText={addButtonText}
      />
      {FiltreInput}
      <div
        style={{
          maxWidth: '100%',
          overflow: 'auto',
          height: `calc(105vh - ${showFilters ? heightOffset.trueOffset : heightOffset.falseOffset}px)` ,
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #e0e0e0',
          borderRadius: 10,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        }}
      >
        <TableContainer sx={{ maxHeight }}>
          <Table sx={tableStyles} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) =>
                  columnVisibility && columnVisibility[column.id || column.key] !== false ? (
                    <TableCell
                    sx={headerCellStyles}
                      key={column.id || column.key}
                      align={column.align || (column.numeric ? 'right' : 'left')}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.renderHeader ? column.renderHeader() : column.label}
                    </TableCell>
                  ) : null
                )}
                {hasActions && (
                  <TableCell
                    align="right"
                    sx={{
                      ...headerCellStyles,
                      position: 'sticky',
                      right: 0,
                      zIndex: 2,
                    }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => {
                // Pour chaque row, on regarde si au moins un détail est ouvert
                const rowOpenDetails = openDetailsSafe[row.id] || {};
                const isAnyDetailOpen = Object.values(rowOpenDetails).some(Boolean);
                return (
                  <React.Fragment key={row.id || row.code || idx}>
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      selected={isAnyDetailOpen}
                      style={getRowStyle ? getRowStyle(row) : undefined}
                      sx={{ '& td': { borderRight: '1px solid #e0e0e0', padding: '0.75rem 1rem', textAlign: 'center' } }}
                    >
                      {columns.map((column) => {
                        if (columnVisibility && columnVisibility[column.id || column.key] === false) return null;
                        const value = row[column.id || column.key];
                        // Si la colonne a un render, on lui passe toggleDetail et openDetail, mais version multi-section
                        if (column.render) {
                          // Si la colonne supporte multi-section, elle doit définir column.detailSection
                          const section = column.detailSection;
                          return (
                            <TableCell key={column.id || column.key} align={column.align || (column.numeric ? 'center' : 'center')} sx={{ borderRight: '1px solid #e0e0e0' }}>
                              {column.render(row, {
                                toggleDetail: section
                                  ? () => toggleDetailSafe(row.id, section)
                                  : () => {},
                                openDetail: section
                                  ? !!rowOpenDetails[section]
                                  : false,
                                section
                              })}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={column.id || column.key} align={column.align || (column.numeric ? 'center' : 'center')} sx={{ borderRight: '1px solid #e0e0e0' }}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      {hasActions && (
                      <TableCell
                          align="right"
                          sx={{
                            position: 'sticky', 
                            right: 0,
                            zIndex: 1,
                          background: 'inherit',
                            minWidth: 120,
                          }}
                          onClick={e => e.stopPropagation()}
                        >
                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                            {supportPDF && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (typeof supportPDF === 'function') supportPDF(row.id);
                                }}
                                aria-label="PDF"
                                style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                              >
                                 <FontAwesomeIcon
            className="header-icon print"
            style={{ color: 'red', fontSize: '14px' }}
            icon={faPrint}
          />
                              </button>
                              
                            )}
                            {handleEdit && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(row);
                                }}
                                aria-label="Edit"
                                title="Modifier"
                                style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                              >
                                <FontAwesomeIcon icon={faEdit} style={{ color: '#007bff', fontSize: '14px' }} />
                              </button>
                            )}
                            {handleDuplicate && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicate(row);
                                }}
                                aria-label="Duplicate"
                                title="Dupliquer"
                                style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                              >
                                <span role="img" aria-label="Duplicate">📋</span>
                              </button>
                            )}
                            {handleDelete && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(row.id);
                                }}
                                aria-label="Delete"
                                title="Supprimer"
                                style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                              >
                                <FontAwesomeIcon icon={faTrash} style={{ color: '#ff0000', fontSize: '14px' }} />
                              </button>
                            )}
                            {handleShowFormButtonClickSC&&
                            <button
                               onClick={() => {
                                      handleSelectItem(row);
                                      handleShowFormButtonClickSC();
                                    }}
                                aria-label="Duplicate"
                                title="Dupliquer"
                                style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                              >
                                <PeopleIcon
style={{ color: '#007bff', }}                                    
                                  />
                              </button>
                               
                            }
                            {renderCustomActions && renderCustomActions(row)}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                    {/* Affiche une ligne de détail si au moins un panneau est ouvert */}
                    {isAnyDetailOpen && (
                      <TableRow>
                        <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} sx={{ backgroundColor: '#f5f5f5', p: 0 }}>
                          {renderDetail
                            ? renderDetail(row, rowOpenDetails, toggleDetail)
                            : <pre style={{ margin: 0 }}>{JSON.stringify(row, null, 2)}</pre>}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination and actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div className="pagination-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0' }}>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDeleteSelected}
              disabled={selectedItems?.length === 0}
            >
              <FontAwesomeIcon icon={faTrash} style={{ marginRight: '0.5rem' }} />
              Supprimer
            </button>
            {handleGenerateCombined && (
              <Button
                className="btn btn-primary"
                onClick={handleGenerateCombined}
                disabled={selectedItems.length === 0}
              >
                Générer Facture
              </Button>
            )}
          </div>
          <div className="pagination-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0' }}>
            {/* Sélecteur d'entrées par page */}
            <div className="entries-per-page-container" style={{ display: 'flex', alignItems: 'center' }}>
              <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                style={{
                  width: '60px',
                  padding: '5px 8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#f8f8f8',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%23555\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 5px center',
                  paddingRight: '25px',
                }}
              >
                {[1, 5, 10, 15, 20, 25].map((row) => (
                  <option value={row} key={row}>{row}</option>
                ))}
              </select>
              <span style={{ marginLeft: '8px', fontSize: '14px', color: '#666' }}>lignes par page</span>
            </div>
            {/* Pagination */}
            <Pagination
              count={Math.ceil(produitsFiltres.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

TableMui.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  page: PropTypes.number,
  setPage: PropTypes.func,
  rowsPerPage: PropTypes.number,
  setRowsPerPage: PropTypes.func,
  maxHeight: PropTypes.number,
  renderDetail: PropTypes.func, // optionnel
};