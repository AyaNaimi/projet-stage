import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../axiosInstance";
import Box from "@mui/material/Box";
import TableMui from "../components/TableMui";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import { Edit3 } from "lucide-react";
import FamilleTypeCarousels from "../components/FamilleTypeCarousels";
import AddButton from "../components/AddButton";
import FilterToggleButton from "../components/FilterToggleButton";
import RecetteForm from "./RecetteForm";
import Swal from "sweetalert2";
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

  const { dynamicStyles } = useOpen();
  const { setTitle, searchQuery } = useHeader();

  useEffect(() => {
    setTitle("Nomenclatures / Fiches Techniques");
  }, [setTitle]);

  const fetchData = async () => {
    try {
      const baseUrl = `http://${import.meta.env.VITE_API_URL}`;
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

  const handleCategoryFilterChange = (catId) => {
    setSelectedCategory(catId);
    setSousCatFiltre(null);
  };

  const handleSousCategoryFilterChange = (catId) => {
    setSousCatFiltre(catId);
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredProduits.map(p => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleShowFormButtonClick = () => {
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
    } else {
      closeForm();
    }
  };

  const closeForm = () => {
    setFormContainerStyle({ right: "-100%" });
    setTableContainerStyle({ marginRight: "0", width: "100%" });
    setErrors({});
  };

  const handleEdit = (row) => {
     setFormData({
        id: row.id,
        designation: row.designation || "",
        Code_produit: row.Code_produit || "",
        type_quantite: row.type_quantite || "K",
        recette: row.recettes?.map(r => ({
          id: r.id,
          matiere_premiere_id: r.matiere_premiere_id,
          quantite: r.quantite,
          perte: r.perte,
          unite: r.matiere_premiere?.unite || 'K'
        })) || []
     });
     if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0", width: "50%" });
      setTableContainerStyle({ marginRight: "48%", width: "52%" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = `http://${import.meta.env.VITE_API_URL}`;
    const url = formData.id ? `${baseUrl}/api/produits/${formData.id}` : `${baseUrl}/api/produits`;
    const method = formData.id ? "put" : "post";

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
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        Swal.fire("Erreur", "Une erreur est survenue lors de l'enregistrement.", "error");
      }
    }
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

  const noop = () => {};

  return (
    <Box sx={{ ...dynamicStyles }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '60px' }}>
        <FamilleTypeCarousels
          activeIndex={0}
          handleSelect={noop}
          chunks={chunks}
          selectedCategory={selectedCategory}
          handleCategoryFilterChange={handleCategoryFilterChange}
          activeIndexSuCat={0}
          handleSelectSousCat={noop}
          chunksSucat={chunksSucat}
          sousCatFiltre={sousCatFiltre}
          handleSousCategoryFilterChange={handleSousCategoryFilterChange}
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
            matierePremieres={matierePremieres}
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
                    checked={selectedItems.length === filteredProduits.length && filteredProduits.length > 0}
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
              { id: 'Code_produit', label: 'CODE', minWidth: 100 },
              { id: 'designation', label: 'DÉSIGNATION', minWidth: 200 },
              { 
                id: 'unite', 
                label: 'UNITÉ', 
                minWidth: 100,
                render: (row) => row.type_quantite === 'K' ? 'KG' : (row.type_quantite === 'L' ? 'Litre' : 'Unité')
              },
              { 
                id: 'nb_ingredients', 
                label: 'INGRÉDIENTS', 
                minWidth: 120,
                render: (row) => row.recettes?.length || 0
              },
              { 
                id: 'unit_cost', 
                label: 'COÛT MATIÈRE', 
                minWidth: 150,
                render: (row) => (
                  <span style={{ fontWeight: 600, color: '#00afaa' }}>
                    {row.unit_cost || 0} DH
                  </span>
                )
              },
              {
                id: 'actions',
                label: 'ACTIONS',
                minWidth: 100,
                render: (row) => (
                  <button
                    onClick={() => handleEdit(row)}
                    style={{
                      background: '#00afaa',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit3 size={16} /> Configurer
                  </button>
                )
              }
            ]}
            rows={filteredProduits}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={(e, newPage) => setPage(newPage)}
            handleChangeRowsPerPage={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            produitsFiltres={filteredProduits}
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

export default RecetteList;
