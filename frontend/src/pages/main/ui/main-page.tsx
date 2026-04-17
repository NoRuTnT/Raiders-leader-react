import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BellRing, Clock3, HeartPulse } from "lucide-react";
import { useAppStore } from "@/entities/app/model/app-store";
import { env } from "@/shared/config/env";

const AUTO_ROTATE_MS = 5000;
const HEALTH_CHECK_INTERVAL_MS = 60_000;

const carouselItems = [
  {
    id: "party-management",
    eyebrow: "Party Management",
    title: "파티관리에 들어가 이번 주 운영 흐름을 바로 정리합니다.",
    description:
      "생성된 파티 목록을 보고 진행 여부를 체크하고, 새 파티를 추가하거나 기존 구성을 수정할 수 있습니다.",
    buttonLabel: "파티관리로 이동",
    action: "party-management" as const,
    imagePath: "/party-scheduling-hero.png",
    imageAlt: "파티 스케줄링 서비스 소개 이미지",
  },
  {
    id: "larabot",
    eyebrow: "Larabot",
    title: "라라봇 페이지에서 보조 기능과 확장 영역을 준비합니다.",
    description:
      "라라봇은 이 서버의 보조 서비스를 연결하는 공간입니다. 이후 안내와 도구를 위한 영역으로 확장합니다.",
    buttonLabel: "라라봇으로 이동",
    action: "larabot" as const,
    imagePath: "/hero-lalabot.png",
    imageAlt: "라라봇 서비스 소개 이미지",
  },
] as const;

const updates = [
  {
    date: "2026.04.10",
    title: "Noru.gg 브랜딩 리뉴얼",
    description: "상단 로고와 메인페이지 톤을 갈색과 노란색의 파스텔 계열로 정비했습니다.",
  },
  {
    date: "2026.04.09",
    title: "메인 허브 구조 개편",
    description: "메인페이지, 라라봇, 파티관리의 1차 구조를 정리하고 파티관리 내부 동선을 분리했습니다.",
  },
  {
    date: "2026.04.07",
    title: "프론트엔드 기반 정리",
    description: "Vite 기반으로 마이그레이션하고 폴더 구조를 pages / features / entities / shared 기준으로 재배치했습니다.",
  },
];

type HealthState = "checking" | "healthy" | "unhealthy";

interface ServiceHealthItem {
  label: string;
  status: string;
  tone: string;
  checkedAt: string;
}

const initialServiceHealth: ServiceHealthItem[] = [
  {
    label: "Spring Server",
    status: "확인 중...",
    tone: "bg-[#efe2bf] text-[#7b5a27]",
    checkedAt: "첫 상태를 확인하고 있습니다.",
  },
  {
    label: "Larabot",
    status: "확인 중...",
    tone: "bg-[#efe2bf] text-[#7b5a27]",
    checkedAt: "첫 상태를 확인하고 있습니다.",
  },
];

