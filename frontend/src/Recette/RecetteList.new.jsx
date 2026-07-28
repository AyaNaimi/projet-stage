import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../axiosInstance";
import { Pencil, Trash2, X, SlidersHorizontal } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { useOpen } from "../Acceuil/OpenProvider";
import { useHeader } from "../Acceuil/HeaderContext";
import { faFilePdf, faFileExcel, faPrint } from "@fortawesome/free-solid-svg-icons";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { resolveImageUrl } from "../utils/imageUtils";
import { filterIngredientRowsBySearch } from "./recipeSearchUtils";

const normalizeBackendProducts = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map((item) => {
    const normalized = {
      ...item,
      id: item.id ?? item.product_id ?? item.matiere_premiere_id,
      is_recette: item.is_recette ?? item.isRecipe ?? item.recette ?? false,
      name: item.name ?? item.nom ?? item.designation ?? item.label,
      designation: item.designation ?? item.name ?? item.nom ?? item.label,
      image: item.image ?? item.logoP ?? item.logo ?? item.photo ?? item.logo_url ?? item.image_url ?? item.photo_url ?? "",
      logoP: item.logoP ?? item.image ?? item.logo ?? item.photo ?? item.logo_url ?? item.image_url ?? item.photo_url ?? "",
    };

    const rawLines = Array.isArray(item.lines)
      ? item.lines
      : Array.isArray(item.recettes)
        ? item.recettes
        : [];

    normalized.lines = rawLines.map((line) => ({
      ...line,
      id: line.id ?? line.line_id,
      matiere_premiere_id: line.matiere_premiere_id ?? line.productId ?? line.product_id,
      quantity: line.quantity ?? line.quantite ?? line.realQuantity ?? line.quantite_reelle ?? "",
      unit: line.unit ?? line.unite ?? "",
      wastePercentage: line.wastePercentage ?? line.perte ?? 0,
      realQuantity: line.realQuantity ?? line.quantite_reelle ?? line.quantity ?? line.quantite ?? "",
      product: line.product ?? line.matiere_premiere_nom ?? line.designation ?? line.name ?? "",
    }));

    return normalized;
  });
};

const parseNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const generateLocalLineId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const mapIngredientForBackend = (line) => ({
  matiere_premiere_id: line?.matiere_premiere_id ?? line?.productId ?? line?.product_id ?? null,
  matiere_premiere_nom: line?.matiere_premiere_nom ?? line?.product ?? line?.designation ?? line?.name ?? null,
  quantite: parseNumber(line?.quantite ?? line?.quantity ?? line?.realQuantity ?? line?.quantite_reelle),
  perte: parseNumber(line?.perte ?? line?.wastePercentage),
  unite: line?.unite ?? line?.unit ?? null,
  quantite_reelle: parseNumber(line?.quantite_reelle ?? line?.realQuantity ?? line?.quantity ?? line?.quantite),
});

