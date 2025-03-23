import "@styles/global.scss";
import Roulette from "@components/roulette";

export default function Home() {
  return (
    <div className="l-container">
      <small className="u-text-align--right">version.2, updated 25/3/23, 확률 안정화</small>
      <h1 className="u-text-align--center">돌려돌려 돌림판!</h1>
      <Roulette />
    </div>
  );
}
