import { Contract, ContractResult } from "./types";

export function computeResult(contract: Contract): ContractResult {
  const currentMonthly = contract.currentAnnualPremium / 12;

  let proposedAnnualAfterReduction = contract.proposedAnnualPremium;

  if (contract.reductionType === "percent") {
    proposedAnnualAfterReduction =
      contract.proposedAnnualPremium * (1 - contract.reductionValue / 100);
  } else if (contract.reductionType === "months") {
    const freeMonths = contract.reductionValue;
    const paidMonths = 12 - freeMonths;
    proposedAnnualAfterReduction =
      (contract.proposedAnnualPremium / 12) * paidMonths;
  } else if (contract.reductionType === "fixed") {
    proposedAnnualAfterReduction =
      contract.proposedAnnualPremium - contract.reductionValue;
  }

  const proposedMonthlyAfterReduction = proposedAnnualAfterReduction / 12;
  const proposedMonthly = contract.proposedAnnualPremium / 12;
  const annualSaving = contract.currentAnnualPremium - proposedAnnualAfterReduction;
  const monthlySaving = annualSaving / 12;

  return {
    contract,
    currentMonthly,
    proposedMonthly,
    proposedAnnualAfterReduction,
    proposedMonthlyAfterReduction,
    annualSaving,
    monthlySaving,
  };
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatReduction(contract: Contract): string {
  if (contract.reductionType === "percent") return `${contract.reductionValue}%`;
  if (contract.reductionType === "months") {
    const monthlyValue = contract.proposedAnnualPremium / 12;
    const saving = monthlyValue * contract.reductionValue;
    return `${contract.reductionValue} mois offerts par ${contract.proposedInsurer || "l'assureur"} (${formatEuro(saving)})`;
  }
  if (contract.reductionType === "fixed") return `${formatEuro(contract.reductionValue)} de remise`;
  return "";
}
