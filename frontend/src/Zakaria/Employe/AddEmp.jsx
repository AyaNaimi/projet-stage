import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Button, Card, Tab, Tabs, Table, Modal,Form } from 'react-bootstrap';

import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faFilePdf, faFileExcel, faPrint, faEye, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import './AddEmp.css';
import { User, CreditCard, Tag, BadgeCheck, Upload , Loader2, Calendar, MapPin , Flag, Users, Heart, Baby, FileText, Building , ShieldCheck, Mail, Phone, Printer, Briefcase, BarChart2, ArrowUpCircle, Percent, LogIn, UserPlus,Plus,
   LogOut, DollarSign,TrendingUp, MessageSquare, Layers, Grid, Edit, FileSignature, AlertCircle, Clock, CalendarX, 
  Watch, Scissors, CalendarMinus, FileMinus, AlertTriangle, 
   Activity, Save, List, Trash2, X } from "lucide-react";
import { FaPlusCircle } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";



import 'react-toastify/dist/ReactToastify.css';
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";



const loaderCSS = `

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}


@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }

}



`;


function AddEmp({
  departementId,
  toggleEmpForm, 
  selectedDepartementId,
  onEmployeAdded = () => { },
  selectedEmployer,
  onEmployeUpdated,
  fetchEmployers,
  isAddingEmploye
}) {
  const [key, setKey] = useState('home');
  const [idDep, setIdDep] = useState('');
  const [contracts, setContracts] = useState([]);
  const [editingContractId, setEditingContractId] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editedContract, setEditedContract] = useState(null);

  const [contractTypes, setContractTypes] = useState([]);
  const [showContractTypeModal, setShowContractTypeModal] = useState(false);
  const [showContractTypeListModal, setShowContractTypeListModal] = useState(false);
  const [newContractType, setNewContractType] = useState('');
  const [editingContractTypeId, setEditingContractTypeId] = useState(null);

  const [loading, setLoading] = useState(false);


// section poste
const [departements, setDepartements] = useState([]);
const [showPosteModal, setShowPosteModal] = useState(false);
const [showCategorieModal, setShowCategorieModal] = useState(false);
const [newPoste, setNewPoste] = useState('');
const [newCategorie, setNewCategorie] = useState('');
const [posteSelectionne, setPosteSelectionne] = useState(null);
const [communes, setCommunes] = useState([]);
const [pays, setPays] = useState([]);
const [villes, setVilles] = useState([]);

const [showCommuneModal, setShowCommuneModal] = useState(false);
const [showPaysModal, setShowPaysModal] = useState(false);
const [showVilleModal, setShowVilleModal] = useState(false);

const [newCommune, setNewCommune] = useState('');
const [newPays, setNewPays] = useState('');
const [newVille, setNewVille] = useState('');

const [postes, setPostes] = useState([
]);




const [bulletinModeles, setBulletinModeles] = useState([]);
const [assignedBulletinModeles, setAssignedBulletinModeles] = useState([
  {
    id: null,
    bulletin_modele_id: '',
    date_debut: '',
    date_fin: ''
  }
]);








const [editingPaysId, setEditingPaysId] = useState(null);
const [paysList, setPaysList] = useState([]);
const [editingCommuneId, setEditingCommuneId] = useState(null);
const [editingVilleId, setEditingVilleId] = useState(null);
const [selectedPays, setSelectedPays] = useState(null);

const [selectedCommune, setSelectedCommune] = useState(null);
const [selectedVille, setSelectedVille] = useState(null);
const [newCodePays, setNewCodePays] = useState('');
const [selectedPaysId, setSelectedPaysId] = useState(null);
const [selectedVilleId, setSelectedVilleId] = useState(null);

const [selectedDepartement, setSelectedDepartement] = useState(null);
const [showDepartementModal, setShowDepartementModal] = useState(false);
const [newDepartement, setNewDepartement] = useState('');
const [newCodeDepartement, setNewCodeDepartement] = useState('');
const [editingDepartementId, setEditingDepartementId] = useState(null);

const [services, setServices] = useState([]);
const [selectedService, setSelectedService] = useState(null);
const [newService, setNewService] = useState('');

const [showServiceModal, setShowServiceModal] = useState(false);
const [newServiceName, setNewServiceName] = useState('');
// const [selectedDepartementId, setSelectedDepartementId] = useState('');

const [unites, setUnites] = useState([]);
const [selectedUnite, setSelectedUnite] = useState(null);
const [newUniteName, setNewUniteName] = useState("");
const [showUniteModal, setShowUniteModal] = useState(false);
const [selectedServiceIdb, setSelectedServiceId] = useState("");

const [selectedPoste, setSelectedPoste] = useState(null);
const [newPosteName, setNewPosteName] = useState('');


const [calendriers, setCalendriers] = useState([]);
const [assignedCalendriers, setAssignedCalendriers] = useState([
  {
    calendrier_id: '',
    date_debut: '',
    date_fin: ''
  }
]);

const [selectedCalendrierId, setSelectedCalendrierId] = useState("");
const [dateDebut, setDateDebut] = useState("");
const [dateFin, setDateFin] = useState("");

const [banques, setBanques] = useState([]);
const [selectedBanque, setSelectedBanque] = useState(null);
const [showBanqueModal, setShowBanqueModal] = useState(false);

const [agences, setAgences] = useState([]);
const [selectedAgence, setSelectedAgence] = useState(null);
const [showAgenceModal, setShowAgenceModal] = useState(false);

const [newBanque, setNewBanque]       = useState('');
const [editingBanqueId, setEditingBanqueId] = useState(null);
const [newAgence, setNewAgence]           = useState('');
const [selectedBanqueId, setSelectedBanqueId] = useState(null);
const [editingAgenceId, setEditingAgenceId] = useState(null);
const [isExpanded, setIsExpanded] = useState(false);






const [categories, setCategories] = useState([
  { id: 1, nom: 'Cadre' },
  { id: 2, nom: 'Technicien' },
  { id: 3, nom: 'Opérateur' }
]);

const [selectedCategorie, setSelectedCategorie] = useState(null);



// ── Auth helper ──────────────────────────────────────────────────────────────
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// ─────────────────────────────────────────────────────────────────────────────

const handleCategorieChange = (selectedOption) => {
  setSelectedCategorie(selectedOption);
};


// A revoir 
const handleAddCalendrier = () => {
  const newCalendrier = {
    calendrier_id: '',
    date_debut: '',
    date_fin: ''
  };

  setAssignedCalendriers([...assignedCalendriers, newCalendrier]);
};



const handleDeleteCalendrier = (index) => {
  const updatedCalendriers = assignedCalendriers.filter((_, i) => i !== index);
  setAssignedCalendriers(updatedCalendriers);
};













