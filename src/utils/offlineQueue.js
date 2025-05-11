const QUEUE_KEY = "offlineHostelQueue";

export const getOfflineQueue = () => {
  const queue = localStorage.getItem(QUEUE_KEY);
  return queue ? JSON.parse(queue) : [];
};

export const addToOfflineQueue = (action) => {
  const queue = getOfflineQueue();
  queue.push(action);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const clearOfflineQueue = () => {
  localStorage.removeItem(QUEUE_KEY);
};
