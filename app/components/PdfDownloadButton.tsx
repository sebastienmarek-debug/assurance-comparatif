"use client";
import dynamic from "next/dynamic";
import { ClientInfo, ContractResult } from "../types";
import { FileDown } from "lucide-react";

// PDFDownloadLink must be rendered client-side only
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false, loading: () => null }
);

const PdfDocument = dynamic(() => import("./PdfDocument"), { ssr: false });

interface Props {
  client: ClientInfo;
  results: ContractResult[];
}

export default function PdfDownloadButton({ client, results }: Props) {
  const filename = `Comparatif_${client.name.replace(/\s+/g, "_")}_${client.date.replace(/\//g, "-")}.pdf`;

  return (
    <PDFDownloadLink
      document={<PdfDocument client={client} results={results} />}
      fileName={filename}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 shadow"
        >
          <FileDown size={18} />
          {loading ? "Génération…" : "Télécharger le PDF client"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