export function MainPage() {
  const { setActivePrimaryTab } = useAppStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [rotationKey, setRotationKey] = useState(0);
  const [serviceHealth, setServiceHealth] = useState<ServiceHealthItem[]>(initialServiceHealth);

  useEffect(() => {
    const carouselTimer = window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
      setRotationKey((prev) => prev + 1);
    }, AUTO_ROTATE_MS);

    return () => {
      window.clearTimeout(carouselTimer);
    };
  }, [activeIndex, rotationKey]);

  useEffect(() => {
    const timeTimer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timeTimer);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const updateHealth = async () => {
      const results = await Promise.all([
        checkHealth(env.springHealthUrl, "Spring Server"),
        checkHealth(env.lalabotHealthUrl, "Lalabot"),
      ]);

      if (!isMounted) {
        return;
      }

      setServiceHealth(results);
    };

    void updateHealth();

    const intervalId = window.setInterval(() => {
      void updateHealth();
    }, HEALTH_CHECK_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const activeItem = carouselItems[activeIndex];

  const serverDate = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(currentTime),
    [currentTime],
  );

  const serverTime = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(currentTime),
    [currentTime],
  );

  const handlePrimaryAction = () => {
    setActivePrimaryTab(activeItem.action);
  };

  const moveSlide = (direction: "prev" | "next") => {
    setActiveIndex((prev) =>
      direction === "next" ? (prev + 1) % carouselItems.length : (prev - 1 + carouselItems.length) % carouselItems.length,
    );
    setRotationKey((prev) => prev + 1);
  };

  const selectSlide = (index: number) => {
    setActiveIndex(index);
    setRotationKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 overflow-hidden rounded-[36px] border border-[#e7d5b2] bg-[#fff9ed] shadow-[0_24px_70px_rgba(120,86,36,0.08)] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col justify-between p-8 md:p-10">
          <div>
            <span className="inline-flex rounded-full bg-[#f4deb3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8e5f22]">
              {activeItem.eyebrow}
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#3f2b1a] md:text-5xl">{activeItem.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#6b5641] md:text-lg">{activeItem.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="inline-flex items-center gap-2 rounded-full bg-[#5f4124] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4e341d]"
            >
              {activeItem.buttonLabel}
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="이전 카드"
                onClick={() => moveSlide("prev")}
                className="text-lg font-semibold text-[#7b5428] transition hover:text-[#4e341d]"
              >
                {"<"}
              </button>

              <div className="flex items-center gap-2">
                {carouselItems.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`${item.eyebrow} 보기`}
                    onClick={() => selectSlide(index)}
                    className={`h-2.5 rounded-full transition ${
                      activeIndex === index ? "w-8 bg-[#7b5428]" : "w-2.5 bg-[#d9c29a] hover:bg-[#bea378]"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                aria-label="다음 카드"
                onClick={() => moveSlide("next")}
                className="text-lg font-semibold text-[#7b5428] transition hover:text-[#4e341d]"
              >
                {">"}
              </button>
            </div>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(255,247,209,0.95),_transparent_36%),linear-gradient(180deg,_#fff7e3_0%,_#f3e1b8_100%)]">
          {carouselItems.map((item, index) => (
            <img
              key={item.id}
              src={item.imagePath}
              alt={item.imageAlt}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out ${
                activeIndex === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(111,73,31,0.12)_0%,rgba(111,73,31,0.22)_100%)]" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-[#e7d5b2] bg-[#fffaf0] p-6 shadow-sm">
          <BellRing className="h-6 w-6 text-[#a86821]" />
          <h2 className="mt-4 text-xl font-semibold text-[#3f2b1a]">최근 변경사항</h2>
          <div className="mt-4 space-y-4">
            {updates.map((item) => (
              <div key={item.title} className="rounded-2xl bg-[#f9f0da] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a7a51]">{item.date}</p>
                <p className="mt-2 text-sm font-semibold text-[#3f2b1a]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#6b5641]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#e7d5b2] bg-[#fffaf0] p-6 shadow-sm">
          <Clock3 className="h-6 w-6 text-[#cb8d2a]" />
          <h2 className="mt-4 text-xl font-semibold text-[#3f2b1a]">서버 시간</h2>
          <div className="mt-5 rounded-[24px] bg-[#f9f0da] p-5">
            <p className="text-sm font-medium text-[#8d775f]">Asia/Seoul 기준</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-[#3f2b1a]">{serverTime}</p>
            <p className="mt-2 text-sm leading-6 text-[#6b5641]">{serverDate}</p>
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.12em] text-[#9a7a51]">실시간 갱신 중</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#e7d5b2] bg-[#fffaf0] p-6 shadow-sm">
          <HeartPulse className="h-6 w-6 text-[#8e5f22]" />
          <h2 className="mt-4 text-xl font-semibold text-[#3f2b1a]">서버 상태 확인</h2>
          <div className="mt-4 space-y-3">
            {serviceHealth.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-[#f9f0da] px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#3f2b1a]">{item.label}</p>
                  <p className="mt-1 text-xs text-[#8d775f]">마지막 확인: {item.checkedAt}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

async function checkHealth(url: string, label: string): Promise<ServiceHealthItem> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    let healthState: HealthState = response.ok ? "healthy" : "unhealthy";

    if (response.ok) {
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const data = (await response.json()) as { status?: string };
        if (data.status && data.status.toUpperCase() !== "UP") {
          healthState = "unhealthy";
        }
      }
    }

    return {
      label,
      ...mapHealthState(healthState),
      checkedAt: formatCheckedAt(new Date()),
    };
  } catch {
    return {
      label,
      ...mapHealthState("unhealthy"),
      checkedAt: formatCheckedAt(new Date()),
    };
  }
}

function mapHealthState(state: HealthState) {
  switch (state) {
    case "healthy":
      return {
        status: "정상",
        tone: "bg-emerald-100 text-emerald-700",
      };
    case "checking":
      return {
        status: "확인 중...",
        tone: "bg-[#efe2bf] text-[#7b5a27]",
      };
    default:
      return {
        status: "오류",
        tone: "bg-rose-100 text-rose-700",
      };
  }
}

function formatCheckedAt(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}
