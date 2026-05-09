
export interface PlantSection {
  id?: number; 
  plantsection_name: string;
  description: string;
  emplacement: string;
  psManagerId: number;
  rhManagerId: number;  // Changed from string to number to match User.id
  organization: string;
  segmentIds: number[]; // Changed from string[] to number[] to match Segment.id
}