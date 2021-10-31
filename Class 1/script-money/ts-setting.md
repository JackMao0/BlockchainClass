# typescript 环境配置

首先需要 yarn，`npm i -g yarn`
yarn add web3 moment @ethereumjs/tx dotenv
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-alloy prettier typescript ts-node ts-node-dev @types/node
tsc --init
项目根目录创建一个.vscode/settings.json，内容如下

```json
{
    "eslint.validate": ["typescript"],
    "typescript.tsdk": "node_modules/typescript/lib",
    "files.eol": "\n",
    "editor.tabSize": 4,
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

.eslintrc 和 prettier 配置见文件和网页参考： https://ts.xcatliu.com/engineering/lint.html

用 `ts-node test.ts` 运行
