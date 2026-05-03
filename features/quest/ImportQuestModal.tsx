"use client";
import { useState } from "react";
import { Modal, Button, TextArea } from "@heroui/react";
import { Copy, CheckCircle2, AlertCircle, Zap, Clock, Brain } from "lucide-react";
import { useQuestStore } from "./useQuestStore";

const QUEST_TEMPLATE = {
  title: "Mastering Next.js App Router",
  why: "App Router is the foundation of modern Next.js — understanding it unlocks SSR, streaming, and layout architecture",
  definition_of_done: "Can create a multi-page Next.js app with nested layouts, loading states, and error boundaries",
  difficulty: "medium",
  bonusExp: 50,
  tasks: [
    {
      id: "t1",
      title: "Understand File-Based Routing",
      micro_action: "Read the official App Router docs and write a 3-point summary of how file-based routing works",
      verification: "Write a summary in your notes with 3 key takeaways",
      estimated_minutes: 15,
      exp: 20,
      energy_required: "low",
      status: "todo",
      depends_on: [] as string[]
    },
    {
      id: "t2",
      title: "Create Nested Layouts",
      micro_action: "Build a Next.js app with at least 2 nested layout.tsx files that share a sidebar navigation",
      verification: "The app renders shared sidebar across child routes without re-mounting",
      estimated_minutes: 25,
      exp: 35,
      energy_required: "medium",
      status: "todo",
      depends_on: ["t1"]
    },
    {
      id: "t3",
      title: "Add Loading & Error States",
      micro_action: "Create loading.tsx and error.tsx files for at least 1 route segment, test with simulated delays",
      verification: "Loading skeleton appears during navigation, error boundary catches thrown errors",
      estimated_minutes: 20,
      exp: 30,
      energy_required: "medium",
      status: "todo",
      depends_on: ["t2"]
    }
  ]
};

const ENERGY_COLORS = {
  low: "text-emerald-500",
  medium: "text-amber-500",
  high: "text-red-500",
};

