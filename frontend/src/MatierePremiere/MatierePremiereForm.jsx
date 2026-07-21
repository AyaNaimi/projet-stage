import React, { useState } from 'react';
import { Form, Button, Modal, Tab, Tabs } from 'react-bootstrap';
import { Tag, DollarSign, Scale, Truck, History, Info, Package, Plus, Edit3, Trash2 } from 'lucide-react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

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

const MatierePremiereForm = ({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  errors,
  fournisseurs,
  closeForm,
  formContainerStyle,
  fetchFournisseurs
}) => {
  const [tabKey, setTabKey] = useState('details');
  const [showFournisseurModal, setShowFournisseurModal] = useState(false);
  const [editingFournisseur, setEditingFournisseur] = useState(null);
  const [newFournisseur, setNewFournisseur] = useState({
    nom: '',
    raison_sociale: '',
    CodeFournisseur: '',
    tele: '',
    email: ''
  });

  const handleAddFournisseur = async () => {
    try {
      if (!newFournisseur.nom || !newFournisseur.CodeFournisseur) {
        Swal.fire("Erreur", "Veuillez remplir les champs obligatoires", "error");
        return;
      }
      if (editingFournisseur) {
        await axiosInstance.put(`/api/fournisseurs/${editingFournisseur.id}`, newFournisseur);
      } else {
        await axiosInstance.post(`/api/fournisseurs`, newFournisseur);
      }
      setNewFournisseur({ nom: '', raison_sociale: '', CodeFournisseur: '', tele: '', email: '' });
      setEditingFournisseur(null);
      if (fetchFournisseurs) fetchFournisseurs();
      Swal.fire("Succès", "Opération réussie", "success");
    } catch (error) {
      Swal.fire("Erreur", "Une erreur est survenue", "error");
    }
  };

  const handleDeleteFournisseur = async (id) => {
    const result = await Swal.fire({
      title: 'Supprimer ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui'
    });
    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/api/fournisseurs/${id}`);
        if (fetchFournisseurs) fetchFournisseurs();
        Swal.fire('Supprimé !', '', 'success');
      } catch (error) {
        Swal.fire("Erreur", "Échec suppression", "error");
      }
    }
  };

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
          
          .styled-select {
            color: #000 !important;
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
        {/* Top Section */}
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
          <div style={{ flex: 1 }}>
            <StyledFormGroup icon={<Tag size={18} />} label="Nom de la Matière" htmlFor="nom">
              <input
                id="nom"
                name="nom"
                value={formData.nom || ''}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Ex: Farine, Sucre..."
                className={`form-control styled-input ${errors.nom ? 'is-invalid' : ''}`}
              />
            </StyledFormGroup>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs
          id="matiere-form-tabs"
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
          <Tab eventKey="details" title={<span><Info className="me-2" size={16} />Détails & Prix</span>}>
            <Form onSubmit={handleSubmit} style={{ padding: '0 1rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <StyledFormGroup icon={<DollarSign size={18} />} label="Prix d'achat (DH)" htmlFor="prix_achat">
                    <input
                      id="prix_achat"
                      type="number"
                      step="0.01"
                      name="prix_achat"
                      value={formData.prix_achat || ''}
                      onChange={handleChange}
                      style={inputStyle}
                      placeholder="0.00"
                      className={`form-control styled-input ${errors.prix_achat ? 'is-invalid' : ''}`}
                    />
                  </StyledFormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  <StyledFormGroup icon={<Scale size={18} />} label="Unité" htmlFor="unite">
                    <select
                      id="unite"
                      name="unite"
                      value={formData.unite || ''}
                      onChange={handleChange}
                      style={inputStyle}
                      className={`form-select styled-select ${errors.unite ? 'is-invalid' : ''}`}
                    >
                      <option value="">Sélectionner</option>
                      <option value="kg">Kilogramme (kg)</option>
                      <option value="L">Litre (L)</option>
                      <option value="unite">Unité</option>
                    </select>
                  </StyledFormGroup>
                </div>
              </div>

              <div className="d-flex justify-content-center mt-5 mb-5">
                <Button type="submit" className="btn-primary-custom mx-2">
                  {formData.id ? 'Modifier' : 'Enregistrer'}
                </Button>
                <Button type="button" className="btn-secondary-custom mx-2" onClick={closeForm}>
                  Annuler
                </Button>
              </div>
            </Form>
          </Tab>

          <Tab eventKey="fournisseur" title={<span><Truck className="me-2" size={16} />Fournisseur</span>}>
            <div style={{ padding: '0 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <StyledFormGroup icon={<Truck size={18} />} label="Sélectionner Fournisseur" htmlFor="fournisseur_id" />
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => setShowFournisseurModal(true)}
                  style={{ borderRadius: '0.5rem', marginBottom: 15 }}
                >
                  <Plus size={14} className="me-1" /> Nouveau Fournisseur
                </Button>
              </div>
              
              <Autocomplete
                options={fournisseurs}
                getOptionLabel={(option) => option.nom || option.raison_sociale || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, fournisseur_id: newValue ? newValue.id : '' });
                }}
                value={fournisseurs.find(f => f.id === formData.fournisseur_id) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Rechercher un fournisseur"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '0.5rem',
                        backgroundColor: '#fff',
                      }
                    }}
                  />
                )}
              />
              {errors.fournisseur_id && <div className="text-danger mt-1">{errors.fournisseur_id}</div>}
            </div>
          </Tab>

          <Tab eventKey="historique" title={<span><History className="me-2" size={16} />Historique</span>}>
            <div style={{ padding: '1rem' }}>
              {formData.historiques && formData.historiques.length > 0 ? (
                <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  <table className="table table-hover mb-0">
                    <thead style={{ background: '#f9fafb' }}>
                      <tr>
                        <th style={{ padding: '12px', color: '#64748b' }}>Date</th>
                        <th style={{ padding: '12px', color: '#64748b' }}>Prix d'achat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.historiques.map((h, i) => (
                        <tr key={i}>
                          <td style={{ padding: '12px' }}>{new Date(h.created_at).toLocaleDateString()}</td>
                          <td style={{ padding: '12px', fontWeight: 600, color: '#00afaa' }}>{h.prix} DH</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                  <History size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                  <p>Aucun historique de prix disponible.</p>
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>

      <Modal show={showFournisseurModal} onHide={() => setShowFournisseurModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.1rem', fontWeight: 700 }}>Gestion des Fournisseurs</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#f8fafc', padding: '24px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Code Fournisseur</Form.Label>
                <Form.Control 
                  style={inputStyle}
                  value={newFournisseur.CodeFournisseur} 
                  onChange={e => setNewFournisseur({ ...newFournisseur, CodeFournisseur: e.target.value })} 
                />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <Form.Label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Nom / Raison Sociale</Form.Label>
                <Form.Control 
                  style={inputStyle}
                  value={newFournisseur.nom} 
                  onChange={e => setNewFournisseur({ ...newFournisseur, nom: e.target.value })} 
                />
              </div>
            </div>
            <div className="text-end mt-3">
              <Button className="btn-primary-custom" size="sm" onClick={handleAddFournisseur}>
                {editingFournisseur ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </div>
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <table className="table table-hover mb-0">
              <thead style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ padding: '12px' }}>Code</th>
                  <th style={{ padding: '12px' }}>Nom</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fournisseurs.map(f => (
                  <tr key={f.id}>
                    <td style={{ padding: '12px' }}>{f.CodeFournisseur}</td>
                    <td style={{ padding: '12px' }}>{f.nom || f.raison_sociale}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => { setEditingFournisseur(f); setNewFournisseur(f); }} style={{ border: 'none', background: '#f1f5f9', padding: '6px', borderRadius: '6px', color: '#007bff' }}>
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteFournisseur(f.id)} style={{ border: 'none', background: '#fef2f2', padding: '6px', borderRadius: '6px', color: '#ef4444' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MatierePremiereForm;
