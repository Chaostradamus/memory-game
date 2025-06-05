import { useState, useEffect } from "react";
import Card from "./Card";
import md5 from "md5";

const PUBLIC_KEY = "6d5fe5faf5b3805effbd6b101d149af1";
const PRIVATE_KEY = "1d4dede147462e1d7b82baaf5eaf899e753e647d";

const CardGrid = ({ handleCardClick }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarvelCharacters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const ts = new Date().getTime();
        const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);

        // Using a different CORS proxy that currently works
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const apiUrl = encodeURIComponent(
          `https://gateway.marvel.com/v1/public/characters?limit=12&ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`
        );

        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        
        // The proxy wraps the response in a 'contents' field as JSON string
        const marvelData = JSON.parse(data.contents);
        
        if (!marvelData?.data?.results) {
          throw new Error("Invalid API response structure");
        }

        const formattedData = marvelData.data.results
          .filter(char => char.thumbnail && !char.thumbnail.path.includes('image_not_available'))
          .map((char) => ({
            id: char.id,
            name: char.name,
            image: `${char.thumbnail.path}/portrait_xlarge.${char.thumbnail.extension}`.replace('http://', 'https://'),
          }));

        setCharacters(formattedData.slice(0, 12));
      } catch (error) {
        console.error("Marvel API error:", error);
        setError(error.message);
        // Use complete fallback data
        setCharacters([
          { id: 1, name: "Spider-Man", image: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b/portrait_xlarge.jpg" },
          { id: 2, name: "Iron Man", image: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55/portrait_xlarge.jpg" },
          { id: 3, name: "Captain America", image: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087/portrait_xlarge.jpg" },
          { id: 4, name: "Thor", image: "https://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350/portrait_xlarge.jpg" },
          { id: 5, name: "Hulk", image: "https://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0/portrait_xlarge.jpg" },
          { id: 6, name: "Black Widow", image: "https://i.annihil.us/u/prod/marvel/i/mg/f/30/50fecad1f395b/portrait_xlarge.jpg" },
          { id: 7, name: "Wolverine", image: "https://i.annihil.us/u/prod/marvel/i/mg/2/60/537bcaef0f6cf/portrait_xlarge.jpg" },
          { id: 8, name: "Doctor Strange", image: "https://i.annihil.us/u/prod/marvel/i/mg/5/f0/5261a85a501fe/portrait_xlarge.jpg" },
          { id: 9, name: "Black Panther", image: "https://i.annihil.us/u/prod/marvel/i/mg/6/60/5261a80a67e7d/portrait_xlarge.jpg" },
          { id: 10, name: "Captain Marvel", image: "https://i.annihil.us/u/prod/marvel/i/mg/c/10/537ba5ff07aa4/portrait_xlarge.jpg" },
          { id: 11, name: "Deadpool", image: "https://i.annihil.us/u/prod/marvel/i/mg/5/c0/537ba730e05e0/portrait_xlarge.jpg" },
          { id: 12, name: "Storm", image: "https://i.annihil.us/u/prod/marvel/i/mg/c/b0/537bc5f8a8df0/portrait_xlarge.jpg" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarvelCharacters();
  }, []);

  if (loading) {
    return <div className="loading">Loading Marvel characters...</div>;
  }

  if (error) {
    return <div className="error">Error: {error} (using fallback data)</div>;
  }

  return (
    <div className="card-grid">
      {characters.map((char) => (
        <Card 
          key={char.id} 
          id={char.id}
          name={char.name} 
          image={char.image}
          handleClick={handleCardClick}
        />
      ))}
    </div>
  );
};

export default CardGrid;