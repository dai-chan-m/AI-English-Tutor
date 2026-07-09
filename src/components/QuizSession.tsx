"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  RiCheckLine,
  RiCloseLine,
  RiFireFill,
  RiLock2Fill,
  RiShareBoxLine,
  RiVolumeUpFill,
} from "react-icons/ri";
import {
  FREE_SESSIONS_PER_DAY,
  REVIEW_MAX_SIZE,
  SESSION_SIZE,
  SITE_URL,
} from "@/lib/constants";
import {
  bumpStreak,
  canStartDrill,
  recordAnswer,
  recordDrillStart,
  recordSessionComplete,
} from "@/lib/progress";
import { buildSession, pickSessionWords } from "@/lib/quiz";
import { applyAnswer, loadSrs, saveSrs } from "@/lib/srs";
import { todayStr } from "@/lib/storage";
import { speak, ttsSupported, warmupVoices } from "@/lib/tts";
import type { QuizQuestion, VocabWord } from "@/lib/types";
import AdSlot from "./AdSlot";
import RecommendedResources from "./RecommendedResources";

const MODE_LABEL: Record<QuizQuestion["mode"], string> = {
  meaningToWord: "意味 → 単語",
  wordToMeaning: "単語 → 意味",
  fillBlank: "例文の穴埋め",
  listening: "リスニング",
};

interface Props {
  /** 出題プール（drill: レベル帯の全語 / review: 期限が来た語） */
  words: VocabWord[];
  /** 誤答選択肢の供給源 */
  pool: VocabWord[];
  variant: "drill" | "review";
  title: string;
}

type Status = "init" | "blocked" | "active" | "done";

interface Feedback {
  choice: string;
  correct: boolean;
}

