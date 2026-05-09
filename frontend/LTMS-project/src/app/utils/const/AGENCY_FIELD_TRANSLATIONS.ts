import { Agency } from "../../interface/agency/agency";

export const AGENCY_FIELD_TRANSLATIONS: { [key in keyof Agency]: string } = {
    id: 'ID',
    name: 'NAME',
    address: 'ADDRESS',
    nomDeEntreprise: 'CORPORATEENAME',
    email: 'EMAIL',
    numeroDeTelephone: 'PHONE',
    matricule: 'FISCAL-NUMBER',
    horaireDeTravail: 'WORK-TIME',
    siteInternet: 'WEB-SITE',
    status: "status",
    numberOfVehicles: 'VEHICLECOUNT',
    numberOfDrivers : 'DRIVERCOUNT'
  };