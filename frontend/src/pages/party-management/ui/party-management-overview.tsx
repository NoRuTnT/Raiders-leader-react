import { useMemo, type ReactNode } from "react";
import { CalendarDays, ChevronRight, LayoutDashboard, UserRound, Wrench } from "lucide-react";
import { useAppStore } from "@/entities/app/model/app-store";
import { useCharacterStore } from "@/entities/character/model/character-store";
import { useDungeonStore } from "@/entities/dungeon/model/dungeon-store";
import { usePartyStore } from "@/entities/party/model/party-store";
import { CharacterCard } from "@/features/character/ui/character-card";

function SummaryCard({
  label,
  value,
  description,
  onClick,
}: {
  label: string;
  value: string | number;
  description: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <p className="text-sm font-medium text-[#8d775f]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[#3f2b1a]">{value}</p>
      <p className="mt-2 text-sm text-[#6b5641]">{description}</p>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded-3xl border border-[#e7d5b2] bg-[#fffaf0] p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d5b98a] hover:shadow-md"
      >
        {content}
      </button>
    );
  }

  return <div className="rounded-3xl border border-[#e7d5b2] bg-[#fffaf0] p-6 shadow-sm">{content}</div>;
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

  const topCharacters = useMemo(
    () => [...characters].sort((a, b) => b.fame - a.fame).slice(0, 3),
    [characters],
  );

  const moveToPartyPage = (tab: "characters" | "schedule" | "editor") => {
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
            한 화면에서 빠르게 확인합니다
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6b5641] md:text-lg">
            기존 메인 화면에 있던 파티 리스트와 스케줄링 흐름을 파티관리 내부로 옮겼습니다. 현재 상태를 먼저 보고,
            필요한 작업은 아래 메뉴로 바로 이동할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="총 파티 수"
          value={summary.partyCount}
          description="현재 등록된 전체 파티 개수"
          onClick={() => moveToPartyPage("schedule")}
        />
        <SummaryCard
          label="대기 중 파티"
          value={summary.waitingParties}
          description="이번 주 진행 체크가 아직 남은 파티"
          onClick={() => moveToPartyPage("schedule")}
        />
        <SummaryCard label="완료 파티" value={summary.doneParties} description="이번 주 진행 완료 처리된 파티" />
        <SummaryCard
          label="보유 캐릭터 / 던전"
          value={`${summary.characterCount} / ${summary.dungeonCount}`}
          description="파티 편성에 사용할 기본 데이터"
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
              <p className="text-sm text-[#6b5641]">자주 사용하는 파티관리 작업으로 바로 이동합니다.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <QuickActionCard
              icon={<UserRound className="h-5 w-5" />}
              title="캐릭터 리스트"
              description="파티 편성에 사용할 캐릭터를 검색하고 등록합니다."
              onClick={() => moveToPartyPage("characters")}
            />
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
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-[#3f2b1a]">캐릭터 명성 TOP 3</h3>
              <p className="mt-1 text-sm text-[#6b5641]">현재 등록된 캐릭터 중 명성이 높은 순서대로 보여줍니다.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {topCharacters.length > 0 ? (
              topCharacters.map((character, index) => (
                <div key={character.characterId} className="space-y-2">
                  <p className="text-sm font-semibold text-[#8d775f]">{index + 1}위</p>
                  <CharacterCard character={character} />
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-[#f9f0da] p-4 text-sm text-[#6b5641]">
                아직 등록된 캐릭터가 없습니다. 캐릭터 리스트에서 먼저 등록해보세요.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
