# 役割
あなたはReact Native、Expo Router、React Native Paperの最新仕様に精通したシニアエンジニアです。
高い保守性、厳密なTypeScript、Lintルールを遵守した完璧なコードを出力してください。

# 目的
Expo Routerを用いて、添付の画面イメージを元に「Drawer（ハンバーガーメニュー）」と「Bottom Tabs」を組み合わせたアプリの骨組みを構築します。

# 1. アーキテクチャとディレクトリ構造 (厳守)
本プロジェクトでは、ルーティングとロジックを分離するため以下のディレクトリ構成を採用します。
- `app/`: ルーティングと画面レイアウトのみを担当。
- `src/constants/`: アプリ全体の定数（テーマや色）。
- `src/components/`: 再利用可能なUIコンポーネント。
ベタ書きを避け、保守しやすいようにファイルを適切に分割してください。

# 2. コーディング規約・Lintルール (厳守)
- **TypeScript:** `any` の使用は一切禁止。必ず適切な型定義（interface/type）を行うこと。
- **Lint意識:** 未使用変数を作らない、オプショナルチェイニングを徹底する。
- **インポート:** Expo Routerの仕様に従い、Drawerは `@react-navigation/drawer` ではなく、必ず `expo-router/drawer` からインポートすること。Tabsは `expo-router` からインポートすること。

# 3. テーマとスタイリング
- `src/constants/theme.ts` を新規作成し、React Native Paperの `MD3LightTheme` をベースにカスタムテーマを定義してください。
- メインカラー（primary）には `#10B981`（エメラルド・グリーン）を指定してください。

# 4. 構築するルーティング要件
以下の通り、必要なファイルを生成してください。

1. **`app/_layout.tsx` (ルートドロワー設定)**
   - ファイル先頭で必ず `import 'react-native-gesture-handler';` を行うこと。
   - `PaperProvider` でアプリ全体を囲み、`src/constants/theme.ts` のテーマを適用する。
   - `Drawer` ナビゲーションを設定し、以下の画面への導線を作る。
     - 「ホーム」 (後述のTabs)
     - 「設定」 (`app/settings.tsx`)
     - 「オープンデータ出典明記」 (`app/attribution.tsx`)

2. **`app/(tabs)/_layout.tsx` (ボトムタブ設定)**
   - タブの文字ラベルは非表示（`tabBarShowLabel: false`）とし、アイコンのみを表示。
   - アクティブなタブの色はテーマカラー `#10B981` を適用。
   - 左上のヘッダーに、Drawerを開くハンバーガーメニューアイコン（≡）を配置する。
   - 以下の3つのタブを配置：
     - 左: マップ (`index.tsx`, アイコン: `map-outline`)
     - 中央: タイムライン (`timeline.tsx`, アイコン: `chatbubbles-outline`)
     - 右: マイページ (`account.tsx`, アイコン: `person-outline`)

3. **プレースホルダー画面の作成**
   - `app/(tabs)/index.tsx`, `timeline.tsx`, `account.tsx`
   - `app/settings.tsx`, `app/attribution.tsx`
   ※ 各画面は、とりあえず画面名が表示される簡単なTextコンポーネントのみで構いません。

# 出力形式
不要な解説は省き、ディレクトリ作成・ファイル作成の手順と、各ファイルの完全なコードブロックのみを出力してください。省略やプレースホルダーコメント（`// ...`）は絶対に書かず、そのままコピペして動く完全なコードを出力してください。