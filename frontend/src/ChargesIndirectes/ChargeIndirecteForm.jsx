import React from 'react';
import { Form, Button, Tab, Tabs } from 'react-bootstrap';
import { Layers, Tag, DollarSign, RefreshCw, Info, Package } from 'lucide-react';

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

const ChargeIndirecteForm = ({
  formData,
  handleChange,
  handleSubmit,
  errors,
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
            <StyledFormGroup icon={<Tag size={18} />} label="Nom de la Charge" htmlFor="nom">
              <input
                id="nom"
                name="nom"
                value={formData.nom || ''}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Ex: Électricité, Loyer..."
                className={`form-control styled-input ${errors.nom ? 'is-invalid' : ''}`}
              />
            </StyledFormGroup>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs
          id="charge-indirecte-tabs"
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
          <Tab eventKey="configuration" title={<span><DollarSign className="me-2" size={16} />Montant & Fréquence</span>}>
            <Form onSubmit={handleSubmit} style={{ padding: '0 1rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <StyledFormGroup icon={<DollarSign size={18} />} label="Montant (DH)" htmlFor="montant">
                    <input
                      id="montant"
                      type="number"
                      step="0.01"
                      name="montant"
                      value={formData.montant || ''}
                      onChange={handleChange}
                      style={inputStyle}
                      placeholder="0.00"
                      className={`form-control styled-input ${errors.montant ? 'is-invalid' : ''}`}
                    />
                  </StyledFormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  <StyledFormGroup icon={<RefreshCw size={18} />} label="Fréquence" htmlFor="frequence">
                    <select
                      id="frequence"
                      name="frequence"
                      value={formData.frequence || 'mensuel'}
                      onChange={handleChange}
                      style={inputStyle}
                      className="form-select styled-select"
                    >
                      <option value="mensuel">Mensuel</option>
                      <option value="trimestriel">Trimestriel</option>
                      <option value="annuel">Annuel</option>
                    </select>
                  </StyledFormGroup>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <StyledFormGroup icon={<Layers size={18} />} label="Méthode de Répartition" htmlFor="methode_repartition">
                  <select
                    id="methode_repartition"
                    name="methode_repartition"
                    value={formData.methode_repartition || 'volume'}
                    onChange={handleChange}
                    style={inputStyle}
                    className="form-select styled-select"
                  >
                    <option value="volume">Volume de production</option>
                    <option value="quantite">Quantité produite</option>
                    <option value="temps_machine">Temps machine / MOD</option>
                  </select>
                </StyledFormGroup>
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

          <Tab eventKey="info" title={<span><Info className="me-2" size={16} />Informations</span>}>
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <Package size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>Configuration des charges indirectes et de leur clé de répartition.</p>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ChargeIndirecteForm;
