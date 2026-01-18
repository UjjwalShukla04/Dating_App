const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  if (!meta) {
    return base;
  }

  try {
    const serialized =
      typeof meta === "string" ? meta : JSON.stringify(meta, null, 2);
    return `${base} ${serialized}`;
  } catch {
    return base;
  }
};

const logger = {
  info(message, meta) {
    console.info(formatMessage("info", message, meta));
  },
  warn(message, meta) {
    console.warn(formatMessage("warn", message, meta));
  },
  error(message, meta) {
    console.error(formatMessage("error", message, meta));
  },
};

export { logger };

