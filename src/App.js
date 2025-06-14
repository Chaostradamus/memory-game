import "./App.css";
import { useState } from "react";
import ScoreBoard from "./components/Scoreboard";
import CardGrid from "./components/Cardgrid";
import Card from "./components/Card";

function App() {
  return (
    <>
    <p>Welcome</p>
      <ScoreBoard />
      <CardGrid />
      <Card/>
    </>
  );
}

export default App;
