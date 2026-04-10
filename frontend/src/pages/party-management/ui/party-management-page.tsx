import { useAppStore } from "@/entities/app/model/app-store";
import { PartyAdd } from "@/features/party/ui/party-add";
import { PartyList } from "@/features/party/ui/party-list";
import { CharacterManagementPage } from "@/pages/party-management/ui/character-management-page";
import { PartyManagementOverview } from "@/pages/party-management/ui/party-management-overview";

export function PartyManagementPage() {
  const { activePartyManagementTab, editingParty, isUsingMockData } = useAppStore();

  const content =
    activePartyManagementTab === "overview" ? (
      <PartyManagementOverview />
    ) : activePartyManagementTab === "characters" ? (
      <CharacterManagementPage />
    ) : activePartyManagementTab === "schedule" ? (
      <PartyList />
    ) : (
      <PartyAdd />
    );

  return (
    <div className="space-y-6">
      {isUsingMockData ? (
        <div className="rounded-2xl border border-[#e5c98f] bg-[#fff4d8] px-4 py-3 text-sm text-[#6a4a28]">
          현재 백엔드 서버가 오프라인 상태라 더미 데이터로 파티관리 화면을 테스트 중입니다.
        </div>
      ) : null}

      {editingParty && activePartyManagementTab === "editor" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          현재 파티 수정 모드입니다. 저장하거나 취소하면 목록 화면으로 다시 돌아갈 수 있습니다.
        </div>
      ) : null}

      <section>{content}</section>
    </div>
  );
}