const RecetteList = () => {
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [ingredientRows, setIngredientRows] = useState([]);
  const [pendingIngredients, setPendingIngredients] = useState([]);
  const [recipeForm, setRecipeForm] = useState({ name: "", imageFile: null, imagePreview: "" });
  const [ingredientForm, setIngredientForm] = useState({
    product: "",
    productId: "",
    quantity: "",
    unit: "",
    wastePercentage: "",
    realQuantity: "",
  });
  const [recipeError, setRecipeError] = useState("");
  const [ingredientError, setIngredientError] = useState("");
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [ingredientFormOpen, setIngredientFormOpen] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [editingIngredientId, setEditingIngredientId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteIngredientConfirm, setDeleteIngredientConfirm] = useState(null);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState([]);
  const [leftMargin, setLeftMargin] = useState(0);
  const [sideGap, setSideGap] = useState(0);
  const [panelHeight, setPanelHeight] = useState(360);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    select: true,
    product: true,
    quantity: true,
    unit: true,
    wastePercentage: true,
    actions: true,
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { open } = useOpen();
  const { setTitle, searchQuery } = useHeader();

  const leftPanelRef = useRef(null);
  const carouselRef = useRef(null);
  const recettesCardRef = useRef(null);
  const ingredientFormRef = useRef(null);
  const [recipeFormSize, setRecipeFormSize] = useState({ width: 420, height: 360 });

  useEffect(() => {
    setTitle("Gestion des RECETTES");
  }, [setTitle]);

  useEffect(() => {
    if (!isRecipeFormOpen || !recettesCardRef.current) return;
    const updateSize = () => {
      if (!recettesCardRef.current) return;
      const rect = recettesCardRef.current.getBoundingClientRect();
      setRecipeFormSize({ width: Math.max(280, Math.round(rect.width)), height: Math.max(200, Math.round(rect.height)) });
    };
    updateSize();
    const ro = new ResizeObserver(() => updateSize());
    ro.observe(recettesCardRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [isRecipeFormOpen, recipes]);

  const fetchRecipesAndProducts = async () => {
    try {
      const [recipesRes, productsRes, categoriesRes] = await Promise.all([
        axiosInstance.get("/api/produits?include_recettes=1"),
        axiosInstance.get("/api/produits"),
        axiosInstance.get("/api/categories"),
      ]);

      let list = recipesRes?.data?.produit || recipesRes?.data || [];
      if (!Array.isArray(list)) list = [];
      const normalizedRecipes = normalizeBackendProducts(list);
      const recipeList = normalizedRecipes.filter(
        (item) => item?.is_recette === 1 || item?.is_recette === "1" || item?.is_recette === true
      );
      setRecipes(recipeList);

      let productList = productsRes?.data?.produit || productsRes?.data || [];
      if (!Array.isArray(productList)) productList = [];
      const normalizedProducts = normalizeBackendProducts(productList);
      const productOnlyList = normalizedProducts.filter(
        (item) => item?.is_recette !== 1 && item?.is_recette !== "1" && item?.is_recette !== true
      );
      setProducts(productOnlyList);

      let categoryList = categoriesRes?.data?.categories || categoriesRes?.data || [];
      if (!Array.isArray(categoryList)) categoryList = [];
      setCategories(categoryList);
    } catch (e) {
      console.error("Failed to fetch recipes/products", e);
    }
  };

  useEffect(() => {
    fetchRecipesAndProducts();
  }, []);

  useEffect(() => {
    if (!selectedRecipeId) {
      setSelectedRecipe(null);
      setIngredientRows([]);
      return;
    }

    const selected = recipes.find((r) => String(r.id) === String(selectedRecipeId));
    setSelectedRecipe(selected || null);

    const recipeLines = Array.isArray(selected?.lines)
      ? selected.lines
      : Array.isArray(selected?.recettes)
        ? selected.recettes
        : [];

    setIngredientRows(recipeLines);
  }, [selectedRecipeId, recipes]);

  useEffect(() => {
    if (!leftPanelRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPanelHeight(entry.contentRect.height);
      }
    });
    observer.observe(leftPanelRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ingredientFormOpen || !ingredientFormRef.current) return;
    try {
      ingredientFormRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      ingredientFormRef.current.scrollTop = 0;
    } catch (e) {
      // ignore
    }
  }, [ingredientFormOpen]);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const baseGap = width >= 1200 ? 12 : 8;
      const drawerWidth = 220;
      const closedWidth = 72;
      setLeftMargin(open ? drawerWidth + baseGap : closedWidth + baseGap);
      setSideGap(baseGap);
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [open]);

  const handleSelectRecipe = (recipeId) => {
    setSelectedRecipeId(recipeId);
    setIngredientFormOpen(false);
    setIsRecipeFormOpen(false);
  };

  const openAddRecipeForm = () => {
    setIsRecipeFormOpen(true);
    setIngredientFormOpen(false);
    setEditingRecipeId(null);
    setRecipeForm({ name: "", imageFile: null, imagePreview: "" });
    setRecipeError("");
  };

  const openEditRecipeForm = (recipe, event) => {
    event?.stopPropagation?.();
    setSelectedRecipeId(recipe.id);
    setEditingRecipeId(recipe.id);
    const recipeImage = recipe.image || recipe.logoP || recipe.logo_url || recipe.image_url || recipe.photo_url || recipe.photo || "";
    setRecipeForm({
      name: recipe.name || "",
      imageFile: null,
      imagePreview: recipeImage ? resolveImageUrl(recipeImage) : "",
    });
    setIsRecipeFormOpen(true);
    setIngredientFormOpen(false);
    setRecipeError("");
  };

  const closeRecipeForm = () => {
    setIsRecipeFormOpen(false);
    setEditingRecipeId(null);
    setRecipeForm({ name: "", imageFile: null, imagePreview: "" });
    setRecipeError("");
  };

  const handleRecipeImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRecipeForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    setRecipeError("");

    if (!recipeForm.name.trim()) {
      setRecipeError("Le nom de la recette est obligatoire.");
      return;
    }

    const defaultCategoryId = categories?.[0]?.id ?? null;
    if (!defaultCategoryId) {
      setRecipeError("Aucune catégorie disponible pour créer la recette.");
      return;
    }

    const currentRecipe = editingRecipeId
      ? recipes.find((recipe) => String(recipe.id) === String(editingRecipeId))
      : null;

    try {
      const formData = new FormData();
      formData.append("designation", recipeForm.name.trim());
      formData.append("Code_produit", currentRecipe?.Code_produit || currentRecipe?.code_produit || `REC-${Date.now()}`);
      formData.append("categorie_id", currentRecipe?.categorie_id || defaultCategoryId);
      const typeQuantite = currentRecipe?.type_quantite === "K" ? "kg" : currentRecipe?.type_quantite || "kg";
      formData.append("type_quantite", typeQuantite);
      formData.append("is_recette", 1);
      if (recipeForm.imageFile) {
        formData.append("logoP", recipeForm.imageFile);
      }

      let response;
      if (editingRecipeId) {
        response = await axiosInstance.post(`/api/produits/${editingRecipeId}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axiosInstance.post("/api/produits", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (!editingRecipeId) {
        const createdRecipe = response?.data?.produit || response?.data || null;
        if (createdRecipe?.id) {
          setSelectedRecipeId(String(createdRecipe.id));
        }
      }

      await fetchRecipesAndProducts();
      closeRecipeForm();
    } catch (err) {
      console.error("Save recipe failed", err);
      setRecipeError("Échec de l'enregistrement de la recette.");
    }
  };

  const handleDeleteRecipeClick = (recipeId, event) => {
    event?.stopPropagation?.();
    setDeleteConfirmId(recipeId);
  };

  const cancelDeleteRecipe = () => setDeleteConfirmId(null);

  const confirmDeleteRecipe = async () => {
    if (deleteConfirmId === null) return;
    try {
      await axiosInstance.delete(`/api/recettes/${deleteConfirmId}`);
      await fetchRecipesAndProducts();
      setSelectedRecipeId(null);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Delete recipe failed", err);
    }
  };

  const openIngredientForm = () => {
    setIngredientFormOpen(true);
    setIsRecipeFormOpen(false);
    setEditingIngredientId(null);
    setIngredientForm({
      product: "",
      productId: "",
      quantity: "",
      unit: "",
      wastePercentage: "",
      realQuantity: "",
    });
    setIngredientError("");
    setPendingIngredients([]);
  };

  const openEditIngredientForm = (ingredient, ingredientKey, event) => {
    event?.stopPropagation?.();
    setIngredientFormOpen(true);
    setIsRecipeFormOpen(false);
    setEditingIngredientId(ingredientKey);
    setIngredientForm({
      product: ingredient.product || ingredient.designation || ingredient.matiere_premiere_nom || "",
      productId: ingredient.productId || ingredient.matiere_premiere_id || "",
      quantity: ingredient.quantity ?? ingredient.quantite ?? ingredient.realQuantity ?? ingredient.quantite_reelle ?? "",
      unit: ingredient.unit ?? ingredient.unite ?? "",
      wastePercentage: ingredient.wastePercentage ?? ingredient.perte ?? "",
      realQuantity: ingredient.realQuantity ?? ingredient.quantite_reelle ?? ingredient.quantity ?? ingredient.quantite ?? "",
    });
    setIngredientError("");
  };

  const closeIngredientForm = () => {
    setIngredientFormOpen(false);
    setEditingIngredientId(null);
    setIngredientForm({
      product: "",
      productId: "",
      quantity: "",
      unit: "",
      wastePercentage: "",
      realQuantity: "",
    });
    setIngredientError("");
    setPendingIngredients([]);
  };

  const resetIngredientForm = () => {
    setEditingIngredientId(null);
    setIngredientForm({
      product: "",
      productId: "",
      quantity: "",
      unit: "",
      wastePercentage: "",
      realQuantity: "",
    });
    setIngredientError("");
  };

  const buildIngredientLine = (form, existingId = null) => ({
    id: existingId || generateLocalLineId(),
    matiere_premiere_id: Number(form.productId) || null,
    matiere_premiere_nom: form.product,
    quantite: parseNumber(form.quantity),
    unite: form.unit || "",
    perte: parseNumber(form.wastePercentage),
    quantite_reelle: form.realQuantity !== "" ? parseNumber(form.realQuantity) : parseNumber(form.quantity),
    quantity: parseNumber(form.quantity),
    realQuantity: form.realQuantity !== "" ? parseNumber(form.realQuantity) : parseNumber(form.quantity),
    unit: form.unit || "",
    wastePercentage: parseNumber(form.wastePercentage),
    product: form.product,
    productId: form.productId || "",
  });

  const handleIngredientChange = (field, value) => {
    setIngredientForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleQueueIngredient = (e) => {
    if (e?.preventDefault) e.preventDefault();
    setIngredientError("");

    const newIngredient = buildIngredientLine(ingredientForm);
    if (!newIngredient.matiere_premiere_id) {
      setIngredientError("Veuillez sélectionner un produit.");
      return;
    }

    setPendingIngredients((prev) => [...prev, newIngredient]);
    resetIngredientForm();
  };

  const handleSaveIngredient = async (e) => {
    e.preventDefault();
    if (!selectedRecipeId) return;

    const currentIngredient = buildIngredientLine(ingredientForm, editingIngredientId ?? null);
    const hasCurrentIngredient = currentIngredient.matiere_premiere_id !== null;
    const hasPendingIngredients = pendingIngredients.length > 0;

    if (!hasCurrentIngredient && !hasPendingIngredients) {
      setIngredientError("Veuillez remplir un ingrédient avant d'enregistrer.");
      return;
    }

    const ingredientsToSave = [...pendingIngredients];
    if (hasCurrentIngredient) {
      ingredientsToSave.push(currentIngredient);
    }

    try {
      const currentRecipe = recipes.find((r) => String(r.id) === String(selectedRecipeId));
      const existingLines = Array.isArray(currentRecipe?.lines)
        ? currentRecipe.lines
        : Array.isArray(currentRecipe?.recettes)
          ? currentRecipe.recettes
          : [];
      const normalizedExisting = existingLines.map((line) => ({
        ...line,
        id: line.id ?? line.line_id ?? generateLocalLineId(),
        matiere_premiere_id: line.matiere_premiere_id ?? line.productId ?? line.product_id ?? null,
        quantity: line.quantity ?? line.quantite ?? line.realQuantity ?? line.quantite_reelle ?? "",
        realQuantity: line.realQuantity ?? line.quantite_reelle ?? line.quantity ?? line.quantite ?? "",
        unit: line.unit ?? line.unite ?? "",
        wastePercentage: line.wastePercentage ?? line.perte ?? 0,
      }));

      const isSameLineId = (lineId, targetId) => String(lineId) === String(targetId);
      let newLines = [...normalizedExisting];

      if (editingIngredientId !== null) {
        newLines = normalizedExisting.map((line) =>
          isSameLineId(line.id, editingIngredientId) ? currentIngredient : line
        );
        const existsInCurrent = normalizedExisting.some((line) => isSameLineId(line.id, editingIngredientId));
        if (!existsInCurrent) {
          newLines.push(currentIngredient);
        }
        if (pendingIngredients.length > 0) {
          newLines = [...newLines, ...pendingIngredients];
        }
      } else {
        newLines = [...normalizedExisting, ...ingredientsToSave];
      }

      const updatedRecipe = {
        ...currentRecipe,
        lines: newLines,
      };

      const res = await axiosInstance.put(`/api/recettes/${selectedRecipeId}`, {
        ...updatedRecipe,
        lines: newLines.map(mapIngredientForBackend),
      });

      try {
        const fresh = await axiosInstance.get(`/api/recettes/${selectedRecipeId}`);
        const serverData = fresh?.data?.produit || fresh?.data || null;
        if (serverData) {
          const normalizedServer = normalizeBackendProducts(Array.isArray(serverData) ? serverData : [serverData])[0];
          const serverLines = Array.isArray(normalizedServer?.lines) ? normalizedServer.lines : newLines;
          setRecipes((prev) => prev.map((r) => (String(r.id) === String(selectedRecipeId) ? { ...r, ...normalizedServer } : r)));
          setSelectedRecipe((prev) => ({ ...prev, ...normalizedServer }));
          setIngredientRows(serverLines);
        } else {
          const serverDataFromPut = res?.data?.produit || res?.data || null;
          if (serverDataFromPut) {
            const normalizedServer = normalizeBackendProducts(Array.isArray(serverDataFromPut) ? serverDataFromPut : [serverDataFromPut])[0];
            const serverLines = Array.isArray(normalizedServer?.lines) ? normalizedServer.lines : newLines;
            setRecipes((prev) => prev.map((r) => (String(r.id) === String(selectedRecipeId) ? { ...r, ...normalizedServer } : r)));
            setSelectedRecipe((prev) => ({ ...prev, ...normalizedServer }));
            setIngredientRows(serverLines);
          } else {
            setSelectedRecipe(updatedRecipe);
            setIngredientRows(newLines);
          }
        }
      } catch (getErr) {
        console.warn('GET after PUT failed, falling back to PUT response or optimistic update', getErr);
        const serverDataFromPut = res?.data?.produit || res?.data || null;
        if (serverDataFromPut) {
          const normalizedServer = normalizeBackendProducts(Array.isArray(serverDataFromPut) ? serverDataFromPut : [serverDataFromPut])[0];
          const serverLines = Array.isArray(normalizedServer?.lines) ? normalizedServer.lines : newLines;
          setRecipes((prev) => prev.map((r) => (String(r.id) === String(selectedRecipeId) ? { ...r, ...normalizedServer } : r)));
          setSelectedRecipe((prev) => ({ ...prev, ...normalizedServer }));
          setIngredientRows(serverLines);
        } else {
          setSelectedRecipe(updatedRecipe);
          setIngredientRows(newLines);
        }
      }

      setPendingIngredients([]);
      fetchRecipesAndProducts();
      closeIngredientForm();
    } catch (err) {
      console.error("Save ingredient failed", err);
      setIngredientError("Échec de l'ajout de l'ingrédient.");
    }
  };

  const handleSaveIngredientAndContinue = (e) => {
    handleQueueIngredient(e);
  };

  const handleDeleteIngredient = async (ingredientIdOrIdx) => {
    if (!selectedRecipeId) return;

    const currentRecipe = recipes.find((r) => String(r.id) === String(selectedRecipeId));
    const existingLines = Array.isArray(currentRecipe?.lines)
      ? currentRecipe.lines
      : Array.isArray(currentRecipe?.recettes)
        ? currentRecipe.recettes
        : [];

    const filteredLines = existingLines.filter((line, idx) => {
      const lineId = line.id ?? idx;
      return String(lineId) !== String(ingredientIdOrIdx);
    });

    try {
      await axiosInstance.put(`/api/recettes/${selectedRecipeId}`, {
        ...currentRecipe,
        lines: filteredLines.map(mapIngredientForBackend),
      });

      setIngredientRows(filteredLines);
      setSelectedIngredientIds((prev) => prev.filter((id) => String(id) !== String(ingredientIdOrIdx)));
      setDeleteIngredientConfirm(null);
      await fetchRecipesAndProducts();
    } catch (err) {
      console.error("Failed to delete ingredient", err);
    }
  };

  const handleToggleIngredientSelection = (ingredientIdOrIdx) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(ingredientIdOrIdx)
        ? prev.filter((item) => item !== ingredientIdOrIdx)
        : [...prev, ingredientIdOrIdx]
    );
  };

  const handleToggleSelectAllIngredients = () => {
    if (!ingredientRows.length) return;

    const ids = ingredientRows.map((ingredient, idx) => ingredient.id ?? idx);
    const allSelected = ids.every((id) => selectedIngredientIds.includes(id));

    if (allSelected) {
      setSelectedIngredientIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedIngredientIds((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  const handleDeleteSelectedIngredients = async () => {
    if (!selectedRecipeId || selectedIngredientIds.length === 0) return;

    const currentRecipe = recipes.find((r) => String(r.id) === String(selectedRecipeId));
    const existingLines = Array.isArray(currentRecipe?.lines)
      ? currentRecipe.lines
      : Array.isArray(currentRecipe?.recettes)
        ? currentRecipe.recettes
        : [];
    const filteredLines = existingLines.filter((line, idx) => !selectedIngredientIds.includes(line.id ?? idx));

    try {
      await axiosInstance.put(`/api/recettes/${selectedRecipeId}`, {
        ...currentRecipe,
        lines: filteredLines.map(mapIngredientForBackend),
      });

      setIngredientRows(filteredLines);
      setSelectedIngredientIds([]);
      await fetchRecipesAndProducts();
    } catch (e) {
      console.error("Failed to delete selected ingredients", e);
    }
  };

  const exportToPDF = () => {
    if (!selectedRecipe) return;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Recette : ${selectedRecipe.name}`, 14, 18);

    const rows = ingredientRows.map((ingredient, idx) => {
      const linkedProduct = products.find((p) => String(p.id) === String(ingredient.matiere_premiere_id || ingredient.productId));
      const productName = linkedProduct?.designation || linkedProduct?.name || ingredient.product || ingredient.designation || "N/A";

      return [
        idx + 1,
        productName,
        ingredient.quantity ?? ingredient.realQuantity ?? "N/A",
        ingredient.unit ?? ingredient.unite ?? "N/A",
        ingredient.wastePercentage ?? ingredient.perte ?? 0,
      ];
    });

    autoTable(doc, {
      startY: 28,
      head: [["#", "Produit lié", "Quantité", "Unité", "% Pertes"]],
      body: rows,
    });

    doc.save(`${selectedRecipe.name || "recette"}.pdf`);
  };

  const exportToExcel = () => {
    if (!selectedRecipe) return;
    const worksheet = XLSX.utils.json_to_sheet(
      ingredientRows.map((ingredient, idx) => {
        const linkedProduct = products.find((p) => String(p.id) === String(ingredient.matiere_premiere_id || ingredient.productId));
        const productName = linkedProduct?.designation || linkedProduct?.name || ingredient.product || ingredient.designation || "N/A";

        return {
          "#": idx + 1,
          "Produit lié": productName,
          Quantité: ingredient.quantity ?? ingredient.realQuantity ?? "N/A",
          Unité: ingredient.unit ?? ingredient.unite ?? "N/A",
          "% Pertes": ingredient.wastePercentage ?? ingredient.perte ?? 0,
        };
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recette");
    XLSX.writeFile(workbook, `${selectedRecipe.name || "recette"}.xlsx`);
  };

  const printIngredients = () => {
    if (!selectedRecipe) return;
    const printable = ingredientRows
      .map((ingredient, idx) => {
        const linkedProduct = products.find((p) => String(p.id) === String(ingredient.matiere_premiere_id || ingredient.productId));
        const productName = linkedProduct?.designation || linkedProduct?.name || ingredient.product || ingredient.designation || "N/A";
        return `<tr><td>${idx + 1}</td><td>${productName}</td><td>${ingredient.quantity ?? ingredient.realQuantity ?? "N/A"}</td><td>${ingredient.unit ?? ingredient.unite ?? "N/A"}</td><td>${ingredient.wastePercentage ?? ingredient.perte ?? 0}</td></tr>`;
      })
      .join("");

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Impression recette</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h2>Recette : ${selectedRecipe.name}</h2>
          <table>
            <thead><tr><th>#</th><th>Produit lié</th><th>Quantité</th><th>Unité</th><th>% Pertes</th></tr></thead>
            <tbody>${printable}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const recipeCardStyle = {
    minWidth: 100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    flexShrink: 0,
  };

  const selectedRecipeName = selectedRecipe ? selectedRecipe.name : "Aucune recette sélectionnée";
  const filteredIngredientRows = filterIngredientRowsBySearch(ingredientRows, searchQuery);
  const rowsToDisplay = filteredIngredientRows.slice(0, rowsPerPage);
  const visibleColumnCount = Object.values(columnVisibility).filter(Boolean).length || 1;
  const selectedIngredientProduct = products && products.length > 0
    ? products.find((p) => String(p.id) === String(ingredientForm.productId))
    : null;

  return (
    <>
      <div style={{ padding: "12px 10px", minHeight: "100vh", background: "#ffffff", boxSizing: "border-box" }}>
        <div style={{ marginLeft: leftMargin, marginRight: sideGap, width: `calc(100% - ${leftMargin + sideGap}px)`, display: "flex", flexDirection: "column", gap: 24, overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h1 style={{ margin: 0, fontSize: 30, color: "#0f172a" }}>Gestion des Recettes</h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isRecipeFormOpen ? "1fr 1fr" : "1fr", gap: 20, alignItems: "start" }}>
            <div ref={recettesCardRef} style={{ background: "#ffffff", borderRadius: 24, padding: 18, border: "1px solid #d1d5db", boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, color: "#111827" }}>Recettes</h2>
                  <p style={{ margin: "8px 0 0", color: "#6b7280", fontSize: 14 }}>Cliquez sur un cercle pour afficher la recette ou sur + pour en créer une nouvelle.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div ref={carouselRef} style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 6, flex: 1 }}>
                  <button
                    type="button"
                    onClick={openAddRecipeForm}
                    style={{
                      width: 78,
                      height: 78,
                      minWidth: 78,
                      borderRadius: "50%",
                      padding: 3,
                      background: "linear-gradient(135deg, #a855f7 0%, #ef4444 50%, #f97316 100%)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#0f766e",
                      fontSize: 28,
                      fontWeight: 700,
                    }}>
                      +
                    </div>
                  </button>
                  {recipes.map((recipe) => (
                    <div key={recipe.id} style={recipeCardStyle}>
                      <div
                        onClick={() => handleSelectRecipe(recipe.id)}
                        style={{
                          width: 78,
                          height: 78,
                          borderRadius: "50%",
                          padding: 3,
                          background: "linear-gradient(135deg, #a855f7 0%, #ef4444 50%, #f97316 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                          boxShadow: selectedRecipeId === recipe.id ? "0 0 0 2px rgba(99,102,241,0.35)" : "none",
                        }}
                      >
                        <div style={{
                          width: 72,
                          height: 72,
                          borderRadius: "50%",
                          overflow: "hidden",
                          background: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          {(recipe.image || recipe.logoP || recipe.logo_url || recipe.image_url || recipe.photo_url) ? (
                            <img src={resolveImageUrl(recipe.image || recipe.logoP || recipe.logo_url || recipe.image_url || recipe.photo_url || recipe.photo)} alt={recipe.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <span style={{ color: "#334155", fontSize: 20, fontWeight: 700 }}>{recipe.name?.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                      </div>

                      <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={recipe.name}>
                          {recipe.name}
                        </span>
                        <button
                          type="button"
                          onClick={(event) => openEditRecipeForm(recipe, event)}
                          style={{ border: "none", background: "transparent", color: "#0f766e", padding: 4, cursor: "pointer" }}
                          title="Modifier"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={(event) => handleDeleteRecipeClick(recipe.id, event)}
                          style={{ border: "none", background: "transparent", color: "#ef4444", padding: 4, cursor: "pointer" }}
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {isRecipeFormOpen && (
              <div style={{ width: "100%", height: recipeFormSize.height, minWidth: 280, minHeight: 200, boxSizing: "border-box", background: "#ffffff", borderRadius: 24, padding: 18, border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)", display: "flex", flexDirection: "column", gap: 12, overflow: "auto" }}>
                <form onSubmit={handleSaveRecipe} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0 }}>{editingRecipeId ? "Modifier la recette" : "Nouvelle recette"}</h3>
                    <button type="button" onClick={closeRecipeForm} style={{ border: "none", background: "transparent", cursor: "pointer" }}><X /></button>
                  </div>
                  <label style={{ fontSize: 13, color: "#374151" }}>Nom de la recette</label>
                  <input value={recipeForm.name} onChange={(e) => setRecipeForm((p) => ({ ...p, name: e.target.value }))} style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }} />

                  <label style={{ fontSize: 13, color: "#374151" }}>Image de la recette</label>
                  <input type="file" accept="image/*" onChange={handleRecipeImageChange} />
                  {recipeForm.imagePreview && (
                    <div style={{ width: 160, height: 160, borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                      <img src={recipeForm.imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}

                  {recipeError && <div style={{ color: "#b91c1c" }}>{recipeError}</div>}

                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button type="submit" style={{ flex: 1, background: "#0f766e", color: "white", border: "none", padding: "10px 12px", borderRadius: 8, cursor: "pointer" }}>{editingRecipeId ? "Enregistrer" : "Créer"}</button>
                    <button type="button" onClick={closeRecipeForm} style={{ flex: 1, background: "#f3f4f6", border: "1px solid #e5e7eb", color: "#374151", padding: "10px 12px", borderRadius: 8, cursor: "pointer" }}>Annuler</button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div ref={leftPanelRef} style={{ width: "100%", minWidth: 0 }}>
            <div style={{ background: "#ffffff", borderRadius: 24, padding: 18, border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)", minHeight: panelHeight || 360, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, color: "#111827" }}>Détail de la recette</h2>
                  <p style={{ margin: "8px 0 0", color: "#6b7280", fontSize: 14 }}>Recette sélectionnée : <strong>{selectedRecipeName}</strong></p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", position: "relative" }}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setColumnMenuOpen((prev) => !prev)}
                      title="Afficher/masquer les colonnes"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 42,
                        height: 42,
                        minWidth: 42,
                        padding: 0,
                        borderRadius: 14,
                        border: "2px solid #d1d5db",
                        background: "white",
                      }}
                    >
                      <SlidersHorizontal size={20} />
                    </Button>
                    {columnMenuOpen && (
                      <div style={{ position: "absolute", top: "110%", right: 0, zIndex: 20, minWidth: 220, background: "white", border: "1px solid #d1d5db", borderRadius: 14, boxShadow: "0 18px 40px rgba(15,23,42,0.12)", padding: 12 }}>
                        {[
                          { key: "select", label: "Sélection" },
                          { key: "product", label: "Produit lié" },
                          { key: "quantity", label: "Quantité" },
                          { key: "unit", label: "Unité" },
                          { key: "wastePercentage", label: "% Pertes" },
                          { key: "actions", label: "Actions" },
                        ].map((column) => (
                          <label key={column.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 14, color: "#334155" }}>
                            <input
                              type="checkbox"
                              checked={columnVisibility[column.key]}
                              onChange={() => setColumnVisibility((prev) => ({ ...prev, [column.key]: !prev[column.key] }))}
                            />
                            {column.label}
                          </label>
                        ))}
                      </div>
                    )}
                    <Button variant="outline-danger" onClick={exportToPDF} title="Exporter en PDF" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <FontAwesomeIcon icon={faFilePdf} /> PDF
                    </Button>
                    <Button variant="outline-success" onClick={exportToExcel} title="Exporter en Excel" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <FontAwesomeIcon icon={faFileExcel} /> Excel
                    </Button>
                    <Button variant="outline-primary" onClick={printIngredients} title="Imprimer" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <FontAwesomeIcon icon={faPrint} /> Print
                    </Button>
                  </div>
                  <Button variant="success" onClick={openIngredientForm} title="Ajouter ingrédient" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    Ajouter ingrédient
                  </Button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'flex-start', flexWrap: 'nowrap', width: '100%' }}>
                <div style={{ flex: ingredientFormOpen ? '1 1 50%' : '1 1 100%', minWidth: 0, overflowX: 'auto', overflowY: 'auto', maxHeight: 420 }}>
                  <table style={{ width: '100%', minWidth: 0, maxWidth: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                    <thead>
                      <tr style={{ background: "#fafafb", color: "#334155", textAlign: "left" }}>
                        {columnVisibility.select && (
                          <th style={{ padding: 14, borderBottom: "1px solid #d1d5db", width: 42 }}>
                            <input
                              type="checkbox"
                              checked={ingredientRows.length > 0 && ingredientRows.every((ingredient, idx) => selectedIngredientIds.includes(ingredient.id ?? idx))}
                              onChange={handleToggleSelectAllIngredients}
                            />
                          </th>
                        )}
                        {columnVisibility.product && <th style={{ padding: 14, borderBottom: "1px solid #d1d5db" }}>Produit lié</th>}
                        {columnVisibility.quantity && <th style={{ padding: 14, borderBottom: "1px solid #d1d5db" }}>Quantité</th>}
                        {columnVisibility.unit && <th style={{ padding: 14, borderBottom: "1px solid #d1d5db" }}>Unité</th>}
                        {columnVisibility.wastePercentage && <th style={{ padding: 14, borderBottom: "1px solid #d1d5db" }}>% Pertes</th>}
                        {columnVisibility.actions && <th style={{ padding: 14, borderBottom: "1px solid #d1d5db" }}>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIngredientRows.length > 0 ? (
                        rowsToDisplay.map((ingredient, idx) => {
                          const linkedProduct = products.find((p) => String(p.id) === String(ingredient.matiere_premiere_id || ingredient.productId));
                          const productName = linkedProduct?.designation || linkedProduct?.name || ingredient.product || ingredient.designation || "N/A";
                          const ingredientKey = ingredient.id ?? idx;
                          const ingredientRowKey = `ingredient-${ingredientKey}-${idx}`;
                          const isSelected = selectedIngredientIds.includes(ingredientKey);
                          const displayQuantity = ingredient.quantity ?? ingredient.realQuantity ?? ingredient.quantite ?? ingredient.quantite_reelle ?? "N/A";
                          const displayUnit = ingredient.unit ?? ingredient.unite ?? "N/A";
                          const displayWaste = ingredient.perte ?? ingredient.wastePercentage ?? 0;

                          return (
                            <tr key={ingredientRowKey} style={{ borderBottom: "1px solid #e5e7eb" }}>
                              {columnVisibility.select && (
                                <td style={{ padding: 14, color: "#111827" }}>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleIngredientSelection(ingredientKey)}
                                  />
                                </td>
                              )}
                              {columnVisibility.product && <td style={{ padding: 14, color: "#111827" }}>{productName}</td>}
                              {columnVisibility.quantity && <td style={{ padding: 14, color: "#111827" }}>{displayQuantity}</td>}
                              {columnVisibility.unit && <td style={{ padding: 14, color: "#111827" }}>{displayUnit}</td>}
                              {columnVisibility.wastePercentage && <td style={{ padding: 14, color: "#111827" }}>{displayWaste}</td>}
                              {columnVisibility.actions && (
                                <td style={{ padding: 14, color: "#111827", display: "flex", gap: 8, alignItems: "center" }}>
                                  <button
                                    type="button"
                                    onClick={(event) => openEditIngredientForm(ingredient, ingredientKey, event)}
                                    style={{ border: "none", background: "transparent", color: "#0f766e", padding: 4, cursor: "pointer" }}
                                    title="Modifier"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setDeleteIngredientConfirm(ingredientKey); }}
                                    style={{ border: "none", background: "transparent", color: "#ef4444", padding: 4, cursor: "pointer" }}
                                    title="Supprimer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={visibleColumnCount} style={{ padding: 18, textAlign: "center", color: "#64748b" }}>
                            {searchQuery ? "Aucune ligne ne correspond à cette recherche." : "Aucun ingrédient ajouté pour le moment."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <Button
                        variant="danger"
                        onClick={handleDeleteSelectedIngredients}
                        disabled={selectedIngredientIds.length === 0}
                        style={{
                          background: "#dc2626",
                          borderColor: "#dc2626",
                          color: "white",
                          padding: "10px 16px",
                          borderRadius: 10,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          cursor: selectedIngredientIds.length === 0 ? "not-allowed" : "pointer",
                          opacity: selectedIngredientIds.length === 0 ? 0.65 : 1,
                        }}
                      >
                        Supprimer la sélection
                      </Button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <label style={{ fontSize: 14, color: "#334155" }}>Lignes par page :</label>
                      <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        style={{ padding: 8, borderRadius: 8, border: "1px solid #d1d5db", background: "white", color: "#0f172a" }}
                      >
                        {[1, 5, 10, 15, 20, 25].map((count) => (
                          <option key={count} value={count}>{count}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {ingredientFormOpen && (
                  <div
                    ref={ingredientFormRef}
                    style={{
                      minWidth: 0,
                      width: '50%',
                      maxWidth: '50%',
                      flex: '1 1 50%',
                      boxSizing: 'border-box',
                      overflowY: 'auto',
                      maxHeight: 420,
                    }}
                  >
                    <style>{`.scrollable-form{max-height:56vh; overflow-y:auto; padding-right:8px; -webkit-overflow-scrolling:touch;} .scrollable-form::-webkit-scrollbar{width:10px} .scrollable-form::-webkit-scrollbar-track{background:transparent} .scrollable-form::-webkit-scrollbar-thumb{background:#6b7280;border-radius:10px} .scrollable-form{scrollbar-width:thin; scrollbar-color:#6b7280 transparent;}`}</style>
                    <div className="scrollable-form">
                      <form onSubmit={handleSaveIngredient} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h3 style={{ margin: 0 }}>{editingIngredientId !== null ? "Modifier l'ingrédient" : "Ajouter un ingrédient"}</h3>
                          <button type="button" onClick={closeIngredientForm} style={{ border: "none", background: "transparent", cursor: "pointer" }}><X /></button>
                        </div>

                        <label style={{ fontSize: 13, color: "#374151" }}>Produit lié</label>
                        {products && products.length > 0 ? (
                          <select
                            value={ingredientForm.productId || ""}
                            onChange={(e) => {
                              const pid = e.target.value;
                              const p = products.find((x) => String(x.id) === String(pid));
                              const name = p ? (p.designation || p.name || p.label || String(p.id)) : "";
                              setIngredientForm((prev) => ({ ...prev, product: name, productId: pid }));
                            }}
                            style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb", backgroundColor: "white" }}
                          >
                            <option value="">-- Sélectionner un produit --</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>{p.designation || p.name || p.label || `#${p.id}`}</option>
                            ))}
                          </select>
                        ) : (
                          <input value={ingredientForm.product} onChange={(e) => handleIngredientChange("product", e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                        )}

                        <label style={{ fontSize: 13, color: "#374151" }}>Quantité</label>
                        <input value={ingredientForm.quantity} onChange={(e) => handleIngredientChange("quantity", e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }} />

                        <label style={{ fontSize: 13, color: "#374151" }}>Unité</label>
                        <input value={ingredientForm.unit} onChange={(e) => handleIngredientChange("unit", e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }} />

                        <label style={{ fontSize: 13, color: "#374151" }}>% Pertes</label>
                        <input value={ingredientForm.wastePercentage} onChange={(e) => handleIngredientChange("wastePercentage", e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }} />

                        {ingredientError && <div style={{ color: "#b91c1c" }}>{ingredientError}</div>}

                        {pendingIngredients.length > 0 && (
                          <div style={{ border: '1px dashed #d1d5db', padding: 10, borderRadius: 8, background: '#fafafa' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Ingrédients en attente ({pendingIngredients.length})</div>
                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                              {pendingIngredients.map((it) => (
                                <li key={it.id} style={{ fontSize: 13 }}>{it.matiere_premiere_nom || it.product || '—'} — {it.quantity ?? it.quantite ?? it.quantite_reelle ?? ''} {it.unit ?? it.unite ?? ''}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <button type="submit" style={{ flex: 1, background: "#059669", color: "white", border: "none", padding: "10px 12px", borderRadius: 8, cursor: "pointer" }}>
                            {editingIngredientId !== null ? "Enregistrer" : "Ajouter et fermer"}
                          </button>
                          {editingIngredientId === null && (
                            <button type="button" onClick={handleSaveIngredientAndContinue} style={{ flex: 1, background: "#0f766e", color: "white", border: "none", padding: "10px 12px", borderRadius: 8, cursor: "pointer" }}>Ajouter un autre</button>
                          )}
                          <button type="button" onClick={closeIngredientForm} style={{ flex: 1, background: "#f3f4f6", border: "1px solid #e5e7eb", color: "#374151", padding: "10px 12px", borderRadius: 8, cursor: "pointer" }}>Annuler</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

        {deleteConfirmId !== null && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "white", borderRadius: 20, padding: 28, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(15,23,42,0.18)" }}>
              <h3 style={{ margin: 0, fontSize: 22, color: "#111827" }}>Confirmer la suppression</h3>
              <p style={{ margin: "16px 0 0", color: "#475569" }}>Voulez-vous vraiment supprimer cette recette ?</p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                <button type="button" onClick={cancelDeleteRecipe} style={{ border: "1px solid #d1d5db", background: "white", color: "#374151", borderRadius: 14, padding: "10px 18px", cursor: "pointer" }}>Non</button>
                <button type="button" onClick={confirmDeleteRecipe} style={{ border: "none", background: "#ef4444", color: "white", borderRadius: 14, padding: "10px 18px", cursor: "pointer" }}>Oui</button>
              </div>
            </div>
          </div>
        )}

        {deleteIngredientConfirm !== null && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ background: "white", borderRadius: 20, padding: 28, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(15,23,42,0.18)" }}>
              <h3 style={{ margin: 0, fontSize: 22, color: "#111827" }}>Confirmer la suppression</h3>
              <p style={{ margin: "16px 0 0", color: "#475569" }}>Voulez-vous vraiment supprimer cet ingrédient de la recette ?</p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setDeleteIngredientConfirm(null)} style={{ border: "1px solid #d1d5db", background: "white", color: "#374151", borderRadius: 14, padding: "10px 18px", cursor: "pointer" }}>Non</button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await handleDeleteIngredient(deleteIngredientConfirm);
                    } catch (e) {
                      console.error("Delete ingredient failed", e);
                    } finally {
                      setDeleteIngredientConfirm(null);
                    }
                  }}
                  style={{ border: "none", background: "#ef4444", color: "white", borderRadius: 14, padding: "10px 18px", cursor: "pointer" }}
                >
                  Oui
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default RecetteList;
