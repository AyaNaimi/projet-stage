export const computeRealQuantity = (quantite, perte) => {
  const quantity = parseFloat(quantite || 0) || 0;
  const lossPercent = parseFloat(perte || 0) || 0;
  const lossFactor = 1 - lossPercent / 100;

  if (lossFactor <= 0) {
    return 0;
  }

  return parseFloat((quantity / lossFactor).toFixed(2));
};

export const formatRealQuantity = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const number = parseFloat(value);
  return Number.isNaN(number) ? "" : number.toFixed(2);
};
