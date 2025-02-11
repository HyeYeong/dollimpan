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

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * optionsData.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setIsSpinning(true);
  };

  useEffect(() => {
    if (!isSpinning && !mustSpin && prizeNumber !== null) {
      const currentDate = new Date().toLocaleString();
      setPrizeList((prevList) => [
        ...prevList,
        { option: optionsData[prizeNumber].option, updated: currentDate },
      ]);
    }
  }, [isSpinning, mustSpin, prizeNumber]);

  return (
    <div className="roulette-container">
      <button className="roulette-button" onClick={handleSpinClick}>
        룰렛돌리기🎯
      </button>
      {!isSpinning && prizeNumber !== null && (
        <h3 className="prize">
          오늘의 결과: {optionsData[prizeNumber].option}
        </h3>
      )}
      <div className="roulette">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={optionsData}
          backgroundColors={["#ffd2d2", "#fefefe"]}
          textColors={["#3e3e3e"]}
          fontSize={30}
          onStopSpinning={() => {
            setMustSpin(false);
            setIsSpinning(false); // 룰렛이 멈추면 isSpinning을 false로 설정
          }}
          outerBorderColor="#3e3e3e"
          outerBorderWidth={2}
          spinDuration={0.4}
        />
      </div>
      <div className="prize-list">
        <h3>지난 결과</h3>
        <small>새로고침 시 기록 사라짐</small>
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
      <hr />
      <hr />
      <small>이 아래는 아직 개발중. 아무런 기능 없음</small>
      <div className="roulette-reset">
        <button
          className="roulette-reset-button"
          onClick={() => console.log("remove")}
        >
          기록 지우기
        </button>
        <button
          className="roulette-reset-button"
          onClick={() => console.log("one more")}
        >
          ???
          {/* 제발 한번만 더! */}
        </button>
      </div>
    </div>
  );
}
