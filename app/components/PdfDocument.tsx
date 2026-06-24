"use client";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ClientInfo, ContractResult } from "../types";
import { formatEuro, formatReduction } from "../utils";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: 36,
    color: "#1a1a2e",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a8a",
    paddingBottom: 14,
  },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1e3a8a", marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#64748b" },
  clientName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1a1a2e" },
  clientDetail: { fontSize: 8, color: "#64748b", marginTop: 2 },

  // Summary cards
  cardsRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  card: { flex: 1, borderRadius: 6, padding: 12, alignItems: "center" },
  cardGreen: { backgroundColor: "#f0fdf4", borderWidth: 1, borderColor: "#86efac" },
  cardRed: { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fca5a5" },
  cardLabel: { fontSize: 7, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  cardValueGreen: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#15803d" },
  cardValueRed: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#dc2626" },

  // Table
  table: { width: "100%" },
  // Header row 1 — group labels
  groupRow: { flexDirection: "row", paddingVertical: 4, paddingHorizontal: 3 },
  groupHeader: { backgroundColor: "#1e3a8a", borderRadius: 4, paddingVertical: 5, paddingHorizontal: 3, flexDirection: "row" },
  subHeader: { flexDirection: "row", paddingVertical: 3, paddingHorizontal: 3, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },

  tableRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 3, borderBottomWidth: 0.5, borderBottomColor: "#e2e8f0" },
  tableRowAlt: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 3, borderBottomWidth: 0.5, borderBottomColor: "#e2e8f0", backgroundColor: "#f8fafc" },
  tableFooter: { flexDirection: "row", backgroundColor: "#1e293b", borderRadius: 4, paddingVertical: 6, paddingHorizontal: 3, marginTop: 2 },

  thText: { color: "#ffffff", fontSize: 7, fontFamily: "Helvetica-Bold" },
  thSub: { fontSize: 6.5, fontFamily: "Helvetica-Bold" },
  tdText: { color: "#374151", fontSize: 7.5 },
  tdBold: { color: "#1a1a2e", fontSize: 7.5, fontFamily: "Helvetica-Bold" },
  tdSmall: { color: "#6b7280", fontSize: 6.5 },
  tfText: { color: "#ffffff", fontSize: 7.5, fontFamily: "Helvetica-Bold" },

  // Column widths
  cContract: { flex: 2.2 },
  cAn: { flex: 1.1, textAlign: "right" },
  cMois: { flex: 1, textAlign: "right" },
  cReduc: { flex: 2.2 },
  cSaving: { flex: 1.1, textAlign: "right" },

  colorOrange: { color: "#c2410c" },
  colorBlue: { color: "#1d4ed8" },
  colorGreen: { color: "#15803d" },
  colorRed: { color: "#dc2626" },
  bgOrange: { backgroundColor: "#fff7ed" },
  bgBlue: { backgroundColor: "#eff6ff" },
  bgGreen: { backgroundColor: "#f0fdf4" },

  disclaimer: {
    marginTop: 18,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#94a3b8",
  },
  disclaimerText: { fontSize: 7, color: "#64748b", lineHeight: 1.5 },

  footer: { position: "absolute", bottom: 20, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: "#94a3b8" },
});

interface Props {
  client: ClientInfo;
  results: ContractResult[];
}

