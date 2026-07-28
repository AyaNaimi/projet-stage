import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import {
  Box, Card, CardContent, Typography, Grid, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Chip,
  CircularProgress, Alert, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, InputAdornment, LinearProgress, Tooltip,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EuroIcon from "@mui/icons-material/Euro";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";

const CLR = {
  primary: "#2c767c",
  success: "#4caf50",
  error:   "#f44336",
  warning: "#ff9800",
  info:    "#2196f3",
  bg:      "#f8fafc",
};

// ─── Carte résultat ───────────────────────────────────────────────────────────
const ResultCard = ({ label, value, sub, color, icon: Icon, tooltip }) => (
  <Card sx={{
    borderRadius: 3,
    border: `1px solid ${color}20`,
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""', position: "absolute",
      top: 0, left: 0, right: 0, height: 4, background: color,
    },
  }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
              {label}
            </Typography>
            {tooltip && (
              <Tooltip title={tooltip}>
                <InfoOutlinedIcon sx={{ fontSize: 14, color: "#94a3b8", cursor: "help" }} />
              </Tooltip>
            )}
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color }}>
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>{sub}</Typography>
          )}
        </Box>
        <Box sx={{ bgcolor: `${color}15`, borderRadius: 2, p: 1 }}>
          <Icon sx={{ color, fontSize: 28 }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// ─── Jauge de marge ───────────────────────────────────────────────────────────
const MargeGauge = ({ taux }) => {
  const clamped  = Math.max(-100, Math.min(100, taux ?? 0));
  const positive = clamped >= 0;
  const color    = clamped >= 20 ? CLR.success : clamped >= 0 ? CLR.warning : CLR.error;
  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: "#64748b" }}>Taux de marge</Typography>
        <Typography variant="caption" sx={{ fontWeight: 700, color }}>{clamped} %</Typography>
      </Box>
      <Box sx={{ position: "relative", height: 10, bgcolor: "#e2e8f0", borderRadius: 5, overflow: "hidden" }}>
        <Box sx={{
          position: "absolute",
          left: positive ? "50%" : `${50 + clamped / 2}%`,
          width: `${Math.abs(clamped) / 2}%`,
          height: "100%",
          bgcolor: color,
          borderRadius: 5,
          transition: "all 0.4s ease",
        }} />
        <Box sx={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, bgcolor: "#94a3b8" }} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>-100%</Typography>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>0</Typography>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>+100%</Typography>
      </Box>
    </Box>
  );
};

// ─── Helper normalisation réponse ─────────────────────────────────────────────
// Le controller principal retourne { success, data: { ... } }
// perso5 retournait les champs directement à la racine.
// On supporte les deux formats.
const normalizeResult = (raw) => {
  const d = raw?.data ?? raw;
  return {
    designation:         d.designation,
    cout_unitaire:       d.cout_unitaire,
    cout_matiere:        d.cout_matiere  ?? d.cout_matieres ?? 0,
    cout_mod:            d.cout_mod      ?? 0,
    cout_packaging:      d.cout_packaging ?? 0,
    cout_charges_ind:    d.cout_charges_ind ?? d.cout_charges_indirectes ?? 0,
    prix_vente:          d.prix_vente,
    marge_unitaire:      d.marge_unitaire,
    taux_marge:          d.taux_marge,
    taux_markup:         d.taux_markup,
    prix_min_conseille:  d.prix_min_conseille,
    marge_cible_pct:     d.marge_cible_pct,
    rentable:            d.rentable,
    detail_cout:         d.detail_cout ?? d.detail ?? {},
  };
};

