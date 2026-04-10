import { render, screen } from "@testing-library/react";
import App from "@/app/App";

describe("App", () => {
  it("renders the primary navigation", () => {
    render(<App />);

    expect(screen.getByRole("button", { name: "메인페이지" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "라라봇" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "파티관리" })).toBeInTheDocument();
  });
});
