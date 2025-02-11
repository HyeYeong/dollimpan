import "@styles/global.scss";
import Roulette from "@components/roulette";

export default function Home() {
  return (
    <div className="l-container">
      <small className="u-text-align--right">version.1 25/2/11</small>
      <h1 className="u-text-align--center">돌려돌려 돌림판!</h1>
      <Roulette />
      {/* <h2>업데이트 필요한 내용</h2>
      <p>build & deploy</p>
      <p>하루에 한번만 돌릴 수 있게 제한</p>
      <p>localstorage 로 매일, 매달 기록</p> */}
    </div>
  );
}
