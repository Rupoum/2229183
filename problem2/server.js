const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const BASE_URL = "http://20.244.56.144/evaluation-service";
const numberCache = [];

const API_ENDPOINTS = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand",
};

async function fetchNumbers(type) {
  try {
    const source = axios.CancelToken.source();
    setTimeout(() => source.cancel(), 500);

    const response = await axios.get(`${BASE_URL}/${type}`, {
      cancelToken: source.token,
    });
    return response.data.numbers || [];
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    return [];
  }
}

app.get("/numbers/:numberId", async (req, res) => {
  const { numberId } = req.params;
  if (!API_ENDPOINTS[numberId]) {
    return res.status(400).json({ error: "Invalid number type" });
  }

  const prevState = [...numberCache];
  const newNumbers = await fetchNumbers(API_ENDPOINTS[numberId]);

  const uniqueNumbers = newNumbers.filter((num) => !numberCache.includes(num));
  numberCache.push(...uniqueNumbers);

  while (numberCache.length > WINDOW_SIZE) {
    numberCache.shift();
  }

  const avg =
    numberCache.length > 0
      ? (
          numberCache.reduce((sum, num) => sum + num, 0) / numberCache.length
        ).toFixed(2)
      : 0;

  res.json({
    windowPrevState: prevState,
    windowCurrState: numberCache,
    numbers: newNumbers,
    avg: parseFloat(avg),
  });
});

app.listen(PORT, () => {
  console.log(`Average Calculator Microservice running on port ${PORT}`);
});
