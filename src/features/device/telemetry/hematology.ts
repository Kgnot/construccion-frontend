export type HematologyReading = {
  deviceId: string;
  userId: string;
  timestamp: string;
  hemoglobin: number;
  hemoglobinUnit: 'G_DL';
  whiteBloodCells: number;
  whiteBloodCellsUnit: 'CELLS_MCL';
  platelets: number;
  plateletsUnit: 'CELLS_MCL';
  iron: number;
  ironUnit: 'MG_DL';
};
