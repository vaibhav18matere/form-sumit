export function uppercaseFormValue(value: unknown): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return "";
}
