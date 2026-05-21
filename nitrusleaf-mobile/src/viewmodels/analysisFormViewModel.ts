import { useState } from "react";
import { AnalysisRepository } from "@/src/repositories/analysisRepository";

export function useAnalysisFormViewModel() {
  const [field, setField] = useState("");
  const [nitrogen, setNitrogen] = useState("");
  const [potassium, setPotassium] = useState("");
  const [calcium, setCalcium] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);

    await AnalysisRepository.insert({
      field,
      nitrogen: parseFloat(nitrogen),
      potassium: parseFloat(potassium),
      calcium: parseFloat(calcium),
      created_at: new Date().toISOString(),
    });

    setSaving(false);
  }

  return {
    field, setField,
    nitrogen, setNitrogen,
    potassium, setPotassium,
    calcium, setCalcium,
    saving,
    save
  };
}
