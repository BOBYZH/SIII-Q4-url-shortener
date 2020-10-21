# URL shortener v1.0 (短網址產生器，第一版)

## Alpha Camp 學期三(2019年版) Final Exam A29: 「專業知識與技術」題目
### Q4: 短網址產生器 - Mongoose
- 免安裝預覽連結(為便於示範，皆連到相同的[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)資料庫)：
  - Heroku版本[https://url-shortener-practice.herokuapp.com](https://url-shortener-practice.herokuapp.com/)(因免費版服務限制，開啟網站時需待主機從休眠狀態恢復，須稍待片刻)
  - GCP版本[https://url-shortener-293209.df.r.appspot.com](https://url-shortener-293209.df.r.appspot.com/)(因Google此服務有免費使用期限，未來視情況關閉，雖開啟速度較快)

## 開發者：
Bob Yu-Zhen Huang[(BOBYZH)](https://github.com/BOBYZH)

## 如何使用：
0. 至少先在電腦上裝好Node.js、MongoDB Community Edition([依作業系統版本對照說明操作](https://docs.mongodb.com/manual/administration/install-community/))
1. 從本專案頁面將檔案下載，或複製(clone)到要操作的電腦上:
```
git clone https://github.com/BOBYZH/SIII-Q4-url-shortener.git
```
2. 開啟終端機(terminal)，將目錄切換至專案資料夾(expense_tracker):
```
cd SIII-Q4-url-shortener
```
3. 確認是否有在全域(global)環境安裝nodemon，沒有的話，在終端機輸入：
```
npm i nodemon -g
```
4. 使用npm安裝需要的套件，套件列表與版本詳見於[package.json](https://github.com/BOBYZH/SIII-Q4-url-shortener/blob/master/package.json)的"dependencies"：
```
npm i 
```
5. 建立資料庫與範例資料，供快速檢視功能：
```
npm run seeder
```
以下為測試用的原始網址與短網址代碼(以Heroku為例)：

| originalUrl                      | shortPath |
| ---------------------------------| ----------|
| https://tw.yahoo.com/            | [KLAmb](https://url-shortener-practice.herokuapp.com/KLAmb)     |
| https://www.google.com/          | [gTCJc](https://url-shortener-practice.herokuapp.com/gTCJc)     |
| https://www.msn.com/zh-tw/       | [c1LMV](https://url-shortener-practice.herokuapp.com/c1LMV)     |
6. 在本專案根目錄依據".envTemplate"內容格式，新增".env"檔案(可使用終端機指令)，
```
cp .envTemplate .env
```
並在.env填入網址(如在本機：http://localhost:3000)

7. 執行本專案：
```
npm run dev
```
8. 開啟預覽連結
- 若是在本機操作，於瀏覽器網址列輸入[http://localhost:3000](http://localhost:3000)；
- 若使用虛擬主機，則須配合主機服務設定另用網址

## 主要功能：
- 首頁畫面上有一個表單，使用者可以在表單輸入原始網址，如 https://www.google.com/；
送出表單之後，畫面會回傳格式化後的短網址，如 http://localhost:3000/41B1T
  - 短網址的獨特性
    - 如果輸入的原始網址已經建立過短網址，短網址生成的結果會沿用上次代碼，而不重複建立
    - 建立短網址時，會檢查是否生成過同樣的代碼，以免代碼重複時導向出現錯誤
- 在伺服器啟動期間，使用者可以在瀏覽器的網址列，輸入你提供的短網址，瀏覽器就會導向原本的網站
- 使用者可以按 Copy 來複製縮短後的網址

## 更新歷程：
- 2020.10.21：配合練習[Google雲端平台(GCP)](https://cloud.google.com/)佈署，以及原先[Heroku搭配的mLab即將停止服務](https://docs.mlab.com/shutdown-of-heroku-add-on/)，改直接使用MongoDB Atlas雲端資料庫服務