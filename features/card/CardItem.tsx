import { Trash2, Book } from "lucide-react";
import { Card as CardType } from "@/types";
import { Card, Button } from "@heroui/react";

interface CardItemProps {
  card: CardType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CardItem({ card, isSelected, onSelect, onDelete }: CardItemProps) {
  return (
    <Card 
      onClick={() => onSelect(card.id)}
      className={`group w-full transition-all border-2 shadow-none cursor-pointer ${
        isSelected 
        ? "bg-slate-100 dark:bg-zinc-800/80 border-cyan-500 dark:border-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
        : "bg-white dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
      }`}
    >
      <Card.Content className="flex flex-row items-center justify-between p-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'}`}>
            <Book size={20} />
          </div>
          <span className={`font-black text-lg transition-colors truncate ${isSelected ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-zinc-300'}`}>
            {card.title}
          </span>
        </div>
        
        <Button 
          isIconOnly
          onPress={() => onDelete(card.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity border-none text-red-500 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800"
        >
          <Trash2 size={18} />
        </Button>
      </Card.Content>
    </Card>
  );
}
