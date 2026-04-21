type PrismaPaginationParams<W, S, I, O> = {
  all?: boolean;
  skip: number;
  take: number;
  where?: W;
  select?: S;
  include?: I;
  orderBy?: O;
  lastSynced?: string;
};

export function parsePrismaQuery<
  W = unknown,
  S = unknown,
  I = unknown,
  O = unknown,
>(req: Request): PrismaPaginationParams<W, S, I, O> {
  const { searchParams } = new URL(req.url);

  const parseJSON = <T>(value: string | null, key: string): T | undefined => {
    if (!value) return undefined;

    try {
      return JSON.parse(value) as T;
    } catch (err) {
      console.error(`❌ Invalid JSON in query param "${key}":`, value);
      throw new Error(`Invalid JSON in query param: ${key}`);
    }
  };

  const parseNumber = (value: string | null, defaultValue: number): number => {
    const num = Number(value);
    return Number.isFinite(num) ? num : defaultValue;
  };

  return {
    all: searchParams.get("all") === "true",

    skip: parseNumber(searchParams.get("skip"), 0),
    take: parseNumber(searchParams.get("take"), 20),

    where: parseJSON<W>(searchParams.get("where"), "where"),
    select: parseJSON<S>(searchParams.get("select"), "select"),
    include: parseJSON<I>(searchParams.get("include"), "include"),
    orderBy: parseJSON<O>(searchParams.get("orderBy"), "orderBy"),

    lastSynced: searchParams.get("lastSynced") ?? undefined,
  };
}
