export const MARKS_EXCEED_MAX_MESSAGE =
  "Marks obtained cannot be greater than max marks";

export function validateMarksRowStrings(
  maxMarks: string,
  marksObtained: string,
): string | null {
  const maxTrim = maxMarks.trim();
  const obtTrim = marksObtained.trim();
  if (obtTrim === "") {
    return null;
  }
  if (maxTrim === "") {
    return null;
  }
  const maxNum = Number(maxTrim);
  const obtNum = Number(obtTrim);
  if (Number.isNaN(maxNum) || Number.isNaN(obtNum)) {
    return null;
  }
  if (obtNum > maxNum) {
    return MARKS_EXCEED_MAX_MESSAGE;
  }
  return null;
}
