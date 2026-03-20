// Copyright (c) 2026-03-19
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

export type FetchFn<T> = (value: string) => Promise<T[]>;

export interface FilterOptions<T> {
  originalList: T[];
  filter: string;
  getSearchField: (item: T) => string;
  setList: (data: T[]) => void;
  fetchFromApi?: FetchFn<T>;
}

export async function handleGenericFilter<T>({
  originalList,
  filter,
  getSearchField,
  setList,
  fetchFromApi,
}: FilterOptions<T>): Promise<void> {
  // 🔄 reset se vazio
  if (!filter || filter.trim() === "") {
    setList(originalList);
    return;
  }

  const normalizedFilter = filter.toLowerCase();

  const local = originalList.filter((item) =>
    getSearchField(item).toLowerCase().includes(normalizedFilter),
  );

  if (local.length > 0) {
    setList(local);
    return;
  }

  if (!fetchFromApi) {
    setList([]);
    return;
  }

  try {
    const apiResult = await fetchFromApi(filter);

    if (!apiResult || apiResult.length === 0) {
      setList([]);
      return;
    }

    setList(apiResult);
  } catch (error) {
    console.error("Erro no filtro genérico:", error);
    setList(originalList);
  }
}
