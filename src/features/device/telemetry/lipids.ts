// types/lipid.ts
export type LipidReading = {
  deviceId: string;
  userId: string;
  timestamp: string;
  totalCholesterol: number;
  totalCholesterolUnit: 'MG_DL';
  triglycerides: number;
  triglyceridesUnit: 'MG_DL';
};