import { Vehicle } from "../../interface/vehicle/vehicle";

export const VEHICLE_FIELD_TRANSLATIONS: { [key in keyof Vehicle]: string } = {
    id: 'ID',
    numDeReference: 'REFERENCENAME',
    capacite: 'CAPACITY',
    typeDeVehicule: 'VEHICLETYPE',
    numDeSeries : 'SERIAL_NUMBER',
    dateDeMiseEnRoute: 'STARTUPDATE',
    status : "status",
    agenceId : "agenceId",
    agence: 'AGENCY-NAME',
  };