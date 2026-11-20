module.exports = {
    testEnvironment: "node",
    testMatch: ["**/__tests__/system/**/*.test.ts"],
    transform: {
      "^.+\\.[jt]sx?$": [
        "babel-jest",
        {
          presets: [
            ["@babel/preset-env", { targets: { node: "current" } }],
            "@babel/preset-typescript",
          ],
        },
      ],
    },
  };