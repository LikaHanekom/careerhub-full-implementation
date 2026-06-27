import { create } from "zustand";

type View = "table" | "grid";

interface DashboardStore {
  view: View;
  setView: (view: View) => void;
  showClosedJobs: boolean;
  toggleShowClosedJobs: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  view: "table",
  setView: (view) => set({ view }),
  showClosedJobs: true,
  toggleShowClosedJobs: () =>
    set((state) => ({ showClosedJobs: !state.showClosedJobs })),
}));