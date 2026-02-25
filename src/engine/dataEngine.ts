import * as XLSX from 'xlsx';

/**
 * Data Engine - Converters for Excel, CSV, and JSON
 */

export async function excelToJson(file: File): Promise<string> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    return JSON.stringify(json, null, 2);
}

export async function jsonToExcel(jsonStr: string): Promise<string> {
    try {
        const json = JSON.parse(jsonStr);
        const worksheet = XLSX.utils.json_to_sheet(Array.isArray(json) ? json : [json]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        return URL.createObjectURL(blob);
    } catch (e) {
        throw new Error('Invalid JSON format');
    }
}
