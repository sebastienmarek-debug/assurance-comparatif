"use client";
import { useState } from "react";
import { ClientInfo, Contract, ContractResult } from "./types";
import { computeResult } from "./utils";
import ContractForm from "./components/ContractForm";
import ComparativeTable from "./components/ComparativeTable";
import dynamic from "next/dynamic";

const PdfDownloadButton = dynamic(() => import("./components/PdfDownloadButton"), {
  ssr: false,
});

const today = new Date().toLocaleDateString("fr-FR");

export default function Home() {
  const [client, setClient] = useState<ClientInfo>({
    name: "",
    company: "",
    date: today,
    advisorName: "",
  });
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [step, setStep] = useState<"form" | "result">("form");

  const results: ContractResult[] = contracts.map(computeResult);
  const hasValidContracts = contracts.length > 0 && contracts.every((c) => c.type && c.currentAnnualPremium > 0);
  const isClientValid = client.name.trim() !== "" && client.advisorName.trim() !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Comparatif Assurance</h1>
          <p className="text-blue-300 text-xs mt-0.5">Outil de présentation client</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep("form")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              step === "form"
                ? "bg-white text-blue-900"
                : "text-blue-200 hover:bg-blue-800"
            }`}
          >
            Saisie
          </button>
          <button
            onClick={() => setStep("result")}
            disabled={!hasValidContracts || !isClientValid}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              step === "result"
                ? "bg-white text-blue-900"
                : "text-blue-200 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            Comparatif
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {step === "form" && (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                Informations client
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Nom du client *
                  </label>
                  <input
                    type="text"
                    value={client.name}
                    onChange={(e) => setClient({ ...client, name: e.target.value })}
                    placeholder="Jean Dupont"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Société (optionnel)
                  </label>
                  <input
                    type="text"
                    value={client.company}
                    onChange={(e) => setClient({ ...client, company: e.target.value })}
                    placeholder="Entreprise SA"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Conseiller *
                  </label>
                  <input
                    type="text"
                    value={client.advisorName}
                    onChange={(e) => setClient({ ...client, advisorName: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Date du comparatif
                  </label>
                  <input
                    type="text"
                    value={client.date}
                    onChange={(e) => setClient({ ...client, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                Contrats à comparer
              </h2>
              <ContractForm contracts={contracts} onChange={setContracts} />
            </section>

            {contracts.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={() => setStep("result")}
                  disabled={!hasValidContracts || !isClientValid}
                  className="bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow"
                >
                  Voir le comparatif →
                </button>
              </div>
            )}
          </div>
        )}

        {step === "result" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
              <div>
                <p className="font-semibold text-gray-800">{client.name}</p>
                {client.company && (
                  <p className="text-sm text-gray-500">{client.company}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  {client.date} · Conseiller : {client.advisorName}
                </p>
              </div>
              <PdfDownloadButton client={client} results={results} />
            </div>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                Comparatif détaillé
              </h2>
              <ComparativeTable results={results} />
            </section>

            <p className="text-xs text-center text-gray-400 italic">
              Document non contractuel — sous réserve de la validation globale des devis et de l'acceptation des compagnies d'assurance concernées.
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setStep("form")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Modifier les données
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
