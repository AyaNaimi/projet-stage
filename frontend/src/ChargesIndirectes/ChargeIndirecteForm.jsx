import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { DollarSign, Tag, RefreshCw, Layers } from 'lucide-react';

const StyledFormGroup = React.memo(({ icon, label, htmlFor, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
    <label htmlFor={htmlFor} style={{ fontWeight: 500, color: '#4b5563', fontSize: '0.875rem', marginBottom: 2, display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: 6, color: '#4b5563', fontSize: 16 }}>
        {icon}
      </span>
      {label}
    </label>
    {children}
  </div>
));

const ChargeIndirecteForm = ({
  formData,
  handleChange,
  handleSubmit,
  errors,
  closeForm,
  formContainerStyle
}) => {
  const inputStyle = {
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    padding: '0.6rem 1rem',
    fontSize: 15,
    background: '#fff',
    color: '#000',
  };

  return (
    <div
      id="formContainerCharge"
      style={{ 
        position: 'absolute',
        top: 0,
        right: formContainerStyle.right === '0' ? '0' : '-100%',
        width: '35%',
        height: `calc(100vh - 250px)`, 
        overflow: 'auto', 
        background: '#f9fafb', 
        padding: '20px', 
        borderLeft: '1px solid #e5e7eb',
        borderRadius: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transition: 'right 0.3s ease',
        zIndex: 10
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}>
        <h4 style={{ marginBottom: '1.5rem', fontWeight: 600, color: '#111827', borderBottom: '2px solid #00afaa', paddingBottom: '10px' }}>
          {formData.id ? 'Modifier' : 'Ajouter'} une Charge Indirecte
        </h4>

        <Form onSubmit={handleSubmit}>
          <StyledFormGroup icon={<Tag size={18} />} label="Nom de la charge" htmlFor="nom">
            <input
              id="nom"
              className={`form-control styled-input ${errors.nom ? 'is-invalid' : ''}`}
              style={inputStyle}
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: Électricité, Loyer, Maintenance..."
            />
            {errors.nom && <div className="text-danger" style={{ fontSize: 13 }}>{errors.nom[0]}</div>}
          </StyledFormGroup>

          <StyledFormGroup icon={<DollarSign size={18} />} label="Montant" htmlFor="montant">
            <input
              id="montant"
              className={`form-control styled-input ${errors.montant ? 'is-invalid' : ''}`}
              style={inputStyle}
              type="number"
              step="0.01"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              placeholder="0.00"
            />
            {errors.montant && <div className="text-danger" style={{ fontSize: 13 }}>{errors.montant[0]}</div>}
          </StyledFormGroup>

          <StyledFormGroup icon={<RefreshCw size={18} />} label="Fréquence" htmlFor="frequence">
            <select
              id="frequence"
              name="frequence"
              value={formData.frequence}
              onChange={handleChange}
              style={inputStyle}
              className={`form-select ${errors.frequence ? 'is-invalid' : ''}`}
            >
              <option value="mensuel">Mensuel</option>
              <option value="trimestriel">Trimestriel</option>
              <option value="annuel">Annuel</option>
            </select>
            {errors.frequence && <div className="text-danger" style={{ fontSize: 13 }}>{errors.frequence[0]}</div>}
          </StyledFormGroup>

          <StyledFormGroup icon={<Layers size={18} />} label="Méthode de répartition" htmlFor="methode_repartition">
            <select
              id="methode_repartition"
              name="methode_repartition"
              value={formData.methode_repartition}
              onChange={handleChange}
              style={inputStyle}
              className={`form-select ${errors.methode_repartition ? 'is-invalid' : ''}`}
            >
              <option value="volume">Volume de production</option>
              <option value="quantite">Quantité produite</option>
              <option value="temps_machine">Temps machine / MOD</option>
            </select>
            {errors.methode_repartition && <div className="text-danger" style={{ fontSize: 13 }}>{errors.methode_repartition[0]}</div>}
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
    </div>
  );
};

export default ChargeIndirecteForm;
