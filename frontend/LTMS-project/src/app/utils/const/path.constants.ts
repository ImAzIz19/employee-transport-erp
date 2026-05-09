import { Path } from "../../interface/circuit/circuit";

export const PATH_FIELD_TRANSLATIONS: { [key in keyof Path]: string } = {
  id: 'ID',
  pathReference: 'PATH_REFERENCE',
  leoniSapReference: 'LEONI_SAP_REFERENCE',
  numberOfKilometres: 'NUMBER_OF_KILOMETRES',
  employeeContribution: 'EMPLOYEE_CONTRIBUTION',
  kilometreCost: 'KILOMETRE_COST',
  arrivalPoint: 'ARRIVAL_POINT',
  agencyId: 'AGENCY_ID',
  agence: 'AGENCY_NAME',
  stations:'STATIONS'
};