var sum_to_n_a = function (n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_b = function (n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return n + sum_to_n_b(n - 1);
};

var sum_to_n_c = function (n: number): number {
  return (n * (n + 1)) / 2;
};

// Export for testing
export { sum_to_n_a, sum_to_n_b, sum_to_n_c };
