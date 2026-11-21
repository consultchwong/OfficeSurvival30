# 《Office Survival 30 Days》（社畜生存 30 天）自動化打包與遊戲平台上架指南

本專案已內建 GitHub Actions 自動化工作流（`.github/workflows/game-release.yml` 與 `.github/workflows/record-trailer.yml`），無需在本地安裝額外打包工具，即可於雲端完成 TypeScript 檢查、單元測試、合規驗證、雙版本 ZIP 打包與 Y8 / CrazyGames 實機宣傳影片錄製。

---

## 一、 下載雙平台打包檔（免終端機）

1. 將代碼 Push 到 GitHub 倉庫（`main` 或 `master` 分支）。
2. 打開 GitHub 倉庫的 **Actions** 標籤頁，查看最新的 **Build Game Release & Deploy** 執行結果（也可點擊右側 **Run workflow** 手動觸發）。
3. 工作流會自動執行 `npm run lint`、`npm test`、雙目標建置並進行 **Y8 & CrazyGames 合規自動檢查**，於頁尾 **Artifacts** 區塊下載對應 ZIP：
   - **`game-portal-release.zip`（Y8 / GamePix / itch.io 專用）**：執行 `npm run build` 產生，無任何外部平台 SDK 腳本，純相對路徑 `./` 打包，根目錄即為 `index.html`。
   - **`crazygames-release.zip`（CrazyGames 專用）**：執行 `npm run build:crazygames`（`VITE_PORTAL=crazygames vite build --outDir dist-cg`），透過 `transformIndexHtml` (`order: 'pre'`) 自動注入 CrazyGames SDK v3，整合冪等 `init()`、`gameplayStart()` / `gameplayStop()`、`happytime()`、雲端存檔（`SDK.data`）、`countryCode` 語系偵測與具 `adRequestInFlight` 防連點鎖定之激勵廣告流程（`SDK.ad.requestAd('rewarded')`）。

---

## 二、 各大遊戲平台部署方式

### 1. Y8 Games（ZIP 上傳）
1. 下載 `game-portal-release.zip`（解壓根目錄即包含 `index.html`，支援相對路徑 `./assets/` 與 iframe 掛載）。
2. 登入 Y8 開發者後台並上傳 `game-portal-release.zip`。
3. 如需自動產出符合 Y8 規範的實機截圖（`1280×720`、`760×570`）、宣傳圖（`1920×1080`、`1080×1920`、`760×570`）與 ≥15 秒無開場黑畫面實機影片，請於 GitHub Actions 執行 **Generate Platform Media Pack (Y8 & CrazyGames)**（`.github/workflows/record-trailer.yml`）並下載 **`y8-media-pack`**。

### 2. CrazyGames（建議手動上傳 `crazygames-release.zip`）
1. 下載 `crazygames-release.zip`。
2. 登入 CrazyGames Developer Portal，於遊戲版本管理頁面上傳 ZIP，並使用 **CrazyGames QA Tool** 測試 `gameplayStart` / `gameplayStop`（確認 Pause、圖鑑視窗、稽核彈窗、結算畫面與 `adError` 時不會誤觸發 `gameplayStart`）、雲端存檔與激勵廣告流程。
3. > **注意：** `.github/workflows/game-release.yml` 內的 `npx @crazygames/sdk-cli upload` 僅為選用步驟（若 `CRAZYGAMES_TOKEN` 未設定會自動跳過）；目前官方標準流程建議直接於 CrazyGames Developer Portal 上傳 `crazygames-release.zip`。

### 3. GamePix / itch.io（GitHub Pages URL Hosting 或 ZIP）
1. 在 GitHub 倉庫 **Settings -> Pages** 將 **Source** 切換為 **GitHub Actions**。
2. 每次 Push 後，遊戲會自動部署至 `https://<你的帳號>.github.io/<專案名>/`。
3. 在 GamePix 後台選擇 **Host on your own server** 並填入上述網址（或於 itch.io 直接上傳 `game-portal-release.zip` 並勾選 *This file will be played in the browser*）。

