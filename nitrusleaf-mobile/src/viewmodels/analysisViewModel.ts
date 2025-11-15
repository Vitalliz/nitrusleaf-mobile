import { useState, useEffect } from "react";
import { AnalysisRepository } from "@/src/repositories/analysisRepository";
import { Analysis } from "@/src/models/analysis";

export function useAnalysisListViewModel() {
  const [items, setItems] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await AnalysisRepository.getAll();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return { items, loading, reload: load };
}
