// Copyright (c) 2026-05-22
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import XLSX from "xlsx";

type ReadExcelOptions<T> = {
  /**
   * Linha inicial do Excel
   *
   * Ex:
   * 4
   */
  startRow: number;

  /**
   * Quantidade de linhas
   *
   * Ex:
   * 234
   */
  totalRows: number;

  /**
   * Colunas desejadas
   *
   * Ex:
   * {
   *   name: "A",
   *   code: "C",
   * }
   */
  columns: Record<keyof T, string>;
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function columnToIndex(column: string) {
  return alphabet.indexOf(column.toUpperCase());
}

export function readExcel<T>({
  startRow,
  totalRows,
  columns,
}: ReadExcelOptions<T>): T[] {
  /**
   * arquivo fixo na raiz do projeto
   *
   * projeto/
   *  ├─ clientes.xls
   */

  const workbook = XLSX.readFile("clientes.xls");

  const sheetName = workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
  });

  const data: T[] = [];

  for (let i = startRow - 1; i < startRow - 1 + totalRows; i++) {
    const row: any = rows[i];

    if (!row) continue;

    const item: any = {};

    for (const key in columns) {
      const columnLetter = columns[key];

      const columnIndex = columnToIndex(columnLetter);

      item[key] = row[columnIndex];
    }

    data.push(item);
  }

  return data;
}
