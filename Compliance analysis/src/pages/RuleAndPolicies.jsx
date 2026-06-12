import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAppTheme } from '../context/ThemeContext.jsx';
import { 
  GppGood as Shield,
  Search,
  ChevronRight,
  Info,
  Rule,
  Language,
  Category,
  ArrowBack
} from '@mui/icons-material';
import styles from './RuleAndPolicies.module.css';

const RuleAndPolicies = () => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  
  const [frameworks, setFrameworks] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFrameworks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/framework/get-frameworks');
      setFrameworks(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch frameworks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrameworks();
  }, []);

  const filteredFrameworks = frameworks.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.authority.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const FrameworkDetail = ({ framework, onBack }) => (
    <div className={styles.detailView}>
      <button onClick={onBack} className={styles.backBtn}>
        <ArrowBack fontSize="small" /> Back to All Frameworks
      </button>

      <div className={styles.detailHeader}>
        <div className={styles.headerIcon}>
          <Shield sx={{ fontSize: 40 }} />
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.badgeRow}>
            <span className={styles.versionBadge}>v{framework.version}</span>
            <span className={styles.industryBadge}>{framework.industry}</span>
          </div>
          <h1>{framework.name} ({framework.shortCode})</h1>
          <p className={styles.authorityText}>
            <Language sx={{ fontSize: 16, mr: 0.5 }} /> {framework.authority} • {framework.country}
          </p>
        </div>
      </div>

      <div className={styles.descriptionSection}>
        <h3>Overview</h3>
        <p>{framework.description}</p>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.sectionTitleRow}>
          <h3>Regulatory Controls & Requirements</h3>
          <span className={styles.countBadge}>{framework.controls?.length || 0} Controls</span>
        </div>
        <div className={styles.controlsList}>
          {framework.controls?.map((control, idx) => (
            <div key={idx} className={styles.controlCard}>
              <div className={styles.controlHeader}>
                <div className={styles.controlId}>{control.controlId}</div>
                <div className={`${styles.riskBadge} ${styles['risk' + control.riskLevel.charAt(0).toUpperCase() + control.riskLevel.slice(1)]}`}>
                  {control.riskLevel} risk
                </div>
              </div>
              <h4>{control.title}</h4>
              <p className={styles.controlDesc}>{control.description}</p>
              <div className={styles.requirementBox}>
                <strong>Compliance Requirement:</strong>
                <p>{control.requirementText}</p>
              </div>
              <div className={styles.tagRow}>
                {control.mandatory && <span className={styles.mandatoryBadge}>Mandatory</span>}
                {control.tags?.map((tag, tIdx) => (
                  <span key={tIdx} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${styles.pageWrapper} ${isDark ? styles.dark : styles.light}`}>
      {selectedFramework ? (
        <FrameworkDetail 
          framework={selectedFramework} 
          onBack={() => setSelectedFramework(null)} 
        />
      ) : (
        <div className={styles.listView}>
          <div className={styles.pageHeader}>
            <div>
              <h1>Regulatory Rules & Policies</h1>
              <p>Explore international compliance frameworks and standard requirements.</p>
            </div>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search frameworks by name, code or authority..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingArea}>Loading regulatory data...</div>
          ) : filteredFrameworks.length === 0 ? (
            <div className={styles.emptyArea}>
              <Info sx={{ fontSize: 48, opacity: 0.2, mb: 2 }} />
              <h3>No frameworks found</h3>
              <p>Try searching for a different keyword or authority.</p>
            </div>
          ) : (
            <div className={styles.frameworkGrid}>
              {filteredFrameworks.map(framework => (
                <div 
                  key={framework._id} 
                  className={styles.frameworkCard}
                  onClick={() => setSelectedFramework(framework)}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>
                      <Rule />
                    </div>
                    <span className={styles.cardVersion}>v{framework.version}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{framework.name}</h3>
                    <p className={styles.cardCode}>{framework.shortCode}</p>
                    <p className={styles.cardAuthority}>{framework.authority}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardMeta}>
                      <span>{framework.controls?.length || 0} Controls</span>
                      <span className={styles.dot}>•</span>
                      <span>{framework.country}</span>
                    </div>
                    <ChevronRight className={styles.arrowIcon} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RuleAndPolicies;
