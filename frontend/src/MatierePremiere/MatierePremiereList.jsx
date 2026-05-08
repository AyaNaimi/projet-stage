import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import TableMui from "../components/TableMui";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import MatierePremiereForm from "./MatierePremiereForm";
import { Edit3, Trash2, History } from "lucide-react";
import AddButton from "../components/AddButton";
import FilterToggleButton from "../components/FilterToggleButton";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../Produit/All.css";

const MatierePremiereList = () => {
    const [matieres, setMatieres] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [filteredMatieres, setFilteredMatieres] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedItems, setSelectedItems] = useState([]);
    const [openDetails, setOpenDetails] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const [fournisseurFilter, setFournisseurFilter] = useState("");
    const [uniteFilter, setUniteFilter] = useState("");

    const [formData, setFormData] = useState({
        id: null,
        nom: "",
        prix_achat: "",
        unite: "",
        fournisseur_id: "",
        logoP: null,
        historiques: []
    });
    const [errors, setErrors] = useState({});
    const [formContainerStyle, setFormContainerStyle] = useState({
        right: "-100%",
    });
    const [tableContainerStyle, setTableContainerStyle] = useState({
        marginRight: "0%",
        width: "100%"
    });

    const { dynamicStyles } = useOpen();
    const { setTitle, searchQuery, setOnPrint, setOnExportPDF } = useHeader();

    useEffect(() => {
        setTitle("Gestion des Matières Premières");
    }, [setTitle]);

    const fetchMatieres = async () => {
        try {
            const response = await axiosInstance.get("/api/matiere-premieres");
            setMatieres(response.data.data);
        } catch (error) {
            console.error("Error fetching matieres:", error);
        }
    };

    const fetchFournisseurs = async () => {
        try {
            const response = await axiosInstance.get("/api/fournisseurs");
            setFournisseurs(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching fournisseurs:", error);
        }
    };

    useEffect(() => {
        fetchMatieres();
        fetchFournisseurs();
    }, []);

    useEffect(() => {
        const safeSearchQuery = (searchQuery || '').toLowerCase();
        const filtered = matieres.filter((m) => {
            const matchesSearch = (
                m.nom?.toLowerCase().includes(safeSearchQuery) ||
                (m.fournisseur?.nom && m.fournisseur.nom.toLowerCase().includes(safeSearchQuery)) ||
                (m.fournisseur?.raison_sociale && m.fournisseur.raison_sociale.toLowerCase().includes(safeSearchQuery))
            );

            const matchesFournisseur = !fournisseurFilter || m.fournisseur_id === parseInt(fournisseurFilter);
            const matchesUnite = !uniteFilter || m.unite === uniteFilter;

            return matchesSearch && matchesFournisseur && matchesUnite;
        });
        setFilteredMatieres(filtered);
    }, [matieres, searchQuery, fournisseurFilter, uniteFilter]);

    const handleEdit = (matiere) => {
        setFormData({
            id: matiere.id,
            nom: matiere.nom,
            prix_achat: matiere.prix_achat,
            unite: matiere.unite,
            fournisseur_id: matiere.fournisseur_id,
            logoP: null,
            historiques: matiere.historiques || []
        });
        if (formContainerStyle.right === "-100%") {
            setFormContainerStyle({ right: "0", width: "50%" });
            setTableContainerStyle({ marginRight: "48%", width: "52%" });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Cette action est irréversible !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, supprimer"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/api/matiere-premieres/${id}`);
                    fetchMatieres();
                    Swal.fire("Supprimé !", "La matière première a été supprimée.", "success");
                } catch (error) {
                    Swal.fire("Erreur", "Impossible de supprimer la matière première.", "error");
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = formData.id
            ? `/api/matiere-premieres/${formData.id}`
            : `/api/matiere-premieres`;

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'historiques') return;
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });

        if (formData.id) {
            data.append('_method', 'PUT');
        }

        try {
            await axiosInstance.post(url, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchMatieres();
            closeForm();
            Swal.fire("Succès", `Matière première ${formData.id ? 'modifiée' : 'ajoutée'} avec succès.`, "success");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                Swal.fire("Erreur", "Une erreur est survenue.", "error");
            }
        }
    };

    const closeForm = () => {
        setFormContainerStyle({ right: "-100%" });
        setTableContainerStyle({ marginRight: "0", width: "100%" });
        setErrors({});
    };

    const handleShowFormButtonClick = () => {
        setFormData({ id: null, nom: "", prix_achat: "", unite: "", fournisseur_id: "", logoP: null, historiques: [] });
        setErrors({});
        if (formContainerStyle.right === "-100%") {
            setFormContainerStyle({ right: "0", width: "50%" });
            setTableContainerStyle({ marginRight: "48%", width: "52%" });
        } else {
            closeForm();
        }
    };

    const handleSelectAllChange = (e) => {
        if (e.target.checked) {
            setSelectedItems(filteredMatieres.map(m => m.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const noop = () => {};

    return (
        <Box sx={{ ...dynamicStyles }}>
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '60px' }}>
                <div
                    className="container-d-flex justify-content-start"
                    style={{ marginTop: "55px" }}
                >
                    <MatierePremiereForm
                        show={formContainerStyle.right === "0"}
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        fournisseurs={fournisseurs}
                        closeForm={closeForm}
                        formContainerStyle={formContainerStyle}
                        fetchFournisseurs={fetchFournisseurs}
                    />

                    <TableMui
                        columns={[
                            {
                                id: 'select',
                                label: 'SÉLECTION',
                                renderHeader: () => (
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.length === filteredMatieres.length && filteredMatieres.length > 0}
                                        onChange={handleSelectAllChange}
                                    />
                                ),
                                minWidth: 40,
                                render: (row) => (
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(row.id)}
                                        onChange={() => handleCheckboxChange(row.id)}
                                    />
                                )
                            },
                            { id: 'nom', label: 'DÉSIGNATION', minWidth: 200 },
                            { id: 'prix_achat', label: 'PRIX D\'ACHAT', minWidth: 150, render: (row) => `${row.prix_achat} DH` },
                            { id: 'unite', label: 'UNITÉ', minWidth: 100 },
                            {
                                id: 'fournisseur',
                                label: 'FOURNISSEUR',
                                minWidth: 200,
                                render: (row) => row.fournisseur?.nom || row.fournisseur?.raison_sociale || 'N/A'
                            },
                        ]}
                        rows={filteredMatieres}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={(e, newPage) => setPage(newPage)}
                        handleChangeRowsPerPage={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                        produitsFiltres={filteredMatieres}
                        hasActions={true}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        addButtonText="Ajouter"
                        tableContainerStyle={{ 
                            ...tableContainerStyle, 
                            transition: 'all 0.3s ease' 
                        }}
                        selectedItems={selectedItems}
                        handleDeleteSelected={noop}
                        AddButton={AddButton}
                        FilterToggleButton={FilterToggleButton}
                        showFilters={showFilters}
                        toggleFilters={() => setShowFilters(!showFilters)}
                        handleShowFormButtonClick={handleShowFormButtonClick}
                    />
                </div>
            </Box>
        </Box>
    );
};

export default MatierePremiereList;
