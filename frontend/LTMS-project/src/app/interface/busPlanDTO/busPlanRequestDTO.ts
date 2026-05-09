export interface BusPlanRequestDTO {
  busPlanId?: number;
  week?: string;
  agencyId?: number | null;
  weekdays?: string[];
  shiftsIds?: number[];
  circuitIds?: number[];
  numberOfStandardBuses?: number;
  numberOfMiniBuses?: number;
}