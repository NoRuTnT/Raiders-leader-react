import { Bot, Sparkles } from "lucide-react";

export function LarabotPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">라라봇 페이지</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              라라봇 관련 기능을 메인 허브 구조 안으로 편입하기 위한 전용 페이지입니다. 현재는 리메이크
              중이므로 소개와 확장 방향을 먼저 정리합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-slate-950">예정 역할</h2>
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
            <li>봇 관련 안내와 빠른 실행 진입점</li>
            <li>서버 운영을 돕는 보조 기능 모음</li>
            <li>향후 자동화 또는 챗 인터랙션 확장 영역</li>
          </ul>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <h2 className="text-lg font-semibold">현재 상태</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            메인페이지와 파티 관리 페이지 구조를 먼저 안정화한 뒤, 라라봇 전용 경험을 이 페이지에 확장할
            예정입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
