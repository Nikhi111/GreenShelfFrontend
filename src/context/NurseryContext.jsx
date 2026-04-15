import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const NurseryContext = createContext();

export const NurseryProvider = ({ children }) => {
  const { seller, isAuthenticated } = useAuth();
  const [nurseries, setNurseries] = useState([]);
  const [selectedNursery, setSelectedNursery] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && seller) {
      fetchNurseries();
    }
  }, [isAuthenticated, seller]);

  const fetchNurseries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/seller/nursery');
      const nurseryData = response.data.content || response.data;
      setNurseries(nurseryData);
      
      // Select first nursery by default if none selected
      if (Array.isArray(nurseryData) && nurseryData.length > 0 && !selectedNursery) {
        setSelectedNursery(nurseryData[0]);
      }
    } catch (error) {
      console.error('Failed to fetch nurseries:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectNursery = (nursery) => {
    setSelectedNursery(nursery);
  };

  return (
    <NurseryContext.Provider value={{ nurseries, selectedNursery, loading, selectNursery, refreshNurseries: fetchNurseries }}>
      {children}
    </NurseryContext.Provider>
  );
};

export const useNursery = () => useContext(NurseryContext);
