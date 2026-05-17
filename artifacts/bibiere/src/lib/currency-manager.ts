export const STORE_CURRENCY = "NGN";

export function formatStoreCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: STORE_CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);
}
