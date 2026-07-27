import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Tag, Barcode, DollarSign, Ruler, Truck } from 'lucide-react';

const StyledFormGroup = React.memo(({ icon, label, htmlFor, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
    <label htmlFor={htmlFor} style={{ fontWeight: 500, color: '#4b5563', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: 6 }}>{icon}</span>
      {label}
    </label>
    {children}
  </div>
));

const PackagingForm = ({ formData, handleChange, handleSubmit, loading, closeForm, formContainerStyle }) => {
  const inputStyle = {
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    padding: '0.6rem 1rem',
    fontSize: 15,
  };

  return (
<div
  style={{
    ...formContainerStyle,
    position: 'fixed',
    top: '80px',
    height: 'calc(100vh - 100px)',
    overflowY: 'auto',
    background: '#fff',
    borderRadius: '1rem',
    padding: '1.5rem',
    zIndex: 1050,
    transition: 'right 0.3s ease',
  }}
>      <Form onSubmit={handleSubmit}>
        <StyledFormGroup icon={<Tag size={18} />} label="Désignation" htmlFor="designation">
          <input id="designation" name="designation" value={formData.designation || ''} onChange={handleChange} className="form-control" style={inputStyle} required />
        </StyledFormGroup>

        <StyledFormGroup icon={<Barcode size={18} />} label="Code Référence" htmlFor="Code_produit">
          <input id="Code_produit" name="Code_produit" value={formData.Code_produit || ''} onChange={handleChange} className="form-control" style={inputStyle} required />
        </StyledFormGroup>

        <StyledFormGroup icon={<Ruler size={18} />} label="Unité" htmlFor="unite">
          <input id="unite" name="unite" value={formData.unite || ''} onChange={handleChange} placeholder="ex: unite, kg, m2" className="form-control" style={inputStyle} />
        </StyledFormGroup>

        <StyledFormGroup icon={<DollarSign size={18} />} label="Prix Unitaire (DH)" htmlFor="prixProduit">
          <input id="prixProduit" type="number" step="0.01" name="prixProduit" value={formData.prixProduit || ''} onChange={handleChange} className="form-control" style={inputStyle} required />
        </StyledFormGroup>

        <div className="d-flex justify-content-center mt-4">
          <Button type="submit" style={{ backgroundColor: '#00afaa', border: 'none' }} disabled={loading} className="mx-2">
            {loading ? 'Chargement...' : (formData.id ? 'Modifier' : 'Enregistrer')}
          </Button>
          <Button type="button" variant="secondary" onClick={closeForm} className="mx-2">
            Annuler
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PackagingForm;