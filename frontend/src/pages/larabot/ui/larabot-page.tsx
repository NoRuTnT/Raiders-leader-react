import { Bot, Sparkles } from "lucide-react";

export function LarabotPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-[#e7d5b2] bg-[#fff9ed] p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#f4deb3] p-3 text-[#8e5f22]">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#3f2b1a]">라라봇 페이지</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#6b5641]">
              라라봇 관련 기능을 Noru.gg 안에 자연스럽게 연결하기 위한 소개 페이지입니다. 현재는 메인 구조와
              파티관리 흐름을 먼저 정리한 상태라, 이후 라라봇 경험을 이 공간에 맞게 확장할 예정입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] border border-[#e7d5b2] bg-[#fffaf0] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-[#cb8d2a]" />
            <h2 className="text-lg font-semibold text-[#3f2b1a]">예정된 역할</h2>
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-[#6b5641]">
            <li>게임 정보와 안내 흐름 정리</li>
            <li>서버 운영을 보조하는 전용 기능 연결</li>
            <li>향후 자동화 또는 챗 인터랙션 확장</li>
          </ul>
        </div>
        <div className="rounded-[28px] border border-[#8e6c3d] bg-[#5e4328] p-6 text-white shadow-sm">
          <h2 className="text-lg font-semibold">현재 상태</h2>
          <p className="mt-4 text-sm leading-6 text-[#f5e6c8]">
            Noru.gg의 메인 랜딩과 파티관리 구조를 먼저 안정화한 뒤, 라라봇 전용 경험을 이 브랜드 톤에 맞게
            확장하는 단계입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
