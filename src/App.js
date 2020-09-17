import React, { useState, useEffect } from "react";
import "./styles.css";

export default function App({ prop }) {
  const [text, setText] = useState("");
  const [quote, setQuote] = useState("");
  const [rows, setRows] = useState(5);
  const [focus, setFocus] = useState(true);
  const [start, setStart] = useState(new Date());
  const [mistakes, setMistakes] = useState(new Set());
  const [speed, setSpeed] = useState(0);

  const fetchQuote = () => {
    setSpeed(0);
    setText("");
    setMistakes(new Set());

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
        setRows(Math.ceil(formattedQuote.length / 100));
      });
  };
  const checkMistakes = (e) => {
    const { value } = e.target;
    const formatValue = value.split(" ").join("_");
    if (formatValue !== quote.slice(0, formatValue.length)) {
      setText((prev) => (prev ? quote.slice(0, prev.length) : ""));
      setMistakes((prev) => new Set([...prev, text.length]));
    } else {
      setText(formatValue);
      if (formatValue === quote) {
        setFocus(false);
      }
    }
    console.log(mistakes);
  };
  const avoidBackspace = (e) => {
    if (e.keyCode === 8) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    if (focus) {
      setStart(new Date());
      console.log("start");
    } else {
      const time = (new Date() - start) / 1000;
      const speed = (quote.length * 12) / time;
      setSpeed(speed);
    }
  }, [focus]);
  return (
    <div className="App">
      <h1 align="center">Typing Practice</h1>
      <div className="arena" style={{ height: `${rows + 3}rem` }}>
        <textarea
          cols="100"
          rows={rows}
          style={{ zIndex: 10 }}
          value={text}
          disabled={speed !== 0}
          onChange={(e) => checkMistakes(e)}
          onKeyDown={(e) => avoidBackspace(e)}
          onFocus={() => setFocus(true)}
        ></textarea>
        <textarea
          cols="100"
          rows={rows}
          disabled
          style={{ color: "gray" }}
          value={quote}
        />
      </div>
      {text && (
        <React.Fragment>
          <p align="center">
            Mistakes{" "}
            {mistakes.size > 0 ? (
              <span style={{ color: "red" }}> {mistakes.size}</span>
            ) : (
              mistakes.size
            )}
          </p>

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
        </React.Fragment>
      )}
      {speed !== 0 && (
        <div style={{ textAlign: "center" }}>
          <p>
            Your speed was{" "}
            <span style={{ color: "blue" }}>{speed.toFixed(2)}</span> wpm
          </p>
          <button className="primary" onClick={fetchQuote}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
