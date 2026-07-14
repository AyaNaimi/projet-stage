import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Divider,
  Chip, CircularProgress, Alert, Table, TableBody, TableCell,
  TableHead, TableRow, Paper, Tooltip, InputAdornment,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";

const CLR = { primary: "#2c767c", success: "#4caf50", error: "#f44336", warning: "#ff9800", bg: "#f8fafc" };

// ─── Carte d'un poste de coût (réel vs simulé) ───────────────────────────────
const CostCompareCard = ({ label, reel, simule, color }) => {
  const diff = simule - reel;
  const pct  = reel > 0 ? ((diff / reel) * 100).toFixed(1) : null;
  return (
    <Card sx={{ borderRadius: 2, border: `1px solid ${color}20`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
          {label}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>Réel</Typography>
            <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>{reel} DH</Typography>
          </Box>
          <CompareArrowsIcon sx={{ color: "#cbd5e1" }} />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>Simulé</Typography>
            <Typography sx={{ fontWeight: 700, color }}>{simule} DH</Typography>
          </Box>
          {pct !== null && (
            <Chip
              size="small"
              icon={diff >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${diff >= 0 ? "+" : ""}${pct}%`}
              sx={{
                bgcolor: diff >= 0 ? `${CLR.error}15` : `${CLR.success}15`,
                color:   diff >= 0 ? CLR.error : CLR.success,
                fontWeight: 700,
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// ─── Helpers pour normaliser la réponse (perso5 vs projet principal) ──────────
// perso5 : res.data.cout_reel / res.data.cout_simule  (champs plats)
// principal : res.data.data.cout_reel / res.data.data.cout_simule  (enveloppé success/data)
// On supporte les deux.
const normalize = (res) => {
  const d = res.data?.data ?? res.data;
  // Le controller principal retourne {success, simule, overrides, data}
  // → on reconstruit cout_reel / cout_simule à partir de data (simulé) et en
  //   faisant un second appel serait lourd ; on expose directement ce que l'API retourne.
  return d;
};

// ─── Composant principal ─────────────────────────────────────────────────────
const SimulationPage = () => {
  const [produits, setProduits]         = useState([]);
  const [selectedId, setSelectedId]     = useState("");
  const [produit, setProduit]           = useState(null);
  const [result, setResult]             = useState(null);
  const [loading, setLoading]           = useState(false);
  const [fetchingProduits, setFetching] = useState(true);
  const [error, setError]               = useState(null);

  const [params, setParams] = useState({
    cout_horaire_mod: "",
    temps_production: "",
    quantite_production_mensuelle: "",
    grammage: "",
    temps_machine: "",
  });

  const { dynamicStyles } = useOpen();
  const { setTitle }      = useHeader();

  useEffect(() => { setTitle("Simulation — Impact des coûts"); }, [setTitle]);

  useEffect(() => {
    axiosInstance.get("/api/produits")
      .then((res) => {
        const list = res.data?.produit ?? res.data ?? [];
        setProduits(Array.isArray(list) ? list : []);
      })
      .catch(() => setProduits([]))
      .finally(() => setFetching(false));
  }, []);

  const handleSelectProduit = (id) => {
    setSelectedId(id);
    setResult(null);
    const p = produits.find((x) => x.id === id);
    setProduit(p ?? null);
    if (p) {
      setParams({
        cout_horaire_mod:               p.cout_horaire_mod              ?? "",
        temps_production:               p.temps_production               ?? "",
        quantite_production_mensuelle:  p.quantite_production_mensuelle  ?? "",
        grammage:                       p.grammage                       ?? "",
        temps_machine:                  p.temps_machine                  ?? "",
      });
    }
  };

  const handleParamChange = (field, value) =>
    setParams((prev) => ({ ...prev, [field]: value }));

  const handleSimuler = async () => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      // D'abord on récupère le coût réel
      const reelRes = await axiosInstance.get(`/api/produits/${selectedId}/cout-unitaire`);
      const reelData = reelRes.data?.data ?? reelRes.data;

      // Ensuite la simulation (overrides)
      const payload = Object.fromEntries(
        Object.entries(params)
          .filter(([, v]) => v !== "")
          .map(([k, v]) => [k, Number(v)])
      );
      const simRes  = await axiosInstance.post(`/api/produits/${selectedId}/simuler-cout`, payload);
      const simData = simRes.data?.data ?? simRes.data;

      // Normaliser les champs pour l'affichage (compatibilité perso5 & principal)
      const coutReel = {
        cout_unitaire:    reelData.cout_unitaire,
        cout_matiere:     reelData.cout_matieres    ?? reelData.cout_matiere    ?? 0,
        cout_mod:         reelData.cout_mod         ?? 0,
        cout_packaging:   reelData.cout_packaging   ?? 0,
        cout_charges_ind: reelData.cout_charges_indirectes ?? reelData.cout_charges_ind ?? 0,
        detail_matieres:  reelData.detail?.matieres?.lignes ?? [],
      };
      const coutSimule = {
        cout_unitaire:    simData.cout_unitaire,
        cout_matiere:     simData.cout_matieres    ?? simData.cout_matiere    ?? 0,
        cout_mod:         simData.cout_mod         ?? 0,
        cout_packaging:   simData.cout_packaging   ?? 0,
        cout_charges_ind: simData.cout_charges_indirectes ?? simData.cout_charges_ind ?? 0,
        detail_matieres:  simData.detail?.matieres?.lignes ?? [],
      };

      const diff    = coutSimule.cout_unitaire - coutReel.cout_unitaire;
      const diffPct = coutReel.cout_unitaire > 0
        ? ((diff / coutReel.cout_unitaire) * 100).toFixed(2)
        : 0;

      setResult({
        designation:   reelData.designation ?? produit?.designation,
        cout_reel:     coutReel,
        cout_simule:   coutSimule,
        difference:    parseFloat(diff.toFixed(4)),
        difference_pct: parseFloat(diffPct),
      });
    } catch (e) {
      setError(e.response?.data?.error ?? e.response?.data?.message ?? "Erreur lors de la simulation.");
    } finally {
      setLoading(false);
    }
  };

  const postes = [
    { key: "cout_matiere",     label: "Matières premières", color: CLR.primary },
    { key: "cout_mod",         label: "Main-d'œuvre",        color: "#2196f3" },
    { key: "cout_packaging",   label: "Packaging",           color: CLR.warning },
    { key: "cout_charges_ind", label: "Charges indirectes",  color: "#9c27b0" },
  ];

  const fields = [
    { key: "cout_horaire_mod",              label: "Coût horaire MOD",   suffix: "DH/h",   step: 0.01 },
    { key: "temps_production",              label: "Temps production",   suffix: "min",     step: 0.001 },
    { key: "quantite_production_mensuelle", label: "Qté mensuelle",      suffix: "unités",  step: 1 },
    { key: "grammage",                      label: "Grammage",           suffix: "g",       step: 0.01 },
    { key: "temps_machine",                 label: "Temps machine",      suffix: "h",       step: 0.01 },
  ];

  return (
    <Box sx={{ ...dynamicStyles, bgcolor: CLR.bg }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: "64px" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", mb: 3 }}>
          Simulation en temps réel
        </Typography>

        <Grid container spacing={3}>
          {/* ── Panneau paramètres ── */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ borderRadius: 3, p: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: CLR.primary }}>
                Paramètres de simulation
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Produit</InputLabel>
                <Select
                  value={selectedId}
                  label="Produit"
                  onChange={(e) => handleSelectProduit(e.target.value)}
                  disabled={fetchingProduits}
                >
                  {produits.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.designation}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {produit && (
                <>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                      Modifier les paramètres à simuler
                    </Typography>
                  </Divider>

                  <Grid container spacing={2}>
                    {fields.map(({ key, label, suffix, step }) => (
                      <Grid item xs={6} key={key}>
                        <TextField
                          fullWidth size="small" label={label}
                          type="number" inputProps={{ step }}
                          value={params[key]}
                          InputProps={{ endAdornment: <InputAdornment position="end">{suffix}</InputAdornment> }}
                          onChange={(e) => handleParamChange(key, e.target.value)}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  <Button
                    fullWidth variant="contained"
                    startIcon={loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <PlayArrowIcon />}
                    onClick={handleSimuler}
                    disabled={loading}
                    sx={{ mt: 3, bgcolor: CLR.primary, "&:hover": { bgcolor: "#235e63" }, borderRadius: 2, fontWeight: 700 }}
                  >
                    {loading ? "Calcul en cours…" : "Lancer la simulation"}
                  </Button>
                </>
              )}
            </Paper>
          </Grid>

          {/* ── Résultats ── */}
          <Grid item xs={12} md={7}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!result && !loading && (
              <Box sx={{
                borderRadius: 3, border: "2px dashed #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 300, color: "#94a3b8",
              }}>
                <Box sx={{ textAlign: "center" }}>
                  <CompareArrowsIcon sx={{ fontSize: 48, opacity: 0.4 }} />
                  <Typography sx={{ mt: 1 }}>Sélectionnez un produit et lancez la simulation</Typography>
                </Box>
              </Box>
            )}

            {result && (
              <Box>
                {/* Résumé global */}
                <Paper sx={{ borderRadius: 3, p: 3, mb: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#1e293b" }}>
                    {result.designation}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4} sx={{ textAlign: "center" }}>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>Coût réel</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: CLR.primary }}>
                        {result.cout_reel?.cout_unitaire} DH
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "center" }}>
                      <CompareArrowsIcon sx={{ fontSize: 36, color: "#cbd5e1", mt: 1 }} />
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "center" }}>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>Coût simulé</Typography>
                      <Typography variant="h5" sx={{
                        fontWeight: 700,
                        color: result.difference <= 0 ? CLR.success : CLR.error,
                      }}>
                        {result.cout_simule?.cout_unitaire} DH
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Chip
                      size="medium"
                      icon={result.difference <= 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
                      label={`${result.difference >= 0 ? "+" : ""}${result.difference} DH (${result.difference_pct >= 0 ? "+" : ""}${result.difference_pct}%)`}
                      sx={{
                        bgcolor: result.difference <= 0 ? `${CLR.success}15` : `${CLR.error}15`,
                        color:   result.difference <= 0 ? CLR.success : CLR.error,
                        fontWeight: 700, fontSize: "0.95rem", px: 1,
                      }}
                    />
                  </Box>
                </Paper>

                {/* Comparaison par poste */}
                <Grid container spacing={2}>
                  {postes.map((p) => (
                    <Grid item xs={12} sm={6} key={p.key}>
                      <CostCompareCard
                        label={p.label}
                        reel={result.cout_reel?.[p.key] ?? 0}
                        simule={result.cout_simule?.[p.key] ?? 0}
                        color={p.color}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Détail matières simulées */}
                {result.cout_simule?.detail_matieres?.length > 0 && (
                  <Paper sx={{ borderRadius: 3, mt: 3, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <Box sx={{ p: 2, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569" }}>
                        Détail matières (simulé)
                      </Typography>
                    </Box>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {["Matière", "Quantité", "Perte", "Prix", "Coût"].map((h) => (
                            <TableCell key={h} sx={{ fontWeight: 600, color: "#64748b" }}>{h}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.cout_simule.detail_matieres.map((m, i) => (
                          <TableRow key={i} hover>
                            <TableCell>{m.nom}</TableCell>
                            <TableCell>{m.quantite}</TableCell>
                            <TableCell>{m.perte_pct ?? m.perte} %</TableCell>
                            <TableCell sx={{ color: CLR.primary, fontWeight: 600 }}>
                              {m.prix_achat_unitaire ?? m.prix} DH
                            </TableCell>
                            <TableCell>{m.cout} DH</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SimulationPage;
