
export interface Agency {
    id: number;
    name: string;
    address: string;
    nomDeEntreprise: string; // Likely "corporate name" in French
    email: string;
    numeroDeTelephone: string; // "phone number"
    matricule: string; // "fiscal number" or similar
    horaireDeTravail: string; // "work time"
    siteInternet: string; // "website"
    status: string;
    numberOfVehicles:number ;
    numberOfDrivers:number ;
  }