/**
 * script.js
 * - magazine_data.json をfetch
 * - 1) スコア最大の画像を .v601_23 (表紙)に設定
 * - 2) 目次生成
 * - 3) テーマごとの画像を (大1枚+縦2枚) + (3カラム×2) で追加
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
  .then(res => res.json())
  .then(data => {
    const themes = Object.keys(data);

    // (1) スコア最大画像で表紙を飾る
    let maxScore = -1;
    let topImage = '';
    themes.forEach(t => {
      data[t].forEach(post => {
        if (post.score > maxScore) {
          maxScore = post.score;
          topImage = post.filenamelink;
        }
      });
    });
    if (topImage) {
      const cover = document.querySelector('.v601_23');
      cover.style.backgroundImage = `url(${topImage})`;
    }

    // (2) 目次 (#toc-list)
    const tocList = document.getElementById('toc-list');
    themes.forEach(t => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#theme-${t}`;
      a.textContent = t;
      li.appendChild(a);
      tocList.appendChild(li);
    });

    // (3) テーマごとの画像レイアウト (#themes-container)
    const container = document.getElementById('themes-container');

    themes.forEach(theme => {
      const items = data[theme];

      // 見出し
      const titleEl = document.createElement('div');
      titleEl.className = 'theme-section-title';
      titleEl.id = `theme-${theme}`; // アンカーリンク用
      titleEl.textContent = theme;
      container.appendChild(titleEl);

      // 導入文
      const introEl = document.createElement('div');
      introEl.className = 'theme-section-intro';
      introEl.textContent =
        THEME_INTRO_TEXT[theme] || `${theme}の素敵な投稿です。`;
      container.appendChild(introEl);

      let i = 0;
      while (i < items.length) {
        // 1) (大1枚 + 縦2枚)
        const photoset1 = document.createElement('div');
        photoset1.className = 'photoset-large-and-vertical2';

        const leftDiv = document.createElement('div');
        leftDiv.className = 'left-large-img';
        if (items[i]) {
          const img = document.createElement('img');
          img.className = 'theme-section-img';
          img.src = items[i].filenamelink;
          leftDiv.appendChild(img);
          i++;
        }
        photoset1.appendChild(leftDiv);

        const rightDiv = document.createElement('div');
        rightDiv.className = 'right-vertical-2';
        for (let j = 0; j < 2; j++) {
          if (items[i]) {
            const img = document.createElement('img');
            img.className = 'theme-section-img';
            img.src = items[i].filenamelink;
            rightDiv.appendChild(img);
            i++;
          }
        }
        photoset1.appendChild(rightDiv);

        container.appendChild(photoset1);

        // 2) 3カラム
        const photoset2 = document.createElement('div');
        photoset2.className = 'photoset-3columns';
        for (let j = 0; j < 3; j++) {
          if (items[i]) {
            const img = document.createElement('img');
            img.className = 'theme-section-img';
            img.src = items[i].filenamelink;
            photoset2.appendChild(img);
            i++;
          }
        }
        container.appendChild(photoset2);

        // 3) 3カラム
        const photoset3 = document.createElement('div');
        photoset3.className = 'photoset-3columns';
        for (let j = 0; j < 3; j++) {
          if (items[i]) {
            const img = document.createElement('img');
            img.className = 'theme-section-img';
            img.src = items[i].filenamelink;
            photoset3.appendChild(img);
            i++;
          }
        }
        container.appendChild(photoset3);
      }
    });
  })
  .catch(err => {
    console.error("Error loading JSON:", err);
  });
