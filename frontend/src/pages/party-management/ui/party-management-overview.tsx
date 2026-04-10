import { useMemo, type ReactNode } from "react";
import { CalendarDays, ChevronRight, LayoutDashboard, Wrench } from "lucide-react";
import { useAppStore } from "@/entities/app/model/app-store";
import { useCharacterStore } from "@/entities/character/model/character-store";
import { useDungeonStore } from "@/entities/dungeon/model/dungeon-store";
import { usePartyStore } from "@/entities/party/model/party-store";

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-[#e7d5b2] bg-[#fffaf0] p-6 shadow-sm">
      <p className="text-sm font-medium text-[#8d775f]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[#3f2b1a]">{value}</p>
      <p className="mt-2 text-sm text-[#6b5641]">{description}</p>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-3xl border border-[#e7d5b2] bg-[#fffaf0] p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d5b98a] hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-[#f6e6be] p-3 text-[#8e5f22]">{icon}</div>
        <div>
          <p className="text-base font-semibold text-[#3f2b1a]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[#6b5641]">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-[#b39b78] transition group-hover:text-[#7f5d35]" />
    </button>
  );
}

export function PartyManagementOverview() {
  const { characters } = useCharacterStore();
  const { dungeons } = useDungeonStore();
  const { parties } = usePartyStore();
  const { setActivePartyManagementTab, setEditingParty } = useAppStore();

  const summary = useMemo(() => {
    const doneParties = parties.filter((party) => party.progress === "DONE").length;
    const waitingParties = parties.filter((party) => party.progress === "WAITING").length;

    return {
      characterCount: characters.length,
      dungeonCount: dungeons.length,
      partyCount: parties.length,
      doneParties,
      waitingParties,
    };
  }, [characters, dungeons, parties]);

  const moveToPartyPage = (tab: "schedule" | "editor") => {
    setEditingParty(null);
    setActivePartyManagementTab(tab);
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(253,235,182,0.9),_transparent_38%),linear-gradient(135deg,_#fff9ec_0%,_#f7ecd2_52%,_#efddba_100%)] p-8 shadow-sm ring-1 ring-[#e7d5b2] md:p-10">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-[#5f4124] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            Party Management Hub
          </span>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[#3f2b1a] md:text-5xl">
            이번 주 파티 운영 현황을
            <br />
            이 화면에서 빠르게 확인합니다
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6b5641] md:text-lg">
            기존 메인 화면이 맡고 있던 파티 리스트와 스케줄링 흐름을 파티관리 내부로 옮겼습니다. 현재 상태를 먼저
            보고, 필요한 작업은 아래 세부 화면으로 이동하는 구조를 사용합니다.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="총 파티 수" value={summary.partyCount} description="현재 등록된 전체 파티 개수" />
        <SummaryCard label="이번 주 대기 파티" value={summary.waitingParties} description="아직 진행 체크가 되지 않은 파티" />
        <SummaryCard label="완료 파티" value={summary.doneParties} description="이번 주 진행 완료 처리된 파티" />
        <SummaryCard
          label="보유 캐릭터 / 던전"
          value={`${summary.characterCount} / ${summary.dungeonCount}`}
          description="파티 편성에 사용되는 기본 데이터"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-[#e7d5b2] bg-[#fffaf0] p-6 shadow-sm md:p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#f6e6be] p-3 text-[#8e5f22]">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#3f2b1a]">빠른 작업</h3>
              <p className="text-sm text-[#6b5641]">파티관리 안에서 자주 사용하는 작업으로 바로 이동합니다.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <QuickActionCard
              icon={<CalendarDays className="h-5 w-5" />}
              title="파티 리스트 및 스케줄링"
              description="생성된 파티 목록을 보고 이번 주 진행 여부를 체크합니다."
              onClick={() => moveToPartyPage("schedule")}
            />
            <QuickActionCard
              icon={<Wrench className="h-5 w-5" />}
              title="파티 추가 / 수정"
              description="새 파티를 만들거나 기존 파티 구성을 수정합니다."
              onClick={() => moveToPartyPage("editor")}
            />
          </div>
        </div>

        <div className="rounded-[32px] border border-[#e7d5b2] bg-[#fffaf0] p-6 shadow-sm md:p-7">
          <h3 className="text-xl font-semibold text-[#3f2b1a]">현재 파티관리 구조</h3>
          <div className="mt-5 space-y-4 text-sm leading-6 text-[#6b5641]">
            <div className="rounded-2xl bg-[#f9f0da] p-4">
              <p className="font-semibold text-[#3f2b1a]">최초 진입</p>
              <p className="mt-1">파티관리 허브에서 현재 상태와 진입점을 먼저 확인합니다.</p>
            </div>
            <div className="rounded-2xl bg-[#f9f0da] p-4">
              <p className="font-semibold text-[#3f2b1a]">2차 구조</p>
              <p className="mt-1">파티 리스트 및 스케줄링, 파티 추가 / 수정</p>
            </div>
            <div className="rounded-2xl bg-[#f6e6be] p-4 text-[#70481a]">
              <p className="font-semibold">재사용 기준</p>
              <p className="mt-1">
                기존 메인 로직은 파티관리 내부에서 재사용하고, 메인페이지는 Noru.gg 소개 랜딩으로 분리합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
