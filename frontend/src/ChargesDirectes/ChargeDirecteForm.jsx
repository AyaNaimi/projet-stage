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
        {/* Top Section: Product context */}
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

        {/* Tabs Section */}
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

              {/* Estimation Card */}
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
