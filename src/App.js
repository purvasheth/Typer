import React, { useState, useEffect } from "react";
import "./styles.css";
import loader from "./images/loader.gif";
import { format } from "./utils";

export default function App() {
  const [text, setText] = useState("");
  const [quote, setQuote] = useState("");
  const [rows, setRows] = useState(5);
  const [isloading, setLoading] = useState(true);
  const [focus, setFocus] = useState(false);
  const [start, setStart] = useState(new Date());
  const [mistakes, setMistakes] = useState(new Set());
  const [speed, setSpeed] = useState(0);

  const fetchQuote = () => {
    setSpeed(0);
    setText("");
    setMistakes(new Set());
    setLoading(true);
    fetch("https://quote-garden.herokuapp.com/api/v3/quotes/random")
      .then((response) => response.json())
      .then((json) => {
        const { data } = json;
        const { quoteText, quoteAuthor } = data[0];
        const formattedQuote = format(quoteText) + "_-_" + format(quoteAuthor);
        setQuote(formattedQuote);
        setRows(Math.ceil(formattedQuote.length / 78));
        setLoading(false);
      });
  };
  const checkMistakes = (e) => {
    const { value } = e.target;
    const formatValue = format(value);
    if (formatValue !== quote.slice(0, formatValue.length)) {
      setText((prev) => (prev ? quote.slice(0, prev.length) : ""));
      setMistakes((prev) => new Set([...prev, text.length]));
    } else {
      setText(formatValue);
      if (formatValue === quote) {
        setFocus(false);
      }
    }
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
    } else {
      const time = (new Date() - start) / 1000;
      const speed = (quote.length * 12) / time;
      setSpeed(speed);
    }
  }, [focus]);

  return (
    <div className="App">
      <h1 className="heading" align="center">
        Typer
      </h1>
      <div className="arena" style={{ height: `${rows + 3}rem` }}>
        {isloading ? (
          <img src={loader} alt="Loding..." height="100px" />
        ) : (
          <>
            <textarea
              cols="80"
              rows={rows}
              style={{ zIndex: 3 }}
              value={text}
              disabled={speed !== 0}
              onChange={(e) => checkMistakes(e)}
              onKeyDown={(e) => avoidBackspace(e)}
              onFocus={() => setFocus(true)}
            ></textarea>
            <textarea
              cols="80"
              rows={rows}
              disabled
              style={{ color: "gray", backgroundColor: "white" }}
              value={quote}
            />
          </>
        )}
      </div>
      {text && (
        <>
          <p align="center">
            Mistakes{" "}
            {mistakes.size > 0 ? (
              <span style={{ color: "red" }}> {mistakes.size}</span>
            ) : (
              mistakes.size
            )}
          </p>

          <div className="mistake">
            {format(text)
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
        </>
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
