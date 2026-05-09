import { Agency } from "../agency/agency";
import { Station } from "../station/station";

export interface Path {
    id?: number;
    pathReference: string;         
    leoniSapReference: string;    
    numberOfKilometres?: number;            
    employeeContribution: number;  
    kilometreCost?: number;           
    arrivalPoint: string;      
    agencyId : number ;    
    agence : Agency ;
    stations: number[]; // Add this line

  }