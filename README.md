# 旅遊手帳 travel-app

一個以手機為優先設計的旅遊規劃 App（PWA），可以加到手機主畫面當作 App 使用，資料存在裝置本機，離線也能查看。

## 功能

- **旅程管理**：建立旅程（名稱、目的地、日期、預算、幣別），自動分成「即將出發」與「過去的旅程」，並顯示出發倒數。
- **每日行程**：依 Day 1、Day 2… 安排活動（時間、地點、備註），地點可一鍵開啟 Google 地圖。
- **旅費記帳**：依類別（交通／住宿／餐飲／門票／購物／其他）記帳，顯示預算使用進度與各類別小計。
- **行李清單**：內建常用物品清單，可勾選、新增、刪除，顯示打包進度。
- 支援深色模式。

## 技術

- React 19 + TypeScript + Vite
- 資料儲存：瀏覽器 `localStorage`（`src/useTrips.ts`）

## 開始開發

```bash
npm install
npm run dev      # 開發伺服器 http://localhost:5173
npm run build    # 產生正式版到 dist/
```

## 專案結構

```
src/
  types.ts              資料型別（Trip、Activity、Expense、PackingItem）
  utils.ts              日期、金額格式化等工具
  useTrips.ts           旅程資料的讀寫（localStorage）
  App.tsx               頁面切換
  components/
    TripList.tsx        旅程列表與新增表單
    TripDetail.tsx      旅程詳細頁與底部分頁
    Itinerary.tsx       每日行程
    Budget.tsx          記帳
    Packing.tsx         行李清單
```
