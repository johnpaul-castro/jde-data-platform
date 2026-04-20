'use client'

import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 9, color: '#1a1a2e' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: '#1e3a5f' },
  companyName: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#1e3a5f' },
  companyTagline: { fontSize: 8, color: '#666', marginTop: 2 },
  companyContact: { fontSize: 8, color: '#444', marginTop: 2 },
  docTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#1e3a5f', textAlign: 'right' },
  docNumber: { fontSize: 10, color: '#444', textAlign: 'right', marginTop: 4 },
  docDate: { fontSize: 8, color: '#666', textAlign: 'right', marginTop: 2 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, paddingBottom: 2, borderBottomWidth: 0.5, borderBottomColor: '#ccc' },
  addressBox: { backgroundColor: '#f5f7fa', padding: 8, borderRadius: 3 },
  addressName: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  addressLine: { fontSize: 8, color: '#444', marginBottom: 1 },
  row2col: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },
  table: { marginTop: 4 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1e3a5f', padding: '5 8', marginBottom: 0 },
  tableHeaderText: { color: 'white', fontFamily: 'Helvetica-Bold', fontSize: 8 },
  tableRow: { flexDirection: 'row', padding: '5 8', borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0' },
  tableRowAlt: { flexDirection: 'row', padding: '5 8', backgroundColor: '#f9f9f9', borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0' },
  tableText: { fontSize: 8, color: '#333' },
  colLine: { width: '6%' },
  colPart: { width: '16%' },
  colDesc: { width: '32%' },
  colUom: { width: '8%' },
  colQtyOrd: { width: '10%', textAlign: 'right' },
  colQtyShip: { width: '10%', textAlign: 'right' },
  colPrice: { width: '10%', textAlign: 'right' },
  colExt: { width: '12%', textAlign: 'right' },
  totalsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#1e3a5f' },
  totalLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1e3a5f', marginRight: 8 },
  totalValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1e3a5f', width: 80, textAlign: 'right' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTopWidth: 0.5, borderTopColor: '#ccc', paddingTop: 6, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 7, color: '#999' },
})

function PackingSlipDoc({ order, customer }: { order: any, customer: any }) {
  const orderTotal = order.lines.reduce((sum: number, l: any) => sum + Number(l.extended_amount), 0)
  const orderDate = new Date(order.header.date_transaction).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const reqDate = new Date(order.header.date_requested).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>JPC Enterprises</Text>
            <Text style={styles.companyTagline}>Aerospace Parts Distribution</Text>
            <Text style={styles.companyContact}>Cleveland, TN 37312  |  johnpaulcastro@gmail.com</Text>
            <Text style={styles.companyContact}>jpcenterprises.com</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>PACKING SLIP</Text>
            <Text style={styles.docNumber}>Order # {order.header.order_id}</Text>
            <Text style={styles.docDate}>Order Date: {orderDate}</Text>
            <Text style={styles.docDate}>Requested: {reqDate}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.row2col]}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Ship To</Text>
            <View style={styles.addressBox}>
              <Text style={styles.addressName}>{customer.address_name}</Text>
              <Text style={styles.addressLine}>{customer.address_line_1}</Text>
              {customer.address_line_2 ? <Text style={styles.addressLine}>{customer.address_line_2}</Text> : null}
              <Text style={styles.addressLine}>{customer.city}, {customer.state} {customer.zip}</Text>
              <Text style={styles.addressLine}>{customer.country}</Text>
              <Text style={styles.addressLine}>Phone: {customer.phone}</Text>
            </View>
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Ship From</Text>
            <View style={styles.addressBox}>
              <Text style={styles.addressName}>JPC Enterprises</Text>
              <Text style={styles.addressLine}>100 Commerce Drive</Text>
              <Text style={styles.addressLine}>Cleveland, TN 37312</Text>
              <Text style={styles.addressLine}>US</Text>
              <Text style={styles.addressLine}>johnpaulcastro@gmail.com</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Lines</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colLine]}>Line</Text>
              <Text style={[styles.tableHeaderText, styles.colPart]}>Part #</Text>
              <Text style={[styles.tableHeaderText, styles.colDesc]}>Description</Text>
              <Text style={[styles.tableHeaderText, styles.colUom]}>UOM</Text>
              <Text style={[styles.tableHeaderText, styles.colQtyOrd]}>Qty Ord</Text>
              <Text style={[styles.tableHeaderText, styles.colQtyShip]}>Qty Ship</Text>
              <Text style={[styles.tableHeaderText, styles.colPrice]}>Unit Price</Text>
              <Text style={[styles.tableHeaderText, styles.colExt]}>Extended</Text>
            </View>
            {order.lines.map((line: any, i: number) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableText, styles.colLine]}>{line.line_number}</Text>
                <Text style={[styles.tableText, styles.colPart]}>{line.item_number}</Text>
                <View style={styles.colDesc}>
                  <Text style={styles.tableText}>{line.item_description}</Text>
                  {line.item_description_2 ? <Text style={[styles.tableText, { color: '#888' }]}>{line.item_description_2}</Text> : null}
                </View>
                <Text style={[styles.tableText, styles.colUom]}>{line.unit_of_measure}</Text>
                <Text style={[styles.tableText, styles.colQtyOrd]}>{Number(line.quantity_ordered).toLocaleString()}</Text>
                <Text style={[styles.tableText, styles.colQtyShip]}>{Number(line.quantity_shipped).toLocaleString()}</Text>
                <Text style={[styles.tableText, styles.colPrice]}>${Number(line.unit_price).toFixed(2)}</Text>
                <Text style={[styles.tableText, styles.colExt]}>${Number(line.extended_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
              </View>
            ))}
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalLabel}>ORDER TOTAL:</Text>
            <Text style={styles.totalValue}>${orderTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>JPC Enterprises — jpcenterprises.com — Confidential</Text>
          <Text style={styles.footerText}>Generated: {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function downloadPackingSlip(order: any, customer: any) {
  const blob = await pdf(<PackingSlipDoc order={order} customer={customer} />).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `PackingSlip_${order.header.order_id}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
