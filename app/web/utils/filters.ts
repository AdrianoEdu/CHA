// Copyright (c) 2026-03-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export type FetchResult<T> = {
  data: T[];
  count: number;
};

export type FetchFn<T> = (value: string) => Promise<FetchResult<T>>;

export interface FilterOptions<T> {
  originalList: T[];

  filter: string;

  setList: (data: T[]) => void;

  /**
   * Atualiza o total retornado pela API
   */
  setCount?: (count: number) => void;

  /**
   * Busca diretamente da fonte
   */
  fetchFromApi?: FetchFn<T>;
}

export async function handleGenericFilter<T>({
  originalList,
  filter,
  setList,
  setCount,
  fetchFromApi,
}: FilterOptions<T>): Promise<void> {
  // Sem filtro → mantém lista original
  if (!filter || filter.trim() === "") {
    setList(originalList);

    if (setCount) {
      setCount(originalList.length);
    }

    return;
  }

  // Sem API → não faz filtro local
  if (!fetchFromApi) {
    setList([]);

    if (setCount) {
      setCount(0);
    }

    return;
  }

  try {
    // Busca DIRETAMENTE da fonte
    const result = await fetchFromApi(filter);

    setList(result.data ?? []);

    if (setCount) {
      setCount(result.count ?? 0);
    }
  } catch (error) {
    console.error("Erro no filtro genérico:", error);

    setList([]);

    if (setCount) {
      setCount(0);
    }
  }
}
