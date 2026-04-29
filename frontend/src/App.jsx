import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Navigation from "./Acceuil/Navigation";
import { OpenProvider } from "./Acceuil/OpenProvider.jsx";
import { HeaderProvider } from "./Acceuil/HeaderContext";
import Login from "./Login/Login.jsx";
import EmpHistorique from "./Zakaria/EmpHistorique.jsx";
import DepartementManager from "./Zakaria/Employe/DepartementManager";
import ProduitPage from "./pages/p.jsx";

const App = () => {
  const location = useLocation();
  const showNavigation = location.pathname !== "/login";

  return (
    <AuthProvider>
      <OpenProvider>
        <HeaderProvider>
          {showNavigation && <Navigation />}
          <Routes>
            <Route path="/" element={<DepartementManager />} />
            <Route path="/login" element={<Login />} />
            <Route path="/employes" element={<DepartementManager />} />
            <Route path="/produits" element={<ProduitPage />} />
            <Route path="/emphistorique" element={<EmpHistorique />} />
          </Routes>
        </HeaderProvider>
      </OpenProvider>
    </AuthProvider>
  );
};

export default App;
