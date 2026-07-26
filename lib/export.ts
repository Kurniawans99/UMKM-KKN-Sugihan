import * as XLSX from "xlsx";

/**
 * Export a single dataset array to a .xlsx Excel file
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  fileName: string = "export_data",
  sheetName: string = "Data"
) {
  if (!data || data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

/**
 * Export multiple datasets into a single .xlsx Excel workbook with multiple sheets
 */
export function exportMultiSheetExcel(
  sheets: { sheetName: string; data: Record<string, any>[] }[],
  fileName: string = "export_data"
) {
  if (!sheets || sheets.length === 0) return;

  const workbook = XLSX.utils.book_new();

  sheets.forEach(({ sheetName, data }) => {
    const worksheet = XLSX.utils.json_to_sheet(data && data.length > 0 ? data : [{ Info: "Tidak ada data" }]);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
