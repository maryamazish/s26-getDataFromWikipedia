import { useEffect } from "react";
import { useState } from "react";
import Card from "../general/card";
import Title from "../general/title";

const Search = ({ onResult }) => {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("idle");

  const fetchInfo = async (article) => {
    setState("pending");
    onResult()
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${article}&format=json&origin=*`
    );
    if (!response.ok) {
      console.log("error");
      return;
    }
    const result = await response.json();
    onResult(result.query.search);
    setState("finished");
  };

  useEffect(() => {
    if (!query.length) {
      setState("idle");
      onResult(null);
      return;
    }
    setState("typing");
    const timer = setTimeout(() => {
      fetchInfo(query);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={state === "pending"}
      />
      <button onClick={() => fetchInfo(query)} disabled={state === "pending"}>
        Search
      </button>
      {state === "pending" && (
        //دایره لودینگ رو نمایش بده
        <div className="spin">
          <div className="child"></div>
        </div>
      )}
      {state === "typing" && <small>Typing ...</small>}
    </div>
  );
};

const Result = ({ articles }) => {
  return (
    <div className="elements-wrapper">
      {!!articles && (
        <div className="article-wrapper">
          <div>Result Count = {articles.length}</div>
          <ol>
            {articles.map((article) => {
              const snippet = getPlainText(article.snippet);
              const time = (article.wordcount) / 200;
              const timeForRead =
              article.wordcount < 60 ? Math.round(time) + " s" : Math.round(time) + " m";
              console.log("time",time)
              console.log(timeForRead)
              return (
                <>
                  <li key={article.pageid}>
                    <Title>
                      <a
                        href={`https://en.wikipedia.org/?curid=${article.pageid}`}
                        title={`${article.title} on wikipedia`}
                        target="_blank"
                      >
                        {article.title}
                      </a>
                    </Title>
                    <p>{snippet}</p>
                    <div>Word count : {article.wordcount}</div>
                    <div>Time for reading : {timeForRead}</div>
                  </li>
                </>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
};

const WikipediaSearcher = () => {
  const [articles, setArticles] = useState([]);
  return (
    <Card variant="shadow">
      <Search onResult={setArticles} />
      <Result articles={articles} />
    </Card>
  );
};

const getPlainText = (htmlString) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  return tempDiv.textContent || tempDiv.innerText || "";
};

export default WikipediaSearcher;
