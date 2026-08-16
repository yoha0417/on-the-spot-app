# 目的
現在地からの距離に応じたチェックイン/チェックアウト機能を実装してください。

# 1. ライブラリの追加
- 距離計算のために `geolib` をインストールしてください。コマンド: `npm install geolib`

# 2. 距離計算ロジックの実装
- `src/app/(tabs)/map.tsx` （または該当のマップコンポーネント）を修正してください。
- `geolib` の `getDistance` メソッドを使用して、ユーザーの現在地（今は新宿御苑周辺からのシミュレーション座標）と、選択したスポットの座標間の距離（メートル）を計算してください。

# 3. 吹き出し (Callout) のUI要件
マーカーをタップした際の吹き出し内に、以下の条件分岐でUIを表示してください。
1. **距離が50m以内の場合 かつ 未チェックイン:**
   - 「チェックイン」ボタン（テーマカラー: `#10B981`）を表示。
2. **現在そのスポットにチェックイン中の場合:**
   - 「チェックアウト」ボタン（色: 任意、例: グレーや赤）を表示。
3. **距離が50mより遠い場合:**
   - ボタンを無効化（disabled）するか非表示にし、「チェックイン範囲外です（現在: 約〇〇m）」というテキストを表示。

# 4. 状態管理（仮実装）
- 「現在どこにチェックインしているか」の状態（`placeId`）をContextまたはローカルステートで持たせてください。
- ボタンを押した際、実際のAPI（`apiClient.ts`）にPOSTリクエストを送る処理を実装し、成功したら状態を更新してください。
チェックインAPIとチェックアウトAPIの定義書は以下です。このAPIを呼ぶようにして。src/services/placesApi.tsを参考にAPIの呼び方を合わせて。

"/api/checkin": {
			post: {
				tags: ["チェックイン"],
				summary: "場所にチェックイン",
				description:
					"指定された緯度・経度が場所のチェックイン圏内（50m）にある場合、チェックインを記録します。JWT認証が必要です。",
				security: [{ BearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									lat: {
										type: "number",
										description: "現在地の緯度",
										example: 35.6895,
									},
									lng: {
										type: "number",
										description: "現在地の経度",
										example: 139.6917,
									},
									placeId: {
										type: "string",
										description: "チェックイン先の場所ID",
										example: "some-uuid",
									},
								},
								required: ["lat", "lng", "placeId"],
							},
						},
					},
				},
				responses: {
					"200": {
						description: "チェックイン成功",
					},
					"400": {
						description: "バリデーションエラー",
					},
					"401": {
						description: "認証エラー",
					},
				},
			},
		},
        "/api/checkout": {
			post: {
				tags: ["チェックイン"],
				summary: "手動チェックアウト",
				description:
					"現在滞在中の場所から明示的にチェックアウトします。JWT認証が必要です。",
				security: [{ BearerAuth: [] }],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									placeId: {
										type: "string",
										description: "チェックアウトする場所のID",
										example: "some-uuid",
									},
								},
								required: ["placeId"],
							},
						},
					},
				},
				responses: {
					"200": {
						description: "チェックアウト成功",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: { type: "boolean", enum: [true] },
									},
								},
							},
						},
					},
					"400": {
						description: "バリデーションエラー",
					},
					"401": {
						description: "認証エラー",
					},
					"404": {
						description: "アクティブな滞在が見つからない、または既にチェックアウト済み",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										error: { type: "string" },
									},
								},
							},
						},
					},
				},
			},
		},