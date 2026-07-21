import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Form, DropdownButton } from 'react-bootstrap';

const FiltersComponent = ({
  showFilters,
  genreFiltre,
  setGenreFiltre,
  allColumns,
  columnVisibility,
  toggleColumnVisibility
}) => {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          style={styles.container}
        >
          {/* Sélecteur de genre */}
          <div className="date-filter-container" style={styles.filterContainer}>
            <Form.Select
              aria-label="Sélecteur de genre"
              desibled={true}
              value={genreFiltre}
              onChange={(e) => setGenreFiltre(e.target.value)}
              style={styles.select}
            >
              <option value="">Genre</option>
              <option value="vente">Vente</option>
              <option value="achat">Achat</option>
              <option value="venteachat">Vente & Achat</option>
            </Form.Select>
          </div>

          {/* Masquer les colonnes */}
          <div className="mb-3" style={styles.dropdownContainer}>
            <DropdownButton
              align="end"
              title="Masquer colonnes"
              id="column-toggle-dropdown"
              style={styles.dropdownButton}
            >
              <div style={styles.dropdownContent}>
                {allColumns.map((column) => (
                  <label key={column.key} className="dropdown-item" style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={columnVisibility[column.key]}
                      onClick={() => toggleColumnVisibility(column.key)}
                      style={styles.checkbox}
                    />
                    {column.label}
                  </label>
                ))}
              </div>
            </DropdownButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Styles centralisés
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginLeft: '50.7%',
    marginTop: '0px',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '0px',
    marginLeft: '20px',
  },
  select: {
    padding: '8px',
    fontSize: '12px',
    width: '150px',
    marginTop: '-17px',
  },
  dropdownContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dropdownButton: {
    padding: '8px',
    fontSize: '14px',
    width: '150px',
  },
  dropdownContent: {
    maxHeight: '600px',
    overflowY: 'auto',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkbox: {
    marginRight: '10px',
  },
};

export default FiltersComponent;
