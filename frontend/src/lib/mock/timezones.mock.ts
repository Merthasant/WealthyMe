import timezonesJson from "@/assets/timezones.json";

export type TimezonesMock = {
  value: string;
  label: string;
  offset: string;
  offset_seconds: number;
  abbr: string;
  region: string;
  cities: string[];
};

export type GroupedTimezonesMock = Record<string, TimezonesMock[]>;

const groupedTimezones = timezonesJson.reduce((acc, value) => {
  if (!acc[value.region]) acc[value.region] = [];
  acc[value.region].push(value);
  return acc;
}, {} as GroupedTimezonesMock);

export default groupedTimezones as GroupedTimezonesMock;