export default function QuizSession({ words, pool, variant, title }: Props) {
  const [status, setStatus] = useState<Status>("init");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    if (variant === "drill" && !canStartDrill()) {
      setStatus("blocked");
      return;
    }
    const srs = loadSrs();
    const sessionWords =
      variant === "drill"
        ? pickSessionWords(words, srs, SESSION_SIZE, todayStr())
        : words.slice(0, REVIEW_MAX_SIZE);
    if (sessionWords.length === 0) {
      setStatus("done");
      return;
    }
    if (variant === "drill") recordDrillStart();
    setQuestions(buildSession(sessionWords, pool, ttsSupported()));
    setIdx(0);
    setFeedback(null);
    setCorrectCount(0);
    setStatus("active");
  }, [variant, words, pool]);

  useEffect(() => {
    warmupVoices();
    start();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [start]);

  const question = questions[idx];

  // リスニング問題は表示時に自動再生する
  useEffect(() => {
    if (status === "active" && question?.mode === "listening" && !feedback) {
      const t = setTimeout(() => speak(question.word.word), 350);
      return () => clearTimeout(t);
    }
  }, [status, question, feedback]);

  const finish = useCallback(() => {
    const s = bumpStreak();
    setStreak(s.count);
    recordSessionComplete();
    setStatus("done");
  }, []);

  const goNext = useCallback(() => {
    setFeedback(null);
    if (idx + 1 >= questions.length) {
      finish();
    } else {
      setIdx((i) => i + 1);
    }
  }, [idx, questions.length, finish]);

  const answer = (choice: string) => {
    if (feedback || !question) return;
    const correct = choice === question.answer;
    saveSrs(applyAnswer(loadSrs(), question.word.word, correct));
    recordAnswer(correct);
    if (correct) setCorrectCount((c) => c + 1);
    if (question.mode !== "listening") speak(question.word.word);
    setFeedback({ choice, correct });
    if (correct) {
      timerRef.current = setTimeout(goNext, 1100);
    }
  };

  if (status === "init") {
    return (
      <div className="grid min-h-[50vh] place-items-center text-sm text-slate-400">
        読み込み中…
      </div>
    );
  }

  if (status === "blocked") {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-2xl text-amber-600">
            <RiLock2Fill aria-hidden />
          </div>
          <h1 className="mt-4 text-xl font-extrabold">
            今日の無料ドリルは終了です
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            無料プランは1日{FREE_SESSIONS_PER_DAY}
            セッションまで。明日また無料で再開できます。
            今すぐ続けるなら、無制限のProをどうぞ。
          </p>
          <Link
            href="/pro"
            className="mt-6 block rounded-xl bg-amber-500 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-amber-400"
          >
            Proで無制限に鍛える
          </Link>
          <Link
            href="/review"
            className="mt-3 block text-sm font-medium text-indigo-600 hover:underline"
          >
            復習ドリルは無制限で無料 →
          </Link>
        </div>
      </div>
    );
  }

  if (status === "done") {
    const total = questions.length;
    const pct = total === 0 ? 0 : Math.round((correctCount / total) * 100);
    const message =
      total === 0
        ? "出題できる単語がありませんでした。"
        : pct === 100
          ? "パーフェクト！この調子です。"
          : pct >= 70
            ? "いい鍛錬でした。間違えた語は明日また出題されます。"
            : "間違えた語ほど記憶に残ります。忘れる前にまた会いましょう。";
    const shareText = encodeURIComponent(
      `タンレンで${title}：${correctCount}/${total}問正解！ #TOEIC #タンレン\n${SITE_URL}`
    );

    return (
      <div className="mx-auto max-w-md space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-400">{title} 結果</p>
          <p className="mt-3 text-5xl font-extrabold tabular-nums tracking-tight">
            {correctCount}
            <span className="text-2xl text-slate-400"> / {total}</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{message}</p>
          {streak > 0 && (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-4 py-1.5 text-sm font-bold text-orange-600">
              <RiFireFill aria-hidden />
              {streak}日連続で鍛錬中
            </p>
          )}
          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={start}
              className="rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white shadow-sm transition hover:bg-indigo-500"
            >
              もう1セッション
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              <RiShareBoxLine aria-hidden />
              結果をシェアする
            </a>
            <Link
              href="/progress"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              学習進捗を見る →
            </Link>
          </div>
        </div>
        <AdSlot />
        <RecommendedResources compact heading="スコアをさらに伸ばすなら" />
      </div>
    );
  }

  if (!question) return null;

  const progressPct = (idx / questions.length) * 100;

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-400">
        <span>{title}</span>
        <span className="tabular-nums">
          {idx + 1} / {questions.length}
        </span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.18 }}
        >
          <p className="mb-3 w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
            {MODE_LABEL[question.mode]}
          </p>

          <div className="mb-6 min-h-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {question.mode === "meaningToWord" && (
              <>
                <p className="text-2xl font-extrabold leading-snug">
                  {question.word.meaning}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  この意味になる英単語は？
                </p>
              </>
            )}
            {question.mode === "wordToMeaning" && (
              <>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-extrabold tracking-tight">
                    {question.word.word}
                  </p>
                  <button
                    type="button"
                    onClick={() => speak(question.word.word)}
                    aria-label="発音を聞く"
                    className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-indigo-600 transition hover:bg-indigo-200"
                  >
                    <RiVolumeUpFill aria-hidden />
                  </button>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  /{question.word.ipa}/ ・ この単語の意味は？
                </p>
              </>
            )}
            {question.mode === "fillBlank" && (
              <>
                <p className="text-lg font-semibold leading-relaxed">
                  {question.blankedExample}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  空欄に入る単語は？
                </p>
              </>
            )}
            {question.mode === "listening" && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => speak(question.word.word)}
                  aria-label="単語を再生する"
                  className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-indigo-600 text-3xl text-white shadow transition hover:bg-indigo-500 active:scale-95"
                >
                  <RiVolumeUpFill aria-hidden />
                </button>
                <p className="mt-3 text-sm text-slate-400">
                  聞こえた単語の意味は？（タップで再生）
                </p>
              </div>
            )}
          </div>

          <div className="grid gap-3">
            {question.choices.map((choice) => {
              const isAnswer = choice === question.answer;
              const isPicked = feedback?.choice === choice;
              let cls =
                "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50";
              if (feedback) {
                if (isAnswer)
                  cls = "border-emerald-400 bg-emerald-50 text-emerald-800";
                else if (isPicked) cls = "border-rose-300 bg-rose-50 text-rose-700";
                else cls = "border-slate-200 bg-white opacity-50";
              }
              return (
                <motion.button
                  key={choice}
                  type="button"
                  whileTap={feedback ? undefined : { scale: 0.98 }}
                  onClick={() => answer(choice)}
                  disabled={!!feedback}
                  className={`flex items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left font-semibold leading-snug transition ${cls}`}
                >
                  <span>{choice}</span>
                  {feedback && isAnswer && (
                    <RiCheckLine className="shrink-0 text-xl text-emerald-500" aria-hidden />
                  )}
                  {feedback && isPicked && !isAnswer && (
                    <RiCloseLine className="shrink-0 text-xl text-rose-400" aria-hidden />
                  )}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {feedback && !feedback.correct && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-lg font-extrabold">
                  {question.word.word}
                  <span className="ml-2 text-sm font-medium text-slate-400">
                    /{question.word.ipa}/
                  </span>
                </p>
                <p className="mt-1 font-bold text-indigo-700">
                  {question.word.meaning}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {question.word.example}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {question.word.exampleJa}
                </p>
                <button
                  type="button"
                  onClick={goNext}
                  className="mt-4 w-full rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-700"
                >
                  次へ
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
