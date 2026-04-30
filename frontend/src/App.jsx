import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Dashboard from "./Acceuil/Dashboard.jsx";
import Navigation from "./Acceuil/Navigation";
import { OpenProvider } from "./Acceuil/OpenProvider.jsx";
import { HeaderProvider } from "./Acceuil/HeaderContext";
import Login from "./Login/Login.jsx";
import EmpHistorique from "./Zakaria/EmpHistorique.jsx";
import DepartementManager from "./Zakaria/Employe/DepartementManager";
import ProduitList from "./Produit/ProduitList.jsx";

const App = () => {
  const location = useLocation();
  const showNavigation = location.pathname !== "/login";

  return (
    <AuthProvider>
      <OpenProvider>
        <HeaderProvider>
          {showNavigation && <Navigation />}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/employes" element={<DepartementManager />} />
            <Route path="/produits" element={<ProduitList />} />
            <Route path="/emphistorique" element={<EmpHistorique />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            
          </Routes>
        </HeaderProvider>
      </OpenProvider>
    </AuthProvider>
  );
};

export default App;
