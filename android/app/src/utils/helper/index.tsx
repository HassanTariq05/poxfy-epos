export const safeNumber = (value: any) =>
  isNaN(Number(value)) ? 0 : Number(value).toFixed(2);
