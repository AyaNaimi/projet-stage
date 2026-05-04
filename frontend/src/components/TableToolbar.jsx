
import React from 'react';
import ColumnVisibilityMenu from './ColumnVisibilityMenu';

export default function TableToolbar({
  AddButton,
  ChartActionButton,
  FilterToggleButton,
  handleShowFormButtonClick,
  showFilters,
  toggleFilters,
  columns,
  columnVisibility,
  handleColumnCheckboxChange,
  showColumnMenu,
  handleToggleColumnMenu,
  columnMenuRef,
  handleShowFormButtonClickChart,
  hasChart
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 16px 0 0' }}>
      { hasChart&& handleShowFormButtonClick && (
           <ChartActionButton onClick={() => handleShowFormButtonClickChart(true)} />

      )}
      {FilterToggleButton && showFilters !== undefined && toggleFilters && (
        <FilterToggleButton
          showFilters={showFilters}
          toggleFilters={toggleFilters}
          align="right"
        />
      )}
      <ColumnVisibilityMenu
        columns={columns}
        columnVisibility={columnVisibility}
        onToggleColumn={handleColumnCheckboxChange}
        show={showColumnMenu}
        onToggleMenu={handleToggleColumnMenu}
        menuRef={columnMenuRef}
      />
       {AddButton && handleShowFormButtonClick && (
        <AddButton
          onClick={() => handleShowFormButtonClick(false)}
          text="Ajouter Produits"
          align="right"
        />
      )}
    </div>
  );
}
