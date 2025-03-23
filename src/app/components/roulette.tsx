"use client"; // Next.js 13+에서는 클라이언트 컴포넌트로 명시

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "@styles/roulette.scss";

// SSR 비활성화
const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

type PrizeOption = {
  option: string;
  updated: string;
};

type OptionData = {
  option: string;
  probability: number;
  min?: number;
  max?: number;
};

const optionsData: OptionData[] = [
  { option: "😅", probability: 28, min: 100, max: 130 },
  { option: "🍬", probability: 20, min: 140, max: 160 },
  { option: "🍦", probability: 15, min: 170, max: 220 },
  { option: "🍣", probability: 10, min: 280, max: 380 },
  { option: "💰", probability: 9, min: 460, max: 550 },
  { option: "💠 다이아", probability: 8 },
  { option: "돌아 소길!", probability: 10 }
];

const getRandomValue = (min?: number, max?: number): string => {
  if (min !== undefined && max !== undefined) {
    const randomValue = Math.random() * (max - min) + min;
    return `${Math.ceil(randomValue / 10) * 10}`; // 일의 자리 올림 적용
  }
  return "";
};

const getDailyOptions = (): { option: string }[] => {
  return optionsData.map((item) => ({
    option: item.option + " " + getRandomValue(item.min, item.max)
  }));
};

const weightedRandom = (): number => {
  const cumulative: number[] = [];
  let sum = 0;
  for (const { probability } of optionsData) {
    sum += probability;
    cumulative.push(sum);
  }
  const rand = Math.random() * sum;
  return cumulative.findIndex((value) => rand < value);
};

export default function Roulette() {
  const [mustSpin, setMustSpin] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [prizeList, setPrizeList] = useState<PrizeOption[]>([]);
  const [isSpinDisabled, setIsSpinDisabled] = useState<boolean>(false);
  const [resetCount, setResetCount] = useState<number>(0);
  const MAX_COUNT = 7;
  const [dailyOptions, setDailyOptions] = useState<{ option: string }[]>([]);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedOptions = localStorage.getItem("dailyOptions");
    const lastSpinDate = localStorage.getItem("lastSpinDate");
    const resetData = JSON.parse(localStorage.getItem("resetLimitData") || "{}");

    if (!savedOptions || lastSpinDate !== today) {
      const newOptions = getDailyOptions();
      localStorage.setItem("dailyOptions", JSON.stringify(newOptions));
      setDailyOptions(newOptions);
    } else {
      setDailyOptions(JSON.parse(savedOptions));
    }

    const savedResults = localStorage.getItem("prizeHistory");
    if (savedResults) setPrizeList(JSON.parse(savedResults));

    setIsSpinDisabled(lastSpinDate === today);
    const currentMonth = new Date().getMonth();
    if (resetData.month === currentMonth) {
      setResetCount(resetData.count);
    } else {
      localStorage.setItem("resetLimitData", JSON.stringify({ month: currentMonth, count: 0 }));
    }
  }, []);

  const handleSpinClick = () => {
    if (isSpinDisabled) return;
    const newPrizeNumber = weightedRandom();
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setIsSpinning(true);
    const today = new Date().toDateString();
    localStorage.setItem("lastSpinDate", today);
    setIsSpinDisabled(true);
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setIsSpinning(false);
    if (prizeNumber !== null) {
      const newResult: PrizeOption = {
        option: dailyOptions[prizeNumber].option,
        updated: new Date().toLocaleString(),
      };
      const updatedPrizeList = [newResult, ...prizeList];
      setPrizeList(updatedPrizeList);
      localStorage.setItem("prizeHistory", JSON.stringify(updatedPrizeList));
    }
  };

  const handleClearHistory = () => {
    setPrizeList([]);
    localStorage.removeItem("prizeHistory");
  };

  const handleClearDisabled = () => {
    if (resetCount >= MAX_COUNT) return; // MAX_COUNT번 이상이면 제한

    const newCount = resetCount + 1;
    setResetCount(newCount);
    setIsSpinDisabled(false); // 제한 해제

    // ✅ 로컬스토리지에 현재 달과 카운트 저장
    const currentMonth = new Date().getMonth();
    localStorage.setItem(
      "resetLimitData",
      JSON.stringify({ month: currentMonth, count: newCount })
    );

    // ✅ 스핀 제한 해제
    localStorage.removeItem("lastSpinDate");
  };

  return (
    <div className="roulette-container">
      <button
        className={`roulette-button ${isSpinDisabled && "is-disable"}`}
        onClick={handleSpinClick}
      >
        {!isSpinDisabled ? "룰렛돌리기🎯" : "🚫done! 좋은하루되렴"}
      </button>
      {!isSpinning && prizeNumber !== null && (
        <h3 className="prize">
          오늘의 결과: {optionsData[prizeNumber].option}
        </h3>
      )}
      <div className="roulette">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber ?? 0}
          data={dailyOptions}
          backgroundColors={["#ffd2d2", "#fefefe"]}
          textColors={["#3e3e3e"]}
          fontSize={30}
          onStopSpinning={handleStopSpinning}
          outerBorderColor="#3e3e3e"
          outerBorderWidth={2}
          spinDuration={0.4}
        />
      </div>
      <div className="prize-list">
        <h3>기록</h3>
        <small>[제발한번만더]버튼은 한달에 7번만 사용가능</small>
        <div className="roulette-reset">
          <button
            className="roulette-reset-button"
            onClick={handleClearHistory}
          >
            🗑️지난기록 지우기
          </button>
          <button
            className={`roulette-reset-button ${
              resetCount >= MAX_COUNT ? "is-disable" : ""
            }`}
            onClick={handleClearDisabled}
            disabled={resetCount >= MAX_COUNT}
          >
            🔓 제발한번만더!({MAX_COUNT - resetCount})
          </button>
        </div>
        {prizeList.map((item: PrizeOption, index: number) => (
          <div className="prize-item" key={index}>
            <p>
              {item.option}{" "}
              <span className="prize-item-updated">{item.updated}</span>
            </p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
}
