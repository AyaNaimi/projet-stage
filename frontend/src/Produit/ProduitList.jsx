import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import Swal from "sweetalert2";
import { Form, Button, Modal, DropdownButton, Col, Row } from "react-bootstrap";
import Navigation from "../Acceuil/Navigation";
import Search from "../Acceuil/Search";
import TablePagination from "@mui/material/TablePagination";
import ExportToPdfButton from "./exportToPdf";
import PrintList from "./PrintList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Carousel } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const toFullUrl = (path) => {
  if (!path) return "";
  const value = String(path).trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:image/")) return value;
  const clean = value.startsWith("/") ? value.slice(1) : value;
  return `${API_BASE}/${clean}`;
};

import {
  faTrash,
  faFilePdf,
  faFileExcel,
  faPrint,
  faEdit,
  faPlus,
  faFilter,
  faList,
  faClose,
  faUpload,
  faSearch,
  faDownload,
  faFileCsv,
} from "@fortawesome/free-solid-svg-icons";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Autocomplete, Fab, TextField, Toolbar } from "@mui/material";
import { BsShop } from "react-icons/bs";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import {
  deleteDataFromIndexedDB,
  getDataFromIndexedDB,
  storeDataInIndexedDB,
} from "../utils/indexedDBUtils";
import AddButton from "../components/AddButton";
import FilterToggleButton from "../components/FilterToggleButton";
import TableContainer from "../components/TableContainer";
import FamilleTypeCarousels from "../components/FamilleTypeCarousels";
import ProduitForm from "./ProduitForm";
import Header from "../components/Header";
import TableMui from "../components/TableMui";
import { resolveImageUrl } from "../utils/imageUtils";

