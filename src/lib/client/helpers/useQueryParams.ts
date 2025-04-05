import { useRouter } from "next/router";

function getQueryParam<T = string>(query: T[] | T | undefined): T | undefined {
  if (query) {
    if (Array.isArray(query)) {
      const lastItemIndex = query?.length > 0 ? query?.length - 1 : 0;
      return query?.[lastItemIndex];
    }
    return query;
  }
  return undefined;
}

/**
 * Get value from query params with a setter function
 * @deprecated prefer to use useStringQueryParams, useNumberQueryParams, useEnumQueryParams or useBooleanQueryParams instead
 * @param queryName string
 * @param fallbackValue T
 * @returns [T, (value: T) => void]
 * @example
 * const [id, setId] = useQueryParams("id", "34"); // id = string | "34"
 */
function useQueryParams<T extends string | number | boolean = string>(
  queryName: string,
  fallbackValue?: T
): [T | undefined, (value: T) => void] {
  const { query } = useRouter();
  const value = getQueryParam<T>(query?.[queryName] as T) || fallbackValue;
  const setValue = useShallowSetQueryParams<T>(queryName);
  return [value, setValue];
}

/**
 * Get an enum from query params with a setter function
 * @param queryName string
 * @param fallbackValue T
 * @returns [T, (value: T) => void]
 * @example
 * const [color, setColor] = useEnumQueryParams<"red" | "blue">("color", "red"); // color = "red" | "blue"
 */
export function useEnumQueryParams<T extends string | number>(
  queryName: string,
  fallbackValue?: T
): [T | undefined, (value: T) => void] {
  const { query } = useRouter();
  const value = getQueryParam<T>(query?.[queryName] as T) || fallbackValue;
  const setValue = useShallowSetQueryParams<T>(queryName);
  return [value, setValue];
}

/**
 * Get a string from query params with a setter function
 * @param queryName string
 * @param fallbackValue string
 * @returns [string | undefined, (value: string) => void]
 * @example
 * const [id, setId] = useStringQueryParams("id", "1"); // id = string | "1"
 */
export function useStringQueryParams(
  queryName: string,
  fallbackValue?: string
): [string | undefined, (value: string) => void] {
  const { query } = useRouter();
  const value = getQueryParam(query?.[queryName]) || fallbackValue;
  const setValue = useShallowSetQueryParams<string>(queryName);
  return [value, setValue];
}

/**
 * Get an array from query params with a setter function
 * @param queryName string
 * @param fallbackValue T[]
 * @returns [T[] | undefined, (value: T[]) => void]
 * @example
 * const [ids, setIds] = useArrayQueryParams("ids", ["1"]); // ids = ["1"]
 */
export function useArrayQueryParams<
  T extends string | number | boolean = string
>(
  queryName: string,
  fallbackValue?: T[]
): [T[] | undefined, (value: T[]) => void] {
  const { query } = useRouter();
  const value =
    (getQueryParam(query?.[queryName])?.split(",") as T[]) || fallbackValue;
  const setValue = useShallowSetQueryParams<T[]>(queryName);
  return [value, setValue];
}

/**
 * Get a number from query params with a setter function
 * @param queryName string
 * @param fallbackValue number
 * @returns [number | undefined, (value: number) => void]
 * @example
 * const [page, setPage] = useNumberQueryParams("page", 1); // page = number | 1
 */
export function useNumberQueryParams(
  queryName: string,
  fallbackValue?: number
): [number | undefined, (value: number) => void] {
  const { query } = useRouter();
  const value = Number(getQueryParam(query?.[queryName])) || fallbackValue;
  const setValue = useShallowSetQueryParams<number>(queryName);
  return [value, setValue];
}

/**
 * Get a boolean from query params with a setter function
 * @param queryName string
 * @param fallbackValue boolean
 * @returns [boolean | undefined, (value: boolean) => void]
 * @example
 * const [isSaved, setIsSaved] = useBooleanQueryParams("isSaved", false); // isSaved = boolean | false
 */
export function useBooleanQueryParams(
  queryName: string,
  fallbackValue?: boolean
): [boolean | undefined, (value: boolean) => void] {
  const { query } = useRouter();
  const value = getQueryParam(query?.[queryName]);
  const setValue = useShallowSetQueryParams<boolean>(queryName);

  if (value === "true") return [true, setValue];
  if (value === "false") return [false, setValue];
  return [fallbackValue, setValue];
}

/**
 * Set a query parameter without reloading the page (shallow routing)
 * @param queryName string
 * @returns (value: T) => void
 * @example
 * const setQueryParam = useShallowSetQueryParams("id");
 * setQueryParam("newId"); // Updates query param without reload
 */
function useShallowSetQueryParams<
  T extends string | boolean | number | (string | boolean | number)[]
>(queryName: string) {
  const { query, pathname, push } = useRouter();
  return (value: T) => {
    const prevQueryParams = new URLSearchParams(query as any);
    prevQueryParams.delete(queryName);
    prevQueryParams.set(
      queryName,
      Array.isArray(value) ? value?.join(",") : value.toString()
    );
    const newQueryParams = prevQueryParams.toString();
    push(
      {
        pathname,
        query: newQueryParams,
      },
      undefined,
      { shallow: true }
    );
  };
}
