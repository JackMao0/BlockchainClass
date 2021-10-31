yarn
yarn add typescript ts-node ts-node-dev @types/node web3 moment @ethereumjs/tx dotenv
tsc --init
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-alloy prettier
创建一个.vscode/settings.json
内容如下

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

.eslintrc 和 prettier 配置见文件

参考： https://ts.xcatliu.com/engineering/lint.html
