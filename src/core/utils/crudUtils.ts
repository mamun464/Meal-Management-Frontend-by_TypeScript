export function addOne<T>(items: T[] = [], newItem: T) {
  return [...items, newItem];
}

export function removeOne<T extends { id: string }>(
  items: T[] = [],
  itemId: string
) {
  return items.filter((item) => item.id !== itemId);
}

export function removeMany<T extends { id: string }>(
  items: T[] = [],
  itemIds: string[]
) {
  return items.filter((item) => !itemIds.includes(item.id));
}

export function updateOne<T extends { id: string }>(
  items: T[] = [],
  updatedItem: T
) {
  return items.map((item) => (item.id === updatedItem.id ? updatedItem : item));

}

export function getAuthToken() {
  // Retrieve token and check if it exists
  const token = localStorage.getItem("authkey");
  return token ? token.replace(/^"(.+)"$/, '$1') : null;
}
