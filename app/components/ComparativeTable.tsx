"use client";
import { ContractResult } from "../types";
import { formatEuro, formatReduction } from "../utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface Props {
  results: ContractResult[];
}

export default function ComparativeTable({ results }: Props) {
  const totalCurrentAnnual = results.reduce((s, r) => s + r.contract.currentAnnualPremium, 0);
  const totalProposedAnnual = results.reduce((s, r) => s + r.proposedAnnualAfterReduction, 0);
  const totalAnnualSaving = results.reduce((s, r) => s + r.annualSaving, 0);
  const totalMonthlySaving = totalAnnualSaving / 12;
  const totalCurrentMonthly = totalCurrentAnnual / 12;
  const totalProposedMonthly = totalProposedAnnual / 12;

  return (
    <div className="space-y-6">
      {/* Per-contract table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-semibold">Contrat</th>
              <th className="text-right px-4 py-3 font-semibold">Actuel / an</th>
              <th className="text-right px-4 py-3 font-semibold">Actuel / mois</th>
              <th className="text-right px-4 py-3 font-semibold">Réduction</th>
              <th className="text-right px-4 py-3 font-semibold">Proposé / an</th>
              <th className="text-right px-4 py-3 font-semibold">Proposé / mois</th>
              <th className="text-right px-4 py-3 font-semibold">Économie / an</th>
              <th className="text-right px-4 py-3 font-semibold">Économie / mois</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.map((r) => {
              const saving = r.annualSaving;
              const isPositive = saving > 0.005;
              const isNegative = saving < -0.005;
              return (
                <tr key={r.contract.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {r.contract.type || <span className="italic text-gray-400">Sans nom</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatEuro(r.contract.currentAnnualPremium)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatEuro(r.currentMonthly)}
                  </td>
                  <td className="px-4 py-3 text-right text-blue-600 font-medium">
                    {formatReduction(r.contract)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-800 font-medium">
                    {formatEuro(r.proposedAnnualAfterReduction)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-800 font-medium">
                    {formatEuro(r.proposedMonthlyAfterReduction)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-semibold flex items-center justify-end gap-1 ${
                        isPositive
                          ? "text-green-600"
                          : isNegative
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingDown size={14} />
                      ) : isNegative ? (
                        <TrendingUp size={14} />
                      ) : (
                        <Minus size={14} />
                      )}
                      {formatEuro(saving)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-semibold ${
                        isPositive
                          ? "text-green-600"
                          : isNegative
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {formatEuro(r.monthlySaving)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-800 text-white font-semibold">
              <td className="px-4 py-3">TOTAL</td>
              <td className="px-4 py-3 text-right">{formatEuro(totalCurrentAnnual)}</td>
              <td className="px-4 py-3 text-right">{formatEuro(totalCurrentMonthly)}</td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3 text-right">{formatEuro(totalProposedAnnual)}</td>
              <td className="px-4 py-3 text-right">{formatEuro(totalProposedMonthly)}</td>
              <td className="px-4 py-3 text-right">
                <span className={totalAnnualSaving >= 0 ? "text-green-300" : "text-red-300"}>
                  {formatEuro(totalAnnualSaving)}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className={totalMonthlySaving >= 0 ? "text-green-300" : "text-red-300"}>
                  {formatEuro(totalMonthlySaving)}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Économie mensuelle"
          value={formatEuro(totalMonthlySaving)}
          positive={totalMonthlySaving >= 0}
        />
        <SummaryCard
          label="Économie annuelle"
          value={formatEuro(totalAnnualSaving)}
          positive={totalAnnualSaving >= 0}
          large
        />
        <SummaryCard
          label="Gain sur 3 ans"
          value={formatEuro(totalAnnualSaving * 3)}
          positive={totalAnnualSaving >= 0}
        />
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  positive,
  large,
}: {
  label: string;
  value: string;
  positive: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-5 text-center border ${
        positive
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
      <p
        className={`font-bold ${large ? "text-3xl" : "text-2xl"} ${
          positive ? "text-green-700" : "text-red-600"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
