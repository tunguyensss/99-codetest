import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import TokenIcon from "./TokenIcon";

interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

interface ExchangeRate {
  [currency: string]: number;
}

const CurrencySwapForm: React.FC = () => {
  const [prices, setPrices] = useState<TokenPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fromCurrency, setFromCurrency] = useState("ETH");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState<string>("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapResult, setSwapResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get<TokenPrice[]>(
          "https://interview.switcheo.com/prices.json"
        );
        setPrices(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch prices", err);
        setError("Failed to load token prices.");
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const uniqueTokens = useMemo(() => {
    return Array.from(new Set(prices.map((p) => p.currency))).sort();
  }, [prices]);

  const exchangeRates = useMemo<ExchangeRate>(() => {
    const rates: ExchangeRate = {};
    prices.forEach((p) => {
      rates[p.currency] = p.price;
    });
    return rates;
  }, [prices]);

  const calculateExchangeAmount = () => {
    const fromPrice = exchangeRates[fromCurrency];
    const toPrice = exchangeRates[toCurrency];

    if (!fromPrice || !toPrice || !amount) return 0;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;

    return (numAmount * fromPrice) / toPrice;
  };

  const exchangeAmount = calculateExchangeAmount();
  const exchangeRate =
    exchangeRates[fromCurrency] && exchangeRates[toCurrency]
      ? exchangeRates[fromCurrency] / exchangeRates[toCurrency]
      : 0;

  const handleSwap = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setIsSwapping(true);

    // Mock API call
    setTimeout(() => {
      setIsSwapping(false);
      setSwapResult(
        `Swapped ${amount} ${fromCurrency} to ${exchangeAmount.toFixed(
          6
        )} ${toCurrency}`
      );
      setAmount("");
      setTimeout(() => setSwapResult(null), 3000);
    }, 1500);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setAmount(val);
    }
  };

  if (loading) return <div className="loading-spinner">Loading prices...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="swap-card">
      <div className="card-header">
        <h2>Swap Assets</h2>
        <p>Trade tokens in an instant</p>
      </div>

      <div className="input-group">
        <label>Amount to send</label>
        <div className="input-wrapper">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.0"
            className="amount-input"
          />
          <div className="currency-selector">
            <TokenIcon symbol={fromCurrency} className="selector-icon" />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {uniqueTokens.map((token) => (
                <option key={`from-${token}`} value={token}>
                  {token}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="balance-info">
          Price: ${exchangeRates[fromCurrency]?.toFixed(2) || "-"}
        </div>
      </div>

      <div className="swap-divider">
        <button
          className="switch-btn"
          onClick={() => {
            setFromCurrency(toCurrency);
            setToCurrency(fromCurrency);
          }}
          title="Switch currencies"
        >
          ⇅
        </button>
      </div>

      <div className="input-group">
        <label>Amount to receive</label>
        <div className="input-wrapper">
          <input
            type="text"
            value={exchangeAmount ? exchangeAmount.toFixed(6) : ""}
            readOnly
            placeholder="0.0"
            className="amount-input readonly"
          />
          <div className="currency-selector">
            <TokenIcon symbol={toCurrency} className="selector-icon" />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {uniqueTokens.map((token) => (
                <option key={`to-${token}`} value={token}>
                  {token}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="balance-info">
          Price: ${exchangeRates[toCurrency]?.toFixed(2) || "-"}
        </div>
      </div>

      <div className="exchange-rate-info">
        {exchangeRate > 0 && (
          <p>
            1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
          </p>
        )}
      </div>

      <button
        className={`swap-submit-btn ${isSwapping ? "loading" : ""}`}
        disabled={!amount || parseFloat(amount) <= 0 || isSwapping}
        onClick={handleSwap}
      >
        {isSwapping ? "Swapping..." : "CONFIRM SWAP"}
      </button>

      {swapResult && <div className="success-toast">{swapResult}</div>}
    </div>
  );
};

export default CurrencySwapForm;
