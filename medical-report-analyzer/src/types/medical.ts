export interface MedicalIndicator {
  id: string;
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'warning';
}

export interface AnalyzedResult {
  id: string;
  fileName: string;
  uploadedAt: string;
  indicators: MedicalIndicator[];
  rawText: string;
}

export interface UploadResponse {
  fileKey: string;
  fileName: string;
  fileUrl?: string;
}