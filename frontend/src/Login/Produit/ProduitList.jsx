import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import Swal from "sweetalert2";
import { Form, Button, Modal, DropdownButton, Col, Row } from "react-bootstrap";
import Navigation from "../Acceuil/Navigation";
import Search from "../Acceuil/Search";
import TablePagination from "@mui/material/TablePagination";
import ExportToPdfButton from "./exportToPdf";
import PrintList from "./PrintList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Carousel } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';



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
import { Autocomplete, Fab, TextField, Toolbar } from "@mui/material";
import { BsShop } from "react-icons/bs";
import { useOpen } from "../Acceuil/OpenProvider"; // Importer le hook personnalisé
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { deleteDataFromIndexedDB, getDataFromIndexedDB, storeDataInIndexedDB } from "../utils/indexedDBUtils";
import AddButton from "../components/AddButton";
import FilterToggleButton from "../components/FilterToggleButton";
import TableContainer from "../components/TableContainer";
import FamilleTypeCarousels from "../components/FamilleTypeCarousels";
import ProduitForm from "./ProduitForm";
import Header from "../components/Header";
import TableMui from "../components/TableMui";


const ProduitList = () => {
  const [produits, setProduits] = useState([]);
  const [user, setUser] = useState({});
  const [categories, setCategories] = useState([]);
  let isEdit = false;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProduitsByCategory, setFilteredProduitsByCategory] = useState(
    []
  );
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sousCatFiltre,setSousCatFilter]=useState(null)
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
  const tableHeaderStyle = {
    background: "#007bff",
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  };



  const [showForm, setShowForm] = useState(false);
  const [calibres, setCalibres] = useState([]);

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
   suCat_id:"",
   reference:"",
   produit_Embalg_S_id:'',
   // Ajout des nouveaux champs
   unite_etiquette: "",
   unite_embalage_primaire: "",
   unite_embalage_secondaire: "",
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
      const responseCalibre = await axiosInstance.get(`calibres`);
      setCalibres(responseCalibre.data);
      localStorage.setItem('calibres', JSON.stringify(responseCalibre.data));
      console.log("calibres", responseCalibre);
    } catch (error) {
      console.error("Error fetching calibres:", error);
    }
  };
  const [categories2, setCategories2] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`categories`);
      setCategories(response.data); // Met à jour le state avec les nouvelles catégories
      console.log('fetsh data')
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories(); // Cela pourrait être appelé lorsque le composant se monte
  }, []);
  const fetchProduits = async () => {
    try {
      const response = await axiosInstance.get(`produits`);
      setProduits(response.data.produit);
      // Store produits in IndexedDB
      await storeDataInIndexedDB(response.data.produit, 'produits');
      console.log('produit', response.data.produit);
  
      const usersResponse = await axiosInstance.get(`user`);
      const authenticatedUserId = usersResponse.data.id;
      setUser(authenticatedUserId);
      console.log("user authentifié", authenticatedUserId);
  
      const responseCategories = await axiosInstance.get(`categories`);
      setCategories(responseCategories.data);
      // Store categories in IndexedDB
      await storeDataInIndexedDB(responseCategories.data, 'famille');
      console.log('responseCategories.data123', responseCategories.data);
  
    } catch (error) {
      console.error("Error fetching products or user data:", error);
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Accès refusé",
          text: "Vous n'avez pas l'autorisation de voir la liste des produits.",
        });
      }
    }
  };
  
  console.log('categories2Produit',categories2)

