import React, { useState, useEffect } from "react";
import axios from "../axiosInstance";
import Swal from "sweetalert2";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Box from "@mui/material/Box";
import Navigation from "../Acceuil/Navigation";
import MatierePremiereListHeader from "./MatierePremiereListHeader";
import TableMui from "../components/TableMui";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import MatierePremiereForm from "./MatierePremiereForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import AddButton from "../components/AddButton";
import FilterToggleButton from "../components/FilterToggleButton";
import ExportPdfButton from "./exportToPdf";
import PrintList from "./PrintList";
import MatierePremiereChart from "./MatierePremiereChart";
import { motion, AnimatePresence } from 'framer-motion';
import "./All.css";

const theme = createTheme();

const MatierePremiereList = () => {
    const [matieres, setMatieres] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [filteredMatieres, setFilteredMatieres] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [openDetails, setOpenDetails] = useState({});

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
    const [formContainerStyle, setFormContainerStyle] = useState({ right: "-100%" });
    const [tableContainerStyle, setTableContainerStyle] = useState({ width: "100%" });
    const [showFilters, setShowFilters] = useState(false);
    const [fournisseurFilter, setFournisseurFilter] = useState("");
    const [uniteFilter, setUniteFilter] = useState("");

    const toggleFilters = () => setShowFilters(!showFilters);

    const { open, dynamicStyles } = useOpen();
    const { title, setTitle, searchQuery, setOnPrint, setOnExportPDF } = useHeader();

    useEffect(() => {
        setTitle("Gestion des Matières Premières");
        setOnPrint(() => printTable);
        setOnExportPDF(() => exportToPDF);
        return () => {
            setOnPrint(null);
            setOnExportPDF(null);
        };
    }, [setTitle, setOnPrint, setOnExportPDF, filteredMatieres]);

    const [familles, setFamilles] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        setTitle("Gestion des Matières Premières");
    }, [setTitle]);

    const fetchMatieres = async () => {
        try {
            const response = await axios.get("/api/matiere-premieres");
            setMatieres(response.data.data);
        } catch (error) {
            console.error("Error fetching matieres:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const resFam = await axios.get("/api/famille-matieres");
            const resTyp = await axios.get("/api/type-matieres");

            setFamilles(resFam.data);
            setTypes(resTyp.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchFournisseurs = async () => {
        try {
            const response = await axios.get("/api/fournisseurs");
            setFournisseurs(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching fournisseurs:", error);
        }
    };

    useEffect(() => {
        fetchMatieres();
        fetchCategories();
        fetchFournisseurs();
    }, []);

    useEffect(() => {
        const filtered = matieres.filter((m) => {
            const matchesSearch = (
                m.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (m.fournisseur?.nom && m.fournisseur.nom.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (m.fournisseur?.raison_sociale && m.fournisseur.raison_sociale.toLowerCase().includes(searchQuery.toLowerCase()))
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
            famille_id: matiere.famille_id || '',
            type_id: matiere.type_id || '',
            photo_url: matiere.photo_url,
            logoP: null,
            historiques: matiere.historiques || []
        });
        setFormContainerStyle({ right: "0" });
        setTableContainerStyle({ width: "65%" });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Supprimer cette matière première ?",
            text: "Cette action est irréversible !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`/api/matiere-premieres/${id}`)
                    .then(() => {
                        fetchMatieres();
                        Swal.fire("Supprimé !", "La matière première a été supprimée.", "success");
                    })
                    .catch((error) => {
                        Swal.fire("Erreur", "Impossible de supprimer la matière première.", "error");
                    });
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
            await axios.post(url, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchMatieres();
            closeForm();
            Swal.fire("Succès", `Matière première ${formData.id ? 'modifiée' : 'ajoutée'} avec succès.`, "success");
        } catch (error) {
            console.error("Error submitting material:", error);
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                const message = error.response?.data?.error || error.response?.data?.message || "Une erreur est survenue.";
                Swal.fire("Erreur", message, "error");
            }
        }
    };

    const closeForm = () => {
        setFormData({ id: null, nom: "", prix_achat: "", unite: "", fournisseur_id: "", famille_id: "", type_id: "", logoP: null, historiques: [] });
        setErrors({});
        setFormContainerStyle({ right: "-100%" });
        setTableContainerStyle({ width: "100%" });
    };

    const handleCheckboxChange = (itemId) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedItems(filteredMatieres.map((m) => m.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleDeleteSelected = () => {
        Swal.fire({
            title: "Supprimer les éléments sélectionnés ?",
            text: "Cette action est irréversible !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler"
        }).then((result) => {
            if (result.isConfirmed) {
                Promise.all(selectedItems.map(id => axios.delete(`/api/matiere-premieres/${id}`)))
                    .then(() => {
                        fetchMatieres();
                        setSelectedItems([]);
                        setSelectAll(false);
                        Swal.fire("Supprimé !", "Les éléments ont été supprimés.", "success");
                    })
                    .catch((error) => {
                        Swal.fire("Erreur", "Certains éléments n'ont pas pu être supprimés.", "error");
                    });
            }
        });
    };

    const handleShowFormButtonClick = () => {
        if (formContainerStyle.right === "-100%") {
            setFormContainerStyle({ right: "0" });
            setTableContainerStyle({ width: "65%" });
        } else {
            closeForm();
        }
    };

    const exportToPDF = () => {
        const pdf = new jsPDF();
        const columns = ["Nom", "Prix d'achat", "Unité", "Fournisseur"];
        const rows = filteredMatieres.map(m => [
            m.nom,
            `${m.prix_achat} DH`,
            m.unite,
            m.fournisseur?.raison_sociale || m.fournisseur?.nom || 'N/A'
        ]);
        pdf.text("Liste des Matières Premières", 14, 15);
        pdf.autoTable({ head: [columns], body: rows, startY: 25 });
        pdf.save("matieres_premieres.pdf");
    };

    const printTable = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
      <html>
        <head><title>Imprimer</title></head>
        <body>
          <h1>Liste des Matières Premières</h1>
          <table border="1" style="width:100%; border-collapse:collapse;">
            <thead>
              <tr><th>Nom</th><th>Prix</th><th>Unité</th><th>Fournisseur</th></tr>
            </thead>
            <tbody>
              ${filteredMatieres.map(m => `
                <tr>
                  <td>${m.nom}</td>
                  <td>${m.prix_achat} DH</td>
                  <td>${m.unite}</td>
                  <td>${m.fournisseur?.raison_sociale || m.fournisseur?.nom || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.print(); setTimeout(() => window.close(), 500);</script>
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    const toggleDetail = (id) => {
        setOpenDetails(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ ...dynamicStyles }}>
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 6 }}>



                    <div style={{ position: 'relative', overflow: 'hidden', marginTop: '20px' }}>
                        <MatierePremiereForm
                            formData={formData}
                            setFormData={setFormData}
                            handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            handleSubmit={handleSubmit}
                            errors={errors}
                            fournisseurs={fournisseurs}
                            familles={familles}
                            types={types}
                            closeForm={closeForm}
                            formContainerStyle={formContainerStyle}
                            fetchFournisseurs={fetchFournisseurs}
                        />

                        <TableMui
                            columns={[
                                {
                                    id: 'select',
                                    label: (
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={handleSelectAllChange}
                                        />
                                    ),
                                    minWidth: 40,
                                    align: 'center',
                                    render: (row) => (
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(row.id)}
                                            onChange={() => handleCheckboxChange(row.id)}
                                        />
                                    ),
                                },
                                { id: 'nom', label: 'NOM', minWidth: 150 },
                                {
                                    id: 'prix_achat',
                                    label: 'PRIX D\'ACHAT',
                                    minWidth: 120,
                                    render: (row) => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {row.prix_achat} DH
                                            <FontAwesomeIcon
                                                icon={faList}
                                                style={{ cursor: 'pointer', color: '#00afaa' }}
                                                onClick={() => toggleDetail(row.id)}
                                                title="Voir l'historique"
                                            />
                                        </div>
                                    )
                                },
                                { id: 'unite', label: 'UNITÉ', minWidth: 100 },
                                {
                                    id: 'fournisseur',
                                    label: 'FOURNISSEUR',
                                    minWidth: 150,
                                    render: (row) => row.fournisseur?.nom || row.fournisseur?.raison_sociale || 'N/A'
                                }
                            ]}
                            rows={filteredMatieres.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
                            hasActions={true}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            handleChangePage={(event, newPage) => setPage(newPage)}
                            handleChangeRowsPerPage={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                            produitsFiltres={filteredMatieres}
                            handleShowFormButtonClick={handleShowFormButtonClick}
                            tableContainerStyle={{
                                ...tableContainerStyle,
                                transition: "width 0.3s ease"
                            }}
                            selectedItems={selectedItems}
                            handleDeleteSelected={handleDeleteSelected}
                            heightOffset={{ trueOffset: 188, falseOffset: 138 }}
                            AddButton={AddButton}
                            FilterToggleButton={FilterToggleButton}
                            showFilters={showFilters}
                            toggleFilters={toggleFilters}
                            FiltreInput={
                                <AnimatePresence>
                                    {showFilters && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.5 }}
                                            style={{
                                                display: 'flex',
                                                gap: '15px',
                                                padding: '15px',
                                                background: '#f8fafc',
                                                borderBottom: '1px solid #e2e8f0',
                                                flexWrap: 'wrap',
                                                justifyContent: 'flex-end'
                                            }}
                                        >
                                            <select
                                                className="form-select form-select-sm"
                                                style={{ width: '250px' }}
                                                value={fournisseurFilter}
                                                onChange={(e) => setFournisseurFilter(e.target.value)}
                                            >
                                                <option value="">Tous les fournisseurs</option>
                                                {fournisseurs.map(f => (
                                                    <option key={f.id} value={f.id}>{f.nom || f.raison_sociale}</option>
                                                ))}
                                            </select>

                                            <select
                                                className="form-select form-select-sm"
                                                style={{ width: '180px' }}
                                                value={uniteFilter}
                                                onChange={(e) => setUniteFilter(e.target.value)}
                                            >
                                                <option value="">Toutes les unités</option>
                                                <option value="kg">kg</option>
                                                <option value="L">L</option>
                                                <option value="unite">unite</option>
                                            </select>

                                            {(fournisseurFilter || uniteFilter) && (
                                                <button
                                                    className="btn btn-link btn-sm text-danger"
                                                    onClick={() => {
                                                        setFournisseurFilter("");
                                                        setUniteFilter("");
                                                    }}
                                                >
                                                    Réinitialiser
                                                </button>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            }
                            exportToPDF={exportToPDF}
                            printTable={printTable}
                            addButtonText="Ajouter"
                            openDetails={openDetails}
                            renderDetail={(row) => (
                                <div style={{ padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                                    <h6>Historique des prix pour {row.nom}</h6>
                                    <table className="table table-sm mb-0">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Prix</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {row.historiques?.map((h, i) => (
                                                <tr key={i}>
                                                    <td>{new Date(h.created_at).toLocaleDateString()}</td>
                                                    <td>{h.prix} DH</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        />
                    </div>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default MatierePremiereList;
