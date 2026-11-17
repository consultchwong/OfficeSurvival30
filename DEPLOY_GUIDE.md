# 《Office Survival 30 Days》（社畜生存 30 天）自動化打包與遊戲平台上架指南

本專案已內建 GitHub Actions 自動化工作流（`.github/workflows/game-release.yml` 與 `.github/workflows/record-trailer.yml`），無需在本地安裝額外打包工具，即可於雲端完成 TypeScript 檢查、單元測試、雙版本 ZIP 打包與 Y8 / CrazyGames 實機宣傳影片錄製。

---

## 一、 下載雙平台打包檔（免終端機）

1. 將代碼 Push 到 GitHub 倉庫（`main` 或 `master` 分支）。
2. 打開 GitHub 倉庫的 **Actions** 標籤頁，查看最新的 **Build Game Release & Deploy** 執行結果（也可點擊右側 **Run workflow** 手動觸發）。
3. 在頁尾 **Artifacts** 區塊依目標平台上傳需求下載對應 ZIP：
   - **`game-portal-release.zip`（Y8 / GamePix / itch.io 專用）**：無任何外部平台 SDK 腳本，純相對路徑 `./` 打包，根目錄即為 `index.html`。
   - **`crazygames-release.zip`（CrazyGames 專用）**：於編譯階段設定 `VITE_PORTAL=crazygames`，自動注入 CrazyGames SDK v3 並整合 `init()`、`gameplayStart()`、`gameplayStop()`、`happytime()`、雲端存檔（`SDK.data`）與激勵廣告復活（`SDK.ad.requestAd('rewarded')`）。

---

## 二、 各大遊戲平台部署方式

### 1. Y8 Games（ZIP 上傳）
1. 下載 `game-portal-release.zip`（解壓根目錄即包含 `index.html`，支援相對路徑與 iframe 掛載）。
2. 登入 Y8 開發者後台並上傳 `game-portal-release.zip`。
3. 如需自動產出符合 Y8 規範的實機截圖（`1280×720`、`760×570`）、宣傳圖（`1920×1080`、`1080×1920`、`760×570`）與 ≥15 秒無開場黑畫面實機影片，請於 GitHub Actions 執行 **Generate Platform Media Pack (Y8 & CrazyGames)**（`.github/workflows/record-trailer.yml`）並下載 **`y8-media-pack`**。

### 2. CrazyGames（建議手動上傳 `crazygames-release.zip`）
1. 下載 `crazygames-release.zip`。
2. 登入 CrazyGames Developer Portal，於遊戲版本管理頁面上傳 ZIP，並使用 **CrazyGames QA Tool** 測試 `gameplayStart` / `gameplayStop`、雲端存檔與激勵廣告復活流程。
3. > **注意：** `.github/workflows/game-release.yml` 內的 `npx @crazygames/sdk-cli upload` 僅為選用範例（若 `CRAZYGAMES_TOKEN` 未設定會自動跳過）；目前官方標準流程建議直接於 CrazyGames Developer Portal 上傳 `crazygames-release.zip`。

### 3. GamePix（GitHub Pages URL Hosting）
1. 在 GitHub 倉庫 **Settings -> Pages** 將 **Source** 切換為 **GitHub Actions**。
2. 每次 Push 後，遊戲會自動部署至 `https://<你的帳號>.github.io/<專案名>/`。
3. 在 GamePix 後台選擇 **Host on your own server** 並填入上述網址即可。

---

## 三、 Y8 & CrazyGames 上架合規檢查清單（Deployment Review）

| 檢查項目 | 狀態 | 說明 |
| :--- | :--- | :--- |
| **相對路徑與根目錄 `index.html`** | ✅ 通過 | `vite.config.ts` 設定 `base: './'`，兩個 ZIP 根目錄皆為 `index.html`，支援 iframe 子路徑掛載。 |
| **Y8 / CrazyGames 雙包隔離** | ✅ 通過 | Y8 使用 `game-portal-release.zip`（零外部 SDK）；CrazyGames 使用 `crazygames-release.zip`（自動注入 SDK v3）。 |
| **預設英文與多國語言切換** | ✅ 通過 | 預設語言為 **English (`en`)**，支援即時切換 `English` / `繁體中文` / `日本語` / `한국어`（涵蓋全部 51 張卡牌與 8 位主角）。 |
| **CrazyGames SDK v3 生命週期** | ✅ 通過 | 實作 `init()`、`gameplayStart()`、`gameplayStop()`（含 Pause、圖鑑視窗、結算畫面）、`happytime()`、雲端存檔與僅在 `adFinished` 發放復活獎勵的激勵廣告邏輯。 |
| **視窗失焦靜音與防右鍵／捲動** | ✅ 通過 | 監聽 `visibilitychange` 與 `blur`/`focus` 自動暫停 Web Audio，並停用 `contextmenu` 與方向鍵／空白鍵頁面捲動。 |
| **零外部字型／圖片網路依賴** | ✅ 通過 | 全角色與粒子皆以原生 SVG / HTML5 Canvas 與系統字型渲染，無外部字型請求風險，離線或嚴格 CSP 環境均可流暢運行。 |
| **平台封面與宣傳影片素材** | ✅ 通過 | `src/assets/images/` 已收錄日系職場主題專屬橫版封面、直版海報與方形圖示，配合 `record-trailer.yml` 一鍵生成 Y8 與 CrazyGames 全規格素材包。 |

---

## 四、 一鍵產出平台宣傳影片與實機截圖

執行 GitHub Actions 中的 **Generate Platform Media Pack (Y8 & CrazyGames)**（`.github/workflows/record-trailer.yml`），可選 `all`、`y8`、`crazygames` 或 `social`：

- `scripts/record-trailer.mjs` 會透過 `?trailer=1` 自動載入高張力職場卡牌對局並跳過標題畫面，於 `1280×720`、`960×720`、`1920×1080`、`800×1200` 與 `720×1280` 視窗中執行真實 Tinder 式拖曳預覽、左右滑卡決策與 32 位角色圖鑑瀏覽，錄製 17–18 秒無聲高清 MP4 影片與全尺寸實機截圖。
- **CrazyGames 影片片頭**：workflow 會自動將 `src/assets/images/cover_landscape_1794807572982.jpg` 與 `cover_portrait_1794807573222.jpg` 合成為 0.5 秒靜態封面片頭 + 16.5 秒實機畫面（共 17 秒無聲 MP4），完全符合 CrazyGames 封面動畫預覽規範。