---

## 三、 Y8 & CrazyGames 上架合規檢查清單（Deployment Review）

| 檢查項目 | 狀態 | 說明 |
| :--- | :--- | :--- |
| **相對路徑與根目錄 `index.html`** | ✅ 通過 | `vite.config.ts` 於建置期設定 `base: './'`，兩個 ZIP 根目錄皆為 `index.html`，支援 iframe 子路徑掛載；CI 自動驗證 `unzip -Z1` 與 `./assets/` 路徑。 |
| **Y8 / CrazyGames 雙包隔離** | ✅ 通過 | Y8 使用 `game-portal-release.zip`（CI 驗證零 `crazygames-sdk-v3.js`）；CrazyGames 使用 `crazygames-release.zip`（pre-order 自動注入 SDK v3）。 |
| **預設英文與多國語言切換** | ✅ 通過 | 預設語言為 **English (`en`)**，支援即時切換 `English` / `繁體中文` / `日本語` / `한국어`（完整翻譯 **83 張卡牌、24 位可操控主角與 64 位角色圖鑑**）。 |
| **零聯網地理與語系偵測** | ✅ 通過 | 完全零外部 IP HTTP 請求：依序讀取 `?lang=`、使用者偏好、`SDK.user.systemInfo.countryCode`、`Intl.DateTimeFormat` 時區與 `navigator.languages`，於平台停用時自動退回英文。 |
| **CrazyGames SDK v3 生命週期與防呆** | ✅ 通過 | 實作冪等 `ensureSdkInit()`、`adRequestInFlight` 防連點鎖、`settled` 回呼鎖與 `extractAdErrorReason` 錯誤提示；僅於實際遊玩狀態恢復 `gameplayStart()`，廣告中斷或 `adError` 皆安全解除靜音並避免稽核懲罰逃課。 |
| **視窗失焦靜音與防右鍵／捲動** | ✅ 通過 | 監聽 `visibilitychange`、`blur` / `focus` 自動暫停 Web Audio，並停用 `contextmenu` 與方向鍵／空白鍵造成的頁面捲動。 |
| **零外部字型／圖片網路依賴** | ✅ 通過 | 全角色以原生向量 SVG 繪製，粒子特效使用 60fps HTML5 Canvas，音效以 Web Audio API 即時合成，無任何外部 Google Fonts 或圖片 CDN 請求，離線與嚴格 CSP 環境均可流暢運行。 |
| **平台封面與宣傳影片素材** | ✅ 通過 | `record-trailer.yml` 支援自動擷取橫版／直版／方形封面（若無靜態圖片則由 Playwright 自動渲染標題畫面備援圖）並合成 Y8 與 CrazyGames 全規格素材包。 |

---

## 四、 一鍵產出平台宣傳影片與實機截圖

執行 GitHub Actions 中的 **Generate Platform Media Pack (Y8 & CrazyGames)**（`.github/workflows/record-trailer.yml`），可選 `all`、`y8`、`crazygames` 或 `social`：

- `scripts/record-trailer.mjs` 會透過 `?trailer=1` 自動載入高張力職場卡牌對局並跳過標題畫面，於 `1280×720`、`960×720`、`1920×1080`、`800×1200` 與 `720×1280` 視窗中執行真實 Tinder 式拖曳預覽、左右滑卡決策與 **64 位職場角色圖鑑** 瀏覽，錄製 17–18 秒無聲高清 MP4 影片與全尺寸實機截圖。
- 若倉庫內未提供自訂封面圖檔，`scripts/record-trailer.mjs` 也會透過 `?lang=en` 自動拍攝 `1920×1080`、`800×1200` 與 `800×800` 高解析英文封面作為備援素材，並由 `ffmpeg` 自動裁切輸出 Y8（`1920×1080`、`1080×1920`、`760×570`）與 CrazyGames（`1920×1080`、`800×1200`、`800×800` 及 0.5s 封面片頭 + 16.5s 實機影片）全套上傳包。
