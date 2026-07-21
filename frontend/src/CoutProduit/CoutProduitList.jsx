import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../axiosInstance";
import Box from "@mui/material/Box";
import TableMui from "../components/TableMui";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import { TrendingUp, TrendingDown, RefreshCw, Calculator, ArrowUp, Download, FileText } from "lucide-react";
import ProductCarousel from "../components/ProductCarousel";
import AddButton from "../components/AddButton";
import FilterToggleButton from "../components/FilterToggleButton";
import CoutProduitDetail from "./CoutProduitDetail";
import Swal from "sweetalert2";
import IconButton from "@mui/material/IconButton";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../Produit/All.css";

// ─── Utilitaires ─────────────────────────────────────────────────────────────

const fmt = (val, decimals = 2) =>
  val != null ? Number(val).toFixed(decimals) + " DH" : "—";

const MargeChip = ({ marge, margePct }) => {
  if (marge == null) return <span style={{ color: "#9ca3af" }}>—</span>;
  const positive = marge >= 0;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 10px",
        borderRadius: 20,
        fontWeight: 700,
        fontSize: 13,
        background: positive ? "#dcfce7" : "#fee2e2",
        color: positive ? "#16a34a" : "#dc2626",
      }}
    >
      {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {positive ? "+" : ""}
      {Number(marge).toFixed(2)} DH
      {margePct != null && (
        <span style={{ fontWeight: 500, fontSize: 11 }}>({Number(margePct).toFixed(1)}%)</span>
      )}
    </span>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────

const CoutProduitList = () => {
  const [rows, setRows]           = useState([]);
  const [produits, setProduits]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage]             = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);

  const [showFilters, setShowFilters] = useState(false);
  const [carouselSelectedProductId, setCarouselSelectedProductId] = useState("tout");

  // Sélection pour suppression
  const [selectedItems, setSelectedItems] = useState([]);

  // Panneau de détail (openDetails: { [produit_id]: { detail: true/false } })
  const [openDetails, setOpenDetails]         = useState({});
  const [detailData, setDetailData]           = useState({});   // cache { [produit_id]: detailPayload }
  const [detailLoading, setDetailLoading]     = useState({});

  // Panneau de simulation what-if
  const [simFormVisible, setSimFormVisible]   = useState(false);
  const [simProduit, setSimProduit]           = useState(null);
  const [simFields, setSimFields]             = useState({});
  const [simResult, setSimResult]             = useState(null);
  const [simLoading, setSimLoading]           = useState(false);

  const [formContainerStyle, setFormContainerStyle] = useState({ right: "-100%" });
  const [tableContainerStyle, setTableContainerStyle] = useState({ marginRight: "0%", width: "100%" });
  const [showScrollTop, setShowScrollTop]           = useState(false);

  // Ref pour éviter les dépendances circulaires dans useCallback
  const rowsPerPageRef = React.useRef(rowsPerPage);
  React.useEffect(() => { rowsPerPageRef.current = rowsPerPage; }, [rowsPerPage]);

  const { dynamicStyles } = useOpen();
  const { setTitle, searchQuery } = useHeader();

  // ── Initialisation ──────────────────────────────────────────────────────────

  useEffect(() => {
    setTitle("Coût de revient des produits");
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [setTitle]);

  // ── Chargement données ──────────────────────────────────────────────────────

  // fetchTableau sans dépendance à rowsPerPage pour éviter les re-fetches inutiles
  const fetchTableau = useCallback(async (pg = 1, perPage = null) => {
    const effectivePerPage = perPage ?? rowsPerPageRef.current;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/cout-produits?page=${pg}&per_page=${effectivePerPage}`);
      const payload = res.data;
      setRows(payload.data ?? []);
      setTotalPages(payload.pagination?.last_page ?? 1);
      setTotal(payload.pagination?.total ?? 0);
      // Réinitialiser la sélection lors d'un rechargement
      setSelectedItems([]);
    } catch (err) {
      console.error("Erreur chargement coûts:", err);
      Swal.fire("Erreur", "Impossible de charger les coûts produits.", "error");
    } finally {
      setLoading(false);
    }
  }, []); // dépendances vides : rowsPerPage lu via ref

  // Chargement de la liste produits (minimal) — différé jusqu'à l'ouverture
  // du panneau de simulation pour éviter un appel inutile au montage.
  const fetchProduits = useCallback(async () => {
    if (produits.length > 0) return; // déjà chargé
    try {
      const res = await axiosInstance.get("/api/produits", { params: { minimal: 1 } }).catch(() => ({ data: {} }));
      const data = res.data?.produit || res.data?.produits || res.data?.data || res.data || [];
      setProduits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement produits:", err);
    }
  }, [produits.length]);

  // Chargement initial : seulement le tableau paginé des coûts.
  // La liste produits (pour simulation) est chargée à la demande via openSim().
  useEffect(() => {
    fetchTableau(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Détail par produit ──────────────────────────────────────────────────────

  const toggleDetail = useCallback(async (produitId, section) => {
    setOpenDetails((prev) => {
      const current = prev[produitId]?.[section] ?? false;
      return {
        ...prev,
        [produitId]: { ...(prev[produitId] || {}), [section]: !current },
      };
    });

    // Charger le détail si pas encore en cache
    if (!detailData[produitId]) {
      setDetailLoading((prev) => ({ ...prev, [produitId]: true }));
      try {
        const res = await axiosInstance.get(`/api/produits/${produitId}/cout-unitaire`);
        setDetailData((prev) => ({ ...prev, [produitId]: res.data.data }));
      } catch (err) {
        console.error("Erreur chargement détail:", err);
      } finally {
        setDetailLoading((prev) => ({ ...prev, [produitId]: false }));
      }
    }
  }, [detailData]);

  // ── Sélection / Suppression ─────────────────────────────────────────────────
  // Les fonctions de sélection sont définies ici mais utilisent displayedRows
  // qui est calculé plus bas — c'est safe car elles sont appelées lors d'interactions utilisateur.

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Aucune sélection",
        text: "Veuillez sélectionner au moins un produit avant de supprimer.",
        confirmButtonColor: "#00afaa",
      });
      return;
    }
    const result = await Swal.fire({
      title: "Confirmer la suppression",
      text: `Voulez-vous vraiment supprimer ${selectedItems.length} produit(s) sélectionné(s) ? Cette action est irréversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });
    if (!result.isConfirmed) return;
    try {
      await axiosInstance.delete("/api/deleteSelectProd", { data: { ids: selectedItems } });
      Swal.fire({
        icon: "success",
        title: "Supprimé !",
        text: "Les produits sélectionnés ont été supprimés avec succès.",
        confirmButtonColor: "#00afaa",
        timer: 2000,
        timerProgressBar: true,
      });
      setSelectedItems([]);
      await fetchTableau(page);
      // Réinitialiser le cache produits pour forcer un rechargement à la prochaine simulation
      setProduits([]);
    } catch (err) {
      const errMsg = err.response?.data?.errors?.join(", ") || err.response?.data?.message || "Erreur lors de la suppression.";
      Swal.fire("Erreur", errMsg, "error");
    }
  };

  // ── Pagination ──────────────────────────────────────────────────────────────

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    fetchTableau(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    const val = parseInt(e.target.value, 10);
    setRowsPerPage(val);
    rowsPerPageRef.current = val;
    setPage(1);
    fetchTableau(1, val);
  };

  // ── Filtre carousel ─────────────────────────────────────────────────────────

  const displayedRows = carouselSelectedProductId === "tout"
    ? rows
    : rows.filter((r) => r.produit_id === parseInt(carouselSelectedProductId));

  // handleSelectAll défini après displayedRows pour toujours capturer les lignes visibles
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(displayedRows.map((r) => r.produit_id));
    } else {
      setSelectedItems([]);
    }
  };

  // ── Simulation what-if ──────────────────────────────────────────────────────

  const openSim = async (row) => {
    // Charger la liste produits à la demande (première ouverture seulement)
    await fetchProduits();
    const produit = produits.find((p) => p.id === row.produit_id) || {};
    setSimProduit({ ...row, ...produit });
    setSimFields({
      cout_horaire_mod: produit.cout_horaire_mod ?? 0,
      temps_production: produit.temps_production ?? 0,
      quantite_production_mensuelle: produit.quantite_production_mensuelle ?? 0,
    });
    setSimResult(null);
    setFormContainerStyle({ right: "0", width: "42%" });
    setTableContainerStyle({ marginRight: "40%", width: "58%" });
    setSimFormVisible(true);
  };

  const closeForm = () => {
    setFormContainerStyle({ right: "-100%" });
    setTableContainerStyle({ marginRight: "0", width: "100%" });
    setSimFormVisible(false);
    setSimResult(null);
  };

  const handleSimSubmit = async (e) => {
    e.preventDefault();
    if (!simProduit) return;
    setSimLoading(true);
    try {
      const res = await axiosInstance.post(
        `/api/produits/${simProduit.produit_id}/simuler-cout`,
        simFields
      );
      setSimResult(res.data.data);
    } catch (err) {
      Swal.fire("Erreur", "Simulation impossible.", "error");
    } finally {
      setSimLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTableau(page);
    setRefreshing(false);
  };

  // ── Export PDF ────────────────────────────────────────────────────────────────

  const handleExportPDF = () => {
    if (displayedRows.length === 0) {
      Swal.fire("Attention", "Aucune donnée à exporter.", "warning");
      return;
    }

    const doc = new jsPDF("landscape");

    // Titre
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Tableau de bord - Coût de revient des produits", 14, 15);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`, 14, 22);
    doc.text(`Nombre de produits : ${displayedRows.length}`, 14, 28);

    // Tableau
    const tableColumns = [
      { header: "Code", dataKey: "Code_produit" },
      { header: "Désignation", dataKey: "designation" },
      { header: "Catégorie", dataKey: "categorie" },
      { header: "Matieres", dataKey: "cout_matieres" },
      { header: "MOD", dataKey: "cout_mod" },
      { header: "Packaging", dataKey: "cout_packaging" },
      { header: "Charges Ind.", dataKey: "cout_charges_indirectes" },
      { header: "Coût Unit.", dataKey: "cout_unitaire" },
      { header: "Prix Vente", dataKey: "prix_vente" },
      { header: "Marge", dataKey: "marge" },
    ];

    const tableData = displayedRows.map((r) => ({
      Code_produit: r.Code_produit || "",
      designation: r.designation || "",
      categorie: r.categorie || "",
      cout_matieres: Number(r.cout_matieres || 0).toFixed(4),
      cout_mod: Number(r.cout_mod || 0).toFixed(4),
      cout_packaging: Number(r.cout_packaging || 0).toFixed(4),
      cout_charges_indirectes: Number(r.cout_charges_indirectes || 0).toFixed(4),
      cout_unitaire: Number(r.cout_unitaire || 0).toFixed(4),
      prix_vente: r.prix_vente ? Number(r.prix_vente).toFixed(2) : "—",
      marge: r.marge != null ? Number(r.marge).toFixed(2) : "—",
    }));

    doc.autoTable({
      startY: 35,
      columns: tableColumns,
      body: tableData,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [0, 175, 170], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        cout_matieres: { halign: "right" },
        cout_mod: { halign: "right" },
        cout_packaging: { halign: "right" },
        cout_charges_indirectes: { halign: "right" },
        cout_unitaire: { halign: "right", fontStyle: "bold" },
        prix_vente: { halign: "right" },
        marge: { halign: "right" },
      },
    });

    doc.save("cout_revient_produits.pdf");
    Swal.fire({
      icon: "success",
      title: "Exporté !",
      text: "Le PDF a été téléchargé.",
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // ── Colonnes du tableau ─────────────────────────────────────────────────────

  const columns = [
    { id: "Code_produit", label: "CODE",        minWidth: 90  },
    { id: "designation",  label: "DÉSIGNATION", minWidth: 180 },
    { id: "categorie",    label: "CATÉGORIE",   minWidth: 120, render: (r) => r.categorie ?? "—" },
    {
      id: "cout_matieres",
      label: "MATIÈRES",
      minWidth: 110,
      render: (r) => (
        <span style={{ color: "#0891b2", fontWeight: 600 }}>{fmt(r.cout_matieres, 4)}</span>
      ),
    },
    {
      id: "cout_mod",
      label: "MOD",
      minWidth: 100,
      render: (r) => (
        <span style={{ color: "#7c3aed", fontWeight: 600 }}>{fmt(r.cout_mod, 4)}</span>
      ),
    },
    {
      id: "cout_packaging",
      label: "PACKAGING",
      minWidth: 110,
      render: (r) => (
        <span style={{ color: "#d97706", fontWeight: 600 }}>{fmt(r.cout_packaging, 4)}</span>
      ),
    },
    {
      id: "cout_charges_indirectes",
      label: "CHARGES IND.",
      minWidth: 120,
      render: (r) => (
        <span style={{ color: "#dc2626", fontWeight: 600 }}>{fmt(r.cout_charges_indirectes, 4)}</span>
      ),
    },
    {
      id: "cout_unitaire",
      label: "COÛT UNITAIRE",
      minWidth: 130,
      render: (r) => (
        <span
          style={{
            fontWeight: 800,
            fontSize: 15,
            color: "#059669",
            background: "#dcfce7",
            padding: "2px 10px",
            borderRadius: 20,
          }}
        >
          {fmt(r.cout_unitaire, 4)}
        </span>
      ),
    },
    {
      id: "prix_vente",
      label: "PRIX VENTE",
      minWidth: 110,
      render: (r) => (
        <span style={{ color: "#1e40af", fontWeight: 600 }}>{r.prix_vente ? fmt(r.prix_vente, 2) : "—"}</span>
      ),
    },
    {
      id: "marge",
      label: "MARGE",
      minWidth: 160,
      render: (r) => <MargeChip marge={r.marge} margePct={r.marge_pct} />,
    },
    {
      id: "detail_btn",
      label: "DÉTAIL",
      minWidth: 80,
      render: (row, { toggleDetail: td, openDetail }) => (
        <button
          onClick={() => toggleDetail(row.produit_id, "detail")}
          style={{
            border: "none",
            background: openDetail ? "#e0f2f1" : "#f3f4f6",
            color: openDetail ? "#00afaa" : "#6b7280",
            borderRadius: 8,
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
          title="Voir le détail du coût"
        >
          <Calculator size={12} />
          {detailLoading[row.produit_id] ? "..." : "Voir"}
        </button>
      ),
      detailSection: "detail",
    },
  ];

  // ── renderDetail ────────────────────────────────────────────────────────────

  const renderDetail = (row, _rowOpenDetails, _toggleDetailFn) => {
    const data = detailData[row.produit_id];
    if (detailLoading[row.produit_id]) {
      return (
        <div style={{ padding: 20, color: "#9ca3af", textAlign: "center" }}>
          Chargement du détail...
        </div>
      );
    }
    if (!data) return null;
    return (
      <CoutProduitDetail
        detail={data.detail}
        coutUnitaire={data.cout_unitaire}
        prixVente={row.prix_vente}
      />
    );
  };

  // Les openDetails pour TableMui sont indexés par produit_id, mais TableMui
  // utilise row.id. On crée un mapping produit_id → id pour la compatibilité.
  const openDetailsById = {};
  rows.forEach((r) => {
    if (openDetails[r.produit_id]) {
      openDetailsById[r.produit_id] = openDetails[r.produit_id];
    }
  });

  // ── Panneau simulation ──────────────────────────────────────────────────────

  const inputStyle = {
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    padding: "0.5rem 0.8rem",
    fontSize: 14,
    width: "100%",
    background: "#fff",
  };

  const labelStyle = { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block" };

  // ── Rendu ───────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ ...dynamicStyles }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "60px" }}>

        {/* Carousel produits */}
        <ProductCarousel
          products={produits}
          selectedProductId={carouselSelectedProductId}
          onProductSelect={(id) => setCarouselSelectedProductId(id)}
        />

        <div className="container-d-flex justify-content-start" style={{ marginTop: "55px" }}>

          {/* ── Panneau simulation what-if ── */}
          {simFormVisible && (
            <div
              style={{
                ...formContainerStyle,
                position: "fixed",
                bottom: 20,
                right: simFormVisible ? 0 : "-100%",
                width: "40%",
                height: "70vh",
                overflowY: "auto",
                background: "#fff",
                padding: 20,
                borderRadius: "16px 0 0 16px",
                boxShadow: "-5px 0 20px rgba(0,0,0,0.12)",
                zIndex: 999,
                transition: "all 0.3s ease",
              }}
            >
              <h4 style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                Simulation coût
              </h4>
              {simProduit && (
                <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
                  {simProduit.designation} — {simProduit.Code_produit}
                </p>
              )}

              <form onSubmit={handleSimSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Coût horaire MOD (DH/h)</label>
                  <input
                    type="number"
                    step="0.01"
                    style={inputStyle}
                    value={simFields.cout_horaire_mod ?? ""}
                    onChange={(e) => setSimFields((f) => ({ ...f, cout_horaire_mod: e.target.value }))}
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Temps de production (min)</label>
                  <input
                    type="number"
                    step="0.01"
                    style={inputStyle}
                    value={simFields.temps_production ?? ""}
                    onChange={(e) => setSimFields((f) => ({ ...f, temps_production: e.target.value }))}
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Quantité mensuelle produite</label>
                  <input
                    type="number"
                    step="1"
                    style={inputStyle}
                    value={simFields.quantite_production_mensuelle ?? ""}
                    onChange={(e) =>
                      setSimFields((f) => ({ ...f, quantite_production_mensuelle: e.target.value }))
                    }
                  />
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button
                    type="submit"
                    disabled={simLoading}
                    style={{
                      flex: 1,
                      background: "#00afaa",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 0",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {simLoading ? "Calcul..." : "Simuler"}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    style={{
                      flex: 1,
                      background: "#f3f4f6",
                      color: "#374151",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 0",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Fermer
                  </button>
                </div>
              </form>

              {/* Résultat simulation */}
              {simResult && (
                <div
                  style={{
                    marginTop: 20,
                    padding: 16,
                    background: "#f0fdf4",
                    borderRadius: 12,
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <p style={{ fontWeight: 700, color: "#059669", marginBottom: 10 }}>
                    Résultat simulé
                  </p>
                  {[
                    ["Matières", simResult.cout_matieres, "#0891b2"],
                    ["MOD",      simResult.cout_mod,      "#7c3aed"],
                    ["Packaging",simResult.cout_packaging,"#d97706"],
                    ["Charges ind.", simResult.cout_charges_indirectes, "#dc2626"],
                    ["Coût unitaire", simResult.cout_unitaire, "#059669"],
                  ].map(([label, val, color]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                        fontSize: 14,
                      }}
                    >
                      <span style={{ color: "#374151" }}>{label}</span>
                      <span style={{ fontWeight: 700, color }}>{Number(val ?? 0).toFixed(4)} DH</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Tableau principal ── */}
          <TableMui
            columns={columns}
            rows={displayedRows.map((r) => ({ ...r, id: r.produit_id }))}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            produitsFiltres={displayedRows}
            totalPages={totalPages}
            hasActions
            handleEdit={(row) => openSim(row)}
            addButtonText="Exporter PDF"
            tableContainerStyle={{ ...tableContainerStyle, transition: "all 0.3s ease" }}
            selectedItems={selectedItems}
            handleDeleteSelected={handleDeleteSelected}
            handleSelectItem={(row) => handleSelectItem(row.id)}
            handleSelectAll={handleSelectAll}
            AddButton={AddButton}
            FilterToggleButton={FilterToggleButton}
            showFilters={showFilters}
            toggleFilters={() => setShowFilters((v) => !v)}
            handleShowFormButtonClick={handleExportPDF}
            renderDetail={renderDetail}
            openDetails={openDetailsById}
            toggleDetail={(id, section) => toggleDetail(id, section)}
            renderCustomActions={(row) => (
              <button
                onClick={() => handleRefresh()}
                title="Rafraîchir"
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
              >
                <RefreshCw
                  size={14}
                  color={refreshing ? "#00afaa" : "#9ca3af"}
                  style={{ transition: "transform 0.4s", transform: refreshing ? "rotate(360deg)" : "none" }}
                />
              </button>
            )}
          />
        </div>
      </Box>

      {/* Bouton scroll vers le haut */}
      {showScrollTop && (
        <IconButton
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            backgroundColor: "#86d9d4",
            color: "white",
            width: 50,
            height: 50,
            "&:hover": { backgroundColor: "#75c8c3", transform: "scale(1.1)" },
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
          }}
        >
          <ArrowUp size={24} />
        </IconButton>
      )}
    </Box>
  );
};

export default CoutProduitList;
