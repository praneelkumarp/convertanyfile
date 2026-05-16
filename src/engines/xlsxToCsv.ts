import * as XLSX from "xlsx";

export async function convertXlsxToCsv(file: File): Promise<Blob> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const csv = XLSX.utils.sheet_to_csv(sheet);

  return new Blob([csv], { type: "text/csv" });
}
