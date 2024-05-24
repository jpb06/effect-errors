export const insertInto = (
  input: string,
  data: string,
  start: number,
  delCount: number,
) => input.slice(0, start) + data + input.slice(start + Math.abs(delCount));
