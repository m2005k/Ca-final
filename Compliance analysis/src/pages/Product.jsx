import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAppTheme } from '../context/ThemeContext.jsx';
import AddProductForm from '../components/AddProductForm';
import styles from './Product.module.css';

const Product = () => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  
  const [activeTab, setActiveTab] = useState('my-products');
  const [view, setView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrganizations = async () => {
    try {
      const res = await api.get('/organization/get-companies');
      setOrganizations(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch organizations', err);
    }
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const orgsRes = await api.get('/organization/get-companies');
      const orgs = orgsRes.data.data || [];
      
      const allProducts = [];
      for (const org of orgs) {
        try {
          const prodRes = await api.get(`/product/get-by-company/${org._id}`);
          if (prodRes.data.data) {
            allProducts.push(...prodRes.data.data.map(p => ({ ...p, orgName: org.legalName })));
          }
        } catch (e) {
          console.warn(`No products for ${org.legalName}`);
        }
      }
      setProducts(allProducts);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
    fetchAllProducts();
  }, []);

  const handleAddSuccess = () => {
    setActiveTab('my-products');
    fetchAllProducts();
  };

  const filteredProducts = products.filter(p => {
    const productName = p.productName || '';
    const productCode = p.productCode || '';
    const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         productCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrg = selectedOrgId === 'all' || p.company === selectedOrgId;
    return matchesSearch && matchesOrg;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'compliant': return styles.statusCompliant;
      case 'non_compliant': return styles.statusNonCompliant;
      case 'under_review': return styles.statusReview;
      default: return styles.statusDraft;
    }
  };

  const ProductDetails = ({ product, onBack }) => (
    <div className={styles.detailsView}>
      <button onClick={onBack} className={styles.backBtn}>
        ← Back to Inventory
      </button>

      <div className={styles.detailsHeader}>
        <div className={styles.detailsMain}>
          <div className={styles.productAvatar}>
            {product.productName?.charAt(0)}
          </div>
          <div>
            <div className={styles.titleRow}>
              <h1>{product.productName}</h1>
              <span className={`${styles.statusBadge} ${getStatusClass(product.complianceStatus)}`}>
                {product.complianceStatus?.replace('_', ' ')}
              </span>
            </div>
            <p className={styles.metaText}>{product.productCode} • {product.productType} • {product.orgName}</p>
          </div>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Description</h3>
            <p>{product.description || 'No description available for this product.'}</p>
          </div>
          <div className={styles.infoCard}>
            <h3>Regulatory Profile</h3>
            <div className={styles.dataGrid}>
              <div className={styles.dataRow}><span className={styles.label}>Device Class</span><span>{product.regulatory?.deviceClass || 'N/A'}</span></div>
              <div className={styles.dataRow}><span className={styles.label}>Risk Category</span><span>{product.regulatory?.riskCategory || 'Low'}</span></div>
              <div className={styles.dataRow}><span className={styles.label}>Intended Use</span><span>{product.regulatory?.intendedUse || 'N/A'}</span></div>
              <div className={styles.dataRow}>
                <span className={styles.label}>Target Markets</span>
                <div className={styles.tagGroup}>
                  {product.regulatory?.market?.map((m, i) => <span key={i} className={styles.marketTag}>{m}</span>) || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sideSection}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreValue}>{product.complianceScore}%</span>
              <span className={styles.scoreLabel}>Compliance</span>
            </div>
          </div>
          {product.images?.length > 0 && (
            <div className={styles.imageGallery}>
              <h3>Product Assets</h3>
              <div className={styles.assetGrid}>
                {product.images.map((img, i) => <img key={i} src={img.url} alt="asset" />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (view === 'detail' && selectedProduct) {
    return (
      <div className={`${styles.pageWrapper} ${isDark ? styles.dark : styles.light}`}>
        <ProductDetails product={selectedProduct} onBack={() => setView('list')} />
      </div>
    );
  }

  return (
    <div className={`${styles.pageWrapper} ${isDark ? styles.dark : styles.light}`}>
      <div className={styles.topHeader}>
        <div>
          <h1>Product Portfolio</h1>
          <p>Global inventory and compliance management</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setActiveTab('add-product')}>
          + New Product
        </button>
      </div>

      <div className={styles.tabNav}>
        <button 
          onClick={() => setActiveTab('my-products')} 
          className={`${styles.tabBtn} ${activeTab === 'my-products' ? styles.tabActive : ''}`}
        >
          My Products
        </button>
        <button 
          onClick={() => setActiveTab('add-product')} 
          className={`${styles.tabBtn} ${activeTab === 'add-product' ? styles.tabActive : ''}`}
        >
          Add Product
        </button>
      </div>

      {activeTab === 'my-products' ? (
        <div className={styles.inventoryArea}>
          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <input 
                type="text" 
                placeholder="Search by name or code..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={styles.filterBox}>
              <select value={selectedOrgId} onChange={(e) => setSelectedOrgId(e.target.value)}>
                <option value="all">All Organizations</option>
                {organizations.map(org => (
                  <option key={org._id} value={org._id}>{org.legalName}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className={styles.loaderArea}>Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.emptyArea}>
              <div className={styles.emptyIcon}>📦</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {filteredProducts.map(product => (
                <div 
                  key={product._id} 
                  className={styles.productCard}
                  onClick={() => {
                    setSelectedProduct(product);
                    setView('detail');
                  }}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.miniAvatar}>{product.productName?.charAt(0)}</div>
                    <span className={`${styles.dotBadge} ${getStatusClass(product.complianceStatus)}`}>
                      {product.complianceStatus?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className={styles.cardMain}>
                    <h3>{product.productName}</h3>
                    <p className={styles.cardOrgName}>{product.orgName}</p>
                  </div>
                  <div className={styles.cardBottom}>
                    <span className={styles.cardCode}>{product.productCode || 'N/A'}</span>
                    <span className={styles.cardScore}>{product.complianceScore}% Score</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <AddProductForm onSuccess={handleAddSuccess} />
      )}
    </div>
  );
};

export default Product;