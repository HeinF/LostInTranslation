// Saves user to local storage
export const storageSave = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
// Reads user from local storage
export const storageRead = (key) => {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }

  return null;
};