console.log('cattest',)
useEffect(() => {
  const loadDataFromIndexedDB = async () => {
    try {
      // Check if data exists in IndexedDB for produits, calibres, and categories
      const storedProduits = await getDataFromIndexedDB('produits');
      const storedCategories = await getDataFromIndexedDB('famille');

      // Set the state if the data exists in IndexedDB
      if (storedProduits) setProduits(storedProduits);
      if (storedCategories) setCategories(storedCategories);

      // If the data doesn't exist in IndexedDB, fetch it from the API
        fetchProduits();  // Fetch products and categories from the API
      
        fetchCalibres();  // Fetch calibres if they are not in IndexedDB
      
    } catch (error) {
      console.error("Error loading data from IndexedDB:", error);
      fetchProduits();  // Fallback to API call if IndexedDB retrieval fails
    }
  };

  loadDataFromIndexedDB();
}, []);


  useEffect(() => {
    if (produits) {
      const filtered = produits.filter((produit) => {
        return Object.entries(produit).some(([key, value]) => {
          // Vérifiez les champs standards
          if (
            ["Code_produit", "designation", "type_quantite", "unite", "seuil_alerte", "stock_initial", "etat_produit", "prix_vente"].includes(key)
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
          if (key === "categorie" && produit.categorie && produit.categorie.categorie) {
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
    const savedRowsPerPage = localStorage.getItem('rowsPerPage');
    if (savedRowsPerPage) {
      setRowsPerPage(parseInt(savedRowsPerPage, 10));
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    console.log("Selected category:", selectedCategory);
    console.log("Produits:", produits);

    const filterProductsByCategory = (categoryId, sousCatFiltre) => {
      if (categoryId) {
        console.log("Filtering products by category:", categoryId);
        
        // Handle the case where 'categoryId' is 'tout'
        if (categoryId === 'tout') {
          setFilteredProduitsByCategory(filteredProduits); // Show all products
          return; // Exit the function early
        }
    
        let filtered = filteredProduits.filter(
          (produit) => produit.categorie_id === parseInt(categoryId)
        );
        console.log('sousCatFiltre', sousCatFiltre);
    
        // Handle the subcategory filter
        if (sousCatFiltre) {
          if (sousCatFiltre === 'tout') {
            // If 'tout' is selected for subcategory, display all products in the category
            setFilteredProduitsByCategory(filtered);
            return;
          }
    
          // Otherwise, filter by the specific subcategory
          const filteredSuCat = filtered.filter(
            (produit) => produit.suCat_id === parseInt(sousCatFiltre)
          );
    
          if (filteredSuCat.length === 0) {
            console.log("No products found for this subcategory");
            setFilteredProduitsByCategory([]); // Show empty table/message
          } else {
            console.log("Filtered products by subcategory:", filteredSuCat);
            setFilteredProduitsByCategory(filteredSuCat);
          }
    
        } else {
          console.log('filtered', filtered);
          
          if (filtered.length === 0) {
            console.log("No products found for this category");
            setFilteredProduitsByCategory([]); // Show empty table/message
          } else {
            console.log("Filtered products:", filtered);
            setFilteredProduitsByCategory(filtered); // Show filtered products
          }
        }
    setPage(1)
      } else {
        console.log("No category selected, displaying all products");
        setFilteredProduitsByCategory(filteredProduits); // Show all products
      }
    };
    

    // Call the function to filter products by category
    filterProductsByCategory(selectedCategory,sousCatFiltre);
  }, [selectedCategory, filteredProduits,sousCatFiltre]);

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
    localStorage.setItem('rowsPerPage', selectedRows);  // Store in localStorage
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
    }).then((result) => {
      if (result.isConfirmed) {
        selectedItems.forEach((id) => {
          axios
            .delete(`produits/${id}`)
            .then((response) => {
              fetchProduits();
             deleteDataFromIndexedDB('produits',id)
             
            })
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "produit supprimé avec succès.",
            })
            .catch((error) => {
              console.error("Error deleting product:", error);
              if (error.response && error.response.status === 403) {
                Swal.fire({
                  icon: "error",
                  title: "Accès refusé",
                  text: "Vous n'avez pas l'autorisation de supprimer ce produit.",
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error!",
                  text: "Échec de la suppression du produit.",
                });
              }
            });
        });
      }
    });
    setSelectedItems([]);
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
          .delete(`produits/${id}`)
          .then((response) => {
            fetchProduits();
            deleteDataFromIndexedDB('produits',id)

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
                  text: error.response.data.error
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
    setShowForm(false); // Hide the form
    setFormData({
      logoP:"",
        marque: "Ovotec",

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
      suCat_id:"",
       reference:"",
       produit_Embalg_S_id:"",
       // Réinitialiser les nouveaux champs
       unite_etiquette: "",
       unite_embalage_primaire: "",
       unite_embalage_secondaire: "",
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
      // Réinitialiser les nouveaux champs
      unite_etiquette: "",
      unite_embalage_primaire: "",
      unite_embalage_secondaire: "",
    });

    setSelectedProductsDataRep([]);
    setEditingProduit(null); // Clear editing client
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
      suCat_id:produit.suCat_id,
      genre:produit.genre,
      Dvie:produit.Dvie,
      produit_Etiq_id:produit.produit_Etiq_id,
      produit_Embalg_id:produit.produit_Embalg_id,
      produit_Embalg_S_id:Number(produit.produit_Embalg_S_id),


      type_produit:produit.type,
 reference:produit.reference,

      // Remplir les nouveaux champs
      unite_etiquette: produit.unite_etiquette || "",
      unite_embalage_primaire: produit.unite_embalage_primaire || "",
      unite_embalage_secondaire: produit.unite_embalage_secondaire || "",


    });
    setSelectedProductsDataRep(produit?.prix_produits?.map(prix => ({ 
       id:prix.id,
       date_debut: prix.dateDebut,
       date_fin: prix.dateFin,
       type: prix.typeQte,
       unite: prix.Unite,
      prixProduit: prix.prixProduit })));
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
    const errors = {};
  
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
  
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();



    const newErrors = validateForm(formData); // Valide les données du formulaire

    // Si des erreurs sont présentes, mettez-les dans l'état et ne soumettez pas le formulaire
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({});
      }, 3000);
      return;
    }

    Swal.fire({
      title: 'Traitement en cours...',
      text: 'Veuillez patienter pendant le traitement de votre demande',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
          Swal.showLoading();
      }
  });
    const url = editingProduit
      ? `produits/${editingProduit.id}`
      : `produits`;
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
        genre: formData.genre,
        type: formData.type_produit,
        Dvie: formData.Dvie,
        reference: formData.reference,


        produit_Embalg_id: formData.produit_Embalg_id,
        produit_Embalg_S_id: formData.produit_Embalg_S_id,

        produit_Etiq_id: formData.produit_Etiq_id,

        categorie_id: formData.categorie_id,
        suCat_id: formData.suCat_id,
        // Ajout des nouveaux champs
        unite_etiquette: formData.unite_etiquette,
        unite_embalage_primaire: formData.unite_embalage_primaire,
        unite_embalage_secondaire: formData.unite_embalage_secondaire,

        prixProduits: selectedProductsDataRep.map(prix => ({
          id:prix.id||null,
          dateDebut: prix.date_debut,
          dateFin: prix.date_fin,
          prixProduit: prix.prixProduit,
          typeQte: formData.type_quantite==='kg'?'K':formData.type_quantite==='litre'?'L':formData.type_quantite==='unite'?'U': prix.type,
          Unite: prix.unite
      }))
      };
      console.log('requestData',requestData)
      if (formData.logoP) {
        setMessage('Please select a file before submitting.');
          const formData2 = new FormData();
    formData2.append('logoP', formData.logoP);

    try {
        const response = await fetch(`produit/${editingProduit.id}/update-logo`, {
            method: 'POST',
            body: formData2, // Corrected to send formData2
        });

        // Ensure the response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();

            if (response.ok) {
                setMessage('Logo updated successfully!');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } else {
            const errorText = await response.text();
            setMessage('Unexpected error occurred');
            console.error('Server response:', errorText);
        }
    } catch (error) {
        setMessage('Error uploading the logo.');
        console.error(error);
    }
    }

    // Create a FormData object and append the file
  
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
      formDatad.append("categorie_id", formData.categorie_id);
      formDatad.append("suCat_id", formData.suCat_id);
      formDatad.append("genre", formData.genre);
      formDatad.append("type", formData.type_produit);
      formDatad.append("Dvie", formData.Dvie);
      formDatad.append("reference", formData.reference);


      formDatad.append("produit_Etiq_id", formData.produit_Etiq_id);
      formDatad.append("produit_Embalg_id", formData.produit_Embalg_id);
      formDatad.append("produit_Embalg_S_id", formData.produit_Embalg_S_id);


      // Ajout des nouveaux champs
      formDatad.append("unite_etiquette", formData.unite_etiquette);
      formDatad.append("unite_embalage_primaire", formData.unite_embalage_primaire);
      formDatad.append("unite_embalage_secondaire", formData.unite_embalage_secondaire);


      if (formData.logoP) {
        formDatad.append("logoP", formData.logoP);
      }
      if (selectedProductsDataRep && Array.isArray(selectedProductsDataRep)) {
        selectedProductsDataRep.forEach((prix, index) => {
          formDatad.append(`prixProduits[${index}][dateDebut]`, prix.date_debut||'');
          formDatad.append(`prixProduits[${index}][dateFin]`, prix.date_fin||'');
          formDatad.append(`prixProduits[${index}][prixProduit]`, prix.prixProduit||'');
          formDatad.append(`prixProduits[${index}][typeQte]`, formData.type_quantite==='kg'?'K':formData.type_quantite==='litre'?'L':formData.type_quantite==='unite'?'U':prix.type);
          formDatad.append(`prixProduits[${index}][Unite]`, prix.unite||'');

        });
      }
      requestData = formDatad;
      console.log(requestData)
    }

    try {
      const response = await axios({
        method: method,
        url: url,
        data: requestData,

      });
  

  console.log('response',response)
      // Le reste de votre code pour le message de succès, etc.
      fetchProduits();
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
        suCat_id:"",
        genre:'',
         reference:"",
         produit_Embalg_S_id:''
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
        const serverErrors = error.response.data.error;
        console.log(error)
        setErrors({
          logoP: serverErrors.logoP ? serverErrors.logoP[0] : "",
          Code_produit: serverErrors.Code_produit ? serverErrors.Code_produit[0] : "",
          designation: serverErrors.designation ? serverErrors.designation[0] : "",
          calibre_id: serverErrors.calibre_id ? serverErrors.calibre_id[0] : "",
          type_quantite: serverErrors.type_quantite ? serverErrors.type_quantite[0] : "",
          unite: serverErrors.unite ? serverErrors.unite[0] : "",
          seuil_alerte: serverErrors.seuil_alerte ? serverErrors.seuil_alerte[0] : "",
          stock_initial: serverErrors.stock_initial ? serverErrors.stock_initial[0] : "",
          etat_produit: serverErrors.etat_produit ? serverErrors.etat_produit[0] : "",
          marque: serverErrors.marque ? serverErrors.marque[0] : "",
          categorie_id: serverErrors.categorie_id ? serverErrors.categorie_id[0] : "",
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
      return type; // Retourne la valeur par défaut si aucune correspondance
  }
};

  //------------------------- fournisseur export to excel ---------------------//


const [cat,setCat]=useState([])
const handleDeletecatgeorie = async (categorieId) => {
  try {
    await axiosInstance.delete(`categories/${categorieId}`);
    
    // Notification de succès
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: " supprimée avec succès.",
    });
    await fetchCategories(); // Refresh categories after adding

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

  console.log('cat',cat)
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
    setCategorie(categorieId.categorie)
    setShowEditModal(true);
  };
  const handleEditClibre = (categorieId) => {
    setSelectedCategoryId(categorieId);
    setCategorie(categorieId.categorie)
    setShowEditClibreModal(true);
  };
  const handleEditSousCategorie = (categorieId) => {
    setSelectedCategoryId(categorieId);
    setCategorie(categorieId.categorie)
    setShowEditSousModal(true);
  };
  const [idSucategorie,setIdSucategorie] = useState(null); // State for
  const handleSuCategorie = (categorieId) => {
    setIdSucategorie(categorieId);
    setShowSuModal(true);
  };
