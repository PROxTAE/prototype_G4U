import { Task } from "@/types";
import { Condition, DailyQuest } from "@/types/quest";

/**
 * Check if a completed task fulfills a part of the daily quest condition
 */
export const evaluateTaskForQuest = (task: Task, quest: DailyQuest): boolean => {
  if (quest.completed) return false;

  const { condition } = quest;

  switch (condition.type) {
    case "complete_task_count":
      // Any task counts
      return true;

    case "complete_task_with_tag":
      // Currently tasks might not have a formal 'tag' property in current schema, 
      // but we can check if the title or card (book) matches the tag. 
      // In a real system, Task would have tags: string[]
      // For now, let's assume 'tag' can match the Card label or a hidden tag.
      // We'll mock tag check by checking if title contains the word for now, or if it has a data tag.
      return task.title.toLowerCase().includes(condition.tag.toLowerCase());

    default:
      return false;
  }
};
