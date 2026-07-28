import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Autocomplete, TextField } from '@mui/material';
import { Form } from 'react-bootstrap';

const FilterComponent = ({
  // Propriétés d'état
  showFilters,
  clients,
  clientFiltre,
  SiteClientFiltre,
  categorieOptions = [],
  categorieFiltre = [],
  filterDate,
  filterDatefin,
  datepardefault,
  factureFiltre,
  
  // Fonctions de gestion d'événements
  setClientFiltre,
  setSiteClientFiltre,
  setCategorieFiltre,
  handleDateChange,
  handleDateChangefin,
  filtrerigion,
  represantant,
  label,
  categorieFilte,
  setFactureFiltre
}) => {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '10px',
            maxWidth: '100%',
            overflow: 'auto',
            padding: '0 20px',
          }}
        >
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', tableLayout: 'fixed' }}>
              <tbody>
                <tr>
                  
                     <td style={{ paddingRight: '10px', textAlign: 'right', width: "500px" }}>
                      {
                        SiteClientFiltre &&
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label htmlFor="client" style={{ marginRight: '5px' }}>{label?'Client':'Fournisseur'}:</label>
                      <Autocomplete
                        options={clients?.filter(client => client.id_mere === null)}
                        getOptionLabel={(option) =>label? (option.CodeClient || ""):(option.CodeFournisseur || "")}
                        sx={{
                          width: '50%',
                          "& .MuiOutlinedInput-root": {
                            padding: '5px',
                            fontSize: '14px',
                            backgroundColor: 'white',
                          },
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="code"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        onChange={(event, selectedClient) => setClientFiltre(selectedClient?.id || "")}
                        value={clients?.find((client) => client.id === clientFiltre) || null}
                      />
                      <Autocomplete
                        options={clients?.filter(client => client.id_mere === null)}
                        getOptionLabel={(option) => option.raison_sociale || ""}
                        sx={{
                          width: '100%',
                          "& .MuiOutlinedInput-root": {
                            padding: '5px',
                            fontSize: '14px',
                            backgroundColor: 'white',
                          },
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Raison Sociale"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        onChange={(event, selectedClient) => setClientFiltre(selectedClient?.id || "")}
                        value={clients?.find((client) => client.id === clientFiltre) || null}
                      />
                    </div>
                      }
                    
                  </td>
                
                
                  {
                    categorieFilte &&
                     <td style={{ paddingRight: '10px', textAlign: 'right', width: "320px" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label htmlFor="categorie" style={{ marginRight: '5px' }}>Catégorie produit:</label>
                      <Autocomplete
                        multiple
                        limitTags={1}
                        id="categorie-produit"
                        options={categorieOptions}
                        disableCloseOnSelect
                        value={categorieOptions.filter((categorie) =>
                          categorieFiltre.includes(Number(categorie.id))
                        )}
                        onChange={(event, newValue) => {
                          setCategorieFiltre(
                            newValue.map((categorie) => Number(categorie.id))
                          );
                        }}
                        getOptionLabel={(option) => option?.categorie || ""}
                        sx={{
                          width: '100%',
                          "& .MuiOutlinedInput-root": {
                            padding: '5px',
                            fontSize: '14px',
                            backgroundColor: 'white',
                          },
                        }}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Sélectionner" size="small" />
                        )}
                      />
                    </div>
                  </td>
                  }
                 
                    
                  {
                    represantant &&
                     <td style={{ padding: 0, textAlign: 'right', width: "300px" }}>
                    {represantant}
                  </td>
                  }
                  <td style={{ padding: 0, textAlign: 'right', width: "200px" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label htmlFor="startDate" style={{ marginRight: '5px' }}>Période du:</label>
                      <Form.Control
                        style={{ padding: '5px', fontSize: '14px', width: '100%' }}
                        type="date"
                        name="datefiltre"
                        value={filterDate ? filterDate : datepardefault}
                        onChange={handleDateChange}
                      />
                    </div>
                  </td>
                  <td style={{ padding: 0, textAlign: 'right', width: "200px" }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label htmlFor="endDate" style={{ marginRight: '5px' }}>Au :</label>
                      <Form.Control
                        style={{ padding: '5px', fontSize: '14px', width: '100%' }}
                        type="date"
                        name="datefiltre"
                        value={filterDatefin ? filterDatefin : datepardefault}
                        onChange={handleDateChangefin}
                      />
                    </div>
                  </td>
                  {
                    filtrerigion &&
                     <td style={{ padding: 0, textAlign: 'right', width: "200px" }}>
                    {filtrerigion}
                  </td>
                  }
                  {
                    setFactureFiltre &&
                    <td style={{ paddingRight: '10px', textAlign: 'right', width: "250px" ,marginLeft:"2%"}}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Select
                          value={factureFiltre || "all"}
                          onChange={(e) => setFactureFiltre(e.target.value)}
                          style={{ padding: '5px', fontSize: '14px', width: '100%',marginLeft:"2%" }}
                        >
                          <option value="all">Tous</option>
                          <option value="avec_facture">Générer Facture</option>
                          <option value="sans_facture">No Générer Facture</option>
                        </Form.Select>
                      </div>
                    </td>
                  }
                 
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterComponent;