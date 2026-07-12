import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

const ADMIN_PASSWORD = "0302";
const ACCESS_DURATION_MS = 30 * 60 * 1000;
const PARTY_ACCESS_KEY = "noru-party-access-expires-at";

function hasValidAccess() {
  const expiresAt = Number(window.localStorage.getItem(PARTY_ACCESS_KEY));
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export function AdminAccessGate({ children }: { children: ReactNode }) {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(hasValidAccess);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isUnlocked) return;
    const expiresAt = Number(window.localStorage.getItem(PARTY_ACCESS_KEY));
    const remainingTime = Math.max(0, expiresAt - Date.now());
    const timeoutId = window.setTimeout(() => {
      window.localStorage.removeItem(PARTY_ACCESS_KEY);
      setIsUnlocked(false);
      setPassword("");
      toast("파티관리 접근 시간이 만료되었습니다.");
    }, remainingTime);
    return () => window.clearTimeout(timeoutId);
  }, [isUnlocked]);

  const handleUnlock = () => {
    if (password !== ADMIN_PASSWORD) {
      setErrorMessage("비밀번호가 올바르지 않습니다.");
      toast("비밀번호가 일치하지 않습니다.");
      return;
    }

    window.localStorage.setItem(PARTY_ACCESS_KEY, String(Date.now() + ACCESS_DURATION_MS));
    setIsUnlocked(true);
    setErrorMessage("");
    toast("파티관리 접근 권한이 30분 동안 유지됩니다.");
  };

  if (isUnlocked) return children;

  return <section className="mx-auto max-w-2xl">
    <Card className="rounded-[32px] border border-[#e7d5b2] bg-[#fff9ed] py-0 shadow-[0_24px_70px_rgba(120,86,36,0.08)]">
      <CardHeader className="px-8 pt-8">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4deb3] text-[#8e5f22]"><LockKeyhole className="h-7 w-7" /></div>
        <CardTitle className="text-3xl font-semibold tracking-tight text-[#3f2b1a]">파티관리</CardTitle>
        <CardDescription className="mt-3 text-base leading-7 text-[#6b5641]">관리자 전용 페이지입니다. 인증 후 30분 동안 파티관리의 모든 화면을 사용할 수 있습니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-8 pb-8">
        <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") handleUnlock(); }} placeholder="비밀번호를 입력하세요" className="h-12 rounded-2xl border-[#dcc6a0] bg-white text-base" />
        <Button type="button" onClick={handleUnlock} className="h-12 w-full rounded-2xl bg-[#5f4124] text-sm font-semibold text-white hover:bg-[#4e341d]">진입하기</Button>
        {errorMessage ? <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><AlertTriangle className="h-4 w-4" /><span>{errorMessage}</span></div> : null}
      </CardContent>
    </Card>
  </section>;
}
