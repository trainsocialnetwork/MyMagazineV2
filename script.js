/**
 * script.js
 * - magazine_data.json をfetchし、
 *   1) スコア最大画像を .v601_23 の background-image に差し替え
 *   2) 目次を横並びで生成 (#toc-list)
 *   3) テーマ別に画像レイアウトを #themes-container に生成 (例: 9枚= 大1枚+縦2枚 + 3カラムx2)
 */

// テーマ導入文サンプル
const THEME_INTRO_TEXT = {
  "季節": "季節感あふれるインテリアで暮らしを楽しむ。",
   "ヴィンテージスタイル": "古き良きデザインの味わいを生かす、ヴィンテージスタイル特集。",
  "北欧スタイル": "シンプルで温かみのある北欧テイストのお部屋づくり。",
  "ナチュラルスタイル": "自然素材をたっぷりと取り入れた、優しい雰囲気のナチュラルスタイル。",
  "インダストリアルスタイル": "無骨でクールな空間。人気再燃のインダストリアルスタイルを楽しむ。",
  "キッチン": "毎日の料理が楽しくなる、機能性とデザインを両立したキッチン。",
  "リビング": "家族や友人と集まる憩いの場所。寛ぎのリビングアイデア集。",
  "玄関": "お客様を迎えるお家の顔。個性が光る玄関を演出しよう。",
  "トイレ": "狭い空間でもこだわりを。清潔感とセンスが光るトイレアイデア。",
  "植物のある暮らし": "グリーンを取り入れて、お部屋に癒やしと彩りを。",
  "アートのある暮らし": "お気に入りのアートを飾って、毎日をもっと楽しく。",
  "こどものいる暮らし": "子どもと一緒に作る、楽しく心地よい住空間。",
  "ペットと暮らす": "大切な家族と快適に。ペットも人も心地よい住まいづくり。",
  "二人暮らし": "ふたりのこだわりを詰め込んだ、心地よい二人暮らし空間。",
  "一人暮らし": "自分らしさを自由に表現。こだわりが光る一人暮らしの部屋。",
  "みんなの収納ノウハウ": "スッキリ片付く収納アイデア。暮らしを豊かにするテクニック集。",
  "買ってよかったもの": "RoomClipユーザーが本気でおすすめする、買って良かったアイテム。",
  "暮らしの一コマ": "何気ない日常のワンシーン。みんなの暮らしのひとコマをお届け。"
};

fetch('./magazine_data.json')
  .then(response => response.json())
  .then(data => {
    // dataは { "季節": [ {photo_id, filenamelink, score, ...}, ... ], ... }
    const themes = Object.keys(data);

    // (1) スコア最大投稿を検索して .v601_23 の background-image 差し替え
    let maxScore = -1;
    let topLink = '';
    for (const theme of themes) {
      data[theme].forEach(item => {
        if (item.score > maxScore) {
          maxScore = item.score;
          topLink = item.filenamelink;
        }
      });
    }
    if (topLink) {
      const coverDiv = document.querySelector('.v601_23');
      coverDiv.style.backgroundImage = `url(${topLink})`;
    }

    // (2) 目次を横並びで生成
    const tocList = document.getElementById('toc-list');
    themes.forEach(themeName => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#theme-${themeName}`; // ページ内リンク用id
      a.textContent = themeName;
      li.appendChild(a);
      tocList.appendChild(li);
    });

    // (3) テーマ別コンテンツを生成
    const container = document.getElementById('themes-container');
    themes.forEach(themeName => {
      const items = data[themeName];

      // セクションタイトル
      const titleEl = document.createElement('div');
      titleEl.className = 'theme-section-title';
      titleEl.id = `theme-${themeName}`; // アンカー用
      titleEl.textContent = themeName;
      container.appendChild(titleEl);

      // 導入文
      const introEl = document.createElement('div');
      introEl.className = 'theme-section-intro';
      introEl.textContent =
        THEME_INTRO_TEXT[themeName] || `${themeName}の投稿を紹介します。`;
      container.appendChild(introEl);

      // 画像を9枚単位で (大1枚+縦2枚) + (3カラム) + (3カラム)
      // SP想定で縦並びだが、要件に合わせここでは簡易実装
      let idx = 0;
      while (idx < items.length) {
        // 1) 大1枚 + 縦2枚
        const set1 = document.createElement('div');
        set1.className = 'photoset-large-and-vertical2';
        // 大画像
        const largeDiv = document.createElement('div');
        largeDiv.className = 'large-img';
        if (items[idx]) {
          const img = document.createElement('img');
          img.className = 'theme-section-img';
          img.src = items[idx].filenamelink;
          largeDiv.appendChild(img);
          idx++;
        }
        set1.appendChild(largeDiv);

        // 縦2枚
        const vertDiv = document.createElement('div');
        vertDiv.className = 'vertical-2';
        for (let i=0; i<2; i++) {
          if (items[idx]) {
            const img = document.createElement('img');
            img.className = 'theme-section-img';
            img.src = items[idx].filenamelink;
            vertDiv.appendChild(img);
            idx++;
          }
        }
        set1.appendChild(vertDiv);

        container.appendChild(set1);

        // 2) 3カラム (SPでは縦3枚)
        const set2 = document.createElement('div');
        set2.className = 'photoset-3columns';
        for (let i=0; i<3; i++) {
          if (items[idx]) {
            const img = document.createElement('img');
            img.className = 'theme-section-img';
            img.src = items[idx].filenamelink;
            set2.appendChild(img);
            idx++;
          }
        }
        container.appendChild(set2);

        // 3) 3カラム
        const set3 = document.createElement('div');
        set3.className = 'photoset-3columns';
        for (let i=0; i<3; i++) {
          if (items[idx]) {
            const img = document.createElement('img');
            img.className = 'theme-section-img';
            img.src = items[idx].filenamelink;
            set3.appendChild(img);
            idx++;
          }
        }
        container.appendChild(set3);
      }
    });
  })
  .catch(err => {
    console.error("Error loading magazine_data.json:", err);
  });
