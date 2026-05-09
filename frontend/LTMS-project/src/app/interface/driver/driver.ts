import { Agency } from "../agency/agency";

export interface Driver {
    id : number ;
    prenom : string ; 
    nom : string ;
    dateDeNaissance : string ;
    telephone : number ;
    status : "status" ; 
    agenceId : number ;
    agence : Agency ; 
}
