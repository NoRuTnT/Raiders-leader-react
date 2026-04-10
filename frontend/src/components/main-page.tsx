import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/stores/appStore";

export function MainPage() {
  const { setActivePrimaryTab } = useAppStore();

  return (
    <div className="space-y-8">
      <section className="grid gap-6 overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between p-8 md:p-10">
          <div>
            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-sky-700 uppercase">
              Server Introduction
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Raiders Leader 서버를
              <br />
              소개하는 메인페이지
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              이 화면은 별도의 관리 기능을 바로 수행하는 페이지가 아니라, 서버의 분위기와 운영 방향을 소개하는
              랜딩 페이지로 사용합니다. 실제 파티 관리나 스케줄링 작업은 상단의 `파티관리` 탭에서 진행합니다.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActivePrimaryTab("party-management")}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              파티관리로 이동
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setActivePrimaryTab("larabot")}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              라라봇 보기
            </button>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden bg-[linear-gradient(135deg,_#dff3ff_0%,_#eff8ff_45%,_#f8fbff_100%)]">
          <img src="/give.jpg" alt="서버 대표 이미지" className="h-full w-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.55))]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
            <p className="text-sm font-semibold tracking-[0.14em] uppercase text-white/80">Community First</p>
            <p className="mt-2 text-2xl font-semibold">파티, 일정, 봇 기능을 하나의 허브에서 연결합니다.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <ShieldCheck className="h-6 w-6 text-sky-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950">서버 운영 중심</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            서버 소개와 운영 방향을 먼저 보여주고, 실제 관리 기능은 전용 탭으로 분리합니다.
          </p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Sparkles className="h-6 w-6 text-amber-500" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950">단순한 첫 인상</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            메인페이지에서는 복잡한 상호작용보다 이미지와 텍스트 중심의 랜딩 경험을 우선합니다.
          </p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <ArrowRight className="h-6 w-6 text-slate-700" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950">명확한 진입 흐름</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            사용자는 메인페이지에서 서버를 이해하고, 필요한 경우 라라봇과 파티관리로 이동합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
