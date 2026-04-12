"use client";
import { useState } from "react";
import { Modal, Button, TextArea } from "@heroui/react";
import { Copy, CheckCircle2 } from "lucide-react";
import { useQuestStore } from "./useQuestStore";

const QUEST_TEMPLATE = {
  title: "Mastering Next.js",
  description: "Learn core concepts of Next.js 16",
  difficulty: "medium",
  bonusExp: 50,
  tasks: [
    { title: "Understand App Router", exp: 20 },
    { title: "Master Server Components", exp: 30 },
    { title: "Learn Turbopack Basics", exp: 15 }
  ]
};

export default function ImportQuestModal() {
  const { isImportModalOpen, setImportModalOpen, importQuest, isLoading, error } = useQuestStore();
  const [jsonText, setJsonText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(" สร้าง  task ย่อยๆ ที่สามารถทำได้ จริงแบบ ที่ละ step จากนั้นกำหนด Exp ตามควรเหมาะสมของแต่ละ task โดยให้อ้างอิง format ตามตัวอย่างด้านล่าง " + JSON.stringify(QUEST_TEMPLATE, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = async () => {
    try {
      await importQuest(jsonText);
      setJsonText(""); // Clear on success
    } catch (e) {
      // Error is handled by store and displayed
    }
  };

  return (
    <Modal>
      <Modal.Backdrop className="bg-slate-900/40 dark:bg-black/70 backdrop-blur-md" isOpen={isImportModalOpen} onOpenChange={setImportModalOpen}>
        <Modal.Container>
          <Modal.Dialog aria-label="Import Quest JSON" className=" bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden p-6 relative">
            {({ close }: any) => (
              <Modal.Body className="flex flex-col gap-4 text-slate-800 dark:text-white p-8">
                <Modal.CloseTrigger className="right-4 top-4" />

                <div className="flex flex-col gap-1 pr-10">
                  <Modal.Heading className="text-2xl font-black tracking-tight">
                    Import Quest JSON
                  </Modal.Heading>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 font-medium">
                    Create new quest books instantly by pasting your JSON data.
                  </p>
                </div>

                <div className="flex justify-between items-center bg-slate-100 dark:bg-zinc-800/50 p-3 rounded-2xl border border-slate-200 dark:border-zinc-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">Format</span>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">QuestJSON Standard</span>
                  </div>
                  <Button
                    size="sm"
                    variant="solid"
                    onPress={handleCopyTemplate}
                    className="!bg-white dark:!bg-zinc-800 !text-slate-700 dark:!text-white shadow-sm border border-slate-200 dark:border-zinc-700 font-bold gap-1.5 px-4 h-9"
                  >
                    {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} className="text-cyan-500" />}
                    {copied ? "Copied!" : "Copy Template"}
                  </Button>
                </div>

                <TextArea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder='{ "title": "...", "tasks": [ ... ] }'
                  className="h-48 bg-slate-50 dark:bg-zinc-800/50 border-2 border-slate-300 dark:border-zinc-700 rounded-xl font-mono text-sm"
                />

                {error && (
                  <div className="text-red-500 text-sm font-bold bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
                    {error}
                  </div>
                )}

                <Modal.Footer>
                  <Button onPress={handleImport}
                    isLoading={isLoading} className="w-full" slot="close">
                    Confirm Import
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
