import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Button, Modal, DropdownButton } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import Navigation from "../Acceuil/Navigation";
import Search from "../Acceuil/Search";
import TablePagination from "@mui/material/TablePagination";
import ExportToPdfButton from "./exportToPdf";
import PrintList from "./PrintList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Carousel } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  useProduits,
  useCategories,
  useCalibres,
  useAuthRedux,
} from "../store/hooks";
import { fetchProduits as fetchProduitsRedux } from "../store/produitSlice";
import { fetchCategories as fetchCategoriesRedux } from "../store/categorieSlice";
import { fetchCalibres as fetchCalibresRedux } from "../store/calibreSlice";
import { fetchAuthenticatedUser } from "../store/authSlice";

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
} from "@fortawesome/free-solid-svg-icons";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Fab, ListItemIcon, Toolbar } from "@mui/material";
import { BsShop } from "react-icons/bs";
import { useOpen } from "../Acceuil/OpenProvider"; // Importer le hook personnalisé
import { FaArrowLeft, FaArrowRight, FaChartBar } from "react-icons/fa6";
import {
  deleteDataFromIndexedDB,
  getDataFromIndexedDB,
  storeDataInIndexedDB,
} from "../utils/indexedDBUtils";
import CategoryProductChart from "./ProduitChart";
import ProduitForm from "./ProduitForm";
import AddButton from "../components/addButton";
import FilterToggleButton from "../components/FilterToggleButton";
import TableContainer from "../components/TableContainer";
import SortableColumn from "../components/SortableColumn";
import useSortableData from "../hooks/useSortableData";
import { useAuth } from "../AuthContext";
import API_BASE_URL, { getApiRequestConfig } from "../utils/api/baseUrl";

const getErrorMessage = (error, fallbackMessage) => {
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data?.message) return error.response.data.message;

  const validationErrors = error?.response?.data?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const firstError = Object.values(validationErrors)[0];
    if (Array.isArray(firstError) && firstError[0]) return firstError[0];
    if (typeof firstError === "string") return firstError;
  }

  return fallbackMessage;
};

const createEmptyPriceRow = () => ({
  id: null,
  date_debut: "",
  date_fin: "",
  prixProduit: "",
  type: "",
  unite: "",
});

