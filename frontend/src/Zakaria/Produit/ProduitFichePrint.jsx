import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faTimes, faBarcode, faBoxOpen, faTags, faWarehouse, faCoins } from '@fortawesome/free-solid-svg-icons';

const ProduitFichePrint = ({ show, onHide, produit }) => {
  const handlePrint = () => {
    const printContent = document.getElementById('produit-fiche-print');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Fiche Produit - ${produit.designation || ''}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #fff; 
              font-size: 13px; 
              line-height: 1.4;
              color: #2c3e50;
            }
            .no-print { display: none !important; }
            .container { max-width: 100%; margin: 0 auto; }
            
            .header-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 3px solid #007bff;
              padding-bottom: 15px;
              margin-bottom: 30px;
            }
            .header-info h2 { 
              margin: 0 0 5px; 
              color: #1e3a8a; 
              font-weight: bold; 
              font-size: 24px;
            }
            .header-info p {
              margin: 0;
              font-size: 14px;
              color: #64748b;
              font-weight: 500;
            }
            .product-logo {
              width: 80px;
              height: 80px;
              border-radius: 8px;
              object-fit: cover;
              border: 1px solid #e2e8f0;
            }
            
            .section { 
              margin-bottom: 22px; 
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            
            .section-header { 
              background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
              color: white; 
              padding: 10px 15px; 
              margin: 0; 
              font-weight: 600; 
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .form-table { 
              width: 100%; 
              border-collapse: collapse; 
              background: white;
            }
            
            .form-table td { 
              padding: 8px 15px; 
              border-bottom: 1px solid #f1f5f9; 
              vertical-align: middle;
            }
            
            .form-table tr:last-child td {
              border-bottom: none;
            }
            
            .label { 
              font-weight: 600; 
              color: #475569; 
              width: 220px;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .value { 
              color: #0f172a; 
              font-weight: 500;
              border-bottom: 1px dotted #cbd5e1;
              padding-bottom: 3px;
            }

            .price-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 5px;
            }
            .price-table th {
              background-color: #f8fafc;
              color: #475569;
              font-weight: 600;
              font-size: 11px;
              text-transform: uppercase;
              padding: 8px 12px;
              text-align: left;
              border-bottom: 2px solid #e2e8f0;
            }
            .price-table td {
              padding: 8px 12px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 12px;
            }
            .price-table tr:last-child td {
              border-bottom: none;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 200);
    };
  };

  if (!produit) return null;

  const containerStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: '13px',
    lineHeight: '1.4',
    color: '#2c3e50',
    padding: '25px',
    background: '#fff'
  };

  const headerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '3px solid #007bff',
    paddingBottom: '15px',
    marginBottom: '30px',
    position: 'relative'
  };

  const sectionStyle = {
    marginBottom: '22px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  };

  const sectionHeaderStyle = {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: 'white',
    padding: '10px 15px',
    margin: '0',
    fontWeight: '600',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'white'
  };

  const cellStyle = {
    padding: '8px 15px',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle'
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#475569',
    width: '220px',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const valueStyle = {
    color: '#0f172a',
    fontWeight: '500',
    borderBottom: '1px dotted #cbd5e1',
    paddingBottom: '3px'
  };

  const buttonGroupStyle = {
    position: 'absolute',
    top: '0',
    right: '0',
    display: 'flex',
    gap: '10px'
  };

  const getProductType = () => {
    if (produit.type === 'P') return 'Production';
    if (produit.type === 'M') return 'Matière Première';
    return produit.type || '';
  };

  const getQuantiteType = () => {
    if (produit.type_quantite === 'kg') return 'Kilogramme (kg)';
    if (produit.type_quantite === 'litre') return 'Litre (L)';
    if (produit.type_quantite === 'unite') return 'Unité (U)';
    return produit.type_quantite || '';
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered style={{ marginTop: '2%' }}>
      <Modal.Body style={{ padding: '0' }}>
        <div id="produit-fiche-print" style={containerStyle}>
          <div style={headerContainerStyle}>
            <div className="header-info">
              <h2>Fiche Produit</h2>
              <p>Code Produit : {produit.Code_produit || ''}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginRight: '100px' }}>
              {produit.logoP && (
                <img 
                  src={produit.logoP} 
                  alt="Product Logo" 
                  style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                />
              )}
            </div>
            <div className="no-print" style={buttonGroupStyle}>
              <Button 
                variant="primary" 
                className="no-focus-outline" 
                onClick={handlePrint} 
                size="sm"
                style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
              >
                <FontAwesomeIcon icon={faPrint} /> Imprimer
              </Button>
              <Button variant="outline-secondary" onClick={onHide} size="sm">
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </div>
          </div>

          {/* Section Identification */}
          <div style={sectionStyle}>
            <h5 style={sectionHeaderStyle}>
              <FontAwesomeIcon icon={faBarcode} style={{ marginRight: '8px' }} />
              Identification du Produit
            </h5>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Désignation :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.designation || ''}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Marque :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.marque || ''}</td>
                </tr>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Famille / Catégorie :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.categorie?.categorie || ''}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Sous-catégorie / Type :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.souscategorie?.categorie || ''}</td>
                </tr>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Calibre :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.calibre?.calibre || ''}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Type d'usage :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{getProductType()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section Tarification & Taxes */}
          <div style={sectionStyle}>
            <h5 style={sectionHeaderStyle}>
              <FontAwesomeIcon icon={faCoins} style={{ marginRight: '8px' }} />
              Tarification et Taxes
            </h5>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Prix de Vente Standard :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.prix_vente || ''} Dhs</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Taux TVA :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.tva || '0'} %</td>
                </tr>
              </tbody>
            </table>

            {/* Liste historique des prix du produit */}
            {produit.prix_produits && produit.prix_produits.length > 0 && (
              <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <h6 style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Historique des prix
                </h6>
                <table className="price-table" style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={{ backgroundColor: '#f1f5f9', fontSize: '10px', padding: '6px 12px' }}>Prix (Dhs)</th>
                      <th style={{ backgroundColor: '#f1f5f9', fontSize: '10px', padding: '6px 12px' }}>Date Début</th>
                      <th style={{ backgroundColor: '#f1f5f9', fontSize: '10px', padding: '6px 12px' }}>Date Fin</th>
                      <th style={{ backgroundColor: '#f1f5f9', fontSize: '10px', padding: '6px 12px' }}>Type Unité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produit.prix_produits.map((p, idx) => (
                      <tr key={idx}>
                        <td style={cellStyle}>{p.prixProduit}</td>
                        <td style={cellStyle}>{p.date_debut || '-'}</td>
                        <td style={cellStyle}>{p.date_fin || '-'}</td>
                        <td style={cellStyle}>{p.type === 'K' ? 'KG' : p.type === 'L' ? 'Litre' : 'Unité'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section Stocks */}
          <div style={sectionStyle}>
            <h5 style={sectionHeaderStyle}>
              <FontAwesomeIcon icon={faWarehouse} style={{ marginRight: '8px' }} />
              Gestion des Stocks
            </h5>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Stock Initial :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.stock_initial || '0'} {produit.unite || ''}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Seuil d'alerte :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.seuil_alerte || '0'} {produit.unite || ''}</td>
                </tr>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Type Quantité :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{getQuantiteType()}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>État du Produit :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.etat_produit || 'Actif'}</td>
                </tr>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Durée de Vie (D.Vie) :</td>
                  <td style={{ ...cellStyle, ...valueStyle }} colSpan="3">{produit.Dvie || 'Non spécifiée'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section Conditionnement & Emballages */}
          <div style={sectionStyle}>
            <h5 style={sectionHeaderStyle}>
              <FontAwesomeIcon icon={faBoxOpen} style={{ marginRight: '8px' }} />
              Conditionnement et Emballages
            </h5>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Emballage Primaire :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.emballage_primaire_label || 'Non configuré'}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Unité Emballage Primaire :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.unite_embalage_primaire || '-'}</td>
                </tr>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Emballage Secondaire :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.emballage_secondaire_label || 'Non configuré'}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Unité Emballage Secondaire :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.unite_embalage_secondaire || '-'}</td>
                </tr>
                <tr>
                  <td style={{ ...cellStyle, ...labelStyle }}>Étiquette :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.etiquette_label || 'Non configuré'}</td>
                  <td style={{ ...cellStyle, ...labelStyle }}>Unité Étiquette :</td>
                  <td style={{ ...cellStyle, ...valueStyle }}>{produit.unite_etiquette || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProduitFichePrint;
