import { useState, useEffect } from "react";
import Card from "./Card";

const CardGrid = () => {
  const [digimons, setDigimons] = useState([]);
  const [clickedIds, setClickedIds] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch from reliable Digimon API
        const response = await fetch(
          "https://digimon-api.vercel.app/api/digimon"
        );
        const data = await response.json();

        // 2. Take first 12 Digimon and format
        const formattedData = data.slice(0, 12).map((d, index) => ({
          id: d.index || index,
          name: d.name,
          image: d.img,
        }));

        setDigimons(formattedData);
        shuffleCards()
      } catch (error) {
        console.error("API error:", error);
        // 3. Fallback to hardcoded Digimon
        setDigimons([
          {
            id: 1,
            name: "Agumon",
            image: "https://digimon.shadowsmith.com/img/agumon.jpg",
          },
          {
            id: 2,
            name: "Gabumon",
            image: "https://digimon.shadowsmith.com/img/gabumon.jpg",
          },
          // Add 10 more...
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const shuffleCards = () => {
    setDigimons((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleCardClick = (id) => {
    if (clickedIds.includes(id)) {
      // Reset if card was already clicked
      setCurrentScore(0);
      setClickedIds([]);
    } else {
      // Update scores
      const newScore = currentScore + 1;
      setCurrentScore(newScore);
      setBestScore(Math.max(newScore, bestScore));
      setClickedIds([...clickedIds, id]);
    }
    shuffleCards(); // Always shuffle
  };

  if (loading) return <div>Loading Digimon...</div>;

  return (
    <div>
      <div className="scoreboard">
        <p>
          Current : {currentScore} | Best: {bestScore}
        </p>
      </div>
      <div className="card-grid">
        {digimons.map((digimon) => (
          <Card
            key={digimon.id}
            name={digimon.name}
            image={digimon.image}
            onClick={() => handleCardClick(digimon.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CardGrid;
