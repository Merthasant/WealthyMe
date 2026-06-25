export const getDefaultTimezone = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return tz;
};
