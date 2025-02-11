// src/app/pages.tsx
"use client"; // Next.js 13+에서는 클라이언트 컴포넌트로 명시

import dynamic from "next/dynamic";
import { useState } from "react";

// SSR 비활성화
const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

const optionsData = [
  { option: "😅 110" },
  { option: "🍬 150" },
  { option: "🍦 180" },
  { option: "🍣 350" },
  { option: "💰 500" },
  { option: "💸 OPPS" },
  { option: "💠 다이아" },
];

export default function Roulette() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * optionsData.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setIsSpinning(true);
  };

  return (
    <div className="roulette-container">
      <button onClick={handleSpinClick}>룰렛돌리기 🎯</button>

      <div className="roulette">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={optionsData}
          backgroundColors={["#ffdaeb", "#f8eeff"]}
          textColors={["#3e3e3e"]}
          onStopSpinning={() => setMustSpin(false)}
          // style={{
          //   width: "300px", // 크기 조정
          //   height: "300px", // 크기 조정
          // }}
          spinDuration={1}
          startingDegree={0}
        />
      </div>
      {!isSpinning && (
        <div className="prize">🎉 결과: {optionsData[prizeNumber].option}</div>
      )}
      {/* <div className="prize">{optionsData[prizeNumber].option}</div> */}
      <h2>업데이트 필요한 내용</h2>
      <p>build & deploy</p>
      <p>룰렛 크기 조정, 속도</p>
      <p>하루에 한번만 돌릴 수 있게 제한</p>
      <p>localstorage 로 매일, 매달 기록</p>
    </div>
  );
}
