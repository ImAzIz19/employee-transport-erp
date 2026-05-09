import { Agency } from "../agency/agency";

export interface Vehicle{
    id : number ;
    numDeReference : string ;
    capacite : number ; 
    typeDeVehicule : string ; 
    numDeSeries : string ;
    dateDeMiseEnRoute : string ;  
    status : "status" ;
    agenceId : number ;
    agence : Agency ;
}
