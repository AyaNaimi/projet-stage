import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const token = localStorage.getItem('API_TOKEN');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const getStockProduction = async () => {
  const response = await axios.get(`${API_BASE}/stock_production`);
  return response.data;
};

export const getProduits = async () => {
  const response = await axios.get(`${API_BASE}/produits`);
  // API may return { produit: [...] } or direct array — normalize
  return response.data?.produit || response.data;
};

export const getProductions = async () => {
  const response = await axios.get(`${API_BASE}/productions`);
  return response.data;
};

export const deleteLignePoidsCongeles = async (id) => {
  const response = await axios.delete(`${API_BASE}/ligne-poids-congeles/${id}`);
  return response.data;
};

export default {
  getStockProduction,
  getProduits,
  getProductions,
  deleteLignePoidsCongeles,
};
