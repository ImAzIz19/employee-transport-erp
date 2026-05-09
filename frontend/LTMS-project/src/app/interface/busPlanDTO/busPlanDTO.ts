export interface BusPlanDTO {
  id: number;
  agencyName: string;
  circuitName: string;
  weekDay: string;
  date: string;
  startTime: string;
  endTime: string;
  numberOfEmployees: number;
  numberOfStandardBuses: number;
  numberOfMiniBuses: number;
}