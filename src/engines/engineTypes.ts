export interface EngineResult {
  success: boolean;
  files: { blob: Blob; name: string }[];
  error?: string;
}
