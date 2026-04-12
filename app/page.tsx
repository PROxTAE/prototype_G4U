import TopBar from "@/components/TopBar";
import LeftMenu from "@/components/LeftMenu";
import RightActions from "@/components/RightActions";
import BottomNav from "@/components/BottomNav";
import StatusBar from "@/components/StatusBar";
import CharacterDisplay from "@/components/CharacterDisplay";
import GridBackground from "@/components/GridBackground";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-white dark:bg-black flex items-center justify-center transition-colors">
      {/* Fullscreen App Container */}
      <div className="relative w-full h-[100dvh] overflow-hidden transition-colors">
        {/* Background elements */}
        <GridBackground />

        {/* UI Layers */}
        <TopBar />
        <CharacterDisplay />
        <LeftMenu />
        <RightActions />
        <StatusBar />
        <BottomNav />

      </div>
    </div>
  );
}

