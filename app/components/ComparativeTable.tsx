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
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-semibold" rowSpan={2}>Contrat</th>
              <th className="text-center px-4 py-2 font-semibold border-b border-gray-200 bg-orange-50 text-orange-700" colSpan={2}>
                Actuel
              </th>
              <th className="text-center px-4 py-2 font-semibold border-b border-gray-200 bg-blue-50 text-blue-700" colSpan={2}>
                Proposé
              </th>
              <th className="text-left px-4 py-2 font-semibold" rowSpan={2}>Réduction</th>
              <th className="text-center px-4 py-2 font-semibold border-b border-gray-200 bg-green-50 text-green-700" colSpan={2}>
                Économie
              </th>
            </tr>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="text-right px-4 py-2 font-semibold bg-orange-50 text-orange-600">/ an</th>
              <th className="text-right px-4 py-2 font-semibold bg-orange-50 text-orange-600">/ mois</th>
              <th className="text-right px-4 py-2 font-semibold bg-blue-50 text-blue-600">/ an</th>
              <th className="text-right px-4 py-2 font-semibold bg-blue-50 text-blue-600">/ mois</th>
              <th className="text-right px-4 py-2 font-semibold bg-green-50 text-green-600">/ an</th>
              <th className="text-right px-4 py-2 font-semibold bg-green-50 text-green-600">/ mois</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.map((r) => {
              const saving = r.annualSaving;
              const isPositive = saving > 0.005;
              const isNegative = saving < -0.005;
              return (
                <tr key={r.contract.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">
                      {r.contract.type || <span className="italic text-gray-400">Sans nom</span>}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {r.contract.currentInsurer && (
                        <span className="text-orange-600">{r.contract.currentInsurer}</span>
                      )}
                      {r.contract.currentInsurer && r.contract.proposedInsurer && (
                        <span className="mx-1">→</span>
                      )}
                      {r.contract.proposedInsurer && (
                        <span className="text-blue-600">{r.contract.proposedInsurer}</span>
                      )}
                    </p>
                  </td>
                  {/* Actuel */}
                  <td className="px-4 py-3 text-right bg-orange-50/40 text-gray-700">
                    {formatEuro(r.contract.currentAnnualPremium)}
                  </td>
                  <td className="px-4 py-3 text-right bg-orange-50/40 text-gray-700">
                    {formatEuro(r.currentMonthly)}
                  </td>
                  {/* Proposé */}
                  <td className="px-4 py-3 text-right bg-blue-50/40 font-medium text-gray-800">
                    {formatEuro(r.proposedAnnualAfterReduction)}
                  </td>
                  <td className="px-4 py-3 text-right bg-blue-50/40 font-medium text-gray-800">
                    {formatEuro(r.proposedMonthlyAfterReduction)}
                  </td>
                  {/* Réduction */}
                  <td className="px-4 py-3 text-blue-600 text-xs font-medium max-w-[160px]">
                    {formatReduction(r.contract)}
                  </td>
                  {/* Économie */}
                  <td className="px-4 py-3 text-right bg-green-50/40">
                    <span className={`font-semibold flex items-center justify-end gap-1 ${
                      isPositive ? "text-green-600" : isNegative ? "text-red-500" : "text-gray-400"
                    }`}>
                      {isPositive ? <TrendingDown size={13} /> : isNegative ? <TrendingUp size={13} /> : <Minus size={13} />}
                      {formatEuro(saving)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right bg-green-50/40">
                    <span className={`font-semibold ${
                      isPositive ? "text-green-600" : isNegative ? "text-red-500" : "text-gray-400"
                    }`}>
                      {formatEuro(r.monthlySaving)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-800 text-white font-semibold text-sm">
              <td className="px-4 py-3">TOTAL</td>
              <td className="px-4 py-3 text-right">{formatEuro(totalCurrentAnnual)}</td>
              <td className="px-4 py-3 text-right">{formatEuro(totalCurrentMonthly)}</td>
              <td className="px-4 py-3 text-right">{formatEuro(totalProposedAnnual)}</td>
              <td className="px-4 py-3 text-right">{formatEuro(totalProposedMonthly)}</td>
              <td className="px-4 py-3"></td>
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

      {/* Summary cards — mensuel + annuel uniquement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SummaryCard label="Économie mensuelle" value={formatEuro(totalMonthlySaving)} positive={totalMonthlySaving >= 0} />
        <SummaryCard label="Économie annuelle" value={formatEuro(totalAnnualSaving)} positive={totalAnnualSaving >= 0} large />
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
    <div className={`rounded-xl p-5 text-center border ${
      positive ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
    }`}>
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
      <p className={`font-bold ${large ? "text-3xl" : "text-2xl"} ${
        positive ? "text-green-700" : "text-red-600"
      }`}>
        {value}
      </p>
    </div>
  );
}
