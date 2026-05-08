import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import Box from "@mui/material/Box";
import TableMui from "../components/TableMui";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import { Edit3, Trash2 } from "lucide-react";
import ProductCarousel from "../components/ProductCarousel";
import AddButton from "../components/AddButton";
import FilterToggleButton from "../components/FilterToggleButton";
import ChargeIndirecteForm from "./ChargeIndirecteForm";
import Swal from "sweetalert2";
import "../Produit/All.css";

const ChargeIndirecteList = () => {
  const [charges, setCharges] = useState([]);
  const [filteredCharges, setFilteredCharges] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [produits, setProduits] = useState([]);
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
    nom: "",
    montant: "",
    frequence: "",
    methode_repartition: "volume"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { dynamicStyles } = useOpen();
  const { setTitle, searchQuery } = useHeader();

  useEffect(() => {
    setTitle("Gestion des Charges Indirectes");
  }, [setTitle]);

  const fetchData = async () => {
    try {
      const [chargesRes, prodRes] = await Promise.all([
        axiosInstance.get("/api/charges-indirectes").catch(() => ({ data: [] })),
        axiosInstance.get("/api/produits").catch(() => ({ data: [] }))
      ]);
      setCharges(Array.isArray(chargesRes.data) ? chargesRes.data : []);
      const prodData = prodRes.data?.produit || prodRes.data;
      setProduits(Array.isArray(prodData) ? prodData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const safeSearchQuery = (searchQuery || '').toLowerCase();
    const filtered = charges.filter((c) =>
      c.nom?.toLowerCase().includes(safeSearchQuery)
    );
    setFilteredCharges(filtered);
  }, [charges, searchQuery]);

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredCharges.map(c => c.id));
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
      nom: "",
      montant: "",
      frequence: "mensuel",
      methode_repartition: "volume"
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

  const handleEdit = (charge) => {
    setFormData({
      id: charge.id,
      nom: charge.nom,
      montant: charge.montant,
      frequence: charge.frequence,
      methode_repartition: charge.methode_repartition
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
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/api/charges-indirectes/${id}`);
          fetchData();
          Swal.fire("Supprimé !", "La charge a été supprimée.", "success");
        } catch (error) {
          Swal.fire("Erreur", "Une erreur est survenue.", "error");
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = formData.id ? `/api/charges-indirectes/${formData.id}` : `/api/charges-indirectes`;
    const method = formData.id ? "put" : "post";

    setLoading(true);
    try {
      await axiosInstance[method](url, formData);
      fetchData();
      closeForm();
      Swal.fire("Succès", `Charge ${formData.id ? 'modifiée' : 'ajoutée'} avec succès.`, "success");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const chunks = [[{ id: 'tout', categorie: 'Toutes les charges' }]];
  const chunksSucat = [[{ id: 'tout', sous_categorie: 'Tous les types' }]];

  const noop = () => {};

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
          <ChargeIndirecteForm
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
                    checked={selectedItems.length === filteredCharges.length && filteredCharges.length > 0}
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
              { id: 'nom', label: 'TYPE', minWidth: 200 },
              { id: 'montant', label: 'MONTANT', minWidth: 120, render: (row) => `${row.montant} DH` },
              { id: 'frequence', label: 'PÉRIODE', minWidth: 120, render: (row) => `${row.frequence} mois` },
              { 
                id: 'methode_repartition', 
                label: 'MÉTHODE', 
                minWidth: 200,
                render: (row) => {
                  const methods = {
                    volume: 'Volume',
                    quantite: 'Quantité produite',
                    temps_machine: 'Temps machine'
                  };
                  return methods[row.methode_repartition] || row.methode_repartition;
                }
              },
            ]}
            rows={filteredCharges}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={(e, newPage) => setPage(newPage)}
            handleChangeRowsPerPage={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            produitsFiltres={filteredCharges}
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

export default ChargeIndirecteList;
