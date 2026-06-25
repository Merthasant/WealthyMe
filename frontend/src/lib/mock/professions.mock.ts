import professionsJson from "@/assets/profession.json";

export type ProfessionDetails = {
  profession: string;
  list: string[];
};

export type ProfessionsMock = {
  simple: string[];
  details: ProfessionDetails[];
};

const professionsMock = professionsJson as ProfessionsMock;

export default professionsMock;
