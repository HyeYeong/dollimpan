import "@styles/global.scss";
import Roulette from "@components/roulette";

export default function Home() {
  return (
    <div className="l-container">
      <h1>돌려돌려 돌림판!</h1>
      <Roulette />
    </div>
  );
}
