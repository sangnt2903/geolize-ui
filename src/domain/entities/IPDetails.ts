export interface IPDetails {
  // Geolocation Data
  ip: string;
  dbVersion: string;
  continent: {
    code: string;
    names: {
      [key: string]: string;
    };
  };
  country: {
    isoCode: string;
    names: {
      [key: string]: string;
    };
    isInEuropeanUnion: boolean;
  };
  location: {
    latitude: number;
    longitude: number;
    accuracyRadius: number;
    timeZone: string;
  };
  subdivisions: Array<{
    isoCode: string;
    names: {
      [key: string]: string;
    };
  }>;
  representedCountry: {
    isoCode: string;
    names: {
      [key: string]: string;
    };
    type: string;
    isInEuropeanUnion: boolean;
  };
  registeredCountry: {
    isoCode: string;
    names: {
      [key: string]: string;
    };
    isInEuropeanUnion: boolean;
  };
  traits: {
    isAnonymousProxy: boolean;
    isAnycast: boolean;
    isSatelliteProvider: boolean;
  };
  postal: {
    code: string;
  };
  city: {
    names: {
      [key: string]: string;
    };
  };
} 