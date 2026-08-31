// types/calculator.ts
export interface BessConfig {
  hasSolar: boolean;
  bessCapacity: number;
  bessPower: number;
  dod: number;
  cycleEfficiency: number;
  investmentCost: number;
  solarCapacity: number;
  sunHours: number;
  panelEfficiency: number;
  solarCost: number;
  dailyLoad: number;
  electricityRate: number;
  peakRate: number;
  peakHours: number;
}

export interface BessResult {
  dailySavings: number;
  monthlySavings: number;
  annualSavings: number;
  roi: number;
  totalInvestment: number;
  solarEnergy: number;
  bessEnergy: number;
  totalEnergySaved: number;
  paybackPeriod: number;
  co2Reduction: number;
}
