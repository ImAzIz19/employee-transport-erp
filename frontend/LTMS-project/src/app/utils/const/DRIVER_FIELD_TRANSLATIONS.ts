import { Driver } from "../../interface/driver/driver";

export const DRIVER_FIELD_TRANSLATIONS: { [key in keyof Driver]: string } = {
    id: 'ID',
    prenom: 'FIRST-NAME',
    nom: 'LAST-NAME',
    dateDeNaissance: 'DATEOFBIRTH',
    telephone: 'PHONE',
    status : "status",
    agenceId : "agenceId",
    agence: 'AGENCY-NAME',
  };