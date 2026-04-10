"use client";

import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppStore, type PartyManagementTab } from "@/entities/app/model/app-store";
import { useCharacterStore } from "@/entities/character/model/character-store";
import { useDungeonStore } from "@/entities/dungeon/model/dungeon-store";
import { usePartyStore } from "@/entities/party/model/party-store";
import { LarabotPage } from "@/pages/larabot/ui/larabot-page";
import { MainPage } from "@/pages/main/ui/main-page";
import { PartyManagementPage } from "@/pages/party-management/ui/party-management-page";

const primaryTabs = [
  { value: "main", label: "메인페이지" },
  { value: "larabot", label: "라라봇" },
] as const;

const partyMenuItems: { value: PartyManagementTab; label: string; description: string }[] = [
  {
    value: "overview",
    label: "파티관리 메인",
    description: "운영 현황과 빠른 진입 동선을 확인합니다.",
  },
  {
    value: "schedule",
    label: "파티 리스트 및 스케줄링",
    description: "이번 주 진행 여부를 체크하고 파티 목록을 관리합니다.",
  },
  {
    value: "editor",
    label: "파티 추가 / 수정",
    description: "새 파티를 만들거나 기존 파티 구성을 수정합니다.",
  },
];

function App() {
  const { activePrimaryTab, setActivePrimaryTab, setActivePartyManagementTab } = useAppStore();
  const { fetchCharacterStore, isLoading: charactersLoading, error: charactersError } = useCharacterStore();
  const { fetchPartyStore, isLoading: partiesLoading, error: partiesError } = usePartyStore();
  const { fetchDungeonStore, isLoading: dungeonsLoading, error: dungeonsError } = useDungeonStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([fetchCharacterStore(), fetchPartyStore(), fetchDungeonStore()]);
    };

    fetchInitialData();
  }, [fetchCharacterStore, fetchPartyStore, fetchDungeonStore]);

  useEffect(() => {
    if (charactersError) toast("charactersError");
    if (partiesError) toast("partiesError");
    if (dungeonsError) toast("dungeonsError");
  }, [charactersError, partiesError, dungeonsError]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isLoading = charactersLoading || partiesLoading || dungeonsLoading;

  const moveToPartyManagement = (tab: PartyManagementTab) => {
    setActivePrimaryTab("party-management");
    setActivePartyManagementTab(tab);
  };

  const renderActivePage = () => {
    switch (activePrimaryTab) {
      case "larabot":
        return <LarabotPage />;
      case "party-management":
        return <PartyManagementPage />;
      case "main":
      default:
        return <MainPage />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[linear-gradient(180deg,_#fff8eb_0%,_#f2e2bd_100%)] text-[#3f2b1a]">
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#382414]/40">
            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-lg">
              <Loader2 className="h-5 w-5 animate-spin text-[#a86821]" />
              <span className="text-sm font-medium text-[#5e4328]">데이터를 불러오는 중입니다.</span>
            </div>
          </div>
        )}

        <header className="sticky top-0 z-30">
          <div
            className={`w-full transition-all duration-300 ${
              isScrolled
                ? "border-b border-[#e6cf9f] bg-[#fff6e5]/95 shadow-[0_16px_40px_rgba(107,86,65,0.10)] backdrop-blur-md"
                : "border-b border-transparent bg-[#fff6e5]"
            }`}
          >
            <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 md:px-8 lg:flex-row lg:items-end lg:justify-between">
              <button type="button" onClick={() => setActivePrimaryTab("main")} className="shrink-0 text-left">
                <img src="/norugg-logo.png" alt="Noru.gg" className="h-12 w-auto md:h-14" />
              </button>

              <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-[#8d775f]">
                {primaryTabs.map((tab) => {
                  const isActive = activePrimaryTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setActivePrimaryTab(tab.value)}
                      className={`border-b pb-2 transition ${
                        isActive
                          ? "border-[#6a4a28] text-[#3f2b1a]"
                          : "border-transparent hover:border-[#d2b17a] hover:text-[#5f4124]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}

                <div className="group relative">
                  <button
                    type="button"
                    onClick={() => moveToPartyManagement("overview")}
                    className={`border-b pb-2 transition ${
                      activePrimaryTab === "party-management"
                        ? "border-[#6a4a28] text-[#3f2b1a]"
                        : "border-transparent hover:border-[#d2b17a] hover:text-[#5f4124]"
                    }`}
                  >
                    파티관리
                  </button>

                  <div className="pointer-events-none absolute right-0 top-full z-40 h-4 w-full" />
                  <div className="pointer-events-none absolute right-0 top-full z-40 pt-4 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="min-w-[320px] translate-y-2 rounded-[28px] border border-[#e7d5b2] bg-[#fffaf0]/97 p-2 shadow-[0_24px_60px_rgba(95,65,36,0.14)] backdrop-blur-md transition duration-200 group-hover:translate-y-0">
                      {partyMenuItems.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => moveToPartyManagement(item.value)}
                          className="flex w-full flex-col rounded-[20px] px-4 py-3 text-left transition hover:bg-[#f9efd9]"
                        >
                          <span className="text-sm font-semibold text-[#3f2b1a]">{item.label}</span>
                          <span className="mt-1 text-xs leading-5 text-[#7b654d]">{item.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </header>

        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1440px] flex-col px-4 py-6 md:px-8">
          <main className="flex-1">{renderActivePage()}</main>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
