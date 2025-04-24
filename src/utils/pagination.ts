export function getPagination(page: number, size: number) {
  const limit = size ? +size : 5;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
}
