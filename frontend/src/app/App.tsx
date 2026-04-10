"use client";

import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LarabotPage } from "@/components/larabot-page";
import { MainPage } from "@/components/main-page";
import { PartyManagementPage } from "@/components/party-management-page";
import { useCharacterStore } from "@/lib/stores/characterStore";
import { useDungeonStore } from "@/lib/stores/dungeonStore";
import { usePartyStore } from "@/lib/stores/partyStore";
import { useAppStore, type PartyManagementTab } from "@/lib/stores/appStore";

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
      <div className="min-h-screen bg-[linear-gradient(180deg,_#f6f9fc_0%,_#eef4fb_100%)] text-slate-950">
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55">
            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-lg">
              <Loader2 className="h-5 w-5 animate-spin text-sky-600" />
              <span className="text-sm font-medium text-slate-800">데이터를 불러오는 중입니다.</span>
            </div>
          </div>
        )}

        <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-4 py-6 md:px-8">
          <header className="sticky top-0 z-30 -mx-4 px-4 pt-2 md:-mx-8 md:px-8">
            <div
              className={`transition-all duration-300 ${
                isScrolled
                  ? "border-b border-slate-200/90 bg-[#f6f9fc]/95 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-md"
                  : "border-b border-transparent bg-[#f6f9fc]"
              }`}
            >
              <div className="mx-auto flex max-w-[1440px] flex-col gap-4 py-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="shrink-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Raiders Leader</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">서버 운영 메인 허브 리메이크</p>
                </div>

                <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
                  {primaryTabs.map((tab) => {
                    const isActive = activePrimaryTab === tab.value;
                    return (
                      <button
                        key={tab.value}
                        type="button"
                        onClick={() => setActivePrimaryTab(tab.value)}
                        className={`border-b pb-2 transition ${
                          isActive
                            ? "border-slate-950 text-slate-950"
                            : "border-transparent hover:border-slate-300 hover:text-slate-900"
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
                          ? "border-slate-950 text-slate-950"
                          : "border-transparent hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      파티관리
                    </button>

                    <div className="pointer-events-none absolute right-0 top-full z-40 h-4 w-full" />
                    <div className="pointer-events-none absolute right-0 top-full z-40 pt-4 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                      <div className="min-w-[320px] translate-y-2 rounded-[28px] border border-slate-200/90 bg-white/96 p-2 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-md transition duration-200 group-hover:translate-y-0">
                        {partyMenuItems.map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => moveToPartyManagement(item.value)}
                            className="flex w-full flex-col rounded-[20px] px-4 py-3 text-left transition hover:bg-slate-50"
                          >
                            <span className="text-sm font-semibold text-slate-950">{item.label}</span>
                            <span className="mt-1 text-xs leading-5 text-slate-500">{item.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1 py-6">{renderActivePage()}</main>
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
