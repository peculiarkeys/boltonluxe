import React, { createContext, useContext } from 'react';
import { useAuth, Property } from './AuthContext';

interface PropertyContextType {
  property: Property | null;
  propertyId: string | null;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  // If loading, we could return a loader here, but we'll let the ProtectedRoute handle it.
  const property = user?.property || null;
  const propertyId = user?.propertyId || null;

  return (
    <PropertyContext.Provider value={{ property, propertyId }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};
