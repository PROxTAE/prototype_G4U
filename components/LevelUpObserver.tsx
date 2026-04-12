"use client";
import { useEffect, useState, useRef } from "react";
import { useUserStore } from "@/features/user/useUserStore";
import LevelUpModal from "./LevelUpModal";

export default function LevelUpObserver() {
  const { user, loadUser } = useUserStore();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const prevLevelRef = useRef<number | null>(null);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (user) {
      if (prevLevelRef.current !== null && user.level > prevLevelRef.current) {
        setNewLevel(user.level);
        setShowLevelUp(true);
      }
      prevLevelRef.current = user.level;
    }
  }, [user]);

  const handleClose = () => {
    setShowLevelUp(false);
  };

  return (
    <LevelUpModal 
      level={newLevel} 
      isOpen={showLevelUp} 
      onClose={handleClose} 
    />
  );
}
