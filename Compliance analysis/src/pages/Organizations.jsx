import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAppTheme } from '../context/ThemeContext.jsx';
import { 
  Business as Building2, 
  Add as Plus, 
  Language as Globe, 
  Phone, 
  Email as Mail, 
  LocationOn as MapPin, 
  ChevronRight, 
  ArrowBack as ArrowLeft,
  Inventory as Package,
  GppGood as ShieldCheck,
  OpenInNew as ExternalLink
} from '@mui/icons-material';
import AddOrganizationForm from '../components/AddOrganizationForm';
import styles from './Organizations.module.css';

const Oraganizations = () => {
  const { mode } = useAppTheme();
  const [activeTab, setActiveTab] = useState('my-organizations');
  const [view, setView] = useState('list');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/organization/get-companies');
      setOrganizations(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message === "No Company available") {
        setOrganizations([]);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch organizations');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (companyId) => {
    try {
      const res = await api.get(`/product/get-by-company/${companyId}`);
      setProducts(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleAddSuccess = () => {
    setActiveTab('my-organizations');
    fetchOrganizations();
  };

  const handleOrgClick = (org) => {
    setSelectedOrg(org);
    setProducts([]);
    fetchProducts(org._id);
    setView('detail');
  };

  const isDark = mode === 'dark';

  const OrganizationDetails = ({ org, onBack }) => {
    return (
      <div className={`${styles.container} ${isDark ? styles.dark : styles.light}`}>
        <button onClick={onBack} className={styles.backButton}>
          <ArrowLeft sx={{ fontSize: 20 }} /> Back to Organizations
        </button>

        <div className={styles.detailsHeader}>
          <div className={styles.detailsHeaderContent}>
            <div className={styles.orgIconBox}>
              <Building2 sx={{ fontSize: 40 }} />
            </div>
            <div>
              <h1 className={styles.orgTitle}>{org.legalName}</h1>
              <p className={styles.orgDba}>{org.dbaName}</p>
            </div>
          </div>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailsColumn}>
            <div className={styles.detailCard}>
              <h3 className={styles.sectionTitle}>Contact & Address</h3>
              <div className={styles.contactGrid}>
                <div className={styles.infoRow}><Globe sx={{ fontSize: 18 }} /> <a href={org.website} target="_blank" rel="noreferrer" className={styles.infoLink}>{org.website}</a></div>
                <div className={styles.infoRow}><Phone sx={{ fontSize: 18 }} /> <span>{org.phoneNumber}</span></div>
                <div className={styles.infoRow}><MapPin sx={{ fontSize: 18 }} /> <span>{org.address?.street}, {org.address?.city}</span></div>
              </div>
            </div>
            <div className={styles.detailCard}>
              <h3 className={styles.sectionTitle}>Regulatory Compliance</h3>
              <div className={styles.regulatoryGrid}>
                <div><span className={styles.identifierLabel}>FDA FEI</span><p className={styles.identifierValue}>{org.identifiers?.fdafei || 'N/A'}</p></div>
                <div><span className={styles.identifierLabel}>DUNS</span><p className={styles.identifierValue}>{org.identifiers?.dunsNumber || 'N/A'}</p></div>
                <div><span className={styles.identifierLabel}>CIN</span><p className={styles.identifierValue}>{org.identifiers?.cin || 'N/A'}</p></div>
                <div><span className={styles.identifierLabel}>GSTIN</span><p className={styles.identifierValue}>{org.identifiers?.gstin || 'N/A'}</p></div>
              </div>
            </div>
          </div>

          <div className={styles.detailCard}>
            <h3 className={styles.sectionTitle}>Product Portfolio</h3>
            <div className={styles.portfolioList}>
              {products.length === 0 ? (
                <p className={styles.portfolioEmpty}>No products registered yet.</p>
              ) : (
                products.map(prod => (
                  <div key={prod._id} className={styles.productCard}>
                    <div className={styles.productInfo}>
                      <h4>{prod.productName}</h4>
                      <p>{prod.productCode} • {prod.productType}</p>
                    </div>
                    <div className={`${styles.badge} ${prod.complianceStatus === 'compliant' ? styles.badgeCompliant : styles.badgePending}`}>
                      {prod.complianceStatus}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (view === 'detail') {
    return <OrganizationDetails org={selectedOrg} onBack={() => setView('list')} />;
  }

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : styles.light}`}>
      <div className={styles.header}>
        <h1>Organizations</h1>
        <p>Manage your global business entities.</p>
      </div>

      <div className={styles.tabs}>
        <button onClick={() => setActiveTab('my-organizations')} className={`${styles.tab} ${activeTab === 'my-organizations' ? styles.tabActive : ''}`}>
          My Organizations {activeTab === 'my-organizations' && <div className={styles.activeIndicator} />}
        </button>
        <button onClick={() => setActiveTab('add-organization')} className={`${styles.tab} ${activeTab === 'add-organization' ? styles.tabActive : ''}`}>
          Add Organization {activeTab === 'add-organization' && <div className={styles.activeIndicator} />}
        </button>
      </div>

      {activeTab === 'my-organizations' ? (
        <div>
          {organizations.length === 0 && <p className={styles.organizationsEmpty}>No organizations found.</p>}
          {organizations.map(org => (
            <div key={org._id} className={styles.card} onClick={() => handleOrgClick(org)}>
              <div className={styles.cardInfo}>
                <Building2 sx={{ color: '#3b82f6' }} />
                <div>
                  <h3 className={styles.cardTitle}>{org.legalName}</h3>
                  <p className={styles.cardSubtitle}>{org.website}</p>
                </div>
              </div>
              <ChevronRight sx={{ color: 'inherit', opacity: 0.5 }} />
            </div>
          ))}
        </div>
      ) : (
        <AddOrganizationForm onSuccess={handleAddSuccess} />
      )}
    </div>
  );
};

export default Oraganizations;

