import axiosInstance from '../axiosInstance';

export const getStockProduction = async () => {
  const response = await axiosInstance.get('/stock_production');
  return response.data;
};

export const getProduits = async () => {
  const response = await axiosInstance.get('/api/produits');
  return response.data?.produit || response.data;
};

export const getProductions = async () => {
  const response = await axiosInstance.get('/api/productions');
  return response.data;
};

export const deleteLignePoidsCongeles = async (id) => {
  const response = await axiosInstance.delete(`/api/ligne-poids-congeles/${id}`);
  return response.data;
};

export default {
  getStockProduction,
  getProduits,
  getProductions,
  deleteLignePoidsCongeles,
};