const initialContractState = {
  numero_contrat: '',
  type_contrat: '',
  arret_prevu: '',
  duree_prevu: '',
  design: '',
  debut_le: '',
  arret_effectif: '',
  duree_effective: '',
  rupture: {
    motif_depart: '',
    dernier_jour_travaille: ''
  },
  licenciement: {
    notification_rupture: '',
    engagement_procedure: '',
    signature_rupture_conventionnelle: '',
    transaction_en_cours: false
  }
};
  const initialFormState = {
    matricule: '',
    num_badge: '',
    nom: '',
    prenom: '',
    lieu_naiss: '',
    date_naiss: '',
    cin: '',
    cnss: '',
    sexe: '',
    situation_fm: '',
    nb_enfants: '0',
    // adresse: '',
    // ville: '',
    // pays: '',
    // code_postal: '',
    tel: '',
    fax: '',
    email: '',
    fonction: '',
    nationalite: '',
    niveau: '',
    echelon: '',
    categorie: '',
    coeficients: '',
    imputation: '',
    date_entree: '',
    date_embauche: '',
    date_fin: '',
    remarque: '',
    centreCout: '',
    departement_id: '',
    salaire: {
      bulletin_modele: "",
      salaire_base: "",
      salaire_moyen: "",
      salaire_reference_annuel: ""
    },
  
    poste: {
      id: '',
      categorie: '',
      planning: ''
    },  

    adresse: {
      adress: '',
      commune: '',
      codePays: '',
      pays: '',
      ville: '',
      code_postal: '',
    },

    compteBancaire: {
      banqueId: '',
      agenceId: '',
      rib: '',
      iban: ''
    },
  
  
    contrat: initialContractState,
  };


  
  const [formData, setFormData] = useState(initialFormState);
  const [url_img, setUrl_img] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  

  const loadBulletinModeles = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/bultinmodels');
      const data = await response.json();
      setBulletinModeles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des bulletin modèles :', error);
    }
  };
  
  // const handleAddBulletinModele = () => {
  //   setAssignedBulletinModeles([
  //     ...assignedBulletinModeles,
  //     {
  //       id: null,
  //       bulletin_modele_id: '',
  //       date_debut: '',
  //       date_fin: ''
  //     }
  //   ]);
  // };
  
  const handleAddBulletinModele = async () => {
    try {
      console.log("Envoi des bulletins à :", `http://127.0.0.1:8000/api/employes/${employeId}/bulletins`);
      console.log("Données envoyées :", assignedBulletinModeles);
  
      const response = await axios.post(`http://127.0.0.1:8000/api/employes/${employeId}/bulletins`, {
        bulletins: assignedBulletinModeles
      }, { headers: getAuthHeaders() });
  
      alert('Bulletins enregistrés avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des bulletins:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };
  
  
  
  const handleChangeBulletinModele = (index, value) => {
    const updatedModeles = [...assignedBulletinModeles];
    updatedModeles[index].bulletin_modele_id = value;
    setAssignedBulletinModeles(updatedModeles);
  };
  
  const handleChangeBulletinDate = (index, field, value) => {
    const updatedModeles = [...assignedBulletinModeles];
    updatedModeles[index][field] = value;
    setAssignedBulletinModeles(updatedModeles);
  };
  
  const handleDeleteBulletinModele = (index) => {
    const updatedModeles = assignedBulletinModeles.filter((_, i) => i !== index);
    setAssignedBulletinModeles(updatedModeles);
  };
  

  const handleEditBulletinModele = async (id) => {
    try {
      console.log('Modifier bulletin modèle ID:', id);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      showErrorNotification('Erreur lors de la modification');
    }
  };
  
  useEffect(() => {
    loadBulletinModeles();
  }, []);







  // useEffect(() => {
  //   if (selectedDepartementId) {
  //     console.log("Selected employer:", selectedEmployer);

  //     setIdDep(selectedDepartementId);
  //     setFormData((prevState) => ({
  //       ...prevState,
        
  //       departement_id: selectedDepartementId,
  //     }));
  //   }
  // }, [selectedDepartementId]);


  useEffect(() => {
    if (selectedEmployer) {
      const empAdresse = typeof selectedEmployer.adresse === 'object' && selectedEmployer.adresse !== null
        ? {
            rue: selectedEmployer.adresse.rue || selectedEmployer.adresse.adress || selectedEmployer.adresse.adresse || '',
            adress: selectedEmployer.adresse.adress || selectedEmployer.adresse.rue || selectedEmployer.adresse.adresse || '',
            adresse: selectedEmployer.adresse.adresse || selectedEmployer.adresse.rue || selectedEmployer.adresse.adress || '',
            ville: selectedEmployer.adresse.ville || selectedEmployer.ville || '',
            pays: selectedEmployer.adresse.pays || selectedEmployer.pays || '',
            code_postal: selectedEmployer.adresse.code_postal || selectedEmployer.adresse.codePostal || selectedEmployer.code_postal || '',
            codePostal: selectedEmployer.adresse.codePostal || selectedEmployer.adresse.code_postal || selectedEmployer.code_postal || '',
            commune: selectedEmployer.adresse.commune || selectedEmployer.commune || '',
            codePays: selectedEmployer.adresse.codePays || selectedEmployer.code_pays || ''
          }
        : {
            rue: selectedEmployer.adresse || '',
            adress: selectedEmployer.adresse || '',
            adresse: selectedEmployer.adresse || '',
            ville: selectedEmployer.ville || '',
            pays: selectedEmployer.pays || '',
            code_postal: selectedEmployer.code_postal || '',
            codePostal: selectedEmployer.code_postal || '',
            commune: selectedEmployer.commune || '',
            codePays: selectedEmployer.code_pays || ''
          };

      setFormData((prevState) => ({
        ...initialFormState,
        ...selectedEmployer,
        adresse: empAdresse,
        departement_id: idDep,
        contrat: selectedEmployer.contrat?.[0] || {}
      }));
      setImagePreview(
        selectedEmployer.url_img
          ? `http://127.0.0.1:8000/storage/${selectedEmployer.url_img}`
          : null
      );
      fetchContracts(selectedEmployer.id);

      const targetPays = selectedEmployer.pays || (typeof selectedEmployer.adresse === 'object' ? selectedEmployer.adresse?.pays : null);
      const targetCodePays = selectedEmployer.code_pays || (typeof selectedEmployer.adresse === 'object' ? selectedEmployer.adresse?.codePays : null);
      const targetVille = selectedEmployer.ville || (typeof selectedEmployer.adresse === 'object' ? selectedEmployer.adresse?.ville : null);
      const targetCommune = selectedEmployer.commune || (typeof selectedEmployer.adresse === 'object' ? selectedEmployer.adresse?.commune : null);

      if ((targetPays || targetCodePays) && pays.length > 0) {
        const foundPays = pays.find(p => p.nom === targetPays || p.code_pays === targetCodePays);
        if (foundPays) {
          const paysOpt = { value: foundPays.id, label: foundPays.nom, code_pays: foundPays.code_pays };
          setSelectedPays(paysOpt);
          setSelectedPaysId(foundPays.id);

          axios.get(`http://127.0.0.1:8000/api/villes?pays_id=${foundPays.id}`, { headers: getAuthHeaders() })
            .then(res => {
              setVilles(res.data);
              if (targetVille) {
                const foundVille = res.data.find(v => v.nom === targetVille);
                if (foundVille) {
                  const villeOpt = { value: foundVille.id, label: foundVille.nom };
                  setSelectedVille(villeOpt);
                  setSelectedVilleId(foundVille.id);

                  axios.get(`http://127.0.0.1:8000/api/communes?ville_id=${foundVille.id}`, { headers: getAuthHeaders() })
                    .then(cRes => {
                      setCommunes(cRes.data);
                      if (targetCommune) {
                        const foundCommune = cRes.data.find(c => c.nom === targetCommune);
                        setSelectedCommune({ value: targetCommune, label: targetCommune });
                      }
                    }).catch(console.error);
                } else {
                  setSelectedVille({ value: targetVille, label: targetVille });
                }
              }
            }).catch(console.error);
        }
      }
    } else {
      resetForm();
    }
  }, [selectedEmployer, idDep, pays]);

  

  
  useEffect(() => {
    fetchContractTypes();
  }, []);




  const fetchContractTypes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/contract-types', { headers: getAuthHeaders() });
      setContractTypes(response.data);
    } catch (error) {
      console.error('Error fetching contract types', error);
    }
  };




  const handleAddContractType = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/contract-types', {
        name: newContractType
      }, { headers: getAuthHeaders() });

      setContractTypes([...contractTypes, response.data]);
      setNewContractType('');
      showSuccessNotification("Type de contrat ajouté avec succès");
    } catch (error) {
      console.error('Error adding contract type', error);
      showErrorNotification(error.response?.data?.message || 'Erreur lors de l\'ajout du type de contrat');
    }
  };
  const handleUpdateContractType = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/contract-types/${editingContractTypeId}`, {
        name: newContractType
      }, { headers: getAuthHeaders() });

      const updatedTypes = contractTypes.map(type =>
        type.id === editingContractTypeId
          ? { ...type, name: newContractType }
          : type
      );
      setContractTypes(updatedTypes);

      showSuccessNotification("Type de contrat mis à jour avec succès");
      setEditingContractTypeId(null);
      setNewContractType('');
    } catch (error) {
      console.error('Error updating contract type', error);
      showErrorNotification(error.response?.data?.message || 'Erreur lors de la mise à jour du type de contrat');
    }
  };

  const handleDeleteContractType = async (typeId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/contract-types/${typeId}`, { headers: getAuthHeaders() });

      const updatedTypes = contractTypes.filter(type => type.id !== typeId);
      setContractTypes(updatedTypes);

      showSuccessNotification("Type de contrat supprimé avec succès");
    } catch (error) {
      console.error('Error deleting contract type', error);
      showErrorNotification(error.response?.data?.message || 'Erreur lors de la suppression du type de contrat');
    }
  };

  const fetchContracts = async (employeId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/employes/${employeId}/contrats`, { headers: getAuthHeaders() });
      setContracts(response.data);
    } catch (error) {
      console.error('Error fetching contracts', error);
    }
  };

  const resetForm = () => {
    setFormData({ ...initialFormState, departement_id: idDep });
    setImagePreview(null);
    setUrl_img(null);
    setContracts([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevState) => {
      const nameParts = name.split(".");
  
      if (nameParts.length === 1) {
        return { ...prevState, [name]: value };
      }
  
      if (nameParts[0] === "contrat") {
        if (nameParts.length === 3) {
          const section = nameParts[1];
          const field = nameParts[2];
          return {
            ...prevState,
            contrat: {
              ...prevState.contrat,
              [section]: {
                ...prevState.contrat[section] || {},
                [field]: value
              }
            }
          };
        } else {
          const field = nameParts[1];
          return {
            ...prevState,
            contrat: {
              ...prevState.contrat,
              [field]: value
            }
          };
        }
      }
  
      if (nameParts[0] === "salaire") {
        const field = nameParts[1];
        return {
          ...prevState,
          salaire: {
            ...prevState.salaire,
            [field]: value
          }
        };
      }
  
      if (nameParts.length === 2) {
        const [parent, child] = nameParts;
        return {
          ...prevState,
          [parent]: {
            ...prevState[parent],
            [child]: value
          }
        };
      }
  
      return { ...prevState, [name]: value };
    });
  };
  



  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUrl_img(file);
    setImagePreview(URL.createObjectURL(file));
  };



  const handleAddContract = async () => {
    try {
      const isContractEmpty = Object.values(formData.contrat).every(x => x === null || x === '');
      if (isContractEmpty) {
        showErrorNotification("Le contrat est vide. Veuillez remplir au moins un champ.");
        return;
      }

      if (editingContractId) {
        // Update existing contract
        const updatedContract = { ...formData.contrat, id: editingContractId };
        const updatedContracts = contracts.map(contract =>
          contract.id === editingContractId ? updatedContract : contract
        );
        setContracts(updatedContracts);
        showSuccessNotification("Contrat mis à jour avec succès");
      } else {
        const newContract = { ...formData.contrat };
        setContracts([...contracts, newContract]);
        showSuccessNotification("Contrat ajouté avec succès");
      }

      setFormData(prevState => ({
        ...prevState,
        contrat: initialContractState
      }));
      setEditingContractId(null);
    } catch (error) {
      console.error("Error adding/updating contract", error);
      showErrorNotification(error.response?.data?.message || "Erreur lors de l'ajout/mise à jour du contrat");
    }
  };

  const handleDeleteContract = async (contractId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
      try {
        if (typeof contractId === 'number') {
          await axios.delete(`http://127.0.0.1:8000/api/contrats/${contractId}`, { headers: getAuthHeaders() });
        }
        setContracts(prevContracts => prevContracts.filter(c => c.id !== contractId));
        setEditingContractId(null);
      } catch (error) {
        console.error('Error deleting contract', error);
        setError(error.response?.data?.message || "Erreur lors de la suppression du contrat.");
      }
    }
  };

  // Ajout de la fonction handleEditContract
  const handleEditContract = (contractId) => {
    const contractToEdit = contracts.find(contract => contract.id === contractId);
    if (contractToEdit) {
      setEditingRow(contractId);
      setEditedContract({ ...contractToEdit });
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditedContract(null);
  };

  const handleSaveContractEdit = async (contractId) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/contrats/${contractId}`, editedContract, { headers: getAuthHeaders() });
      setContracts(contracts.map(c => c.id === contractId ? response.data : c));
      setEditingRow(null);
      setEditedContract(null);
      showSuccessNotification('Contrat mis à jour avec succès');
    } catch (error) {
      console.error('Error updating contract:', error);
      showErrorNotification('Erreur lors de la mise à jour du contrat');
    }
  };

  const handleContractFieldChange = (field, value) => {
    setEditedContract(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    console.log("selectedDepartementId", selectedDepartementId);
    if (selectedDepartementId) {
      setIdDep(selectedDepartementId);
      setFormData((prevState) => ({
        ...prevState,
        departement_id: selectedDepartementId,
      }));
    }
  }, [selectedDepartementId]);



  function isDeepEmpty(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj === '' || obj === null || obj === undefined;
    }
    return Object.values(obj).every(isDeepEmpty);
  }
  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let response;
  
      console.log("=====  Données initiales de formData =====");
      console.log(formData);
  
      const submitData = new FormData();
  
      const appendFormData = (fd, data, parentKey = "") => {
        if (typeof data === "object" && data !== null && !(data instanceof File)) {
          Object.keys(data).forEach((key) => {
            const fullKey = parentKey ? `${parentKey}[${key}]` : key;
            appendFormData(fd, data[key], fullKey);
          });
        } else {
          fd.append(parentKey, data ?? "");
        }
      };
  
      for (const key in formData) {
        if (key !== "contrat") {
          appendFormData(submitData, formData[key], key);
        }
      }
  
      if (url_img) {
        submitData.append("url_img", url_img);
        console.log("Image ajoutée à submitData:", url_img);
      }
  
      for (let pair of submitData.entries()) {
      }
  
      if (selectedEmployer) {
        response = await axios.post(
          `http://127.0.0.1:8000/api/employes/${selectedEmployer.id}?_method=PUT`,
          submitData,
          {
            headers: { 
              "Content-Type": "multipart/form-data",
              ...getAuthHeaders()
            },
          }
        );
  
        console.log("==> Début mise à jour des contrats (mode édition)");
        console.time("Contrats édition");
  
        await Promise.all(
          contracts.map(async (contract) => {
            try {
              if (contract.id && typeof contract.id === "number") {
                console.log(`Mise à jour du contrat ID: ${contract.id}`);
                await axios.put(
                  `http://127.0.0.1:8000/api/contrats/${contract.id}`,
                  contract,
                  { headers: getAuthHeaders() }
                );
              } else {
                console.log("Ajout d'un nouveau contrat :", contract);
                await axios.post(`http://127.0.0.1:8000/api/contrats`, {
                  ...contract,
                  employe_id: selectedEmployer.id,
                }, { headers: getAuthHeaders() });
              }
            } catch (e) {
              console.error("Erreur contrat :", e.response?.data || e.message);
            }
          })
        );
  
        console.timeEnd("Contrats édition");
        console.log("==> Fin traitement des contrats");
  
        onEmployeUpdated(response.data);
      }
  
      else {
        console.log("==> Appel API création employé : POST http://127.0.0.1:8000/api/employe");

        response = await axios.post(`http://127.0.0.1:8000/api/employe`, submitData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            ...getAuthHeaders()
          },
        });
  
        const employeId = response.data.id;
        console.log("==> Employé créé avec ID :", employeId);
        if (assignedBulletinModeles?.length > 0) {
          try {
            const resBulletins = await axios.post(
              `http://127.0.0.1:8000/api/employes/${employeId}/bulletins`,
              {
                bulletins: assignedBulletinModeles,
              },
              { headers: getAuthHeaders() }
            );
            console.log("Bulletins ajoutés avec succès :", resBulletins.data);
          } catch (e) {
            console.error("Erreur lors de l'ajout des bulletins :", e.response?.data || e.message);
          }
        }
        
        console.log("==> Début création des contrats");
  
        const isContractEmpty = isDeepEmpty(formData.contrat);
  
        const contractsToSubmit = contracts.length
          ? contracts
          : !isContractEmpty
          ? [formData.contrat]
          : [];
  
        console.log("Contracts à traiter :", contractsToSubmit);
        console.time("Contrats ajout");
  
        await Promise.all(
          contractsToSubmit.map(async (contract) => {
            try {
              const res = await axios.post(`http://127.0.0.1:8000/api/contrats`, {
                ...contract,
                employe_id: employeId,
              }, { headers: getAuthHeaders() });
              console.log("Contrat ajouté avec succès :", res.data);
            } catch (e) {
              console.error("Erreur ajout contrat :", e.response?.data || e.message);
            }
          })
        );
  
        console.timeEnd("Contrats ajout");
        console.log("==> Fin traitement des contrats");
  
        onEmployeAdded({
          ...response.data,
          employe_id: employeId,
          date_début: formData.date_entree,
        });
      }
  
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: selectedEmployer
          ? "Employé mis à jour avec succès"
          : "Employé ajouté avec succès",
        confirmButtonText: "OK",
      });
  
      resetForm();
      setError(null);
      // toggleEmpForm();
  
      if (typeof fetchEmployers === "function") {
        console.time("fetchEmployers");
        await new Promise((res) => setTimeout(res, 1500 ));
        await fetchEmployers(departementId);
        console.timeEnd("fetchEmployers");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
  
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response ? error.response.data.message : "Une erreur s'est produite",
        confirmButtonText: "OK",
      });
    }
  };
  




  


  
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: handleDrop,
  });

  const showSuccessNotification = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const showErrorNotification = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  ////////////////////////////////////// Section poste //////////////////////////////////////