console.log('selectedCategoryId',selectedCategoryId,categorieId)
const handleImageChange = (e) => {
  setImage(e.target.files[0]); // Update the image state
};


const handleSave = async () => {

console.log('image',selectedCategoryId.categorie,image )
  try {
    const formData = new FormData();
    formData.append("_method", 'put'); // Note : Vous n'avez peut-être pas besoin de cette ligne si vous utilisez une méthode PUT directement
    formData.append("categorie", selectedCategoryId.categorie);
    formData.append("logoP", newCategory.imageFile);
    await axiosInstance.post(`categories/${selectedCategoryId.id}`,
      formData
    );
    fetchCategories(); // Refresh the categories list
    setShowEditModal(false)
    setShowEditSousModal(false)
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

  console.log('image',selectedCategoryId.categorie,image )
    try {
      await axiosInstance.put(`calibres/${selectedCategoryId.id}`,
        {
          calibre:selectedCategoryId.calibre,
        }
      );
      await         fetchCalibres();
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

const [newCategory, setNewCategory] = useState({ categorie: "", imageFile: null });


const handleAddCategory = async () => {
  try {
    const formData = new FormData();
    formData.append("categorie", newCategory.categorie);
    formData.append("logoP", newCategory.imageFile);

    const response = await axiosInstance.post(`categories`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);
    await fetchCategories(); // Refresh categories after adding
    setShowAddCategory(false);
    Swal.fire({
                icon: "success",
                title: "Succès!",
                text: " ajoutée avec succès.",
              }); // Hide the modal after success
  } catch (error) {
    console.error("Error adding category:", error);
  }
};
const handleAddSousCategory = async () => {
  try {
    console.log('idSucategorie',idSucategorie)

    const formData = new FormData();
    formData.append("categorie", newCategory.categorie);
    formData.append("idCatMer", idSucategorie);

    formData.append("logoP", newCategory.imageFile);

    const response = await axiosInstance.post(`categories`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);
    await fetchCategories(); // Refresh categories after adding
    setShowAddCategory(false);
    Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "ajoutée avec succès.",
              }); // Hide the modal after success
  } catch (error) {
    console.error("Error adding category:", error);
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
      console.log('idSucategorie',idSucategorie)
  
      const formData = new FormData();
      formData.append("calibre", newCategory.categorie);

  
      const response = await axiosInstance.post(`calibres`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log(response.data);
      await         fetchCalibres();
      // Refresh categories after adding
      setShowAddCalibre(false);
      Swal.fire({
                  icon: "success",
                  title: "Succès!",
                  text: "ajoutée avec succès.",
                }); // Hide the modal after success
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
  const chunks = chunkArray(categories.filter((cat)=>cat.idCatMer===null), chunkSize);
  const chunksSucat = chunkArray(categories.filter((cat)=>cat.idCatMer!==null && cat.idCatMer===selectedCategory), chunkSize);

  console.log('categori1',categories)
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndexSuCat, setActiveIndexSuCat] = useState(0);


  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };
  const handleSelectSousCat = (selectedIndex) => {
    setActiveIndexSuCat(selectedIndex);
  };
console.log('formData',formData)
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

  const tableRows = filteredProduitsByCategory.map((produit) => [
    produit.logoP,
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
    }))
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
            ${filteredProduitsByCategory.map(produit => `
              <tr>
                <td>${produit.logoP ? `<img src="${produit.logoP}" alt="Logo" style="width:50px;height:50px;border-radius:50%"/>` : ''}</td>
                <td>${produit.Code_produit}</td>
                <td>${produit.designation}</td>
                <td>${produit.type_quantite}</td>
                <td>${produit.marque || ''}</td>
                <td>${produit.unite || ''}</td>
                <td>${produit.seuil_alerte || ''}</td>
                <td>${produit.stock_initial || ''}</td>
                <td>${produit.etat_produit || ''}</td>
                <td>${produit.calibre ? produit.calibre.calibre : ''}</td>
                <td>${produit.prix_vente || ''}</td>
                <td>${produit.categorie.categorie || ''}</td>
                <td>${produit.souscategorie?.categorie || ''}</td>
               
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write(tableHTML);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};


const [genreFiltre, setGenreFiltre] = useState("");

// Fonction pour filtrer les produits
const produitsFiltres = filteredProduitsByCategory.filter((produit) =>
    genreFiltre ? produit.genre === genreFiltre : true,
);
console.log(produitsFiltres)

const handleAddEmptyRowRep = () => {
  setSelectedProductsDataRep([...selectedProductsDataRep, {}]);
  console.log("selectedProductDatarap", selectedProductsDataRep);
};
const handleInputChangeRep = (index, field, value) => {
  const updatedProducts = [...selectedProductsDataRep];
  updatedProducts[index][field] = value;
  let newErrors = {...errors};
  if (field === 'agent_id' && value === '') {
    newErrors.representant = 'Le représentant est obligatoire.';
  } else {
    newErrors.representant = '';
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
        .delete(`prixProduit/${id}`)
        .then(() => {
          fetchProduits();
        });
    }
  } else if (result.isDenied) {
    Swal.fire("Suppression annulée", "", "info");
  }
};
console.log('rep',selectedProductsDataRep)
const toggleRowRepresantant = (id) => {
  setExpandedRowsRepresantant((prev) => 
    prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
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
  { key: 'logo', label: 'Logo' },
  { key: 'code', label: 'Code' },
  { key: 'designation', label: 'Désignation' },
  { key: 'typeQuantite', label: 'Type de Quantité' },
  { key: 'marque', label: 'Marque' },
  { key: 'unite', label: 'Unité' },
  { key: 'seuilAlerte', label: 'Seuil d\'alerte' },
  { key: 'stockInitial', label: 'Stock initial' },
  { key: 'etatProduit', label: 'État de produit' },
  { key: 'calibre', label: 'Calibre' },
  { key: 'prixVente', label: 'Prix vente' },
  { key: 'famille', label: 'Famille' },
  { key: 'type', label: 'Type' },
];

// Toggle visibility of columns
const toggleColumnVisibility = (column) => {
  setColumnVisibility((prevState) => {
    const newVisibility = { ...prevState, [column]: !prevState[column] };
    // Save the updated column visibility to localStorage
    localStorage.setItem('columnVisibilityProduit', JSON.stringify(newVisibility));
    return newVisibility;
  });
};

// Load visibility state from localStorage
useEffect(() => {
  const savedVisibility = JSON.parse(localStorage.getItem('columnVisibilityProduit'));
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
      famille: true,
      type: true,
      action: true,
    });
  }
}, []); // Empty dependency array ensures this runs only once on mount
 const [showFilters, setShowFilters] = useState(false);

  const [animation, setAnimation] = useState('');

const toggleFilters = () => {
setShowFilters((prev) => !prev);
};
// Multi-detail state for TableMui
const [openDetails, setOpenDetails] = useState({});
const toggleDetail = (rowId, section) => {
  setOpenDetails(prev => ({
    ...prev,
    [rowId]: {
      ...(prev[rowId] || {}),
      [section]: !((prev[rowId] || {})[section])
    }
  }));
};
  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{...dynamicStyles  }}>
      <Header
  nom="Liste des Produits"
  handleSearch={handleSearch}
  printTable={printTable}
  exportToPDF={exportToPDF}
  exportToExcel={exportToExcel}
/>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 0}}>
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

          <div className="container-d-flex justify-content-start" style={{marginTop:'55px'}}>
         
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
            
  {/* Bouton Ajouter Produits */}

  {/* Bouton Ajouter Produits à droite */}

  {/* <AddButton
  onClick={() => handleShowFormButtonClick(false)}
  // requiredPermission={'create_product'}
  text="Ajouter Produits"
  align="right"
  filtre={
    <FilterToggleButton
      showFilters={showFilters} 
      toggleFilters={toggleFilters}     
      align="right"
    />
  }
/> */}
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
    ...[
      {
        id: 'logo',
        label: 'Logo',
        minWidth: 60,
        render: (row) => (
          <img
            src={row.logoP && row.logoP !== '' && row.logoP !== null && row.logoP !== undefined
              ? row.logoP
              : '../../public/images/bayd.jpg'}
            alt="Logo"
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        ),
      },
      { id: 'Code_produit', label: 'Code', minWidth: 80 },
      { id: 'designation', label: 'Désignation', minWidth: 120 },
      { id: 'reference', label: 'Référence', minWidth: 100 },
      { id: 'type_quantite', label: 'Type de Quantité', minWidth: 100 },
      {
        id: 'type',
        label: 'Type de Produit',
        minWidth: 100,
        render: (row) => row.type === 'P' ? 'Production' : row.type === 'M' ? 'MATIERE PREMIERE' : '',
      },
      { id: 'marque', label: 'Marque', minWidth: 80 },
      { id: 'unite', label: 'Unité', minWidth: 80 },
      { id: 'seuil_alerte', label: "Seuil d'alerte", minWidth: 80 },
      { id: 'stock_initial', label: 'Stock initial', minWidth: 80 },
      { id: 'etat_produit', label: 'État de produit', minWidth: 80 },
      {
        id: 'calibre',
        label: 'Calibre',
        minWidth: 80,
        render: (row) => row.calibre ? row.calibre.calibre : '',
      },
      {
        id: 'prix_produits_last',
        label: 'Prix vente',
        minWidth: 80,
        detailSection: 'prix',
        render: (row, { toggleDetail, openDetail }) => (
  <>
    {row?.prix_produits_last?.prixProduit}
    {row?.prix_produits?.length > 0 && (
      <FontAwesomeIcon
        onClick={toggleDetail}
        icon={openDetail ? faList : faList}
        style={{ marginLeft: '10px', cursor: 'pointer', color: openDetail ? '#1976d2' : '#888' }}
        title={openDetail ? 'Masquer le détail' : 'Afficher le détail'}
      />
    )}
  </>
)
      },
      {
        id: 'categorie',
        label: 'Famille',
        minWidth: 100,
        render: (row) => row?.categorie?.categorie || '',
      },
      {
        id: 'souscategorie',
        label: 'Type',
        minWidth: 100,
        render: (row) => row?.souscategorie?.categorie || '',
      },
      { id: 'Dvie', label: 'Durée de vie', minWidth: 80 },
      {
        id: 'etiquette',
        label: 'Etiquette',
        minWidth: 100,
        render: (row) => row?.etiquette?.designation || '',
      },
      {
        id: 'embalge_s',
        label: 'Embalage secondaire',
        minWidth: 100,
        render: (row) => row?.embalge_s?.designation || '',
      },
      {
        id: 'embalge',
        label: 'Embalage primaire',
        minWidth: 100,
        render: (row) => row?.embalge?.designation || '',
      },
      { id: 'unite_etiquette', label: 'Unité Etiquette', minWidth: 80 },
      { id: 'unite_embalage_primaire', label: 'Unité Emballage Primaire', minWidth: 80 },
      { id: 'unite_embalage_secondaire', label: 'Unité Emballage Secondaire', minWidth: 80 },
    ],
  ]}
  rows={produitsFiltres.slice(page * rowsPerPage - rowsPerPage, page * rowsPerPage)}
  maxHeight={650}
  hasActions={true}
  handleEdit={handleEdit}
  handleDelete={handleDelete}
  openDetails={openDetails}
  toggleDetail={toggleDetail}
  renderDetail={(row, rowOpenDetails, toggleDetail) =>
    row.prix_produits && row.prix_produits.length > 0 && rowOpenDetails?.prix ? (
      <table className="table table-responsive table-bordered" style={{ marginTop: '0px', marginBottom: '0px',padding: '0px' }}>
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
              <td>{repclient.dateFin || ''}</td>
              <td>{translateTypeQte(repclient.typeQte)}</td>
              <td>{repclient.Unite || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : null
  }
  showFilters={showFilters}
  selectedItems={selectedItems}
  handleDeleteSelected={handleDeleteSelected}
  produitsFiltres={produitsFiltres}
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
      initial={{ opacity: 0, y: -20 }} // Start state
      animate={{ opacity: 1, y: 0 }} // Animation state
      exit={{ opacity: 0, y: -20 }} // Exit state
      transition={{ duration: 0.5 }} // Duration of the animation
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end', // Align to the right
        marginTop: '0px',
        maxWidth: '100%',
        padding: '0 20px', // Added padding for better spacing
      }}
    >
      {/* Genre Filter */}
      <div
        className="date-filter-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          marginRight: '20px', // Right margin for spacing
          marginBottom:'10px'
        }}
      >
        <Form.Select
          aria-label="Select genre"
          value={genreFiltre}
          onChange={(e) => setGenreFiltre(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '12px',
            width: '150px',
            marginTop: '-17px',
          }}
        >
          <option value="">Genre</option>
          <option value="vente">Vente</option>
          <option value="achat">Achat</option>
          <option value="venteachat">Vente & Achat</option>
        </Form.Select>
      </div>

      {/* Column Visibility Dropdown */}
    
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
