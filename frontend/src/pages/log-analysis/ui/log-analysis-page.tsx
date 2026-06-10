import { useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, BarChart3, FileText, LockKeyhole, Shield, Sparkles, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { analyzeLogsWithMcp, type LogAnalysisResult } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

const ADMIN_PASSWORD = "0302";
const EXAMPLE_PROMPTS = [
  "최근 30분 서버 상태랑 에러 로그를 분석해줘",
  "최근 2시간 동안 장애 징후가 있었는지 요약해줘",
  "최근 7일 보안 관련 위험 로그를 정리해줘",
];

type OpsPromptResult = {
  prompt?: string;
  selected_tool?: string;
  arguments?: {
    minutes?: number;
    days?: number;
    [key: string]: unknown;
  };
  result?: {
    summary?: string;
    time_range_minutes?: number;
    failed_path_count?: number;
    error_log_count?: number;
    key_points?: string[];
    findings?: string[];
    recommendations?: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export function LogAnalysisPage() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<LogAnalysisResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const normalizedResult = useMemo(() => normalizeResult(result), [result]);

  const prettyJson = useMemo(() => {
    if (!result) {
      return "";
    }

    try {
      return JSON.stringify(result.parsedData, null, 2);
    } catch {
      return result.rawText;
    }
  }, [result]);

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      setIsUnlocked(true);
      setErrorMessage("");
      toast("로그분석 페이지에 진입했습니다.");
      return;
    }

    setErrorMessage("비밀번호가 올바르지 않습니다.");
    toast("비밀번호가 일치하지 않습니다.");
  };

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      setErrorMessage("분석할 요청을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const analysisResult = await analyzeLogsWithMcp({ prompt: prompt.trim() });
      setResult(analysisResult);
    } catch (error) {
      const message = error instanceof Error ? error.message : "로그 분석 요청에 실패했습니다.";
      setErrorMessage(message);
      toast("로그 분석 요청에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isUnlocked) {
    return (
      <section className="mx-auto max-w-2xl">
        <Card className="rounded-[32px] border border-[#e7d5b2] bg-[#fff9ed] py-0 shadow-[0_24px_70px_rgba(120,86,36,0.08)]">
          <CardHeader className="px-8 pt-8">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4deb3] text-[#8e5f22]">
              <LockKeyhole className="h-7 w-7" />
            </div>
            <CardTitle className="text-3xl font-semibold tracking-tight text-[#3f2b1a]">로그분석</CardTitle>
            <CardDescription className="mt-3 text-base leading-7 text-[#6b5641]">
              관리자 전용 페이지입니다. 비밀번호를 입력하면 MCP 기반 로그 분석 화면으로 진입합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-8">
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleUnlock();
                }
              }}
              placeholder="비밀번호를 입력하세요"
              className="h-12 rounded-2xl border-[#dcc6a0] bg-white text-base"
            />
            <Button
              type="button"
              onClick={handleUnlock}
              className="h-12 w-full rounded-2xl bg-[#5f4124] text-sm font-semibold text-white hover:bg-[#4e341d]"
            >
              진입하기
            </Button>
            {errorMessage ? (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertTriangle className="h-4 w-4" />
                <span>{errorMessage}</span>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-[#e7d5b2] bg-[#fff9ed] p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#f4deb3] p-3 text-[#8e5f22]">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#3f2b1a]">로그분석</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[#6b5641]">
              자연어 요청을 `analyze_ops_prompt`로 보내고, 백엔드가 MCP 분석 결과를 구조화해서 돌려줍니다.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <Card className="rounded-[28px] border border-[#e7d5b2] bg-[#fffaf0] py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-xl font-semibold text-[#3f2b1a]">분석 요청</CardTitle>
            <CardDescription className="text-sm leading-6 text-[#6b5641]">
              예: 최근 30분 서버 상태랑 에러 로그 분석, 최근 7일 보안 위험 로그 요약
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="로그 분석 요청을 자연어로 입력하세요."
              className="min-h-[220px] w-full rounded-[24px] border border-[#dcc6a0] bg-white px-4 py-4 text-sm leading-7 text-[#3f2b1a] outline-none transition focus:border-[#b9894f] focus:ring-4 focus:ring-[#f3dfbb]"
            />
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((examplePrompt) => (
                <button
                  key={examplePrompt}
                  type="button"
                  onClick={() => setPrompt(examplePrompt)}
                  className="rounded-full bg-[#f4e7c9] px-3 py-2 text-xs font-medium text-[#6a4a28] transition hover:bg-[#ecd7ad]"
                >
                  {examplePrompt}
                </button>
              ))}
            </div>
            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={isSubmitting}
              className="h-12 w-full rounded-2xl bg-[#5f4124] text-sm font-semibold text-white hover:bg-[#4e341d]"
            >
              <Sparkles className="h-4 w-4" />
              {isSubmitting ? "분석 요청 전송 중..." : "로그 분석 실행"}
            </Button>
            {errorMessage ? (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertTriangle className="h-4 w-4" />
                <span>{errorMessage}</span>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-[#e7d5b2] bg-[#fffaf0] py-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-xl font-semibold text-[#3f2b1a]">분석 결과</CardTitle>
            <CardDescription className="text-sm leading-6 text-[#6b5641]">
              원문 JSON은 접어서 두고, 기본 화면은 요약 중심으로 보여줍니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            {normalizedResult ? (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  <MetricCard icon={<BarChart3 className="h-4 w-4" />} label="선택된 도구" value={normalizedResult.toolLabel} />
                  <MetricCard icon={<FileText className="h-4 w-4" />} label="요청 구간" value={normalizedResult.timeRangeLabel} />
                  <MetricCard icon={<ListChecks className="h-4 w-4" />} label="핵심 수치" value={normalizedResult.metricSummary} />
                </div>

                <div className="rounded-[24px] border border-[#e2cfaa] bg-[#fffdf6] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9a7a51]">요약</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#3f2b1a]">{normalizedResult.summary}</p>
                </div>

                {normalizedResult.keyPoints.length > 0 ? (
                  <div className="rounded-[24px] bg-[#f9f0da] p-5">
                    <p className="text-sm font-semibold text-[#3f2b1a]">핵심 포인트</p>
                    <ul className="mt-3 space-y-3 text-sm leading-7 text-[#5d4330]">
                      {normalizedResult.keyPoints.map((point) => (
                        <li key={point} className="rounded-2xl bg-white/70 px-4 py-3">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {normalizedResult.recommendations.length > 0 ? (
                  <div className="rounded-[24px] bg-[#f6ecda] p-5">
                    <p className="text-sm font-semibold text-[#3f2b1a]">권고사항</p>
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-[#5d4330]">
                      {normalizedResult.recommendations.map((item) => (
                        <li key={item} className="rounded-2xl bg-white/80 px-4 py-3">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <details className="rounded-[24px] border border-dashed border-[#d8c199] bg-white px-5 py-4">
                  <summary className="cursor-pointer text-sm font-semibold text-[#6a4a28]">원문 JSON 보기</summary>
                  <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-[#f9f0da] p-4 text-xs leading-6 text-[#3f2b1a]">
                    {prettyJson}
                  </pre>
                </details>
              </>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center rounded-[20px] border border-dashed border-[#d8c199] px-6 text-center text-sm text-[#8d775f]">
                여기에 로그 분석 결과가 표시됩니다. 먼저 자연어 요청을 입력하고 분석을 실행해 주세요.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-[#ead6ae] bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#9a7a51]">
        <span className="rounded-full bg-[#f4e7c9] p-1.5 text-[#7b5428]">{icon}</span>
        {label}
      </div>
      <p className="mt-3 text-sm font-semibold text-[#3f2b1a]">{value}</p>
    </div>
  );
}

function normalizeResult(result: LogAnalysisResult | null) {
  if (!result || typeof result.parsedData !== "object" || result.parsedData === null) {
    return null;
  }

  const data = result.parsedData as OpsPromptResult;
  const selectedTool = getText(data.selected_tool) || getText((data as { toolName?: string }).toolName) || "알 수 없음";
  const minutes = data.arguments?.minutes ?? data.result?.time_range_minutes;
  const days = data.arguments?.days;
  const toolLabel = selectedTool === "analyze_security_risks" ? "보안 위험 분석" : "장애/운영 분석";
  const timeRangeLabel = formatTimeRange(minutes, days);
  const metricSummary = buildMetricSummary(data);
  const summary =
    getText(data.result?.summary) ||
    getText((data.result as { conclusion?: unknown } | undefined)?.conclusion) ||
    "요약 정보를 찾지 못했습니다.";

  return {
    toolLabel,
    timeRangeLabel,
    metricSummary,
    summary,
    keyPoints: normalizeTextList(data.result?.key_points ?? data.result?.findings),
    recommendations: normalizeTextList(data.result?.recommendations),
  };
}

function buildMetricSummary(data: OpsPromptResult) {
  const pieces: string[] = [];

  if (typeof data.result?.error_log_count === "number") {
    pieces.push(`에러 로그 ${data.result.error_log_count}건`);
  }

  if (typeof data.result?.failed_path_count === "number") {
    pieces.push(`실패 경로 ${data.result.failed_path_count}개`);
  }

  if (pieces.length === 0) {
    pieces.push("핵심 수치 없음");
  }

  return pieces.join(" · ");
}

function formatTimeRange(minutes?: number, days?: number) {
  if (typeof minutes === "number") {
    return `${minutes}분`;
  }

  if (typeof days === "number") {
    return `${days}일`;
  }

  return "기본 범위";
}

function normalizeTextList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => getText(item)).filter((item): item is string => Boolean(item));
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getText(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  return "";
}
