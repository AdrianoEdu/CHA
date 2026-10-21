// Copyright (c) 2026-04-03
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

"use client";

import { SystemConfigDto } from "@/app/web/dto/config-system.dto";
import { configSystemService } from "@/app/web/services/configSystemService/configSystemService";
import { useEffect, useState } from "react";
import Input, { InputType } from "@/app/web/components/input/input";
import ComboBox from "@/app/web/components/combobox/combobox";
import {
  CalendarIcon,
  ClockIcon,
  PlayIcon,
  SaveIcon,
  SettingsIcon,
} from "@/app/web/icons";
import { LuDatabaseBackup } from "react-icons/lu";
import { BsShieldCheck } from "react-icons/bs";
import { toast } from "react-toastify";

type TokenExpirationUnit = "MINUTES" | "HOURS" | "DAYS";

type SelectOption = {
  label: string;
  value: TokenExpirationUnit;
};

const tokenExpirationOptions: SelectOption[] = [
  { label: "Minutos", value: "MINUTES" },
  { label: "Horas", value: "HOURS" },
  { label: "Dias", value: "DAYS" },
];

function validateIntervalHours(value: unknown) {
  if (value === "" || value === undefined || value === null) {
    return { valid: true, value: undefined };
  }

  const num = Number(value);

  if (!Number.isInteger(num) || num < 1 || num > 12) {
    return {
      valid: false,
      message: "O intervalo deve estar entre 1 e 12 horas.",
    };
  }

  return { valid: true, value: num };
}

function validateRunHour(value: unknown) {
  if (value === "" || value === undefined || value === null) {
    return { valid: true, value: undefined };
  }

  const num = Number(value);

  if (!Number.isInteger(num) || num < 0 || num > 23) {
    return {
      valid: false,
      message: "O horário deve estar entre 0 e 23.",
    };
  }

  return { valid: true, value: num };
}

function validateTokenExpiration(value: unknown) {
  if (value === "" || value === undefined || value === null) {
    return {
      valid: false,
      message: "Informe um tempo de expiração válido.",
    };
  }

  const num = Number(value);

  if (!Number.isInteger(num) || num < 1 || num > 365) {
    return {
      valid: false,
      message: "O tempo de expiração deve estar entre 1 e 365.",
    };
  }

  return { valid: true, value: num };
}

