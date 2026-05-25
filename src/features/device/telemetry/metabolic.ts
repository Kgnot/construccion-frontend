export type MetabolicReading = {
  deviceId: string;
  userId: string;
  timestamp: string;
  glucose: number;
  glucoseUnit: 'MG_DL';
  creatinine: number;
  creatinineUnit: 'MG_DL';
  bloodUreaNitrogen: number;
  bloodUreaNitrogenUnit: 'MG_DL';
  uricAcid: number;
  uricAcidUnit: 'MG_DL';
  ph: number;
  calcium: number;
  calciumUnit: 'MG_DL';
};
