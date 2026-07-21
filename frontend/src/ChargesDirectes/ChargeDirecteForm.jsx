
import React from 'react';
import { Form, Button, Tab, Tabs } from 'react-bootstrap';
import { Clock, Tag, Barcode, DollarSign, Calendar, Info, LineChart } from 'lucide-react';

// Extracted outside to avoid remounting
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
  formContainerStyle
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
              <StyledFormGroup icon={<Tag size={18} />} label="Désignation du Produit" htmlFor="designation">
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
              <StyledFormGroup icon={<Barcode size={18} />} label="Code Référence" htmlFor="Code_produit">
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
          <Tab eventKey="configuration" title={<span><Clock className="me-2" size={16} />Main d'œuvre</span>}>
            <Form onSubmit={handleSubmit} style={{ padding: '0 1rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <StyledFormGroup icon={<DollarSign size={18} />} label="Coût Horaire MOD (DH)" htmlFor="cout_horaire_mod">
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
                <div style={{ flex: 1 }}>
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
              </div>


              <div style={{ 
                background: '#f0fdfa', 
                borderRadius: '1rem', 
                padding: '1.5rem', 
                border: '1px solid #ccfbf1',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}>
                <div style={{ background: '#00afaa', padding: '0.75rem', borderRadius: '0.75rem', color: '#fff' }}>
                  <LineChart size={24} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: '#0f766e', fontWeight: 500 }}>Coût MOD Unitaire Estimé</div>
                  <div style={{ fontSize: '1.5rem', color: '#0d9488', fontWeight: 800 }}>
                    {(((formData.cout_horaire_mod || 0) * (formData.temps_production || 0)) / 60).toFixed(2)} DH
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center mt-4 mb-5">
                <Button type="submit" className="btn-primary-custom mx-2" disabled={loading}>
                  {loading ? 'Chargement...' : (formData.id ? 'Modifier' : 'Enregistrer')}
                </Button>
                <Button type="button" className="btn-secondary-custom mx-2" onClick={closeForm}>
                  Annuler
                </Button>
              </div>
            </Form>
          </Tab>

          <Tab eventKey="details" title={<span><Info className="me-2" size={16} />Informations</span>}>
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <Info size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>Configuration des charges directes liées à la main d'œuvre directe (MOD).</p>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ChargeDirecteForm;

/*
import React, { useState, useEffect } from 'react';
import { Form, Button, Tab, Tabs, Table } from 'react-bootstrap';
import { Clock, Tag, Barcode, DollarSign, Package, Layers, FileText } from 'lucide-react';
import axiosInstance from "../axiosInstance";

const StyledFormGroup = React.memo(({ icon, label, htmlFor, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
    <label htmlFor={htmlFor} style={{ fontWeight: 600, color: '#374151', fontSize: '0.8rem', marginBottom: 2, display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: 6, color: '#00afaa' }}>{icon}</span>
      {label}
    </label>
    {children}
  </div>
));

const ChargeDirecteForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading = false,
  closeForm,
  formContainerStyle
}) => {
  const [tabKey, setTabKey] = useState('matieres');
  const [recetteIngredients, setRecetteIngredients] = useState([]);
  const [packagingData, setPackagingData] = useState({ film_opp: 0, carton: 0, etiquette: 0 });

  useEffect(() => {
    if (formData && formData.id) {
      // Recette Backend
      axiosInstance.get(`/api/recettes/${formData.id}`)
        .then(res => setRecetteIngredients(res.data?.ingredients || []))
        .catch(() => setRecetteIngredients([]));

      // Packaging Backend
      axiosInstance.get(`/api/packagings/${formData.id}`)
        .then(res => setPackagingData(res.data || { film_opp: 0, carton: 0, etiquette: 0 }))
        .catch(() => setPackagingData({ film_opp: 0, carton: 0, etiquette: 0 }));
    }
  }, [formData?.id]);

  // --- LOGIQUE CALCUL SIMILAIRE FICHE PRODUIT ---
  const calculCoutMatieres = () => {
    if (!Array.isArray(recetteIngredients)) return 0;
    return recetteIngredients.reduce((total, ing) => {
      const qte = ing?.quantite || 0;
      const prix = ing?.prix_achat || 0;
      const perte = ing?.pourcentage_perte || 0;
      return total + ((qte * prix) * (1 + perte / 100));
    }, 0);
  };

  const coutMODUnitaire = formData ? (((formData.cout_horaire_mod || 0) * (formData.temps_production || 0)) / 60) : 0;
  const coutPackagingUnitaire = Number(packagingData?.film_opp || 0) + Number(packagingData?.carton || 0) + Number(packagingData?.etiquette || 0);
  const coutDirectTotal = calculCoutMatieres() + coutMODUnitaire + coutPackagingUnitaire;

  const inputStyle = { borderRadius: '0.375rem', border: '1px solid #cbd5e1', padding: '0.4rem 0.75rem', fontSize: 14 };

  if (!formData || !formData.id) {
    return (
      <div style={{ ...formContainerStyle, background: '#fff', padding: '20px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center', color: '#64748b' }}>
        Sélectionnez un produit pour voir sa Fiche de Charges Directes.
      </div>
    );
  }

  return (
    <div style={{ ...formContainerStyle, position: 'absolute', top: 0, height: 'auto', maxHeight: '600px', overflowY: 'auto', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      
      
      <div style={{ borderBottom: '2px solid #00afaa', paddingBottom: '8px', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
          <FileText size={18} color="#00afaa" />
          FICHE PRODUIT: {formData.designation.toUpperCase()}
        </div>
        <span style={{ fontSize: '11px', color: '#64748b' }}>Réf: {formData.Code_produit}</span>
      </div>

      <Tabs id="charge-tabs" activeKey={tabKey} onSelect={(k) => setTabKey(k)} className="mb-3 nav-tabs" variant="tabs">
        
        <Tab eventKey="matieres" title={<span><Layers size={14} className="me-1"/>Matières</span>}>
          <Table size="sm" bordered hover style={{ fontSize: '12px', marginTop: '5px' }}>
            <thead className="table-light">
              <tr>
                <th>Ingrédient</th>
                <th>Qté</th>
                <th>Perte</th>
                <th>Prix / Unit</th>
                <th>Coût U.</th>
              </tr>
            </thead>
            <tbody>
              {recetteIngredients.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted">Aucun ingrédient défini.</td></tr>
              ) : (
                recetteIngredients.map((ing, i) => {
                  const q = ing?.quantite || 0;
                  const p = ing?.prix_achat || 0;
                  const pt = ing?.pourcentage_perte || 0;
                  const cU = (q * p) * (1 + pt / 100);
                  return (
                    <tr key={i}>
                      <td>{ing.nom}</td>
                      <td>{q} {ing.unite || 'g'}</td>
                      <td className="text-danger">+{pt}%</td>
                      <td>{p.toFixed(2)} DH</td>
                      <td className="text-end fw-bold">{cU.toFixed(3)} DH</td>
                    </tr>
                  );
                })
              )}
              <tr className="table-info fw-bold">
                <td colSpan="4">TOTAL COÛT MATIÈRES PREMIÈRES:</td>
                <td className="text-end">{calculCoutMatieres().toFixed(3)} DH</td>
              </tr>
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="mod" title={<span><Clock size={14} className="me-1"/>Main d'œuvre</span>}>
          <Form style={{ padding: '5px 0' }}>
            <div className="row g-2">
              <div className="col-6">
                <StyledFormGroup icon={<DollarSign size={14} />} label="Coût Horaire MOD (DH)">
                  <input type="number" step="0.01" name="cout_horaire_mod" value={formData.cout_horaire_mod || ''} onChange={handleChange} className="form-control" style={inputStyle} />
                </StyledFormGroup>
              </div>
              <div className="col-6">
                <StyledFormGroup icon={<Clock size={14} />} label="Temps Prod (Min)">
                  <input type="number" name="temps_production" value={formData.temps_production || ''} onChange={handleChange} className="form-control" style={inputStyle} />
                </StyledFormGroup>
              </div>
            </div>
            <div className="p-2 rounded bg-light text-secondary style-row" style={{ fontSize: '12px', marginTop: '5px' }}>
              <strong>Calcul MOD:</strong> ({formData.cout_horaire_mod || 0} DH * {formData.temps_production || 0} Min) / 60 = <span className="text-dark fw-bold">{coutMODUnitaire.toFixed(3)} DH / Unité</span>
            </div>
          </Form>
        </Tab>

        <Tab eventKey="packaging" title={<span><Package size={14} className="me-1"/>Packaging</span>}>
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', padding: '5px 0' }}>
            <div className="d-flex justify-content-between p-2 bg-light rounded">
              <span>Film OPP:</span><strong>{Number(packagingData?.film_opp || 0).toFixed(3)} DH</strong>
            </div>
            <div className="d-flex justify-content-between p-2 bg-light rounded">
              <span>Carton / Boite:</span><strong>{Number(packagingData?.carton || 0).toFixed(3)} DH</strong>
            </div>
            <div className="d-flex justify-content-between p-2 bg-light rounded">
              <span>Étiquettes:</span><strong>{Number(packagingData?.etiquette || 0).toFixed(3)} DH</strong>
            </div>
            <div className="d-flex justify-content-between p-2 table-info fw-bold rounded" style={{ fontSize: '13px' }}>
              <span>TOTAL PACKAGING:</span><span>{coutPackagingUnitaire.toFixed(3)} DH</span>
            </div>
          </div>
        </Tab>
      </Tabs>

      <div style={{ background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '12px', marginTop: '15px', borderLeft: '4px solid #00afaa' }}>
        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.5px' }}>TOTAL CHARGES DIRECTES UNITAIRE:</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>{coutDirectTotal.toFixed(3)} DH</div>
          </div>
          <Button size="sm" variant="success" onClick={handleSubmit} disabled={loading} style={{ background: '#00afaa', border: 'none', padding: '6px 16px', fontWeight: 600 }}>
            {loading ? '...' : 'Valider'}
          </Button>
        </div>
      </div>

    </div>
  );
};

export default ChargeDirecteForm;
*/