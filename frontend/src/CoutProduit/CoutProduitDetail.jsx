import React, { useState } from "react";
import { ChevronDown, ChevronRight, Package, Clock, Layers, AlertCircle } from "lucide-react";

/**
 * Panneau de détail du coût d'un produit.
 * Affiche le décomposition traçable : matières, MOD, packaging, charges indirectes.
 */
const Section = ({ title, icon, total, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          padding: "8px 14px",
          borderRadius: 8,
          background: "#f0fafa",
          userSelect: "none",
        }}
      >
        <span style={{ color: "#00afaa" }}>{icon}</span>
        <span style={{ flex: 1, fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{title}</span>
        <span style={{ fontWeight: 700, color: "#00afaa", fontSize: 14, minWidth: 80, textAlign: "right" }}>
          {Number(total).toFixed(4)} DH
        </span>
        <span style={{ color: "#6b7280", marginLeft: 6 }}>
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </div>
      {open && (
        <div
          style={{
            marginTop: 6,
            padding: "8px 14px",
            background: "#fafafa",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const Chip = ({ label, color = "#e0f2f1", textColor = "#007a6b" }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 20,
      background: color,
      color: textColor,
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    {label}
  </span>
);

const CoutProduitDetail = ({ detail, coutUnitaire, prixVente }) => {
  if (!detail) return null;

  const { matieres, mod, packaging, charges_indirectes } = detail;

  const marge = prixVente ? prixVente - coutUnitaire : null;
  const margePct =
    prixVente && coutUnitaire > 0
      ? (((prixVente - coutUnitaire) / coutUnitaire) * 100).toFixed(1)
      : null;

  return (
    <div style={{ padding: "16px 24px" }}>

      {/* Résumé bannière */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
          padding: "14px 20px",
          background: "linear-gradient(135deg, #e0fafa 0%, #f0fff4 100%)",
          borderRadius: 12,
          border: "1px solid #b2dfdb",
        }}
      >
        {[
          { label: "Matières", value: matieres?.total, color: "#0891b2" },
          { label: "MOD", value: mod?.total, color: "#7c3aed" },
          { label: "Packaging", value: packaging?.total, color: "#d97706" },
          { label: "Charges ind.", value: charges_indirectes?.total, color: "#dc2626" },
          { label: "Coût unitaire", value: coutUnitaire, color: "#059669", bold: true },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center", minWidth: 110 }}>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{item.label}</div>
            <div
              style={{
                fontSize: item.bold ? 18 : 15,
                fontWeight: item.bold ? 800 : 700,
                color: item.color,
              }}
            >
              {Number(item.value ?? 0).toFixed(4)} DH
            </div>
          </div>
        ))}
        {prixVente != null && (
          <>
            <div style={{ textAlign: "center", minWidth: 90 }}>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Prix vente</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1e40af" }}>
                {Number(prixVente).toFixed(2)} DH
              </div>
            </div>
            {marge != null && (
              <div style={{ textAlign: "center", minWidth: 90 }}>
                <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>Marge</div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: marge >= 0 ? "#16a34a" : "#dc2626",
                  }}
                >
                  {marge >= 0 ? "+" : ""}
                  {Number(marge).toFixed(2)} DH
                  {margePct && (
                    <span style={{ fontSize: 11, marginLeft: 4 }}>({margePct}%)</span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Matières premières */}
      <Section
        title="Matières premières"
        icon={<Package size={16} />}
        total={matieres?.total ?? 0}
        defaultOpen
      >
        {matieres?.lignes?.length > 0 ? (
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                {["Matière", "Qté nominale", "Perte %", "Qté réelle achat", "Prix achat", "Coût"].map((h) => (
                  <th key={h} style={{ padding: "4px 8px", textAlign: "left", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matieres.lignes.map((l, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "4px 8px", fontWeight: 500 }}>{l.nom}</td>
                  <td style={{ padding: "4px 8px" }}>{l.quantite} {l.unite}</td>
                  <td style={{ padding: "4px 8px" }}>
                    <Chip
                      label={`${l.perte_pct}%`}
                      color={l.perte_pct > 0 ? "#fef3c7" : "#f0fdf4"}
                      textColor={l.perte_pct > 0 ? "#92400e" : "#166534"}
                    />
                  </td>
                  <td style={{ padding: "4px 8px", color: "#d97706", fontWeight: 600 }}>
                    {l.quantite_reelle_achat} {l.unite}
                  </td>
                  <td style={{ padding: "4px 8px" }}>{l.prix_achat_unitaire} DH</td>
                  <td style={{ padding: "4px 8px", fontWeight: 700, color: "#0891b2" }}>
                    {Number(l.cout).toFixed(4)} DH
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>Aucune matière première définie.</p>
        )}
      </Section>

      {/* MOD */}
      <Section title="Main d'Œuvre Directe (MOD)" icon={<Clock size={16} />} total={mod?.total ?? 0}>
        <div style={{ fontSize: 13, color: "#374151" }}>
          <p style={{ margin: "4px 0" }}>
            <strong>Temps production :</strong> {mod?.temps_minutes ?? 0} min
          </p>
          <p style={{ margin: "4px 0" }}>
            <strong>Taux horaire :</strong> {mod?.taux_horaire ?? 0} DH/h
          </p>
          <p style={{ margin: "4px 0", color: "#6b7280", fontStyle: "italic" }}>
            Formule : {mod?.formule ?? "—"}
          </p>
        </div>
      </Section>

      {/* Packaging */}
      <Section title="Packaging (étiquette + emballages)" icon={<Package size={16} />} total={packaging?.total ?? 0}>
        {packaging?.lignes?.length > 0 ? (
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                {["Rôle", "Désignation", "Coût"].map((h) => (
                  <th key={h} style={{ padding: "4px 8px", textAlign: "left", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {packaging.lignes.map((l, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "4px 8px" }}>
                    <Chip label={l.role} color="#fef9c3" textColor="#713f12" />
                  </td>
                  <td style={{ padding: "4px 8px" }}>{l.designation}</td>
                  <td style={{ padding: "4px 8px", fontWeight: 700, color: "#d97706" }}>
                    {Number(l.cout).toFixed(4)} DH
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>Aucun composant de packaging défini.</p>
        )}
      </Section>

      {/* Charges indirectes */}
      <Section
        title="Charges indirectes (répartition)"
        icon={<Layers size={16} />}
        total={charges_indirectes?.total ?? 0}
      >
        {charges_indirectes?.raison ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#92400e",
              background: "#fef3c7",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            <AlertCircle size={14} />
            {charges_indirectes.raison}
          </div>
        ) : charges_indirectes?.lignes?.length > 0 ? (
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                {["Charge", "Montant mensuel", "Méthode", "Part produit / Base", "Coût alloué/mois", "Coût unitaire"].map((h) => (
                  <th key={h} style={{ padding: "4px 8px", textAlign: "left", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {charges_indirectes.lignes.map((l, i) => {
                const methodLabels = {
                  quantite: "Quantité",
                  volume: "Volume",
                  temps_machine: "Temps machine",
                };
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "4px 8px", fontWeight: 500 }}>{l.nom}</td>
                    <td style={{ padding: "4px 8px" }}>{Number(l.montant_mensuel).toFixed(2)} DH</td>
                    <td style={{ padding: "4px 8px" }}>
                      <Chip label={methodLabels[l.methode_repartition] ?? l.methode_repartition} />
                    </td>
                    <td style={{ padding: "4px 8px", fontFamily: "monospace", fontSize: 12 }}>
                      {Number(l.part_produit).toFixed(2)} / {Number(l.base_totale).toFixed(2)}
                    </td>
                    <td style={{ padding: "4px 8px" }}>{Number(l.cout_alloue_mensuel).toFixed(4)} DH</td>
                    <td style={{ padding: "4px 8px", fontWeight: 700, color: "#dc2626" }}>
                      {Number(l.cout_unitaire).toFixed(6)} DH
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>Aucune charge indirecte configurée.</p>
        )}
      </Section>
    </div>
  );
};

export default CoutProduitDetail;
