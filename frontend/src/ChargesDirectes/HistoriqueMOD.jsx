import React from 'react';
import { History } from 'lucide-react';

const HistoriqueMOD = ({ historique }) => {
  if (!historique || historique.length === 0) {
    return (
      <div style={{
        background: '#f8fafc',
        borderRadius: '1rem',
        padding: '1rem',
        border: '1px solid #e2e8f0',
        marginTop: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <History size={18} color="#475569" />
          <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
            Historique MOD
          </span>
        </div>
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem' }}>
          Aucun historique MOD disponible
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#f8fafc',
      borderRadius: '1rem',
      padding: '1rem',
      border: '1px solid #e2e8f0',
      marginTop: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <History size={18} color="#475569" />
        <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
          Historique MOD
        </span>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: 'auto' }}>
          {historique.length} modification{historique.length > 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ overflow: 'auto', maxHeight: '200px' }}>
        <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '0.3rem 0.4rem', color: '#64748b', fontWeight: 600 }}>Date</th>
              <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#64748b', fontWeight: 600 }}>MOD/H</th>
              <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#64748b', fontWeight: 600 }}>Temps</th>
              <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#64748b', fontWeight: 600 }}>Perte</th>
              <th style={{ textAlign: 'center', padding: '0.3rem 0.4rem', color: '#64748b', fontWeight: 600 }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {historique.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.3rem 0.4rem', color: '#334155' }}>
                  {new Date(item.date_debut).toLocaleDateString()}
                </td>
                <td style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#334155' }}>
                  {item.cout_horaire_mod}
                </td>
                <td style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#334155' }}>
                  {item.temps_production}
                </td>
                <td style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: '#334155' }}>
                  {item.perte_mod}
                </td>
                <td style={{ textAlign: 'center', padding: '0.3rem 0.4rem' }}>
                  {item.date_fin === null ? (
                    <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.7rem' }}>
                      Actif
                    </span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                      Ancien
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoriqueMOD;