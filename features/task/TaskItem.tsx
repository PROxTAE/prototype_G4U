import { Trash2, Zap } from "lucide-react";
import { Task } from "@/types";
import { Card, Checkbox, Button } from "@heroui/react";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, onComplete?: () => void) => void;
  onDelete: (id: string) => void;
  onRewardTrigger: (xp: number, coin: number) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onRewardTrigger }: TaskItemProps) {
  const handleToggle = (isSelected: boolean) => {
    onToggle(task.id, isSelected ? () => onRewardTrigger(task.exp ?? 10, Math.floor((task.exp ?? 10) * 0.5)) : undefined);
  };

  const expValue = task.exp ?? 10;

  return (
    <Card 
      className={`group w-full transition-all border-2 shadow-sm ${
        task.completed 
          ? 'bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 opacity-60' 
          : 'bg-white dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 hover:border-fuchsia-400 dark:hover:border-fuchsia-600'
      }`}
    >
      <Card.Content className="flex flex-row items-center justify-between p-3 overflow-hidden gap-2">
        <Checkbox 
          isSelected={task.completed} 
          onChange={handleToggle}
          className={`font-bold text-sm truncate flex-1 transition-colors ${task.completed ? 'line-through text-slate-400 dark:text-zinc-500' : 'text-slate-800 dark:text-white'}`}
        >
          {task.title}
        </Checkbox>

        {/* EXP Badge */}
        <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full flex-shrink-0 transition-all ${
          task.completed
            ? 'bg-slate-200 dark:bg-zinc-700'
            : 'bg-fuchsia-100 dark:bg-fuchsia-900/40 border border-fuchsia-300 dark:border-fuchsia-700'
        }`}>
          <Zap size={10} className={task.completed ? 'text-slate-400' : 'text-fuchsia-500 fill-fuchsia-500'} />
          <span className={`font-black text-[10px] ${task.completed ? 'text-slate-400' : 'text-fuchsia-600 dark:text-fuchsia-400'}`}>
            +{expValue}
          </span>
        </div>
        
        <Button 
          isIconOnly
          size="sm"
          onPress={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 border-none text-red-500 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800"
        >
          <Trash2 size={16} />
        </Button>
      </Card.Content>
    </Card>
  );
}