export default function PdfDocument({ client, results }: Props) {
  const totalCurrentAnnual = results.reduce((s, r) => s + r.contract.currentAnnualPremium, 0);
  const totalProposedAnnual = results.reduce((s, r) => s + r.proposedAnnualAfterReduction, 0);
  const totalAnnualSaving = results.reduce((s, r) => s + r.annualSaving, 0);
  const totalMonthlySaving = totalAnnualSaving / 12;
  const totalCurrentMonthly = totalCurrentAnnual / 12;
  const totalProposedMonthly = totalProposedAnnual / 12;
  const isPositive = totalAnnualSaving >= 0;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Comparatif Assurance</Text>
            <Text style={styles.subtitle}>Analyse de vos contrats en cours</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.clientName}>{client.name}</Text>
            {client.company ? <Text style={styles.clientDetail}>{client.company}</Text> : null}
            <Text style={styles.clientDetail}>Date : {client.date}</Text>
            <Text style={styles.clientDetail}>Conseiller : {client.advisorName}</Text>
          </View>
        </View>

        {/* Summary cards */}
        <View style={styles.cardsRow}>
          <View style={[styles.card, isPositive ? styles.cardGreen : styles.cardRed]}>
            <Text style={styles.cardLabel}>Économie mensuelle</Text>
            <Text style={isPositive ? styles.cardValueGreen : styles.cardValueRed}>
              {formatEuro(totalMonthlySaving)}
            </Text>
          </View>
          <View style={[styles.card, isPositive ? styles.cardGreen : styles.cardRed]}>
            <Text style={styles.cardLabel}>Économie annuelle</Text>
            <Text style={isPositive ? styles.cardValueGreen : styles.cardValueRed}>
              {formatEuro(totalAnnualSaving)}
            </Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Main header */}
          <View style={styles.groupHeader}>
            <Text style={[styles.thText, styles.cContract]}>Contrat</Text>
            {/* Actuel */}
            <Text style={[styles.thText, styles.cAn, { color: "#fed7aa" }]}>/an Actuel</Text>
            <Text style={[styles.thText, styles.cMois, { color: "#fed7aa" }]}>/mois</Text>
            {/* Proposé */}
            <Text style={[styles.thText, styles.cAn, { color: "#bfdbfe" }]}>/an Proposé</Text>
            <Text style={[styles.thText, styles.cMois, { color: "#bfdbfe" }]}>/mois</Text>
            {/* Réduction */}
            <Text style={[styles.thText, styles.cReduc]}>Réduction accordée</Text>
            {/* Économie */}
            <Text style={[styles.thText, styles.cSaving, { color: "#bbf7d0" }]}>Économie/an</Text>
            <Text style={[styles.thText, styles.cMois, { color: "#bbf7d0" }]}>/mois</Text>
          </View>

          {/* Rows */}
          {results.map((r, i) => {
            const saving = r.annualSaving;
            const savingColor = saving >= 0 ? styles.colorGreen : styles.colorRed;
            return (
              <View key={r.contract.id} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <View style={styles.cContract}>
                  <Text style={styles.tdBold}>{r.contract.type || "—"}</Text>
                  <Text style={styles.tdSmall}>
                    {r.contract.currentInsurer
                      ? `${r.contract.currentInsurer}${r.contract.proposedInsurer ? " → " + r.contract.proposedInsurer : ""}`
                      : r.contract.proposedInsurer || ""}
                  </Text>
                </View>
                <Text style={[styles.tdText, styles.cAn]}>{formatEuro(r.contract.currentAnnualPremium)}</Text>
                <Text style={[styles.tdText, styles.cMois]}>{formatEuro(r.currentMonthly)}</Text>
                <Text style={[styles.tdBold, styles.cAn]}>{formatEuro(r.proposedAnnualAfterReduction)}</Text>
                <Text style={[styles.tdBold, styles.cMois]}>{formatEuro(r.proposedMonthlyAfterReduction)}</Text>
                <Text style={[styles.tdText, styles.cReduc, { color: "#1d4ed8", fontSize: 7 }]}>
                  {formatReduction(r.contract)}
                </Text>
                <Text style={[styles.tdBold, styles.cSaving, savingColor]}>{formatEuro(saving)}</Text>
                <Text style={[styles.tdBold, styles.cMois, savingColor]}>{formatEuro(r.monthlySaving)}</Text>
              </View>
            );
          })}

          {/* Footer */}
          <View style={styles.tableFooter}>
            <Text style={[styles.tfText, styles.cContract]}>TOTAL</Text>
            <Text style={[styles.tfText, styles.cAn]}>{formatEuro(totalCurrentAnnual)}</Text>
            <Text style={[styles.tfText, styles.cMois]}>{formatEuro(totalCurrentMonthly)}</Text>
            <Text style={[styles.tfText, styles.cAn]}>{formatEuro(totalProposedAnnual)}</Text>
            <Text style={[styles.tfText, styles.cMois]}>{formatEuro(totalProposedMonthly)}</Text>
            <Text style={[styles.tfText, styles.cReduc]}></Text>
            <Text style={[styles.tfText, styles.cSaving, { color: isPositive ? "#86efac" : "#fca5a5" }]}>
              {formatEuro(totalAnnualSaving)}
            </Text>
            <Text style={[styles.tfText, styles.cMois, { color: isPositive ? "#86efac" : "#fca5a5" }]}>
              {formatEuro(totalMonthlySaving)}
            </Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Document NON CONTRACTUEL — Sous réserve de la validation globale des devis et de l'acceptation des compagnies d'assurance concernées. Les tarifs indiqués sont donnés à titre indicatif et peuvent être modifiés sans préavis. Ce document ne constitue pas une offre contractuelle.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Comparatif établi le {client.date} par {client.advisorName}</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
