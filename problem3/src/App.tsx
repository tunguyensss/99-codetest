import React, { useMemo, useState, useEffect } from "react";
import "./App.css";

const BLOCKCHAIN = {
  OSMOSIS: "Osmosis",
  ETHEREUM: "Ethereum",
  ARBITRUM: "Arbitrum",
  ZILLIQA: "Zilliqa",
  NEO: "Neo",
} as const;

type Blockchain = (typeof BLOCKCHAIN)[keyof typeof BLOCKCHAIN] | string;

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

interface Prices {
  [key: string]: number;
}

const useWalletBalances = (): WalletBalance[] => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setBalances([
        { currency: "OSMO", amount: 100, blockchain: BLOCKCHAIN.OSMOSIS },
        { currency: "ETH", amount: 2.5, blockchain: BLOCKCHAIN.ETHEREUM },
        { currency: "ARB", amount: 500, blockchain: BLOCKCHAIN.ARBITRUM },
        { currency: "ZIL", amount: 10000, blockchain: BLOCKCHAIN.ZILLIQA },
        { currency: "NEO", amount: 0, blockchain: BLOCKCHAIN.NEO },
        { currency: "Unknown", amount: 50, blockchain: "UnknownChain" },
      ]);
    }, 500);
  }, []);

  return balances;
};

const usePrices = (): Prices => {
  const [prices, setPrices] = useState<Prices>({});
  useEffect(() => {
    setTimeout(() => {
      setPrices({
        OSMO: 1.5,
        ETH: 3000,
        ARB: 1.2,
        ZIL: 0.02,
        NEO: 10,
        Unknown: 0.5,
      });
    }, 500);
  }, []);
  return prices;
};

const getPriority = (blockchain: Blockchain): number => {
  switch (blockchain) {
    case BLOCKCHAIN.OSMOSIS:
      return 100;
    case BLOCKCHAIN.ETHEREUM:
      return 50;
    case BLOCKCHAIN.ARBITRUM:
      return 30;
    case BLOCKCHAIN.ZILLIQA:
      return 20;
    case BLOCKCHAIN.NEO:
      return 20;
    default:
      return -99;
  }
};

const WalletRow: React.FC<{
  amount: number;
  usdValue: number;
  formattedAmount: string;
  className?: string;
  currency: string;
}> = ({ usdValue, formattedAmount, className, currency }) => {
  return (
    <div className={`wallet-row ${className || ""}`}>
      <div className="row-left">
        <span className="currency-name">{currency}</span>
        <span className="amount">{formattedAmount}</span>
      </div>
      <div className="row-right">
        <span className="usd-value">${usdValue.toFixed(2)}</span>
      </div>
    </div>
  );
};

const WalletPage: React.FC<BoxProps> = (props: BoxProps) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        return 0;
      });
  }, [balances]);

  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map(
    (balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(2),
      };
    }
  );

  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = (prices[balance.currency] || 0) * balance.amount;
    return (
      <WalletRow
        className="wallet-row-item"
        key={balance.currency}
        currency={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest} className="wallet-page">
      <h1>Wallet Balances</h1>
      <div className="wallet-list">
        {rows.length > 0 ? (
          rows
        ) : (
          <div className="loading">Loading balances...</div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="app-container">
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <WalletPage />
    </div>
  );
}

export default App;
