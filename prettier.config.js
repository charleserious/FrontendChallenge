module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  proseWrap: 'always',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
  overrides: [
    {
      // https://github.com/prettier/prettier/blob/main/CHANGELOG.md#use-json-parser-for-tsconfigjson-by-default-16012-by-sosukesuzuki
      files: ['tsconfig.json', 'tsconfig.*.json'],
      options: {
        parser: 'jsonc',
      },
    },
  ],
};
