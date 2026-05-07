import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Layers, Tag, DollarSign, RefreshCw } from 'lucide-react';

const ChargeIndirecteForm = ({
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
            <Layers size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
              {formData.id ? 'Modifier Charge Indirecte' : 'Nouvelle Charge Indirecte'}
            </span>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>
              Paramétrage des frais fixes et variables
            </div>
          </div>
        </div>
        <Button variant="link" onClick={closeForm} style={{ color: '#64748b', textDecoration: 'none', fontSize: '1.5rem', lineHeight: 1 }}>&times;</Button>
      </div>

      <div style={{ background: '#f1f5f9', padding: '24px', overflowY: 'auto', height: 'calc(100% - 140px)' }}>
        <Form onSubmit={handleSubmit} id="chargeIndirecteForm">
          <div style={sectionStyle}>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label style={labelStyle}><Tag size={14} /> Nom de la Charge</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom"
                    value={formData.nom || ''}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Ex: Électricité, Loyer..."
                    isInvalid={!!errors.nom}
                  />
                  {errors.nom && <Form.Control.Feedback type="invalid">{errors.nom[0]}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}><DollarSign size={14} /> Montant (DH)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="montant"
                    value={formData.montant || ''}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="0.00"
                    isInvalid={!!errors.montant}
                  />
                  {errors.montant && <Form.Control.Feedback type="invalid">{errors.montant[0]}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div style={sectionStyle}>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group>
                  <Form.Label style={labelStyle}><RefreshCw size={14} /> Fréquence</Form.Label>
                  <Form.Select
                    name="frequence"
                    value={formData.frequence || 'mensuel'}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="mensuel">Mensuel</option>
                    <option value="trimestriel">Trimestriel</option>
                    <option value="annuel">Annuel</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}><Layers size={14} /> Méthode de Répartition</Form.Label>
                  <Form.Select
                    name="methode_repartition"
                    value={formData.methode_repartition || 'volume'}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="volume">Volume de production</option>
                    <option value="quantite">Quantité produite</option>
                    <option value="temps_machine">Temps machine / MOD</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
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
          form="chargeIndirecteForm"
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
          {formData.id ? 'Sauvegarder les modifications' : 'Enregistrer la charge'}
        </Button>
      </div>
    </div>
  );
};

export default ChargeIndirecteForm;
