export type ReductionType = "percent" | "months" | "fixed";

export interface Contract {
  id: string;
  type: string;
  currentInsurer: string;
  proposedInsurer: string;
  currentAnnualPremium: number;
  proposedAnnualPremium: number;
  reductionType: ReductionType;
  reductionValue: number;
}

export interface ClientInfo {
  name: string;
  company?: string;
  date: string;
  advisorName: string;
}

export interface ComparativeData {
  client: ClientInfo;
  contracts: Contract[];
}

export interface ContractResult {
  contract: Contract;
  currentMonthly: number;
  proposedMonthly: number;
  proposedAnnualAfterReduction: number;
  proposedMonthlyAfterReduction: number;
  annualSaving: number;
  monthlySaving: number;
}
