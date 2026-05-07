import React from 'react';
import { Form, Modal, Button, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Plus, Barcode, Tag, Box, Package, Boxes, Ruler, DollarSign, Layers,
  List, Weight, Factory, Image, Scale, AlertTriangle, LineChart, Calendar,
  Type, Box as Cube, Grid, Info
} from 'lucide-react';
import Fab from '@mui/material/Fab';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import TableForms from '../etat/TableForms';

// Extracted outside to avoid remounting on every render (which was causing input focus to be lost)
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

const ProduitForm = ({
  formData,
  setFormData,
  handleChange,
  handleRadioChange,
  handleSubmit,
  errors,
  calibres,
  categories,
  produits,
  newCategory,
  setNewCategory,
  showAddCalibre,
  setShowAddCalibre,
  handleAddClibre,
  handleEditClibre,
  handleDeletecatgeorie,
  showEditClibreModal,
  setShowEditClibreModal,
  selectedCategoryId,
  setSelectedCategoryId,
  handleSaveClibre,
  showAddCategory,
  setShowAddCategory,
  handleAddCategory,
  handleEditCategorie,
  showSuModal,
  setShowSuModal,
  handleAddSousCategory,
  handleEditSousCategorie,
  handleDeletecatgeorieSousCat,
  showEditModal,
  setShowEditModal,
  handleSave,
  showEditSousModal,
  setShowEditSousModal,
  handleSuCategorie,
  handleAddEmptyRowRep,
  selectedProductsDataRep,
  handleInputChangeRep,
  handleDeleteProductRap,
  closeForm,
  editingProduit,
  formContainerStyle
}) => {
  const [tabKey, setTabKey] = React.useState('infoProduit');
  const [logoPreview, setLogoPreview] = useState(formData.logoP ? (typeof formData.logoP === 'string' ? formData.logoP : URL.createObjectURL(formData.logoP)) : null);

  // Update preview on file change
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
    handleChange(e);
  };

  // Common input style with consistent placeholder styling
  const inputStyle = {
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    padding: '0.6rem 1rem',
    fontSize: 15,
    background: '#fff',
    color: '#000',
    '::placeholder': {
      color: '#9ca3af',
      opacity: 1,
      fontSize: 15
    }
  };

  // Add a helper for styled form group

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
          
          .styled-select:invalid {
            color: #9ca3af !important;
          }
          
          .styled-select:valid {
            color: #000 !important;
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
        className=""
        style={{ ...formContainerStyle, marginTop: '-0px', height: `calc(99.6vh - 300px)`, overflow: 'auto' }}
      >
        {/* Styled card/cadre for top section, matching screenshot */}
        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '0.7rem 2rem',
          marginBottom: '0.7rem',
          display: 'flex',
          flexDirection: 'row',
          gap: '0.7rem',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          minHeight: 0
        }}>
          {/* Logo du Produit with preview and placeholder */}
          <div style={{ minWidth: 110, maxWidth: 140, flex: '0 0 120px', textAlign: 'center' }}>
            <label htmlFor="logoP" style={{ cursor: 'pointer', width: '100%' }}>
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '0.75rem',
                background: '#fff',
                width: 135,
                height: 186,
                margin: '0 auto 0.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <span style={{ color: '#b0b0b0', fontSize: 12, textAlign: 'center', width: '100%' }}>
                    <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>
                      <Image size={20} />
                    </div>
                    <div style={{ fontWeight: 500, color: '#64748b', fontSize: 11, lineHeight: 1.2 }}>
                      Appuyer<br />pour sélectionner<br />une image
                    </div>
                  </span>
                )}
              </div>
              <input
                id="logoP"
                type="file"
                name="logoP"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          {/* Inputs grid */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: '0.7rem', marginTop: '5px', marginLeft: '25px' }}>
            {/* Row 1: Code Produit & Désignation */}
            <StyledFormGroup icon={<Barcode size={18} />} label="Code Produit" htmlFor="code_produit">
              <input
                id="code_produit"
                className={`form-control styled-input ${errors.Code_produit ? 'is-invalid' : ''}`}
                style={inputStyle}
                type="text"
                name="Code_produit"
                value={formData.Code_produit}
                onChange={handleChange}
                placeholder="Code Produit"
              />
              {errors.Code_produit && <div className="text-danger" style={{ fontSize: 13 }}>{errors.Code_produit}</div>}
            </StyledFormGroup>
            <StyledFormGroup icon={<Tag size={18} />} label="Désignation" htmlFor="designation">
              <input
                id="designation"
                className={`form-control styled-input ${errors.designation ? 'is-invalid' : ''}`}
                style={inputStyle}
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Désignation"
              />
              {errors.designation && <div className="text-danger" style={{ fontSize: 13 }}>{errors.designation}</div>}
            </StyledFormGroup>
            {/* Row 2: Calibre & Famille */}
            <StyledFormGroup icon={<Weight size={18} />} label="Calibre" htmlFor="calibre_id">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <select
                  id="calibre_id"
                  name="calibre_id"
                  value={formData.calibre_id}
                  onChange={handleChange}
                  style={inputStyle}
                  className={`form-select styled-select ${errors.calibre_id ? 'is-invalid' : ''}`}
                >
                  <option value="">Sélectionner un calibre</option>
                  {calibres.map((calibre) => (
                    <option key={calibre.id} value={calibre.id}>{calibre.calibre}</option>
                  ))}
                </select>
                {/* + Button for Calibre */}
                <Button
                  variant="outline-primary"
                  size="sm"
                  style={{ borderRadius: '50%', padding: '0.25rem 0.5rem', marginLeft: 4 }}
                  onClick={() => setShowAddCalibre(true)}
                  title="Ajouter un calibre"
                >
                  <Plus size={14} />
                </Button>
              </div>
              {errors.calibre_id && <div className="text-danger" style={{ fontSize: 13 }}>{errors.calibre_id}</div>}
            </StyledFormGroup>
            <StyledFormGroup icon={<Layers size={18} />} label="Famille" htmlFor="categorie_id">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <select
                  id="categorie_id"
                  name="categorie_id"
                  value={formData.categorie_id}
                  onChange={handleChange}
                  style={inputStyle}
                  className={`form-select styled-select ${errors.categorie_id ? 'is-invalid' : ''}`}
                >
                  <option value="">Sélectionner une Famille</option>
                  {categories.filter((cat) => cat.idCatMer === null).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categorie}
                    </option>
                  ))}
                </select>
                {/* + Button for Famille */}
                <Button
                  variant="outline-primary"
                  size="sm"
                  style={{ borderRadius: '50%', padding: '0.25rem 0.5rem', marginLeft: 4 }}
                  onClick={() => setShowAddCategory(true)}
                  title="Ajouter une famille"
                >
                  <Plus size={14} />
                </Button>
              </div>
              {errors.categorie_id && <div className="text-danger" style={{ fontSize: 13 }}>{errors.categorie_id}</div>}
            </StyledFormGroup>
          </div>
        </div>
        {/* Tabs below */}
        <style>
          {`
            #produit-form-tabs.nav-tabs {
              border-bottom: none;
              background: #fff;
              border-radius: 0.75rem 0.75rem 0 0;
              margin-bottom: 1.5rem;
            }
            #produit-form-tabs .nav-link {
              color: #4b5563;
              border: none;
              padding: 0.75rem 1rem;
              font-weight: 500;
              background: transparent;
              border-radius: 0.75rem 0.75rem 0 0;
              transition: color 0.2s, border-bottom 0.2s;
            }
            #produit-form-tabs .nav-link.active {
              color: #00afaa;
              border-bottom: 2px solid #00afaa;
              background: transparent;
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
          `}
        </style>
        <Tabs
          id="produit-form-tabs"
          activeKey={tabKey}
          onSelect={(k) => setTabKey(k)}
          className="mb-4 nav-tabs"
          style={{ justifyContent: 'center', position: 'sticky', top: '-1%', backgroundColor: '', zIndex: 100, flexShrink: 0, marginLeft: '-0.5%', marginRight: '-0.7%' }}
        >
          <Tab eventKey="infoProduit" title={<span><Info className="me-2" size={16} />Informations Produit</span>}>
            <Form className="col row" onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {/* Row 2: Type & référence */}
              <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  {/* Type (Sous-catégorie) */}
                  <StyledFormGroup icon={<List size={18} />} label="Type" htmlFor="suCat_id">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {formData.categorie_id ?
                        <Button
                          variant="outline-primary"
                          size="sm"
                          style={{ borderRadius: '50%', padding: '0.25rem 0.5rem', marginLeft: 4 }}
                          onClick={() => handleSuCategorie(formData.categorie_id)}
                          title="Add sub-category"
                        >
                          <Plus size={14} />
                        </Button> : ''}
                      <select
                        id="suCat_id"
                        name="suCat_id"
                        value={formData.suCat_id}
                        onChange={handleChange}
                        style={inputStyle}
                        className="form-select styled-select"
                      >
                        <option value="">Sélectionner un Type</option>
                        {categories.filter((cat) => cat.idCatMer !== null && cat.idCatMer === Number(formData.categorie_id)).map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.categorie}
                          </option>
                        ))}
                      </select>
                    </div>
                  </StyledFormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  {/* référence */}
                  <StyledFormGroup icon={<Type size={18} />} label="référence" htmlFor="reference">
                    <input
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleChange}
                      style={inputStyle}
                      type="text"
                      placeholder="Référence"
                      className={`form-control styled-input ${errors.reference ? 'is-invalid' : ''}`}
                    />
                  </StyledFormGroup>
                </div>
              </div>
              {/* Row 3: durée de vie & Genre */}
              <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  {/* durée de vie */}
                  <StyledFormGroup icon={<Calendar size={18} />} label="durée de vie" htmlFor="Dvie">
                    <input
                      id="Dvie"
                      name="Dvie"
                      value={formData.Dvie}
                      onChange={handleChange}
                      style={inputStyle}
                      type="text"
                      placeholder="Durée de vie"
                      className={`form-control styled-input ${errors.Dvie ? 'is-invalid' : ''}`}
                    />
                  </StyledFormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  {/* Genre */}
                  <StyledFormGroup icon={<LineChart size={18} />} label="Genre" htmlFor="genre">
                    <select
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      style={inputStyle}
                      className={`form-select styled-select ${errors.genre ? 'is-invalid' : ''}`}
                    >
                      <option value="">Genre</option>
                      <option value="vente">Vente</option>
                      <option value="achat">Achat</option>
                      <option value="venteachat">Vente & Achat</option>
                    </select>
                  </StyledFormGroup>
                </div>
              </div>
              {/* Row 4: Type de Quantité */}
              <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  {/* Type de Quantité */}
                  <StyledFormGroup icon={<Scale size={18} />} label="Type de Quantité" htmlFor="type_quantite">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {['kg', 'unite', 'litre', 'kg/unite'].map((value) => (
                          <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: 14 }}>
                            <input
                              type="radio"
                              name="type_quantite"
                              value={value}
                              onChange={handleRadioChange}
                              checked={formData.type_quantite === value}
                            />
                            {value === 'unite' ? 'Unité' : value}
                          </label>
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {['M', 'bidon', 'Carton'].map((value) => (
                          <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: 14 }}>
                            <input
                              type="radio"
                              name="type_quantite"
                              value={value}
                              onChange={handleRadioChange}
                              checked={formData.type_quantite === value}
                            />
                            {value}
                          </label>
                        ))}
                      </div>
                    </div>
                    {errors.type_quantite && <div className="text-danger" style={{ fontSize: 13 }}>{errors.type_quantite}</div>}
                  </StyledFormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  {/* Marque */}
                  <StyledFormGroup icon={<Tag size={18} />} label="Marque" htmlFor="marque">
                    <input
                      id="marque"
                      name="marque"
                      value={formData.marque}
                      onChange={handleChange}
                      style={inputStyle}
                      type="text"
                      placeholder="Marque"
                      className={`form-control styled-input ${errors.marque ? 'is-invalid' : ''}`}
                    />
                    <div className="text-danger">
                      {errors.marque}
                    </div>
                  </StyledFormGroup>
                </div>
              </div>
              {/* Row 5: Unité & Type de produit */}
              <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  {/* Unité */}
                  <StyledFormGroup icon={<Cube size={18} />} label="Unité" htmlFor="unite">
                    <input
                      id="unite"
                      name="unite"
                      value={formData.unite}
                      onChange={handleChange}
                      style={inputStyle}
                      type="number"
                      placeholder="Unité"
                      className={`form-control styled-input ${errors.unite ? 'is-invalid' : ''}`}
                    />
                    <div className="text-danger">
                      {errors.unite}
                    </div>
                  </StyledFormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  {/* Type de produit */}
                  <StyledFormGroup icon={<Factory size={18} />} label="Type de produit" htmlFor="type_produit">
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {['MATIERE PREMIERE', 'PRODUCTIN'].map((value) => (
                        <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: 14 }}>
                          <input
                            type="radio"
                            name="type_produit"
                            value={value === 'MATIERE PREMIERE' ? 'M' : 'P'}
                            onChange={handleRadioChange}
                            checked={formData.type_produit === (value === 'MATIERE PREMIERE' ? 'M' : 'P')}
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                  </StyledFormGroup>
                </div>
              </div>
              {/* Row 6: Seuil d'alerte & Stock Initial */}
              <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  {/* Seuil d'alerte */}
                  <StyledFormGroup icon={<AlertTriangle size={18} />} label="Seuil d'alerte" htmlFor="seuil_alerte">
                    <input
                      id="seuil_alerte"
                      name="seuil_alerte"
                      value={formData.seuil_alerte}
                      onChange={handleChange}
                      style={inputStyle}
                      type="number"
                      placeholder="Seuil d'alerte"
                      className={`form-control styled-input ${errors.seuil_alerte ? 'is-invalid' : ''}`}
                    />
                    <div className="text-danger">
                      {errors.seuil_alerte}
                    </div>
                  </StyledFormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  {/* Stock Initial */}
                  <StyledFormGroup icon={<Box size={18} />} label="Stock Initial" htmlFor="stock_initial">
                    <input
                      id="stock_initial"
                      name="stock_initial"
                      value={formData.stock_initial}
                      onChange={handleChange}
                      style={inputStyle}
                      type="number"
                      placeholder="Stock initial"
                      className={`form-control styled-input ${errors.stock_initial ? 'is-invalid' : ''}`}
                    />
                    <div className="text-danger">
                      {errors.stock_initial}
                    </div>
                  </StyledFormGroup>
                </div>
              </div>
              {/* Row 7: État de produit & Prix Vente */}
              <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  {/* État de produit */}
                  <StyledFormGroup icon={<Info size={18} />} label="État de produit" htmlFor="etat_produit">
                    <input
                      id="etat_produit"
                      name="etat_produit"
                      value={formData.etat_produit}
                      onChange={handleChange}
                      style={inputStyle}
                      type="text"
                      placeholder="État de produit"
                      className={`form-control styled-input ${errors.etat_produit ? 'is-invalid' : ''}`}
                    />
                    <div className="text-danger">
                      {errors.etat_produit}
                    </div>
                  </StyledFormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  {/* Prix Vente */}
                  <StyledFormGroup icon={<DollarSign size={18} />} label="Prix Vente" htmlFor="prix_vente">
                    <input
                      id="prix_vente"
                      name="prix_vente"
                      value={formData.prix_vente}
                      onChange={handleChange}
                      style={inputStyle}
                      type="text"
                      placeholder="Prix Vente"
                      className={`form-control styled-input ${errors.prix_vente ? 'is-invalid' : ''}`}
                    />
                  </StyledFormGroup>
                </div>
              </div>
              <div className="mt-5">
                <Form.Group className="mt-5 d-flex justify-content-center">
                  <Button type="submit" className="btn-primary-custom mb-2 mx-2">Valider</Button>
                  <Button type="button" className="btn-secondary-custom mb-2 mx-2" onClick={closeForm}>Annuler</Button>
                </Form.Group>
              </div>
            </Form>
          </Tab>
          <Tab eventKey="emballage" title={<span><Package className="me-2" size={16} />Informations Emballage</span>}>
            <Form className="col row" onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {/* Row 1: Emballage Primaire & Unité Emballage Primaire */}
              <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  {/* Emballage Primaire */}
                  <StyledFormGroup icon={<Package size={18} />} label="Embalage Primaire" htmlFor="produit_Etiq_id">
                    <Autocomplete
                      options={produits}
                      getOptionLabel={(option) => option.designation}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                        <li {...props} title={option.designation}>
                          {option.designation}
                        </li>
                      )}
                      sx={{ width: '100%' }}
                      onChange={(event, selected) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          produit_Etiq_id: selected?.id,
                        }))
                      }}
                      value={formData.produit_Etiq_id ? produits.find((prod) => prod.id === formData.produit_Etiq_id) : null}
                      renderInput={(params) => {
                        const hasError = !formData.produit_Etiq_id;
                        return (
                          <TextField
                            {...params}
                            placeholder="Code ..."
                            error={false}
                            variant="outlined"
                            sx={{
                              '& .MuiInputBase-root': {
                                height: '38px',
                                fontSize: '0.85em',
                                borderColor: hasError ? 'red' : 'inherit',
                              },
                              '& .MuiInputBase-input::placeholder': {
                                color: '#9ca3af !important',
                                opacity: '1 !important',
                                fontSize: '15px !important'
                              }
                            }}
                          />
                        );
                      }}
                    />
                  </StyledFormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  {/* Unité Emballage Primaire */}
                  <StyledFormGroup icon={<Cube size={18} />} label="Unité Emballage Primaire" htmlFor="unite_embalage_primaire">
                    <input
                      id="unite_embalage_primaire"
                      name="unite_embalage_primaire"
                      value={formData.unite_embalage_primaire}
                      onChange={handleChange}
                      style={inputStyle}
                      type="text"
                      placeholder="Unité Emballage Primaire"
                      className="form-control styled-input"
                    />
                  </StyledFormGroup>
                </div>
              </div>
              {/* Row 2: Emballage Secondaire & Unité Emballage Secondaire */}
              <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  {/* Emballage Secondaire */}
                  <StyledFormGroup icon={<Boxes size={18} />} label="Embalage Secondaire" htmlFor="produit_Embalg_S_id">
                    <Autocomplete
                      options={produits}
                      getOptionLabel={(option) => option.designation}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                        <li {...props} title={option.designation}>
                          {option.designation}
                        </li>
                      )}
                      sx={{ width: '100%' }}
                      onChange={(event, selected) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          produit_Embalg_S_id: selected?.id,
                        }));
                      }}
                      value={formData.produit_Embalg_S_id ? produits.find((prod) => prod.id === formData.produit_Embalg_S_id) : null}
                      renderInput={(params) => {
                        const hasError = !formData.produit_Embalg_S_id;
                        return (
                          <TextField
                            {...params}
                            placeholder="Code ..."
                            error={false}
                            variant="outlined"
                            sx={{
                              '& .MuiInputBase-root': {
                                height: '38px',
                                fontSize: '0.85em',
                                borderColor: hasError ? 'red' : 'inherit',
                              },
                              '& .MuiInputBase-input::placeholder': {
                                color: '#9ca3af !important',
                                opacity: '1 !important',
                                fontSize: '15px !important'
                              }
                            }}
                          />
                        );
                      }}
                    />
                  </StyledFormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  {/* Unité Emballage Secondaire */}
                  <StyledFormGroup icon={<Cube size={18} />} label="Unité Emballage Secondaire" htmlFor="unite_embalage_secondaire">
                    <input
                      id="unite_embalage_secondaire"
                      name="unite_embalage_secondaire"
                      value={formData.unite_embalage_secondaire}
                      onChange={handleChange}
                      style={inputStyle}
                      type="text"
                      placeholder="Unité Emballage Secondaire"
                      className="form-control styled-input"
                    />
                  </StyledFormGroup>
                </div>
              </div>
              {/* Row 3: Etiquette & Unité Etiquette */}
              <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  {/* Etiquette */}
                  <StyledFormGroup icon={<Tag size={18} />} label="Etiquette" htmlFor="produit_Embalg_id">
                    <Autocomplete
                      options={produits}
                      getOptionLabel={(option) => option.designation}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderOption={(props, option) => (
                        <li {...props} title={option.designation}>
                          {option.designation}
                        </li>
                      )}
                      sx={{ width: '100%' }}
                      onChange={(event, selected) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          produit_Embalg_id: selected?.id,
                        }));
                      }}
                      value={formData.produit_Embalg_id ? produits.find((prod) => prod.id === formData.produit_Embalg_id) : null}
                      renderInput={(params) => {
                        const hasError = !formData.produit_Embalg_id;
                        return (
                          <TextField
                            {...params}
                            placeholder="Code ..."
                            error={false}
                            variant="outlined"
                            sx={{
                              '& .MuiInputBase-root': {
                                height: '38px',
                                fontSize: '0.85em',
                                borderColor: hasError ? 'red' : 'inherit',
                              },
                              '& .MuiInputBase-input::placeholder': {
                                color: '#9ca3af !important',
                                opacity: '1 !important',
                                fontSize: '15px !important'
                              }
                            }}
                          />
                        );
                      }}
                    />
                  </StyledFormGroup>
                </div>
                <div style={{ flex: 1 }}>
                  {/* Unité Etiquette */}
                  <StyledFormGroup icon={<Cube size={18} />} label="Unité Etiquette" htmlFor="unite_etiquette">
                    <input
                      id="unite_etiquette"
                      name="unite_etiquette"
                      value={formData.unite_etiquette}
                      onChange={handleChange}
                      style={inputStyle}
                      type="text"
                      placeholder="Unité Etiquette"
                      className="form-control styled-input"
                    />
                  </StyledFormGroup>
                </div>
              </div>
            </Form>
          </Tab>
          <Tab eventKey="prix" title={<span><DollarSign className="me-2" size={16} />Prix</span>}>
            <div className="col row" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <div style={{ width: '101%', margin: 0.9, padding: 0.9 }}>
                <TableForms
                  title={"Prix Produit"}
                  addButtonText={"Ajouter Prix"}
                  items={selectedProductsDataRep}
                  onAddItem={handleAddEmptyRowRep}
                  onDeleteItem={(index, item) => handleDeleteProductRap(index, item.id)}
                  onItemChange={(index, field, value) => handleInputChangeRep(index, field, value)}
                  errors={errors}
                  showExpandableDetails={false}
                  columns={[
                    { key: 'prixProduit', label: 'Prix', width: '25%', type: 'text', placeholder: 'Prix' },
                    { key: 'date_debut', label: 'date début', width: '25%', type: 'date' },
                    { key: 'date_fin', label: 'date fin', width: '25%', type: 'date' },
                    {
                      key: 'type', label: 'Type', width: '25%', type: 'select', options: [
                        { value: '', label: 'Type' },
                        { value: 'L', label: 'Litre' },
                        { value: 'K', label: 'KG' },
                        { value: 'U', label: 'Unité' }
                      ]
                    },
                    { key: 'actions', label: 'Action', width: '10%', type: 'actions' }
                  ]}
                />
              </div>
              <div className="mt-5">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mt-5 d-flex justify-content-center">
                    <Button type="submit" className="btn-primary-custom mb-2 mx-2">Valider</Button>
                    <Button type="button" className="btn-secondary-custom mb-2 mx-2" onClick={closeForm}>Annuler</Button>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </Tab>
        </Tabs>
        {/* Restore original Calibre Modal */}
        <Modal show={showAddCalibre} onHide={() => setShowAddCalibre(false)}>
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Calibre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nom de Calibre"
                  value={newCategory.categorie}
                  onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })}
                  className="styled-input"
                  style={inputStyle}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <div className="form-group mt-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Calibre</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calibres.map(categ => (
                        <tr key={categ.id}>
                          <td>{categ.id}</td>
                          <td>{categ.calibre}</td>
                          <td>
                            <FontAwesomeIcon
                              onClick={() => handleEditClibre(categ)}
                              icon={faEdit}
                              style={{ color: "#007bff", cursor: "pointer" }}
                            />
                            <span style={{ margin: "0 8px" }}></span>
                            <FontAwesomeIcon
                              onClick={() => handleDeletecatgeorie(categ.id)}
                              icon={faTrash}
                              style={{ color: "#ff0000", cursor: "pointer" }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Form.Group className=" d-flex justify-content-center">
            <Fab
              variant="extended"
              className="btn-sm Fab mb-2 mx-2"
              type="submit"
              onClick={handleAddClibre}
            >
              Valider
            </Fab>
            <Fab
              variant="extended"
              className="btn-sm FabAnnule mb-2 mx-2"
              onClick={() => setShowAddCalibre(false)}
            >
              Annuler
            </Fab>
          </Form.Group>
        </Modal>
        {/* Restore original Edit Calibre Modal */}
        <Modal show={showEditClibreModal} onHide={() => setShowEditClibreModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Calibre </Form.Label>
                <Form.Control
                  type="text"
                  value={selectedCategoryId.calibre || ''}
                  onChange={(e) => setSelectedCategoryId({ ...selectedCategoryId, calibre: e.target.value })}
                  className="styled-input"
                  style={inputStyle}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Form.Group className="d-flex justify-content-center">
            <Fab
              variant="extended"
              className="btn-sm Fab mb-2 mx-2"
              onClick={handleSaveClibre}
            >
              Valider
            </Fab>
            <Fab
              variant="extended"
              className="btn-sm FabAnnule mb-2 mx-2"
              onClick={() => setShowEditClibreModal(false)}
            >
              Annuler
            </Fab>
          </Form.Group>
        </Modal>
        {/* Restore original Famille Modal */}
        <Modal show={showAddCategory} onHide={() => setShowAddCategory(false)}>
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Famille</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nom de la Famille"
                  value={newCategory.categorie}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCategory(prev => ({ ...prev, categorie: val }));
                  }}
                  className="styled-input"
                  style={inputStyle}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Logo de la Famille</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    console.log("File selected in ProduitForm:", file);
                    setNewCategory(prev => ({ ...prev, imageFile: file }));
                  }}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <div className="form-group mt-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Famille</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.filter((cat) => cat.idCatMer === null).map(categ => (
                        <tr key={categ.id}>
                          <td>{categ.id}</td>
                          <td>{categ.categorie}</td>
                          <td>
                            <FontAwesomeIcon
                              onClick={() => handleEditCategorie(categ)}
                              icon={faEdit}
                              style={{ color: "#007bff", cursor: "pointer" }}
                            />
                            <span style={{ margin: "0 8px" }}></span>
                            <FontAwesomeIcon
                              onClick={() => handleDeletecatgeorie(categ.id)}
                              icon={faTrash}
                              style={{ color: "#ff0000", cursor: "pointer" }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Form.Group className=" d-flex justify-content-center">
            <Fab
              variant="extended"
              className="btn-sm Fab mb-2 mx-2"
              onClick={handleAddCategory}
            >
              Valider
            </Fab>
            <Fab
              variant="extended"
              className="btn-sm FabAnnule mb-2 mx-2"
              onClick={() => setShowAddCategory(false)}
            >
              Annuler
            </Fab>
          </Form.Group>
        </Modal>
        {/* Restore original Edit Famille Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier la Famille</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <Form.Group className="mb-3">
                <Form.Label>Nom de la Famille</Form.Label>
                <Form.Control
                  type="text"
                  name="categorie"
                  value={selectedCategoryId?.categorie || ''}
                  onChange={(e) => setSelectedCategoryId({ ...selectedCategoryId, categorie: e.target.value })}
                  placeholder="Ex: Fruits, Légumes, Viandes"
                  isInvalid={!!errors.categorie}
                  className="styled-input"
                  style={inputStyle}
                />
                <Form.Text className="text-danger">
                  {errors.categorie}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Logo de la Famille</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setNewCategory(prev => ({ ...prev, imageFile: file }));
                  }}
                />
              </Form.Group>
              <Form.Group className="d-flex justify-content-center">
                <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" type="submit">
                  Valider
                </Fab>
                <Fab variant="extended" className="btn-sm FabAnnule mb-2 mx-2" onClick={() => setShowEditModal(false)}>
                  Annuler
                </Fab>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={showSuModal} onHide={() => setShowSuModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter une Sous-Catégorie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddSousCategory}>
              <Form.Group className="mb-3">
                <Form.Label>Nom de la Sous-Catégorie</Form.Label>
                <Form.Control
                  type="text"
                  name="sous_categorie"
                  value={newCategory.sous_categorie || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCategory(prev => ({ ...prev, sous_categorie: val }));
                  }}
                  placeholder="Ex: Fruits Frais, Fruits Secs, Légumes"
                  isInvalid={!!errors.sous_categorie}
                  className="styled-input"
                  style={inputStyle}
                />
                <Form.Text className="text-danger">
                  {errors.sous_categorie}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={newCategory.description || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCategory(prev => ({ ...prev, description: val }));
                  }}
                  placeholder="Description de la sous-catégorie"
                  className="styled-input"
                  style={inputStyle}
                />
              </Form.Group>
              <Form.Group className="d-flex justify-content-center">
                <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" type="submit">
                  Valider
                </Fab>
                <Fab variant="extended" className="btn-sm FabAnnule mb-2 mx-2" onClick={() => setShowSuModal(false)}>
                  Annuler
                </Fab>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={showEditSousModal} onHide={() => setShowEditSousModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier la Sous-Catégorie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSousCategorie}>
              <Form.Group className="mb-3">
                <Form.Label>Nom de la Sous-Catégorie</Form.Label>
                <Form.Control
                  type="text"
                  name="sous_categorie"
                  value={newCategory.sous_categorie || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCategory(prev => ({ ...prev, sous_categorie: val }));
                  }}
                  placeholder="Ex: Fruits Frais, Fruits Secs, Légumes"
                  isInvalid={!!errors.sous_categorie}
                  className="styled-input"
                  style={inputStyle}
                />
                <Form.Text className="text-danger">
                  {errors.sous_categorie}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={newCategory.description || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCategory(prev => ({ ...prev, description: val }));
                  }}
                  placeholder="Description de la sous-catégorie"
                  className="styled-input"
                  style={inputStyle}
                />
              </Form.Group>
              <Form.Group className="d-flex justify-content-center">
                <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" type="submit">
                  Valider
                </Fab>
                <Fab variant="extended" className="btn-sm FabAnnule mb-2 mx-2" onClick={() => setShowEditSousModal(false)}>
                  Annuler
                </Fab>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default ProduitForm;