const ProduitList = () => {
  const [produits, setProduits] = useState([]);
  const [user, setUser] = useState({});
  const [categories, setCategories] = useState([]);
  let isEdit = false;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProduitsByCategory, setFilteredProduitsByCategory] = useState(
    [],
  );
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sousCatFiltre, setSousCatFilter] = useState(null);
  const [selectedProductsDataRep, setSelectedProductsDataRep] = useState([]);
  const [expandedRowsRepresantant, setExpandedRowsRepresantant] = useState([]);

  const [editingProduit, setEditingProduit] = useState(null);
  const [editingProduitId, setEditingProduitId] = useState(null);
  const [userHasDeletePermission, setUserHasDeletePermission] = useState(true);
  const [formContainerStyle, setFormContainerStyle] = useState({
    right: "-100%",
  });
  const [tableContainerStyle, setTableContainerStyle] = useState({
    marginRight: "0%",
  });

  const { open } = useOpen();
  const { dynamicStyles } = useOpen();
  const { setTitle } = useHeader();
  const tableHeaderStyle = {
    background: "#007bff",
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  };

  const [showForm, setShowForm] = useState(false);
  const [calibres, setCalibres] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // ── Import CSV ──
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  // ── Recherche ──
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    Code_produit: "",
    designation: "",
    type_quantite: "",
    unite: "",
    seuil_alerte: "",
    stock_initial: "",
    etat_produit: "",
    calibre_id: "",
    user_id: "",
    categorie_id: "",
    prix_vente: "",
    marque: "Ovotec",
    logoP: "",
    reference: "",
    produit_Embalg_S_id: "",
    type_produit: "P",
    // Ajout des nouveaux champs
    unite_etiquette: "",
    unite_embalage_primaire: "",
    unite_embalage_secondaire: "",
    grammage: "",
    rendement: 100,
    temps_production: "",
    cout_horaire_mod: "",
    quantite_production_mensuelle: "",
    temps_machine: "",
    // Libellés texte libre emballage
    emballage_primaire_label: "",
    emballage_secondaire_label: "",
    etiquette_label: "",
  });
  const [errors, setErrors] = useState({
    Code_produit: "",
    designation: "",
    type_quantite: "",
    unite: "",
    seuil_alerte: "",
    stock_initial: "",
    etat_produit: "",
    calibre_id: "",
    user_id: "",
    categorie_id: "",
    // Ajout des nouveaux champs
    unite_etiquette: "",
    unite_embalage_primaire: "",
    unite_embalage_secondaire: "",
  });
  const fetchCalibres = async () => {
    try {
      const responseCalibre = await axiosInstance.get("/api/calibres");
      setCalibres(responseCalibre.data);
      localStorage.setItem("calibres", JSON.stringify(responseCalibre.data));
      console.log("calibres", responseCalibre);
    } catch (error) {
      console.error("Error fetching calibres:", error);
    }
  };
  const [categories2, setCategories2] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/categories");
      setCategories(response.data);
      console.log("fetsh data");
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory('tout');
      console.log('✓ Category initialized to "tout" (show all products)');
    }
  }, [categories]);
  const fetchProduits = async () => {
    try {
      const [response, usersResponse, responseCategories] = await Promise.all([
        axiosInstance.get("/api/produits"),
        axiosInstance.get("/api/user"),
        axiosInstance.get("/api/categories")
      ]);

      const produits = response.data.produit.map((p) => ({
        ...p,
        genre: p.genre || 'vente', // Ensure genre has default value
        logoP: p.logoP ? toFullUrl(p.logoP) : "",
      }));
      setProduits(produits);
      await storeDataInIndexedDB(produits, "produits");

      const authenticatedUserId = usersResponse.data.id;
      setUser(authenticatedUserId);

      setCategories(responseCategories.data);
      await storeDataInIndexedDB(responseCategories.data, "famille");
    } catch (error) {
      console.error("Error fetching products or user data:", error);
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Accès refusé",
          text: "Vous n'avez pas l'autorisation de voir la liste des produits.",
        });
      }
      // Re-throw so the caller (loadData) knows it failed and can fallback to IndexedDB
      throw error;
    }
  };

  useEffect(() => {
    setTitle("Gestion produits");
  }, [setTitle]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingProducts(true);
      try {
        // Step 1: Try to fetch fresh data from API FIRST
        await fetchProduits();
        await fetchCalibres();
      } catch (error) {
        console.error("API fetch failed, falling back to IndexedDB:", error);
        // Step 2: Fallback to IndexedDB cache only if API fails
        try {
          const storedProduits = await getDataFromIndexedDB("produits");
          const storedCategories = await getDataFromIndexedDB("famille");

          if (storedProduits) {
            const normalized = storedProduits.map((p) => ({
              ...p,
              logoP: p.logoP ? toFullUrl(p.logoP) : "",
            }));
            setProduits(normalized);
          }
          if (storedCategories) setCategories(storedCategories);
        } catch (indexedDbError) {
          console.error("IndexedDB fallback also failed:", indexedDbError);
        }
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadData();
  }, []);
  useEffect(() => {
    if (produits) {
      const filtered = produits.filter((produit) => {
        return Object.entries(produit).some(([key, value]) => {
          if (
            [
              "Code_produit",
              "designation",
              "type_quantite",
              "unite",
              "seuil_alerte",
              "stock_initial",
              "etat_produit",
              "prix_vente",
            ].includes(key)
          ) {
            if (typeof value === "string") {
              return value.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (typeof value === "number") {
              return value.toString().includes(searchTerm.toString());
            }
          }

          if (key === "calibre" && produit.calibre && produit.calibre.calibre) {
            return produit.calibre.calibre
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }

          if (
            key === "categorie" &&
            produit.categorie &&
            produit.categorie.categorie
          ) {
            return produit.categorie.categorie
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }

          return false;
        });
      });
      setFilteredProduits(filtered);
    }
  }, [produits, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const savedRowsPerPage = localStorage.getItem("rowsPerPage");
    if (savedRowsPerPage) {
      setRowsPerPage(parseInt(savedRowsPerPage, 10));
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const filterProductsByCategory = (categoryId, sousCatFiltre) => {
      if (categoryId) {
        if (categoryId === "tout") {
          if (sousCatFiltre && sousCatFiltre !== "tout") {
            const filteredSuCat = filteredProduits.filter(
              (produit) => produit.suCat_id === parseInt(sousCatFiltre),
            );
            setFilteredProduitsByCategory(
              filteredSuCat.length === 0 ? [] : filteredSuCat,
            );
            setPage(1);
            return;
          }
          setFilteredProduitsByCategory(filteredProduits);
          setPage(1);
          return;
        }

        let filtered = filteredProduits.filter(
          (produit) => produit.categorie_id === parseInt(categoryId),
        );

        if (sousCatFiltre) {
          if (sousCatFiltre === "tout") {
            setFilteredProduitsByCategory(filtered);
            return;
          }

          const filteredSuCat = filtered.filter(
            (produit) => produit.suCat_id === parseInt(sousCatFiltre),
          );

          if (filteredSuCat.length === 0) {
            setFilteredProduitsByCategory([]);
          } else {
            setFilteredProduitsByCategory(filteredSuCat);
          }
        } else {
          if (filtered.length === 0) {
            setFilteredProduitsByCategory([]);
          } else {
            setFilteredProduitsByCategory(filtered);
          }
        }
        setPage(1);
      } else {
        setFilteredProduitsByCategory(filteredProduits);
      }
    };

    filterProductsByCategory(selectedCategory, sousCatFiltre);
  }, [selectedCategory, filteredProduits, sousCatFiltre]);

  const handleCategoryFilterChange = (catId) => {
    setSelectedCategory(catId);
  };
  const handleSousCategoryFilterChange = (catId) => {
    setSousCatFilter(catId);
  };
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleChangeRowsPerPage = (event) => {
    const selectedRows = parseInt(event.target.value, 10);
    setRowsPerPage(selectedRows);
    localStorage.setItem("rowsPerPage", selectedRows);
    setPage(1);
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
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(produits.map((produit) => produit.id));
    }
  };

  const handleDeleteSelected = () => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Oui",
      denyButtonText: "Non",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deletePromises = selectedItems.map((id) =>
          axiosInstance
            .delete(`/api/produits/${id}`)
            .then(() => deleteDataFromIndexedDB("produits", id))
            .catch((err) => ({
              error: true,
              id,
              msg: err.response?.data?.error,
            })),
        );
        const results = await Promise.all(deletePromises);
        const failed = results.filter((r) => r?.error);
        fetchProduits();
        setSelectedItems([]);
        if (failed.length > 0) {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: `${failed.length} produit(s) non supprimé(s).`,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Succès!",
            text: "Produits supprimés avec succès.",
          });
        }
      }
    });
  };

  // ── Import CSV ────────────────────────────────────────────────────────────────

  const handleImportCSV = async () => {
    if (!importFile) {
      Swal.fire("Attention", "Veuillez sélectionner un fichier CSV.", "warning");
      return;
    }

    setImportLoading(true);
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("file", importFile);

      const res = await axiosInstance.post("/api/produits/import-csv", formDataPayload);

      const data = res.data;
      let message = `Import terminé : ${data.imported} produit(s) ajouté(s), ${data.updated} mis à jour.`;
      if (data.skipped > 0) {
        message += `\n${data.skipped} ligne(s) ignorée(s).`;
      }

      Swal.fire({
        icon: "success",
        title: "Import CSV",
        html: message.replace(/\n/g, "<br>"),
        confirmButtonColor: "#00afaa",
      });

      setShowImportModal(false);
      setImportFile(null);
      fetchProduits();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Erreur lors de l'import.";
      Swal.fire("Erreur", msg, "error");
    } finally {
      setImportLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "Code_produit", "designation", "categorie", "prix_vente",
      "type_quantite", "unite", "seuil_alerte", "stock_initial",
      "grammage", "temps_production", "cout_horaire_mod",
      "quantite_production_mensuelle", "temps_machine",
      "emballage_primaire_label", "emballage_secondaire_label", "etiquette_label",
    ];
    const csvContent = headers.join(",") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "template_import_produits.csv";
    link.click();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce produit ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Oui",
      denyButtonText: "Non",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`/api/produits/${id}`)
          .then(() => {
            fetchProduits();
            deleteDataFromIndexedDB("produits", id);

            Swal.fire({
              icon: "success",
              title: "Succès!",
              text: "Produit supprimé avec succès.",
            });
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
            if (error.response && error.response.status === 403) {
              Swal.fire({
                icon: "error",
                title: "Accès refusé",
                text: "Vous n'avez pas l'autorisation de supprimer ce produit.",
              });
            } else if (error.response && error.response.status === 400) {
              Swal.fire({
                icon: "error",
                title: "Erreur",
                text: error.response.data.error,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Erreur!",
                text: "Échec de la suppression du produit.",
              });
            }
          });
      } else {
        console.log("Suppression annulée");
      }
    });
  };

  const handleShowFormButtonClick = () => {
    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "48%" });
    } else {
      closeForm();
    }
  };

  const closeForm = () => {
    setFormContainerStyle({ right: "-100%" });
    setTableContainerStyle({ marginRight: "0" });
    setShowForm(false);
    setFormData({
      Code_produit: "",
      designation: "",
      type_quantite: "",
      unite: "",
      seuil_alerte: "",
      stock_initial: "",
      etat_produit: "",
      calibre_id: "",
      user_id: "",
      categorie_id: "",
      prix_vente: "",
      marque: "Ovotec",
      logoP: "",
      suCat_id: "",
      reference: "",
      produit_Embalg_S_id: "",
      type_produit: "P",
      unite_etiquette: "",
      unite_embalage_primaire: "",
      unite_embalage_secondaire: "",
      grammage: "",
      rendement: 100,
      temps_production: "",
      cout_horaire_mod: "",
      quantite_production_mensuelle: "",
      temps_machine: "",
      produit_Etiq_id: "",
      produit_Embalg_id: "",
      genre: "",
      Dvie: "",
      tva: "",
      emballage_primaire_label: "",
      emballage_secondaire_label: "",
      etiquette_label: "",
    });
    setErrors({
      Code_produit: "",
      designation: "",
      type_quantite: "",
      unite: "",
      seuil_alerte: "",
      stock_initial: "",
      etat_produit: "",
      calibre_id: "",
      user_id: "",
      categorie_id: "",
      unite_etiquette: "",
      unite_embalage_primaire: "",
      unite_embalage_secondaire: "",
    });
    setSelectedProductsDataRep([]);
    setEditingProduit(null);
  };

  const handleEdit = (produit) => {
    setEditingProduit(produit);
    setFormData({
      Code_produit: produit.Code_produit,
      designation: produit.designation,
      type_quantite: produit.type_quantite,
      unite: produit.unite,
      seuil_alerte: produit.seuil_alerte,
      stock_initial: produit.stock_initial,
      etat_produit: produit.etat_produit,
      calibre_id: produit.calibre_id,
      categorie_id: produit.categorie_id,
      marque: produit.marque,
      prix_vente: produit.prix_vente,
      suCat_id: produit.suCat_id,
      genre: produit.genre,
      Dvie: produit.Dvie,
      produit_Etiq_id: produit.produit_Etiq_id ? Number(produit.produit_Etiq_id) : "",
      produit_Embalg_id: produit.produit_Embalg_id ? Number(produit.produit_Embalg_id) : "",
      produit_Embalg_S_id: produit.produit_Embalg_S_id ? Number(produit.produit_Embalg_S_id) : "",

      type_produit: produit.type,
      reference: produit.reference,
      logoP: produit.logoP || "",

      // Remplir les nouveaux champs
      unite_etiquette: produit.unite_etiquette || "",
      unite_embalage_primaire: produit.unite_embalage_primaire || "",
      unite_embalage_secondaire: produit.unite_embalage_secondaire || "",
      grammage: produit.grammage || "",
      rendement: produit.rendement || 100,
      temps_production: produit.temps_production || "",
      cout_horaire_mod: produit.cout_horaire_mod || "",
      quantite_production_mensuelle: produit.quantite_production_mensuelle || "",
      temps_machine: produit.temps_machine || "",
      emballage_primaire_label: produit.emballage_primaire_label || "",
      emballage_secondaire_label: produit.emballage_secondaire_label || "",
      etiquette_label: produit.etiquette_label || "",
    });
    setSelectedProductsDataRep(
      produit?.prix_produits?.map((prix) => ({
        id: prix.id,
        date_debut: prix.dateDebut,
        date_fin: prix.dateFin,
        type: prix.typeQte,
        unite: prix.Unite,
        prixProduit: prix.prixProduit,
      })),
    );
    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "48%" });
    }
  };
  useEffect(() => {
    if (editingProduitId !== null) {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "48%" });
    }
  }, [editingProduitId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.type === "file" ? e.target.files[0] : value,
    });
  };

  const validateForm = (data) => {
    const errors = {};

    // ── Champs obligatoires ───────────────────────────────────────────────
    if (!data.Code_produit?.trim()) {
      errors.Code_produit = "Le code produit est requis.";
    } else if (!/^[A-Za-z0-9\-_.]+$/.test(data.Code_produit.trim())) {
      errors.Code_produit = "Le code ne doit contenir que lettres, chiffres, tirets ou points.";
    } else if (data.Code_produit.trim().length < 2) {
      errors.Code_produit = "Le code doit contenir au moins 2 caractères.";
    }

    if (!data.designation?.trim()) {
      errors.designation = "La désignation est requise.";
    } else if (data.designation.trim().length < 2) {
      errors.designation = "La désignation doit contenir au moins 2 caractères.";
    }

    if (!data.type_quantite) {
      errors.type_quantite = "Le type de quantité est requis.";
    }

    if (!data.categorie_id) {
      errors.categorie_id = "La catégorie est requise.";
    }

    // ── Validation numérique — type & signe ───────────────────────────────
    const numericField = (name, label, opts = {}) => {
      const val = data[name];
      if (val === "" || val === null || val === undefined) return;
      const num = Number(val);
      if (isNaN(num)) {
        errors[name] = `${label} doit être un nombre.`;
        return;
      }
      if (opts.min !== undefined && num < opts.min) {
        errors[name] = `${label} doit être supérieur ou égal à ${opts.min}.`;
      }
      if (opts.max !== undefined && num > opts.max) {
        errors[name] = `${label} doit être inférieur ou égal à ${opts.max}.`;
      }
      if (opts.positive && num <= 0) {
        errors[name] = `${label} doit être positif.`;
      }
    };

    numericField("prix_vente", "Le prix de vente", { min: 0, max: 999999 });
    numericField("seuil_alerte", "Le seuil d'alerte", { min: 0, max: 999999 });
    numericField("stock_initial", "Le stock initial", { min: 0, max: 999999 });
    numericField("grammage", "Le grammage", { min: 0, max: 99999 });
    numericField("rendement", "Le rendement", { min: 0, max: 100 });
    numericField("temps_production", "Le temps de production", { min: 0, max: 1440 });
    numericField("cout_horaire_mod", "Le coût horaire MOD", { min: 0, max: 99999 });
    numericField("quantite_production_mensuelle", "La quantité mensuelle", { min: 0, max: 99999999 });
    numericField("temps_machine", "Le temps machine", { min: 0, max: 1440 });

    return errors;
  };

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({});
      }, 3000);
      return;
    }

    Swal.fire({
      title: "Traitement en cours...",
      text: "Veuillez patienter pendant le traitement de votre demande",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const url = editingProduit
      ? `/api/produits/${editingProduit.id}`
      : `/api/produits`;
    const method = "post";

    const requestData = new FormData();

    const appendCommonProductFields = (payload) => {
      payload.append("Code_produit", formData.Code_produit || "");
      payload.append("designation", formData.designation || "");
      payload.append("calibre_id", formData.calibre_id || "");
      payload.append("type_quantite", formData.type_quantite || "");
      payload.append("unite", formData.unite || "");
      payload.append("seuil_alerte", formData.seuil_alerte || "");
      payload.append("stock_initial", formData.stock_initial || "");
      payload.append("etat_produit", formData.etat_produit || "");
      payload.append("marque", formData.marque || "");
      payload.append("prix_vente", formData.prix_vente || "");
      payload.append("categorie_id", formData.categorie_id || "");
      payload.append("suCat_id", formData.suCat_id || "");
      payload.append(
        "genre",
        formData.genre === undefined || formData.genre === "undefined"
          ? ""
          : formData.genre,
      );
      payload.append(
        "type",
        formData.type_produit === undefined || formData.type_produit === "undefined"
          ? ""
          : formData.type_produit,
      );
      payload.append(
        "Dvie",
        formData.Dvie === undefined || formData.Dvie === "undefined"
          ? ""
          : formData.Dvie,
      );
      payload.append("reference", formData.reference || "");
      payload.append("tva", formData.tva || "");
      // Packaging : champs texte libre (string)
      payload.append("emballage_primaire_label", formData.emballage_primaire_label || "");
      payload.append("emballage_secondaire_label", formData.emballage_secondaire_label || "");
      payload.append("etiquette_label", formData.etiquette_label || "");
      payload.append("produit_Etiq_id", formData.produit_Etiq_id || "");
      payload.append("produit_Embalg_id", formData.produit_Embalg_id || "");
      payload.append("produit_Embalg_S_id", formData.produit_Embalg_S_id || "");
      payload.append("unite_etiquette", formData.unite_etiquette || "");
      payload.append("unite_embalage_primaire", formData.unite_embalage_primaire || "");
      payload.append("unite_embalage_secondaire", formData.unite_embalage_secondaire || "");
      payload.append("grammage", formData.grammage || "");
      payload.append("rendement", formData.rendement || 100);
      payload.append("temps_production", formData.temps_production || "");
      payload.append("cout_horaire_mod", formData.cout_horaire_mod || "");
      payload.append("quantite_production_mensuelle", formData.quantite_production_mensuelle || "");
      payload.append("temps_machine", formData.temps_machine || "");

      const logoValue = formData.logoP;
      if (logoValue instanceof File) {
        payload.append("logoP", logoValue);
      }

      if (selectedProductsDataRep && Array.isArray(selectedProductsDataRep)) {
        selectedProductsDataRep.forEach((prix, index) => {
          payload.append(`prixProduits[${index}][dateDebut]`, prix.date_debut || "");
          payload.append(`prixProduits[${index}][dateFin]`, prix.date_fin || "");
          payload.append(`prixProduits[${index}][prixProduit]`, prix.prixProduit || "");
          payload.append(
            `prixProduits[${index}][typeQte]`,
            formData.type_quantite === "kg"
              ? "K"
              : formData.type_quantite === "litre"
                ? "L"
                : formData.type_quantite === "unite"
                  ? "U"
                  : prix.type || "",
          );
          payload.append(`prixProduits[${index}][Unite]`, prix.unite || "");
        });
      }
    };

    appendCommonProductFields(requestData);

    if (editingProduit) {
      requestData.append("_method", "PUT");
    }

    try {
      const response = await axiosInstance({
        method: method,
        url: url,
        data: requestData,
      });

      fetchProduits();
      Swal.close();

      const successMessage = `Produit ${editingProduit ? "modifié" : "ajouté"} avec succès.`;
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: successMessage,
      });

      setFormData({
        Code_produit: "",
        designation: "",
        type_quantite: "",
        unite: "",
        seuil_alerte: "",
        stock_initial: "",
        etat_produit: "",
        calibre_id: "",
        user_id: "",
        categorie_id: "",
        prix_vente: "",
        marque: "Ovotec",
        logoP: "",
        suCat_id: "",
        reference: "",
        produit_Embalg_S_id: "",
        unite_etiquette: "",
        unite_embalage_primaire: "",
        unite_embalage_secondaire: "",
        grammage: "",
        rendement: 100,
        temps_production: "",
        cout_horaire_mod: "",
        quantite_production_mensuelle: "",
        temps_machine: "",
        type_produit: "",
        produit_Etiq_id: "",
        produit_Embalg_id: "",
        genre: "",
        Dvie: "",
        tva: "",
        emballage_primaire_label: "",
        emballage_secondaire_label: "",
        etiquette_label: "",
      });
      setErrors({
        Code_produit: "",
        designation: "",
        calibre_id: "",
        type_quantite: "",
        unite: "",
        seuil_alerte: "",
        stock_initial: "",
        etat_produit: "",
        marque: "",
        categorie_id: "",
      });
      setEditingProduit(null);
      closeForm();
    } catch (error) {
      Swal.close();

      if (error.response) {
        const serverErrors = error.response.data?.error;
        const errorMessage =
          typeof serverErrors === "string"
            ? serverErrors
            : error.response.data?.message ||
            "Une erreur est survenue lors de l'enregistrement.";

        if (typeof serverErrors === "object" && serverErrors !== null) {
          setErrors({
            logoP: serverErrors.logoP ? serverErrors.logoP[0] : "",
            Code_produit: serverErrors.Code_produit
              ? serverErrors.Code_produit[0]
              : "",
            designation: serverErrors.designation
              ? serverErrors.designation[0]
              : "",
            calibre_id: serverErrors.calibre_id
              ? serverErrors.calibre_id[0]
              : "",
            type_quantite: serverErrors.type_quantite
              ? serverErrors.type_quantite[0]
              : "",
            unite: serverErrors.unite ? serverErrors.unite[0] : "",
            seuil_alerte: serverErrors.seuil_alerte
              ? serverErrors.seuil_alerte[0]
              : "",
            stock_initial: serverErrors.stock_initial
              ? serverErrors.stock_initial[0]
              : "",
            etat_produit: serverErrors.etat_produit
              ? serverErrors.etat_produit[0]
              : "",
            marque: serverErrors.marque ? serverErrors.marque[0] : "",
            categorie_id: serverErrors.categorie_id
              ? serverErrors.categorie_id[0]
              : "",
          });
          Swal.fire({
            icon: "error",
            title: "Erreur de validation",
            text: errorMessage || "Veuillez vérifier les champs du formulaire.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: errorMessage,
          });
        }
      } else {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Erreur Réseau",
          text: "Impossible de contacter le serveur.",
        });
      }
    }
  };

  const translateTypeQte = (type) => {
    switch (type) {
      case "L":
        return "Litre";
      case "K":
        return "KG";
      case "K/U":
        return "KG/Unité";
      case "U":
        return "Unité";
      default:
        return type;
    }
  };

  //------------------------- fournisseur export to excel ---------------------//

  const [cat, setCat] = useState([]);
  const handleDeletecatgeorie = async (categorieId) => {
    try {
      await axiosInstance.delete(`/api/categories/${categorieId}`);

      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: " supprimée avec succès.",
      });
      const latestCategories = (await axiosInstance.get("/api/categories"))
        .data;
      setCategories(latestCategories);
      await storeDataInIndexedDB(latestCategories, "famille");
    } catch (error) {
      console.error("Error deleting calibre:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur!",
        text: "Échec de la suppression du calibre.",
      });
    }
  };

  const handleDeleteCalibre = async (calibreId) => {
    try {
      await axiosInstance.delete(`/api/calibres/${calibreId}`);

      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Calibre supprimé avec succès.",
      });
      await fetchCalibres();
    } catch (error) {
      console.error("Error deleting calibre:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur!",
        text: "Échec de la suppression du calibre.",
      });
    }
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditClibreModal, setShowEditClibreModal] = useState(false);

  const [showEditSousModal, setShowEditSousModal] = useState(false);

  const [showSuModal, setShowSuModal] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [categorieId, setCategorie] = useState();
  const [image, setImage] = useState(null);

  const handleEditCategorie = (categorieId) => {
    setSelectedCategoryId(categorieId);
    setCategorie(categorieId.categorie);
    setShowEditModal(true);
  };
  const handleEditClibre = (categorieId) => {
    setSelectedCategoryId(categorieId);
    setCategorie(categorieId.categorie);
    setShowEditClibreModal(true);
  };
  const handleEditSousCategorie = (categorieId) => {
    setSelectedCategoryId(categorieId);
    setNewCategory({
      sous_categorie: categorieId.categorie || '',
      description: categorieId.description || '',
      idCatMer: categorieId.idCatMer || '',
      imageFile: null,
    });
    setShowEditSousModal(true);
  };

  const handleSaveSousCategorie = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    Swal.fire({
      title: "Traitement en cours...",
      text: "Veuillez patienter...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const formData = new FormData();
      formData.append("_method", "put");
      formData.append("categorie", newCategory.sous_categorie || "");
      formData.append("description", newCategory.description || "");
      formData.append("idCatMer", newCategory.idCatMer || "");
      if (newCategory.imageFile instanceof File) {
        formData.append("logoP", newCategory.imageFile);
      }

      await axiosInstance.post(
        `/api/categories/${selectedCategoryId.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );

      await fetchCategories();
      const latestCategories = (await axiosInstance.get("/api/categories"))
        .data;
      await storeDataInIndexedDB(latestCategories, "famille");

      setShowEditSousModal(false);
      setNewCategory({ sous_categorie: "", description: "", idCatMer: "", imageFile: null });

      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Sous-catégorie modifiée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la modification de la sous-catégorie :", error);
      let errorMsg = "Échec de la modification de la sous-catégorie.";

      if (error.response?.data?.error) {
        if (typeof error.response.data.error === "object") {
          errorMsg = Object.values(error.response.data.error).flat().join(", ");
        } else {
          errorMsg = error.response.data.error;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "Erreur!",
        text: errorMsg,
      });
    }
  };
  const [idSucategorie, setIdSucategorie] = useState(null);
  const handleSuCategorie = (categorieId) => {
    setIdSucategorie(categorieId);
    setShowSuModal(true);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSave = async () => {
    Swal.fire({
      title: "Traitement en cours...",
      text: "Veuillez patienter...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const formData = new FormData();
      formData.append("_method", "put");
      formData.append("categorie", selectedCategoryId.categorie);
      if (newCategory.imageFile) {
        formData.append("logoP", newCategory.imageFile);
      }

      await axiosInstance.post(
        `/api/categories/${selectedCategoryId.id}`,
        formData,
      );

      await fetchCategories();
      const latestCategories = (await axiosInstance.get("/api/categories"))
        .data;
      await storeDataInIndexedDB(latestCategories, "famille");

      setShowEditModal(false);
      setShowEditSousModal(false);
      setNewCategory({ categorie: "", imageFile: null });

      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Catégorie modifiée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la modification de la catégorie :", error);
      let errorMsg = "Échec de la modification de la catégorie.";

      if (error.response?.data?.error) {
        if (typeof error.response.data.error === "object") {
          errorMsg = Object.values(error.response.data.error).flat().join(", ");
        } else {
          errorMsg = error.response.data.error;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "Erreur!",
        text: errorMsg,
      });
    }
  };
  const handleSaveClibre = async () => {
    try {
      await axiosInstance.put(`/api/calibres/${selectedCategoryId.id}`, {
        calibre: selectedCategoryId.calibre,
      });
      await fetchCalibres();
      setShowEditClibreModal(false);
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: " modifiée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la modification de la catégorie :", error);
    }
  };

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddCalibre, setShowAddCalibre] = useState(false);

  const [newCategory, setNewCategory] = useState({
    categorie: "",
    imageFile: null,
  });

  const handleAddCategory = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (!newCategory.categorie || !newCategory.categorie.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Attention!",
        text: "Veuillez saisir un nom de famille.",
      });
      return;
    }
    if (!newCategory.imageFile) {
      Swal.fire({
        icon: "warning",
        title: "Attention!",
        text: "Veuillez sélectionner une image.",
      });
      return;
    }

    Swal.fire({
      title: "Traitement en cours...",
      text: "Veuillez patienter...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const formData = new FormData();
      formData.append("categorie", newCategory.categorie.trim());
      formData.append(
        "logoP",
        newCategory.imageFile,
        newCategory.imageFile.name,
      );

      const response = await axiosInstance.post("/api/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchCategories();
      const latestCategories = (await axiosInstance.get("/api/categories"))
        .data;
      await storeDataInIndexedDB(latestCategories, "famille");

      setShowAddCategory(false);
      setNewCategory({ categorie: "", imageFile: null });

      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Famille ajoutée avec succès.",
      });
    } catch (error) {
      console.error("Error adding category:", error);
      let errorMsg = "Échec de l'ajout de la famille.";
      if (error.response?.data?.error) {
        errorMsg =
          typeof error.response.data.error === "object"
            ? Object.values(error.response.data.error).flat().join(", ")
            : error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }
      Swal.fire({ icon: "error", title: "Erreur!", text: errorMsg });
    }
  };
  const handleAddSousCategory = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    Swal.fire({
      title: "Traitement en cours...",
      text: "Veuillez patienter...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const formData = new FormData();
      formData.append("categorie", newCategory.sous_categorie || "");
      formData.append("idCatMer", idSucategorie);

      if (newCategory.imageFile instanceof File) {
        formData.append("logoP", newCategory.imageFile);
      }

      const response = await axiosInstance.post("/api/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchCategories();
      const latestCategories = (await axiosInstance.get("/api/categories"))
        .data;
      await storeDataInIndexedDB(latestCategories, "famille");

      setShowSuModal(false);
      setNewCategory({ categorie: "", sous_categorie: "", imageFile: null });
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Sous-catégorie ajoutée avec succès.",
      });
    } catch (error) {
      console.error("Error adding sub-category:", error);
      let errorMsg =
        "Échec de l'ajout de la sous-catégorie. Vérifiez que vous avez bien sélectionné une image.";

      if (error.response?.data?.error) {
        if (typeof error.response.data.error === "object") {
          errorMsg = Object.values(error.response.data.error).flat().join(", ");
        } else {
          errorMsg = error.response.data.error;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "Erreur!",
        text: errorMsg,
      });
    }
  };

  const handleAddClibre = async () => {
    try {
      const formData = new FormData();
      formData.append("calibre", newCategory.categorie);

      const response = await axiosInstance.post("/api/calibres", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchCalibres();
      setShowAddCalibre(false);
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "ajoutée avec succès.",
      });
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };
  const chunkArraySucat = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };
  const chunkSize = 6;
  const chunks = chunkArray(
    categories.filter((cat) => cat.idCatMer === null),
    chunkSize,
  );
  const chunksSucat = chunkArray(
    selectedCategory === "tout"
      ? categories.filter((cat) => cat.idCatMer !== null)
      : categories.filter(
        (cat) => cat.idCatMer !== null && cat.idCatMer === selectedCategory,
      ),
    chunkSize,
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndexSuCat, setActiveIndexSuCat] = useState(0);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };
  const handleSelectSousCat = (selectedIndex) => {
    setActiveIndexSuCat(selectedIndex);
  };

  const exportToPDF = async () => {
    Swal.fire({
      title: "Génération du PDF...",
      text: "Veuillez patienter",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const doc = new jsPDF('landscape');

      const tableColumn = [
        "Logo",
        "Code",
        "Désignation",
        "Type",
        "Marque",
        "Unité",
        "Seuil",
        "Stock",
        "État",
        "Calibre",
        "Prix",
        "Catégorie",
        "Sous Catégorie",
      ];

      const tableRows = [];

      const getBase64ImageFromUrl = (url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.setAttribute('crossOrigin', 'anonymous');
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            try {
              const dataURL = canvas.toDataURL("image/png");
              resolve(dataURL);
            } catch (e) {
              console.error("Erreur lors de la conversion de l'image en Base64", e);
              resolve(null);
            }
          };
          img.onerror = (e) => {
            console.error("Impossible de charger l'image pour le PDF :", url, e);
            resolve(null);
          };
          img.src = url;
        });
      };

      const logos = {};
      for (const produit of filteredProduitsByCategory) {
        if (produit.logoP && !logos[produit.logoP]) {
          logos[produit.logoP] = await getBase64ImageFromUrl(produit.logoP);
        }
        tableRows.push([
          "",
          produit.Code_produit || "",
          produit.designation || "",
          produit.type_quantite || "",
          produit.marque || "",
          produit.unite || "",
          produit.seuil_alerte || "",
          produit.stock_initial || "",
          produit.etat_produit || "",
          produit.calibre?.calibre || "",
          produit.prix_vente || "",
          produit.categorie?.categorie || "",
          produit.souscategorie?.categorie || "",
        ]);
      }

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          valign: 'middle',
        },
        columnStyles: {
          0: { cellWidth: 20, minCellHeight: 20 },
        },
        didDrawCell: function (data) {
          if (data.section === 'body' && data.column.index === 0) {
            const produit = filteredProduitsByCategory[data.row.index];
            if (produit && produit.logoP) {
              const base64Data = logos[produit.logoP];
              if (base64Data) {
                try {
                  doc.addImage(base64Data, 'PNG', data.cell.x + 2, data.cell.y + 2, 16, 16);
                } catch (e) {
                  console.error("Erreur lors de l'ajout de l'image au PDF", e);
                }
              }
            }
          }
        }
      });

      doc.save("table_produits.pdf");
      Swal.close();
    } catch (error) {
      console.error(error);
      Swal.fire("Erreur", "Une erreur est survenue lors de la génération du PDF", "error");
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredProduitsByCategory.map((produit) => ({
        Logo: produit.logoP || "",
        Code: produit.Code_produit,
        Désignation: produit.designation,
        "Type de Quantité": produit.type_quantite,
        Marque: produit.marque,
        Unité: produit.unite,
        "Seuil d'alerte": produit.seuil_alerte,
        "Stock initial": produit.stock_initial,
        "État de produit": produit.etat_produit,
        Calibre: produit.calibre?.calibre || "",
        "Prix vente": produit.prix_vente,
        Catégorie: produit.categorie?.categorie,
        "Sous Catégorie": produit.souscategorie?.categorie,
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produits");
    XLSX.writeFile(wb, "table_produits.xlsx");
  };
  const printTable = () => {
    const tableHTML = `
    <html>
      <head>
        <title>Table Print</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #ddd;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Code</th>
              <th>Désignation</th>
              <th>Type de Quantité</th>
              <th>Marque</th>
              <th>Unité</th>
              <th>Seuil d'alerte</th>
              <th>Stock initial</th>
              <th>État de produit</th>
              <th>Calibre</th>
              <th>Prix vente</th>
              <th>Catégorie</th>
              <th>Sous Catégorie</th>
            </tr>
          </thead>
          <tbody>
            ${filteredProduitsByCategory
        .map(
          (produit) => `
              <tr>
                <td>${produit.logoP ? `<img src="${produit.logoP}" alt="Logo" style="width:50px;height:50px;border-radius:50%"/>` : ""}</td>
                <td>${produit.Code_produit}</td>
                <td>${produit.designation}</td>
                <td>${produit.type_quantite}</td>
                <td>${produit.marque || ""}</td>
                <td>${produit.unite || ""}</td>
                <td>${produit.seuil_alerte || ""}</td>
                <td>${produit.stock_initial || ""}</td>
                <td>${produit.etat_produit || ""}</td>
                <td>${produit.calibre ? produit.calibre.calibre : ""}</td>
                <td>${produit.prix_vente || ""}</td>
                <td>${produit.categorie.categorie || ""}</td>
                <td>${produit.souscategorie?.categorie || ""}</td>
               
              </tr>
            `,
        )
        .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const [genreFiltre, setGenreFiltre] = useState("");

  const produitsFiltres = filteredProduitsByCategory.filter((produit) =>
    genreFiltre ? produit.genre === genreFiltre : true,
  );

  // Debug: Log data flow count
  React.useEffect(() => {
    console.log('📊 Data Pipeline:', {
      totalFetched: produits.length,
      afterSearch: filteredProduits.length,
      afterCategory: filteredProduitsByCategory.length,
      afterGenre: produitsFiltres.length,
      selectedCategory: selectedCategory,
      genreFiltre: genreFiltre,
      rowsOnPage: produitsFiltres.slice((page - 1) * rowsPerPage, page * rowsPerPage).length,
    });
  }, [produits, filteredProduits, filteredProduitsByCategory, produitsFiltres, selectedCategory, genreFiltre, page, rowsPerPage]);

  const handleAddEmptyRowRep = () => {
    setSelectedProductsDataRep([...selectedProductsDataRep, {}]);
  };
  const handleInputChangeRep = (index, field, value) => {
    const updatedProducts = [...selectedProductsDataRep];
    updatedProducts[index][field] = value;
    let newErrors = { ...errors };
    if (field === "agent_id" && value === "") {
      newErrors.representant = "Le représentant est obligatoire.";
    } else {
      newErrors.representant = "";
    }

    setErrors(newErrors);
    setSelectedProductsDataRep(updatedProducts);
  };
  const handleDeleteProductRap = async (index, id) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce Représentant ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Oui",
      denyButtonText: "Non",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    });

    if (result.isConfirmed) {
      const updatedSelectedProductsData = [...selectedProductsDataRep];
      updatedSelectedProductsData.splice(index, 1);
      setSelectedProductsDataRep(updatedSelectedProductsData);

      if (id) {
        axiosInstance.delete(`/api/prixProduit/${id}`).then(() => {
          fetchProduits();
        });
      }
    } else if (result.isDenied) {
      Swal.fire("Suppression annulée", "", "info");
    }
  };

  const toggleRowRepresantant = (id) => {
    setExpandedRowsRepresantant((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };
  const [columnVisibility, setColumnVisibility] = useState({
    logo: true,
    code: true,
    designation: true,
    typeQuantite: true,
    marque: true,
    unite: true,
    seuilAlerte: true,
    stockInitial: true,
    etatProduit: true,
    calibre: true,
    prixVente: true,
    famille: true,
    type: true,
    action: true,
  });

  const allColumns = [
    { key: "logo", label: "Logo" },
    { key: "code", label: "Code" },
    { key: "designation", label: "Désignation" },
    { key: "typeQuantite", label: "Type de Quantité" },
    { key: "marque", label: "Marque" },
    { key: "unite", label: "Unité" },
    { key: "seuilAlerte", label: "Seuil d'alerte" },
    { key: "stockInitial", label: "Stock initial" },
    { key: "etatProduit", label: "État de produit" },
    { key: "calibre", label: "Calibre" },
    { key: "prixVente", label: "Prix vente" },
    { key: "famille", label: "Famille" },
    { key: "type", label: "Type" },
  ];

  const toggleColumnVisibility = (column) => {
    setColumnVisibility((prevState) => {
      const newVisibility = { ...prevState, [column]: !prevState[column] };
      localStorage.setItem(
        "columnVisibilityProduit",
        JSON.stringify(newVisibility),
      );
      return newVisibility;
    });
  };

  useEffect(() => {
    const savedVisibility = JSON.parse(
      localStorage.getItem("columnVisibilityProduit"),
    );
    if (savedVisibility) {
      setColumnVisibility(savedVisibility);
    } else {
      setColumnVisibility({
        logo: true,
        code: true,
        designation: true,
        typeQuantite: true,
        marque: true,
        unite: true,
        seuilAlerte: true,
        stockInitial: true,
        etatProduit: true,
        calibre: true,
        prixVente: true,
        famille: true,
        type: true,
        action: true,
      });
    }
  }, []);
  const [showFilters, setShowFilters] = useState(false);

  const [animation, setAnimation] = useState("");

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };
  const [openDetails, setOpenDetails] = useState({});
  const toggleDetail = (rowId, section) => {
    setOpenDetails((prev) => ({
      ...prev,
      [rowId]: {
        ...(prev[rowId] || {}),
        [section]: !(prev[rowId] || {})[section],
      },
    }));
  };

  const exportButtons = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button
        variant="outline-success"
        onClick={exportToExcel}
        title="Exporter en Excel"
        style={{ borderRadius: 6, fontSize: 13, padding: '4px 12px' }}
      >
        <FontAwesomeIcon icon={faFileExcel} /> Excel
      </Button>
      <Button
        variant="outline-danger"
        onClick={exportToPDF}
        title="Exporter en PDF"
        style={{ borderRadius: 6, fontSize: 13, padding: '4px 12px' }}
      >
        <FontAwesomeIcon icon={faFilePdf} /> PDF
      </Button>
      <Button
        variant="outline-secondary"
        onClick={printTable}
        title="Imprimer"
        style={{ borderRadius: 6, fontSize: 13, padding: '4px 12px' }}
      >
        <FontAwesomeIcon icon={faPrint} /> Imprimer
      </Button>
      <div style={{ width: 1, height: 24, background: '#d1d5db', margin: '0 4px' }} />
      <Button
        variant="outline-info"
        onClick={() => setShowImportModal(true)}
        title="Importer un fichier CSV"
        style={{ borderRadius: 6, fontSize: 13, padding: '4px 12px' }}
      >
        <FontAwesomeIcon icon={faUpload} /> Importer CSV
      </Button>
      <Button
        variant="outline-secondary"
        onClick={downloadTemplate}
        title="Télécharger le modèle CSV"
        style={{ borderRadius: 6, fontSize: 13, padding: '4px 12px' }}
      >
        <FontAwesomeIcon icon={faDownload} /> Template
      </Button>
    </div>
  );

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 6 }}>
          {/* <Toolbar /> */}

          {/* FamilleTypeCarousels composant */}
          <FamilleTypeCarousels
            activeIndex={activeIndex}
            handleSelect={handleSelect}
            chunks={chunks}
            selectedCategory={selectedCategory}
            handleCategoryFilterChange={handleCategoryFilterChange}
            activeIndexSuCat={activeIndexSuCat}
            handleSelectSousCat={handleSelectSousCat}
            chunksSucat={chunksSucat}
            sousCatFiltre={sousCatFiltre}
            handleSousCategoryFilterChange={handleSousCategoryFilterChange}
          />

          <div
            className="container-d-flex justify-content-start"
            style={{ marginTop: "55px", position: "relative" }}
          >
            <ProduitForm
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              handleRadioChange={handleRadioChange}
              handleSubmit={handleSubmit}
              errors={errors}
              calibres={calibres}
              categories={categories}
              produits={produits}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              showAddCalibre={showAddCalibre}
              setShowAddCalibre={setShowAddCalibre}
              handleAddClibre={handleAddClibre}
              handleEditClibre={handleEditClibre}
              handleDeleteCalibre={handleDeleteCalibre}
              handleDeletecatgeorie={handleDeletecatgeorie}
              showEditClibreModal={showEditClibreModal}
              setShowEditClibreModal={setShowEditClibreModal}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              handleSaveClibre={handleSaveClibre}
              showAddCategory={showAddCategory}
              setShowAddCategory={setShowAddCategory}
              handleAddCategory={handleAddCategory}
              handleEditCategorie={handleEditCategorie}
              showSuModal={showSuModal}
              setShowSuModal={setShowSuModal}
              handleAddSousCategory={handleAddSousCategory}
              handleEditSousCategorie={handleEditSousCategorie}
              handleSaveSousCategorie={handleSaveSousCategorie}
              handleDeletecatgeorieSousCat={handleDeletecatgeorie}
              showEditModal={showEditModal}
              setShowEditModal={setShowEditModal}
              handleSave={handleSave}
              showEditSousModal={showEditSousModal}
              setShowEditSousModal={setShowEditSousModal}
              handleSuCategorie={handleSuCategorie}
              idSucategorie={idSucategorie}
              handleAddEmptyRowRep={handleAddEmptyRowRep}
              selectedProductsDataRep={selectedProductsDataRep}
              handleInputChangeRep={handleInputChangeRep}
              handleDeleteProductRap={handleDeleteProductRap}
              closeForm={closeForm}
              editingProduit={editingProduit}
              formContainerStyle={formContainerStyle}
            />

            {/* ── Barre d'actions ── */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 16, padding: "10px 16px", background: "#fff",
              borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", flexWrap: "wrap", gap: 10,
            }}>
              {/* Gauche : recherche */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 200 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#f9fafb", border: "1px solid #e5e7eb",
                  borderRadius: 8, padding: "6px 12px", flex: 1, maxWidth: 320,
                }}>
                  <FontAwesomeIcon icon={faSearch} size="lg" color="#9ca3af" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: "none", outline: "none", background: "transparent",
                      fontSize: 13, flex: 1, color: "#1e293b",
                    }}
                  />
                </div>
              </div>

              {/* Droite : actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Button variant="outline-success" size="sm" onClick={exportToExcel} title="Excel" style={{ borderRadius: 6, fontSize: 12 }}>
                  <FontAwesomeIcon icon={faFileExcel} /> Excel
                </Button>
                <Button variant="outline-danger" size="sm" onClick={exportToPDF} title="PDF" style={{ borderRadius: 6, fontSize: 12 }}>
                  <FontAwesomeIcon icon={faFilePdf} /> PDF
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={printTable} title="Imprimer" style={{ borderRadius: 6, fontSize: 12 }}>
                  <FontAwesomeIcon icon={faPrint} />
                </Button>
                <div style={{ width: 1, height: 24, background: "#e5e7eb" }} />
                <Button variant="outline-info" size="sm" onClick={() => setShowImportModal(true)} title="Importer CSV" style={{ borderRadius: 6, fontSize: 12 }}>
                  <FontAwesomeIcon icon={faUpload} /> CSV
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={downloadTemplate} title="Template" style={{ borderRadius: 6, fontSize: 12 }}>
                  <FontAwesomeIcon icon={faDownload} />
                </Button>
              </div>
            </div>

            {/* ── Modal Import CSV ── */}
            <Modal show={showImportModal} onHide={() => { setShowImportModal(false); setImportFile(null); }} centered>
              <Modal.Header closeButton style={{ borderBottom: "1px solid #e5e7eb" }}>
                <Modal.Title style={{ fontWeight: 700, color: "#0f172a", fontSize: 16 }}>
                  <FontAwesomeIcon icon={faFileCsv} style={{ marginRight: 8, color: "#0d9488" }} />
                  Importer des produits (CSV)
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                  Colonnes requises : <strong>Code_produit</strong>, <strong>designation</strong>.
                  Les produits existants seront mis à jour.
                </p>
                <div
                  style={{
                    border: "2px dashed #d1d5db", borderRadius: 12, padding: 30,
                    textAlign: "center", background: importFile ? "#f0fdf4" : "#fafafa",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onClick={() => document.getElementById("csv-file-input").click()}
                >
                  <input id="csv-file-input" type="file" accept=".csv" style={{ display: "none" }}
                    onChange={(e) => setImportFile(e.target.files[0])} />
                  {importFile ? (
                    <>
                      <FontAwesomeIcon icon={faFileCsv} size="2x" color="#0d9488" />
                      <p style={{ fontWeight: 600, color: "#0d9488", marginTop: 8, fontSize: 14 }}>{importFile.name}</p>
                      <p style={{ fontSize: 12, color: "#9ca3af" }}>{(importFile.size / 1024).toFixed(1)} Ko</p>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUpload} size="2x" color="#9ca3af" />
                      <p style={{ fontWeight: 500, color: "#6b7280", marginTop: 8, fontSize: 13 }}>
                        Glissez ou cliquez pour sélectionner un CSV
                      </p>
                    </>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer style={{ borderTop: "1px solid #e5e7eb" }}>
                <Button variant="secondary" onClick={() => { setShowImportModal(false); setImportFile(null); }} style={{ borderRadius: 8, fontSize: 13 }}>
                  Annuler
                </Button>
                <Button variant="primary" onClick={handleImportCSV} disabled={!importFile || importLoading}
                  style={{ background: "#0d9488", borderColor: "#0d9488", borderRadius: 8, fontSize: 13 }}>
                  {importLoading ? <span className="spinner-border spinner-border-sm me-2" /> : <FontAwesomeIcon icon={faUpload} className="me-2" />}
                  {importLoading ? "Import..." : "Importer"}
                </Button>
              </Modal.Footer>
            </Modal>

            <TableMui
              columns={[
                {
                  id: "select",
                  label: "Sélection",
                  minWidth: 40,
                  align: "center",
                  renderHeader: () => (
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  ),
                  render: (row) => (
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(row.id)}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                  ),
                },
                ...[
                  {
                    id: "logo",
                    label: "Logo",
                    minWidth: 60,
                    render: (row) => {
                      const imageSrc = resolveImageUrl(row.logoP || row.logo_url || row.imageUrl || row.photo_url, '');
                      if (!imageSrc) {
                        return null;
                      }

                      return (
                        <img
                          src={imageSrc}
                          alt="Logo"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      );
                    },
                  },
                  { id: "Code_produit", label: "Code", minWidth: 80 },
                  { id: "designation", label: "Désignation", minWidth: 120 },
                  { id: "reference", label: "Référence", minWidth: 100 },
                  {
                    id: "type_quantite",
                    label: "Type de Quantité",
                    minWidth: 100,
                  },
                  {
                    id: "type",
                    label: "Type de Produit",
                    minWidth: 100,
                    render: (row) =>
                      row.type === "P"
                        ? "Production"
                        : row.type === "M"
                          ? "MATIERE PREMIERE"
                          : "",
                  },
                  { id: "marque", label: "Marque", minWidth: 80 },
                  { id: "unite", label: "Unité", minWidth: 80 },
                  { id: "seuil_alerte", label: "Seuil d'alerte", minWidth: 80 },
                  { id: "stock_initial", label: "Stock initial", minWidth: 80 },
                  {
                    id: "etat_produit",
                    label: "État de produit",
                    minWidth: 80,
                  },
                  {
                    id: "calibre",
                    label: "Calibre",
                    minWidth: 80,
                    render: (row) => (row.calibre ? row.calibre.calibre : ""),
                  },
                  {
                    id: "prix_produits_last",
                    label: "Prix vente",
                    minWidth: 80,
                    detailSection: "prix",
                    render: (row, { toggleDetail, openDetail }) => (
                      <>
                        {row?.prix_produits_last?.prixProduit}
                        {row?.prix_produits?.length > 0 && (
                          <FontAwesomeIcon
                            onClick={toggleDetail}
                            icon={openDetail ? faList : faList}
                            style={{
                              marginLeft: "10px",
                              cursor: "pointer",
                              color: openDetail ? "#1976d2" : "#888",
                            }}
                            title={
                              openDetail
                                ? "Masquer le détail"
                                : "Afficher le détail"
                            }
                          />
                        )}
                      </>
                    ),
                  },
                  {
                    id: "categorie",
                    label: "Famille",
                    minWidth: 100,
                    render: (row) => row?.categorie?.categorie || "",
                  },
                  {
                    id: "souscategorie",
                    label: "Type",
                    minWidth: 100,
                    render: (row) => row?.souscategorie?.categorie || "",
                  },
                  { id: "Dvie", label: "Durée de vie", minWidth: 80 },
                  {
                    id: "etiquette",
                    label: "Etiquette",
                    minWidth: 100,
                    render: (row) => row?.etiquette?.designation || row?.etiquette_label || "",
                  },
                  {
                    id: "embalge_s",
                    label: "Embalage secondaire",
                    minWidth: 100,
                    render: (row) => row?.embalge_s?.designation || row?.emballage_secondaire_label || "",
                  },
                  {
                    id: "embalge",
                    label: "Embalage primaire",
                    minWidth: 100,
                    render: (row) => row?.embalge?.designation || row?.emballage_primaire_label || "",
                  },
                  {
                    id: "unite_etiquette",
                    label: "Unité Etiquette",
                    minWidth: 80,
                  },
                  {
                    id: "unite_embalage_primaire",
                    label: "Unité Emballage Primaire",
                    minWidth: 80,
                  },
                  {
                    id: "unite_embalage_secondaire",
                    label: "Unité Emballage Secondaire",
                    minWidth: 80,
                  },
                ],
              ]}
              produitsFiltres={produitsFiltres}
              rows={produitsFiltres.slice(
                (page - 1) * rowsPerPage,
                page * rowsPerPage,
              )}
              maxHeight={650}
              hasActions={true}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              openDetails={openDetails}
              toggleDetail={toggleDetail}
              renderDetail={(row, rowOpenDetails, toggleDetail) =>
                row.prix_produits &&
                  row.prix_produits.length > 0 &&
                  rowOpenDetails?.prix ? (
                  <table
                    className="table table-responsive table-bordered"
                    style={{
                      marginTop: "0px",
                      marginBottom: "0px",
                      padding: "0px",
                    }}
                  >
                    <thead>
                      <tr>
                        <th colSpan={40}>Détails Prix</th>
                      </tr>
                      <tr>
                        <th className="ColoretableForm">Prix</th>
                        <th className="ColoretableForm">Date de début</th>
                        <th className="ColoretableForm">Date de fin</th>
                        <th className="ColoretableForm">Type de Quantité</th>
                        <th className="ColoretableForm">Unité</th>
                      </tr>
                    </thead>
                    <tbody>
                      {row.prix_produits.map((repclient) => (
                        <tr key={repclient.id}>
                          <td>{repclient.prixProduit}</td>
                          <td>{repclient.dateDebut}</td>
                          <td>{repclient.dateFin || ""}</td>
                          <td>{translateTypeQte(repclient.typeQte)}</td>
                          <td>{repclient.Unite || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : null
              }
              showFilters={showFilters}
              selectedItems={selectedItems}
              handleDeleteSelected={handleDeleteSelected}
              handleSelectItem={(row) => handleCheckboxChange(row.id)}
              handleSelectAll={handleSelectAllChange}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              AddButton={AddButton}
              FilterToggleButton={FilterToggleButton}
              handleShowFormButtonClick={handleShowFormButtonClick}
              toggleFilters={toggleFilters}
              heightOffset={{ trueOffset: 388, falseOffset: 338 }}
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
                      {/* Genre Filter */}
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
                          aria-label="Select genre"
                          value={genreFiltre}
                          onChange={(e) => setGenreFiltre(e.target.value)}
                          style={{
                            padding: "8px",
                            fontSize: "12px",
                            width: "150px",
                            marginTop: "-17px",
                          }}
                        >
                          <option value="">Genre</option>
                          <option value="vente">Vente</option>
                          <option value="achat">Achat</option>
                          <option value="venteachat">Vente & Achat</option>
                        </Form.Select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              }
              tableContainerStyle={tableContainerStyle}
            />
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

export default ProduitList;