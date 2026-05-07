import React from 'react';
import { Form, Button, Tab, Tabs } from 'react-bootstrap';
import {
  Tag,
  Barcode,
  Plus,
  Layers,
  List,
  Info,
  Package,
} from 'lucide-react';
import TableForms from '../etat/TableForms';

// Extracted outside to avoid remounting on every render
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

const RecetteForm = ({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  errors,
  matierePremieres,
  closeForm,
  formContainerStyle
}) => {
  const [tabKey, setTabKey] = React.useState('composition');

  // Common input style
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
      {/* Add custom CSS for placeholder styling */}
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
          
          .styled-select option:first-child {
            color: #9ca3af !important;
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
          .btn-secondary-custom:hover:not(:disabled) {
            background-color: #4b5563 !important;
          }

          /* Red border when invalid */
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
        {/* Styled card/cadre for top section, matching ProduitForm */}
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
          {/* Main info section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
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
        </div>

        {/* Tabs section matching ProduitForm */}
        <Tabs
          id="recette-form-tabs"
          activeKey={tabKey}
          onSelect={(k) => setTabKey(k)}
          className="mb-4 nav-tabs"
          style={{ 
            justifyContent: 'center', 
            position: 'sticky', 
            top: '-1%', 
            backgroundColor: '#fff', 
            zIndex: 100, 
            flexShrink: 0, 
            marginLeft: '-0.5%', 
            marginRight: '-0.7%' 
          }}
        >
          <Tab eventKey="composition" title={<span><List className="me-2" size={16} />Composition de la Recette</span>}>
            <Form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '0 1rem' }}>
              <div style={{ width: '100%', marginBottom: '2rem' }}>
                <TableForms
                  title={"Matières Premières & Ingrédients"}
                  addButtonText={"Ajouter une ligne"}
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
                      width: '40%', 
                      type: 'select',
                      options: [
                        { value: '', label: 'Sélectionner une matière' },
                        ...(Array.isArray(matierePremieres) ? matierePremieres.filter(m => m != null).map(m => ({ value: m.id, label: m.designation || 'Sans désignation' })) : [])
                      ]
                    },
                    { key: 'quantite', label: 'Quantité', width: '20%', type: 'number' },
                    { key: 'perte', label: 'Perte (%)', width: '15%', type: 'number' },
                    {
                      key: 'unite', label: 'Unité', width: '20%', type: 'select', options: [
                        { value: 'K', label: 'KG' },
                        { value: 'L', label: 'Litre' },
                        { value: 'U', label: 'Unité' }
                      ]
                    },
                    { key: 'actions', label: 'Action', width: '5%', type: 'actions' }
                  ]}
                />
              </div>

              <div className="mt-4 mb-5">
                <Form.Group className="d-flex justify-content-center">
                  <Button type="submit" className="btn-primary-custom mb-2 mx-2">
                    {formData.id ? 'Modifier' : 'Enregistrer'}
                  </Button>
                  <Button type="button" className="btn-secondary-custom mb-2 mx-2" onClick={closeForm}>
                    Annuler
                  </Button>
                </Form.Group>
              </div>
            </Form>
          </Tab>
          
          <Tab eventKey="details" title={<span><Info className="me-2" size={16} />Détails & Notes</span>}>
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>Informations complémentaires sur la fiche technique.</p>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default RecetteForm;
