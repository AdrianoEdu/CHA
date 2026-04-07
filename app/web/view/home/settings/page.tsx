// Copyright (c) 2026-04-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { SystemConfigDto } from "@/app/web/dto/config-system.dto";
import { configSystemService } from "@/app/web/services/configSystemService/configSystemService";
import { useEffect, useState } from "react";

function validateIntervalHours(value: any) {
  if (value === "" || value === undefined) {
    return { valid: true, value: undefined };
  }

  const num = Number(value);

  if (!Number.isInteger(num)) {
    return { valid: false, message: "Valor inválido" };
  }

  if (num < 1 || num > 12) {
    return { valid: false, message: "Intervalo deve ser entre 1 e 12 horas" };
  }

  return { valid: true, value: num };
}

function validateRunHour(value: any) {
  if (value === "" || value === undefined) {
    return { valid: true, value: undefined };
  }

  const num = Number(value);

  if (!Number.isInteger(num)) {
    return { valid: false, message: "Valor inválido" };
  }

  if (num < 0 || num > 23) {
    return { valid: false, message: "Horário deve ser entre 0 e 23" };
  }

  return { valid: true, value: num };
}

export default function SystemConfigPage() {
  const [config, setConfig] = useState<SystemConfigDto>({
    enabled: true,
  });

  useEffect(() => {
    handleGetSystemConfigStatus();
  }, []);

  const handleGetSystemConfigStatus = async (): Promise<void> => {
    const [configSystem] = await configSystemService.get();

    setConfig(configSystem);
  };

  const handleSave = () => {
    const interval = validateIntervalHours(config.intervalHours);
    const hour = validateRunHour(config.runAtHour);

    if (!interval.valid) {
      alert(interval.message);
      return;
    }

    if (!hour.valid) {
      alert(hour.message);
      return;
    }

    if (interval.value === null && hour.value === null) {
      alert("Informe um intervalo OU um horário fixo");
      return;
    }

    configSystemService.update(config).then(() => {
      alert("Configuração de backup atualizada com sucesso!");
    });
  };

  const handleBackupNow = () => {
    console.log("Executando backup manual...");
    alert("Backup iniciado!");

    setConfig((prev) => ({
      ...prev,
      lastBackupAt: new Date().toISOString(),
    }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Backup do Sistema</h2>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                enabled: e.target.checked,
              }))
            }
          />
          Executar backup
        </label>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Configuração de Execução</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1">Intervalo (1 a 12 horas)</label>
            <input
              type="number"
              min={1}
              max={12}
              className="w-full border rounded p-2"
              value={config.intervalHours ?? ""}
              onChange={(e) => {
                const result = validateIntervalHours(e.target.value);

                if (result.valid) {
                  setConfig((prev) => ({
                    ...prev,
                    intervalHours: result.value,
                    runAtHour: undefined,
                  }));
                }
              }}
            />
          </div>

          <div className="text-center text-gray-400 text-sm">OU</div>

          <div>
            <label className="block mb-1">
              Executar em horário fixo (0 a 23)
            </label>
            <input
              type="number"
              min={0}
              max={23}
              className="w-full border rounded p-2"
              value={config.runAtHour ?? ""}
              onChange={(e) => {
                const result = validateRunHour(e.target.value);

                if (result.valid) {
                  setConfig((prev) => ({
                    ...prev,
                    runAtHour: result.value,
                    intervalHours: undefined,
                  }));
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Backup</h2>

        <p className="mb-4">
          Último backup:{" "}
          <strong>
            {config.lastBackupAt
              ? new Date(config.lastBackupAt).toLocaleString()
              : "Nunca executado"}
          </strong>
        </p>

        <button
          onClick={handleBackupNow}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Fazer backup agora
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Salvar Configuração
        </button>
      </div>
    </div>
  );
}