// ─── Composant principal ──────────────────────────────────────────────────────
const PricingMargesPage = () => {
  const [produits, setProduits]         = useState([]);
  const [selectedId, setSelectedId]     = useState("");
  const [prixVente, setPrixVente]       = useState("");
  const [margeCible, setMargeCible]     = useState(20);
  const [result, setResult]             = useState(null);
  const [loading, setLoading]           = useState(false);
  const [fetchingProduits, setFetching] = useState(true);
  const [error, setError]               = useState(null);

  const { dynamicStyles } = useOpen();
  const { setTitle }      = useHeader();

  useEffect(() => { setTitle("Pricing & Marges"); }, [setTitle]);

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
    if (p?.prix_vente) setPrixVente(p.prix_vente);
  };

  const handleCalculer = async () => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post(`/api/produits/${selectedId}/pricing`, {
        prix_vente:      Number(prixVente),
        marge_cible_pct: Number(margeCible),
      });
      setResult(normalizeResult(res.data));
    } catch (e) {
      setError(e.response?.data?.error ?? e.response?.data?.message ?? "Erreur lors du calcul.");
    } finally {
      setLoading(false);
    }
  };

  const scenarios = result
    ? [0.5, 1, 1.5, 2, 2.5, 5].map((prix) => {
        const marge = result.cout_unitaire > 0
          ? ((prix - result.cout_unitaire) / prix) * 100
          : null;
        return { prix, marge: marge?.toFixed(1) ?? null, rentable: prix >= result.cout_unitaire };
      })
    : [];

  return (
    <Box sx={{ ...dynamicStyles, bgcolor: CLR.bg }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: "64px" }}>

        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", mb: 3 }}>
          Pricing &amp; Marges
        </Typography>

        <Grid container spacing={3}>

          {/* ── Panneau saisie ── */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ borderRadius: 3, p: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: CLR.primary, mb: 2 }}>
                Paramètres
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

              <TextField
                fullWidth label="Prix de vente"
                type="number" inputProps={{ min: 0, step: 0.01 }}
                value={prixVente}
                onChange={(e) => setPrixVente(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">DH</InputAdornment> }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                  Marge cible : <strong>{margeCible} %</strong>
                </Typography>
                <Box sx={{ px: 1 }}>
                  <input
                    type="range" min={0} max={60} step={1}
                    value={margeCible}
                    onChange={(e) => setMargeCible(Number(e.target.value))}
                    style={{ width: "100%", accentColor: CLR.primary }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>0%</Typography>
                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>60%</Typography>
                  </Box>
                </Box>
              </Box>

              <Button
                fullWidth variant="contained"
                startIcon={loading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : <CalculateIcon />}
                onClick={handleCalculer}
                disabled={loading || !selectedId || prixVente === ""}
                sx={{ bgcolor: CLR.primary, "&:hover": { bgcolor: "#235e63" }, borderRadius: 2, fontWeight: 700 }}
              >
                {loading ? "Calcul…" : "Calculer"}
              </Button>

              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

              {/* Prix psychologiques */}
              <Box sx={{ mt: 3, p: 2, bgcolor: `${CLR.info}08`, borderRadius: 2, border: `1px solid ${CLR.info}20` }}>
                <Typography variant="caption" sx={{ color: CLR.info, fontWeight: 600 }}>
                  💡 Prix psychologiques (marché marocain)
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                  {[0.5, 1, 1.5, 2, 2.5, 5].map((p) => (
                    <Chip
                      key={p} label={`${p} DH`} size="small"
                      onClick={() => setPrixVente(p)}
                      sx={{
                        cursor: "pointer",
                        bgcolor: Number(prixVente) === p ? CLR.primary : "#e2e8f0",
                        color:   Number(prixVente) === p ? "#fff" : "#475569",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* ── Résultats ── */}
          <Grid item xs={12} md={8}>
            {!result && !loading && (
              <Box sx={{
                borderRadius: 3, border: "2px dashed #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 300, color: "#94a3b8",
              }}>
                <Box sx={{ textAlign: "center" }}>
                  <EuroIcon sx={{ fontSize: 48, opacity: 0.4 }} />
                  <Typography sx={{ mt: 1 }}>
                    Sélectionnez un produit et entrez un prix de vente
                  </Typography>
                </Box>
              </Box>
            )}

            {result && (
              <Box>
                {/* Titre + statut */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    {result.designation}
                  </Typography>
                  {result.rentable
                    ? <Chip icon={<CheckCircleIcon />} label="Rentable" size="small"
                        sx={{ bgcolor: `${CLR.success}15`, color: CLR.success, fontWeight: 700 }} />
                    : <Chip icon={<CancelIcon />} label="Non rentable" size="small"
                        sx={{ bgcolor: `${CLR.error}15`, color: CLR.error, fontWeight: 700 }} />
                  }
                </Box>

                {/* KPI cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <ResultCard label="Coût unitaire" value={`${result.cout_unitaire} DH`}
                      icon={EuroIcon} color={CLR.primary} tooltip="Coût de revient calculé automatiquement" />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <ResultCard label="Prix de vente" value={`${result.prix_vente} DH`}
                      icon={EuroIcon} color={CLR.info} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <ResultCard label="Marge brute"
                      value={`${result.marge_unitaire} DH`}
                      icon={result.marge_unitaire >= 0 ? TrendingUpIcon : TrendingDownIcon}
                      color={result.marge_unitaire >= 0 ? CLR.success : CLR.error}
                      sub="par unité" />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <ResultCard label="Prix min conseillé"
                      value={result.prix_min_conseille != null ? `${result.prix_min_conseille} DH` : "—"}
                      icon={CalculateIcon} color={CLR.warning}
                      tooltip={`Avec ${result.marge_cible_pct}% de marge cible`}
                      sub={`Marge cible : ${result.marge_cible_pct}%`} />
                  </Grid>
                </Grid>

                {/* Jauge */}
                <Paper sx={{ borderRadius: 3, p: 3, mb: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <MargeGauge taux={result.taux_marge} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {[
                          { label: "Taux de marge",  value: result.taux_marge  != null ? `${result.taux_marge} %`  : "—",
                            color: result.taux_marge >= 20 ? CLR.success : result.taux_marge >= 0 ? CLR.warning : CLR.error },
                          { label: "Taux de markup", value: result.taux_markup != null ? `${result.taux_markup} %` : "—",
                            color: CLR.info, tooltip: "Marge / Coût × 100" },
                        ].map((r) => (
                          <Box key={r.label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Typography variant="body2" sx={{ color: "#64748b" }}>{r.label}</Typography>
                              {r.tooltip && (
                                <Tooltip title={r.tooltip}>
                                  <InfoOutlinedIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                                </Tooltip>
                              )}
                            </Box>
                            <Typography sx={{ fontWeight: 700, color: r.color }}>{r.value}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Composition du coût */}
                <Paper sx={{ borderRadius: 3, p: 3, mb: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 2 }}>
                    Composition du coût de revient
                  </Typography>
                  {[
                    { label: "Matières premières", value: result.cout_matiere     ?? 0, color: CLR.primary },
                    { label: "Main-d'œuvre (MOD)", value: result.cout_mod         ?? 0, color: CLR.info },
                    { label: "Packaging",           value: result.cout_packaging   ?? 0, color: CLR.warning },
                    { label: "Charges indirectes",  value: result.cout_charges_ind ?? 0, color: "#9c27b0" },
                  ].map((item) => {
                    const pct = result.cout_unitaire > 0
                      ? ((item.value / result.cout_unitaire) * 100).toFixed(1)
                      : 0;
                    return (
                      <Box key={item.label} sx={{ mb: 1.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography variant="body2" sx={{ color: "#475569" }}>{item.label}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: item.color }}>
                            {item.value} DH ({pct}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(Number(pct), 100)}
                          sx={{
                            height: 6, borderRadius: 3, bgcolor: "#e2e8f0",
                            "& .MuiLinearProgress-bar": { bgcolor: item.color, borderRadius: 3 },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Paper>

                {/* Tableau scénarios */}
                <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <Box sx={{ p: 2, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569" }}>
                      Comparaison scénarios de prix
                    </Typography>
                  </Box>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {["Prix de vente", "Marge unitaire", "Taux de marge", "Statut"].map((h) => (
                          <TableCell key={h} sx={{ fontWeight: 600, color: "#64748b" }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scenarios.map((s) => {
                        const marge = s.prix - result.cout_unitaire;
                        return (
                          <TableRow key={s.prix}
                            sx={{ bgcolor: Number(result.prix_vente) === s.prix ? `${CLR.primary}08` : "transparent", "& td": { py: 1 } }}
                            hover
                          >
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontWeight: Number(result.prix_vente) === s.prix ? 700 : 400 }}>
                                  {s.prix} DH
                                </Typography>
                                {Number(result.prix_vente) === s.prix && (
                                  <Chip label="Actuel" size="small"
                                    sx={{ bgcolor: `${CLR.primary}20`, color: CLR.primary, fontSize: "0.65rem" }} />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ color: marge >= 0 ? CLR.success : CLR.error, fontWeight: 600 }}>
                              {marge.toFixed(4)} DH
                            </TableCell>
                            <TableCell sx={{ color: s.marge >= 0 ? CLR.success : CLR.error, fontWeight: 600 }}>
                              {s.marge != null ? `${s.marge} %` : "—"}
                            </TableCell>
                            <TableCell>
                              {s.rentable
                                ? <Chip label="Rentable" size="small"
                                    sx={{ bgcolor: `${CLR.success}15`, color: CLR.success, fontWeight: 600 }} />
                                : <Chip label="Perte" size="small"
                                    sx={{ bgcolor: `${CLR.error}15`, color: CLR.error, fontWeight: 600 }} />
                              }
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PricingMargesPage;