// Fonction pour trouver un département par ID dans la structure hiérarchique
const findDepartementById = (departements, targetId) => {
  for (let dept of departements) {
    if (dept.id === targetId) {
      return dept;
    }
    if (dept.children && dept.children.length > 0) {
      const found = findDepartementById(dept.children, targetId);
      if (found) return found;
    }
  }
  return null;
};


// Fonction pour construire la chaîne hiérarchique d'un département
const buildHierarchyChain = (departements, targetId) => {
  const findParentChain = (depts, id, chain = []) => {
    for (let dept of depts) {
      if (dept.id === id) {
        chain.unshift(dept);
        return chain;
      }
      if (dept.children && dept.children.length > 0) {
        const result = findParentChain(dept.children, id, [...chain, dept]);
        if (result.length > 0) return result;
      }
    }
    return [];
  };

  return findParentChain(departements, targetId);
};




const organizeHierarchyFromDepartement = (departements, departementId) => {
  const hierarchyChain = buildHierarchyChain(departements, departementId);
  
  if (hierarchyChain.length === 0) return null;

  let hierarchy = {
    departement: null,
    service: null,
    unite: null,
    selectedDepartement: null
  };
  const selectedDept = hierarchyChain[hierarchyChain.length - 1];
  hierarchy.selectedDepartement = selectedDept;
  if (hierarchyChain.length === 1) {
    hierarchy.departement = selectedDept;
  } else if (hierarchyChain.length === 2) {
    hierarchy.departement = hierarchyChain[0];
    hierarchy.service = hierarchyChain[1];
  } else if (hierarchyChain.length === 3) {
    hierarchy.departement = hierarchyChain[0];
    hierarchy.service = hierarchyChain[1];    
    hierarchy.unite = hierarchyChain[2];     
  }
  return hierarchy;
};



const loadHierarchyFromDepartementId = async (departementId) => {
  try {
    console.log(" Chargement de la hiérarchie pour selectedDepartementId:", departementId);
    
    const response = await axios.get('http://127.0.0.1:8000/api/departements', { headers: getAuthHeaders() });
    const departements = response.data;

    const hierarchy = organizeHierarchyFromDepartement(departements, departementId);

    console.log(" Hiérarchie trouvée :", hierarchy);

    if (hierarchy) {
      if (hierarchy.departement) {
        setSelectedDepartement(hierarchy.departement);
        setServices(hierarchy.departement.children || []);
      }

      if (hierarchy.service) {
        setSelectedService(hierarchy.service);
        setUnites(hierarchy.service.children || []);
      }

      if (hierarchy.unite) {
        setSelectedUnite(hierarchy.unite);
      }

      await loadPostes(hierarchy);
    }

    return hierarchy;
  } catch (error) {
    console.error(' Erreur lors du chargement de la hiérarchie', error);
    return null;
  }
};

