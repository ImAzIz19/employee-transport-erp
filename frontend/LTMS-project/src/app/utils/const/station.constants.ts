import { Station } from "../../interface/station/station";

export const STATION_FIELD_TRANSLATIONS: { [key in keyof Station]: string } = {
  id: 'ID',
  refRegion: 'REF_REGION',
  refSapLeoni: 'REF_SAP_LEONI',
  longitude: 'LONGITUDE',
  latitude: 'LATITUDE',
  radius: 'RADIUS',
};