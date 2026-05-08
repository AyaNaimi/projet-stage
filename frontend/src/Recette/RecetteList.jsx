import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../axiosInstance";
import Box from "@mui/material/Box";
import TableMui from "../components/TableMui";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import { Edit3, ArrowUp } from "lucide-react";
import ProductCarousel from "../components/ProductCarousel";
import AddButton from "../components/AddButton";
import FilterToggleButton from "../components/FilterToggleButton";
import RecetteForm from "./RecetteForm";
import Swal from "sweetalert2";
import IconButton from "@mui/material/IconButton";
import "../Produit/All.css";

const RecetteList = () => {
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [matierePremieres, setMatierePremieres] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('tout');
  const [sousCatFiltre, setSousCatFiltre] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [carouselSelectedProductId, setCarouselSelectedProductId] = useState('tout');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formContainerStyle, setFormContainerStyle] = useState({
    right: "-100%",
  });
  const [tableContainerStyle, setTableContainerStyle] = useState({
    marginRight: "0%",
    width: "100%"
  });

  const [formData, setFormData] = useState({
    id: null,
    designation: "",
    Code_produit: "",
    type_quantite: "K",
    recette: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { dynamicStyles } = useOpen();
  const { setTitle, searchQuery } = useHeader();

  useEffect(() => {
    setTitle("Gestion des Recettes");
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setTitle]);

  const fetchData = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const [prodRes, catRes, matRes] = await Promise.all([
        axiosInstance.get('/api/produits').catch(() => ({ data: {} })),
        axiosInstance.get('/api/categories').catch(() => ({ data: [] })),
        axiosInstance.get('/api/matiere-premieres').catch(() => ({ data: [] }))
      ]);
      const prodData = prodRes.data?.produit || prodRes.data;
      setProduits(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      const matData = matRes.data?.data || matRes.data;
      setMatierePremieres(Array.isArray(matData) ? matData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const safeSearchQuery = (searchQuery || '').toLowerCase();
    let filtered = produits.filter((p) =>
      p.designation?.toLowerCase().includes(safeSearchQuery) ||
      p.Code_produit?.toLowerCase().includes(safeSearchQuery)
    );

    if (selectedCategory && selectedCategory !== 'tout') {
      filtered = filtered.filter(p => p.categorie_id === parseInt(selectedCategory));
    }

    if (sousCatFiltre && sousCatFiltre !== 'tout') {
      filtered = filtered.filter(p => p.suCat_id === parseInt(sousCatFiltre));
    }

    setFilteredProduits(filtered);
  }, [produits, searchQuery, selectedCategory, sousCatFiltre]);

  const selectedProduct = (produits || []).find(p => p.id === parseInt(carouselSelectedProductId));
  const currentRecipeLines = selectedProduct?.recettes || [];

  const handleCategoryFilterChange = (catId) => {
    setSelectedCategory(catId);
    setSousCatFiltre(null);
  };

  const handleSousCategoryFilterChange = (catId) => {
    setSousCatFiltre(catId);
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedItems(currentRecipeLines.map(p => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleShowFormButtonClick = () => {
    if (carouselSelectedProductId && carouselSelectedProductId !== 'tout') {
      const prod = produits.find(p => p.id === parseInt(carouselSelectedProductId));
      if (prod) {
        handleEdit(prod);
      }
    } else {
      setFormData({
        id: null,
        designation: "",
        Code_produit: "",
        type_quantite: "K",
        recette: []
      });
      setErrors({});
      if (formContainerStyle.right === "-100%") {
        setFormContainerStyle({ right: "0", width: "50%" });
        setTableContainerStyle({ marginRight: "48%", width: "52%" });
      }
    }
  };

  const closeForm = () => {
    setFormContainerStyle({ right: "-100%" });
    setTableContainerStyle({ marginRight: "0", width: "100%" });
    setErrors({});
  };

  const handleEdit = (row) => {
    // If 'row' is a product (has recipes)
    if (row.recettes || row.id) {
      setFormData({
        ...row,
        recette: (row.recettes || []).map(r => ({
          id: r.id,
          matiere_premiere_id: r.matiere_premiere_id,
          quantite: r.quantite || 0,
          perte: r.perte || 0,
          unite: r.unite || r.matiere_premiere?.unite || 'K',
          quantite_reelle: r.quantite_reelle || (parseFloat(r.quantite || 0) * (1 + parseFloat(r.perte || 0) / 100)).toFixed(3)
        })) || []
      });
    }
    
    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0", width: "50%" });
      setTableContainerStyle({ marginRight: "48%", width: "52%" });
    }
  };

  const handleDeleteLine = (lineId) => {
    Swal.fire({
      title: "Supprimer cet ingrédient ?",
      text: "Voulez-vous retirer cette matière première de la recette ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/api/recettes/${lineId}`);
          fetchData();
          Swal.fire("Supprimé !", "L'ingrédient a été retiré.", "success");
        } catch (error) {
          Swal.fire("Erreur", "Une erreur est survenue.", "error");
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = formData.id ? `${baseUrl}/api/produits/${formData.id}` : `${baseUrl}/api/produits`;
    const method = formData.id ? "put" : "post";

    setLoading(true);
    try {
      // Pour les recettes, on envoie 'lines' au lieu de 'recette' car c'est ce que le backend attend souvent dans ces modules
      const payload = {
        ...formData,
        lines: formData.recette
      };
      await axiosInstance[method](url, payload);
      fetchData();
      closeForm();
      Swal.fire("Succès", `Fiche technique ${formData.id ? 'modifiée' : 'ajoutée'} avec succès.`, "success");
    } catch (error) {
      console.error("Submit error:", error);
      if (error.response && (error.response.status === 422 || error.response.status === 400)) {
        const backendErrors = error.response.data.errors || error.response.data.error || {};
        setErrors(backendErrors);
        
        // If it's a general error message as a string
        const message = typeof backendErrors === 'string' 
          ? backendErrors 
          : (error.response.data.message || "Veuillez vérifier les champs du formulaire.");
          
        Swal.fire("Erreur", message, "error");
      } else {
        const status = error.response ? error.response.status : 'Network/CORS';
        Swal.fire("Erreur", `Une erreur est survenue lors de l'enregistrement. (Code: ${status})`, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Supprimer la fiche technique ?",
      text: "Voulez-vous supprimer toute la composition de ce produit ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.put(`/api/produits/${id}`, { lines: [] });
          fetchData();
          Swal.fire("Supprimé !", "La fiche technique a été vidée.", "success");
        } catch (error) {
          Swal.fire("Erreur", "Une erreur est survenue.", "error");
        }
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const chunks = [];
  const itemsPerSlide = 4;
  const catWithTout = [{ id: 'tout', categorie: 'Tout' }, ...(categories || []).filter(c => c && c.idCatMer === null)];
  for (let i = 0; i < catWithTout.length; i += itemsPerSlide) {
    chunks.push(catWithTout.slice(i, i + itemsPerSlide));
  }

  const selectedCatData = (categories || []).find(c => c && c.id === parseInt(selectedCategory));
  const sousCategories = selectedCatData ? (categories || []).filter(c => c && c.idCatMer === selectedCatData.id) : [];
  const chunksSucat = [];
  const suCatWithTout = [{ id: 'tout', sous_categorie: 'Tout' }, ...sousCategories];
  for (let i = 0; i < suCatWithTout.length; i += itemsPerSlide) {
    chunksSucat.push(suCatWithTout.slice(i, i + itemsPerSlide));
  }

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    Swal.fire({
      title: "Supprimer la sélection ?",
      text: `Voulez-vous supprimer les ${selectedItems.length} ingrédients sélectionnés ?`,
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
            axiosInstance.delete(`/api/recettes/${id}`)
          ));
          fetchData();
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
        <ProductCarousel
          products={produits}
          selectedProductId={carouselSelectedProductId}
          onProductSelect={(id) => setCarouselSelectedProductId(id)}
        />

        <div
          className="container-d-flex justify-content-start"
          style={{ marginTop: "55px" }}
        >
            <RecetteForm
              show={formContainerStyle.right === "0"}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              errors={errors}
              loading={loading}
              matierePremieres={matierePremieres}
              produits={produits}
              closeForm={closeForm}
              formContainerStyle={formContainerStyle}
            />
          <TableMui
            columns={[
              {
                id: 'select',
                label: 'SÉLECTION',
                renderHeader: () => (
                  <input
                    type="checkbox"
                    checked={selectedItems.length === currentRecipeLines.length && currentRecipeLines.length > 0}
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
              { 
                id: 'matiere_premiere', 
                label: 'MATIÈRE PREMIÈRE', 
                minWidth: 200,
                render: (row) => row.matiere_premiere?.nom || row.matiere_premiere?.designation || 'Sans nom'
              },
              { id: 'quantite', label: 'QUANTITÉ', minWidth: 100 },
              { 
                id: 'unite', 
                label: 'UNITÉ', 
                minWidth: 100,
                render: (row) => {
                  const opts = { 'K': 'KG', 'G': 'Gramme', 'L': 'Litre', 'ML': 'Millilitre', 'U': 'Unité' };
                  return opts[row.unite] || row.unite || '-';
                }
              },
              { id: 'perte', label: 'PERTE (%)', minWidth: 100 },
              { 
                id: 'quantite_reelle', 
                label: 'QUANTITÉ RÉELLE', 
                minWidth: 150,
                render: (row) => (
                  <span style={{ fontWeight: 600 }}>{row.quantite_reelle || (parseFloat(row.quantite || 0) * (1 + parseFloat(row.perte || 0) / 100)).toFixed(3)}</span>
                )
              },
            ]}
            rows={currentRecipeLines}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={(e, newPage) => setPage(newPage)}
            handleChangeRowsPerPage={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            produitsFiltres={currentRecipeLines}
            hasActions={true}
            handleEdit={() => handleShowFormButtonClick()}
            handleDelete={(row) => handleDeleteLine(row.id)}
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
          />
        </div>
      </Box>
      {showScrollTop && (
        <IconButton
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            backgroundColor: '#86d9d4',
            color: 'white',
            width: 50,
            height: 50,
            '&:hover': { 
              backgroundColor: '#75c8c3',
              transform: 'scale(1.1)'
            },
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease'
          }}
        >
          <ArrowUp size={24} />
        </IconButton>
      )}
    </Box>
  );
};

export default RecetteList;
