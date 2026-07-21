import axiosInstance from '../axiosInstance';

const API_BASE_URL = '/unites-mesure';

export const getAllUnitesMesure = async () => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des unités de mesure:', error);
    throw error;
  }
};

export const getUnitesMesureById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'unité de mesure (ID: ${id}):`, error);
    throw error;
  }
};

export const createUnitesMesure = async (data) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'unité de mesure:', error);
    throw error;
  }
};

export const updateUnitesMesure = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'unité de mesure (ID: ${id}):`, error);
    throw error;
  }
};

export const deleteUnitesMesure = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'unité de mesure (ID: ${id}):`, error);
    throw error;
  }
};

export const searchUnitesMesure = async (searchTerm) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'unités de mesure:', error);
    throw error;
  }
};

export const getUnitesMesurePaginated = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(API_BASE_URL, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération paginée des unités de mesure:', error);
    throw error;
  }
};

export const getUnitesMesureByCategorie = async (categorie) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/categorie/${categorie}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des unités de mesure (catégorie: ${categorie}):`, error);
    throw error;
  }
};

export default {
  getAllUnitesMesure,
  getUnitesMesureById,
  createUnitesMesure,
  updateUnitesMesure,
  deleteUnitesMesure,
  searchUnitesMesure,
  getUnitesMesurePaginated,
  getUnitesMesureByCategorie,
};
