import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import { createServer, Model } from "miragejs";

createServer({
  models: {
    tweet: Model,
  },
  routes() {
    this.namespace = "api";
    this.get("tweets");
  },
  seeds(server) {
    server.createList("tweet", 5, { text: "Testing out my twtr" });

    setInterval(() => {
      server.create("tweet", { text: "Testing out my twtr" });
    }, 3000);
  },
});

const fetcher = (url) => fetch(url).then((res) => res.json());

// function useBufferedData(url) {
//   let { data, error } = useSWR(url, fetcher);
//   let [buffer, setBuffer] = useState();

//   let bufferedData;
//   if (!buffer) {
//     bufferedData = data;
//     if (data) setBuffer(data);
//   } else {
//     bufferedData = buffer;
//   }

//   // if (data && !buffer) {
//   //   setBuffer(data);
//   // }
//   // let bufferedData = buffer || data;
//   let isStale = buffer && data !== buffer;

//   let update = () => setBuffer(data);

//   return { data: bufferedData, error, isStale, update };
// }

function useBufferedData(url) {
  let { data, error } = useSWR(url, fetcher);
  let [buffer, setBuffer] = useState();

  if (data && !buffer) setBuffer(data);

  return {
    data: buffer || data,
    error,
    isStale: buffer && data !== buffer,
    update: () => setBuffer(data),
  };
}

export default function Home() {
  const { data, error, isStale, update } = useBufferedData("/api/tweets");

  if (error) return "An error has occurred.";
  if (!data) return "Loading...";

  return (
    <div>
      <div>
        New data:{" "}
        {isStale ? (
          <span>
            Yes
            <button onClick={update}>Update</button>
          </span>
        ) : (
          "No"
        )}
      </div>
      <ul>
        {[...data.tweets].reverse().map((tweet) => (
          <li key={tweet.id}>{tweet.id}</li>
        ))}
      </ul>
    </div>
  );
}
