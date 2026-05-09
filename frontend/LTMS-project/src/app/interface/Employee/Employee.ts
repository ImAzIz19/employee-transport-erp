export interface Employee {
    id?: number;
    serialNumber: string;       
    lastName: string;        
    firstName: string;      
    againstMaster: string; 
    groupName: string;       
    plantSectionId: number;               
    phoneNumber: string;     
    // is_exempt: boolean;       
    // is_deleted: boolean;      
    direct: boolean;       
    activeForPlanification: boolean; 
    costCenter: string;      
    segmentId: number;          
    stationId: number; 
    plantSectionName: string;         
  }