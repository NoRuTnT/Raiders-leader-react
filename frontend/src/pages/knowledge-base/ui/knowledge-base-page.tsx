import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronRight, Menu, Search } from "lucide-react";
import { useAppStore } from "@/entities/app/model/app-store";
import { knowledgeBaseArticles, knowledgeCategories, scpServiceContexts } from "@/pages/knowledge-base/model/knowledge-base";

export function KnowledgeBasePage() {
  const { activeKnowledgeBaseSection, setKnowledgeBaseSection } = useAppStore();
  const [query, setQuery] = useState("");
  const activeArticle = knowledgeBaseArticles.find((article) => article.id === activeKnowledgeBaseSection) ?? knowledgeBaseArticles[0];
  const scpContext = scpServiceContexts[activeArticle.id];
  const queryText = query.trim().toLowerCase();
  const visibleArticles = useMemo(() => knowledgeBaseArticles.filter((article) => !queryText || [article.title, article.category, article.description, ...article.keywords].join(" ").toLowerCase().includes(queryText)), [queryText]);

  useEffect(() => {
    if (!activeKnowledgeBaseSection) setKnowledgeBaseSection(knowledgeBaseArticles[0].id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeKnowledgeBaseSection, setKnowledgeBaseSection]);

  return <div className="mx-auto max-w-[1440px] pb-16 lg:px-4"><div className="border-x border-[#e7d5b2] bg-white lg:grid lg:min-h-[calc(100vh-104px)] lg:grid-cols-[286px_minmax(0,1fr)]">
    <aside className="border-b border-[#e7d5b2] bg-[#fffaf0] p-4 lg:sticky lg:top-[104px] lg:h-[calc(100vh-104px)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-2 px-2 pb-4 text-sm font-bold tracking-[0.12em] text-[#704920]"><BookOpen className="h-4 w-4" />KNOWLEDGE BASE</div>
      <label className="relative block"><span className="sr-only">Knowledge Base 검색</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a36c28]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="용어 검색" className="w-full rounded-xl border border-[#e3d0ad] bg-white py-2.5 pl-9 pr-3 text-sm text-[#3f2b1a] outline-none transition placeholder:text-[#a89680] focus:border-[#b77a2d] focus:ring-2 focus:ring-[#f4deb3]" /></label>
      <div className="mt-5 space-y-5">{knowledgeCategories.map((category) => {
        const categoryArticles = knowledgeBaseArticles.filter((article) => article.category === category);
        const visibleArticleIds = new Set(visibleArticles.filter((article) => article.category === category).map((article) => article.id));
        const rootArticles = categoryArticles.filter((article) => !article.parentId).filter((article) => visibleArticleIds.has(article.id) || categoryArticles.some((child) => child.parentId === article.id && visibleArticleIds.has(child.id)));

        return !rootArticles.length ? null : <section key={category}>
          <h2 className="px-2 text-xs font-bold tracking-[0.12em] text-[#9a6a32]">{category.toUpperCase()}</h2>
          <div className="mt-2 space-y-1">{rootArticles.map((article) => {
            const childArticles = categoryArticles.filter((child) => child.parentId === article.id && (visibleArticleIds.has(article.id) || visibleArticleIds.has(child.id)));
            const itemClassName = (id: string, isChild = false) => `flex w-full items-center justify-between rounded-lg text-left transition ${isChild ? "px-3 py-2 text-xs" : "px-3 py-2.5 text-sm"} ${id === activeArticle.id ? "bg-[#f1e3c7] font-bold text-[#5f4124]" : "text-[#6b5641] hover:bg-[#f8efd9] hover:text-[#3f2b1a]"}`;

            return <div key={article.id}>
              <button type="button" onClick={() => setKnowledgeBaseSection(article.id)} className={itemClassName(article.id)}><span>{article.title}</span><ChevronRight className="h-4 w-4 shrink-0" /></button>
              {childArticles.length ? <div className="ml-3 mt-1 space-y-1 border-l border-[#e3d0ad] pl-2">{childArticles.map((child) => <button key={child.id} type="button" onClick={() => setKnowledgeBaseSection(child.id)} className={itemClassName(child.id, true)}><span>{child.title}</span><ChevronRight className="h-3.5 w-3.5 shrink-0" /></button>)}</div> : null}
            </div>;
          })}</div>
        </section>;
      })}</div>
      {!visibleArticles.length ? <p className="mt-8 px-2 text-sm leading-6 text-[#8d775f]">검색 결과가 없습니다.</p> : null}
    </aside>
    <main className="min-w-0 p-7 md:p-10 lg:p-14"><nav aria-label="현재 위치" className="flex flex-wrap items-center gap-2 text-sm text-[#8d775f]"><span>Knowledge Base</span><ChevronRight className="h-4 w-4" /><span>{activeArticle.category}</span><ChevronRight className="h-4 w-4" /><span className="rounded bg-[#f1e3c7] px-2 py-0.5 font-semibold text-[#704920]">{activeArticle.title}</span></nav><article className="mt-10 max-w-4xl"><p className="flex items-center gap-2 text-sm font-bold tracking-[0.14em] text-[#a36c28]"><Menu className="h-4 w-4" />{activeArticle.category.toUpperCase()}</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-[#3f2b1a] md:text-5xl">{activeArticle.title}</h1><p className="mt-7 text-base leading-8 text-[#59452f] md:text-lg">{activeArticle.description}</p><div className="mt-7 flex flex-wrap gap-2">{activeArticle.keywords.map((keyword) => <span key={keyword} className="rounded-full border border-[#dfc390] bg-[#fffaf0] px-3 py-1.5 text-sm font-semibold text-[#704920]">{keyword}</span>)}</div><div className="my-10 border-t border-[#ead9b9]" /><div className="space-y-10">{activeArticle.sections.map((section, index) => <section key={section.title}><h2 className="text-2xl font-bold text-[#3f2b1a]"><span className="mr-2 text-[#a36c28]">{index + 1}.</span>{section.title}</h2><p className="mt-4 leading-8 text-[#59452f]">{section.description}</p><ul className="mt-5 space-y-3 rounded-2xl border border-[#ead9b9] bg-[#fffaf0] p-5">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-3 leading-7 text-[#59452f]"><span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#b77a2d]" />{bullet}</li>)}</ul></section>)}</div>{scpContext ? <aside className="mt-12 rounded-2xl border border-[#9bb9d8] bg-[#f1f8ff] p-5 text-sm leading-7 text-[#294b69]"><p className="font-bold tracking-[0.08em] text-[#1f5c92]">SAMSUNG CLOUD PLATFORM 상품 관점</p><p className="mt-3">{scpContext.description}</p><ul className="mt-4 space-y-2">{scpContext.bullets.map((bullet) => <li key={bullet} className="flex gap-3"><span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#3b82b6]" />{bullet}</li>)}</ul><a href={scpContext.referenceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex font-bold text-[#1f5c92] underline underline-offset-4">SCP 사용자 가이드에서 확인하기 ↗</a></aside> : null}<aside className="mt-12 border-l-4 border-[#b77a2d] bg-[#fff8e8] px-5 py-4 text-sm leading-7 text-[#704920]"><strong className="block font-bold">개인 학습 노트</strong>이 문서는 실제 서비스 운영과 Samsung Cloud Platform 기술지원 업무를 바탕으로 계속 보완하고 있습니다.</aside></article></main>
  </div></div>;
}
