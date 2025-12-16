# Problem 3: Messy React Code

## Issues Found

1.  **Logical Error in Filter Implementation**:
    In the `filter` callback, `lhsPriority` is used but it is not defined. The variable `balancePriority` is defined but ignored. This would cause a crash or `ReferenceError` at runtime.

    ```typescript
    const balancePriority = getPriority(balance.blockchain);
    if (lhsPriority > -99) {
      // lhsPriority is undefined
      // ...
    }
    ```

2.  **Incorrect Filtering Logic**:
    The code returns `true` if `balance.amount <= 0`. This means it _keeps_ empty or negative balances and _discards_ positive balances (assuming the `if` block is the only way to return true). Typically, a wallet page should show assets with `amount > 0`.

3.  **Redundant re-calculation in `map`**:
    `sortedBalances` is mapped to `formattedBalances`, but then `rows` maps over `sortedBalances` again. The `formatted` property is added in `formattedBalances` but never used from that array. Instead, the code tries to access `balance.formatted` inside the `rows` map, where `balance` comes from `sortedBalances`, so it shouldn't even have the `formatted` property. This is a type safety issue and logic error.

4.  **Inefficient Sorting**:
    The comparators in the `sort` function do not handle the case where `leftPriority === rightPriority`. This effectively returns `undefined` (or 0 implicitly in some JS engines, but TypeScript might complain if the return type isn't compatible with `number`), leading to unstable sorting behavior.

5.  **Unnecessary Dependency in `useMemo`**:
    The `prices` array is included in the `useMemo` dependency array for `sortedBalances`, but `sortedBalances` logic (filtering and sorting by priority) does not use `prices`. This causes the expensive sort/filter operation to re-run whenever `prices` update, which is often frequent in crypto apps.

6.  **Use of `any`**:
    The `blockchain` parameter in `getPriority` uses `any`. It should use a string literal type or enum to ensure type safety.

7.  **Anti-pattern: Using index as key**:
    `key={index}` is used in React lists. If the list items are reordered (which they are, via sorting), using index as a key can cause rendering bugs and performance issues. It should use a unique ID from the data (e.g., `balance.currency`).

8.  **Heavy Component**:
    The formatting logic and mapping are done inside the render body. While `useMemo` is used for sorting, the mapping to `formattedBalances` and then to `rows` happens on every render.

## Refactored Code

```tsx
import React, { useMemo } from "react";

// Added Constants to avoid hardcoding strings

interface Props extends BoxProps {}

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

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

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

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) return -1;
        if (rightPriority > leftPriority) return 1;
        return 0;
      });
  }, [balances]);

  const rows = sortedBalances.map((balance: WalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    const formattedAmount = balance.amount.toFixed();

    return (
      <WalletRow
        className={classes.row}
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={formattedAmount}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
```

## Results

![Results](./docs/overall.png)