export default function SystemConfigPage() {
  const [config, setConfig] = useState<SystemConfigDto>({
    enabled: true,
    tokenExpirationValue: 2,
    tokenExpirationUnit: "HOURS",
  } as SystemConfigDto);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [error, setError] = useState("");

  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [restoringBackup, setRestoringBackup] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [systemConfig] = await configSystemService.get();

        if (systemConfig) {
          setConfig((prev) => ({
            ...prev,
            ...systemConfig,
            tokenExpirationValue: systemConfig.tokenExpirationValue ?? 2,
            tokenExpirationUnit: systemConfig.tokenExpirationUnit ?? "HOURS",
          }));
        }
      } catch {
        setError("Não foi possível carregar as configurações.");
      } finally {
        setLoading(false);
      }
    };

    void loadConfig();
  }, []);

  const updateConfig = (values: Partial<SystemConfigDto>) => {
    setConfig((prev) => ({
      ...prev,
      ...values,
    }));
  };

  const handleSave = async () => {
    setError("");

    const interval = validateIntervalHours(config.intervalHours);
    const hour = validateRunHour(config.runAtHour);
    const expiration = validateTokenExpiration(config.tokenExpirationValue);

    if (!config.enabled) {
      if (!expiration.valid) {
        setError(expiration.message ?? "");
        return;
      }
    } else {
      if (!interval.valid) {
        setError(interval.message ?? "");
        return;
      }

      if (!hour.valid) {
        setError(hour.message ?? "");
        return;
      }

      if (!expiration.valid) {
        setError(expiration.message ?? "");
        return;
      }

      if (config.intervalHours != null && config.runAtHour != null) {
        setError("Escolha um intervalo ou um horário fixo.");
        return;
      }

      if (config.intervalHours == null && config.runAtHour == null) {
        setError("Informe um intervalo ou um horário fixo.");
        return;
      }
    }

    if (
      !tokenExpirationOptions.some(
        (option) => option.value === config.tokenExpirationUnit,
      )
    ) {
      setError("Selecione uma unidade de tempo válida.");
      return;
    }

    setSaving(true);

    try {
      await configSystemService.update(config);
      toast.success("Configurações salvas com sucesso!");
    } catch {
      setError("Não foi possível salvar as configurações.");
      toast.error('"Não foi possível salvar as configurações."');
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreBackup = async (): Promise<void> => {
    if (!backupFile) {
      toast.error("Selecione um arquivo de backup.");
      return;
    }

    const confirmed = window.confirm(
      "A restauração poderá substituir os dados atuais do sistema. Deseja continuar?",
    );

    if (!confirmed) return;

    setRestoringBackup(true);
    setError("");

    try {
      await configSystemService.restoreBackup(backupFile);

      toast.success("Backup restaurado com sucesso!");
      setBackupFile(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível restaurar o backup.";

      setError(message);
      toast.error(message);
    } finally {
      setRestoringBackup(false);
    }
  };

  const handleBackupNow = async (): Promise<void> => {
    setError("");

    if (!configSystemService.createBackup) {
      const message = "O serviço de backup ainda não está disponível.";
      setError(message);
      toast.error(message);
      return;
    }

    setCreatingBackup(true);

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const suggestedName = `backup-${timestamp}.dump`;
      const pickerWindow = window as Window & {
        showSaveFilePicker?: (options: {
          suggestedName: string;
          types: Array<{
            description: string;
            accept: Record<string, string[]>;
          }>;
        }) => Promise<FileSystemFileHandle>;
      };

      if (pickerWindow.showSaveFilePicker) {
        const fileHandle = await pickerWindow.showSaveFilePicker({
          suggestedName,
          types: [
            {
              description: "Backup PostgreSQL",
              accept: {
                "application/octet-stream": [".dump"],
              },
            },
          ],
        });

        const backup = await configSystemService.createBackup();
        const writable = await fileHandle.createWritable();

        await writable.write(backup);
        await writable.close();
      } else {
        const backup = await configSystemService.createBackup();
        const url = URL.createObjectURL(backup);
        const link = document.createElement("a");

        link.href = url;
        link.download = suggestedName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      setConfig((prev) => ({
        ...prev,
        lastBackupAt: new Date().toISOString(),
      }));
      toast.success("Backup gerado e salvo com sucesso!");
    } catch (error) {
      alert(error);

      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível gerar ou salvar o backup.";
      setError(message);
      toast.error(message);
    } finally {
      setCreatingBackup(false);
    }
  };

  const expirationUnitLabel = {
    MINUTES: "minuto(s)",
    HOURS: "hora(s)",
    DAYS: "dia(s)",
  }[config.tokenExpirationUnit];

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          Carregando configurações...
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-7 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-blue-700">
            <SettingsIcon />
            Administração
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Configurações do sistema
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Gerencie os backups e a segurança de acesso ao sistema.
          </p>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
            <LuDatabaseBackup />
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">Backup automático</h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure a execução e a frequência dos backups.
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(event) =>
                updateConfig({ enabled: event.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 accent-blue-600"
            />
            Ativo
          </label>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-gray-700">
              <ClockIcon />
              <h3 className="font-medium">Intervalo de execução</h3>
            </div>

            <Input
              label="Repetir a cada (horas)"
              inputType={InputType.Number}
              min={1}
              max={12}
              value={config.intervalHours ?? ""}
              disabled={!config.enabled || config.runAtHour != null}
              onValueChange={(value) => {
                if (value === "") {
                  updateConfig({ intervalHours: undefined });
                  return;
                }

                const result = validateIntervalHours(value);

                if (result.valid) {
                  updateConfig({
                    intervalHours: result.value,
                    runAtHour: undefined,
                  });
                }
              }}
            />

            <p className="mt-2 text-xs text-gray-500">
              Escolha um intervalo entre 1 e 12 horas.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-gray-700">
              <CalendarIcon />
              <h3 className="font-medium">Horário fixo</h3>
            </div>

            <Input
              label="Hora de execução (0 a 23)"
              inputType={InputType.Number}
              min={0}
              max={23}
              value={config.runAtHour ?? ""}
              disabled={!config.enabled || config.intervalHours != null}
              onValueChange={(value) => {
                if (value === "") {
                  updateConfig({ runAtHour: undefined });
                  return;
                }

                const result = validateRunHour(value);

                if (result.valid) {
                  updateConfig({
                    runAtHour: result.value,
                    intervalHours: undefined,
                  });
                }
              }}
            />

            <p className="mt-2 text-xs text-gray-500">
              Utilize o formato de 24 horas, por exemplo, 22 para 22h.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
            <BsShieldCheck size={23} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Segurança e autenticação
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Defina por quanto tempo o token de acesso será válido.
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Tempo de expiração"
              inputType={InputType.Number}
              min={1}
              max={365}
              value={config.tokenExpirationValue ?? ""}
              onValueChange={(value) =>
                updateConfig({
                  tokenExpirationValue:
                    value === "" ? undefined : Number(value),
                } as Partial<SystemConfigDto>)
              }
            />

            <div>
              <ComboBox<SelectOption>
                label="Unidade de tempo"
                options={tokenExpirationOptions}
                selected={
                  tokenExpirationOptions.find(
                    (option) => option.value === config.tokenExpirationUnit,
                  ) ?? tokenExpirationOptions[1]
                }
                valueKey="value"
                labelKey="label"
                onSelectOption={(option) => {
                  if (option) {
                    updateConfig({
                      tokenExpirationUnit: option.value,
                    } as Partial<SystemConfigDto>);
                  }
                }}
                placeholder="Selecione a unidade"
              />
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
            <ClockIcon className="mt-0.5 shrink-0 text-gray-500" />

            <div>
              <p className="text-sm font-medium text-gray-800">
                Validade configurada
              </p>
              <p className="mt-1 text-sm text-gray-600">
                O token expirará após{" "}
                <strong>
                  {config.tokenExpirationValue || 0} {expirationUnitLabel}
                </strong>
                .
              </p>
              <p className="mt-1 text-xs text-gray-500">
                A alteração se aplica aos tokens emitidos após a atualização da
                configuração.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
            <LuDatabaseBackup size={23} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">Execução manual</h2>
            <p className="mt-1 text-sm text-gray-500">
              Consulte o registro do último backup e gere um novo arquivo.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm text-gray-500">Último backup</p>
            <p className="mt-1 font-medium text-gray-900">
              {config.lastBackupAt
                ? new Date(config.lastBackupAt).toLocaleString("pt-BR")
                : "Nenhum backup registrado"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleBackupNow}
            disabled={creatingBackup}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creatingBackup ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            ) : (
              <PlayIcon />
            )}
            {creatingBackup ? "Gerando backup..." : "Fazer backup agora"}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
            <LuDatabaseBackup size={23} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">Restaurar backup</h2>
            <p className="mt-1 text-sm text-gray-500">
              Selecione um arquivo JSON para carregar os dados no sistema.
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div>
            <label
              htmlFor="backup-file"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Arquivo de backup
            </label>

            <input
              id="backup-file"
              type="file"
              accept=".json,application/json"
              disabled={restoringBackup}
              onChange={(event) =>
                setBackupFile(event.target.files?.[0] ?? null)
              }
              className="block w-full rounded-xl border border-gray-300 p-3 text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:font-medium hover:file:bg-gray-200 disabled:opacity-60"
            />
          </div>

          {backupFile && (
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <LuDatabaseBackup className="shrink-0 text-gray-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">
                  {backupFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(backupFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                type="button"
                disabled={restoringBackup}
                onClick={() => setBackupFile(null)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                Remover
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleRestoreBackup}
            disabled={!backupFile || restoringBackup}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {restoringBackup ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-200 border-t-white" />
            ) : (
              <LuDatabaseBackup size={18} />
            )}
            {restoringBackup ? "Restaurando backup..." : "Restaurar backup"}
          </button>

          <p className="text-xs leading-5 text-gray-500">
            Atenção: a restauração pode substituir os dados atuais. Confirme que
            selecionou o arquivo correto antes de continuar.
          </p>
        </div>
      </section>

      <footer className="flex justify-end border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SaveIcon />
          {saving ? "Salvando..." : "Salvar configurações"}
        </button>
      </footer>
    </main>
  );
}
