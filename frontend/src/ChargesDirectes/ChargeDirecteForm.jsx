import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Clock, Tag, Barcode, DollarSign, Calendar } from 'lucide-react';

const ChargeDirecteForm = ({
  show,
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
        height: `calc(100vh - 280px)`, 
        top: '280px',
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
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
              {formData.id ? 'Modifier Charges Directes' : 'Nouvelle Configuration'}
            </span>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>
              Paramétrage du coût de main d'œuvre
            </div>
          </div>
        </div>
        <Button variant="link" onClick={closeForm} style={{ color: '#64748b', textDecoration: 'none', fontSize: '1.5rem', lineHeight: 1 }}>&times;</Button>
      </div>

      <div style={{ background: '#f1f5f9', padding: '24px', overflowY: 'auto', height: 'calc(100% - 140px)' }}>
        <Form onSubmit={handleSubmit} id="chargeDirecteForm">
          <div style={sectionStyle}>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label style={labelStyle}><Tag size={14} /> Désignation du Produit</Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    value={formData.designation || ''}
                    onChange={handleChange}
                    style={inputStyle}
                    isInvalid={!!errors.designation}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}><Barcode size={14} /> Code Référence</Form.Label>
                  <Form.Control
                    type="text"
                    name="Code_produit"
                    value={formData.Code_produit || ''}
                    onChange={handleChange}
                    style={inputStyle}
                    isInvalid={!!errors.Code_produit}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div style={sectionStyle}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}><DollarSign size={14} /> Coût Horaire MOD (DH)</Form.Label>
                  <Form.Control
                    type="number"
                    name="cout_horaire_mod"
                    value={formData.cout_horaire_mod || ''}
                    onChange={handleChange}
                    placeholder="0.00"
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}><Calendar size={14} /> Temps Production (Min)</Form.Label>
                  <Form.Control
                    type="number"
                    name="temps_production"
                    value={formData.temps_production || ''}
                    onChange={handleChange}
                    placeholder="0"
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              background: '#f0fdfa', 
              borderRadius: '0.75rem',
              border: '1px solid #ccfbf1',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#0f766e', fontWeight: 600 }}>Coût MOD Unitaire Estimé :</span>
              <span style={{ fontSize: '1.1rem', color: '#0d9488', fontWeight: 800 }}>
                {(((formData.cout_horaire_mod || 0) * (formData.temps_production || 0)) / 60).toFixed(2)} DH
              </span>
            </div>
          </div>
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
          form="chargeDirecteForm"
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
          {formData.id ? 'Mettre à jour' : 'Valider'}
        </Button>
      </div>
    </div>
  );
};

export default ChargeDirecteForm;
