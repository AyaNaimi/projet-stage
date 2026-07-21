import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faFilePdf, faFileExcel, faUserCircle, faMagnifyingGlass, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

const Header = ({ nom, handleSearch, printTable, exportToPDF, exportToExcel, client }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: '0%', left: '0%' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePrintClick = () => {
    if (client) {
      printTable(null);
    } else {
      printTable();
    }
    setMenuOpen(false);
  };

  const handlePdfClick = () => {
    exportToPDF();
    setMenuOpen(false);
  };

  const handleExcelClick = () => {
    exportToExcel();
    setMenuOpen(false);
  };

  const toggleMenuFromButton = (event) => {
    // Prevent outside-click handler from closing immediately
    event.preventDefault();
    event.stopPropagation();
    const btn = menuButtonRef.current || event.currentTarget;
    if (btn && btn.getBoundingClientRect) {
      const rect = btn.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const menuWidthPx = Math.min(320, Math.floor(viewportWidth * 0.9));
      const leftPx = Math.max(8, Math.min(rect.right - menuWidthPx, viewportWidth - menuWidthPx - 8));
      const topPx = rect.bottom + 6;
      const leftPercent = Math.max(0, Math.min(100, (leftPx / viewportWidth) * 100));
      const topPercent = Math.max(0, Math.min(100, (topPx / viewportHeight) * 100));
      setMenuPosition({ top: `${topPercent}%`, left: `${leftPercent}%` });
    }
    setMenuOpen((v) => !v);
  };
console.log('menuOpen',menuOpen);
  return (
    <div className="header-responsive">
      <div className="header-left">
        <h3 className="titreColore header-title">
          {nom}
        </h3>
      </div>
      <div className="header-right">
        <div className="search-container" role="search" ref={containerRef}>
          <span className="search-left-icon">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input
            type="search"
            className="search-input"
            placeholder="Recherche globale..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (handleSearch) handleSearch(e.target.value);
            }}
            aria-label="search"
          />
          <button
            type="button"
            className="search-menu-button"
            onMouseDown={toggleMenuFromButton}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            ref={menuButtonRef}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
          {menuOpen && (
            <div
              className="dropdown-menu2"
              role="menu"
              style={{ position: 'fixed', top: menuPosition.top, left: menuPosition.left }}
            >
              <button className="menu-item" onClick={handlePrintClick} role="menuitem">
                <FontAwesomeIcon icon={faPrint} className="menu-icon print" />
                Imprimer le document
              </button>
              <button className="menu-item" onClick={handlePdfClick} role="menuitem">
                <FontAwesomeIcon icon={faFilePdf} className="menu-icon pdf" />
                Générer fichier PDF
              </button>
              <button className="menu-item" onClick={handleExcelClick} role="menuitem">
                <FontAwesomeIcon icon={faFileExcel} className="menu-icon excel" />
                Exporter vers Excel
              </button>
            </div>
          )}
        </div>
        <button className="profile-button" aria-label="profil">
          <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
        </button>
      </div>
      <style>{`
       .header-responsive {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
         padding: 10px 36px;
        flex-wrap: wrap;
         background-color: #f9fafb;
         box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .header-left {
        flex: 1 1 200px;
        display: flex;
        align-items: center;
      }
      .header-title {
         margin-bottom: 0;
      }
      .header-right {
        flex: 2 1 350px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 16px;
        flex-wrap: wrap;
      }
       .search-container {
        min-width: 420px;
        position: relative;
        background: rgba(0,0,0,0.05);
        border-radius: 8px;
        display: flex;
        align-items: center;
        padding: 6px 40px 6px 36px;
        color: #2c3e50;
       }
       .search-container:hover { background: rgba(0,0,0,0.1); }
       .search-left-icon {
        position: absolute;
        left: 12px;
        color: #2c3e50;
        font-size: 0.95rem;
       }
       .search-input {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        color: #2c3e50;
        font-size: 0.95rem;
       }
       .search-menu-button {
        position: absolute;
        right: 8px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: #2c3e50;
        padding: 6px;
        border-radius: 6px;
       }
       .search-menu-button:hover { background: rgba(0,0,0,0.06); }
       .profile-button {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px;
       }
       .profile-icon { font-size: 2rem; color: #6b7280; }
       .dropdown-menu2 {
        top: 44px;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(81, 81, 81, 0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
        padding: 8px 0;
        z-index: 1000;
      }
      .menu-item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        background: transparent;
        border: none;
        text-align: left;
        cursor: pointer;
        color:rgb(42, 42, 42);
        font-size: 0.95rem;
      }
      .menu-item:hover { background: #f3f4f6; }
      .menu-icon { font-size: 1rem; }
      .menu-icon.print { color: grey; }
      .menu-icon.pdf { color: red; }
      .menu-icon.excel { color: green; }
      @media (max-width: 900px) {
        .header-responsive {
          flex-direction: column;
          align-items: stretch;
        }
        .header-left, .header-right {
          width: 100%;
          justify-content: flex-start;
        }
        .header-right {
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
        }
        .search-container {
          margin-right: 0;
        }
          .profile-button { align-self: flex-end; }
      }
    `}</style>
    </div>
  );
};

export default Header;
