
import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../axiosInstance";
import Box from "@mui/material/Box";
import TableMui from "../components/TableMui";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import { Edit3, Clock } from "lucide-react";
import ProductCarousel from "../components/ProductCarousel";
import AddButton from "../components/AddButton";
import FilterToggleButton from "../components/FilterToggleButton";
import ChargeDirecteForm from "./ChargeDirecteForm";
import Swal from "sweetalert2";
import "../Produit/All.css";

const ChargeDirecteList = () => {
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('tout');
  const [sousCatFiltre, setSousCatFiltre] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [carouselSelectedProductId, setCarouselSelectedProductId] = useState('tout');
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
    cout_horaire_mod: 0,
    temps_production: 0
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { dynamicStyles } = useOpen();
  const { setTitle, searchQuery } = useHeader();

  useEffect(() => {
    setTitle("Gestion des Charges Directes");
  }, [setTitle]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosInstance.get('/api/produits').catch(() => ({ data: {} })),
        axiosInstance.get('/api/categories').catch(() => ({ data: [] }))
      ]);
      const prodData = prodRes.data?.produit || prodRes.data;
      setProduits(Array.isArray(prodData) ? prodData : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
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
  const currentProductData = selectedProduct ? [selectedProduct] : filteredProduits;

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
    if (carouselSelectedProductId && carouselSelectedProductId !== 'tout') {
      if (selectedProduct) {
        handleEdit(selectedProduct);
      }
    } else {
      setFormData({
        id: null,
        designation: "",
        Code_produit: "",
        cout_horaire_mod: 0,
        temps_production: 0
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
    setFormData({
       id: row.id,
       designation: row.designation || "",
       Code_produit: row.Code_produit || "",
       cout_horaire_mod: row.cout_horaire_mod || 0,
       temps_production: row.temps_production || 0
    });
    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0", width: "50%" });
      setTableContainerStyle({ marginRight: "48%", width: "52%" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = formData.id ? `/api/produits/${formData.id}` : `/api/produits`;
    const method = formData.id ? "put" : "post";

    setLoading(true);
    try {
      await axiosInstance[method](url, formData);
      fetchData();
      closeForm();
      Swal.fire("Succès", `Charges directes ${formData.id ? 'modifiées' : 'enregistrées'} avec succès.`, "success");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        Swal.fire("Erreur", "Une erreur est survenue lors de l'enregistrement.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Réinitialiser ?",
      text: "Voulez-vous réinitialiser les charges directes pour ce produit ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, réinitialiser",
      cancelButtonText: "Annuler"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.put(`/api/produits/${id}`, { cout_horaire_mod: 0, temps_production: 0 });
          fetchData();
          Swal.fire("Réinitialisé !", "Les charges ont été remises à zéro.", "success");
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
      title: "Réinitialiser la sélection ?",
      text: `Voulez-vous réinitialiser les charges directes pour les ${selectedItems.length} produits sélectionnés ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, réinitialiser",
      cancelButtonText: "Annuler"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // On fait un appel groupé ou plusieurs appels. Pour rester simple, on peut faire un endpoint bulk update si besoin, 
          // mais ici on va utiliser une boucle ou un endpoint existant s'il existe.
          // Le ProduitController a une méthode update.
          await Promise.all(selectedItems.map(id => 
            axiosInstance.put(`/api/produits/${id}`, { cout_horaire_mod: 0, temps_production: 0 })
          ));
          fetchData();
          setSelectedItems([]);
          Swal.fire("Réinitialisé !", "Les charges ont été remises à zéro.", "success");
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
          <ChargeDirecteForm
            show={formContainerStyle.right === "0"}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            errors={errors}
            loading={loading}
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
                id: 'mod', 
                label: 'MOD / H', 
                minWidth: 120,
                render: (row) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} color="#666" />
                    {row.cout_horaire_mod || 0} DH
                  </div>
                )
              },
              { 
                id: 'temps', 
                label: 'TEMPS (MIN)', 
                minWidth: 120,
                render: (row) => row.temps_production || 0
              },
              { 
                id: 'total_mod', 
                label: 'COÛT MOD UNIT.', 
                minWidth: 150,
                render: (row) => {
                  const cost = ((row.cout_horaire_mod || 0) * (row.temps_production || 0)) / 60;
                  return <span style={{ fontWeight: 600 }}>{cost.toFixed(2)} DH</span>;
                }
              },
            ]}
            rows={currentProductData}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={(e, newPage) => setPage(newPage)}
            handleChangeRowsPerPage={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            produitsFiltres={currentProductData}
            hasActions={true}
            handleEdit={handleEdit}
            handleDelete={(row) => handleDelete(row.id)}
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
    </Box>
  );
};

export default ChargeDirecteList;
/*
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import Box from "@mui/material/Box";
import TableMui from "../components/TableMui";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import { Clock, Layers, Package } from "lucide-react";
import ProductCarousel from "../components/ProductCarousel";
import AddButton from "../components/AddButton";
import FilterToggleButton from "../components/FilterToggleButton";
import ChargeDirecteForm from "./ChargeDirecteForm";
import Swal from "sweetalert2";
import "../Produit/All.css";

const ChargeDirecteList = () => {
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('tout');
  const [sousCatFiltre, setSousCatFiltre] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [carouselSelectedProductId, setCarouselSelectedProductId] = useState('tout');
  
  // Rendre le formulaire visible par défaut (A droite)
  const [formContainerStyle, setFormContainerStyle] = useState({ right: "0", width: "42%" });
  const [tableContainerStyle, setTableContainerStyle] = useState({ marginRight: "40%", width: "58%" });

  const [formData, setFormData] = useState({
    id: null,
    designation: "",
    Code_produit: "",
    cout_horaire_mod: 0,
    temps_production: 0
  });
  const [loading, setLoading] = useState(false);

  const { dynamicStyles } = useOpen();
  const { setTitle, searchQuery } = useHeader();

  useEffect(() => {
    setTitle("Gestion des Charges Directes");
  }, [setTitle]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosInstance.get('/api/produits').catch(() => ({ data: {} })),
        axiosInstance.get('/api/categories').catch(() => ({ data: [] }))
      ]);
      const prodData = prodRes.data?.produit || prodRes.data;
      const dataArray = Array.isArray(prodData) ? prodData : [];
      setProduits(dataArray);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);

      // Sélectionner par défaut le premier produit s'il y en a
      if (dataArray.length > 0 && !formData.id) {
        handleEdit(dataArray[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Déclencher le changement de produit depuis le Carousel du haut
  useEffect(() => {
    if (carouselSelectedProductId && carouselSelectedProductId !== 'tout') {
      const prod = produits.find(p => p.id === parseInt(carouselSelectedProductId));
      if (prod) handleEdit(prod);
    }
  }, [carouselSelectedProductId, produits]);

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
  const currentProductData = selectedProduct ? [selectedProduct] : filteredProduits;

  const handleShowFormButtonClick = () => {
    if (selectedProduct) {
      handleEdit(selectedProduct);
    }
  };

  const closeForm = () => {
    // Garder ouvert ou réinitialiser sans fermer complètement le panneau
    setFormContainerStyle({ right: "0", width: "42%" });
    setTableContainerStyle({ marginRight: "40%", width: "58%" });
  };

  const handleEdit = (row) => {
    setFormData({
       id: row.id,
       designation: row.designation || "",
       Code_produit: row.Code_produit || "",
       cout_horaire_mod: row.cout_horaire_mod || 0,
       temps_production: row.temps_production || 0
    });
    setFormContainerStyle({ right: "0", width: "42%" });
    setTableContainerStyle({ marginRight: "40%", width: "58%" });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put(`/api/produits/${formData.id}`, {
        cout_horaire_mod: formData.cout_horaire_mod,
        temps_production: formData.temps_production
      });
      fetchData();
      Swal.fire("Succès", "Charges MOD enregistrées avec succès.", "success");
    } catch (error) {
      Swal.fire("Erreur", "Une erreur est survenue.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ ...dynamicStyles }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '60px' }}>
        <ProductCarousel
          products={produits}
          selectedProductId={carouselSelectedProductId}
          onProductSelect={(id) => setCarouselSelectedProductId(id)}
        />

        <div className="container-d-flex justify-content-start" style={{ marginTop: "35px", position: "relative" }}>
          
          <TableMui
            columns={[
              { id: 'Code_produit', label: 'CODE', minWidth: 80 },
              { id: 'designation', label: 'DÉSIGNATION', minWidth: 120 },
              { 
                id: 'cout_matieres', 
                label: 'MATIÈRES (U)', 
                minWidth: 100,
                render: (row) => `${Number(row.cout_matieres_calculé || 0).toFixed(2)} DH`
              },
              { 
                id: 'total_mod', 
                label: 'MOD (U)', 
                minWidth: 90,
                render: (row) => {
                  const costMOD = ((row.cout_horaire_mod || 0) * (row.temps_production || 0)) / 60;
                  return `${costMOD.toFixed(2)} DH`;
                }
              },
              {
                id: 'cout_packaging',
                label: 'PACK (U)',
                minWidth: 90,
                render: (row) => `${Number(row.cout_packaging_calculé || 0).toFixed(2)} DH`
              },
              { 
                id: 'total_charges_directes', 
                label: 'TOTAL DIRECT', 
                minWidth: 110,
                render: (row) => {
                  const costMOD = ((row.cout_horaire_mod || 0) * (row.temps_production || 0)) / 60;
                  const totalDirect = Number(row.cout_matieres_calculé || 0) + costMOD + Number(row.cout_packaging_calculé || 0);
                  return <span style={{ fontWeight: 700, color: '#00afaa' }}>{totalDirect.toFixed(2)} DH</span>;
                }
              },
            ]}
            rows={currentProductData}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={(e, newPage) => setPage(newPage)}
            handleChangeRowsPerPage={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            produitsFiltres={currentProductData}
            hasActions={true}
            handleEdit={handleEdit}
            handleDelete={(row) => handleEdit(row)}
            addButtonText="Configurer"
            tableContainerStyle={{ ...tableContainerStyle, transition: 'all 0.3s ease' }}
            selectedItems={selectedItems}
            handleShowFormButtonClick={handleShowFormButtonClick}
          />

          <ChargeDirecteForm
            formContainerStyle={formContainerStyle}
            formData={formData}
            handleChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            handleSubmit={handleSubmit}
            loading={loading}
            closeForm={closeForm}
          />

        </div>
      </Box>
    </Box>
  );
};

export default ChargeDirecteList;
*/