export default function ImportQuestModal() {
  const { isImportModalOpen, setImportModalOpen, importQuest, isLoading, error } = useQuestStore();
  const [jsonText, setJsonText] = useState("");
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(" สร้าง  task ย่อยๆ ที่สามารถทำได้ จริงแบบ ที่ละ step จากนั้นกำหนด Exp ตามควรเหมาะสมของแต่ละ task โดยให้อ้างอิง format ตามตัวอย่างด้านล่าง " + JSON.stringify(QUEST_TEMPLATE, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = async () => {
    try {
      await importQuest(jsonText);
      setJsonText(""); // Clear on success
      setPreviewMode(false);
    } catch (e) {
      // Error is handled by store and displayed
    }
  };

  // Try to parse for preview
  let previewData: typeof QUEST_TEMPLATE | null = null;
  if (previewMode && jsonText.trim()) {
    try {
      previewData = JSON.parse(jsonText);
    } catch {
      previewData = null;
    }
  }

  return (
    <Modal>
      <Modal.Backdrop className="bg-slate-900/40 dark:bg-black/70 backdrop-blur-md" isOpen={isImportModalOpen} onOpenChange={setImportModalOpen}>
        <Modal.Container>
          <Modal.Dialog aria-label="Import Quest JSON" className=" bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden p-6 relative max-h-[90vh]">
            {({ close }: any) => (
              <Modal.Body className="flex flex-col gap-4 text-slate-800 dark:text-white p-8 overflow-y-auto">
                <Modal.CloseTrigger className="right-4 top-4" />

                <div className="flex flex-col gap-1 pr-10">
                  <Modal.Heading className="text-2xl font-black tracking-tight">
                    Import Quest JSON
                  </Modal.Heading>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium">
                    Create structured quest books with detailed micro-actions and verifications.
                  </p>
                </div>

                {/* Schema Info Cards */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-fuchsia-200 dark:border-fuchsia-800 rounded-xl p-2.5 text-center">
                    <Zap size={14} className="text-fuchsia-500 mx-auto mb-1" />
                    <span className="text-[9px] font-black text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider block">Micro Actions</span>
                    <span className="text-[8px] text-fuchsia-500/70 dark:text-fuchsia-400/50">Specific steps</span>
                  </div>
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-2.5 text-center">
                    <CheckCircle2 size={14} className="text-cyan-500 mx-auto mb-1" />
                    <span className="text-[9px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">Verification</span>
                    <span className="text-[8px] text-cyan-500/70 dark:text-cyan-400/50">Observable proof</span>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-2.5 text-center">
                    <Clock size={14} className="text-amber-500 mx-auto mb-1" />
                    <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Time Estimate</span>
                    <span className="text-[8px] text-amber-500/70 dark:text-amber-400/50">Minutes per task</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-100 dark:bg-zinc-800/50 p-3 rounded-2xl border border-slate-200 dark:border-zinc-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">Format</span>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">QuestJSON v2 Standard</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onPress={() => setPreviewMode(!previewMode)}
                      className={`font-bold gap-1 px-3 h-9 rounded-lg border ${
                        previewMode 
                          ? "!bg-cyan-500 !text-white border-cyan-600" 
                          : "!bg-white dark:!bg-zinc-800 !text-slate-700 dark:!text-white border-slate-200 dark:border-zinc-700 shadow-sm"
                      }`}
                    >
                      {previewMode ? "Edit" : "Preview"}
                    </Button>
                    <Button
                      size="sm"
                      onPress={handleCopyTemplate}
                      className="!bg-white dark:!bg-zinc-800 !text-slate-700 dark:!text-white shadow-sm border border-slate-200 dark:border-zinc-700 font-bold gap-1.5 px-4 h-9"
                    >
                      {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} className="text-cyan-500" />}
                      {copied ? "Copied!" : "Copy Prompt"}
                    </Button>
                  </div>
                </div>

                {/* Preview or Editor */}
                {previewMode && previewData ? (
                  <div className="bg-slate-50 dark:bg-zinc-800/50 border-2 border-slate-200 dark:border-zinc-700 rounded-xl p-4 space-y-3 max-h-48 overflow-y-auto">
                    <div>
                      <h4 className="font-black text-sm text-slate-800 dark:text-white">{previewData.title}</h4>
                      {previewData.why && (
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5 italic">{previewData.why}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        previewData.difficulty === "easy" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 border-emerald-200 dark:border-emerald-800" :
                        previewData.difficulty === "hard" ? "bg-red-100 dark:bg-red-900/30 text-red-600 border-red-200 dark:border-red-800" :
                        "bg-amber-100 dark:bg-amber-900/30 text-amber-600 border-amber-200 dark:border-amber-800"
                      }`}>{previewData.difficulty}</span>
                      <span className="text-[9px] font-bold text-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-900/20 px-2 py-0.5 rounded-full border border-fuchsia-200 dark:border-fuchsia-800">
                        +{previewData.bonusExp} Bonus
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 dark:text-zinc-400">
                        {previewData.tasks?.length || 0} tasks
                      </span>
                    </div>
                    {previewData.tasks?.map((t: any, i: number) => (
                      <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg p-2.5 border border-slate-200 dark:border-zinc-700 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800 dark:text-white">{t.title}</span>
                          <span className="text-[9px] font-black text-fuchsia-500">+{t.exp} XP</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400">{t.micro_action}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[8px] font-bold text-amber-500">⏱ {t.estimated_minutes}m</span>
                          <span className={`text-[8px] font-bold ${ENERGY_COLORS[t.energy_required as keyof typeof ENERGY_COLORS] || "text-slate-500"}`}>
                            ⚡ {t.energy_required}
                          </span>
                          {t.depends_on?.length > 0 && (
                            <span className="text-[8px] font-bold text-slate-400">🔗 {t.depends_on.length} deps</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <TextArea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder='{ "title": "...", "why": "...", "definition_of_done": "...", "difficulty": "medium", "bonusExp": 50, "tasks": [ ... ] }'
                    className="h-48 bg-slate-50 dark:bg-zinc-800/50 border-2 border-slate-300 dark:border-zinc-700 rounded-xl font-mono text-sm"
                  />
                )}

                {error && (
                  <div className="flex items-start gap-2 text-red-500 text-sm font-bold bg-red-100 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <Modal.Footer>
                  <Button onPress={handleImport}
                    isDisabled={isLoading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black uppercase tracking-wider" slot="close">
                    {isLoading ? "Importing..." : "Confirm Import"}
                  </Button>
                </Modal.Footer>
              </Modal.Body>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
