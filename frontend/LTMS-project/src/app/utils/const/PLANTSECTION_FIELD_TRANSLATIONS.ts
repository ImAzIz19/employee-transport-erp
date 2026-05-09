import { PlantSection } from "../../interface/plant-section/plant-section";

export const PLANT_SECTION_FIELD_TRANSLATIONS: { [key: string]: string } = {
  id: 'ID',
  plantsection_name: 'PLANTSECTIONNAME',
  description: 'DESCRIPTION',
  emplacement: 'EMPLACEMENT',
  psManagerName: 'MANAGER',  // New field for display
  rhManagerName: 'RH-RESPONSABLE',  // New field for display
  // Note: We keep the ID fields in the map but will exclude them from display
  psManagerId: 'PS_MANAGER_ID',  // Will be hidden
  rhManagerId: 'RH_MANAGER_ID',  // Will be hidden
  segmentNames: 'SEGMENTS' // Add this for the segment names display

  
};