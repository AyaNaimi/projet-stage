// API services for MatierePremiere
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/matiere-premieres`;

export const getMatieres = () => axios.get(API_URL);
export const getMatiere = (id) => axios.get(`${API_URL}/${id}`);
export const createMatiere = (data) => axios.post(API_URL, data);
export const updateMatiere = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteMatiere = (id) => axios.delete(`${API_URL}/${id}`);
