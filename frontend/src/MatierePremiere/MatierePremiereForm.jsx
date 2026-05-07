import React, { useState } from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { Tag, DollarSign, Scale, Truck, History, Plus, Edit3, Trash2 } from 'lucide-react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

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
    background: '#f9fafb',
    color: '#000',
  };

  const sectionStyle = {
    background: '#fff',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1rem',
    border: '1px solid #e5e7eb',
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: '0.85rem',
    color: '#475569',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  return (
    <div
      id="formContainerunique"
      className=""
      style={{ 
        ...formContainerStyle, 
        marginTop: '-0px', 
        height: `calc(100vh - 115px)`, 
        top: '115px',
        overflow: 'auto',
        zIndex: 1050
      }}
    >
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#00afaa',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Tag size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
              {formData.id ? 'Modifier Matière Première' : 'Nouvelle Matière Première'}
            </span>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>
              Gestion des stocks et des prix d'achat
            </div>
          </div>
        </div>
        <Button variant="link" onClick={closeForm} style={{ color: '#64748b', textDecoration: 'none', fontSize: '1.5rem', lineHeight: 1 }}>&times;</Button>
      </div>

      <div style={{ background: '#f1f5f9', padding: '24px', overflowY: 'auto', height: 'calc(100% - 140px)' }}>
        <Form onSubmit={handleSubmit} id="matiereForm">
          <div style={sectionStyle}>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label style={labelStyle}><Tag size={14} /> Nom de la Matière</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom"
                    value={formData.nom || ''}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Ex: Farine, Sucre..."
                    isInvalid={!!errors.nom}
                  />
                  {errors.nom && <Form.Control.Feedback type="invalid">{errors.nom}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}><DollarSign size={14} /> Prix d'achat (DH)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="prix_achat"
                    value={formData.prix_achat || ''}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="0.00"
                    isInvalid={!!errors.prix_achat}
                  />
                  {errors.prix_achat && <Form.Control.Feedback type="invalid">{errors.prix_achat}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}><Scale size={14} /> Unité</Form.Label>
                  <Form.Select
                    name="unite"
                    value={formData.unite || ''}
                    onChange={handleChange}
                    style={inputStyle}
                    isInvalid={!!errors.unite}
                  >
                    <option value="">Sélectionner</option>
                    <option value="kg">Kilogramme (kg)</option>
                    <option value="L">Litre (L)</option>
                    <option value="unite">Unité</option>
                  </Form.Select>
                  {errors.unite && <Form.Control.Feedback type="invalid">{errors.unite}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div style={sectionStyle}>
            <Form.Group>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Form.Label style={{ ...labelStyle, marginBottom: 0 }}><Truck size={14} /> Fournisseur</Form.Label>
                <button
                  type="button"
                  onClick={() => setShowFournisseurModal(true)}
                  style={{
                    background: 'none',
                    border: '1px solid #00afaa',
                    color: '#00afaa',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={12} /> Nouveau
                </button>
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
                        backgroundColor: '#f9fafb',
                      }
                    }}
                  />
                )}
              />
              {errors.fournisseur_id && <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>{errors.fournisseur_id}</div>}
            </Form.Group>
          </div>

          {formData.historiques && formData.historiques.length > 0 && (
            <div style={sectionStyle}>
              <h6 style={{ ...labelStyle, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '12px' }}>
                <History size={14} /> Historique des Prix
              </h6>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table className="table table-sm mb-0" style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th style={{ color: '#64748b', fontWeight: 500 }}>Date</th>
                      <th style={{ color: '#64748b', fontWeight: 500 }}>Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.historiques.map((h, i) => (
                      <tr key={i}>
                        <td style={{ color: '#334155' }}>{new Date(h.created_at).toLocaleDateString()}</td>
                        <td style={{ color: '#0f766e', fontWeight: 600 }}>{h.prix} DH</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Form>
      </div>

      <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '10px', position: 'absolute', bottom: 0, width: '100%', left: 0 }}>
        <Button
          variant="light"
          onClick={closeForm}
          style={{
            padding: '8px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            border: '1px solid #e2e8f0',
            color: '#475569'
          }}
        >
          Annuler
        </Button>
        <Button 
          form="matiereForm"
          type="submit" 
          style={{ 
            background: '#00afaa', 
            border: 'none', 
            padding: '8px 32px', 
            borderRadius: '8px', 
            fontWeight: 700,
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0, 175, 170, 0.2)'
          }}
        >
          {formData.id ? 'Enregistrer les modifications' : 'Ajouter au stock'}
        </Button>
      </div>

      <Modal show={showFournisseurModal} onHide={() => setShowFournisseurModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.1rem', fontWeight: 700 }}>Gestion des Fournisseurs</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#f8fafc', padding: '24px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label style={labelStyle}>Code Fournisseur</Form.Label>
                <Form.Control 
                  style={inputStyle}
                  value={newFournisseur.CodeFournisseur} 
                  onChange={e => setNewFournisseur({ ...newFournisseur, CodeFournisseur: e.target.value })} 
                />
              </Col>
              <Col md={6}>
                <Form.Label style={labelStyle}>Nom / Raison Sociale</Form.Label>
                <Form.Control 
                  style={inputStyle}
                  value={newFournisseur.nom} 
                  onChange={e => setNewFournisseur({ ...newFournisseur, nom: e.target.value })} 
                />
              </Col>
              <Col md={12} className="text-end">
                <Button variant="primary" style={{ background: '#00afaa', border: 'none', borderRadius: '8px', padding: '6px 20px' }} onClick={handleAddFournisseur}>
                  {editingFournisseur ? 'Mettre à jour' : 'Ajouter le fournisseur'}
                </Button>
              </Col>
            </Row>
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
