import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TableMui from "../components/TableMui";
import axiosInstance from "../axiosInstance";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import AddButton from "../components/AddButton";
import PackagingForm from "./PackagingForm";
import Swal from "sweetalert2";

const PackagingList = () => {
  const [packagings, setPackagings] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formContainerStyle, setFormContainerStyle] = useState({ right: "-100%" });
  const [tableContainerStyle, setTableContainerStyle] = useState({ marginRight: "0%", width: "100%" });
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const { dynamicStyles } = useOpen();
  const { setTitle } = useHeader();

  useEffect(() => { setTitle("Gestion du Packaging"); }, [setTitle]);

  const fetchData = async () => {
    try {
      const [pkgRes, fournRes] = await Promise.all([
        axiosInstance.get('/api/produits/packagings').catch(() => ({ data: {} })),
      ]);
      setPackagings(pkgRes.data?.produits || []);
    } catch (error) {
      console.error("Error fetching packagings:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openForm = () => {
    setFormContainerStyle({ right: "0", width: "40%" });
    setTableContainerStyle({ marginRight: "42%", width: "58%" });
  };

  const closeForm = () => {
    setFormContainerStyle({ right: "-100%" });
    setTableContainerStyle({ marginRight: "0%", width: "100%" });
  };

  const handleAddClick = () => {
    setFormData({});
    openForm();
  };

  const handleEdit = (row) => {
    setFormData({
      id: row.id,
      designation: row.designation,
      Code_produit: row.Code_produit,
      unite: row.unite,
      prixProduit: row.prix_produits_last?.prixProduit || '',
    });
    openForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.id) {
        await axiosInstance.put(`/api/produits/packagings/${formData.id}`, formData);
      } else {
        await axiosInstance.post(`/api/produits/packagings`, formData);
      }
      fetchData();
      closeForm();
      Swal.fire("Succès", "Packaging enregistré avec succès.", "success");
    } catch (error) {
      if (error.response?.status === 400) {
        Swal.fire("Erreur de validation", JSON.stringify(error.response.data.error), "error");
      } else {
        Swal.fire("Erreur", "Une erreur est survenue.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Supprimer ?",
      text: "Voulez-vous supprimer ce packaging ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/api/produits/${id}`);
          fetchData();
          Swal.fire("Supprimé !", "", "success");
        } catch {
          Swal.fire("Erreur", "Impossible de supprimer.", "error");
        }
      }
    });
  };

  return (
    <Box sx={{ ...dynamicStyles }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '60px' }}>
        <div style={{ position: 'relative' }}>
          <PackagingForm
            show={formContainerStyle.right === "0"}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            closeForm={closeForm}
            formContainerStyle={formContainerStyle}
          />

          <TableMui
            columns={[
              { id: 'Code_produit', label: 'CODE', minWidth: 100 },
              { id: 'designation', label: 'DÉSIGNATION', minWidth: 180 },
              { id: 'unite', label: 'UNITÉ', minWidth: 80 },
              {
                id: 'prix',
                label: 'PRIX UNITAIRE',
                minWidth: 120,
                render: (row) => `${Number(row.prix_produits_last?.prixProduit || 0).toFixed(2)} DH`
              },
            ]}
            rows={packagings}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={(e, newPage) => setPage(newPage)}
            handleChangeRowsPerPage={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            produitsFiltres={packagings}
            hasActions={true}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            addButtonText="Ajouter"
            tableContainerStyle={tableContainerStyle}
            selectedItems={selectedItems}
            AddButton={AddButton}
            handleShowFormButtonClick={handleAddClick}
          />
        </div>
      </Box>
    </Box>
  );
};

export default PackagingList;