const loadPostes = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/postes`, { headers: getAuthHeaders() });
    console.log("Tous les postes chargés :", response.data);
    setPostes(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error('Erreur lors du chargement des postes', error);
    setPostes([]);
  }
};
useEffect(() => {
  loadPostes();
}, []);



const handleDepartementIdChange = async (newDepartementId) => {
  console.log("Changement de selectedDepartementId détecté:", newDepartementId);
  if (!newDepartementId) {
    console.log(" Réinitialisation des sélections car selectedDepartementId est vide");
    setSelectedDepartement(null);
    setSelectedService(null);
    setSelectedUnite(null);
    setSelectedPoste(null);
    setServices([]);
    setUnites([]);
    setPostes([]);
    return;
  }

  await loadHierarchyFromDepartementId(newDepartementId);
};

useEffect(() => {
  console.log(" useEffect déclenché - selectedDepartementId:", selectedDepartementId);
  if (selectedDepartementId) {
    handleDepartementIdChange(selectedDepartementId);
  }
}, [selectedDepartementId]);



const loadAllDepartements = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/departements', { headers: getAuthHeaders() });
    setDepartements(response.data);
  } catch (error) {
    console.error('Erreur lors du chargement des départements', error);
    setDepartements([]);
  }
};

useEffect(() => {
  loadAllDepartements();
}, []);

const displaySelectedHierarchy = () => {
  const hierarchy = [];
  
  if (selectedDepartement) {
    hierarchy.push(`Département: ${selectedDepartement.nom}`);
  }
  if (selectedService) {
    hierarchy.push(`Service: ${selectedService.nom}`);
  }
  if (selectedUnite) {
    hierarchy.push(`Unité: ${selectedUnite.nom}`);
  }
  if (selectedPoste) {
    hierarchy.push(`Poste: ${selectedPoste.nom}`);
  }
  
  return hierarchy.join(' → ');
};

// Fonction pour gérer la sélection manuelle du poste (si besoin)
const handlePosteChange = (selectedOption) => {
  setSelectedPoste(selectedOption);
  
  if (selectedOption && formData) {
    setFormData({
      ...formData,
      poste: {
        ...formData.poste,
        id: selectedOption.id
      }
    });
  }
};



const handleAddPoste = async () => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/postes", {
      nom: newPosteName,
      unite_id: selectedUnite.id
    }, { headers: getAuthHeaders() });

    setPostes(prev => [...prev, response.data]);
    setNewPosteName('');
    setShowPosteModal(false);
    showSuccessNotification("Poste ajouté avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'ajout du poste", error);
    showErrorNotification("Erreur lors de l'ajout du poste.");
  }
};



const handleAddCategorie = () => {
  const newId = categories.length + 1;
  const cat = { id: newId, nom: newCategorie };
  setCategories([...categories, cat]);
  setNewCategorie('');
  setShowCategorieModal(false);
};



// Fonction helper pour obtenir tous les départements aplatis (pour les selects)
const getFlattenedDepartements = (departements) => {
  let flattened = [];
  
  const flatten = (depts, level = 0) => {
    depts.forEach(dept => {
      flattened.push({
        ...dept,
        displayName: '  '.repeat(level) + dept.nom,
        level: level
      });
      
      if (dept.children && dept.children.length > 0) {
        flatten(dept.children, level + 1);
      }
    });
  };
  
  flatten(departements);
  return flattened;
};





// <--------------------planning------------------------->



const handleAddRow = () => {
  setAssignedCalendriers([...assignedCalendriers, {
    calendrier_id: '',
    date_debut: '',
    date_fin: '',
  }]);
};

const handleChangeCalendrier = (index, value) => {
  const updated = [...assignedCalendriers];
  updated[index].calendrier_id = value;
  setAssignedCalendriers(updated);
};

const handleChangeDate = (index, field, value) => {
  const updated = [...assignedCalendriers];
  updated[index][field] = value;
  setAssignedCalendriers(updated);
};

const handleSaveCalendrier = async (index) => {
  const item = assignedCalendriers[index];
  const response = await axios.post('/api/gp-calendriers-employes', {
    employe_id: employeId,
    calendrier_id: item.calendrier_id,
    date_debut: item.date_debut,
    date_fin: item.date_fin,
  }, { headers: getAuthHeaders() });

  fetchAssignedCalendriers();
};

const fetchCalendriers = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/calendrie', { headers: getAuthHeaders() });
    console.log('calendriers responssssssssssssssssse :', response);

    setCalendriers(response.data.calendrie); 
    console.log('calendriers récupérés :', response.data.calendrie);
  } catch (error) {
    console.error('Erreur lors de la récupération des calendriers', error);
  }
};

useEffect(() => {
  fetchCalendriers();
}, []);




  ////////////////////////////////////// SECTION SALAIRE   //////////////////////////////////////

  const validateSalaire = () => {
    const { salaire_base, salaire_moyen, salaire_reference_annuel } = formData.salaire;
  
    return (
      !isNaN(parseFloat(salaire_base)) &&
      !isNaN(parseFloat(salaire_moyen)) &&
      !isNaN(parseFloat(salaire_reference_annuel))
    );
  };

  
    ////////////////////////////////////// SECTION ADRESSE   //////////////////////////////////////


    // <-------------------Pays-------------------->
const handleAddPays = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/pays', {
      nom: newPays,
      code_pays: newCodePays
    }, { headers: getAuthHeaders() });

    setPays([...pays, response.data]);
    setNewPays('');
    setNewCodePays('');
    showSuccessNotification("Pays ajouté avec succès");
  } catch (error) {
    console.error('Erreur lors de l\'ajout du pays', error);
    showErrorNotification(error.response?.data?.message || 'Erreur lors de l\'ajout du pays');
  }
};

const handleUpdatePays = async () => {
  try {
    const response = await axios.put(`http://127.0.0.1:8000/api/pays/${editingPaysId}`, {
      nom: newPays,
      code_pays: newCodePays
    }, { headers: getAuthHeaders() });

    const updatedPays = pays.map(p =>
      p.id === editingPaysId ? { ...p, nom: newPays, code_pays: newCodePays } : p
    );
    setPays(updatedPays);

    showSuccessNotification("Pays mis à jour avec succès");
    setEditingPaysId(null);
    setNewPays('');
    setNewCodePays('');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du pays', error);
    showErrorNotification(error.response?.data?.message || 'Erreur lors de la mise à jour du pays');
  }
};

const handleDeletePays = async (paysId) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/pays/${paysId}`, { headers: getAuthHeaders() });

    const updatedPays = pays.filter(p => p.id !== paysId);
    setPays(updatedPays);

    showSuccessNotification("Pays supprimé avec succès");
  } catch (error) {
    console.error('Erreur lors de la suppression du pays', error);
    showErrorNotification(error.response?.data?.message || 'Erreur lors de la suppression du pays');
  }
};

      
    // <-------------------ville-------------------->

  
// Ajouter une ville
const handleAddVille = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/villes', {
      nom: newVille,
      pays_id: selectedPaysId
    }, { headers: getAuthHeaders() });

    setVilles([...villes, response.data]);
    setNewVille('');
    showSuccessNotification("Ville ajoutée avec succès");
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la ville', error);
    showErrorNotification(error.response?.data?.message || 'Erreur lors de l\'ajout de la ville');
  }
};

const handleUpdateVille = async () => {
  try {
    const response = await axios.put(`http://127.0.0.1:8000/api/villes/${editingVilleId}`, {
      nom: newVille,
      pays_id: selectedPaysId
    }, { headers: getAuthHeaders() });

    const updatedVilles = villes.map(v =>
      v.id === editingVilleId ? { ...v, nom: newVille, pays_id: selectedPaysId } : v
    );
    setVilles(updatedVilles);

    showSuccessNotification("Ville mise à jour avec succès");
    setEditingVilleId(null);
    setNewVille('');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la ville', error);
    showErrorNotification(error.response?.data?.message || 'Erreur lors de la mise à jour de la ville');
  }
};


const handleDeleteVille = async (villeId) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/villes/${villeId}`, { headers: getAuthHeaders() });

    const updatedVilles = villes.filter(v => v.id !== villeId);
    setVilles(updatedVilles);

    showSuccessNotification("Ville supprimée avec succès");
  } catch (error) {
    console.error('Erreur lors de la suppression de la ville', error);
    showErrorNotification(error.response?.data?.message || 'Erreur lors de la suppression de la ville');
  }
};
  


  const fetchPays = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/pays', { headers: getAuthHeaders() });
      setPays(response.data);
      console.log("payyyyyyyys",response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des pays', error);
      showErrorNotification('Erreur lors de la récupération des pays');
    }
  };

  



  // Ajouter une commune
const handleAddCommune = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/communes', {
      nom: newCommune,
      ville_id: selectedVilleId
    }, { headers: getAuthHeaders() });

    setCommunes([...communes, response.data]);
    setNewCommune('');
    showSuccessNotification("Commune ajoutée avec succès");
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la commune', error);
    showErrorNotification(error.response?.data?.message || 'Erreur lors de l\'ajout de la commune');
  }
};


const handleUpdateCommune = async () => {
  try {
    const response = await axios.put(`http://127.0.0.1:8000/api/communes/${editingCommuneId}`, {
      nom: newCommune,
      ville_id: selectedVilleId
    }, { headers: getAuthHeaders() });

    const updatedCommunes = communes.map(c =>
      c.id === editingCommuneId ? { ...c, nom: newCommune, ville_id: selectedVilleId } : c
    );
    setCommunes(updatedCommunes);

    showSuccessNotification("Commune mise à jour avec succès");
    setEditingCommuneId(null);
    setNewCommune('');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commune', error);
    showErrorNotification(error.response?.data?.message || 'Erreur lors de la mise à jour de la commune');
  }
};

