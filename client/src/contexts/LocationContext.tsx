import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { profileService } from '@/services/profile';
import { authService } from '@/services/auth';

interface LocationContextType {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  availableLocations: string[];
  updateUserLocation: (location: string) => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const INDIAN_LOCATIONS = [
  'Delhi, India',
  'Mumbai, Maharashtra',
  'Bangalore, Karnataka',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
  'Lucknow, Uttar Pradesh',
  'Kanpur, Uttar Pradesh',
  'Nagpur, Maharashtra',
  'Indore, Madhya Pradesh',
  'Thane, Maharashtra',
  'Bhopal, Madhya Pradesh',
  'Visakhapatnam, Andhra Pradesh',
  'Pimpri-Chinchwad, Maharashtra',
  'Patna, Bihar',
  'Vadodara, Gujarat',
  'Ghaziabad, Uttar Pradesh',
  'Ludhiana, Punjab',
  'Agra, Uttar Pradesh',
  'Nashik, Maharashtra',
  'Faridabad, Haryana',
  'Meerut, Uttar Pradesh',
  'Rajkot, Gujarat',
  'Kalyan-Dombivali, Maharashtra',
  'Vasai-Virar, Maharashtra',
  'Varanasi, Uttar Pradesh',
  'Srinagar, Jammu and Kashmir',
  'Aurangabad, Maharashtra',
  'Dhanbad, Jharkhand',
  'Amritsar, Punjab',
  'Navi Mumbai, Maharashtra',
  'Allahabad, Uttar Pradesh',
  'Ranchi, Jharkhand',
  'Howrah, West Bengal',
  'Coimbatore, Tamil Nadu',
  'Jabalpur, Madhya Pradesh',
  'Gwalior, Madhya Pradesh',
  'Vijayawada, Andhra Pradesh',
  'Jodhpur, Rajasthan',
  'Madurai, Tamil Nadu',
  'Raipur, Chhattisgarh',
  'Kota, Rajasthan',
  'Chandigarh, Chandigarh',
  'Guwahati, Assam',
  'Solapur, Maharashtra',
  'Hubli-Dharwad, Karnataka',
  'Tiruchirappalli, Tamil Nadu',
  'Bareilly, Uttar Pradesh',
  'Mysore, Karnataka',
  'Tiruppur, Tamil Nadu',
  'Gurgaon, Haryana',
  'Aligarh, Uttar Pradesh',
  'Jalandhar, Punjab',
  'Bhubaneswar, Odisha',
  'Salem, Tamil Nadu',
  'Warangal, Telangana',
  'Guntur, Andhra Pradesh',
  'Bhiwandi, Maharashtra',
  'Saharanpur, Uttar Pradesh',
  'Gorakhpur, Uttar Pradesh',
  'Bikaner, Rajasthan',
  'Amravati, Maharashtra',
  'Noida, Uttar Pradesh',
  'Jamshedpur, Jharkhand',
  'Bhilai, Chhattisgarh',
  'Cuttack, Odisha',
  'Firozabad, Uttar Pradesh',
  'Kochi, Kerala',
  'Nellore, Andhra Pradesh',
  'Bhavnagar, Gujarat',
  'Dehradun, Uttarakhand',
  'Durgapur, West Bengal',
  'Asansol, West Bengal',
  'Rourkela, Odisha',
  'Nanded, Maharashtra',
  'Kolhapur, Maharashtra',
  'Ajmer, Rajasthan',
  'Akola, Maharashtra',
  'Gulbarga, Karnataka',
  'Jamnagar, Gujarat',
  'Ujjain, Madhya Pradesh',
  'Loni, Uttar Pradesh',
  'Siliguri, West Bengal',
  'Jhansi, Uttar Pradesh',
  'Ulhasnagar, Maharashtra',
  'Jammu, Jammu and Kashmir',
  'Sangli-Miraj & Kupwad, Maharashtra',
  'Mangalore, Karnataka',
  'Erode, Tamil Nadu',
  'Belgaum, Karnataka',
  'Ambattur, Tamil Nadu',
  'Tirunelveli, Tamil Nadu',
  'Malegaon, Maharashtra',
  'Gaya, Bihar',
  'Jalgaon, Maharashtra',
  'Udaipur, Rajasthan',
  'Maheshtala, West Bengal'
];

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocationState] = useState<string>('Delhi, India');
  const [availableLocations] = useState<string[]>(INDIAN_LOCATIONS);

  useEffect(() => {
    // Load user's saved location from profile
    const loadUserLocation = async () => {
      const { data: { session } } = await authService.getSession();
      if (session) {
        const { data: profile } = await profileService.getProfile();
        
        if (profile?.location) {
          setSelectedLocationState(profile.location);
        }
      }
    };

    loadUserLocation();
  }, []);

  const setSelectedLocation = (location: string) => {
    setSelectedLocationState(location);
  };

  const updateUserLocation = async (location: string) => {
    const { data: { session } } = await authService.getSession();
    if (session) {
      const { error } = await profileService.updateProfile({ location });
      
      if (!error) {
        setSelectedLocationState(location);
      }
    }
  };

  return (
    <LocationContext.Provider value={{
      selectedLocation,
      setSelectedLocation,
      availableLocations,
      updateUserLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};