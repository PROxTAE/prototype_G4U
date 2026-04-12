"use client";
import { useState } from "react";
import { Modal, Button, TextArea } from "@heroui/react";
import { useQuestStore } from "./useQuestStore";

export default function ImportQuestModal() {
  const { isImportModalOpen, setImportModalOpen, importQuest, isLoading, error } = useQuestStore();
  const [jsonText, setJsonText] = useState("");

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
          <Modal.Dialog className=" bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden p-6 relative">
            {({ close }: any) => (
              <Modal.Body className="flex flex-col gap-4 text-slate-800 dark:text-white">
                <Modal.CloseTrigger />
                <Modal.Heading>Import Quest JSON</Modal.Heading>


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
