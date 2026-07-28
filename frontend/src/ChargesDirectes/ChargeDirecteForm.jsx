import React from 'react';
import { Form, Button, Tab, Tabs } from 'react-bootstrap';
import { Clock, Tag, Barcode, DollarSign, Calendar, Info, LineChart, Package, Trash2, Plus, History } from 'lucide-react';

const StyledFormGroup = React.memo(({ icon, label, htmlFor, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
    <label htmlFor={htmlFor} style={{ fontWeight: 500, color: '#4b5563', fontSize: '0.875rem ', marginBottom: 2, display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: 6, color: '#4b5563', fontSize: 16 }}>
        {icon}
      </span>
      {label}
    </label>
    {children}
  </div>
));

const ChargeDirecteForm = ({
  formData,
  handleChange,
  handleSubmit,
  errors,
  loading = false,
  closeForm,
  formContainerStyle,
  packagingLignes = [],
  packagingsDisponibles = [],
  onAddPackagingLigne,
  onRemovePackagingLigne,
  onPackagingLigneChange,
  historique = [],
  coutLot = 0,
  onVerifierCoherence,
}) => {
  const [tabKey, setTabKey] = React.useState('configuration');

  const inputStyle = {
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    padding: '0.6rem 1rem',
    fontSize: 15,
    background: '#fff',
    color: '#000',
  };

  return (
    <div style={{ marginTop: "45px" }}>
      <style>
        {`
          .styled-input::placeholder {
            color: #9ca3af !important;
            opacity: 1 !important;
            font-size: 15px !important;
          }
          .btn-primary-custom {
            background-color: #00afaa !important;
            color: #fff !important;
            border-radius: 0.375rem !important;
            font-weight: 500 !important;
            padding: 0.5rem 3rem !important;
            border: none !important;
            transition: background-color 0.15s;
          }
          .btn-primary-custom:hover:not(:disabled) {
            background-color: #009691 !important;
          }
          .btn-secondary-custom {
            background-color: gray !important;
            color: #fff !important;
            border-radius: 0.375rem !important;
            font-weight: 500 !important;
            padding: 0.5rem 3rem !important;
            border: none !important;
            transition: background-color 0.15s;
          }
          .is-invalid {
            border-color: #dc3545 !important;
            box-shadow: 0 0 0 0.1rem rgba(220, 53, 69, 0.1);
          }
        `}
      </style>

      <div
        id="formContainerunique"
        style={{
          ...formContainerStyle,
          marginTop: '-0px',
          height: `calc(99.6vh - 300px)`,
          overflow: 'auto',
          zIndex: 1050
        }}
      >
        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '0.7rem 2rem',
          marginBottom: '0.7rem',
          display: 'flex',
          flexDirection: 'row',
          gap: '1.5rem',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          minHeight: 0
        }}>
          <div style={{ flex: 1, display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <StyledFormGroup icon={<Tag size={18} />} label="Designation du Produit" htmlFor="designation">
                <input
                  id="designation"
                  name="designation"
                  value={formData.designation || ''}
                  readOnly
                  style={{ ...inputStyle, backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                  className="form-control styled-input"
                />
              </StyledFormGroup>
            </div>
            <div style={{ flex: 1 }}>
              <StyledFormGroup icon={<Barcode size={18} />} label="Code Reference" htmlFor="Code_produit">
                <input
                  id="Code_produit"
                  name="Code_produit"
                  value={formData.Code_produit || ''}
                  readOnly
                  style={{ ...inputStyle, backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                  className="form-control styled-input"
                />
              </StyledFormGroup>
            </div>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Tabs
            id="charge-directe-tabs"
            activeKey={tabKey}
            onSelect={(k) => setTabKey(k)}
            className="mb-4 nav-tabs"
            style={{
              justifyContent: 'center',
              position: 'sticky',
              top: '-1%',
              backgroundColor: '#fff',
              zIndex: 100,
              marginLeft: '-0.5%',
              marginRight: '-0.7%'
            }}
          >
            <Tab eventKey="configuration" title={<span><Clock className="me-2" size={16} />Main d oeuvre</span>}>
              <div style={{ padding: '0 1rem' }}>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
  <div style={{ flex: 1, minWidth: '180px' }}>
    <StyledFormGroup icon={<DollarSign size={18} />} label="Cout Horaire MOD (DH)" htmlFor="cout_horaire_mod">
      <input
        id="cout_horaire_mod"
        type="number"
        name="cout_horaire_mod"
        value={formData.cout_horaire_mod || ''}
        onChange={handleChange}
        placeholder="0.00"
        style={inputStyle}
        className="form-control styled-input"
      />
    </StyledFormGroup>
  </div>
  <div style={{ flex: 1, minWidth: '180px' }}>
    <StyledFormGroup icon={<Calendar size={18} />} label="Temps Production (Min)" htmlFor="temps_production">
      <input
        id="temps_production"
        type="number"
        name="temps_production"
        value={formData.temps_production || ''}
        onChange={handleChange}
        placeholder="0"
        style={inputStyle}
        className="form-control styled-input"
      />
    </StyledFormGroup>
  </div>
  <div style={{ flex: 1, minWidth: '180px' }}>
    <StyledFormGroup icon={<Calendar size={18} />} label="Perte MOD (%)" htmlFor="perte_mod">
      <input
        id="perte_mod"
        type="number"
        step="0.01"
        name="perte_mod"
        value={formData.perte_mod || ''}
        onChange={handleChange}
        placeholder="0"
        style={inputStyle}
        className="form-control styled-input"
      />
    </StyledFormGroup>
  </div>
  <div style={{ flex: 1, minWidth: '180px' }}>
    <StyledFormGroup icon={<DollarSign size={18} />} label="Prix de Vente (DH)" htmlFor="prix_vente">
      <input
        id="prix_vente"
        type="number"
        step="0.01"
        name="prix_vente"
        value={formData.prix_vente || ''}
        onChange={handleChange}
        placeholder="0.00"
        style={inputStyle}
        className="form-control styled-input"
      />
    </StyledFormGroup>
  </div>
</div>

                {/* COUT TOTAL PAR LOT */}
                <div style={{
                  background: '#f0fdfa',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid #ccfbf1',
                  marginBottom: '1rem',
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#0f766e', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                      Quantite pour le lot
                    </label>
                    <input
                      type="number"
                      name="quantiteLot"
                      value={formData.quantiteLot || 1}
                      onChange={handleChange}
                      placeholder="1"
                      style={{
                        borderRadius: '0.5rem',
                        border: '1px solid #d1d5db',
                        padding: '0.6rem 1rem',
                        fontSize: 15,
                        background: '#fff',
                        color: '#000',
                        width: '100%'
                      }}
                      className="form-control styled-input"
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: '150px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#0f766e', fontWeight: 500 }}>Cout Total du Lot</div>
                    <div style={{ fontSize: '1.8rem', color: '#0d9488', fontWeight: 800 }}>
                      {Number(coutLot || 0).toFixed(2)} DH
                    </div>
                  </div>
                </div>

                {/* HISTORIQUE MOD */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '1rem',
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <History size={18} color="#475569" />
                    <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                      Historique MOD
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: 'auto' }}>
                      {historique.length} modification{historique.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {historique.length === 0 ? (
                    <p style={{ color: '#94a3b8', textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem' }}>
                      Aucun historique MOD disponible
                    </p>
                  ) : (
                    <div style={{ overflow: 'auto', maxHeight: '200px' }}>
                      <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                        <thead>
  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
    <th style={{ textAlign: 'left', padding: '0.3rem 0.4rem', color: '#64748b', fontWeight: 600 }}>Date</th>
    <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#64748b', fontWeight: 600 }}>MOD/H</th>
    <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#64748b', fontWeight: 600 }}>Temps</th>
    <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#64748b', fontWeight: 600 }}>Perte</th>
    <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#64748b', fontWeight: 600 }}>Quantite</th>
    <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#64748b', fontWeight: 600 }}>Cout Total</th>
    <th style={{ textAlign: 'center', padding: '0.3rem 0.4rem', color: '#64748b', fontWeight: 600 }}>Statut</th>
  </tr>
</thead>
                        <tbody>
  {historique.map((item) => (
    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '0.3rem 0.4rem', color: '#334155' }}>
        {new Date(item.date_debut).toLocaleDateString()}
      </td>
      <td style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#334155' }}>
        {parseFloat(item.cout_horaire_mod) || 0}
      </td>
      <td style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#334155' }}>
        {parseFloat(item.temps_production) || 0}
      </td>
      <td style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#334155' }}>
        {parseFloat(item.perte_mod) || 0}   {/* ← ICI */}
      </td>
      <td style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#334155' }}>
        {parseFloat(item.quantite) || 1}
      </td>
      <td style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#334155' }}>
        {parseFloat(item.cout_total || 0).toFixed(2)}
      </td>
      <td style={{ textAlign: 'center', padding: '0.3rem 0.4rem' }}>
        {item.date_fin === null ? (
          <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.7rem' }}>Actif</span>
        ) : (
          <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Ancien</span>
        )}
      </td>
    </tr>
  ))}
</tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </Tab>

            <Tab eventKey="packaging" title={<span><Package className="me-2" size={16} />Packaging</span>}>
              <div style={{ padding: '0 1rem' }}>
                {packagingLignes.length === 0 ? (
                  <p style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>
                    Aucun packaging associe.
                  </p>
                ) : null}

                {packagingLignes.map((ligne, index) => {
                  const packagingSelectionne = packagingsDisponibles.find(p => p.id === parseInt(ligne.packaging_id));
                  const prixUnitaire = packagingSelectionne && packagingSelectionne.prix_produits_last ? packagingSelectionne.prix_produits_last.prixProduit : 0;
                  const coutLigne = (ligne.quantite || 0) * prixUnitaire;

                  return (
                    <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 4, display: 'block' }}>Packaging</label>
                        <select
                          value={ligne.packaging_id}
                          onChange={(e) => onPackagingLigneChange(index, 'packaging_id', e.target.value)}
                          className="form-control"
                          style={{ borderRadius: '0.5rem', border: '1px solid #d1d5db', padding: '0.5rem' }}
                        >
                          <option value="">-- Choisir --</option>
                          {packagingsDisponibles.map(p => (
                            <option key={p.id} value={p.id}>{p.designation}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 4, display: 'block' }}>Quantite</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={ligne.quantite}
                          onChange={(e) => onPackagingLigneChange(index, 'quantite', e.target.value)}
                          className="form-control"
                          style={{ borderRadius: '0.5rem', border: '1px solid #d1d5db', padding: '0.5rem' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 4, display: 'block' }}>Perte (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={ligne.perte}
                          onChange={(e) => onPackagingLigneChange(index, 'perte', e.target.value)}
                          className="form-control"
                          style={{ borderRadius: '0.5rem', border: '1px solid #d1d5db', padding: '0.5rem' }}
                        />
                      </div>
                      <div style={{ flex: 1, textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, color: '#0d9488', paddingBottom: '0.6rem' }}>
                        {coutLigne.toFixed(3)} DH
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemovePackagingLigne(index)}
                        style={{ border: 'none', background: 'transparent', color: '#dc3545', cursor: 'pointer', paddingBottom: '0.5rem' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}

                <Button
                  type="button"
                  onClick={onAddPackagingLigne}
                  style={{ backgroundColor: 'transparent', border: '1px dashed #00afaa', color: '#00afaa', width: '100%', marginBottom: '1.5rem' }}
                >
                  <Plus size={16} className="me-1" /> Ajouter une ligne
                </Button>
              </div>
            </Tab>

            <Tab eventKey="details" title={<span><Info className="me-2" size={16} />Informations</span>}>
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                <Info size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                
                {formData.id && onVerifierCoherence && (
      <Button
        type="button"
        onClick={onVerifierCoherence}
        style={{ backgroundColor: '#0d9488', border: 'none', marginTop: '1rem' }}
      >
        Verifier la coherence du calcul
      </Button>
    )}
              </div>
            </Tab>
          </Tabs>

          <div className="d-flex justify-content-center mt-4 mb-5">
            <Button type="submit" className="btn-primary-custom mx-2" disabled={loading}>
              {loading ? 'Chargement...' : (formData.id ? 'Modifier' : 'Enregistrer')}
            </Button>
            <Button type="button" className="btn-secondary-custom mx-2" onClick={closeForm}>
              Annuler
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChargeDirecteForm;