export const parseDuration = (durationMs: number) => {
  if (isNaN(durationMs)) return null;
  if (durationMs >= 1000) {
    return `${(durationMs / 1000).toFixed(2)} s`;
  } else if (durationMs >= 1) {
    return `${durationMs.toFixed(2)} ms`;
  } else {
    return `${(durationMs * 1000).toFixed(2)} µs`;
  }
};
