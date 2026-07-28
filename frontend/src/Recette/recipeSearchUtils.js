const normalizeSearchValue = (value) => {
  if (value == null) return '';
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
};

const matchesSearchValue = (value, normalizedSearch) => {
  const normalizedValue = normalizeSearchValue(value);
  if (!normalizedValue) return false;

  if (!normalizedSearch) return false;

  const tokens = normalizedValue.split(/[^\p{L}\p{N}]+/u).filter(Boolean);

  if (normalizedSearch.length <= 1) {
    return normalizedValue === normalizedSearch || tokens.some((token) => token === normalizedSearch);
  }

  return (
    normalizedValue === normalizedSearch ||
    normalizedValue.includes(normalizedSearch) ||
    tokens.some((token) => token === normalizedSearch || token.includes(normalizedSearch))
  );
};

export const filterIngredientRowsBySearch = (rows, searchValue) => {
  if (!Array.isArray(rows)) return [];

  const normalizedSearch = normalizeSearchValue(searchValue);
  if (!normalizedSearch) return rows;

  return rows.filter((row) => {
    if (!row || typeof row !== 'object') return false;

    const valuesToCheck = [
      row.product,
      row.productName,
      row.matiere_premiere_nom,
      row.designation,
      row.name,
      row.quantity,
      row.quantite,
      row.realQuantity,
      row.quantite_reelle,
      row.unit,
      row.unite,
      row.wastePercentage,
      row.perte,
      row.id,
    ];

    return valuesToCheck.some((value) => matchesSearchValue(value, normalizedSearch));
  });
};
