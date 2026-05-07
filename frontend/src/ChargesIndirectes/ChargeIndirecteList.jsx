import React, { useState, useEffect } from "react";
import axios from "../axiosInstance";
import Swal from "sweetalert2";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Navigation from "../Acceuil/Navigation";
import TableMui from "../components/TableMui";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import ChargeIndirecteForm from "./ChargeIndirecteForm";
import AddButton from "../components/AddButton";
import FilterToggleButton from "../components/FilterToggleButton";
import FamilleTypeCarousels from "../components/FamilleTypeCarousels";

const theme = createTheme();

const ChargeIndirecteList = () => {
  const [charges, setCharges] = useState([]);
  const [filteredCharges, setFilteredCharges] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    nom: "",
    montant: "",
    frequence: "mensuel",
    methode_repartition: "volume"
  });
  const [errors, setErrors] = useState({});
  const [formContainerStyle, setFormContainerStyle] = useState({ right: "-100%" });
  const [tableContainerStyle, setTableContainerStyle] = useState({ 
    width: "100%", 
    marginTop: "0px",
    transition: "width 0.3s ease-in-out" 
  });

  const { open, dynamicStyles } = useOpen();
  const { title, setTitle, searchQuery, setOnPrint, setOnExportPDF } = useHeader();

  useEffect(() => {
    setTitle("Gestion des Charges Indirectes");
  }, [setTitle]);

  const fetchCharges = async () => {
    try {
      const response = await axios.get("/api/charges-indirectes");
      setCharges(response.data);
    } catch (error) {
      console.error("Error fetching charges:", error);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  useEffect(() => {
    const filtered = charges.filter((c) =>
      c.nom.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Logic for chunks (carousels)
  const chunks = [[{ id: 'tout', categorie: 'Toutes les charges' }]];
  const chunksSucat = [[{ id: 'tout', sous_categorie: 'Tous les types' }]];

  const handleEdit = (charge) => {
    setFormData({
      id: charge.id,
      nom: charge.nom,
      montant: charge.montant,
      frequence: charge.frequence,
      methode_repartition: charge.methode_repartition
    });
    setFormContainerStyle({ right: "0" });
    setTableContainerStyle(prev => ({ ...prev, width: "65%" }));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Supprimer cette charge ?",
      text: "Action irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/charges-indirectes/${id}`)
          .then(() => {
            fetchCharges();
            Swal.fire("Supprimé !", "La charge a été supprimée.", "success");
          })
          .catch(() => {
            Swal.fire("Erreur", "Échec de la suppression.", "error");
          });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = formData.id 
      ? `/api/charges-indirectes/${formData.id}` 
      : `/api/charges-indirectes`;
    const method = formData.id ? 'put' : 'post';

    try {
      await axios[method](url, formData);
      fetchCharges();
      closeForm();
      Swal.fire("Succès", `Charge ${formData.id ? 'modifiée' : 'ajoutée'} avec succès.`, "success");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        Swal.fire("Erreur", "Une erreur est survenue.", "error");
      }
    }
  };

  const closeForm = () => {
    setFormData({ id: null, nom: "", montant: "", frequence: "mensuel", methode_repartition: "volume" });
    setErrors({});
    setFormContainerStyle({ right: "-100%" });
    setTableContainerStyle(prev => ({ ...prev, width: "100%" }));
  };

  const handleShowFormButtonClick = () => {
    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle(prev => ({ ...prev, width: "65%" }));
    } else {
      closeForm();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Navigation />
      <Box sx={{ ...dynamicStyles }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 6 }}>
          
          <FamilleTypeCarousels
            activeIndex={0}
            handleSelect={() => {}}
            chunks={chunks}
            selectedCategory={'tout'}
            handleCategoryFilterChange={() => {}}
            activeIndexSuCat={0}
            handleSelectSousCat={() => {}}
            chunksSucat={chunksSucat}
            sousCatFiltre={'tout'}
            handleSousCategoryFilterChange={() => {}}
          />

          <div style={{ position: 'relative', marginTop: '20px' }}>
            <ChargeIndirecteForm
              formData={formData}
              handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              handleSubmit={handleSubmit}
              errors={errors}
              closeForm={closeForm}
              formContainerStyle={formContainerStyle}
            />

            <TableMui
              columns={[
                {
                  id: 'select',
                  label: (
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
                { id: 'nom', label: 'NOM', minWidth: 200 },
                { id: 'montant', label: 'MONTANT', minWidth: 120, render: (row) => `${row.montant} DH` },
                { id: 'frequence', label: 'FRÉQUENCE', minWidth: 120 },
                { 
                  id: 'methode_repartition', 
                  label: 'RÉPARTITION', 
                  minWidth: 200,
                  render: (row) => {
                    const methods = {
                      volume: 'Volume de production',
                      quantite: 'Quantité produite',
                      temps_machine: 'Temps machine / MOD'
                    };
                    return methods[row.methode_repartition] || row.methode_repartition;
                  }
                }
              ]}
              rows={filteredCharges}
              hasActions={true}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={(e, newPage) => setPage(newPage)}
              handleChangeRowsPerPage={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
              produitsFiltres={filteredCharges}
              handleShowFormButtonClick={handleShowFormButtonClick}
              tableContainerStyle={tableContainerStyle}
              AddButton={AddButton}
              FilterToggleButton={FilterToggleButton}
              showFilters={showFilters}
              toggleFilters={() => setShowFilters(!showFilters)}
              addButtonText="Ajouter Charge"
              selectedItems={selectedItems}
              handleDeleteSelected={() => {}}
            />
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ChargeIndirecteList;
