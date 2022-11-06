# i18n with Google SpreadSheet

このスクリプトでGoogle Sheets(スプレッドシート)から多言語に対応するアプリ・ウェブサイトを簡単に作ることが出来ます。
このスクリプトはGoogle Sheetsに入力されたテキストをCSVファイルに保存した後、jsonファイルに変換します。

Google Sheetsを使用したら…
- 一人はもちろん、他人との翻訳・検収作業がさらに便利になります。
- Google Sheetsの便利で強力な機能を全部使えます。
- JSONや他の言語ファイルを修正する時の文法エラーなど不便な点がありません。
- カスタムスクリプトなどを作ってビルドする時・ウェブサイトを配信する時言語対応ファイルを自動で更新させることが出来ます！

![Image](./images/image.png)

# 例
まずは次のURLを通じてGoogle Sheetsから作成されたファイルを見てください。
https://docs.google.com/spreadsheets/d/1SVrzDQBLD72GAtxoCPad7sJTzuDnnTJ3arOrD_ADack/edit#gid=0

あと、このRepoをCloneまたはダウンロードして次のコマンドを実行してください：
```
npm install

node index.js target=1SVrzDQBLD72GAtxoCPad7sJTzuDnnTJ3arOrD_ADack lang=ko,en,ja output=result
```

yarnを使う方はこちら：

```
yarn

node index.js target=1SVrzDQBLD72GAtxoCPad7sJTzuDnnTJ3arOrD_ADack lang=ko,en,ja output=result
```

*このスクリプトは`axios`及び`csv-parser`を使っています。`npm install`または`yarn`コマンドを実行したらすぐインストールされます。*

# スタートガイド
1. `index.js`ファイルをプロジェクトの内またはお好きなフォルダーに置いてください。
2. 次のパラメータガイドを読んで、`node index.js`ファイルをパラメータ付きで実行してください。

## パラメータ一覧
### target
Google Sheets(スプレッドシート)のIDです。ウェブブラウザのアドレスバーから探せます。


https://docs.google.com/spreadsheets/d/1SVrzDQBLD72GAtxoCPad7sJTzuDnnTJ3arOrD_ADack/edit#gid=0

例えば、このURLから`1SVrzDQBLD72GAtxoCPad7sJTzuDnnTJ3arOrD_ADack`みたいに英文字と数字で出来ているトークンを探すことが出来ます。（`/d/`と`/edit`の間）

`target=<GOOGLE SPREADSHEET ID>`

**注意：このスクリプトがファイルをダウンロードするには、ファイルの公開設定を少なくとも`閲覧者`に設定する必要があります。**

### gid
一つのファイルから管理中のシートが多い場合、特定なシートを指定するために使います。
URLからの`#gid=`後のテキストを使ってください。
ディフォルトは`0`です。


`gid=<GOOGLE SPREADSHEET's SHEET ID>`


### lang
作りたい言語ファイル指定する言語の配列です。2件以上には`,`を使って分けます。
**`nuxt`パラメータを`true`にする場合、このパラメータはスキップされます。**

`lang=<LANG,LANG1,LANG2 ...>`

例：
`lang=ko,en,ja`

### output
結果ファイル（JSON)が保存されるディレクトリです。 ディフォルトは`./`です。

`output=<OUTPUT PATH>`

## パラメータ一覧（nuxt.js）
このパラメータはnuxt.jsを使用する時だけ使えます。

### nuxt
設定ファイルをnuxt.config.jsから自動でロードします。

**このパラメータを`true`にする場合、`lang`パラメータはスキップされます。**

例：
`nuxt=true`

### config
nuxt.config.jsファイルを指定します。ディフォルトは`./nuxt.config.js`です。

例：
`config=./nuxt.config.js`

# その他
## 言語シートファイルに同じキーが2件以上ある場合
このスクリプトでは同じキーが2件以上ある場合、普通のStringの代わりに配列を作ります。

例えば、`general.array.example`と言うキーが5件ある場合、JSONファイルで`general.array.example`のキーに5件の翻訳テキストが入っている配列が作られます。




# LICENSE
MIT