const handleDeleteCommune = async (communeId) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/communes/${communeId}`, { headers: getAuthHeaders() });

    const updatedCommunes = communes.filter(c => c.id !== communeId);
    setCommunes(updatedCommunes);

    showSuccessNotification("Commune supprimée avec succès");
  } catch (error) {
    console.error('Erreur lors de la suppression de la commune', error);
    showErrorNotification(error.response?.data?.message || 'Erreur lors de la suppression de la commune');
  }
};

  // const fetchVilles = async () => {
  //   try {
  //     const response = await axios.get('http://127.0.0.1:8000/api/villes');
  //     setVilles(response.data);
  //     console.log("villlllllllllllllllllllllles",response.data)
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération des villes', error);
  //     showErrorNotification('Erreur lors de la récupération des villes');
  //   }
  // };
  // const fetchCommunes = async () => {
  //   try {
  //     const response = await axios.get('http://127.0.0.1:8000/api/communes');
  //     setCommunes(response.data);
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération des communes', error);
  //     showErrorNotification('Erreur lors de la récupération des communes');
  //   }
  // };
  const fetchVillesByPays = async (paysId) => {
    if (!paysId) return;
    console.log('Pays ID:', paysId);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/villes?pays_id=${paysId}`, { headers: getAuthHeaders() });
      console.log("Villes récupérées:", response.data);
      setVilles(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des villes', error);
      showErrorNotification('Erreur lors de la récupération des villes');
    }
  };
    
  const fetchCommunesByVille = async (villeId) => {
    if (!villeId) return;
    console.log('villeId ID:', villeId);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/communes?ville_id=${villeId}`, { headers: getAuthHeaders() });
      setCommunes(response.data);
      setSelectedVilleId(villeId);
    } catch (error) {
      console.error('Erreur lors de la récupération des communes', error);
      showErrorNotification('Erreur lors de la récupération des communes');
    }
  };
  



  useEffect(() => {
    fetchPays();
  }, []);
      


  const sortedPays = [
    ...pays.filter((p) => p.nom === "Maroc"),
    ...pays.filter((p) => p.nom !== "Maroc"),
  ].map((p) => ({
    value: p.id,
    label: p.nom,
    code_pays: p.code_pays, // toujours ajouter
  }));
    
  // const handlePaysChange = (selectedOption) => {
  //   setSelectedPays(selectedOption);
    
  //   setFormData((prev) => ({
  //     ...prev,
  //     adresse: {
  //       ...prev.adresse,
  //       pays: selectedOption.value
  //     }
  //   }));
  // };
  
    
  const communesOptions = communes.map((commune) => ({
    value: commune.nom,
    label: commune.nom
  }));
  
  const villesOptions = villes.map((ville) => ({
    value: ville.id,
    label: ville.nom
  }));
  


  const handleCommuneChange = (selectedOption) => {
    setSelectedCommune(selectedOption);
  
    setFormData((prev) => ({
      ...prev,
      adresse: {
        ...prev.adresse,
        commune: selectedOption.value
      }
    }));
  };
  
  // Quand on sélectionne une ville
  // const handleVilleChange = (selectedOption) => {
  //   setSelectedVille(selectedOption);
  
  //   setFormData((prev) => ({
  //     ...prev,
  //     adresse: {
  //       ...prev.adresse,
  //       ville: selectedOption.value
  //     }
  //   }));
  // };
  


  const handlePaysChange = (selectedOption) => {
    console.log("Selected Option:", selectedOption);
  
    const paysId = selectedOption ? selectedOption.value : null;
    setSelectedPays(selectedOption);
    setSelectedPaysId(paysId);
  
    setFormData((prevData) => ({
      ...prevData,
      adresse: {
        ...prevData.adresse,
        pays: selectedOption ? selectedOption.label : '',
        codePays: selectedOption ? selectedOption.code_pays : '',
      }
    }));
  
    if (paysId) {
      fetchVillesByPays(paysId);
    }
  };
      



  const handleVilleChange = (selectedOption) => {
    setSelectedVille(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      adresse: {
        ...prevData.adresse,
        ville: selectedOption ? selectedOption.label : '',
      }
    }));
  
    if (selectedOption && selectedOption.value) {
      fetchCommunesByVille(selectedOption.value);
    }
  };
      
    ////////////////////////////////////// SECTION Compte   //////////////////////////////////////


  const handleAddAgence = async () => {
    try {
      const { data } = await axios.post('http://127.0.0.1:8000/api/agences', {
        nom: newAgence,
        banque_id: selectedBanqueId
      }, { headers: getAuthHeaders() });
      setAgences([...agences, data]);
      setNewAgence('');
      showSuccessNotification('Agence ajoutée');
    } catch (e) {
      showErrorNotification(e.response?.data?.message || 'Erreur ajout agence');
    }
  };
  
  const handleUpdateAgence = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/agences/${editingAgenceId}`, {
        nom: newAgence,
        banque_id: selectedBanqueId
      }, { headers: getAuthHeaders() });
      setAgences(agences.map(a =>
        a.id === editingAgenceId ? { ...a, nom: newAgence, banque_id: selectedBanqueId } : a
      ));
      setEditingAgenceId(null);
      setNewAgence('');
      showSuccessNotification('Agence mise à jour');
    } catch (e) {
      showErrorNotification(e.response?.data?.message || 'Erreur maj agence');
    }
  };
  
  const handleDeleteAgence = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/agences/${id}`, { headers: getAuthHeaders() });
      setAgences(agences.filter(a => a.id !== id));
      showSuccessNotification('Agence supprimée');
    } catch (e) {
      showErrorNotification(e.response?.data?.message || 'Erreur suppression agence');
    }
  };

  const agencesOptions = useMemo(() => {
    if (!Array.isArray(agences)) return [];
    return agences
      .filter(a => !selectedBanque || a.banque_id === selectedBanque.id)
      .map(a => ({ value: a.id, label: a.nom, id: a.id }));
  }, [agences, selectedBanque]);
  
  
  const fetchBanques = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/banque', { headers: getAuthHeaders() });
    console.log("bannnnnnnnnnnnnnnnnnnnnnque:", res.data);
    setBanques(Array.isArray(res.data) ? res.data : res.data.data);

  };
  
  



  
  const fetchAgences = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/agences', { headers: getAuthHeaders() });
    console.log(res.data);
    setAgences(Array.isArray(res.data) ? res.data : res.data.data);
  };
  
    
  useEffect(() => { fetchBanques(); fetchAgences(); }, []);
  
  



    const handleAddBanque = async () => {
      if (!newBanque.trim()) {
        alert("Le nom de la banque est obligatoire !");
        return;
      }
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/banque', { nom: newBanque.trim() }, { headers: getAuthHeaders() });
        setBanques(prev => [...prev, res.data]);
        setNewBanque('');
        setShowBanqueModal(false);
      } catch (error) {
        console.error('Erreur ajout banque:', error.response?.data || error.message);
      }
    };
    
    
    const handleUpdateBanque = async () => {
      try {
        await axios.put(`http://127.0.0.1:8000/api/banque/${editingBanqueId}`, { nom: newBanque }, { headers: getAuthHeaders() });
        setBanques(banques.map(b =>
          b.id === editingBanqueId ? { ...b, nom: newBanque } : b
        ));
        setEditingBanqueId(null);
        setNewBanque('');
        showSuccessNotification('Banque mise à jour');
      } catch (e) {
        showErrorNotification(e.response?.data?.message || 'Erreur maj banque');
      }
    };
    
    const handleDeleteBanque = async (id) => {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/banque/${id}`, { headers: getAuthHeaders() });
        setBanques(banques.filter(b => b.id !== id));
        showSuccessNotification('Banque supprimée');
      } catch (e) {
        showErrorNotification(e.response?.data?.message || 'Erreur suppression banque');
      }
    };
    
    const sortedBanques = useMemo(() => {
      if (!Array.isArray(banques)) return [];
      return banques
        .slice()
        .sort((a, b) => a.nom.localeCompare(b.nom))
        .map(b => ({ id: b.id, label: b.nom }));
    }, [banques]);
      


    
// --- Banque -------------------------------------------------
const handleBanqueChange = (option) => {
  setSelectedBanque(option);

  setSelectedAgence(null);

  setFormData((prev) => ({
    ...prev,
    compteBancaire: {
      ...prev.compteBancaire,
      banque_id: option ? option.id : null,
      agence_id: null,
    },
  }));
};

const handleAgenceChange = (option) => {
  setSelectedAgence(option);

  setFormData((prev) => ({
    ...prev,
    compteBancaire: {
      ...prev.compteBancaire,
      agence_id: option ? option.id : null,
    },
  }));
};
  


const toggleSize = () => {
  console.log("Button clicked!");
  setIsExpanded((prev) => !prev);
};



  return (
    <>
      <style>
        {`
          ${loaderCSS}

          .employee-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 1rem; 
          }
          
          .employee-card {
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            background-color: white;
          }
          
          .employee-header {
            background-color: #f8f9fa;
            padding: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .employee-header h3 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
            color: #1a202c;
          }
          
          .employee-body {
            padding: 1.5rem;
            max-height: calc(100vh - 200px);
            overflow-y: auto;
          }
          
          .employee-footer {
            padding: 1rem 1.5rem;
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
          }
          
          .dropzone {
            border: 2px dashed #e2e8f0;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: border-color 0.3s;
            background-color: #f8fafc;
          }
          
          .dropzone:hover {
            border-color: #3b82f6;
          }
          
          .dropzone-text {
            color: #64748b;
            padding: 2rem;
            text-align: center;
          }
          
          .image-preview {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .image-preview img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          
          .form-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #4b5563;
            margin-bottom: 0.5rem;
          }

          .form-tag{
          color: #4b5563;
            margin-bottom: 0.1rem;
            margin-right: 0.5rem ;
          }
          
          .form-control {
            border-radius: 0.375rem;
            border: 1px solid #d1d5db;
            padding: 0.5rem 0.75rem;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          }
          
          .form-control:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
            outline: none;
          }
          
          .btn-primary {
            background-color: #00afaa;
            border-color: #00afaa;
            color: white;
            border-radius: 0.375rem;
            font-weight: 500;
            padding: 0.5rem 1rem;
            transition: background-color 0.15s ease-in-out;
          }
          
          .btn-primary:hover:not(:disabled) {
            background-color: #009691;
            border-color: #009691;
          }
          
          .btn-secondary {
            background-color: #6b7280;
            border-color: #6b7280;
            color: white;
            border-radius: 0.375rem;
            font-weight: 500;
            padding: 0.5rem 1rem;
            transition: background-color 0.15s ease-in-out;
          }
          
          .btn-secondary:hover {
            background-color: #4b5563;
            border-color: #4b5563;
          }
          
          .action-button {
            position: relative;
            padding: 0.5rem 1.5rem;
            border-radius: 9999px;
            font-weight: 500;
            transition: all 0.2s;
            min-width: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }
          
          .save-button {
            background-color: #00afaa !important;
            color: rgb(255, 255, 255) !important;
            z-index: 1 !important;
            padding-left: 60px !important;
            padding-right: 60px !important;
            padding-top: 15px !important;  
            padding-bottom: 15px !important;     
            border:none;
          }
          
          .save-button:hover {
            background-color: #00afaa;
          }
          
          .cancel-button {
            background-color: gray !important;
            color: rgb(255, 255, 255) !important;
            z-index: 1 !important;
            padding-left: 60px !important;
            padding-right: 60px !important;
            padding-top: 15px !important;  
            padding-bottom: 15px !important;     
            border: none;
          }
          
          .cancel-button:hover {
            background-color: #4b5563;
          }
          
          .nav-tabs .nav-link {
            color: #4b5563;
            border: none;
            padding: 0.75rem 1rem;
            font-weight: 500;
          }
          
          .nav-tabs .nav-link.active {
            color: #3a8a90;
            border-bottom: 2px solid #3a8a90;
            background-color: transparent;
          }
          
          .form-group {
            margin-bottom: 1rem;
          }
          
          .modal-content {
            border-radius: 0.5rem;
            overflow: hidden;
          }
          
          .modal-header {
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem 1.5rem;
          }
          
          .modal-body {
            padding: 1.5rem;
          }
          
          .table th {
            font-weight: 600;
            color: #4b5563;
          }
          
          .table td, .table th {
            padding: 0.75rem 1rem;
            vertical-align: middle;
          }
          
          .action-icon {
            cursor: pointer;
            transition: color 0.2s;
          }
          
          .edit-icon:hover {
            color: #3b82f6;
          }
          
          .delete-icon:hover {
            color: #ef4444;
          }

        .btn-primary-custom:hover:not(:disabled) {
            background-color: #009691;
            border-color: #009691;
        }

        .btn-secondary-custom:hover:not(:disabled) {
            background-color:rgb(3, 6, 6);
            border-color: #009691;
        }
        `}
      </style>



      <div className="addemp-overlay">
        <ToastContainer position="bottom-right" autoClose={3000} />
        
        <div className="addper">
          {/* <div className="employee-header">
            <h3>{selectedEmployer ? "Modifier employé" : "Ajouter employé"}</h3>
          </div> */}
          
          <div className="employee-body" style={{ margin: 0, padding: 0,  overflowX: "hidden"}}>
          <form
    onSubmit={handleSubmit}   
  


  >

  <div style={{ position: "relative"}}>
    {/* Bouton croix pour fermer le formulaire */}


    <button
      type="button"
      onClick={toggleEmpForm}
      style={{
        position: "fixed",
        top: "10%",
        right: "20px",
        background: "transparent",
        border: "none",
        fontSize: "2rem",
        color: "#4b5563",
        cursor: "pointer",
        zIndex: 9999,
          }}
      aria-label="Fermer le formulaire"
      title="Fermer"
    >
      &times;
    </button>

    <div className="row mb-4"    style={{
  position: "sticky",
  top: 0,
  backgroundColor: "white",
  zIndex: 100,
  flexShrink: 0,
  marginRight: "0.1%"
}}
 >
<div className="col-md-4" style={{  justifyItems: "center"  ,     marginTop:"2%"  ,}}>
        <div 
style={{ height: "150px", width: "100%", maxWidth: "150px" }}
{...getRootProps({ className: "dropzone" })}
        >
          <input {...getInputProps()} />
          {imagePreview ? (
            <div className="image-preview">
              <img
                src={imagePreview}
                alt="Preview"
                className="img-thumbnail"
                style={{ borderRadius: "0.5rem" }}
              />
            </div>
          ) : (
            <p className="dropzone-text">
              Appuyer pour sélectionner une image
            </p>
          )}
        </div>
      </div>

      <div className="col-md-4"  style={{ marginTop:"2%" }}   >
        <div className="form-group">
          <Tag className="form-tag" size={16} />
          <label className="form-label" htmlFor="matricule">Matricule</label>
          <input
            id="matricule"
            className="form-control"
            type="text"
            name="matricule"
            value={formData.matricule || ""}
            onChange={handleChange}
            placeholder="Saisissez le matricule"
          />
        </div>

        <div className="form-group">
          <BadgeCheck className="form-tag" size={16} />
          <label className="form-label" htmlFor="num_badge">Num Badge</label>
          <input
            id="num_badge"
            className="form-control"
            type="text"
            name="num_badge"
            value={formData.num_badge || ""}
            onChange={handleChange}
            placeholder="Saisissez le numéro de badge"
          />
        </div>
      </div>

      <div className="col-md-4"  style={{ marginTop:"2%" }}   >
        <div className="form-group">
          <User className="form-tag" size={16} />
          <label className="form-label" htmlFor="nom">Nom</label>
          <input
            id="nom"
            className="form-control"
            type="text"
            name="nom"
            value={formData.nom || ""}
            onChange={handleChange}
            placeholder="Saisissez le nom"
          />
        </div>

        <div className="form-group">
          <CreditCard className="form-tag" size={16} />
          <label className="form-label" htmlFor="prenom">Prénom</label>
          <input
            id="prenom"
            className="form-control"
            type="text"
            name="prenom"
            value={formData.prenom || ""}
            onChange={handleChange}
            placeholder="Saisissez le prénom"
          />
        </div>
      </div>


    </div>



    <Tabs
                id="employee-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-4"
                style={{
                  justifyContent:'center',
                  position: "sticky",
                  top: "180px",
                  backgroundColor: "white",
                  zIndex: 100,
                  flexShrink: 0,
                }}
              >



<Tab eventKey="home" title="État civil" className="tabiden">
  <div className="tab-content p-3">
    <div className="row">
      <div className="col-md-6">
        {/* Informations personnelles de base */}
        <div className="form-group">
          <Calendar className="form-tag" size={16} />
          <label className="form-label" htmlFor="date_naiss">Date de Naissance</label>
          <input
            id="date_naiss"
            className="form-control"
            type="date"
            name="date_naiss"
            value={formData.date_naiss || ""}
            onChange={handleChange}
            placeholder="Sélectionner une date"
          />
        </div>

        <div className="form-group">
          <MapPin className="form-tag" size={16} />
          <label className="form-label" htmlFor="lieu_naiss">Lieu de Naissance</label>
          <input
            id="lieu_naiss"
            className="form-control"
            type="text"
            name="lieu_naiss"
            value={formData.lieu_naiss || ""}
            onChange={handleChange}
            placeholder="Saisir le lieu de naissance"
          />
        </div>

        <div className="form-group">
          <Flag className="form-tag" size={16} />
          <label className="form-label" htmlFor="nationalite">Nationalité</label>
          <input
            id="nationalite"
            className="form-control"
            type="text"
            name="nationalite"
            value={formData.nationalite || ""}
            onChange={handleChange}
            placeholder="Saisir la nationalité"
          />
        </div>

        <div className="form-group">
          <Users className="form-tag" size={16} />
          <label className="form-label" htmlFor="sexe">Sexe</label>
          <select
            id="sexe"
            className="form-control"
            name="sexe"
            value={formData.sexe || ""}
            onChange={handleChange}
          >
            <option value="" disabled>Sélectionner...</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </div>
      </div>

      <div className="col-md-6">
        <div className="form-group">
          <Heart className="form-tag" size={16} />
          <label className="form-label" htmlFor="situation_fm">Situation Familiale</label>
          <select
            id="situation_fm"
            className="form-control"
            name="situation_fm"
            value={formData.situation_fm || ""}
            onChange={handleChange}
          >
            <option value="" disabled>Sélectionner...</option>
            <option value="single">Célibataire</option>
            <option value="married">Marié(e)</option>
            <option value="divorced">Divorcé(e)</option>
            <option value="widowed">Veuf/Veuve</option>
          </select>
        </div>

        <div className="form-group">
          <Baby className="form-tag" size={16} />
          <label className="form-label" htmlFor="nb_enfants">Nombre d'Enfants</label>
          <input
            id="nb_enfants"
            className="form-control"
            type="number"
            name="nb_enfants"
            value={formData.nb_enfants || ""}
            onChange={handleChange}
            placeholder="Nombre d'enfants"
          />
        </div>

        <div className="form-group">
          <CreditCard className="form-tag" size={16} />
          <label className="form-label" htmlFor="cin">CIN</label>
          <input
            id="cin"
            className="form-control"
            type="text"
            name="cin"
            value={formData.cin || ""}
            onChange={handleChange}
            placeholder="Numéro de CIN"
          />
        </div>

        <div className="form-group">
          <FileText className="form-tag" size={16} />
          <label className="form-label" htmlFor="carte_sejour">N° Carte Séjour</label>
          <input
            id="carte_sejour"
            className="form-control"
            type="text"
            name="carte_sejour"
            value={formData.carte_sejour || ""}
            onChange={handleChange}
            placeholder="Numéro de carte de séjour"
          />
        </div>
      </div>
        
      <div className="col-md-6">
        <div className="form-group">
          <Calendar className="form-tag" size={16} />
          <label className="form-label" htmlFor="date_expiration">Date d'Expiration</label>
          <input
            id="date_expiration"
            className="form-control"
            type="date"
            name="date_expiration"
            value={formData.date_expiration || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <Building className="form-tag" size={16} />
          <label className="form-label" htmlFor="delivree_par">Délivrée Par</label>
          <input
            id="delivree_par"
            className="form-control"
            type="text"
            name="delivree_par"
            value={formData.delivree_par || ""}
            onChange={handleChange}
            placeholder="Autorité émettrice"
          />
        </div>
      </div>

      <div className="col-md-6">
        <div className="form-group">
          <ShieldCheck className="form-tag" size={16} />
          <label className="form-label" htmlFor="cnss">N° Sécurité Social</label>
          <input
            id="cnss"
            className="form-control"
            type="number"
            name="cnss"
            value={formData.cnss || ""}
            onChange={handleChange}
            placeholder="Numéro de sécurité sociale"
          />
        </div>
      </div>
    </div>

    {/* Section Coordonnées */}
    <div className="row mt-4">
      <div className="col-12">
        <h5 className="form-section">Coordonnées</h5>
        <hr />
      </div>
      
      <div className="col-md-6">
        <div className="form-group">
          <Mail className="form-tag" size={16} />
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="form-control"
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="Adresse email"
          />
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="form-group">
          <Phone className="form-tag" size={16} />
          <label className="form-label" htmlFor="tel">Téléphone</label>
          <input
            id="tel"
            className="form-control"
            type="tel"
            name="tel"
            value={formData.tel || ""}
            onChange={handleChange}
            placeholder="Numéro de téléphone"
          />
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="form-group">
          <Printer className="form-tag" size={16} />
          <label className="form-label" htmlFor="fax">Fax</label>
          <input
            id="fax"
            className="form-control"
            type="tel"
            name="fax"
            value={formData.fax || ""}
            onChange={handleChange}
            placeholder="Numéro de fax"
          />
        </div>
      </div>
    </div>
  </div>
</Tab>



<Tab eventKey="adresse" title="Adresse">
  <div className="tab-content p-3">
    <div className="row">

      {/* Pays */}
      <div className="col-md-6 mb-3">
        <div className="form-group">
          <label className="form-label">Pays</label>
          <div className="d-flex align-items-center">
            <div style={{ flex: 1 }}>
              <Select
                options={sortedPays}
                value={selectedPays}
                onChange={handlePaysChange}
                placeholder="Sélectionner un pays"
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => e.value}
                isClearable
                noOptionsMessage={() => 'Aucun pays disponible'}
              />
            </div>
            <Button
              variant="outline-secondary"
              onClick={() => setShowPaysModal(true)}
              style={{ width: '38px', height: '38px', padding: '0', marginLeft: '8px', flexShrink: 0 }}
            >+</Button>
          </div>
        </div>
      </div>

      {/* Code Pays (readonly) */}
      <div className="col-md-6 mb-3">
        <div className="form-group">
          <label className="form-label">Code Pays</label>
          <input
            className="form-control"
            type="text"
            name="adresse.codePays"
            value={(typeof formData.adresse === 'object' ? (formData.adresse?.codePays || formData.adresse?.code_pays) : formData.code_pays) || ''}
            readOnly
            placeholder="Rempli automatiquement"
          />
        </div>
      </div>

      {/* Ville */}
      <div className="col-md-6 mb-3">
        <div className="form-group">
          <label className="form-label">Ville</label>
          <div className="d-flex align-items-center">
            <div style={{ flex: 1 }}>
              <Select
                options={villesOptions}
                value={selectedVille}
                onChange={handleVilleChange}
                placeholder={selectedPays ? 'Sélectionner une ville' : 'Choisir un pays d\'abord'}
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => e.value}
                isClearable
                isDisabled={!selectedPays}
                noOptionsMessage={() => 'Aucune ville disponible'}
              />
            </div>
            <Button
              variant="outline-secondary"
              onClick={() => setShowVilleModal(true)}
              style={{ width: '38px', height: '38px', padding: '0', marginLeft: '8px', flexShrink: 0 }}
              disabled={!selectedPays}
            >+</Button>
          </div>
        </div>
      </div>

      {/* Code Postal */}
      <div className="col-md-6 mb-3">
        <div className="form-group">
          <label className="form-label">Code Postal</label>
          <input
            className="form-control"
            type="text"
            name="adresse.codePostal"
            value={(typeof formData.adresse === 'object' ? (formData.adresse?.codePostal || formData.adresse?.code_postal) : formData.code_postal) || ''}
            onChange={handleChange}
            placeholder="Saisissez le code postal"
          />
        </div>
      </div>

      {/* Commune */}
      <div className="col-md-6 mb-3">
        <div className="form-group">
          <label className="form-label">Commune</label>
          <div className="d-flex align-items-center">
            <div style={{ flex: 1 }}>
              <Select
                options={communesOptions}
                value={selectedCommune}
                onChange={handleCommuneChange}
                placeholder={selectedVille ? 'Sélectionner une commune' : 'Choisir une ville d\'abord'}
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => e.value}
                isClearable
                isDisabled={!selectedVille}
                noOptionsMessage={() => 'Aucune commune disponible'}
              />
            </div>
            <Button
              variant="outline-secondary"
              onClick={() => setShowCommuneModal(true)}
              style={{ width: '38px', height: '38px', padding: '0', marginLeft: '8px', flexShrink: 0 }}
              disabled={!selectedVille}
            >+</Button>
          </div>
        </div>
      </div>

      {/* Adresse (rue) */}
      <div className="col-md-6 mb-3">
        <div className="form-group">
          <label className="form-label">Adresse</label>
          <input
            className="form-control"
            type="text"
            name="adresse.rue"
            value={(typeof formData.adresse === 'object' ? (formData.adresse?.rue || formData.adresse?.adress || formData.adresse?.adresse) : formData.adresse) || ''}
            onChange={handleChange}
            placeholder="Numéro et nom de rue"
          />
        </div>
      </div>

    </div>
  </div>
</Tab>

<Tab eventKey="profile" title="Infos Professionnels">
  <div className="tab-content p-3" style={{height:"520px"}}>
    <div className="row">
      <div className="col-md-6">
        <div className="form-group">
          <Briefcase className="form-tag" size={16} />
          <label className="form-label" htmlFor="fonction">Fonction</label>
          <input
            id="fonction"
            className="form-control"
            type="text"
            name="fonction"
            value={formData.fonction || ""}
            onChange={handleChange}
            placeholder="Saisissez la fonction"
          />
        </div>

        <div className="form-group">
          <BarChart2 className="form-tag" size={16} />
          <label className="form-label" htmlFor="niveau">Niveau</label>
          <input
            id="niveau"
            className="form-control"
            type="text"
            name="niveau"
            value={formData.niveau || ""}
            onChange={handleChange}
            placeholder="Saisissez le niveau"
          />
        </div>

        <div className="form-group">
          <ArrowUpCircle className="form-tag" size={16} />
          <label className="form-label" htmlFor="echelon">Échelon</label>
          <input
            id="echelon"
            className="form-control"
            type="text"
            name="echelon"
            value={formData.echelon || ""}
            onChange={handleChange}
            placeholder="Saisissez l'échelon"
          />
        </div>

        <div className="form-group">
          <Tag className="form-tag" size={16} />
          <label className="form-label" htmlFor="categorie">Catégorie</label>
          <input
            id="categorie"
            className="form-control"
            type="text"
            name="categorie"
            value={formData.categorie || ""}
            onChange={handleChange}
            placeholder="Saisissez la catégorie"
          />
        </div>

        <div className="form-group">
          <Percent className="form-tag" size={16} />
          <label className="form-label" htmlFor="coeficients">Coefficients</label>
          <input
            id="coeficients"
            className="form-control"
            type="text"
            name="coeficients"
            value={formData.coeficients || ""}
            onChange={handleChange}
            placeholder="Saisissez les coefficients"
          />
        </div>

        <div className="form-group">
          <FileText className="form-tag" size={16} />
          <label className="form-label" htmlFor="imputation">Imputation</label>
          <input
            id="imputation"
            className="form-control"
            type="text"
            name="imputation"
            value={formData.imputation || ""}
            onChange={handleChange}
            placeholder="Saisissez l'imputation"
          />
        </div>
      </div>

      <div className="col-md-6">
        <div className="form-group">
          <LogIn className="form-tag" size={16} />
          <label className="form-label" htmlFor="date_entree">Date entrée</label>
          <input
            id="date_entree"
            className="form-control"
            type="date"
            name="date_entree"
            value={formData.date_entree || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <UserPlus className="form-tag" size={16} />
          <label className="form-label" htmlFor="date_embauche">Date d'Embauche</label>
          <input
            id="date_embauche"
            className="form-control"
            type="date"
            name="date_embauche"
            value={formData.date_embauche || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <LogOut className="form-tag" size={16} />
          <label className="form-label" htmlFor="date_sortie">Date sortie</label>
          <input
            id="date_sortie"
            className="form-control"
            type="date"
            name="date_sortie"
            value={formData.date_sortie || ""}
            onChange={handleChange}
          />
        </div>


        <div className="form-group">
          <TrendingUp className="form-tag" size={16} />
          <label className="form-label" htmlFor="centreCout">Centre de cout</label>
          <input
            id="centreCout"
            className="form-control"
            type="text"
            name="centreCout"
            value={formData.centreCout || ""}
            onChange={handleChange}
            placeholder="Saisissez le centre de coût"
          />
        </div>

        <div className="form-group">
          <MessageSquare className="form-tag" size={16} />
          <label className="form-label" htmlFor="remarque">Remarque</label>
          <textarea
            id="remarque"
            className="form-control"
            name="remarque"
            value={formData.remarque || ""}
            onChange={handleChange}
            placeholder="Saisissez vos remarques"
            style={{ resize: "none", height: "100px" }}
          />
        </div>
      </div>
    </div>
  </div>
</Tab>


<Tab eventKey="salaire" title="Salaire">
  <div className="tab-content p-3">
    <div className="row">
      
      <div className="col-md-4">
        <div className="form-group mb-3">
          <label className="form-label ">Salaire de base</label>
          <div className="input-group">
            <input
              className="form-control"
              type="number"
              step="0.01"
              name="salaire.salaire_base"
              value={formData.salaire_base}
              onChange={handleChange}
              placeholder="0.00"
            />
        <span className="input-group-text">
        </span>
          </div>
        </div>
      </div>
      
      <div className="col-md-4">
        <div className="form-group mb-3">
          <label className="form-label ">Salaire moyen</label>
          <div className="input-group">
            <input
              className="form-control"
              type="number"
              step="0.01"
              name="salaire.salaire_moyen"
              value={formData.salaire_moyen}
              onChange={handleChange}
              placeholder="0.00"
            />
            <span className="input-group-text">€</span>
          </div>
        </div>
      </div>

      
      <div className="col-md-4">
        <div className="form-group mb-3">
          <label className="form-label ">Salaire de référence annuel</label>
          <div className="input-group">
            <input
              className="form-control"
              type="number"
              step="0.01"
              name="salaire.salaire_reference_annuel"
              value={formData.salaire_reference_annuel}
              onChange={handleChange}
              placeholder="0.00"
            />
            <span className="input-group-text">€</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</Tab>               


<Tab eventKey="compte-bancaire" title="Compte bancaire">
                  <div className="tab-content p-3">
                    <div className="row">

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Banque</label>
                          <div className="d-flex align-items-center">
                            <div style={{ flex: 1 }}>
                              <Select
                                options={sortedBanques}
                                value={selectedBanque}
                                onChange={handleBanqueChange}
                                placeholder="Sélectionner une banque"
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.id}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderRadius: '0.375rem',
                                    borderColor: '#d1d5db',
                                    '&:hover': {
                                      borderColor: '#3b82f6'
                                    }
                                  })
                                }}
                              />
                            </div>
                            <Button
                              variant="outline-secondary"
                              onClick={() => setShowBanqueModal(true)}
                              className="ml-2"
                              style={{ 
                                width: "40px",
                                height: "38px",
                                padding: "0",
                                marginLeft: "8px",
                                borderRadius: "0.375rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Agence</label>
                          <div className="d-flex align-items-center">
                            <div style={{ flex: 1 }}>
                              <Select
                                options={agencesOptions}
                                value={selectedAgence}
                                onChange={handleAgenceChange}
                                placeholder="Sélectionner une agence"
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.id}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderRadius: '0.375rem',
                                    borderColor: '#d1d5db',
                                    '&:hover': {
                                      borderColor: '#3b82f6'
                                    }
                                  })
                                }}
                              />
                            </div>
                            <Button
                              variant="outline-secondary"
                              onClick={() => setShowAgenceModal(true)}
                              className="ml-2"
                              style={{ 
                                width: "40px",
                                height: "38px",
                                padding: "0",
                                marginLeft: "8px",
                                borderRadius: "0.375rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">RIB</label>
                          <input
                            className="form-control"
                            type="text"
                            name="compteBancaire.rib"
                            value={formData.compteBancaire.rib}
                            onChange={handleChange}
                            placeholder="Saisissez le RIB"
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">IBAN</label>
                          <input
                            className="form-control"
                            type="text"
                            name="compteBancaire.iban"
                            value={formData.compteBancaire.iban}
                            onChange={handleChange}
                            placeholder="Saisissez l'IBAN"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </Tab>












              </Tabs>








    {error && (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )}

    {key !== "contrat" && (

<div className="form-actions mt-4 d-flex justify-content-center gap-3">
  <Button
    type="submit"
    disabled={loading}
    className="btn-primary-custom"
    style={{
      padding:'0.5rem 3rem'
    }}
  >
    {loading ? (
      <>
        <Loader2 className="h-5 w-5 animate-spin me-2" />
        Traitement...
      </>
    ) : selectedEmployer ? "Sauvegarder" : "Ajouter"}
  </Button>

  <Button
    type="button"
    onClick={toggleEmpForm}
    disabled={loading}
    className="btn-secondary-custom"
    style={{
      padding:'0.5rem 3rem'
    }}

  >
    Annuler
  </Button>
</div>



    )}
  </div>
</form>
          </div>
        </div>
      </div>

      {/* Modal pour Pays */}
      <Modal
        show={showPaysModal}
        onHide={() => {
          setShowPaysModal(false);
          setEditingPaysId(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Gestion des pays</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={newPays}
                onChange={(e) => setNewPays(e.target.value)}
                placeholder="Nom du pays"
              />
              <input
                type="text"
                className="form-control"
                value={newCodePays}
                onChange={(e) => setNewCodePays(e.target.value)}
                placeholder="Code pays (ex: MA, FR)"
                maxLength="2"
              />
              <button
                className="btn btn-primary"
                onClick={editingPaysId ? handleUpdatePays : handleAddPays}
                disabled={!newPays.trim() || !newCodePays.trim()}
              >
                {editingPaysId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nom du pays</th>
                  <th>Code</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pays.map((pays) => (
                  <tr key={pays.id}>
                    <td>{pays.nom}</td>
                    <td>{pays.code_pays}</td>
                    <td>
                      <Button
                        style={{ backgroundColor: 'transparent', border: 'none' }}
                        onClick={() => {
                          setEditingPaysId(pays.id);
                          setNewPays(pays.nom);
                          setNewCodePays(pays.code_pays);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          style={{ color: "#3b82f6", cursor: "pointer" }}
                        />
                      </Button>
                      <Button
                        style={{ backgroundColor: 'transparent', border: 'none' }}
                        onClick={() => {
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer ce pays ?')) {
                            handleDeletePays(pays.id);
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "#ef4444", cursor: "pointer" }}
                        />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal pour Ville */}
      <Modal
        show={showVilleModal}
        onHide={() => {
          setShowVilleModal(false);
          setEditingVilleId(null);
          setSelectedPaysId(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Gestion des villes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={newVille}
                onChange={(e) => setNewVille(e.target.value)}
                placeholder="Nom de la ville"
                disabled={!selectedPaysId}
              />
              <button
                className="btn btn-primary"
                onClick={editingVilleId ? handleUpdateVille : handleAddVille}
                disabled={!newVille.trim() || !selectedPaysId}
              >
                {editingVilleId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Ville</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {villes.map((ville) => (
                  <tr key={ville.id}>
                    <td>{ville.nom}</td>
                    <td>
                      <Button
                        style={{ backgroundColor: 'transparent', border: 'none' }}
                        onClick={() => {
                          setEditingVilleId(ville.id);
                          setNewVille(ville.nom);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          style={{ color: "#3b82f6", cursor: "pointer" }}
                        />
                      </Button>
                      <Button
                        style={{ backgroundColor: 'transparent', border: 'none' }}
                        onClick={() => {
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ville ?')) {
                            handleDeleteVille(ville.id);
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "#ef4444", cursor: "pointer" }}
                        />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal pour Commune */}
      <Modal
        show={showCommuneModal}
        onHide={() => {
          setShowCommuneModal(false);
          setEditingCommuneId(null);
          setSelectedVilleId(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Gestion des communes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={newCommune}
                onChange={(e) => setNewCommune(e.target.value)}
                placeholder="Nom de la commune"
                disabled={!selectedVilleId}
              />
              <button
                className="btn btn-primary"
                onClick={editingCommuneId ? handleUpdateCommune : handleAddCommune}
                disabled={!newCommune.trim() || !selectedVilleId}
              >
                {editingCommuneId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Commune</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {communes.map((commune) => (
                  <tr key={commune.id}>
                    <td>{commune.nom}</td>
                    <td>
                      <Button
                        style={{ backgroundColor: 'transparent', border: 'none' }}
                        onClick={() => {
                          setEditingCommuneId(commune.id);
                          setNewCommune(commune.nom);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          style={{ color: "#3b82f6", cursor: "pointer" }}
                        />
                      </Button>
                      <Button
                        style={{ backgroundColor: 'transparent', border: 'none' }}
                        onClick={() => {
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commune ?')) {
                            handleDeleteCommune(commune.id);
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "#ef4444", cursor: "pointer" }}
                        />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>

      {/* --------- Modal Banque --------- */}
<Modal
  show={showBanqueModal}
  onHide={() => {
    setShowBanqueModal(false);
    setEditingBanqueId(null);
  }}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Gestion des banques</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {/* Formulaire ajout / édition */}
    <div className="mb-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={newBanque}
          onChange={(e) => setNewBanque(e.target.value)}
          placeholder="Nom de la banque"
        />
        <button
          className="btn btn-primary"
          onClick={editingBanqueId ? handleUpdateBanque : handleAddBanque}
          disabled={!newBanque.trim()}
        >
          {editingBanqueId ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </div>

    {/* Tableau banques */}
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Banque</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(banques) &&
  banques.map((b) => (
            <tr key={b.id}>
              <td>{b.nom}</td>
              <td>
                <Button
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  onClick={() => {
                    setEditingBanqueId(b.id);
                    setNewBanque(b.nom);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} style={{ color: '#3b82f6' }} />
                </Button>
                <Button
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                  onClick={() => {
                    if (window.confirm('Supprimer cette banque ?')) {
                      handleDeleteBanque(b.id);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} style={{ color: '#ef4444' }} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </Modal.Body>
</Modal>


{/* --------- Modal Agence --------- */}
<Modal
  show={showAgenceModal}
  onHide={() => {
    setShowAgenceModal(false);
    setEditingAgenceId(null);
    setSelectedBanqueId(null);
  }}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Gestion des agences</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {/* Sélecteur de banque (pour créer / éditer l'agence) */}
    <div className="mb-2">
      <Select
        options={sortedBanques}
        value={sortedBanques.find(b => b.id === selectedBanqueId) || null}
        onChange={(opt) => setSelectedBanqueId(opt ? opt.id : null)}
        placeholder="Choisir une banque"
        getOptionLabel={(e) => e.label}
        getOptionValue={(e) => e.id}
      />
    </div>

    {/* Formulaire ajout / édition */}
    <div className="mb-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={newAgence}
          onChange={(e) => setNewAgence(e.target.value)}
          placeholder="Nom de l'agence"
          disabled={!selectedBanqueId}
        />
        <button
          className="btn btn-primary"
          onClick={editingAgenceId ? handleUpdateAgence : handleAddAgence}
          disabled={!newAgence.trim() || !selectedBanqueId}
        >
          {editingAgenceId ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </div>

    {/* Tableau agences filtrées par banque */}
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Agence</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {Array.isArray(agences) &&
    agences
      .filter(a => !selectedBanqueId || a.banque_id === selectedBanqueId)
      .map(a => (
        <tr key={a.id}>
          <td>{a.nom}</td>
          <td>
            {/* …boutons… */}
          </td>
        </tr>
      ))}
</tbody>
      </Table>
    </div>
  </Modal.Body>
</Modal>


  {/* Modal Poste */}
  <Modal show={showPosteModal} onHide={() => setShowPosteModal(false)} style={{ marginTop: '15%' }}>
    <Modal.Header closeButton>
      <div className="d-flex flex-column w-100">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Nom du poste"
          value={newPosteName}
          onChange={(e) => setNewPosteName(e.target.value)}
        />
        <div className="d-flex">
          <Button variant="secondary" onClick={() => setShowPosteModal(false)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleAddPoste}
            disabled={!newPosteName.trim()}
            className="ml-2"
          >
            Ajouter
          </Button>
        </div>
      </div>
    </Modal.Header>
  </Modal>

  {/* Modal Catégorie */}
  <Modal show={showCategorieModal} onHide={() => setShowCategorieModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Ajouter une Catégorie</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <input
        type="text"
        className="form-control mb-2"
        value={newCategorie}
        onChange={(e) => setNewCategorie(e.target.value)}
        placeholder="Nom de la catégorie"
      />
      <Button
        variant="primary"
        onClick={handleAddCategorie}
        disabled={!newCategorie.trim()}
      >
        Ajouter
      </Button>
    </Modal.Body>
  </Modal>


    </>
    
   
  );
}

export default AddEmp;
