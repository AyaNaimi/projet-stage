import { useEffect } from "react";
import ProduitList from "../Produit/ProduitList.jsx";
import { useHeader } from "../Acceuil/HeaderContext.jsx";

const ProduitPage = () => {
  const { setTitle, setSearchQuery, clearActions } = useHeader();

  useEffect(() => {
    setTitle("Gestion des produits");
    setSearchQuery("");

    return () => {
      clearActions();
      setTitle("");
      setSearchQuery("");
    };
  }, [setTitle, setSearchQuery, clearActions]);

  return <ProduitList />;
};

export default ProduitPage;
