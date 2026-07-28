import { useState, useEffect, useCallback } from "react";

const useSortableData = (initialData) => {
  const [sortedData, setSortedData] = useState(() => initialData || []);  // Initialisation avec les données
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState(0); // 0: normal, 1: asc, 2: desc

  const handleSort = useCallback((column, isNested = false) => {
    let newSortOrder = sortOrder;

    if (sortColumn === column) {
      newSortOrder = (sortOrder + 1) % 3; // Cycle between 0 (no sort), 1 (ascending), 2 (descending)
    } else {
      newSortOrder = 1; // Start with ascending order
    }

    setSortColumn(column);
    setSortOrder(newSortOrder);

    if (newSortOrder === 0) {
      setSortedData(initialData || []); // Return to initial state (no sorting)
      return;
    }

    const sorted = [...(initialData || [])].sort((a, b) => {
      // Special handling for calculated columns
      if (column === "totalHT" || column === "totalTTC") {
        let aTotalHT = 0;
        let aTotalTTC = 0;
        a.ligne_facture?.forEach(ligne => {
          aTotalHT += Number(ligne.tt || 0);
          aTotalTTC += Number(ligne.ttc || 0);
        });

        let bTotalHT = 0;
        let bTotalTTC = 0;
        b.ligne_facture?.forEach(ligne => {
          bTotalHT += Number(ligne.tt || 0);
          bTotalTTC += Number(ligne.ttc || 0);
        });

        const aValue = column === "totalHT" ? aTotalHT : aTotalTTC;
        const bValue = column === "totalHT" ? bTotalHT : bTotalTTC;

        return newSortOrder === 1 ? aValue - bValue : bValue - aValue;
      }

      // Handle remise column (simple numeric fallback)
      if (column === "remise") {
        const aValue = parseFloat(a.remise || 0);
        const bValue = parseFloat(b.remise || 0);
        return newSortOrder === 1 ? aValue - bValue : bValue - aValue;
      }

      // Handle nested properties (like fournisseur.raison_sociale)
      if (isNested) {
        const getNestedValue = (obj, path) =>
          path.split('.').reduce((o, key) => (o ? o[key] : ""), obj) || "";

        let aValue = getNestedValue(a, column);
        let bValue = getNestedValue(b, column);

        return newSortOrder === 1
          ? String(aValue).localeCompare(String(bValue), 'fr', { sensitivity: 'base' })
          : String(bValue).localeCompare(String(aValue), 'fr', { sensitivity: 'base' });
      }

      // Handle date column
      if (column === "date") {
        return newSortOrder === 1
          ? new Date(a[column] || 0) - new Date(b[column] || 0)
          : new Date(b[column] || 0) - new Date(a[column] || 0);
      }

      // Handle regular string or number columns
      const aValue = a[column] || "";
      const bValue = b[column] || "";

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newSortOrder === 1 ? aValue - bValue : bValue - aValue;
      }

      return newSortOrder === 1
        ? String(aValue).localeCompare(String(bValue), 'fr', { sensitivity: 'base' })
        : String(bValue).localeCompare(String(aValue), 'fr', { sensitivity: 'base' });
    });

    setSortedData(sorted);
  }, [initialData, sortColumn, sortOrder]);

  // Log only when sortColumn changes
  useEffect(() => {
    if (sortColumn !== null) {
      console.log('222sortdara');
    }
  }, [sortColumn]);

  // If the incoming data changes (filtering, searching, etc.), update sortedData
  useEffect(() => {
    setSortedData(initialData || []);
    // reset sort state when underlying data changes
    setSortColumn(null);
    setSortOrder(0);
  }, [initialData]);
  

  return { sortedData, handleSort ,setSortedData,sortColumn,sortOrder};
};

export default useSortableData;