const ProduitList = () => {
  const dispatch = useDispatch();

  // Redux hooks
  const { produits, chartData, loading: produitsLoading } = useProduits();
  const { categories, loading: categoriesLoading } = useCategories();
  const { calibres, loading: calibresLoading } = useCalibres();
  const { user, loading: userLoading } = useAuthRedux();

  // Local state for UI
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProduitsByCategory, setFilteredProduitsByCategory] = useState(
    [],
  );
  const { permissions = [] } = useAuth();

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
    marginRight: "0",
  });

  const { open } = useOpen();
  const { dynamicStyles } = useOpen();
  const tableHeaderStyle = {
    background: "#007bff",
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  };

  const [showForm, setShowForm] = useState(false);

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
    tva: "",
    marque: "Ovotec",
    logoP: "",
    suCat_id: "",
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
  });
  const [categories2, setCategories2] = useState([]);
  const fetchCategories = async () => {
    dispatch(fetchCategoriesRedux());
  };

  useEffect(() => {
    fetchCategories(); // Cela pourrait être appelé lorsque le composant se monte
  }, []);
  const [chartData2, setChartData2] = useState(null);

  const fetchProduits = async () => {
    dispatch(fetchProduitsRedux());
  };

  console.log("categories2Produit", categories2);

  console.log("cattest");
  useEffect(() => {
    // Load all data from Redux on component mount
    dispatch(fetchProduitsRedux());
    dispatch(fetchCategoriesRedux());
    dispatch(fetchCalibresRedux());
    dispatch(fetchAuthenticatedUser());
  }, [dispatch]);

  useEffect(() => {
    if (produits) {
      const filtered = produits.filter((produit) => {
        return Object.entries(produit).some(([key, value]) => {
          // Vérifiez les champs standards
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

          // Vérifiez le calibre s'il existe
          if (key === "calibre" && produit.calibre && produit.calibre.calibre) {
            return produit.calibre.calibre
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }

          // Vérifiez la catégorie s'il existe
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

  // Fonction pour mettre à jour le terme de recherche
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    // Retrieve rowsPerPage from localStorage
    const savedRowsPerPage = localStorage.getItem("rowsPerPage");
    if (savedRowsPerPage) {
      setRowsPerPage(parseInt(savedRowsPerPage, 10));
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [produitsFiltres, setProduitsFiltres] = useState([]);
  const [genreFiltre, setGenreFiltre] = useState("");

  useEffect(() => {
    console.log("Selected category:", selectedCategory);
    console.log("Produits:", produits);

    const filterProductsByCategory = (categoryId, sousCatFiltre) => {
      let result = [];

      if (categoryId) {
        console.log("Filtering products by category:", categoryId);

        if (categoryId === "tout") {
          result = filteredProduits;
        } else {
          let filtered = filteredProduits.filter(
            (produit) => produit.categorie_id === parseInt(categoryId),
          );
          console.log("sousCatFiltre", sousCatFiltre);

          if (sousCatFiltre && sousCatFiltre !== "tout") {
            filtered = filtered.filter(
              (produit) => produit.suCat_id === parseInt(sousCatFiltre),
            );
            if (filtered.length === 0) {
              console.log("No products found for this subcategory");
            } else {
              console.log("Filtered products by subcategory:", filtered);
            }
          } else {
            if (filtered.length === 0) {
              console.log("No products found for this category");
            } else {
              console.log("Filtered products:", filtered);
            }
          }

          result = filtered;
        }
      } else {
        console.log("No category selected, displaying all products");
        result = filteredProduits;
      }
      const produitsFiltres = result.filter((produit) =>
        genreFiltre ? produit.genre === genreFiltre : true,
      );
      setFilteredProduitsByCategory(produitsFiltres);
      setProduitsFiltres(produitsFiltres);

      setSortedData(produitsFiltres);
      setPage(1);
    };

    filterProductsByCategory(selectedCategory, sousCatFiltre);
  }, [selectedCategory, filteredProduits, sousCatFiltre, genreFiltre]);
  const { sortedData, handleSort, setSortedData, sortColumn, sortOrder } =
    useSortableData(produitsFiltres);

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
    localStorage.setItem("rowsPerPage", selectedRows); // Store in localStorage
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

  const handleDeleteSelected = async () => {
    const result = await Swal.fire({
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
    });

    if (result.isConfirmed) {
      try {
        // Supprimer les produits sélectionnés via API
        const response = await axios.delete(
          `${API_BASE_URL}/api/deleteSelectProd`,
          {
            ...getApiRequestConfig(),
            data: { ids: selectedItems },
          },
        );

        // Supprimer les données du IndexedDB
        for (const id of selectedItems) {
          await deleteDataFromIndexedDB("produits", id);
        }

        // Rafraîchir la liste des produits après suppression
        dispatch(fetchProduitsRedux());
        setSelectedItems([]);

        // Afficher une confirmation de succès
        await Swal.fire({
          icon: "success",
          title: "Opération terminée avec succès",
          text: "Votre action a été réalisée avec succès.",
        });
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);

        // Afficher une alerte en cas d'erreur
        await Swal.fire({
          icon: "error",
          title: "Échec de l'opération",
          text: "L'opération n'a pas pu être complétée. Veuillez réessayer plus tard.",
        });
      }
    } else {
      console.log("Suppression annulée");
    }
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
        axios
          .delete(`${API_BASE_URL}/api/produits/${id}`, getApiRequestConfig())
          .then((response) => {
            dispatch(fetchProduitsRedux());
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
              // Afficher le message d'erreur dans Swal.fire()
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
  const [chart, setChart] = useState(true);
  const handleShowFormButtonClick = (boolen) => {
    setFormData({
      Code_produit: "",
      designation: "",
      type_quantite: "",
      unite: "",
      seuil_alerte: "",
      stock_initial: "",
      etat_produit: "",
      calibre_id: "",
      categorie_id: "",
      marque: "",
      prix_vente: "",
      tva: "",
      suCat_id: "",
      genre: "",
      Dvie: "",

      type_produit: "",
    });
    setChart(boolen);
    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "48%" });
    }
  };
  const handleShowFormButtonClickchart = (boolen) => {
    setChart(boolen);
    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "48%" });
    } else if (chart) {
      closeForm();
    }
  };
  const closeForm = () => {
    setFormContainerStyle({ right: "-100%" });
    setTableContainerStyle({ marginRight: "0" });
    setShowForm(false); // Hide the form
    setFormData({
      logoP: "",
      marque: "Ovotec",
      tva: "",
      Code_produit: "",
      designation: "",
      type_quantite: "",
      unite: "",
      seuil_alerte: "",
      prix_vente: "",
      stock_initial: "",
      etat_produit: "",
      calibre_id: "",
      user_id: "",
      categorie_id: "",
      suCat_id: "",
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
    });

    setSelectedProductsDataRep([]);
    setEditingProduit(null); // Clear editing client
    setIsEdit(false);
  };

  const handleEdit = (produit, boolen) => {
    setChart(boolen);

    setEditingProduit(produit);
    setIsEdit(true);
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
      tva: produit.tva,

      suCat_id: produit.suCat_id,
      genre: produit.genre,
      Dvie: produit.Dvie,

      type_produit: produit.type,
    });
    setSelectedProductsDataRep(
      produit?.prix_produits?.map((prix) => ({
        id: prix.id ?? null,
        date_debut: prix.dateDebut || prix.date_debut || "",
        date_fin: prix.dateFin || prix.date_fin || "",
        type: prix.typeQte || "",
        unite: prix.Unite || prix.unite || "",
        prixProduit: prix.prixProduit || "",
      })) || [],
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
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  };

  const validateForm = (data) => {
    const errors = {}; // Objet pour stocker les erreurs

    // Validation pour Code produit
    if (!data.Code_produit) {
      errors.Code_produit = "Le code produit est requis.";
    }

    // Validation pour Désignation
    if (!data.designation) {
      errors.designation = "La désignation est requise.";
    }

    // Validation pour Type de Quantité
    if (!data.type_quantite) {
      errors.type_quantite = "Le type de quantité est requis.";
    }

    // Validation pour Catégorie
    if (!data.categorie_id) {
      errors.categorie_id = "La catégorie est requise.";
    }

    return errors; // Retourne l'objet d'erreurs
  };

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData reçu dans handleSubmit", formData);

    const newErrors = validateForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({});
      }, 3000);
      Swal.fire({
        icon: "warning",
        title: "Formulaire incomplet",
        text: "Veuillez corriger les champs obligatoires.",
      });
      return;
    }

    const validPrixProduits = (selectedProductsDataRep || [])
      .filter(
        (prix) =>
          prix &&
          (prix.prixProduit ||
            prix.date_debut ||
            prix.date_fin ||
            prix.type ||
            prix.unite),
      )
      .map((prix) => ({
        id: prix.id || null,
        dateDebut: prix.date_debut || "",
        dateFin: prix.date_fin || "",
        prixProduit: prix.prixProduit || "",
        typeQte:
          formData.type_quantite === "kg"
            ? "K"
            : formData.type_quantite === "litre"
              ? "L"
              : formData.type_quantite === "unite"
                ? "U"
                : prix.type || "",
        Unite: prix.unite || "",
      }))
      .filter((prix) => prix.prixProduit && prix.dateDebut);

    if (!editingProduit && validPrixProduits.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Prix manquant",
        text: "Ajoutez au moins un prix valide avec une date de début.",
      });
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
      ? `${API_BASE_URL}/api/produits/${editingProduit.id}`
      : `${API_BASE_URL}/api/produits`;
    const method = editingProduit ? "put" : "post";

    let requestData;

    if (editingProduit) {
      requestData = {
        Code_produit: formData.Code_produit,
        designation: formData.designation,
        calibre_id: formData.calibre_id,
        type_quantite: formData.type_quantite,
        unite: formData.unite,
        seuil_alerte: formData.seuil_alerte,
        stock_initial: formData.stock_initial,
        etat_produit: formData.etat_produit,
        marque: formData.marque,
        prix_vente: formData.prix_vente,
        tva: formData.tva,
        genre: formData.genre,
        type: formData.type_produit,
        Dvie: formData.Dvie,

        categorie_id: formData.categorie_id,
        suCat_id: formData.suCat_id,
        prixProduits: validPrixProduits,
      };
      console.log("requestData", requestData);
      if (formData.logoP) {
        setMessage("Please select a file before submitting.");
        const formData2 = new FormData();
        formData2.append("logoP", formData.logoP);

        try {
          const uploadConfig = getApiRequestConfig();
          const response = await fetch(
            `${API_BASE_URL}/api/produit/${editingProduit.id}/update-logo`,
            {
              method: "POST",
              credentials: "include",
              headers: uploadConfig.headers || {},
              body: formData2, // Corrected to send formData2
            },
          );

          // Ensure the response is JSON
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();

            if (response.ok) {
              setMessage("Logo updated successfully!");
              Swal.fire({
                icon: "success",
                title: "Succès!",
                text: data.message || "Logo mis à jour avec succès.",
              });
            } else {
              setMessage(`Error: ${data.message}`);
              Swal.fire({
                icon: "error",
                title: "Erreur upload",
                text: data.message || "Échec de l'upload du logo.",
              });
            }
          } else {
            const errorText = await response.text();
            setMessage("Unexpected error occurred");
            console.error("Server response:", errorText);
            Swal.fire({
              icon: "error",
              title: "Erreur upload",
              text: "Réponse inattendue du serveur pendant l'upload du logo.",
            });
          }
        } catch (error) {
          setMessage("Error uploading the logo.");
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Erreur upload",
            text: getErrorMessage(error, "Échec de l'upload du logo."),
          });
        }
      }
    } else {
      const formDatad = new FormData();
      formDatad.append("Code_produit", formData.Code_produit);
      formDatad.append("designation", formData.designation);
      formDatad.append("calibre_id", formData.calibre_id);
      formDatad.append("type_quantite", formData.type_quantite);
      formDatad.append("unite", formData.unite);
      formDatad.append("seuil_alerte", formData.seuil_alerte);
      formDatad.append("stock_initial", formData.stock_initial);
      formDatad.append("etat_produit", formData.etat_produit);
      formDatad.append("marque", formData.marque);
      formDatad.append("prix_vente", formData.prix_vente);
      formDatad.append("tva", formData.tva);
      formDatad.append("categorie_id", formData.categorie_id);
      formDatad.append("suCat_id", formData.suCat_id);
      formDatad.append("genre", formData.genre);
      formDatad.append("type", formData.type_produit);
      formDatad.append("Dvie", formData.Dvie);

      if (formData.logoP) {
        formDatad.append("logoP", formData.logoP);
      }
      validPrixProduits.forEach((prix, index) => {
        formDatad.append(`prixProduits[${index}][dateDebut]`, prix.dateDebut);
        formDatad.append(`prixProduits[${index}][dateFin]`, prix.dateFin);
        formDatad.append(
          `prixProduits[${index}][prixProduit]`,
          prix.prixProduit,
        );
        formDatad.append(`prixProduits[${index}][typeQte]`, prix.typeQte);
        formDatad.append(`prixProduits[${index}][Unite]`, prix.Unite);
      });
      requestData = formDatad;
      console.log(requestData);
    }

    try {
      const response = await axios({
        method: method,
        url: url,
        data: requestData,
        ...getApiRequestConfig(),
      });

      console.log("response", response);
      // Le reste de votre code pour le message de succès, etc.
      dispatch(fetchProduitsRedux());
      Swal.close();

      const successMessage = `Produit ${editingProduit ? "modifié" : "ajouté"} avec succès.`;
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: successMessage,
      });

      // Réinitialiser le formulaire et les erreurs
      setFormData({
        Code_produit: "",
        designation: "",
        calibre_id: "",
        type_quantite: "",
        unite: "",
        seuil_alerte: "",
        stock_initial: "",
        etat_produit: "",
        marque: "Ovotec",

        categorie_id: "",
        logoP: null,
        suCat_id: "",
        genre: "",
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
      setSelectedProductsDataRep([]);
      closeForm();
    } catch (error) {
      Swal.close();

      if (error.response) {
        const serverErrors =
          error.response.data.errors || error.response.data.error || {};
        console.log(error);
        setErrors({
          logoP: serverErrors.logoP ? serverErrors.logoP[0] : "",
          Code_produit: serverErrors.Code_produit
            ? serverErrors.Code_produit[0]
            : "",
          designation: serverErrors.designation
            ? serverErrors.designation[0]
            : "",
          calibre_id: serverErrors.calibre_id ? serverErrors.calibre_id[0] : "",
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
      }
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: getErrorMessage(error, "L'enregistrement du produit a échoué."),
      });
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
        return type; // Retourne la valeur par défaut si aucune correspondance
    }
  };

  //------------------------- fournisseur export to excel ---------------------//

  const [cat, setCat] = useState([]);
  const handleDeletecatgeorie = async (categorieId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/categories/${categorieId}`,
        getApiRequestConfig(),
      );

      // Notification de succès
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: " supprimée avec succès.",
      });
      dispatch(fetchCategoriesRedux()); // Refresh categories after adding

      // Récupérer les nouvelles catégories après suppression
    } catch (error) {
      console.error("Error deleting categorie:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur!",
        text: "Échec de la suppression de la categorie.",
      });
    }
  };

  console.log("cat", cat);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditClibreModal, setShowEditClibreModal] = useState(false);

  const [showEditSousModal, setShowEditSousModal] = useState(false);

  const [showSuModal, setShowSuModal] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [categorieId, setCategorie] = useState();
  const [image, setImage] = useState(null); // State for the selected image

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
    setCategorie(categorieId.categorie);
    setShowEditSousModal(true);
  };
  const [idSucategorie, setIdSucategorie] = useState(null); // State for
  const handleSuCategorie = (categorieId) => {
    setIdSucategorie(categorieId);
    setShowSuModal(true);
  };
  console.log("selectedCategoryId", selectedCategoryId, categorieId);
  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Update the image state
  };

  const handleSave = async () => {
    console.log("image", selectedCategoryId.categorie, image);
    try {
      const formData = new FormData();
      formData.append("_method", "put"); // Note : Vous n'avez peut-être pas besoin de cette ligne si vous utilisez une méthode PUT directement
      formData.append("categorie", selectedCategoryId.categorie);
      formData.append("logoP", newCategory.imageFile);
      const response = await axios.post(
        `${API_BASE_URL}/api/categories/${selectedCategoryId.id}`,
        formData,
        getApiRequestConfig(),
      );
      dispatch(fetchCategoriesRedux()); // Refresh the categories list
      setShowEditModal(false);
      setShowEditSousModal(false);
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: " modifiée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la modification de la catégorie :", error);
    }
  };
  const handleSaveClibre = async () => {
    console.log("image", selectedCategoryId.categorie, image);
    try {
      await axios.put(
        `${API_BASE_URL}/api/calibres/${selectedCategoryId.id}`,
        {
          calibre: selectedCategoryId.calibre,
        },
        getApiRequestConfig(),
      );
      dispatch(fetchCalibresRedux()); // Refresh calibres
      setShowEditClibreModal(false); // Close the modal
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: " modifiée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la modification de la catégorie :", error);
    }
  };

  const [showAddCategory, setShowAddCategory] = useState(false); // Gère l'affichage du formulaire
  const [showAddCalibre, setShowAddCalibre] = useState(false); // Gère l'affichage du formulaire

  const [newCategory, setNewCategory] = useState({
    categorie: "",
    imageFile: null,
  });

  const handleAddCategory = async () => {
    try {
      const formData = new FormData();
      formData.append("categorie", newCategory.categorie);
      formData.append("logoP", newCategory.imageFile);

      const response = await axios.post(
        `${API_BASE_URL}/api/categories`,
        formData,
        {
          ...getApiRequestConfig(),
          headers: {
            ...getApiRequestConfig().headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(response.data);
      dispatch(fetchCategoriesRedux()); // Refresh categories after adding
      setShowAddCategory(false);
      setNewCategory({ categorie: "", imageFile: null });
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: " ajoutée avec succès.",
      }); // Hide the modal after success
    } catch (error) {
      console.error("Error adding category:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: getErrorMessage(error, "L'ajout de la catégorie a échoué."),
      });
    }
  };
  const handleAddSousCategory = async () => {
    try {
      console.log("idSucategorie", idSucategorie);

      const formData = new FormData();
      formData.append("categorie", newCategory.categorie);
      formData.append("parent_id", idSucategorie);

      formData.append("logoP", newCategory.imageFile);

      const response = await axios.post(
        `${API_BASE_URL}/api/categories`,
        formData,
        {
          ...getApiRequestConfig(),
          headers: {
            ...getApiRequestConfig().headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(response.data);
      dispatch(fetchCategoriesRedux()); // Refresh categories after adding
      setShowSuModal(false);
      setNewCategory({ categorie: "", imageFile: null });
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "ajoutée avec succès.",
      }); // Hide the modal after success
    } catch (error) {
      console.error("Error adding category:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: getErrorMessage(error, "L'ajout du sous-type a échoué."),
      });
    }
  };

  document.addEventListener("change", async function (event) {
    if (event.target && event.target.id.startsWith("actionDropdown_")) {
      const [action, categoryId] = event.target.value.split("_");
      if (action === "delete") {
        // Delete action
        handleDeletecatgeorie(categoryId);
      } else if (action === "modify") {
        handleEditcatgeorie(categoryId);
      }
      event.target.value = "";
    }
  });

  const handleAddClibre = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/calibres`,
        { calibre: newCategory.categorie },
        getApiRequestConfig(),
      );

      console.log(response.data);
      dispatch(fetchCalibresRedux()); // Refresh calibres after adding
      // Refresh categories after adding
      setShowAddCalibre(false);
      setNewCategory({ categorie: "", imageFile: null });
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "ajoutée avec succès.",
      }); // Hide the modal after success
    } catch (error) {
      console.error("Error adding category:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: getErrorMessage(error, "L'ajout du calibre a échoué."),
      });
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
  const chunkSize = 4;
  const chunks = chunkArray(
    categories.filter((cat) => cat.idCatMer === null),
    chunkSize,
  );
  const chunksSucat = chunkArray(
    categories.filter(
      (cat) => cat.idCatMer !== null && cat.idCatMer === selectedCategory,
    ),
    chunkSize,
  );

  console.log("categori1", categories);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndexSuCat, setActiveIndexSuCat] = useState(0);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };
  const handleSelectSousCat = (selectedIndex) => {
    setActiveIndexSuCat(selectedIndex);
  };
  console.log("formData", formData);
  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Logo",
      "Code",
      "Désignation",
      "Type de Quantité",
      "Marque",
      "Unité",
      "Seuil d'alerte",
      "Stock initial",
      "État de produit",
      "Calibre",
      "Prix vente",
      "Catégorie",
      "Sous Catégorie",
    ];

    const tableRows = produitsFiltres.map((produit) => [
      API_BASE_URL + produit.logoP,
      produit.Code_produit,
      produit.designation,
      produit.type_quantite,
      produit.marque,
      produit.unite,
      produit.seuil_alerte,
      produit.stock_initial,
      produit.etat_produit,
      produit.calibre?.calibre,
      produit.prix_vente,
      produit.tva,
      produit.categorie?.categorie,
      produit.souscategorie?.categorie,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("table_produits.pdf");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      (produitsFiltres || []).map((produit) => ({
        Logo: API_BASE_URL + produit.logoP || "",
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
        TVA: produit.tva,
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
              <th>TVA</th>
              <th>Catégorie</th>
              <th>Sous Catégorie</th>
            </tr>
          </thead>
          <tbody>
            ${(produitsFiltres || [])
              .map(
                (produit) => `
              <tr>
                <td>${produit.logoP ? `<img src="${API_BASE_URL + produit.logoP}" alt="Logo" style="width:50px;height:50px;border-radius:50%"/>` : ""}</td>
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
                <td>${produit.tva || ""}</td>
                <td>${produit.categorie?.categorie || ""}</td>
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

  // Fonction pour filtrer les produits

  console.log("produit333", produitsFiltres, sortedData);
  const handleAddEmptyRowRep = () => {
    setSelectedProductsDataRep([
      ...selectedProductsDataRep,
      createEmptyPriceRow(),
    ]);
    console.log("selectedProductDatarap", selectedProductsDataRep);
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
        axios
          .delete(
            `${API_BASE_URL}/api/prixProduit/${id}`,
            getApiRequestConfig(),
          )
          .then(() => {
            dispatch(fetchProduitsRedux());
            Swal.fire({
              icon: "success",
              title: "Succès!",
              text: "Prix supprimé avec succès.",
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: getErrorMessage(error, "La suppression du prix a échoué."),
            });
          });
      }
    } else if (result.isDenied) {
      Swal.fire("Suppression annulée", "", "info");
    }
  };
  console.log("rep", selectedProductsDataRep);
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
    tva: true,
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
    { key: "tva", label: "TVA" },
    { key: "famille", label: "Famille" },
    { key: "type", label: "Type" },
    { key: "action", label: "Action" },
  ];

  // Toggle visibility of columns
  const toggleColumnVisibility = (column) => {
    setColumnVisibility((prevState) => {
      const newVisibility = { ...prevState, [column]: !prevState[column] };
      // Save the updated column visibility to localStorage
      localStorage.setItem(
        "columnVisibilityProduit",
        JSON.stringify(newVisibility),
      );
      return newVisibility;
    });
  };

  // Load visibility state from localStorage
  useEffect(() => {
    const savedVisibility = JSON.parse(
      localStorage.getItem("columnVisibilityProduit"),
    );
    if (savedVisibility) {
      setColumnVisibility(savedVisibility);
    } else {
      // Default state: show all columns
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
        tva: true,
        famille: true,
        type: true,
        action: true,
      });
    }
  }, []); // Empty dependency array ensures this runs only once on mount
  const [showFilters, setShowFilters] = useState(false);

  const [animation, setAnimation] = useState("");

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{ ...dynamicStyles }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 6 }}>
          {/* <Toolbar /> */}

          <h3
            className="titreColore d-flex justify-content-between align-items-center"
            style={{
              width: "20%",
            }}
          >
            Liste des Produits
          </h3>
          <div
            className="search-container "
            style={{
              width: "30%",
              position: "absolute",
              right: "8%",
              marginTop: "-50px",
            }}
            role="search"
          >
            <Search onSearch={handleSearch} type="search" />
          </div>
          <div
            style={{
              width: "30%",
              position: "absolute",
              right: "-22%",
              marginTop: "-50px",
            }}
          >
            <FontAwesomeIcon
              style={{
                cursor: "pointer",
                color: "grey",
                fontSize: "1.8rem",
                marginLeft: "15px",
              }}
              onClick={printTable}
              icon={faPrint}
            />
            <FontAwesomeIcon
              style={{
                cursor: "pointer",
                color: "red",
                fontSize: "1.8rem",
                marginLeft: "15px",
              }}
              onClick={exportToPDF}
              icon={faFilePdf}
            />
            <FontAwesomeIcon
              icon={faFileExcel}
              onClick={exportToExcel}
              style={{
                cursor: "pointer",
                color: "green",
                fontSize: "1.8rem",
                marginLeft: "15px",
              }}
            />
          </div>

          <div
            className="d-flex justify-content-between align-items-center"
            style={{
              marginLeft: "120px",
              marginTop: "-30px",
              marginBottom: "-21px",
            }}
          >
            <h5
              className="container-d-flex justify-content-start titreColore"
              style={{ marginLeft: "-120px", marginTop: "20px" }}
            >
              Famille Produit
            </h5>
            <h5
              className="container-d-flex justify-content-start titreColore"
              style={{ marginRight: "50%", marginTop: "20px" }}
            >
              Type
            </h5>
          </div>

          <div
            className="d-flex justify-content-between"
            style={{ marginTop: "20px" }}
          >
            <div
              className="container bgCategories"
              style={{ marginLeft: "0px" }}
            >
              <Carousel
                activeIndex={activeIndex}
                onSelect={handleSelect}
                interval={null}
                nextIcon={
                  <FaArrowRight
                    size="2x"
                    color="@ffffff"
                    style={{
                      backgroundColor: "black",
                      borderRadius: "50%",
                      marginTop: "-35px",
                      marginLeft: "0px",
                      marginRight: "-10px",
                    }}
                  />
                }
                prevIcon={
                  <FaArrowLeft
                    size="2x"
                    color="@ffffff"
                    style={{
                      backgroundColor: "black",
                      borderRadius: "50%",
                      marginTop: "-35px",
                      marginLeft: "-10px",
                    }}
                  />
                }
              >
                {chunks.map((chunk, chunkIndex) => (
                  <Carousel.Item key={chunkIndex}>
                    <div className="d-flex justify-content-start">
                      <a
                        href="#"
                        style={{
                          marginLeft: "40px",
                          marginTop: "5px",
                          marginBottom: "5px",
                        }}
                      >
                        <div
                          className={`category-item ${selectedCategory === "tout" ? "active" : ""}`}
                          onClick={() => handleCategoryFilterChange("tout")}
                        >
                          <img
                            src={"../../public/images/bayd.jpg"}
                            alt={"tout"}
                            className={`rounded-circle category-img ${selectedCategory === "tout" ? "selected" : ""}`}
                          />
                          <p className="category-text">Tout</p>
                        </div>
                      </a>

                      {chunk.map((category, index) => (
                        <a
                          href="#"
                          key={index}
                          style={{
                            marginTop: "5px",
                            marginBottom: "5px",
                            marginLeft: "80px",
                          }}
                        >
                          <div
                            className={`category-item ${selectedCategory === category.id ? "active" : ""}`}
                            onClick={() =>
                              handleCategoryFilterChange(category.id)
                            }
                          >
                            <img
                              src={category.logoP}
                              alt={category.categorie}
                              className={`rounded-circle category-img ${selectedCategory === category.id ? "selected" : ""}`}
                            />
                            <p className="category-text">
                              {category.categorie}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>

            <div
              className="container bgCategories"
              style={{ marginRight: "0" }}
            >
              <Carousel
                activeIndex={activeIndexSuCat}
                onSelect={handleSelectSousCat}
                interval={null}
                nextIcon={
                  <FaArrowRight
                    size="2x"
                    color="@ffffff"
                    style={{
                      backgroundColor: "black",
                      borderRadius: "50%",
                      marginTop: "-35px",
                      marginLeft: "0px",
                      marginRight: "-10px",
                    }}
                  />
                }
                prevIcon={
                  <FaArrowLeft
                    size="2x"
                    color="@ffffff"
                    style={{
                      backgroundColor: "black",
                      borderRadius: "50%",
                      marginTop: "-35px",
                      marginLeft: "-10px",
                    }}
                  />
                }
              >
                {chunksSucat.map((chunk, chunkIndex) => (
                  <Carousel.Item key={chunkIndex}>
                    <div className="d-flex justify-content-start">
                      <a
                        href="#"
                        style={{ marginLeft: "40px", marginBottom: "3px" }}
                      >
                        <div
                          className={`category-item ${sousCatFiltre === "tout" ? "active" : ""}`}
                          onClick={() => handleSousCategoryFilterChange("tout")}
                        >
                          <img
                            src={"../../public/images/bayd.jpg"}
                            alt={"tout"}
                            className={`rounded-circle category-img ${sousCatFiltre === "tout" ? "selected" : ""}`}
                          />
                          <p className="category-text">Tout</p>
                        </div>
                      </a>

                      {chunk.map((category, index) => (
                        <a href="#" className="mx-5" key={index}>
                          <div
                            className={`category-item ${sousCatFiltre === category.id ? "active" : ""}`}
                            onClick={() =>
                              handleSousCategoryFilterChange(category.id)
                            }
                          >
                            <img
                              src={category.logoP}
                              alt={category.categorie}
                              className={`rounded-circle category-img ${sousCatFiltre === category.id ? "selected" : ""}`}
                            />
                            <p className="category-text">
                              {category.categorie}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>

          <div className="container-d-flex justify-content-start">
            <a
              id="showFormButton"
              onClick={() => handleShowFormButtonClickchart(true)}
              style={{
                // textDecoration: "none",
                display: "flex",
                alignItems: "center",
                cursor: "pointer", // Change cursor to indicate clickable element
                width: "150px",
                marginTop: "0px",
                marginBottom: "40px",
              }}
              className="AjouteBotton"
            >
              <ListItemIcon
                style={{ position: "absolute", left: "25px", fontSize: "20px" }}
              >
                <FaChartBar className="AjouteBotton" />
              </ListItemIcon>{" "}
              ''
            </a>

            <div style={{ marginTop: "-25px" }}>
              <div
                id="formContainerunique"
                className=""
                style={{
                  ...formContainerStyle,
                  marginTop: "-10px",
                  height: `calc(100vh - 300px)`,
                  overflow: "auto",
                }}
              >
                {chart ? (
                  <CategoryProductChart chartData={chartData} />
                ) : (
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
                    handleDeletecatgeorieSousCat={handleDeletecatgeorie}
                    showEditModal={showEditModal}
                    setShowEditModal={setShowEditModal}
                    handleSave={handleSave}
                    showEditSousModal={showEditSousModal}
                    setShowEditSousModal={setShowEditSousModal}
                    // handleSaveSous prop removed (was undefined and unused)
                    handleSuCategorie={handleSuCategorie}
                    handleAddEmptyRowRep={handleAddEmptyRowRep}
                    selectedProductsDataRep={selectedProductsDataRep}
                    handleInputChangeRep={handleInputChangeRep}
                    handleDeleteProductRap={handleDeleteProductRap}
                    AddButton={AddButton}
                    closeForm={closeForm}
                    editingProduit={editingProduit}
                    showFilters={showFilters}
                    formContainerStyle={formContainerStyle}
                    FilterToggleButton={FilterToggleButton}
                    toggleFilters={toggleFilters}
                    allColumns={allColumns}
                    columnVisibility={columnVisibility}
                    toggleColumnVisibility={toggleColumnVisibility}
                    genreFiltre={genreFiltre}
                    setGenreFiltre={setGenreFiltre}
                    produitsFiltres={produitsFiltres}
                    selectAll={selectAll}
                    handleSelectAllChange={handleSelectAllChange}
                    selectedItems={selectedItems}
                    handleCheckboxChange={handleCheckboxChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    TableContainer={TableContainer}
                    expandedRowsRepresantant={expandedRowsRepresantant}
                    toggleRowRepresantant={toggleRowRepresantant}
                    translateTypeQte={translateTypeQte}
                  />
                )}
              </div>
            </div>

            <div
              style={{
                ...tableContainerStyle,
                marginTop: "-35px",
                padding: "0",
                backgroundColor: "#ffff", // Set background color
                border: "3px solid #ddd", // Add border to the table
                borderCollapse: "collapse", // Collapse borders
              }}
            >
              {/* Bouton Ajouter Produits */}

              {/* Bouton Ajouter Produits à droite */}

              <AddButton
                onClick={() => handleShowFormButtonClick(false)}
                requiredPermission={"create_product"}
                text="Ajouter Produits"
                align="right"
                filtre={
                  <FilterToggleButton
                    showFilters={showFilters}
                    toggleFilters={toggleFilters}
                    align="right"
                  />
                }
              />

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }} // Start state
                    animate={{ opacity: 1, y: 0 }} // Animation state
                    exit={{ opacity: 0, y: -20 }} // Exit state
                    transition={{ duration: 0.5 }} // Duration of the animation
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end", // Align to the right
                      marginTop: "0px",
                      maxWidth: "100%",
                      padding: "0 20px", // Added padding for better spacing
                    }}
                  >
                    {/* Genre Filter */}
                    <div
                      className="date-filter-container"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "0px",
                        marginRight: "20px", // Right margin for spacing
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

                    {/* Column Visibility Dropdown */}
                    <div
                      className="mb-3"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <DropdownButton
                        align="end"
                        title="Masquer colonnes"
                        id="column-toggle-dropdown"
                        style={{
                          padding: "8px",
                          fontSize: "14px",
                          width: "150px",
                        }}
                      >
                        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                          {allColumns.map((column) => (
                            <label key={column.key} className="dropdown-item">
                              <input
                                type="checkbox"
                                className="me-2"
                                checked={columnVisibility[column.key]} // Display column if true
                                onClick={() =>
                                  toggleColumnVisibility(column.key)
                                } // Toggle column visibility
                              />
                              {column.label}
                            </label>
                          ))}
                        </div>
                      </DropdownButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <TableContainer
                showFilters={showFilters}
                selectedItems={selectedItems}
                handleDeleteSelected={handleDeleteSelected}
                produitsFiltres={produitsFiltres}
                rowsPerPage={rowsPerPage}
                page={page}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                heightOffset={{ trueOffset: 420, falseOffset: 357 }} // Configurable
              >
                <table
                  className="table table-responsive table-bordered "
                  style={{ marginTop: "-5px", padding: "0" }}
                >
                  <thead
                    className="text-center"
                    style={{
                      position: "sticky",
                      top: -1,
                      backgroundColor: "#ddd",
                      zIndex: 1,
                      padding: "0px",
                    }}
                  >
                    <tr style={{ width: "50px" }}>
                      <th className="tableHead widthDetails">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAllChange}
                        />
                      </th>
                      {columnVisibility.logo && (
                        <th className="tableHead">Logo</th>
                      )}
                      {columnVisibility.code && (
                        <th className="tableHead">
                          Code
                          <SortableColumn
                            column="Code_produit"
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.designation && (
                        <th className="tableHead">
                          Désignation
                          <SortableColumn
                            column="designation"
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.typeQuantite && (
                        <th className="tableHead">
                          Type de Quantité
                          <SortableColumn
                            column="type_quantite"
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.typeQuantite && (
                        <th className="tableHead">
                          Type de Produit
                          <SortableColumn
                            column="type"
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.marque && (
                        <th className="tableHead">
                          Marque
                          <SortableColumn
                            column="marque"
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.unite && (
                        <th className="tableHead">
                          Unité
                          <SortableColumn
                            column="unite"
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.seuilAlerte && (
                        <th className="tableHead">
                          Seuil d'alerte
                          <SortableColumn
                            column="seuil_alerte"
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.stockInitial && (
                        <th className="tableHead">
                          Stock initial
                          <SortableColumn
                            column="stock_initial"
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.etatProduit && (
                        <th className="tableHead">
                          État de produit
                          <SortableColumn
                            column="etat_produit"
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.calibre && (
                        <th className="tableHead">
                          Calibre
                          <SortableColumn
                            column="calibre.calibre"
                            bool={true}
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.prixVente && (
                        <th className="tableHead">
                          Prix vente
                          <SortableColumn
                            column="prix_produits_last.prixProduit"
                            bool={true}
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.tva && (
                        <th className="tableHead">
                          TVA
                          <SortableColumn
                            column="tva"
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.famille && (
                        <th className="tableHead">
                          Famille
                          <SortableColumn
                            column="categorie.categorie"
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            bool={true}
                          />
                        </th>
                      )}
                      {columnVisibility.type && (
                        <th className="tableHead">
                          Type
                          <SortableColumn
                            column="souscategorie.categorie"
                            bool={true}
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.type && (
                        <th className="tableHead">
                          Durée de vie
                          <SortableColumn
                            column="Dvie"
                            sortColumn={sortColumn}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                      )}
                      {columnVisibility.action && (
                        <th className="sticky-action-column tableHead">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {sortedData
                      .slice(
                        page * rowsPerPage - rowsPerPage,
                        page * rowsPerPage,
                      )
                      .map((produit) => (
                        <React.Fragment key={produit.id}>
                          <tr key={produit.id}>
                            <td style={{ backgroundColor: "white" }}>
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(produit.id)}
                                onChange={() =>
                                  handleCheckboxChange(produit.id)
                                }
                              />
                            </td>
                            {columnVisibility.logo && (
                              <td style={{ backgroundColor: "white" }}>
                                <img
                                  src={API_BASE_URL + produit.logoP}
                                  alt="Logo"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                  }}
                                />
                              </td>
                            )}
                            {columnVisibility.code && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit.Code_produit}
                              </td>
                            )}
                            {columnVisibility.designation && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit.designation}
                              </td>
                            )}
                            {columnVisibility.typeQuantite && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit.type_quantite}
                              </td>
                            )}
                            {columnVisibility.typeQuantite && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit.type === "P"
                                  ? "Production"
                                  : produit.type === "M"
                                    ? "MATIERE PREMIERE"
                                    : ""}
                              </td>
                            )}

                            {columnVisibility.marque && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit.marque || ""}
                              </td>
                            )}
                            {columnVisibility.unite && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit.unite || ""}
                              </td>
                            )}
                            {columnVisibility.seuilAlerte && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit.seuil_alerte || ""}
                              </td>
                            )}
                            {columnVisibility.stockInitial && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit.stock_initial || ""}
                              </td>
                            )}
                            {columnVisibility.etatProduit && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit.etat_produit || ""}
                              </td>
                            )}
                            {columnVisibility.calibre && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit.calibre ? produit.calibre.calibre : ""}
                              </td>
                            )}
                            {columnVisibility.prixVente && (
                              <td>
                                {" "}
                                {produit?.prix_produits_last?.prixProduit}
                                {produit?.prix_produits?.length > 0 && (
                                  <FontAwesomeIcon
                                    onClick={() =>
                                      toggleRowRepresantant(produit.id)
                                    } // Ajout de la fonction d'expansion
                                    icon={
                                      expandedRowsRepresantant.includes(
                                        produit.id,
                                      )
                                        ? faList
                                        : faList
                                    }
                                    style={{
                                      marginLeft: "10px",
                                      cursor: "pointer",
                                    }}
                                  />
                                )}
                              </td>
                            )}
                            {columnVisibility.tva && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit.tva || ""}
                              </td>
                            )}
                            {columnVisibility.famille && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit?.categorie?.categorie || ""}
                              </td>
                            )}
                            {columnVisibility.type && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit?.souscategorie?.categorie || ""}
                              </td>
                            )}
                            {columnVisibility.type && (
                              <td style={{ backgroundColor: "white" }}>
                                {produit?.Dvie || ""}
                              </td>
                            )}
                            {columnVisibility.action && (
                              <td
                                className="sticky-action-column"
                                style={{ backgroundColor: "white" }}
                              >
                                {/* Vérification de la permission pour l'édition */}
                                <FontAwesomeIcon
                                  onClick={
                                    permissions.includes("edit_product")
                                      ? () => handleEdit(produit, false)
                                      : null
                                  }
                                  icon={faEdit}
                                  style={{
                                    color: permissions.includes("edit_product")
                                      ? "#007bff"
                                      : "#b0bec5",
                                    cursor: permissions.includes("edit_product")
                                      ? "pointer"
                                      : "not-allowed",
                                  }}
                                />

                                <span style={{ margin: "0 8px" }}></span>

                                {/* Vérification de la permission pour la suppression */}
                                <FontAwesomeIcon
                                  onClick={
                                    permissions.includes("delete_product")
                                      ? () => handleDelete(produit.id)
                                      : null
                                  }
                                  icon={faTrash}
                                  style={{
                                    color: permissions.includes(
                                      "delete_product",
                                    )
                                      ? "#ff0000"
                                      : "#b0bec5",
                                    cursor: permissions.includes(
                                      "delete_product",
                                    )
                                      ? "pointer"
                                      : "not-allowed",
                                  }}
                                />
                              </td>
                            )}
                          </tr>
                          {expandedRowsRepresantant.includes(produit.id) && (
                            <tr>
                              <td colSpan="25" style={{ padding: "0" }}>
                                <table
                                  className="table table-responsive table-bordered"
                                  style={{
                                    marginTop: "0px",
                                    marginBottom: "0px",
                                  }}
                                >
                                  <thead>
                                    <tr>
                                      <th colSpan={40}>Détails Prix</th>
                                    </tr>
                                    <tr>
                                      <th className="ColoretableForm">Prix</th>
                                      <th className="ColoretableForm">
                                        Date de début
                                      </th>
                                      <th className="ColoretableForm">
                                        Date de fin
                                      </th>
                                      <th className="ColoretableForm">
                                        Type de Quantité
                                      </th>
                                      <th className="ColoretableForm">Unité</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {produit.prix_produits.map((repclient) => (
                                      <tr key={repclient.id}>
                                        <td>{repclient.prixProduit}</td>
                                        <td>{repclient.dateDebut}</td>
                                        <td>{repclient.dateFin || ""}</td>
                                        <td>
                                          {translateTypeQte(repclient.typeQte)}
                                        </td>
                                        <td>{repclient.Unite || ""}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </TableContainer>
            </div>
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
