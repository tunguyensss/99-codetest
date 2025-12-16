import React, { useState } from "react";

interface TokenIconProps {
  symbol: string;
  className?: string;
}

const TokenIcon: React.FC<TokenIconProps> = ({ symbol, className }) => {
  const [error, setError] = useState(false);
  const baseUrl =
    "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

  // Handle some edge cases or mapping if necessary, but generally the symbol matches
  const iconUrl = `${baseUrl}${symbol}.svg`;

  if (error) {
    return (
      <div className={`token-icon-placeholder ${className}`} title={symbol}>
        {symbol[0]}
      </div>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={symbol}
      className={`token-icon ${className}`}
      onError={() => setError(true)}
    />
  );
};

export default TokenIcon;
