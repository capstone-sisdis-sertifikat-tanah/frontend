export interface DokumenDetailsResponse {
  id: string;
  pembeli: Pembeli;
  penjual: Penjual;
  status: DokumenStatus;
  approvers: string[];
  sertifikat: Sertifikat;
  TxId: string[];
  signatures: Array<{
    signature: string;
    signTime: string;
  }>;
}

export type DokumenStatus = "Menunggu Persetujuan Bank" | "Menunggu Persetujuan Notaris" | "Approve" | "reject";

export interface Pembeli {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Penjual {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Sertifikat {
  id: string;
  idPemilik: string;
  idAkta: string;
  lat: string;
  long: string;
  lokasi: string;
}
