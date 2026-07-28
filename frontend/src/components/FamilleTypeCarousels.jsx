import React from 'react';
import { Carousel } from 'react-bootstrap';
import { FaArrowRight, FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const toFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE}/${clean}`;
};

const FamilleTypeCarousels = ({
  activeIndex,
  handleSelect,
  chunks,
  selectedCategory,
  handleCategoryFilterChange,
  activeIndexSuCat,
  handleSelectSousCat,
  chunksSucat,
  sousCatFiltre,
  handleSousCategoryFilterChange
}) => {
  const [currentViewedFamilleId, setCurrentViewedFamilleId] = React.useState(null);
  const [currentViewedTypeId, setCurrentViewedTypeId] = React.useState(null);
  const [isSmallViewport, setIsSmallViewport] = React.useState(false);
  const [showFamille, setShowFamille] = React.useState(true);
  const [showType, setShowType] = React.useState(true);

  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 576px)');
    const apply = () => setIsSmallViewport(mql.matches);
    apply();
    mql.addEventListener ? mql.addEventListener('change', apply) : mql.addListener(apply);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', apply) : mql.removeListener(apply);
    };
  }, []);

  const circleOuterSize = isSmallViewport ? 60 : 76;
  const circleInnerSize = isSmallViewport ? 56 : 72;
  const arrowButtonSize = isSmallViewport ? 32 : 40;
  const itemGap = isSmallViewport ? '12px' : '25px';

  const gradientRingStyle = {
    background: 'linear-gradient(45deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)'
  };

  const recordFamilleViewAndFilter = (id) => {
    const key = id === 'tout' ? '__all__' : id;
    setCurrentViewedFamilleId(key);
    handleCategoryFilterChange(id);
  };

  const recordTypeViewAndFilter = (id) => {
    const key = id === 'tout' ? '__all__' : id;
    setCurrentViewedTypeId(key);
    handleSousCategoryFilterChange(id);
  };

  return (
    <>
      <div className="carousel-container" style={{
        background: '#ffffff',
        borderRadius: '15px',
        padding: '10px',
        marginBottom: '0px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <div className="d-flex" style={{ gap: '30px', alignItems: 'stretch' }}>
          <div className="carousel-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="d-flex align-items justify-content" onClick={() => setShowFamille(v => !v)} style={{ marginBottom: '0px', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
              <h5 className="section-title" style={{
                color: '#2c3e50',
                fontWeight: '600',
                margin: 0,
                fontSize: '1.1rem'
              }}>
                Famille Produit
              </h5>
              <span style={{
                color: '#17a2b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 0
              }} title={showFamille ? 'Masquer' : 'Afficher'}>
                {showFamille ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
              </span>
            </div>
            {showFamille && (<div className="carousel-wrapper" style={{
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '0px',
              minHeight: '150px',
              height: '100%',
              flexGrow: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Carousel
                activeIndex={activeIndex}
                onSelect={handleSelect}
                interval={null}
                controls={true}
                nextIcon={
                  <div style={{
                    backgroundColor: '#17a2b8',
                    borderRadius: '50%',
                    width: `${arrowButtonSize}px`,
                    height: `${arrowButtonSize}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    <FaArrowRight color="white" size="16px" />
                  </div>
                }
                prevIcon={
                  <div style={{
                    backgroundColor: '#17a2b8',
                    borderRadius: '50%',
                    width: `${arrowButtonSize}px`,
                    height: `${arrowButtonSize}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    <FaArrowLeft color="white" size="16px" />
                  </div>
                }
              >
                {chunks.map((chunk, chunkIndex) => (
                  <Carousel.Item key={chunkIndex}>
                    <div className="d-flex justify-content-start align-items-center flex-wrap" style={{                      gap: itemGap,
                      padding: '10px 0',
                      marginLeft: '9%'
                    }}>
                      <div
                        className="category-item-wrapper"
                        onClick={() => recordFamilleViewAndFilter('tout')}
                        style={{
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          transform: selectedCategory === 'tout' ? 'scale(1.05)' : 'scale(1)',
                        }}
                      >
                        <div style={{
                          width: `${circleOuterSize}px`,
                          height: `${circleOuterSize}px`,
                          borderRadius: '50%',
                          padding: '3px',
                          margin: '0 auto 8px auto',
                          ...((currentViewedFamilleId === '__all__')
                            ? { background: 'transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '4px solid #dbdbdb', padding: '2px', width: `${circleInnerSize}px`, height: `${circleInnerSize}px` }
                            : { ...gradientRingStyle, padding: '2px', width: `${circleInnerSize}px`, height: `${circleInnerSize}px` })
                        }}>
                          <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            background: '#fff',
                            border: '3px solid #dbdbdb',
                            boxSizing: 'border-box'
                          }}>
                            <img
                              src={'/images/bayd.jpg'}
                              alt={'tout'}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                        </div>
                        <p style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          fontWeight: selectedCategory === 'tout' ? '600' : '500',
                          color: '#6c757d'
                        }}>
                          Tout
                        </p>
                      </div>
                      {chunk.slice(0, 6).map((category, index) => (
                        <div
                          key={index}
                          className="category-item-wrapper"
                          onClick={() => recordFamilleViewAndFilter(category.id)}
                          style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            transform: selectedCategory === category.id ? 'scale(1.05)' : 'scale(1)',
                          }}
                        >
                          <div style={{
                            width: `${circleOuterSize}px`,
                            height: `${circleOuterSize}px`,
                            borderRadius: '50%',
                            padding: '4px',
                            margin: '0 auto 10px auto',
                            ...((currentViewedFamilleId === category.id)
                              ? { background: 'transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '4px solid #dbdbdb', padding: '2px', width: `${circleInnerSize}px`, height: `${circleInnerSize}px` }
                              : { ...gradientRingStyle, padding: '2px', width: `${circleInnerSize}px`, height: `${circleInnerSize}px` })
                          }}>
                            <div style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              background: '#fff',
                              border: '3px solid #dbdbdb',
                              boxSizing: 'border-box'
                            }}>
                              <img
                                src={category.logoP ? toFullUrl(category.logoP) : '/images/bayd.jpg'}
                                alt={category.categorie}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          </div>
                          <p style={{
                            margin: 0,
                            fontSize: '0.85rem',
                            fontWeight: selectedCategory === category.id ? '600' : '500',
                            color: '#6c757d'
                          }}>
                            {category.categorie}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>)}
          </div>

          <div className="carousel-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="d-flex align-items justify-content" onClick={() => setShowType(v => !v)} style={{ marginBottom: '0px', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
              <h5 className="section-title" style={{
                color: '#2c3e50',
                fontWeight: '600',
                margin: 0,
                fontSize: '1.1rem'
              }}>
                Type
              </h5>
              <span style={{
                color: '#17a2b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 0
              }} title={showType ? 'Masquer' : 'Afficher'}>
                {showType ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
              </span>
            </div>
            {showType && (<div className="carousel-wrapper" style={{
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '0px',
              minHeight: '150px',
              height: '100%',
              flexGrow: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Carousel
                activeIndex={activeIndexSuCat}
                onSelect={handleSelectSousCat}
                interval={null}
                controls={true}
                nextIcon={
                  <div style={{
                    backgroundColor: '#17a2b8',
                    borderRadius: '50%',
                    width: `${arrowButtonSize}px`,
                    height: `${arrowButtonSize}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    <FaArrowRight color="white" size="16px" />
                  </div>
                }
                prevIcon={
                  <div style={{
                    backgroundColor: '#17a2b8',
                    borderRadius: '50%',
                    width: `${arrowButtonSize}px`,
                    height: `${arrowButtonSize}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    <FaArrowLeft color="white" size="16px" />
                  </div>
                }
              >
                {chunksSucat.map((chunk, chunkIndex) => (
                  <Carousel.Item key={chunkIndex}>
                    <div className="d-flex justify-content-start align-items-center flex-wrap" style={{                      gap: itemGap,
                      padding: '10px 0',
                      marginLeft: '9%'
                    }}>
                      <div
                        className="category-item-wrapper"
                        onClick={() => recordTypeViewAndFilter('tout')}
                        style={{
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          transform: sousCatFiltre === 'tout' ? 'scale(1.05)' : 'scale(1)',
                        }}
                      >
                        <div style={{
                          width: `${circleOuterSize}px`,
                          height: `${circleOuterSize}px`,
                          borderRadius: '50%',
                          padding: '3px',
                          margin: '0 auto 8px auto',
                          ...((currentViewedTypeId === '__all__')
                            ? { background: 'transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '4px solid #dbdbdb', padding: '2px', width: `${circleInnerSize}px`, height: `${circleInnerSize}px` }
                            : { ...gradientRingStyle, padding: '2px', width: `${circleInnerSize}px`, height: `${circleInnerSize}px` })
                        }}>
                          <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            background: '#fff',
                            border: '3px solid #dbdbdb',
                            boxSizing: 'border-box'
                          }}>
                            <img
                              src={'/images/bayd.jpg'}
                              alt={'tout'}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                        </div>
                        <p style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          fontWeight: sousCatFiltre === 'tout' ? '600' : '500',
                          color: '#6c757d'
                        }}>
                          Tout
                        </p>
                      </div>
                      {chunk.map((category, index) => (
                        <div
                          key={index}
                          className="category-item-wrapper"
                          onClick={() => recordTypeViewAndFilter(category.id)}
                          style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            transform: sousCatFiltre === category.id ? 'scale(1.05)' : 'scale(1)',
                          }}
                        >
                          <div style={{
                            width: `${circleOuterSize}px`,
                            height: `${circleOuterSize}px`,
                            borderRadius: '50%',
                            padding: '3px',
                            margin: '0 auto 8px auto',
                            ...((currentViewedTypeId === category.id)
                              ? { background: 'transparent', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '4px solid #dbdbdb', padding: '2px', width: `${circleInnerSize}px`, height: `${circleInnerSize}px` }
                              : { ...gradientRingStyle, padding: '2px', width: `${circleInnerSize}px`, height: `${circleInnerSize}px` })
                          }}>
                            <div style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              background: '#fff',
                              border: '3px solid #dbdbdb',
                              boxSizing: 'border-box'
                            }}>
                              <img
                                src={category.logoP ? toFullUrl(category.logoP) : '/images/bayd.jpg'}
                                alt={category.categorie}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>
                          </div>
                          <p style={{
                            margin: 0,
                            fontSize: '0.85rem',
                            fontWeight: sousCatFiltre === category.id ? '600' : '500',
                            color: '#6c757d'
                          }}>
                            {category.categorie}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>)}
          </div>
        </div>
      </div>
    </>
  );
};

export default FamilleTypeCarousels;
