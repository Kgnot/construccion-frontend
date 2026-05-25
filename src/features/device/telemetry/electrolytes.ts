export type ElectrolyteReading = {
  deviceId: string;
  userId: string;
  timestamp: string;
  sodium: number;
  sodiumUnit: 'MEQ_L';
  potassium: number;
  potassiumUnit: 'MEQ_L';
};
