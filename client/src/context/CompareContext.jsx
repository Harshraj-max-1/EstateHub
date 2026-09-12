import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [comparedProperties, setComparedProperties] = useState(() => {
    try {
      const saved = localStorage.getItem('estatehub_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('estatehub_compare', JSON.stringify(comparedProperties));
  }, [comparedProperties]);

  const addToCompare = (property) => {
    if (comparedProperties.some((p) => p._id === property._id)) {
      return { success: false, message: 'Property already in comparison list' };
    }
    if (comparedProperties.length >= 4) {
      return { success: false, message: 'You can compare up to 4 properties at a time' };
    }
    setComparedProperties((prev) => [...prev, property]);
    return { success: true, message: 'Added to comparison' };
  };

  const removeFromCompare = (propertyId) => {
    setComparedProperties((prev) => prev.filter((p) => p._id !== propertyId));
  };

  const clearCompare = () => {
    setComparedProperties([]);
  };

  const isComparing = (propertyId) => {
    return comparedProperties.some((p) => p._id === propertyId);
  };

  return (
    <CompareContext.Provider
      value={{
        comparedProperties,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        compareCount: comparedProperties.length
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};
