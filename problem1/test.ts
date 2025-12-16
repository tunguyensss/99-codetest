import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./index";

const testCases = [1, 5, 10, 100];

function runTest() {
  console.log("Running tests...");

  testCases.forEach((n) => {
    const expected = (n * (n + 1)) / 2;
    const resultA = sum_to_n_a(n);
    const resultB = sum_to_n_b(n);
    const resultC = sum_to_n_c(n);

    console.log(`n = ${n}, expected = ${expected}`);
    console.log(
      `Function A: ${resultA} (${resultA === expected ? "PASS" : "FAIL"})`
    );
    console.log(
      `Function B: ${resultB} (${resultB === expected ? "PASS" : "FAIL"})`
    );
    console.log(
      `Function C: ${resultC} (${resultC === expected ? "PASS" : "FAIL"})`
    );
    console.log("---");

    if (resultA !== expected || resultB !== expected || resultC !== expected) {
      console.error("Test FAILED");
      process.exit(1);
    }
  });

  console.log("All tests PASSED");
}

runTest();
