export interface AktaTanahResponse {
  id: string;
  pembeli: User;
  penjual: User;
  dokumen: Dokumen;
  status: AktaTanahStatus;
  approvers: string[];
  TxId: string[];
  signatures: Array<{
    signature: string;
    signTime: string;
  }>;
}

export type AktaTanahStatus =
  | "Menunggu Persetujuan Penjual"
  | "Menunggu Persetujuan Pembeli"
  | "Approve"
  | "reject"
  | "Sudah Tidak Berlaku";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Dokumen {
  id: string;
  pembeli: User;
  penjual: User;
  status: string;
  approvers: string[];
  idSertifikat: string;
}
