import React from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

// Simple SVG icons
const icons = {
  ChevronUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="18,15 12,9 6,15"></polyline>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6,9 12,15 18,9"></polyline>
    </svg>
  ),
  Package: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  ),
  List: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  )
};

// Custom Select Component (controlled, generic)
const CustomSelect = ({ options, value, onChange, placeholder, error }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuStyle, setMenuStyle] = React.useState({ top: 0, left: 0, width: 0 });
  const deriveSelected = (val) => {
    // Accept scalar value, option object, or single-element array
    const scalar = Array.isArray(val)
      ? (val.length > 0 ? (val[0]?.value ?? val[0]) : undefined)
      : (typeof val === 'object' && val !== null && 'value' in val ? val.value : val);
    return options.find(opt => opt.value === scalar) || null;
  };
  const [selectedOption, setSelectedOption] = React.useState(deriveSelected(value));
  React.useEffect(() => {
    setSelectedOption(deriveSelected(value));
  }, [value, options]);

  const inputStyle = {
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    padding: '0.6rem 1rem',
    fontSize: 15,
    background: '#fff',
    color: '#000',
    width: '100%',
    boxSizing: 'border-box'
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    // Return scalar value for simplicity; caller can map as needed
    onChange(option.value, option);
    setIsOpen(false);
  };

  // Position dropdown using a portal so it escapes overflow clipping
  const updateMenuPosition = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMenuStyle({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width
    });
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();
    const onScroll = () => updateMenuPosition();
    const onResize = () => updateMenuPosition();
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && triggerRef.current && !triggerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [isOpen, updateMenuPosition]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...inputStyle,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: error ? '1px solid #dc3545' : inputStyle.border,
          backgroundColor: '#fff'
        }}
      >
        <span style={{ color: selectedOption ? '#000' : '#9ca3af' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span style={{ color: '#6b7280' }}>
          {isOpen ? <icons.ChevronUp /> : <icons.ChevronDown />}
        </span>
      </div>

      {isOpen && ReactDOM.createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: menuStyle.top,
            left: menuStyle.left,
            width: menuStyle.width,
            backgroundColor: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
            zIndex: 100000,
            maxHeight: '240px',
            overflowY: 'auto'
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              style={{
                padding: '0.6rem 1rem',
                cursor: 'pointer',
                borderBottom: index < options.length - 1 ? '1px solid #f3f4f6' : 'none',
                backgroundColor: '#fff',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
            >
              {option.label}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

const TableForms = ({
  // Data props
  items = [],
  availableItems = [],
  
  // Configuration props
  title = "Produits",
  addButtonText = "Ajouter Produit",
  columns,
  
  // Mapping configuration for legacy/default mode
  itemConfig = {
    selectField: 'Unite',
    displayField: 'Code_produit',
    valueField: 'id',
    quantityField: 'quantite',
    commentField: 'N_lot'
  },
  
  // Event handlers
  onAddItem,
  onDeleteItem,
  onItemSelection,
  onInputChange,
  onToggleExpansion,
  // Generic update for column-driven mode
  onItemChange,
  
  // Select options per column key (when using column-driven mode)
  selectOptionsMap = {},
  
  // State props
  errors = {},
  expandedRows = {},
  detailsTableValues = {},
  
  // UI configuration
  showExpandableDetails = true,
  expandableDetailsTitle = "Détails supplémentaires",
  detailsFieldsCount = 20,
  detailsColumnsPerRow = 5
}) => {
  const inputStyle = {
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    padding: '0.6rem 1rem',
    fontSize: 15,
    background: '#fff',
    color: '#000',
    width: '100%',
    boxSizing: 'border-box'
  };

  const renderDetailFields = (itemIndex, itemData) => {
    const rows = Math.ceil(detailsFieldsCount / detailsColumnsPerRow);
    
    return (
      <table className="detail-table" style={{ width: '100%' }}>
        <tbody>
          {[...Array(rows)].map((_, rowIdx) => (
            <tr key={`detail-row-${itemIndex}-${rowIdx}`}>
              {[...Array(detailsColumnsPerRow)].map((_, colIdx) => {
                const fieldIndex = rowIdx * detailsColumnsPerRow + colIdx;
                if (fieldIndex >= detailsFieldsCount) return null;
                
                const fieldId = `field_${fieldIndex}`;
                return (
                  <td key={`detail-col-${itemIndex}-${fieldIndex}`}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ 
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem',
                        display: 'block'
                      }}>
                        Champ {fieldIndex + 1}
                      </label>
                      <input
                        type="text"
                        className="styled-input"
                        style={{ 
                          ...inputStyle,
                          fontSize: '0.875rem',
                          padding: '0.375rem 0.75rem'
                        }}
                        placeholder={`Valeur ${fieldIndex + 1}`}
                        value={detailsTableValues[`${itemIndex}_${itemData[itemConfig.valueField]}_${fieldId}`] || ''}
                        onChange={(event) => onInputChange(itemIndex, fieldId, event)}
                      />
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const defaultColumns = [
    { key: 'item', label: 'Unité', width: '30%', type: 'select' },
    { key: itemConfig.quantityField, label: 'Quantité', width: '20%', type: 'text' },
    { key: itemConfig.commentField, label: 'Commentaire', width: '30%', type: 'text' },
    { key: 'actions', label: 'Actions', width: '20%', type: 'actions' }
  ];

  const effectiveColumns = Array.isArray(columns) && columns.length > 0 ? columns : defaultColumns;

  const renderCellByType = (column, itemData, index) => {
    const fieldKey = column.field || column.key;
    const commonInputStyle = { ...inputStyle, width: '100%' };

    switch (column.type) {
      case 'select': {
        const options = column.renderOptions 
          ? column.renderOptions(itemData)
          : (column.options || selectOptionsMap[fieldKey] || availableItems.map((item) => ({
              value: item[itemConfig.valueField],
              label: item[itemConfig.selectField]
            })));
        const value = itemData[fieldKey] ?? itemData[`${itemConfig.valueField.replace('id', '')}_id`] ?? '';
        return (
          <CustomSelect
            options={options}
            value={value}
            onChange={(val, option) => {
              if (onItemChange) {
                onItemChange(index, fieldKey, val, option, itemData);
              } else if (onItemSelection) {
                onItemSelection({ [`${itemConfig.valueField.replace('id', '')}_id`]: val }, index);
              }
            }}
            placeholder={column.placeholder || 'Sélectionner'}
            error={errors[`${fieldKey}_${index}`]}
          />
        );
      }
      case 'date':
      case 'text':
      case 'number': {
        const inputType = column.type === 'date' ? 'date' : (column.type === 'number' ? 'number' : 'text');
        return (
          <input
            type={inputType}
            className="styled-input"
            style={{
              ...commonInputStyle,
              backgroundColor: column.readOnly ? '#f5f5f5' : '#fff',
              color: column.readOnly ? '#6b7280' : '#000',
              cursor: column.readOnly ? 'not-allowed' : 'text'
            }}
            placeholder={column.placeholder || ''}
            value={itemData[fieldKey] ?? ''}
            readOnly={column.readOnly || false}
            onChange={(event) => {
              if (onItemChange) {
                onItemChange(index, fieldKey, event.target.value, undefined, itemData);
              } else if (onInputChange) {
                onInputChange(index, fieldKey, event);
              }
            }}
          />
        );
      }
      case 'custom': {
        return column.render ? column.render({ index, itemData, errors, onItemChange }) : null;
      }
      case 'actions':
      default: {
        return (
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => onDeleteItem && onDeleteItem(index, itemData)}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc3545',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              title="Supprimer"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
            {showExpandableDetails && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleExpansion && onToggleExpansion(index);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#eff6ff'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                title={expandedRows[index] ? 'Réduire' : 'Développer'}
              >
                {expandedRows[index] ? <icons.ChevronUp /> : <icons.ChevronDown />}
              </button>
            )}
          </div>
        );
      }
    }
  };

  return (
    <>
      {/* Add the same custom CSS */}
      <style>
        {`
          .styled-input::placeholder {
            color: #9ca3af !important;
            opacity: 1 !important;
            font-size: 15px !important;
          }
          
          .ColoretableForm {
            background-color: #f8f9fa !important;
            font-weight: 500 !important;
            border-bottom: 2px solid #e9ecef !important;
            color: #495057 !important;
            padding: 0.75rem !important;
          }
          
          .table-bordered {
            border: 1px solid #dee2e6;
            border-radius: 0.5rem;
            overflow: hidden;
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
          }
          
          .table-bordered td, .table-bordered th {
            padding: 0.5rem !important;
            vertical-align: middle !important;
            border-color: #dee2e6 !important;
            border-right: 1px solid #dee2e6;
            border-bottom: 1px solid #dee2e6;
          }
          
          .table-bordered th:last-child,
          .table-bordered td:last-child {
            border-right: none;
          }
          
          .table-bordered tr:last-child td {
            border-bottom: none;
          }
          
          .detail-table {
            background-color: #f8f9fa !important;
            border-radius: 0.5rem;
            overflow: hidden;
          }
          
          .detail-table td {
            padding: 0.25rem !important;
          }
        `}
      </style>

      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        padding: '1.5rem 2rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h5 style={{ 
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <icons.Package />
            {title}
          </h5>
          
          <button 
            type="button"
            onClick={onAddItem}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#00afaa',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            {addButtonText}
          </button>
        </div>

        <div style={{ overflowX: 'auto', overflowY: 'visible', position: 'relative' }}>
          <table className="table-bordered">
            <thead>
              <tr>
                {effectiveColumns.map((column, index) => (
                  <th 
                    key={index} 
                    className="ColoretableForm" 
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((itemData, index) => (
                <React.Fragment key={`row-group-${index}`}>
                  <tr key={`main-row-${index}`}>
                    {effectiveColumns.map((column, colIdx) => (
                      <td key={`cell-${index}-${colIdx}`} style={{ backgroundColor: 'white' }}>
                        {renderCellByType(column, itemData, index)}
                        {column.type !== 'actions' && errors[`${(column.field || column.key)}_${index}`] && (
                          <div style={{ color: '#dc3545', fontSize: 13, marginTop: 4 }}>
                            {errors[`${(column.field || column.key)}_${index}`]}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Expandable Details Row */}
                  {showExpandableDetails && expandedRows[index] && (
                    <tr key={`expanded-row-${index}`}>
                      <td colSpan={effectiveColumns.length} style={{ padding: '1rem', backgroundColor: '#f8f9fa' }}>
                        <div style={{ padding: '0 1rem' }}>
                          <h6 style={{ 
                            marginBottom: '1rem',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: '#374151',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <icons.List />
                            {expandableDetailsTitle}
                          </h6>
                          {renderDetailFields(index, itemData)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TableForms;