import { useMutation } from "@/hooks/use-mutation";
import { Dialog, DialogPanel, Button } from "@tremor/react";
import React from "react";
import { toast } from "sonner";

import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sertifikatInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 40,
  },
  sertifikatInfoItem: {
    width: "50%",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  itemDescription: {
    width: "70%",
  },
  itemAmount: {
    width: "30%",
    textAlign: "right",
  },
  totalAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

// Sample sertifikat data
const sertifikatData = {
  sertifikatNumber: "INV-001",
  sertifikatDate: "April 26, 2024",
  dueDate: "May 10, 2024",
  companyName: "ABC Company",
  companyAddress: "123 Main Street, Cityville, ABC",
  clientName: "XYZ Corporation",
  clientAddress: "456 Oak Avenue, Townsville, XYZ",
  items: [
    { description: "Product A", amount: 100 },
    { description: "Product B", amount: 150 },
    { description: "Product C", amount: 200 },
  ],
  totalAmount: 450,
};

export function SertifikatPDF({ identifier }: { identifier: string }) {
  return (
    <Document title={identifier}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerText}>INVOICE</Text>
          <View style={styles.sertifikatInfo}>
            <View style={styles.sertifikatInfoItem}>
              <Text>Sertifikat #: {sertifikatData.sertifikatNumber}</Text>
              <Text>Date: {sertifikatData.sertifikatDate}</Text>
            </View>
            <View style={styles.sertifikatInfoItem}>
              <Text>Due Date: {sertifikatData.dueDate}</Text>
              <Text>Client: {sertifikatData.clientName}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text>From: {sertifikatData.companyName}</Text>
          <Text>{sertifikatData.companyAddress}</Text>
        </View>
        <View style={styles.section}>
          <Text>To: {sertifikatData.clientName}</Text>
          <Text>{sertifikatData.clientAddress}</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.item}>
            <Text style={styles.itemDescription}>Description</Text>
            <Text style={styles.itemAmount}>Amount</Text>
          </View>
          {sertifikatData.items.map((item, index) => (
            <View style={styles.item} key={index}>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemAmount}>${item.amount}</Text>
            </View>
          ))}
        </View>
        <View style={styles.totalAmount}>
          <Text>Total:</Text>
          <Text>${sertifikatData.totalAmount}</Text>
        </View>
      </Page>
    </Document>
  );
}

export function SertifikatPreview({ identifier }: { identifier: string }) {
  return (
    <PDFViewer className="w-full h-[calc(100dvh-140px)]">
      <SertifikatPDF identifier={identifier} />
    </PDFViewer>
  );
}

export function SertifikatTanah({ id }: { id: string }) {
  const { trigger, data, isMutating } = useMutation(`/company/shipment/identifier/${id}`);

  const identifier = data?.data?.data?.shipment as string;

  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button
        variant="light"
        loading={isMutating}
        className="font-medium text-tremor-brand hover:text-tremor-brand-emphasis"
        onClick={async () => {
          try {
            if (!data) {
              await trigger();
            }

            setIsOpen(true);
          } catch (e) {
            toast.error("Gagal memuat sertifikat.");
          }
        }}
      >
        Lihat
      </Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} static={true} className="z-[100]">
        <DialogPanel className="sm:max-w-2xl grid gap-4">
          <SertifikatPreview identifier={identifier} />
          <div className="flex justify-end">
            <PDFDownloadLink document={<SertifikatPDF identifier={identifier} />} fileName="sertifikat-tanah.pdf">
              {({ blob, url, loading, error }) => (
                <Button className="rounded-tremor-small">{loading ? "Memuat sertifikat..." : "Unduh"}</Button>
              )}
            </PDFDownloadLink>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
