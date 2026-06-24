"use client";
import { useState } from "react";
import { Contract, ReductionType } from "../types";
import { PlusCircle, Trash2 } from "lucide-react";

interface Props {
  contracts: Contract[];
  onChange: (contracts: Contract[]) => void;
}

function newContract(): Contract {
  return {
    id: crypto.randomUUID(),
    type: "",
    currentAnnualPremium: 0,
    proposedAnnualPremium: 0,
    reductionType: "percent",
    reductionValue: 0,
  };
}

export default function ContractForm({ contracts, onChange }: Props) {
  function add() {
    onChange([...contracts, newContract()]);
  }

  function remove(id: string) {
    onChange(contracts.filter((c) => c.id !== id));
  }

  function update(id: string, field: keyof Contract, value: string | number) {
    onChange(
      contracts.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  }

  return (
    <div className="space-y-4">
      {contracts.map((c, idx) => (
        <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
              Contrat {idx + 1}
            </span>
            <button
              onClick={() => remove(c.id)}
              className="text-red-400 hover:text-red-600 transition-colors"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Type de contrat
              </label>
              <input
                type="text"
                placeholder="Ex: Auto, Habitation, RC Pro…"
                value={c.type}
                onChange={(e) => update(c.id, "type", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Prime actuelle (€/an)
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={c.currentAnnualPremium || ""}
                onChange={(e) =>
                  update(c.id, "currentAnnualPremium", parseFloat(e.target.value) || 0)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Prime proposée (€/an, avant réduction)
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={c.proposedAnnualPremium || ""}
                onChange={(e) =>
                  update(c.id, "proposedAnnualPremium", parseFloat(e.target.value) || 0)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Type de réduction
              </label>
              <select
                value={c.reductionType}
                onChange={(e) =>
                  update(c.id, "reductionType", e.target.value as ReductionType)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="percent">Pourcentage (%)</option>
                <option value="months">Mois offerts</option>
                <option value="fixed">Montant fixe (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {c.reductionType === "percent"
                  ? "Réduction (%)"
                  : c.reductionType === "months"
                  ? "Nombre de mois offerts"
                  : "Montant de la remise (€)"}
              </label>
              <input
                type="number"
                min={0}
                step={c.reductionType === "percent" ? 0.1 : 1}
                max={c.reductionType === "percent" ? 100 : c.reductionType === "months" ? 12 : undefined}
                value={c.reductionValue || ""}
                onChange={(e) =>
                  update(c.id, "reductionValue", parseFloat(e.target.value) || 0)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
      >
        <PlusCircle size={20} />
        Ajouter un contrat
      </button>
    </div>
  );
}
