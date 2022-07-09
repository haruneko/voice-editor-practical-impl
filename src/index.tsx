import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
    <div>
      <p>「ファイルを選択」から声を録音した wav ファイル（サンプリング周波数 44.1kHz, 16bit のもの）を選択してください。</p>
      <p>表示された波形をダブルクリックで波形を分割、分割された波形の右端をドラッグすることで分割された部分の再生速度を変更できます。</p>
      <p>処理は重めなので数秒くらいの音声ファイルでお試しください。</p>
      <p>「再生」ボタンで音声を再生、「保存」ボタンで output.wav として 16 bit の wav ファイルに保存できます。</p>
      <p>動作保証はしませんので壊れていたら直してください。</p>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
