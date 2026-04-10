import { useAppStore } from "@/entities/app/model/app-store";
import { PartyAdd } from "@/features/party/ui/party-add";
import { PartyList } from "@/features/party/ui/party-list";
import { PartyManagementOverview } from "@/pages/party-management/ui/party-management-overview";

export function PartyManagementPage() {
  const { activePartyManagementTab, editingParty } = useAppStore();

  const content =
    activePartyManagementTab === "overview" ? (
      <PartyManagementOverview />
    ) : activePartyManagementTab === "schedule" ? (
      <PartyList />
    ) : (
      <PartyAdd />
    );

  return (
    <div className="space-y-6">
      {editingParty && activePartyManagementTab === "editor" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          현재 파티 수정 모드입니다. 저장하거나 취소하면 목록 화면으로 다시 돌아갈 수 있습니다.
        </div>
      ) : null}

      <section>{content}</section>
    </div>
  );
}
