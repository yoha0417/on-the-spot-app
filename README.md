# やあ、ようこそ 👋

これは [Expo](https://expo.dev) プロジェクトだよ。[`create-expo-app`](https://www.npmjs.com/package/create-expo-app) で作成したんだ。

## 始め方

1. 依存パッケージをインストール

   ```bash
   npm install
   ```

2. アプリを起動

   ```bash
   npx expo start
   ```

出力に表示される選択肢から、アプリを開けるよ：

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android エミュレーター](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS シミュレーター](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)（Expo の開発を試すための限定的なサンドボックス）

開発を始めるには、**app** ディレクトリの中のファイルを編集してね。このプロジェクトは [ファイルベースのルーティング](https://docs.expo.dev/router/introduction) を採用しているよ。

## プロジェクトをリセットしたいとき

準備ができたら、次を実行してね：

```bash
npm run reset-project
```

このコマンドでスターターコードが **app-example** ディレクトリに移動されて、空っぽの **app** ディレクトリが作られるから、そこから自由に開発を始められるよ。

### その他のセットアップ

- ESLint で lint を行うには `npx expo lint` を実行するか、ガイド ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/) を見てね
- ユニットテストを設定するなら ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/) が参考になるよ
- このテンプレートの TypeScript 設定については ["Using TypeScript"](https://docs.expo.dev/guides/typescript/) に情報があるよ

## もっと学ぶ

プロジェクトを Expo で開発するために、以下のリソースもチェックしてね：

- [Expo ドキュメント](https://docs.expo.dev/): 基本を学んだり、[ガイド](https://docs.expo.dev/guides) で応用的なトピックにも挑戦しよう
- [Learn Expo チュートリアル](https://docs.expo.dev/tutorial/introduction/): Android、iOS、Web で動くプロジェクトを段階を追って作っていくよ

## コミュニティに参加しよう

ユニバーサルアプリを作っている開発者のコミュニティにぜひ参加してね。

- [Expo on GitHub](https://github.com/expo/expo): オープンソースのプラットフォームを見たり、コントリビュートしたりできるよ
- [Discord コミュニティ](https://chat.expo.dev): Expo ユーザーとチャットして質問したり情報交換しよう
