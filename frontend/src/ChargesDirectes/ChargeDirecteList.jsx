import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import Box from "@mui/material/Box";
import TableMui from "../components/TableMui";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import { Clock } from "lucide-react";
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
  const [selectedCategory, setSelectedCategory] = useState("tout");
  const [sousCatFiltre, setSousCatFiltre] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [carouselSelectedProductId, setCarouselSelectedProductId] = useState("tout");
  const [chargesDirectes, setChargesDirectes] = useState({});
  const [formContainerStyle, setFormContainerStyle] = useState({ right: "-100%" });
  const [coutLotParProduit, setCoutLotParProduit] = useState({});
  const [quantiteParProduit, setQuantiteParProduit] = useState(() => {
    const saved = localStorage.getItem('quantiteParProduit');
    return saved ? JSON.parse(saved) : {};
  });
  const [tableContainerStyle, setTableContainerStyle] = useState({
    marginRight: "0%",
    width: "100%",
  });
  const [formData, setFormData] = useState({
    id: null,
    designation: "",
    Code_produit: "",
    cout_horaire_mod: 0,
    temps_production: 0,
    perte_mod: 0,
    quantiteLot: 1,
    prix_vente: 0,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [packagingsDisponibles, setPackagingsDisponibles] = useState([]);
  const [packagingLignes, setPackagingLignes] = useState([]);
  const [historiqueMOD, setHistoriqueMOD] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [validationParProduit, setValidationParProduit] = useState({});

  const { dynamicStyles } = useOpen();
  const { setTitle, searchQuery } = useHeader();
  
const [prixMinimumParProduit, setPrixMinimumParProduit] = useState({});

  useEffect(() => {
    setTitle("Gestion des Charges Directes");
  }, [setTitle]);

  useEffect(() => {
    localStorage.setItem('quantiteParProduit', JSON.stringify(quantiteParProduit));
  }, [quantiteParProduit]);

  
  // ============================================
  // FETCH VALIDATION
  // ============================================
  const fetchValidation = async (produitId) => {
    try {
      const response = await axiosInstance.get(`/api/produits/${produitId}/valider-cout`);
      setValidationParProduit((prev) => ({
        ...prev,
        [produitId]: response.data
      }));
    } catch (error) {
      console.error("Erreur chargement validation:", error);
      setValidationParProduit((prev) => ({
        ...prev,
        [produitId]: null
      }));
    }
  };

  useEffect(() => {
    if (produits.length > 0) {
      produits.forEach((produit) => {
        fetchValidation(produit.id);
      });
    }
  }, [produits]);

  // ============================================
  // FETCH HISTORIQUE MOD
  // ============================================
  const fetchHistoriqueMOD = async (produitId) => {
  console.log("=== FETCH HISTORIQUE MOD, produitId:", produitId);
  try {
    const response = await axiosInstance.get(`/api/produits/${produitId}/historique-mod`);
    console.log("=== REPONSE COMPLETE:", response.data);
    console.log("=== HISTORIQUE EXTRAIT:", response.data.historique);
    setHistoriqueMOD(response.data.historique || []);
    setCurrentProductId(produitId);
  } catch (error) {
    console.log("=== ERREUR STATUS:", error.response?.status);
    console.log("=== ERREUR DATA:", error.response?.data);
    console.error("Erreur chargement historique MOD:", error);
    setHistoriqueMOD([]);
  }
};
const handleVerifierCoherence = async () => {
  if (!formData.id) return;
  try {
    const response = await axiosInstance.get(`/api/produits/${formData.id}/verifier-coherence`);
    const data = response.data;

    if (data.coherent) {
      Swal.fire({
        icon: "success",
        title: "Calcul coherent",
        html: `
          <p>La somme des composants correspond bien au total annonce.</p>
          <table style="width:100%; text-align:left; font-size:0.9rem; margin-top:10px;">
            <tr><td>Matieres premieres :</td><td style="text-align:right"><b>${data.detail.cout_matieres_premieres.toFixed(2)} DH</b></td></tr>
            <tr><td>Main d'oeuvre :</td><td style="text-align:right"><b>${data.detail.cout_main_oeuvre.toFixed(2)} DH</b></td></tr>
            <tr><td>Packaging :</td><td style="text-align:right"><b>${data.detail.cout_packaging.toFixed(2)} DH</b></td></tr>
            <tr style="border-top:1px solid #ccc;"><td>Total :</td><td style="text-align:right"><b>${data.total_annonce.toFixed(2)} DH</b></td></tr>
          </table>
        `,
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Incoherence detectee",
        text: `Ecart de ${data.ecart} DH entre la somme des composants (${data.somme_composants} DH) et le total annonce (${data.total_annonce} DH).`,
      });
    }
  } catch (error) {
    Swal.fire("Erreur", "Impossible de verifier la coherence.", "error");
  }
};
  // ============================================
  // FETCH COUT LOT
  // ============================================
  const fetchCoutLot = async (produitId, quantite) => {
    try {
      const response = await axiosInstance.get(`/api/produits/${produitId}/cout-lot`, {
        params: { quantite }
      });
      setCoutLotParProduit((prev) => ({
        ...prev,
        [produitId]: response.data.cout_total || 0
      }));
    } catch (error) {
      console.error("Erreur chargement cout lot:", error);
      setCoutLotParProduit((prev) => ({
        ...prev,
        [produitId]: 0
      }));
    }
  };

  // ============================================
  // FETCH DATA
  // ============================================
  const fetchData = async () => {
    try {
      const [prodRes, catRes, pkgRes] = await Promise.all([
        axiosInstance.get("/api/produits").catch(() => ({ data: {} })),
        axiosInstance.get("/api/categories").catch(() => ({ data: [] })),
        axiosInstance.get("/api/produits/packagings").catch(() => ({ data: {} })),
      ]);
      const prodData = prodRes.data?.produit || prodRes.data;
      const tousLesProduits = Array.isArray(prodData) ? prodData : [];

      const produitsFiltres = tousLesProduits.filter((p) => {
        const type = String(p?.type ?? "").toLowerCase();
        const categorie = String(p?.categorie?.categorie ?? p?.categorie ?? "").toLowerCase();
        const codeProduit = String(p?.Code_produit ?? "").toLowerCase();

        if (type === "emballage" || type === "emballage_secondaire" || categorie.includes("emballage")) {
          return false;
        }

        const codesExclus = ["etiq001", "pkg-001", "pkg-002"];
        if (codesExclus.includes(codeProduit)) {
          return false;
        }

        return p?.is_recette !== true && p?.is_recette !== "1" && p?.is_recette !== 1;
      });

      setProduits(produitsFiltres);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      setPackagingsDisponibles(pkgRes.data?.produits || []);
    } catch (error) {
      console.error("Erreur fetchData :", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ============================================
  // INITIALISER LES COUTS LOT POUR TOUS LES PRODUITS
  // ============================================
  useEffect(() => {
    if (produits.length > 0) {
      produits.forEach((produit) => {
        const quantite = quantiteParProduit[produit.id] || 1;
        fetchCoutLot(produit.id, quantite);
      });
    }
  }, [produits]);
useEffect(() => {
    if (produits.length > 0) {
        produits.forEach((produit) => {
            fetchPrixMinimum(produit.id);
        });
    }
}, [produits]);
  // ============================================
  // FETCH CHARGES DIRECTES
  // ============================================
  const fetchChargesDirectes = async (produitId) => {
    try {
      const response = await axiosInstance.get(`/api/produits/${produitId}/charges-directes-detail`);
      setChargesDirectes((prev) => ({
        ...prev,
        [produitId]: response.data.charges_directes,
      }));
    } catch (error) {
      console.error("Erreur chargement charges directes:", error);
    }
  };

  useEffect(() => {
    if (produits.length > 0) {
      produits.forEach((produit) => {
        fetchChargesDirectes(produit.id);
      });
    }
  }, [produits]);

  // ============================================
  // FILTRAGE
  // ============================================
  useEffect(() => {
    const safeSearchQuery = (searchQuery || "").toLowerCase();
    let filtered = produits.filter(
      (p) =>
        p.designation?.toLowerCase().includes(safeSearchQuery) ||
        p.Code_produit?.toLowerCase().includes(safeSearchQuery)
    );

    if (selectedCategory && selectedCategory !== "tout") {
      filtered = filtered.filter((p) => p.categorie_id === parseInt(selectedCategory));
    }

    if (sousCatFiltre && sousCatFiltre !== "tout") {
      filtered = filtered.filter((p) => p.suCat_id === parseInt(sousCatFiltre));
    }

    setFilteredProduits(filtered);
  }, [produits, searchQuery, selectedCategory, sousCatFiltre]);

  // ============================================
  // SELECTION PRODUIT
  // ============================================
  const selectedProduct = (produits || []).find(
    (p) => p.id === parseInt(carouselSelectedProductId)
  );
  const currentProductData = selectedProduct ? [selectedProduct] : filteredProduits;

  // ============================================
  // HANDLERS
  // ============================================
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredProduits.map((p) => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShowFormButtonClick = () => {
    if (carouselSelectedProductId && carouselSelectedProductId !== "tout") {
      if (selectedProduct) {
        handleEdit(selectedProduct);
      } else {
        Swal.fire("Selection", "Veuillez d'abord selectionner un produit.", "info");
      }
      return;
    }
    Swal.fire("Selection", "Veuillez selectionner un produit.", "info");
  };

  const closeForm = () => {
    setFormContainerStyle({ right: "-100%" });
    setTableContainerStyle({ marginRight: "0", width: "100%" });
    setCarouselSelectedProductId("tout");
    setErrors({});
    setPackagingLignes([]);
    fetchData();
  };
const fetchPrixMinimum = async (produitId) => {
    try {
        const response = await axiosInstance.get(`/api/produits/${produitId}/prix-minimum`);
        setPrixMinimumParProduit((prev) => ({
            ...prev,
            [produitId]: response.data
        }));
    } catch (error) {
        console.error("Erreur chargement prix minimum:", error);
        setPrixMinimumParProduit((prev) => ({
            ...prev,
            [produitId]: null
        }));
    }
};
  // ============================================
  // EDITION
  // ============================================
  const handleEdit = async (row) => {
    const quantite = quantiteParProduit[row.id] || 1;

    setFormData({
      id: row.id,
      designation: row.designation || "",
      Code_produit: row.Code_produit || "",
      cout_horaire_mod: row.cout_horaire_mod || 0,
      temps_production: row.temps_production || 0,
      perte_mod: row.perte_mod || 0,
      quantiteLot: quantite,
      prix_vente: row.prix_vente || 0,
    });

    try {
      const res = await axiosInstance.get(`/api/produit-packagings/produit/${row.id}`);
      setPackagingLignes(res.data?.lignes || []);
    } catch {
      setPackagingLignes([]);
    }

    try {
      const pkgRes = await axiosInstance.get("/api/produits/packagings");
      setPackagingsDisponibles(pkgRes.data?.produits || []);
    } catch {
      setPackagingsDisponibles([]);
    }

    
      await fetchHistoriqueMOD(row.id);

    await fetchCoutLot(row.id, quantite);

    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0", width: "50%" });
      setTableContainerStyle({ marginRight: "48%", width: "52%" });
    }
  };

  // ============================================
  // SELECTION PRODUIT (avec ouverture formulaire)
  // ============================================
  const handleSelectItem = (row) => {
    if (currentProductId === row.id && formContainerStyle.right === "0") {
      return;
    }

    setCarouselSelectedProductId(row.id);
    const quantite = quantiteParProduit[row.id] || 1;
    setFormData({
      id: row.id,
      designation: row.designation || "",
      Code_produit: row.Code_produit || "",
      cout_horaire_mod: row.cout_horaire_mod || 0,
      temps_production: row.temps_production || 0,
      perte_mod: row.perte_mod || 0,
      quantiteLot: quantite,
      prix_vente: row.prix_vente || 0,
    });
    setErrors({});

    handleEdit(row);

    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0", width: "50%" });
      setTableContainerStyle({ marginRight: "48%", width: "52%" });
    }
  };

  // ============================================
  // GESTION PACKAGINGS
  // ============================================
  const handleAddPackagingLigne = () => {
    setPackagingLignes((prev) => [...prev, { packaging_id: "", quantite: 1, perte: 0 }]);
  };

  const handleRemovePackagingLigne = (index) => {
    setPackagingLignes((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePackagingLigneChange = (index, field, value) => {
    setPackagingLignes((prev) =>
      prev.map((ligne, i) => (i === index ? { ...ligne, [field]: value } : ligne))
    );
  };

  // ============================================
  // SOUMISSION
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id) {
      Swal.fire("Erreur", "Aucun produit selectionne.", "error");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.patch(`/api/produits/${formData.id}/charges-directes`, {
    cout_horaire_mod: parseFloat(formData.cout_horaire_mod) || 0,
    temps_production: parseFloat(formData.temps_production) || 0,
    perte_mod: parseFloat(formData.perte_mod) || 0,
    quantite: parseFloat(formData.quantiteLot) || 1,
    cout_total: parseFloat(coutLotParProduit[formData.id]) || 0,
    prix_vente: parseFloat(formData.prix_vente) || 0,
});

      const lignesValides = packagingLignes.filter((l) => l.packaging_id);
      await axiosInstance.post(`/api/produit-packagings/sync/${formData.id}`, {
        lignes: lignesValides,
      });

      await fetchData();
      await fetchHistoriqueMOD(formData.id);

      Swal.fire("Succes", "Charges directes enregistrees avec succes.", "success");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data.error || {});
        Swal.fire("Erreur de validation", JSON.stringify(error.response.data.error), "error");
      } else {
        Swal.fire("Erreur", "Une erreur est survenue lors de l'enregistrement.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // REINITIALISATION
  // ============================================
  const handleDelete = (id) => {
  if (!id) {
    Swal.fire("Erreur", "Identifiant du produit manquant.", "error");
    return;
  }

  Swal.fire({
    title: "Reinitialiser ?",
    text: "Voulez-vous reinitialiser les charges directes pour ce produit ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Oui, reinitialiser",
    cancelButtonText: "Annuler",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axiosInstance.patch(`/api/produits/${id}/charges-directes`, {
          cout_horaire_mod: 0,
          temps_production: 0,
          perte_mod: 0,
        });
        await fetchData();
        await fetchHistoriqueMOD(id);
        Swal.fire("Reinitialise !", "Les charges ont ete remises a zero.", "success");
      } catch (error) {
        Swal.fire("Erreur", "Une erreur est survenue.", "error");
      }
    }
  });
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Champ ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'quantiteLot' && formData.id) {
      const quantite = parseFloat(value) || 1;
      setQuantiteParProduit((prev) => ({
        ...prev,
        [formData.id]: quantite
      }));
      fetchCoutLot(formData.id, quantite);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;

    Swal.fire({
      title: "Reinitialiser la selection ?",
      text: `Voulez-vous reinitialiser les charges directes pour les ${selectedItems.length} produits selectionnes ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, reinitialiser",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            selectedItems.map((id) =>
              axiosInstance.put(`/api/produits/${id}`, {
                cout_horaire_mod: 0,
                temps_production: 0,
                perte_mod: 0,
              })
            )
          );
          await fetchData();
          setSelectedItems([]);
          Swal.fire("Reinitialise !", "Les charges ont ete remises a zero.", "success");
        } catch (error) {
          Swal.fire("Erreur", "Une erreur est survenue.", "error");
        }
      }
    });
  };

  // ============================================
  // RENDU
  // ============================================
  return (
    <Box sx={{ ...dynamicStyles }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "60px" }}>
        <ProductCarousel
          products={produits}
          selectedProductId={carouselSelectedProductId}
          onProductSelect={(id) => setCarouselSelectedProductId(id)}
        />

        <div className="container-d-flex justify-content-start" style={{ marginTop: "55px" }}>
          <ChargeDirecteForm
            show={formContainerStyle.right === "0"}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            errors={errors}
            loading={loading}
            closeForm={closeForm}
            formContainerStyle={formContainerStyle}
            packagingsDisponibles={packagingsDisponibles}
            packagingLignes={packagingLignes}
            onAddPackagingLigne={handleAddPackagingLigne}
            onRemovePackagingLigne={handleRemovePackagingLigne}
            onPackagingLigneChange={handlePackagingLigneChange}
            historique={historiqueMOD}
            coutLot={coutLotParProduit[formData.id] || 0}
            onVerifierCoherence={handleVerifierCoherence}
          />

          <TableMui
            columns={[
              {
                id: "select",
                label: "SELECTION",
                renderHeader: () => (
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === filteredProduits.length && filteredProduits.length > 0
                    }
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
                ),
              },
              { id: "Code_produit", label: "CODE", minWidth: 100 },
              { id: "designation", label: "DESIGNATION", minWidth: 200 },
              {
                id: "categorie",
                label: "CATEGORIE",
                minWidth: 120,
                render: (row) => row.categorie?.categorie || "-",
              },
              {
                id: "mod_horaire",
                label: "MOD / H",
                minWidth: 120,
                render: (row) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={14} color="#666" />
                    {row.cout_horaire_mod || 0} DH
                  </div>
                ),
              },
              {
                id: "temps_production",
                label: "TEMPS (MIN)",
                minWidth: 120,
                render: (row) => row.temps_production || 0,
              },
              {
                id: "perte_mod",
                label: "PERTE MOD (%)",
                minWidth: 120,
                render: (row) => row.perte_mod || 0,
              },
              {
                id: "cout_mod_unitaire",
                label: "COUT MOD UNIT.",
                minWidth: 150,
                render: (row) => {
                  const coutMod = chargesDirectes[row.id]?.cout_main_oeuvre || 0;
                  return (
                    <span>
                      {coutMod.toFixed(2)} DH
                    </span>
                  );
                },
              },
              {
                id: "cout_packaging",
                label: "PACKAGING UNIT.",
                minWidth: 150,
                render: (row) => {
                  const coutPackaging = chargesDirectes[row.id]?.cout_packaging || 0;
                  return (
                    <span>
                      {coutPackaging.toFixed(2)} DH
                    </span>
                  );
                },
              },
              {
                id: "total_charges_directes",
                label: "TOTAL DIRECT",
                minWidth: 150,
                render: (row) => {
                  const total = chargesDirectes[row.id]?.cout_revient_unitaire || 0;
                  return (
                    <span>
                      {total.toFixed(2)} DH
                    </span>
                  );
                },
              },
              {
                id: "cout_matieres",
                label: "MATIERES PREMIERES",
                minWidth: 150,
                render: (row) => {
                  const coutMatieres = chargesDirectes[row.id]?.cout_matieres_premieres || 0;
                  return (
                    <span>
                      {coutMatieres.toFixed(2)} DH
                    </span>
                  );
                },
              },
              {
                id: "cout_total_lot",
                label: "COUT TOTAL LOT",
                minWidth: 150,
                render: (row) => {
                  const total = coutLotParProduit[row.id] || 0;
                  return (
                    <span>
                      {total.toFixed(2)} DH
                    </span>
                  );
                },
              },
              {
                id: "validation",
                label: "VALIDATION",
                minWidth: 120,
                render: (row) => {
                  const validation = validationParProduit[row.id];
                  if (!validation) {
                    return <span style={{ color: '#94a3b8' }}>...</span>;
                  }

                  const statut = validation.statut;
                  const message = validation.message;

                  let bgColor = '#e2e8f0';
                  let textColor = '#475569';

                  if (statut === 'success') {
                    bgColor = '#dcfce7';
                    textColor = '#166534';
                  } else if (statut === 'warning') {
                    bgColor = '#fef9c3';
                    textColor = '#854d0e';
                  } else if (statut === 'danger') {
                    bgColor = '#fee2e2';
                    textColor = '#991b1b';
                  } else if (statut === 'info') {
                    bgColor = '#dbeafe';
                    textColor = '#1e40af';
                  }

                  return (
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: bgColor,
                      color: textColor,
                      whiteSpace: 'nowrap'
                    }}>
                      {message}
                    </span>
                  );
                }
              },
              {
    id: "prix_minimum",
    label: "PRIX MINIMUM",
    minWidth: 130,
    render: (row) => {
        const data = prixMinimumParProduit[row.id];
        if (!data) {
            return <span style={{ color: '#94a3b8' }}>...</span>;
        }
        return <span style={{ fontWeight: 600, color: '#6b21a5' }}>{data.prix_minimum.toFixed(2)} DH</span>;
    },
},
{
    id: "marge",
    label: "MARGE",
    minWidth: 120,
    render: (row) => {
        const charges = chargesDirectes[row.id];
        const coutUnitaire = charges?.cout_revient_unitaire || 0;
        const prixVente = row.prix_vente || 0;
        const marge = prixVente - coutUnitaire;
        
        const color = marge < 0 ? '#dc2626' : '#16a34a';
        return <span style={{ fontWeight: 600, color: color }}>{marge.toFixed(2)} DH</span>;
    },
},
{
    id: "taux_marge",
    label: "TAUX MARGE (%)",
    minWidth: 130,
    render: (row) => {
        const charges = chargesDirectes[row.id];
        const coutUnitaire = charges?.cout_revient_unitaire || 0;
        const prixVente = row.prix_vente || 0;
        const taux = prixVente > 0 ? ((prixVente - coutUnitaire) / prixVente) * 100 : 0;
        
        let bgColor = '#e2e8f0';
        let textColor = '#475569';
        
        if (taux < 0) {
            bgColor = '#fee2e2';
            textColor = '#991b1b';
        } else if (taux < 10) {
            bgColor = '#fef9c3';
            textColor = '#854d0e';
        } else {
            bgColor = '#dcfce7';
            textColor = '#166534';
        }
        
        return (
            <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: bgColor,
                color: textColor,
            }}>
                {taux.toFixed(1)}%
            </span>
        );
    },
},
              {
    id: "prix_vente",
    label: "PRIX VENTE",
    minWidth: 120,
    render: (row) => <span>{row.prix_vente ? parseFloat(row.prix_vente).toFixed(2) : '0.00'} DH</span>,
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
              transition: "all 0.3s ease",
            }}
            selectedItems={selectedItems}
            handleDeleteSelected={handleDeleteSelected}
            AddButton={AddButton}
            FilterToggleButton={FilterToggleButton}
            showFilters={showFilters}
            toggleFilters={() => setShowFilters(!showFilters)}
            handleShowFormButtonClick={handleShowFormButtonClick}
            handleSelectItem={handleSelectItem}
          />
        </div>
      </Box>
    </Box>
  );
};

export default ChargeDirecteList;