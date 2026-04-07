import { render, screen } from "@testing-library/react";
import App from "@/app/App";

describe("App", () => {
  it("renders the main tab navigation", () => {
    render(<App />);

    expect(screen.getByRole("tab", { name: "파티 리스트" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "캐릭터 목록" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "파티 관리" })).toBeInTheDocument();
  });
});
