import React from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { Plus, List, Tag, Barcode } from 'lucide-react';
import TableForms from '../etat/TableForms';

const RecetteForm = ({
  show,
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  errors,
  matierePremieres,
  closeForm
}) => {
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

  return (
    <Modal 
      show={show} 
      onHide={closeForm} 
      size="xl" 
      centered
      backdrop="static"
      className="custom-recette-modal"
    >
      <Modal.Header closeButton style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <Modal.Title style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <List size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
              {formData.id ? 'Modifier la Fiche Technique' : 'Nouvelle Fiche Technique'}
            </span>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>
              {formData.designation || 'Sélectionner un produit'}
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ background: '#f1f5f9', padding: '24px' }}>
        <Form onSubmit={handleSubmit} id="recetteForm">
          <div style={sectionStyle}>
            <div style={{ display: 'flex', gap: '20px' }}>
               <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={14} /> Désignation du Produit
                  </label>
                  <Form.Control
                    type="text"
                    name="designation"
                    value={formData.designation || ''}
                    onChange={handleChange}
                    placeholder="Désignation"
                    style={inputStyle}
                    isInvalid={!!errors.designation}
                  />
               </div>
               <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Barcode size={14} /> Code Référence
                  </label>
                  <Form.Control
                    type="text"
                    name="Code_produit"
                    value={formData.Code_produit || ''}
                    onChange={handleChange}
                    placeholder="Code"
                    style={inputStyle}
                    isInvalid={!!errors.Code_produit}
                  />
               </div>
            </div>
          </div>

          <div style={{ ...sectionStyle, minHeight: '300px' }}>
            <TableForms
              title={"Composition de la recette"}
              addButtonText={"Ajouter une Matière Première"}
              items={formData.recette || []}
              onAddItem={() => {
                const newRecette = [...(formData.recette || []), { 
                  matiere_premiere_id: '', 
                  quantite: 0, 
                  perte: 0,
                  unite: 'K' 
                }];
                setFormData(prev => ({ ...prev, recette: newRecette }));
              }}
              onDeleteItem={(index) => {
                const newRecette = formData.recette.filter((_, i) => i !== index);
                setFormData(prev => ({ ...prev, recette: newRecette }));
              }}
              onItemChange={(index, field, value) => {
                const newRecette = [...formData.recette];
                newRecette[index][field] = value;
                setFormData(prev => ({ ...prev, recette: newRecette }));
              }}
              errors={errors}
              showExpandableDetails={false}
              columns={[
                { 
                  key: 'matiere_premiere_id', 
                  label: 'Matière Première', 
                  width: '45%', 
                  type: 'select',
                  options: [
                    { value: '', label: 'Sélectionner une matière' },
                    ...(Array.isArray(matierePremieres) ? matierePremieres.map(m => ({ value: m.id, label: m.designation })) : [])
                  ]
                },
                { key: 'quantite', label: 'Quantité', width: '20%', type: 'number' },
                { key: 'perte', label: 'Perte (%)', width: '15%', type: 'number' },
                {
                  key: 'unite', label: 'Unité', width: '15%', type: 'select', options: [
                    { value: 'K', label: 'Kilogramme (KG)' },
                    { value: 'L', label: 'Litre (L)' },
                    { value: 'U', label: 'Unité (U)' }
                  ]
                },
                { key: 'actions', label: '', width: '5%', type: 'actions' }
              ]}
            />
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '16px 24px' }}>
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
          form="recetteForm"
          type="submit"
          style={{
            background: '#00afaa',
            border: 'none',
            padding: '8px 32px',
            borderRadius: '8px',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(0, 175, 170, 0.2)'
          }}
        >
          {formData.id ? 'Sauvegarder les modifications' : 'Enregistrer la fiche'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecetteForm;
