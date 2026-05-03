"use client";
import { Modal, Button } from "@heroui/react";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }: DeleteConfirmModalProps) {
  return (
    <Modal>
      <Modal.Backdrop className="bg-slate-900/40 dark:bg-black/70 backdrop-blur-md" isOpen={isOpen} onOpenChange={onClose}>
        <Modal.Container>
          <Modal.Dialog aria-label="Confirm Deletion" className="bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden p-6">
            <Modal.Body className="flex flex-col gap-5 items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={32} />
              </div>

              <div className="flex flex-col gap-2">
                <Modal.Heading className="text-xl font-black text-slate-900 dark:text-white">
                  Delete Quest Book?
                </Modal.Heading>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Are you sure you want to delete <span className="font-bold text-slate-800 dark:text-white">"{title}"</span>?
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/40 mt-2">
                   <p className="text-xs text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-1.5">
                     <Trash2 size={12} /> ALL TASKS IN THIS BOOK WILL BE PERMANENTLY DELETED.
                   </p>
                </div>
              </div>

              <div className="flex gap-3 w-full mt-2">
                 <Button 
                   onPress={onClose}
                   className="flex-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-bold rounded-xl"
                 >
                   CANCEL
                 </Button>
                 <Button 
                   onPress={onConfirm}
                   className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl shadow-lg shadow-red-500/30"
                 >
                   DELETE BOOK
                 </Button>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
