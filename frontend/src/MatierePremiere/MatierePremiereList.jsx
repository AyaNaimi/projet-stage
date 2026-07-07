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
import { Form } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
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
    const [showImportModal, setShowImportModal] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [importing, setImporting] = useState(false);
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

    const fileInputRef = React.useRef(null);
    const handleImportClick = () => {
        setImportResult(null);
        setShowImportModal(true);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const data = new FormData();
        data.append('file', file);
        setImporting(true);
        try {
            const resp = await axiosInstance.post('/api/matiere-premieres/import-csv', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchMatieres();
            setImportResult({ imported: resp.data.imported, updated: resp.data.updated });
        } catch (err) {
            const payload = err?.response?.data || { message: 'Échec de l\'import CSV' };
            setImportResult({ error: payload });
        } finally {
            setImporting(false);
            e.target.value = null;
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

    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) return;

        Swal.fire({
            title: "Supprimer la sélection ?",
            text: `Voulez-vous supprimer les ${selectedItems.length} matières premières sélectionnées ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await Promise.all(selectedItems.map(id => 
                        axiosInstance.delete(`/api/matiere-premieres/${id}`)
                    ));
                    fetchMatieres();
                    setSelectedItems([]);
                    Swal.fire("Supprimé !", "La sélection a été supprimée.", "success");
                } catch (error) {
                    Swal.fire("Erreur", "Une erreur est survenue.", "error");
                }
            }
        });
    };

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
                    <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        <button onClick={handleShowFormButtonClick} className="btn btn-primary" style={{ borderRadius: 6 }}>
                            Ajouter
                        </button>
                        <button onClick={handleImportClick} className="btn btn-secondary" style={{ borderRadius: 6 }}>
                            Importer CSV
                        </button>
                    </div>

                    {/* Import Modal */}
                    {showImportModal && (
                        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.4)' }}>
                            <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Importer Matières Premières (CSV)</h5>
                                        <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowImportModal(false)} />
                                    </div>
                                    <div className="modal-body">
                                        <p>Format attendu : <code>nom,prix_achat,unite,fournisseur</code></p>
                                        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                            <button className="btn btn-outline-primary" onClick={() => {
                                                const sample = 'nom,prix_achat,unite,fournisseur\nFarine,12.50,kg,Avril Supply\nSucre,8.30,kg,SweetCo\n';
                                                const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = 'matiere_template.csv';
                                                document.body.appendChild(a);
                                                a.click();
                                                a.remove();
                                                URL.revokeObjectURL(url);
                                            }}>Télécharger le template</button>
                                            <label className="btn btn-primary mb-0" style={{ cursor: 'pointer' }}>
                                                Choisir fichier CSV
                                                <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                                            </label>
                                        </div>

                                        {importing && <div>Import en cours...</div>}

                                        {importResult && (
                                            <div style={{ marginTop: 12 }}>
                                                {importResult.error ? (
                                                    <div className="alert alert-danger">
                                                        <strong>Erreur:</strong> {typeof importResult.error === 'string' ? importResult.error : (importResult.error.message || JSON.stringify(importResult.error))}
                                                    </div>
                                                ) : (
                                                    <div className="alert alert-success">
                                                        Importés: <strong>{importResult.imported}</strong>, Mis à jour: <strong>{importResult.updated}</strong>
                                                        {importResult.skipped ? (
                                                            <div style={{ marginTop: 8 }}>
                                                                Lignes ignorées: <strong>{importResult.skipped}</strong> — <a href={importResult.log_url} target="_blank" rel="noreferrer">Télécharger le rapport</a>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowImportModal(false)}>Fermer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
                        handleDeleteSelected={handleDeleteSelected}
                        AddButton={AddButton}
                        FilterToggleButton={FilterToggleButton}
                        showFilters={showFilters}
                        toggleFilters={() => setShowFilters(!showFilters)}
                        handleShowFormButtonClick={handleShowFormButtonClick}
                        heightOffset={{ trueOffset: 250, falseOffset: 200 }}
                        FiltreInput={
                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5 }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-end",
                                            marginTop: "0px",
                                            maxWidth: "100%",
                                            padding: "0 20px",
                                        }}
                                    >
                                        {/* Fournisseur Filter */}
                                        <div
                                            className="date-filter-container"
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginTop: "20px",
                                                marginRight: "20px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <Form.Select
                                                aria-label="Select fournisseur"
                                                value={fournisseurFilter}
                                                onChange={(e) => setFournisseurFilter(e.target.value)}
                                                style={{
                                                    padding: "8px",
                                                    fontSize: "12px",
                                                    width: "200px",
                                                    marginTop: "-17px",
                                                }}
                                            >
                                                <option value="">Tous les fournisseurs</option>
                                                {fournisseurs.map((f) => (
                                                    <option key={f.id} value={f.id}>
                                                        {f.nom || f.raison_sociale}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </div>

                                        {/* Unite Filter */}
                                        <div
                                            className="date-filter-container"
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginTop: "20px",
                                                marginRight: "20px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <Form.Select
                                                aria-label="Select unite"
                                                value={uniteFilter}
                                                onChange={(e) => setUniteFilter(e.target.value)}
                                                style={{
                                                    padding: "8px",
                                                    fontSize: "12px",
                                                    width: "150px",
                                                    marginTop: "-17px",
                                                }}
                                            >
                                                <option value="">Toutes les unités</option>
                                                {[...new Set(matieres.map(m => m.unite))].filter(Boolean).map(u => (
                                                    <option key={u} value={u}>{u}</option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        }
                    />
                </div>
            </Box>
        </Box>
    );
};

export default MatierePremiereList;
