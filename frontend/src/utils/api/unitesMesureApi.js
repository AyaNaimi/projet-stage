import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/unites-mesure`;

const token = localStorage.getItem('API_TOKEN');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

/**
 * Récupère toutes les unités de mesure
 * @returns {Promise<Array>} Liste complète des unités de mesure
 */
export const getAllUnitesMesure = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    // Le contrôleur Laravel retourne { data: [...] }
    // Donc on extrait le tableau data
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des unités de mesure:', error);
    throw error;
  }
};

/**
 * Récupère une unité de mesure par ID
 * @param {number} id - ID de l'unité de mesure
 * @returns {Promise} Données de l'unité de mesure
 */
export const getUnitesMesureById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'unité de mesure (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * Crée une nouvelle unité de mesure
 * @param {Object} data - Données de l'unité de mesure à créer
 * @param {string} data.designation - Désignation de l'unité de mesure (ex: "Kilogramme", "Litre", "Unité")
 * @param {string} data.unite - Symbole/code de l'unité (ex: "kg", "L", "U")
 * @param {number} data.quantite - Quantité (optionnel)
 * @returns {Promise} Unité de mesure créée
 */
export const createUnitesMesure = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'unité de mesure:', error);
    throw error;
  }
};

/**
 * Met à jour une unité de mesure existante
 * @param {number} id - ID de l'unité de mesure à modifier
 * @param {Object} data - Nouvelles données de l'unité de mesure
 * @param {string} data.designation - Désignation de l'unité de mesure
 * @param {string} data.unite - Symbole/code de l'unité
 * @param {number} data.quantite - Quantité (optionnel)
 * @returns {Promise} Unité de mesure modifiée
 */
export const updateUnitesMesure = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'unité de mesure (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * Supprime une unité de mesure
 * @param {number} id - ID de l'unité de mesure à supprimer
 * @returns {Promise} Réponse de suppression
 */
export const deleteUnitesMesure = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'unité de mesure (ID: ${id}):`, error);
    throw error;
  }
};

/**
 * Cherche des unités de mesure par nom
 * @param {string} searchTerm - Terme de recherche
 * @returns {Promise} Liste des unités de mesure correspondantes
 */
export const searchUnitesMesure = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'unités de mesure:', error);
    throw error;
  }
};

/**
 * Récupère les unités de mesure paginées
 * @param {number} page - Numéro de la page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise} Données paginées des unités de mesure
 */
export const getUnitesMesurePaginated = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération paginée des unités de mesure:', error);
    throw error;
  }
};

/**
 * Récupère les unités de mesure par catégorie
 * @param {string} categorie - Catégorie d'unité (ex: "poids", "volume", "quantite")
 * @returns {Promise} Liste des unités de mesure de la catégorie
 */
export const getUnitesMesureByCategorie = async (categorie) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categorie/${categorie}`);
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
