export interface LevelMapping {
  eiken: string;
  toeic: string;
}

export const levelMapping: Record<string, LevelMapping> = {
  "CEFR preA1": { eiken: "英検5級", toeic: "TOEIC 300以下" },
  "CEFR A1": { eiken: "英検4級", toeic: "TOEIC 350-450" },
  "CEFR A2": { eiken: "英検3級", toeic: "TOEIC 450-550" },
  "CEFR B1": { eiken: "英検準2級", toeic: "TOEIC 550-650" },
  "CEFR B2": { eiken: "英検2級", toeic: "TOEIC 650-850" },
  "CEFR C1": { eiken: "英検準1級", toeic: "TOEIC 850-950" },
  "CEFR C2": { eiken: "英検1級", toeic: "TOEIC 950+" },
  "CEFR A1-A2": { eiken: "英検4級", toeic: "TOEIC 350-450" },
  "CEFR A2-B1": { eiken: "英検準2級", toeic: "TOEIC 550-650" },
  "CEFR B1-B2": { eiken: "英検2級", toeic: "TOEIC 650-850" },
  "CEFR B2-C1": { eiken: "英検準1級", toeic: "TOEIC 850-950" },
  "CEFR C1-C2": { eiken: "英検1級", toeic: "TOEIC 950+" },
  "TOEIC400 CEFR A2": { eiken: "英検4-3級程度", toeic: "TOEIC 400" },
  "TOEIC500 CEFR A2+": { eiken: "英検3級程度", toeic: "TOEIC 500" },
  "TOEIC600 CEFR B1": { eiken: "英検準2級程度", toeic: "TOEIC 600" },
  "TOEIC700 CEFR B1+": { eiken: "英検2級程度", toeic: "TOEIC 700" },
  "TOEIC800 CEFR B2+": { eiken: "英検準1級程度", toeic: "TOEIC 800" },
  "TOEIC900 CEFR C1": { eiken: "英検1級程度", toeic: "TOEIC 900+" },
};

export const getLevelDisplay = (level: string): string => {
  if (!level) return "不明";
  if (levelMapping[level]) {
    const mapping = levelMapping[level];
    return `${mapping.eiken} / ${mapping.toeic}`;
  }
  return level;
};
