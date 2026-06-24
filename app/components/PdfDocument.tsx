"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { ClientInfo, ContractResult } from "../types";
import { formatEuro, formatReduction } from "../utils";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: 40,
    color: "#1a1a2e",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a8a",
    paddingBottom: 16,
  },
  headerLeft: { flexDirection: "column" },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#1e3a8a", marginBottom: 2 },
  subtitle: { fontSize: 10, color: "#64748b" },
  headerRight: { flexDirection: "column", alignItems: "flex-end" },
  clientName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#1a1a2e" },
  clientDetail: { fontSize: 9, color: "#64748b", marginTop: 2 },

  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a8a",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },

  table: { width: "100%" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e3a8a",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  tableFooter: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 4,
    marginTop: 2,
  },
  thText: { color: "#ffffff", fontSize: 7, fontFamily: "Helvetica-Bold" },
  tdText: { color: "#374151", fontSize: 8 },
  tdBold: { color: "#1a1a2e", fontSize: 8, fontFamily: "Helvetica-Bold" },
  tfText: { color: "#ffffff", fontSize: 8, fontFamily: "Helvetica-Bold" },

  col1: { flex: 2 },
  col2: { flex: 1.2, textAlign: "right" },
  col3: { flex: 1, textAlign: "right" },
  col4: { flex: 1.2, textAlign: "right" },
  col5: { flex: 1, textAlign: "right" },
  col6: { flex: 1.2, textAlign: "right" },
  col7: { flex: 1, textAlign: "right" },

  cardsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  cardGreen: { backgroundColor: "#f0fdf4", borderWidth: 1, borderColor: "#86efac" },
  cardRed: { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fca5a5" },
  cardLabel: { fontSize: 7, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  cardValueGreen: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#15803d" },
  cardValueRed: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#dc2626" },

  disclaimer: {
    marginTop: 24,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#94a3b8",
  },
  disclaimerText: { fontSize: 7, color: "#64748b", lineHeight: 1.5 },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 7, color: "#94a3b8" },

  savingGreen: { color: "#15803d", fontFamily: "Helvetica-Bold", fontSize: 8 },
  savingRed: { color: "#dc2626", fontFamily: "Helvetica-Bold", fontSize: 8 },
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
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Comparatif Assurance</Text>
            <Text style={styles.subtitle}>Analyse de vos contrats en cours</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.clientName}>{client.name}</Text>
            {client.company ? (
              <Text style={styles.clientDetail}>{client.company}</Text>
            ) : null}
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
          <View style={[styles.card, isPositive ? styles.cardGreen : styles.cardRed]}>
            <Text style={styles.cardLabel}>Gain projeté sur 3 ans</Text>
            <Text style={isPositive ? styles.cardValueGreen : styles.cardValueRed}>
              {formatEuro(totalAnnualSaving * 3)}
            </Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail par contrat</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.thText, styles.col1]}>Contrat</Text>
              <Text style={[styles.thText, styles.col2]}>Actuel / an</Text>
              <Text style={[styles.thText, styles.col3]}>/ mois</Text>
              <Text style={[styles.thText, styles.col4]}>Réduction</Text>
              <Text style={[styles.thText, styles.col2]}>Proposé / an</Text>
              <Text style={[styles.thText, styles.col3]}>/ mois</Text>
              <Text style={[styles.thText, styles.col2]}>Économie / an</Text>
              <Text style={[styles.thText, styles.col3]}>/ mois</Text>
            </View>

            {results.map((r, i) => {
              const saving = r.annualSaving;
              const savingStyle = saving >= 0 ? styles.savingGreen : styles.savingRed;
              return (
                <View key={r.contract.id} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={[styles.tdBold, styles.col1]}>{r.contract.type || "—"}</Text>
                  <Text style={[styles.tdText, styles.col2]}>
                    {formatEuro(r.contract.currentAnnualPremium)}
                  </Text>
                  <Text style={[styles.tdText, styles.col3]}>
                    {formatEuro(r.currentMonthly)}
                  </Text>
                  <Text style={[styles.tdText, { ...styles.col4, color: "#1d4ed8" }]}>
                    {formatReduction(r.contract)}
                  </Text>
                  <Text style={[styles.tdBold, styles.col2]}>
                    {formatEuro(r.proposedAnnualAfterReduction)}
                  </Text>
                  <Text style={[styles.tdBold, styles.col3]}>
                    {formatEuro(r.proposedMonthlyAfterReduction)}
                  </Text>
                  <Text style={[savingStyle, styles.col2]}>{formatEuro(saving)}</Text>
                  <Text style={[savingStyle, styles.col3]}>{formatEuro(r.monthlySaving)}</Text>
                </View>
              );
            })}

            <View style={styles.tableFooter}>
              <Text style={[styles.tfText, styles.col1]}>TOTAL</Text>
              <Text style={[styles.tfText, styles.col2]}>{formatEuro(totalCurrentAnnual)}</Text>
              <Text style={[styles.tfText, styles.col3]}>{formatEuro(totalCurrentMonthly)}</Text>
              <Text style={[styles.tfText, styles.col4]}></Text>
              <Text style={[styles.tfText, styles.col2]}>{formatEuro(totalProposedAnnual)}</Text>
              <Text style={[styles.tfText, styles.col3]}>{formatEuro(totalProposedMonthly)}</Text>
              <Text style={[{ ...styles.tfText, color: isPositive ? "#86efac" : "#fca5a5" }, styles.col2]}>
                {formatEuro(totalAnnualSaving)}
              </Text>
              <Text style={[{ ...styles.tfText, color: isPositive ? "#86efac" : "#fca5a5" }, styles.col3]}>
                {formatEuro(totalMonthlySaving)}
              </Text>
            </View>
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
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} / ${totalPages}`
          } />
        </View>
      </Page>
    </Document>
  );
}
