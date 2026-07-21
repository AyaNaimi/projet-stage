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

const ProductCarousel = ({
  products,
  selectedProductId,
  onProductSelect,
}) => {
  const [isSmallViewport, setIsSmallViewport] = React.useState(false);
  const [showCarousel, setShowCarousel] = React.useState(true);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 576px)');
    const apply = () => setIsSmallViewport(mql.matches);
    apply();
    mql.addEventListener ? mql.addEventListener('change', apply) : mql.addListener(apply);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', apply) : mql.removeListener(apply);
    };
  }, []);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const circleOuterSize = isSmallViewport ? 60 : 76;
  const circleInnerSize = isSmallViewport ? 56 : 72;
  const arrowButtonSize = isSmallViewport ? 32 : 40;
  const itemGap = isSmallViewport ? '12px' : '25px';

  const gradientRingStyle = {
    background: 'linear-gradient(45deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)'
  };

  const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  const itemsPerSlide = isSmallViewport ? 4 : 8;
  const productsWithTout = [{ id: 'tout', designation: 'Tout' }, ...products];
  const chunks = chunkArray(productsWithTout, itemsPerSlide);

  return (
    <div className="carousel-container" style={{
      background: '#ffffff',
      borderRadius: '15px',
      padding: '15px',
      marginBottom: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      <div className="d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between" onClick={() => setShowCarousel(v => !v)} style={{ marginBottom: '0px', cursor: 'pointer', userSelect: 'none' }}>
          <h5 className="section-title" style={{
            color: '#2c3e50',
            fontWeight: '600',
            margin: 0,
            fontSize: '1.1rem'
          }}>
            Produits
          </h5>
          <span style={{ color: '#17a2b8' }}>
            {showCarousel ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          </span>
        </div>

        {showCarousel && (
          <div className="carousel-wrapper" style={{
            position: 'relative',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '10px 0',
            minHeight: '130px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            marginTop: '10px'
          }}>
            <Carousel
              activeIndex={activeIndex}
              onSelect={handleSelect}
              interval={null}
              controls={chunks.length > 1}
              nextIcon={
                <div style={{
                  backgroundColor: '#86d9d4',
                  borderRadius: '50%',
                  width: `${arrowButtonSize}px`,
                  height: `${arrowButtonSize}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  position: 'absolute',
                  right: '-15px'
                }}>
                  <FaArrowRight color="white" size="16px" />
                </div>
              }
              prevIcon={
                <div style={{
                  backgroundColor: '#86d9d4',
                  borderRadius: '50%',
                  width: `${arrowButtonSize}px`,
                  height: `${arrowButtonSize}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  position: 'absolute',
                  left: '-15px'
                }}>
                  <FaArrowLeft color="white" size="16px" />
                </div>
              }
            >
              {chunks.map((chunk, chunkIndex) => (
                <Carousel.Item key={chunkIndex}>
                  <div className="d-flex justify-content-start align-items-center" style={{ gap: itemGap, padding: '15px 0', marginLeft: '5%', marginRight: '5%', minHeight: '140px' }}>
                    {chunk.map((product, index) => {
                      const isSelected = selectedProductId === product.id;
                      return (
                        <div
                          key={index}
                          className="product-item-wrapper"
                          onClick={() => onProductSelect(product.id)}
                          style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                            width: `${circleOuterSize}px`,
                            flexShrink: 0
                          }}
                        >
                          <div style={{
                            width: `${circleOuterSize}px`,
                            height: `${circleOuterSize}px`,
                            borderRadius: '50%',
                            padding: '2px',
                            margin: '0 auto 10px auto',
                            ...(isSelected ? { border: '3px solid #00afaa', padding: '1px' } : { ...gradientRingStyle, padding: '2px' })
                          }}>
                            <div style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              background: '#fff',
                              border: '2px solid #fff',
                              boxSizing: 'border-box'
                            }}>
                              <img
                                src={product.id === 'tout' ? '/images/bayd.jpg' : (product.logoP ? toFullUrl(product.logoP) : '/images/bayd.jpg')}
                                alt={product.designation}
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
                            fontSize: '0.8rem',
                            fontWeight: isSelected ? '700' : '500',
                            color: isSelected ? '#00afaa' : '#6c757d',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100%'
                          }}>
                            {product.designation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
