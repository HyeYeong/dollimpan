"use client"; // Next.js 13+에서는 클라이언트 컴포넌트로 명시

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "@styles/roulette.scss";

// SSR 비활성화
const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

const optionsData = [
  { option: "😅 110" },
  { option: "🍬 140" },
  { option: "🍦 200" },
  { option: "🍣 350" },
  { option: "💰 500" },
  { option: "💠 다이아" },
  { option: "돌아 소길!" },
];

type PrizeOption = {
  option: string;
  updated: string;
};

export default function Roulette() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState<null | number>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeList, setPrizeList] = useState<PrizeOption[]>([]);
  const [isSpinDisabled, setIsSpinDisabled] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const MAX_COUNT = 7;

  useEffect(() => {
    const saveResults = localStorage.getItem("prizeHistory");
    const lastSpinDate = localStorage.getItem("lastSpinDate");
    const resetData = JSON.parse(
      localStorage.getItem("resetLimitData") || "{}"
    );
    if (saveResults) {
      setPrizeList(JSON.parse(saveResults));
    }
    if (lastSpinDate) {
      const today = new Date().toDateString();
      // ✅ 마지막 스핀 날짜가 오늘과 같으면 비활성화
      setIsSpinDisabled(lastSpinDate === today);
    } else {
      // ✅ 로컬스토리지에 데이터가 없으면 기본값으로 false 설정
      setIsSpinDisabled(false);
    }

    // ✅ 이번 달의 제한 해제 카운트 확인
    const currentMonth = new Date().getMonth();
    if (resetData.month === currentMonth) {
      setResetCount(resetData.count);
    } else {
      // 새로운 달이 되면 카운트 초기화
      localStorage.setItem(
        "resetLimitData",
        JSON.stringify({ month: currentMonth, count: 0 })
      );
    }
  }, []);

  const handleSpinClick = () => {
    if (isSpinDisabled) return; // 오늘 돌렸을 경우 제한
    const newPrizeNumber = Math.floor(Math.random() * optionsData.length);
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
        option: optionsData[prizeNumber].option,
        updated: new Date().toLocaleString(),
      };
      const updatedPrizeList: PrizeOption[] = [newResult, ...prizeList]; // 최신 결과를 맨 위로 추가
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
          data={optionsData}
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
