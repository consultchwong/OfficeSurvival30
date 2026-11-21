# Office Survival 30 Days (社畜生存 30 天 / 社畜生存 30 天)

An anime-styled corporate Reigns survival card game built with React, TypeScript, Tailwind CSS, Canvas 2D, and Web Audio API. Balance your **Slacking**, **Boss Favor**, **Savings**, and **Health** for 30 days across 83 workplace & influencer (KOL) event cards without hitting 0!

---

## English · Game Overview & Submission Metadata

* **Game Title**: Office Survival 30 Days (`社畜生存 30 天`)
* **Genre**: Corporate Survival / Narrative Card Decision (Reigns-style)
* **Supported Languages**: **English (`en`, default)**, **Traditional Chinese (`zh-TW`)**, **Japanese (`ja`)**, **Korean (`ko`)** — includes zero-network region/timezone/locale auto-detection (`countryCode` -> `Intl.DateTimeFormat` timezone -> `navigator.languages`) with manual override.
* **Short Tagline**: Swipe left or right to balance Slacking, Boss Favor, Savings, and Health across 30 days in a hilarious anime office!
* **Description**: Step into a chaotic modern corporation featuring **24 unlockable Playable Heroes** with passive workplace perks and a **64-character Codex** packed with corporate archetypes and creator/KOL parodies. Every swipe shifts four survival meters—hit `0%` in any meter and your run ends with a shareable Resignation/Burnout Certificate. Watch optional sponsor ads or handle surprise Compliance Audits (Days 8, 16, 24) to revive, earn Slack Coins, boost critical gauges, or suffer penalties if you refuse.
* **Keywords / Tags**: `card game`, `reigns`, `office`, `survival`, `anime`, `strategy`, `comedy`, `casual`, `simulation`

### How to Play & Controls

| Control / Input | Action |
| :--- | :--- |
| **Mouse Drag / Touch Swipe (Left or Right)** | Peek card decision stamp & commit left/right workplace choice |
| **`A` / `ArrowLeft` or `D` / `ArrowRight`** | Decide Left / Decide Right |
| **`Enter`** | Start run from Title screen |
| **`P` or `Escape`** | Pause / Resume game |
| **`M`** | Mute / Unmute Web Audio SFX |

### Core Features & Monetization Architecture

* **24 Playable Heroes & 64-Character Codex**: Unlock heroes using Slack Coins earned daily or via victory bonuses, each granting custom starting stats and passive mitigation/bonus perks across 83 localized event cards.
* **4 Monetization & Rewarded Ad Areas**:
  1. **Death Revive (`revive`)**: Full recovery to `50%` across all gauges after a KO.
  2. **Title & Roster Coin Bonus (`coin_bonus`)**: Earn `+45` Slack Coins (plus hero ad bonus) to unlock SSR/UR heroes.
  3. **HUD Emergency Sponsor Aid (`emergency_boost`)**: `+22` to the lowest gauge, `+6` to others, and bonus coins (5-day cooldown).
  4. **Mandatory Audit Check (`audit_penalty`)**: On Days 8, 16, and 24, choose between watching a sponsor ad for a stat boost + coins or refusing and suffering an instant `-15 Health / -12 Boss Favor / -10 Savings` penalty.
* **Zero External Runtime Dependencies**: All 64 character portraits are crisp procedural SVGs, backgrounds/particles render via 60fps HTML5 Canvas 2D, and sound effects synthesize via Web Audio API—zero external font or image CDNs required.

---

## 繁體中文 · 遊戲簡介與平台提交資訊

* **遊戲名稱**：社畜生存 30 天（Office Survival 30 Days）
* **遊戲類型**：日系職場王權（Reigns）滑卡生存策略遊戲
* **支援語系**：**English（預設英文）**、**繁體中文**、**日本語**、**한국어**（支援無聯網地理與時區／語系自動判斷，並可隨時手動切換）。
* **核心玩法**：
  * 收錄 **24 位可操作出戰主角**（具專屬被動職場特質）與 **64 位職場與 KOL 人物誌圖鑑**、**83 張隨機職場決策卡牌**。
  * 透過 **滑鼠拖曳／觸控左右滑卡** 或鍵盤 **`A`/`D`**、**方向鍵** 決定應對方式，平衡 **摸魚指數、主管好感、存款、健康** 四項指標撐過 30 天。
  * **4 大商業化與獎懲廣告區塊**：失敗滿血復活、首頁／圖鑑看廣告賺摸魚幣、牌局急難空投補給，以及第 8／16／24 天的「企業強制合規稽核」（看廣告過關拿獎勵，或拒看廣告承受即時扣血扣薪懲罰）。

---

## 简体中文 · 游戏简介与平台上架信息

* **游戏名称**：社畜生存 30 天（Office Survival 30 Days）
* **游戏类型**：日式职场王权（Reigns）滑卡生存策略游戏
* **支持语言**：**English（默认英文）**、**繁体中文**、**日本語**、**한국어**（支持零网络地理/时区/浏览器语言自动识别，并可随时切换）。
* **核心特色**：
  * 内置 **24 位可解锁出战主角**、**64 位职场与达人（KOL）图鉴角色** 与 **83 张双语本地化事件卡牌**。
  * 支持 **鼠标拖拽／触控左右滑卡** 与键盘 **`A`/`D`**、**方向键** 操作，平衡摸鱼、主管好感、存款与健康四大指标挺过 30 天。
  * **4 大激励广告与奖惩节点**：失败满血复活、大厅/图鉴广告赚币、局内最低属性急救补给，以及第 8/16/24 天强制合规稽核二选一（看广告拿奖励或拒绝受罚）。

---

## Technical Architecture & Build Commands

### Tech Stack

* **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons
* **Graphics & Audio**: Procedural Anime SVG Portraits + 60fps Canvas 2D VFX + Zero-asset Web Audio API Synthesizer
* **Platform SDK Integration**: Dual-build isolation (`game-portal-release.zip` with zero external SDK for Y8 / GamePix / itch.io; `crazygames-release.zip` with CrazyGames SDK v3 lifecycle, cloud saves, `countryCode` detection, and hardened rewarded ads)

### Local Scripts

```bash
# Install dependencies
npm install

# Run local development server (http://localhost:3000)
npm run dev

# Type-check & run unit tests (game logic, i18n geo-detection, hero/codex localization, SDK error parsing)
npm run lint
npm test

# Build generic Y8 / GamePix / itch.io bundle (dist/)
npm run build

# Build CrazyGames SDK v3 bundle (dist-cg/)
npm run build:crazygames
```

### Automated Packaging & Video/Media Pipeline

For step-by-step instructions on GitHub Actions dual-portal packaging (`game-release.yml`) and automated Y8 / CrazyGames screenshot & MP4 trailer generation (`record-trailer.yml`), see **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)**.
