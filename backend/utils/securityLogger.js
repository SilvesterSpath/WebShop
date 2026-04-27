const pickDefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

export const logSecurityEvent = (level, event, context = {}) => {
  const payload = pickDefined({
    ts: new Date().toISOString(),
    event,
    ...context,
  });

  const line = JSON.stringify(payload);

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  if (level === 'error') {
    console.error(line);
    return;
  }

  console.info(line);
};
