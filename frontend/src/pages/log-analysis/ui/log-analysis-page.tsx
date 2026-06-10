import { useMemo, useState } from "react";
import { AlertTriangle, LockKeyhole, Shield, Sparkles } from "lucide-react";
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

export function LogAnalysisPage() {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<LogAnalysisResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
              자연어 요청을 그대로 `analyze_ops_prompt`로 보내고, 백엔드가 적절한 MCP 분석 흐름을 처리합니다.
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
              MCP 응답의 `result.content[0].text`를 JSON으로 파싱한 결과입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            {result ? (
              <>
                <div className="rounded-2xl border border-[#e2cfaa] bg-[#fff8e8] px-4 py-3 text-sm text-[#5c4125]">
                  <p className="font-semibold">호출 정보</p>
                  <p className="mt-2">tool: `analyze_ops_prompt`</p>
                  <p className="mt-1">request id: `{result.requestId}`</p>
                </div>
                <div className="rounded-[24px] bg-[#f9f0da] p-4">
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-[#3f2b1a]">
                    {prettyJson}
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex min-h-[360px] items-center justify-center rounded-[20px] border border-dashed border-[#d8c199] px-6 text-center text-sm text-[#8d775f]">
                여기에 로그 분석 결과가 표시됩니다. 먼저 자연어 요청을 입력하고 분석을 실행해 주세요.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
