import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quest Books — G4U",
  description: "Manage your quests and objectives",
};

export default function QuestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
