import React, { useState, useEffect } from "react";
import "./styles.css";

export default function App({ prop }) {
  const [text, setText] = useState("");
  const [quote, setQuote] = useState("");
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState(5);
  const [mistakes, setMistakes] = useState(new Set());

  useEffect(() => {
    fetch("https://quote-garden.herokuapp.com/api/v2/quotes/random")
      .then((response) => response.json())
      .then((data) => {
        const { quote } = data;
        const { quoteText, quoteAuthor } = quote;

        const formattedQuote =
          quoteText.split(" ").join("_") +
          "_-_" +
          quoteAuthor.split(" ").join("_");
        setQuote(formattedQuote);
        console.log(formattedQuote);
        setRows(Math.ceil(formattedQuote.length / 100));
      });
  }, []);
  useEffect(() => {
    setCount(mistakes.size);
  }, [mistakes]);
  return (
    <div className="App">
      <h1 align="center">Typing Practice</h1>
      <div className="arena" style={{ height: `${rows + 3}rem` }}>
        <textarea
          cols="100"
          rows={rows}
          style={{ zIndex: 10 }}
          value={text}
          onChange={(e) => {
            const { value } = e.target;
            const formatQuote = quote.split("_").join(" ");
            if (value !== formatQuote.slice(0, value.length)) {
              setText((prev) =>
                prev ? formatQuote.slice(0, prev.length) : ""
              );
              setMistakes((prev) => new Set([...prev, text.length]));
            } else {
              setText(value);
            }
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 8) {
              console.log("delete");
              e.preventDefault();
            } else {
            }
          }}
        ></textarea>
        <textarea
          cols="100"
          rows={rows}
          disabled
          style={{ color: "gray" }}
          value={quote}
        />
      </div>
      <h4 align="center"> Mistakes {count} </h4>
      <div className="mistake">
        {text
          .split(" ")
          .join("_")
          .split("")
          .map((char, index) =>
            mistakes.has(index) ? (
              <span key={`${index}${char}`} style={{ color: "red" }}>
                {char}
              </span>
            ) : (
              <span key={`${index}${char}`}>{char}</span>
            )
          )}
      </div>
    </div>
  );
}
