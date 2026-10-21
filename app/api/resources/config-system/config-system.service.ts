// Copyright (c) 2026-04-07
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { SystemConfigDto } from "../../dto/ConfigSystem/ConfigSystem";
import { databaseService } from "../../providers/database/DatabaseService";

class ConfigSystemService {
  private databaseService = databaseService;

  async findAll(): Promise<SystemConfigDto[]> {
    return await this.databaseService.systemConfig.findMany();
  }

  async update(data: SystemConfigDto) {
    const config = await databaseService.systemConfig.findFirst();

    if (!config) {
      throw new Error("Configuração do sistema não encontrada.");
    }

    return databaseService.systemConfig.update({
      where: {
        id: config.id,
      },
      data,
    });
  }

  async createBackup(): Promise<Buffer> {
    const tables = await this.databaseService.$queryRaw<
      { table_schema: string; table_name: string }[]
    >`
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;

    const backupTables = [];

    for (const table of tables) {
      const columns = await this.databaseService.$queryRawUnsafe<
        {
          column_name: string;
          data_type: string;
          is_nullable: string;
          column_default: string | null;
          ordinal_position: number;
        }[]
      >(
        `SELECT column_name, data_type, is_nullable, column_default, ordinal_position
       FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = $2
       ORDER BY ordinal_position`,
        table.table_schema,
        table.table_name,
      );

      const rows = await this.databaseService.$queryRawUnsafe<
        Record<string, unknown>[]
      >(
        `SELECT * FROM "${table.table_schema.replace(/"/g, '""')}"."${table.table_name.replace(/"/g, '""')}"`,
      );

      backupTables.push({
        name: table.table_name,
        schema: table.table_schema,
        columns,
        rows,
      });
    }

    const backup = {
      format: "contabilidade-json-backup",
      version: 1,
      createdAt: new Date().toISOString(),
      tables: backupTables,
    };

    return Buffer.from(
      JSON.stringify(
        backup,
        (_key, value) => (typeof value === "bigint" ? value.toString() : value),
        2,
      ),
      "utf-8",
    );
  }

  async restoreBackup(file: File): Promise<void> {
    const content = await file.text();

    let backup: {
      format?: string;
      version?: number;
      tables?: Array<{
        name: string;
        schema: string;
        rows: Record<string, unknown>[];
      }>;
    };

    try {
      backup = JSON.parse(content);
    } catch {
      throw new Error("O arquivo de backup não contém um JSON válido.");
    }

    if (
      !backup ||
      backup.format !== "contabilidade-json-backup" ||
      backup.version !== 1 ||
      !Array.isArray(backup.tables)
    ) {
      throw new Error("Formato de arquivo de backup inválido ou incompatível.");
    }

    const backupTables = backup.tables;

    await this.databaseService.$transaction(
      async (tx) => {
        const databaseTables = await tx.$queryRaw<
          Array<{ table_schema: string; table_name: string }>
        >`
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
          AND table_name <> '_prisma_migrations'
        ORDER BY table_name
      `;

        const tableKey = (schema: string, name: string) => `${schema}.${name}`;

        const quoteIdentifier = (value: string) =>
          `"${value.replace(/"/g, '""')}"`;

        const existingTables = new Set(
          databaseTables.map((table) =>
            tableKey(table.table_schema, table.table_name),
          ),
        );

        const validBackupTables = backupTables.filter(
          (table) =>
            table.schema === "public" && table.name !== "_prisma_migrations",
        );

        const backupTableNames = new Set<string>();

        for (const table of validBackupTables) {
          if (
            !table ||
            typeof table.name !== "string" ||
            typeof table.schema !== "string"
          ) {
            throw new Error(
              "O backup contém uma definição de tabela inválida.",
            );
          }

          const key = tableKey(table.schema, table.name);

          if (!existingTables.has(key)) {
            throw new Error(`Tabela inexistente no banco: ${table.name}`);
          }

          if (backupTableNames.has(key)) {
            throw new Error(`Tabela duplicada no backup: ${table.name}`);
          }

          if (!Array.isArray(table.rows)) {
            throw new Error(`Registros inválidos na tabela ${table.name}.`);
          }

          backupTableNames.add(key);
        }

        for (const key of existingTables) {
          if (!backupTableNames.has(key)) {
            throw new Error(
              `O backup está incompleto. Não foram encontrados dados para a tabela ${key}.`,
            );
          }
        }

        const columns = await tx.$queryRaw<
          Array<{
            table_schema: string;
            table_name: string;
            column_name: string;
            data_type: string;
            udt_schema: string;
            udt_name: string;
            ordinal_position: number;
          }>
        >`
        SELECT
          table_schema,
          table_name,
          column_name,
          data_type,
          udt_schema,
          udt_name,
          ordinal_position
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position
      `;

        const columnsByTable = new Map<string, typeof columns>();

        for (const column of columns) {
          const key = tableKey(column.table_schema, column.table_name);
          const current = columnsByTable.get(key) ?? [];

          current.push(column);
          columnsByTable.set(key, current);
        }

        for (const table of validBackupTables) {
          const key = tableKey(table.schema, table.name);
          const validColumns = new Set(
            (columnsByTable.get(key) ?? []).map((column) => column.column_name),
          );

          for (const row of table.rows) {
            if (!row || typeof row !== "object" || Array.isArray(row)) {
              throw new Error(`Registro inválido na tabela ${table.name}.`);
            }

            for (const column of Object.keys(row)) {
              if (!validColumns.has(column)) {
                throw new Error(`Coluna inexistente: ${table.name}.${column}`);
              }
            }
          }
        }

        const dependencies = await tx.$queryRaw<
          Array<{
            child_schema: string;
            child: string;
            parent_schema: string;
            parent: string;
          }>
        >`
        SELECT
          child_schema.nspname AS child_schema,
          child.relname AS child,
          parent_schema.nspname AS parent_schema,
          parent.relname AS parent
        FROM pg_constraint constraint_info
        JOIN pg_class child
          ON child.oid = constraint_info.conrelid
        JOIN pg_namespace child_schema
          ON child_schema.oid = child.relnamespace
        JOIN pg_class parent
          ON parent.oid = constraint_info.confrelid
        JOIN pg_namespace parent_schema
          ON parent_schema.oid = parent.relnamespace
        WHERE constraint_info.contype = 'f'
          AND child_schema.nspname = 'public'
          AND parent_schema.nspname = 'public'
      `;

        const ordered: typeof validBackupTables = [];
        const remaining = new Set(
          validBackupTables.map((table) => tableKey(table.schema, table.name)),
        );

        const backupTableMap = new Map(
          validBackupTables.map((table) => [
            tableKey(table.schema, table.name),
            table,
          ]),
        );

        while (remaining.size > 0) {
          const ready = [...remaining].filter((key) =>
            dependencies
              .filter(
                (dependency) =>
                  tableKey(dependency.child_schema, dependency.child) === key,
              )
              .every((dependency) => {
                const parentKey = tableKey(
                  dependency.parent_schema,
                  dependency.parent,
                );

                return (
                  !backupTableNames.has(parentKey) || !remaining.has(parentKey)
                );
              }),
          );

          if (ready.length === 0) {
            throw new Error(
              "Não foi possível ordenar as tabelas devido a dependências circulares entre chaves estrangeiras.",
            );
          }

          for (const key of ready) {
            const table = backupTableMap.get(key);

            if (table) {
              ordered.push(table);
            }

            remaining.delete(key);
          }
        }

        const truncateTables = databaseTables
          .map(
            (table) =>
              `${quoteIdentifier(table.table_schema)}.${quoteIdentifier(table.table_name)}`,
          )
          .join(", ");

        if (truncateTables) {
          await tx.$executeRawUnsafe(
            `TRUNCATE TABLE ${truncateTables} RESTART IDENTITY CASCADE`,
          );
        }

        for (const table of ordered) {
          const key = tableKey(table.schema, table.name);
          const tableIdentifier = `${quoteIdentifier(table.schema)}.${quoteIdentifier(table.name)}`;

          const tableColumns = columnsByTable.get(key) ?? [];
          const columnsByName = new Map(
            tableColumns.map((column) => [column.column_name, column]),
          );

          for (const row of table.rows) {
            const rowColumns = Object.keys(row);

            if (rowColumns.length === 0) {
              await tx.$executeRawUnsafe(
                `INSERT INTO ${tableIdentifier} DEFAULT VALUES`,
              );
              continue;
            }

            const columnList = rowColumns.map(quoteIdentifier).join(", ");

            const placeholders = rowColumns
              .map((name, index) => {
                const column = columnsByName.get(name);
                const parameter = `$${index + 1}`;

                if (!column) {
                  throw new Error(`Coluna inválida: ${table.name}.${name}`);
                }

                if (
                  column.data_type === "USER-DEFINED" ||
                  column.data_type === "ARRAY"
                ) {
                  return `${parameter}::${quoteIdentifier(column.udt_schema)}.${quoteIdentifier(column.udt_name)}`;
                }

                switch (column.data_type) {
                  case "timestamp without time zone":
                    return `${parameter}::timestamp without time zone`;

                  case "timestamp with time zone":
                    return `${parameter}::timestamptz`;

                  case "date":
                    return `${parameter}::date`;

                  case "time without time zone":
                    return `${parameter}::time`;

                  case "time with time zone":
                    return `${parameter}::timetz`;

                  case "json":
                    return `${parameter}::json`;

                  case "jsonb":
                    return `${parameter}::jsonb`;

                  case "numeric":
                  case "decimal":
                    return `${parameter}::numeric`;

                  case "real":
                    return `${parameter}::real`;

                  case "double precision":
                    return `${parameter}::double precision`;

                  case "integer":
                    return `${parameter}::integer`;

                  case "bigint":
                    return `${parameter}::bigint`;

                  case "smallint":
                    return `${parameter}::smallint`;

                  case "boolean":
                    return `${parameter}::boolean`;

                  default:
                    return parameter;
                }
              })
              .join(", ");

            const values = rowColumns.map((name) => {
              const column = columnsByName.get(name);

              if (!column) {
                throw new Error(`Coluna inválida: ${table.name}.${name}`);
              }

              const value = row[name];

              if (value === null || value === undefined) {
                return null;
              }

              if (column.data_type === "json" || column.data_type === "jsonb") {
                return JSON.stringify(value);
              }

              if (
                column.data_type === "bytea" &&
                typeof value === "object" &&
                value !== null &&
                "type" in value &&
                value.type === "Buffer" &&
                "data" in value &&
                Array.isArray(value.data)
              ) {
                return Buffer.from(value.data as number[]);
              }

              if (column.data_type === "ARRAY" && Array.isArray(value)) {
                return value;
              }

              if (typeof value === "bigint") {
                return value.toString();
              }

              return value;
            });

            await tx.$executeRawUnsafe(
              `INSERT INTO ${tableIdentifier} (${columnList}) VALUES (${placeholders})`,
              ...values,
            );
          }
        }

        const sequences = await tx.$queryRaw<
          Array<{
            table_name: string;
            column_name: string;
            sequence_name: string;
          }>
        >`
        SELECT
          table_info.table_name,
          column_info.column_name,
          pg_get_serial_sequence(
            format('%I.%I', table_info.table_schema, table_info.table_name),
            column_info.column_name
          ) AS sequence_name
        FROM information_schema.tables table_info
        JOIN information_schema.columns column_info
          ON column_info.table_schema = table_info.table_schema
          AND column_info.table_name = table_info.table_name
        WHERE table_info.table_schema = 'public'
          AND table_info.table_type = 'BASE TABLE'
          AND pg_get_serial_sequence(
            format('%I.%I', table_info.table_schema, table_info.table_name),
            column_info.column_name
          ) IS NOT NULL
      `;

        for (const sequence of sequences) {
          if (!backupTableNames.has(tableKey("public", sequence.table_name))) {
            continue;
          }

          const tableIdentifier = `${quoteIdentifier("public")}.${quoteIdentifier(sequence.table_name)}`;
          const columnIdentifier = quoteIdentifier(sequence.column_name);

          await tx.$queryRawUnsafe(
            `SELECT setval(
            $1::regclass,
            COALESCE(
              (SELECT MAX(${columnIdentifier}) FROM ${tableIdentifier}),
              1
            ),
            EXISTS (SELECT 1 FROM ${tableIdentifier})
          )`,
            sequence.sequence_name,
          );
        }
      },
      {
        timeout: 120000,
      },
    );
  }
}

export const configSystemService = new ConfigSystemService();
