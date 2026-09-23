export type PhotoStatus = 'LIVE_APPROVED' | 'PRIVATE_ARCHIVE' | 'REJECTED';

export interface PhotoSubmission {
  id: string;
  url: string;
  guestName: string;
  tableId: string;
  tableName: string;
  timestamp: string;
  status: PhotoStatus;
  caption: string;
  messageToCouples?: string;
  likesCount: number;
}

export interface TableInfo {
  id: string;
  number: number;
  name: string;
  qrCodeUrl: string;
  guestCount?: number;
}

export interface EventStats {
  totalPhotosSubmitted: number;
  liveApprovedCount: number;
  privateArchiveCount: number;
  mostActiveTable: string;
}
