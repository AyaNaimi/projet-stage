import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faColumns, faSliders } from '@fortawesome/free-solid-svg-icons';

import PropTypes from 'prop-types';

/**
 * ColumnVisibilityMenu: menu dropdown pour afficher/masquer dynamiquement les colonnes d'un tableau.
 * Props:
 * - columns: array [{ id, key, label }]
 * - columnVisibility: object { [colKey]: boolean }
 * - onToggleColumn: function(colKey)
 * - show: boolean (état d'ouverture du menu)
 * - onToggleMenu: function() (ouvre/ferme le menu)
 * - menuRef: ref (pour gestion du clic extérieur)
 */
const ColumnVisibilityMenu = ({
  columns = [],
  columnVisibility = {},
  onToggleColumn,
  show = false,
  onToggleMenu,
  menuRef
}) => {
  return (
    <div  style={{ position: 'relative', marginLeft: 'auto' }}>
      <button
        className="btn btn-outline-primary shadow-sm column-visibility-btn"
        type="button"
        onClick={onToggleMenu}
        style={{
          border: '1.5px solid #b1b1b1',
          color: show ? '#fff' : '#007bff',
          background: show ? '#b9b9b9' : '#fff',
          fontWeight: 700,
          fontSize: 16,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderRadius: 10,
          boxShadow: show ? '0 2px 8px #484848' : 'none',
          transition: 'all 0.2s',
        }}
      >
        <FontAwesomeIcon icon={faSliders} style={{ fontSize: 20, color: show ? '#fff' : '#484848' }} />
        <style>{`
          .column-visibility-btn {
            transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          }
          .column-visibility-btn:hover {
            background: #cacacaff !important;
            color: #fff !important;
            box-shadow: 0 4px 16px rgba(74, 74, 74, 0.25) !important;
            border-color: #dcdedeff !important;
          }
          .column-visibility-btn:hover .fa-sliders {
            color: #fff !important;
          }
        `}</style>
      </button>
      <ul
        className={`dropdown-menu${show ? ' show' : ''}`}
        aria-labelledby="dropdownMenuButtonColumns"
        ref={menuRef}
        style={{ minWidth: 210, maxHeight: 350,marginLeft:'-150px', overflowY: 'auto', padding: 10, borderRadius: 12, boxShadow: '0 4px 16pxrgb(26, 26, 26)' }}
      >
        <li style={{ fontWeight: 700,     color: '#4b5563', fontSize: 16, padding: '6px 8px 10px 8px', borderBottom: '1px solid rgb(142, 141, 141)', marginBottom: 6 }}>Colonnes à afficher</li>
        {columns.map((col) => (
          <li key={col.id || col.key} style={{ padding: '4px 8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 15, margin: 0, fontWeight: 500, color: '#333' }}>
              <input
                type="checkbox"
                checked={!!columnVisibility[col.id || col.key]}
                onChange={() => onToggleColumn(col.id || col.key)}
                style={{ marginRight: 10, accentColor: '#007bff', width: 16, height: 16 }}
              />
              {col.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

ColumnVisibilityMenu.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string.isRequired
    })
  ),
  columnVisibility: PropTypes.object,
  onToggleColumn: PropTypes.func.isRequired,
  show: PropTypes.bool,
  onToggleMenu: PropTypes.func.isRequired,
  menuRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

export default ColumnVisibilityMenu;
