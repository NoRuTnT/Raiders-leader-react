import { act, render, screen } from "@testing-library/react";
import App from "@/app/App";
import { useCharacterStore } from "@/entities/character/model/character-store";
import { useDungeonStore } from "@/entities/dungeon/model/dungeon-store";
import { usePartyStore } from "@/entities/party/model/party-store";

vi.mock("sonner", () => ({
  toast: vi.fn(),
}));

vi.mock("@/pages/main/ui/main-page", () => ({
  MainPage: () => <div>Main Page</div>,
}));

vi.mock("@/pages/larabot/ui/larabot-page", () => ({
  LarabotPage: () => <div>Larabot Page</div>,
}));

vi.mock("@/pages/party-management/ui/party-management-page", () => ({
  PartyManagementPage: () => <div>Party Management Page</div>,
}));

vi.mock("@/pages/log-analysis/ui/log-analysis-page", () => ({
  LogAnalysisPage: () => <div>Log Analysis Page</div>,
}));

beforeEach(() => {
  useCharacterStore.setState({
    characters: [],
    isLoading: false,
    error: null,
    fetchCharacterStore: vi.fn(async () => {}),
  });

  usePartyStore.setState({
    parties: [],
    isLoading: false,
    error: null,
    fetchPartyStore: vi.fn(async () => {}),
  });

  useDungeonStore.setState({
    dungeons: [],
    isLoading: false,
    error: null,
    fetchDungeonStore: vi.fn(async () => {}),
  });
});

describe("App", () => {
  it("renders the primary navigation", async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByRole("button", { name: "메인페이지" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "라라봇" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "파티관리" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그분석" })).toBeInTheDocument();
  });
});
