import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Tag, DollarSign, Package, Truck, History, Scale } from 'lucide-react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from '../axiosInstance';
import Swal from 'sweetalert2';

const StyledFormGroup = React.memo(({ icon, label, htmlFor, children, extra }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label htmlFor={htmlFor} style={{ fontWeight: 500, color: '#4b5563', fontSize: '0.875rem ', marginBottom: 2, display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 6, color: '#4b5563', fontSize: 16 }}>
          {icon}
        </span>
        {label}
      </label>
      {extra}
    </div>
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
  familles = [],
  types = [],
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
        Swal.fire("Erreur", "Veuillez remplir les champs obligatoires (Nom et Code)", "error");
        return;
      }

      if (editingFournisseur) {
        await axios.put(`/api/fournisseurs/${editingFournisseur.id}`, newFournisseur);
        Swal.fire("Succès", "Fournisseur modifié", "success");
      } else {
        await axios.post(`/api/fournisseurs`, newFournisseur);
        Swal.fire("Succès", "Fournisseur ajouté", "success");
      }

      setNewFournisseur({ nom: '', raison_sociale: '', CodeFournisseur: '', tele: '', email: '' });
      setEditingFournisseur(null);
      if (fetchFournisseurs) fetchFournisseurs();
    } catch (error) {
      console.error("Error saving fournisseur:", error);
      const message = error.response?.data?.message || error.response?.data?.error || "Une erreur est survenue";
      Swal.fire("Erreur", message, "error");
    }
  };

  const handleEditFournisseur = (f) => {
    setEditingFournisseur(f);
    setNewFournisseur({
      nom: f.nom || '',
      CodeFournisseur: f.CodeFournisseur,
      tele: f.tele || '',
      email: f.email || ''
    });
  };

  const handleDeleteFournisseur = async (id) => {
    const result = await Swal.fire({
      title: 'Supprimer ?',
      text: "Action irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/fournisseurs/${id}`);
        Swal.fire('Supprimé !', '', 'success');
        if (fetchFournisseurs) fetchFournisseurs();
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
          .styled-input::placeholder { color: #9ca3af !important; opacity: 1 !important; font-size: 15px !important; }
          .is-invalid { border-color: #dc3545 !important; box-shadow: 0 0 0 0.1rem rgba(220, 53, 69, 0.1); }
          .cursor-pointer { cursor: pointer; }
        `}
      </style>

      <div
        id="formContainerMatiere"
        style={{
          ...formContainerStyle,
          marginTop: '0px',
          height: `calc(100vh - 70px)`,
          overflow: 'auto',
          background: '#f9fafb',
          padding: '20px',
          borderLeft: '1px solid #e5e7eb',
          borderRadius: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}
      >
        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '1rem'
        }}>
          <h4 style={{ marginBottom: '1.5rem', fontWeight: 600, color: '#111827', borderBottom: '2px solid #00afaa', paddingBottom: '10px' }}>
            {formData.id ? 'Modifier' : 'Ajouter'} une Matière Première
          </h4>



          <Form onSubmit={handleSubmit}>


            <StyledFormGroup icon={<Tag size={18} />} label="Nom de la matière *" htmlFor="nom">
              <input
                id="nom"
                className={`form-control styled-input ${errors.nom ? 'is-invalid' : ''}`}
                style={inputStyle}
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Ex: Farine, Sucre..."
              />
              {errors.nom && <div className="text-danger" style={{ fontSize: 13 }}>{errors.nom}</div>}
            </StyledFormGroup>

            <StyledFormGroup icon={<DollarSign size={18} />} label="Prix d'achat *" htmlFor="prix_achat">
              <input
                id="prix_achat"
                className={`form-control styled-input ${errors.prix_achat ? 'is-invalid' : ''}`}
                style={inputStyle}
                type="number"
                step="0.01"
                name="prix_achat"
                value={formData.prix_achat}
                onChange={handleChange}
                placeholder="0.00"
              />
              {errors.prix_achat && <div className="text-danger" style={{ fontSize: 13 }}>{errors.prix_achat}</div>}
            </StyledFormGroup>

            <StyledFormGroup icon={<Scale size={18} />} label="Unité *" htmlFor="unite">
              <select
                id="unite"
                name="unite"
                value={formData.unite}
                onChange={handleChange}
                style={inputStyle}
                className={`form-select ${errors.unite ? 'is-invalid' : ''}`}
              >
                <option value="">Sélectionner une unité</option>
                <option value="kg">Kilogramme (kg)</option>
                <option value="L">Litre (L)</option>
                <option value="unite">Unité</option>
              </select>
              {errors.unite && <div className="text-danger" style={{ fontSize: 13 }}>{errors.unite}</div>}
            </StyledFormGroup>

            <StyledFormGroup
              icon={<Truck size={18} />}
              label="Fournisseur *"
              htmlFor="fournisseur_id"
              extra={
                <div
                  className="cursor-pointer"
                  onClick={() => setShowFournisseurModal(true)}
                  style={{
                    color: '#00afaa',
                    border: '1px solid #00afaa',
                    borderRadius: '50%',
                    width: 24, height: 24,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} size="xs" />
                </div>
              }
            >
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
                    placeholder="Sélectionner un fournisseur"
                    variant="outlined"
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: '0.5rem',
                        height: '45px',
                        backgroundColor: '#fff',
                      }
                    }}
                  />
                )}
              />
              {errors.fournisseur_id && <div className="text-danger" style={{ fontSize: 13 }}>{errors.fournisseur_id}</div>}
            </StyledFormGroup>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button
                type="submit"
                style={{ backgroundColor: '#00afaa', border: 'none', padding: '0.6rem 2.5rem', borderRadius: '0.5rem', fontWeight: 600 }}
              >
                Valider
              </Button>
              <Button
                variant="secondary"
                onClick={closeForm}
                style={{ padding: '0.6rem 2.5rem', borderRadius: '0.5rem', fontWeight: 600 }}
              >
                Annuler
              </Button>
            </div>
          </Form>
        </div>

        {formData.historiques && formData.historiques.length > 0 && (
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h5 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#374151' }}>
              <History size={20} /> Historique des prix
            </h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead><tr><th>Date</th><th>Prix</th></tr></thead>
                <tbody>
                  {formData.historiques.map((hist, idx) => (
                    <tr key={idx}>
                      <td>{new Date(hist.created_at).toLocaleDateString()}</td>
                      <td>{hist.prix} DH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal show={showFournisseurModal} onHide={() => setShowFournisseurModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Gestion Fournisseurs</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="row mb-4">
            <div className="col-md-6 mb-2">
              <label className="form-label small fw-bold">Code</label>
              <input type="text" className="form-control" value={newFournisseur.CodeFournisseur} onChange={e => setNewFournisseur({ ...newFournisseur, CodeFournisseur: e.target.value })} />
            </div>
            <div className="col-md-6">
              <div className="row g-3">
                <div className="col-md-12">
                  <Form.Group className="mb-2">
                    <Form.Label>Nom *</Form.Label>
                    <Form.Control
                      type="text"
                      value={newFournisseur.nom}
                      onChange={(e) => setNewFournisseur({ ...newFournisseur, nom: e.target.value })}
                    />
                  </Form.Group>
                </div>
              </div>
            </div>
            <div className="col-md-12 text-center mt-3">
              <Button variant="primary" size="sm" onClick={handleAddFournisseur}>{editingFournisseur ? 'Modifier' : 'Ajouter'}</Button>
              {editingFournisseur && <Button variant="link" size="sm" onClick={() => { setEditingFournisseur(null); setNewFournisseur({ nom: '', raison_sociale: '', CodeFournisseur: '', tele: '', email: '' }) }}>Annuler</Button>}
            </div>
          </div>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            <table className="table table-sm border">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Nom</th>

                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fournisseurs.map(f => (
                  <tr key={f.id}>
                    <td>{f.CodeFournisseur}</td>
                    <td>{f.nom}</td>

                    <td>
                      <FontAwesomeIcon icon={faEdit} className="text-primary me-2 cursor-pointer" onClick={() => handleEditFournisseur(f)} />
                      <FontAwesomeIcon icon={faTrash} className="text-danger cursor-pointer" onClick={() => handleDeleteFournisseur(f.id)} />
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
