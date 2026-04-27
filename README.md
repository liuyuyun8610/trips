# 家族旅行 · Family Trips

紀錄家族旅行的網站。每趟旅行有專屬頁面，包含詳細行程、照片相簿。

## 功能

- 📋 **首頁卡片牆**：每趟旅行一張封面卡（封面照 + 日期 + 地點）
- 📅 **完整時間軸**：每天行程分段、每個項目可加標籤、Tip
- 📸 **照片上傳**：直接拍照上傳到 Supabase，可設為封面
- ✏️ **編輯模式**：網址加 `?edit` 切換編輯／檢視
- ☁️ **雲端儲存**：所有資料和照片在 Supabase，不存瀏覽器
- 🚫 **無需登入**：知道網址 + `?edit` 任何人都能編輯（不公開網址即可）

## 一次性設定（約 15 分鐘）

### 1. 建立 Supabase 專案

1. 到 https://supabase.com 註冊（免費方案足夠：500MB 資料庫 + 1GB 儲存空間）
2. 點 **New Project**
3. 取個名字（例：`family-trips`）、設個資料庫密碼、選離你近的 region（推薦 Tokyo / Singapore）
4. 等 1–2 分鐘建立完成

### 2. 建立資料表

1. 左側選單 → **SQL Editor**
2. 點 **+ New query**
3. 打開 `supabase-schema.sql`，**整個檔案內容複製貼上**
4. 點 **Run**（右下角）
5. 看到 "Success. No rows returned" 就 OK

### 3. 建立照片儲存空間

1. 左側選單 → **Storage**
2. 點 **New bucket**
3. Bucket name：`trip-photos`
4. **勾選 "Public bucket"**（一定要勾，照片才能顯示）
5. **Save**

### 4. 取得連線資訊

1. 左側選單 → **Project Settings**（⚙️）→ **API**
2. 複製：
   - **Project URL**（類似 `https://abcdefgh.supabase.co`）
   - **anon / public** key（很長一串）

### 5. 填入設定

打開 `config.js`，把兩個值替換：

```js
export const SUPABASE_URL = 'https://你的專案.supabase.co';
export const SUPABASE_ANON_KEY = '你的-anon-key';
```

### 6. 部署到 GitHub Pages

**方法 A：網頁介面（最簡單）**

1. 到 https://github.com/new 建立 repo（建議命名 `family-trips`，設 **Public**）
2. 在 repo 頁面點 **Add file → Upload files**
3. 把整個資料夾的所有檔案拖進去：
   - `index.html`
   - `trip.html`
   - `db.js`
   - `config.js`（記得已經填好 Supabase 資訊）
   - `shared.css`
   - `supabase-schema.sql`
   - `seoul-trip.html`（舊版備份）
   - `README.md`
4. 點 **Commit changes**
5. 點 repo 上方的 **Settings → Pages**
6. Source 選 **Deploy from a branch**
7. Branch 選 **main → / (root)** → **Save**
8. 等 1–2 分鐘，回到 Pages 頁面就會看到網址：
   `https://你的帳號.github.io/family-trips/`

**方法 B：用 Git 命令列**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的帳號/family-trips.git
git push -u origin main
```

然後到 GitHub repo 開啟 Pages（Settings → Pages → main / root）。

## 使用方式

### 檢視模式（給家人看）

直接訪問網址：
```
https://你的帳號.github.io/family-trips/
```

家人看到的就是首頁卡片牆，點卡片進去看每趟旅行。

### 編輯模式（自己用）

網址後加 `?edit`：
```
https://你的帳號.github.io/family-trips/?edit
https://你的帳號.github.io/family-trips/trip.html?id=xxx&edit
```

進入後右下會顯示「編輯模式」徽章，可以：
- 新增／編輯／刪除旅行
- 編輯每趟旅行的段落（Day 1、Day 2、附錄等）
- 編輯每個時間軸項目（時間、地點、描述、Tip）
- 上傳照片、設為封面、刪除照片

### 把現有的首爾行程匯入

舊版的首爾行程網頁保留為 `seoul-trip.html`（純靜態），可以直接訪問：
```
https://你的帳號.github.io/family-trips/seoul-trip.html
```

如果要把它變成新系統下可編輯的版本，最快的方法：
1. 進入編輯模式
2. 新增旅行：「首爾家族旅行」、5/15–5/18、首爾
3. 新增段落 Day 1、Day 2、Day 3、Day 4
4. 每個段落新增時間軸項目（從 `seoul-trip.html` 複製貼上）

或者如果想要我寫一個一鍵匯入的腳本，告訴我！

## 安全提醒

- ⚠️ **這個系統沒有真正的登入機制**。任何人知道網址 + `?edit` 都能編輯。
- ✅ 安全保護來自：**不要公開分享網址**。家人通訊軟體傳就好。
- ✅ Supabase 的 anon key 放前端是設計如此，但真的有惡意攻擊者拿到網址，他們可以塞垃圾資料／刪掉資料。
- 💡 **想要更安全？**
  - 把 GitHub repo 設為 Private（GitHub Pages 在 Pro 方案才能 Private 部署）
  - 或加上 Supabase Auth 登入（之後可以再升級）
  - 或部署到 Cloudflare Pages 並加上 Cloudflare Access

## 檔案結構

```
family-trips/
├── index.html              # 首頁（旅行卡片牆）
├── trip.html               # 旅行詳情頁（動態載入）
├── db.js                   # Supabase 操作 helpers
├── config.js               # Supabase 連線設定（要填）
├── shared.css              # 共用樣式
├── supabase-schema.sql     # 資料庫 schema
├── seoul-trip.html         # 首爾行程（舊版靜態備份）
└── README.md               # 這份文件
```

## 技術棧

- **前端**：原生 HTML / CSS / JavaScript（沒有 build process，直接編輯就好）
- **後端**：Supabase（PostgreSQL + Storage）
- **部署**：GitHub Pages（免費）

## 常見問題

**Q：Supabase 免費額度夠用嗎？**
A：免費方案有 500 MB 資料庫 + 1 GB 儲存空間 + 5 GB 每月頻寬。一般家庭用足夠，照片放上千張沒問題。

**Q：為什麼照片載入慢？**
A：可以在 Supabase 上傳前先壓縮（手機拍的照片動輒 5MB+）。未來可以加自動壓縮功能。

**Q：怎麼備份資料？**
A：Supabase 有自動備份。也可以在 SQL Editor 執行 `select * from trips;` 等查詢匯出 CSV。

**Q：電腦上能編輯嗎？**
A：當然，網址加 `?edit` 在電腦上一樣可以編輯，介面也是響應式的。
