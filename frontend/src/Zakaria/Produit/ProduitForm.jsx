import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { Fab } from '@mui/material';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ProduitForm(props) {
  const {
    handleSubmit,
    editingProduit,
    showAddCalibre,
    setShowAddCalibre,
    calibres,
    formData,
    handleChange,
    errors,
    newCategory,
    setNewCategory,
    handleEditClibre,
    handleDeletecatgeorie,
    handleAddClibre,
    showEditClibreModal,
    selectedCategoryId,
    setSelectedCategoryId,
    handleSaveClibre,
    showAddCategory,
    setShowAddCategory,
    categories,
    handleEditCategorie,
    handleAddCategory,
    showSuModal,
    setShowSuModal,
    handleAddSousCategory,
    showEditModal,
    setShowEditModal,
    handleSave,
    showEditSousModal,
    setShowEditSousModal,
    handleSuCategorie,
    selectedProductsDataRep,
    handleInputChangeRep,
    handleDeleteProductRap,
    closeForm,
    handleAddEmptyRowRep,
  } = props;

  return (
    <Form className="col row" onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
      <Form.Label className="text-center ">
        <h4
          style={{
            fontSize: '25px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            color: 'black',
            borderBottom: '2px solid black',
            paddingBottom: '5px',
          }}
        >
          {editingProduit ? 'Modifier' : 'Ajouter'} un Produit
        </h4>
      </Form.Label>

      <Form.Group className="col-sm-6 mt-1" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <FontAwesomeIcon icon={faPlus} className="ml-2 text-primary" style={{ cursor: 'pointer', marginTop: '-10px' }} onClick={() => setShowAddCalibre(true)} />
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '7px' }}>Calibre</Form.Label>
        <Form.Select style={{ flex: '2' }} name="calibre_id" value={formData.calibre_id} onChange={handleChange} className="form-select form-select">
          <option value="">Sélectionner un calibre</option>
          {calibres.map((calibre) => (
            <option key={calibre.id} value={calibre.id}>
              {calibre.calibre}
            </option>
          ))}
          <Form.Text className="text-danger">{errors.calibre_id}</Form.Text>
        </Form.Select>
      </Form.Group>

      <Modal show={showAddCalibre} onHide={() => setShowAddCalibre(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Calibre</Form.Label>
              <Form.Control type="text" placeholder="Nom de Calibre" value={newCategory.categorie} onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })} />
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
                    {calibres.map((categ) => (
                      <tr key={categ.id}>
                        <td>{categ.id}</td>
                        <td>{categ.calibre}</td>
                        <td>
                          <FontAwesomeIcon onClick={() => handleEditClibre(categ)} icon={faEdit} style={{ color: '#007bff', cursor: 'pointer' }} />
                          <span style={{ margin: '0 8px' }}></span>
                          <FontAwesomeIcon onClick={() => handleDeletecatgeorie(categ.id)} icon={faTrash} style={{ color: '#ff0000', cursor: 'pointer' }} />
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
          <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" type="submit" onClick={handleAddClibre}>
            Valider
          </Fab>
          <Fab variant="extended" className="btn-sm FabAnnule mb-2 mx-2" onClick={() => setShowAddCalibre(false)}>
            Annuler
          </Fab>
        </Form.Group>
      </Modal>

      <Modal show={showEditClibreModal} onHide={() => setShowEditClibreModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Calibre </Form.Label>
              <Form.Control type="text" value={selectedCategoryId.calibre || ''} onChange={(e) => setSelectedCategoryId({ ...selectedCategoryId, calibre: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Form.Group className="d-flex justify-content-center">
          <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" onClick={handleSaveClibre}>
            Valider
          </Fab>
          <Fab variant="extended" className="btn-sm FabAnnule mb-2 mx-2" onClick={() => setShowEditClibreModal(false)}>
            Annuler
          </Fab>
        </Form.Group>
      </Modal>

      <Form.Group className="col-sm-6" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <FontAwesomeIcon icon={faPlus} className="ml-2 text-primary" style={{ cursor: 'pointer', marginTop: '-5px' }} onClick={() => setShowAddCategory(true)} />
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px', marginTop: '7px' }}>Famille</Form.Label>
        <Form.Select style={{ flex: '2' }} name="categorie_id" value={formData.categorie_id} onChange={handleChange} isInvalid={!!errors.categorie_id}>
          <option value="">Sélectionner une Famille</option>
          {categories
            .filter((cat) => cat.idCatMer === null)
            .map((category) => (
              <option key={category.id} value={category.id}>
                {category.categorie}
              </option>
            ))}
        </Form.Select>
      </Form.Group>

      <Modal show={showAddCategory} onHide={() => setShowAddCategory(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Famille</Form.Label>
              <Form.Control type="text" placeholder="Nom de la Famille" value={newCategory.categorie} onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })} />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Logo de la Famille</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setNewCategory({ ...newCategory, imageFile: e.target.files[0] })} />
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
                    {categories
                      .filter((cat) => cat.idCatMer === null)
                      .map((categ) => (
                        <tr key={categ.id}>
                          <td>{categ.id}</td>
                          <td>{categ.categorie}</td>
                          <td>
                            <FontAwesomeIcon onClick={() => handleEditCategorie(categ)} icon={faEdit} style={{ color: '#007bff', cursor: 'pointer' }} />
                            <span style={{ margin: '0 8px' }}></span>
                            <FontAwesomeIcon onClick={() => handleDeletecatgeorie(categ.id)} icon={faTrash} style={{ color: '#ff0000', cursor: 'pointer' }} />
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
          <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" type="submit" onClick={handleAddCategory}>
            Valider
          </Fab>
          <Fab variant="extended" className="btn-sm FabAnnule mb-2 mx-2" onClick={() => setShowAddCategory(false)}>
            Annuler
          </Fab>
        </Form.Group>
      </Modal>

      <Modal show={showSuModal} onHide={() => setShowSuModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Control type="text" placeholder="Nom de Sous-catégorie" value={newCategory.categorie} onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })} />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Type</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setNewCategory({ ...newCategory, imageFile: e.target.files[0] })} />
            </Form.Group>
            <Form.Group className="mt-3">
              <div className="form-group mt-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories
                      .filter((cat) => cat.idCatMer !== null && cat.idCatMer === Number(formData.categorie_id))
                      .map((categ) => (
                        <tr key={categ.id}>
                          <td>{categ.id}</td>
                          <td>{categ.categorie}</td>
                          <td>
                            <FontAwesomeIcon onClick={() => handleEditSousCategorie(categ)} icon={faEdit} style={{ color: '#007bff', cursor: 'pointer' }} />
                            <span style={{ margin: '0 8px' }}></span>
                            <FontAwesomeIcon onClick={() => handleDeletecatgeorie(categ.id)} icon={faTrash} style={{ color: '#ff0000', cursor: 'pointer' }} />
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
          <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" type="submit" onClick={handleAddSousCategory}>
            Valider
          </Fab>
          <Fab variant="extended" className="btn-sm FabAnnule mb-2 mx-2" onClick={() => setShowSuModal(false)}>
            Annuler
          </Fab>
        </Form.Group>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom de la Famille</Form.Label>
              <Form.Control type="text" value={selectedCategoryId.categorie || ''} onChange={(e) => setSelectedCategoryId({ ...selectedCategoryId, categorie: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Logo de la Famille</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setNewCategory({ ...newCategory, imageFile: e.target.files[0] })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Form.Group className="d-flex justify-content-center">
          <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" onClick={handleSave}>
            Valider
          </Fab>
          <Fab variant="extended" className="btn-sm FabAnnule mb-2 mx-2" onClick={() => setShowEditModal(false)}>
            Annuler
          </Fab>
        </Form.Group>
      </Modal>

      <Modal show={showEditSousModal} onHide={() => setShowEditSousModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom de Type</Form.Label>
              <Form.Control type="text" value={selectedCategoryId.categorie || ''} onChange={(e) => setSelectedCategoryId({ ...selectedCategoryId, categorie: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Logo de la Famille</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={(e) => setNewCategory({ ...newCategory, imageFile: e.target.files[0] })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Form.Group className="d-flex justify-content-center">
          <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" onClick={handleSave}>
            Valider
          </Fab>
          <Fab variant="extended" className="btn-sm FabAnnule mb-2 mx-2" onClick={() => setShowEditSousModal(false)}>
            Annuler
          </Fab>
        </Form.Group>
      </Modal>

      <Form.Group className="col-sm-6" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <div style={{ width: '10px' }}>
          {formData.categorie_id ? (
            <FontAwesomeIcon onClick={() => handleSuCategorie(formData.categorie_id)} icon={faPlus} style={{ color: '#007bff', cursor: 'pointer' }} />
          ) : (
            ''
          )}
        </div>
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px', marginTop: '7px' }}>Type</Form.Label>
        <Form.Select style={{ flex: '2' }} name="suCat_id" value={formData.suCat_id} onChange={handleChange}>
          <option value="">Sélectionner une Type</option>
          {categories
            .filter((cat) => cat.idCatMer !== null && cat.idCatMer === Number(formData.categorie_id))
            .map((category) => (
              <option key={category.id} value={category.id}>
                {category.categorie}
              </option>
            ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="code_produit">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Code Produit</Form.Label>
        <Form.Control style={{ flex: '2', marginTop: '5px' }} type="text" name="Code_produit" value={formData.Code_produit} onChange={handleChange} placeholder="Code produit" isInvalid={!!errors.Code_produit} />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="designation">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Désignation</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Désignation" isInvalid={!!errors.designation} />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Logo du Produit</Form.Label>
        <Form.Control style={{ flex: '2' }} type="file" name="logoP" onChange={handleChange} className="form-control" lang="fr" accept="image/*" />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="type_quantite">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Type de Quantité</Form.Label>
        <div style={{ flex: '2' }}>
          {['kg', 'unite', 'litre', 'kg/unite', 'M'].map((value) => (
            <Form.Check key={value} type="radio" label={value === 'unite' ? 'Unite' : value} name="type_quantite" value={value} onChange={handleChange} checked={formData.type_quantite === value} isInvalid={!!errors.type_quantite} />
          ))}
        </div>
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Marque</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="marque" value={formData.marque} onChange={handleChange} placeholder="Marque" className="form-control" />
        <Form.Text className="text-danger">{errors.maque}</Form.Text>
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Unité</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="unite" value={formData.unite} onChange={handleChange} placeholder="Unité" className="form-control" />
        <Form.Text className="text-danger">{errors.unite}</Form.Text>
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="type_quantite">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Type de produit</Form.Label>
        <div style={{ flex: '2' }}>
          {['MATIERE PREMIERE', 'PRODUCTIN'].map((value) => (
            <Form.Check key={value} type="radio" label={value} name="type_produit" value={value === 'MATIERE PREMIERE' ? 'M' : 'P'} onChange={handleChange} checked={formData.type_produit === (value === 'MATIERE PREMIERE' ? 'M' : 'P')} />
          ))}
        </div>
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>durée de vie</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="Dvie" value={formData.Dvie} onChange={handleChange} placeholder="durée de vie" className="form-control" />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px', marginRight: '10px' }}>Genre</Form.Label>
        <Form.Select aria-label="Default select example" style={{ flex: '2' }} name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" className="form-control">
          <option value="">Genre</option>
          <option value="vente">Vente</option>
          <option value="achat">Achat</option>
          <option value="venteachat">Vente & Achat</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Seuil d'alerte</Form.Label>
        <Form.Control style={{ flex: '2' }} type="number" name="seuil_alerte" value={formData.seuil_alerte} onChange={handleChange} placeholder="seuil d'alerte" className="form-control" />
        <Form.Text className="text-danger">{errors.seuil_alerte}</Form.Text>
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Stock Initial</Form.Label>
        <Form.Control style={{ flex: '2' }} type="number" name="stock_initial" value={formData.stock_initial} onChange={handleChange} placeholder="stock initial" className="form-control" />
        <Form.Text className="text-danger">{errors.stock_initial}</Form.Text>
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>État de produit</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="etat_produit" value={formData.etat_produit} onChange={handleChange} placeholder="etat de produit" className="form-control" />
        <Form.Text className="text-danger">{errors.etat_produit}</Form.Text>
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="produit_Embalg_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Emballage Primaire</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="produit_Embalg_id" value={formData.produit_Embalg_id || ''} onChange={handleChange} placeholder="Emballage Primaire" className="form-control" />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="unite_embalage_primaire">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Unité Emballage Primaire</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="unite_embalage_primaire" value={formData.unite_embalage_primaire || ''} onChange={handleChange} placeholder="Unité Emballage Primaire" className="form-control" />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="produit_Embalg_S_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Emballage Secondaire</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="produit_Embalg_S_id" value={formData.produit_Embalg_S_id || ''} onChange={handleChange} placeholder="Emballage Secondaire" className="form-control" />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="unite_embalage_secondaire">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Unité Emballage Secondaire</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="unite_embalage_secondaire" value={formData.unite_embalage_secondaire || ''} onChange={handleChange} placeholder="Unité Emballage Secondaire" className="form-control" />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="produit_Etiq_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Etiquette</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="produit_Etiq_id" value={formData.produit_Etiq_id || ''} onChange={handleChange} placeholder="Etiquette" className="form-control" />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="unite_etiquette">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Unité Etiquette</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="unite_etiquette" value={formData.unite_etiquette || ''} onChange={handleChange} placeholder="Unité Etiquette" className="form-control" />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="emballage_primaire_label">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Libellé Emballage Primaire</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="emballage_primaire_label" value={formData.emballage_primaire_label || ''} onChange={handleChange} placeholder="Libellé Emballage Primaire" className="form-control" />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="emballage_secondaire_label">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Libellé Emballage Secondaire</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="emballage_secondaire_label" value={formData.emballage_secondaire_label || ''} onChange={handleChange} placeholder="Libellé Emballage Secondaire" className="form-control" />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="etiquette_label">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Libellé Etiquette</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="etiquette_label" value={formData.etiquette_label || ''} onChange={handleChange} placeholder="Libellé Etiquette" className="form-control" />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Prix Vente</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="prix_vente" value={formData.prix_vente} onChange={handleChange} placeholder="Prix Vente" className="form-control" />
      </Form.Group>

      <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
        <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>TVA</Form.Label>
        <Form.Control style={{ flex: '2' }} type="text" name="tva" value={formData.tva} onChange={handleChange} placeholder="TVA" className="form-control" />
      </Form.Group>


      <div style={{ marginLeft: '10px' }}>
        <a href="#" onClick={handleAddEmptyRowRep}>
          <Button className="btn btn-sm mb-2" variant="primary">
            <FontAwesomeIcon icon={faPlus} />
          </Button>
          <span style={{ margin: '0 8px' }}></span>
          <strong style={{ color: 'black' }}>Ajouter Prix</strong>
        </a>
      </div>

      <Form.Group controlId="selectedProduitTable " className="col-sm-12 " style={{ padding: '1px' }}>
        <div className="table-responsive" style={{ padding: '0' }}>
          <table className="table table-bordered" style={{ width: '100%', marginTop: '2px', padding: '0' }}>
            <thead>
              <tr>
                <th colSpan={50}> Prix Produit</th>
              </tr>
              <tr>
                <th className="ColoretableForm">Prix</th>
                <th className="ColoretableForm">date début</th>
                <th className="ColoretableForm">date fin</th>
                <th className="ColoretableForm" style={{ width: '150px' }}>
                  Type
                </th>
                <th className="ColoretableForm">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedProductsDataRep?.map((productData, index) => (
                <tr key={index}>
                  <td style={{ backgroundColor: 'white' }}>
                    <Form.Control type="text" value={productData.prixProduit} onChange={(e) => handleInputChangeRep(index, 'prixProduit', e.target.value)} placeholder="Prix" />
                  </td>
                  <td style={{ backgroundColor: 'white' }}>
                    <Form.Control type="date" value={productData.date_debut} onChange={(e) => handleInputChangeRep(index, 'date_debut', e.target.value)} placeholder="Date debut" />
                  </td>
                  <td style={{ backgroundColor: 'white' }}>
                    <Form.Control type="date" value={productData.date_fin} onChange={(e) => handleInputChangeRep(index, 'date_fin', e.target.value)} placeholder="Date fin" isInvalid={!!errors.date_fin} />
                  </td>
                  <td style={{ backgroundColor: 'white' }}>
                    <Form.Select value={formData.type_quantite === 'kg' ? 'K' : formData.type_quantite === 'litre' ? 'L' : formData.type_quantite === 'unite' ? 'U' : productData.type} onChange={(e) => handleInputChangeRep(index, 'type', e.target.value)} style={{ padding: '8px', fontSize: '14px' }}>
                      <option value="">Type</option>
                      <option value="L">Litre</option>
                      <option value="K">KG</option>
                      <option value="U">Unité</option>
                    </Form.Select>
                  </td>
                  <td style={{ backgroundColor: 'white', width: '10%' }}>
                    <a href="#">
                      <FontAwesomeIcon color="red" onClick={() => handleDeleteProductRap(index, productData.id)} icon={faTrash} />
                    </a>
                  </td>
                </tr>
              ))}
              {errors.products && (
                <tr>
                  <td colSpan="5" className="text-danger text-center">
                    {errors.products}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Form.Group>

      <div className="mt-5">
        <Form.Group className="mt-5 d-flex justify-content-center">
          <Fab variant="extended" className="btn-sm Fab mb-2 mx-2" type="submit">
            Valider
          </Fab>
          <Fab variant="extended" className="btn-sm FabAnnule mb-2 mx-2" onClick={closeForm}>
            Annuler
          </Fab>
        </Form.Group>
      </div>
    </Form>
  );
}


