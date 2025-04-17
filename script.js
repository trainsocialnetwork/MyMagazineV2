/**
 * script.js
 * - magazine_data.json をfetchして取得
 * - テーマごとのセクション生成 (大1枚+縦2枚 → 3カラム(実際は3枚縦並び))
 * - 目次を横並びボタン風に生成
 * - 表紙画像にスコア最大投稿を使用
 */

// テーマに合わせた「おしゃれな見出し文・導入文」を定義
// ※例として任意の文言を入れています
const THEME_INTRO_TEXT = {
  "季節": "季節感を取り入れたインテリアで、春夏秋冬を楽しもう。",
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


fetch('magazine_data.json')
  .then(response => response.json())
  .then(data => {
    // data: { "季節": [ {...}, {...} ], "ヴィンテージスタイル": [...], ... }
    const tocList = document.getElementById('toc-list');
    const themesContainer = document.getElementById('themes-container');

    // -------------------------
    // 1) 表紙画像 (スコア最大)
    // -------------------------
    let maxScore = -1;
    let topPhotoLink = '';
    for (let themeName in data) {
      if (!data.hasOwnProperty(themeName)) continue;
      data[themeName].forEach(item => {
        if (item.score > maxScore) {
          maxScore = item.score;
          topPhotoLink = item.filenamelink;
        }
      });
    }
    const coverImageElem = document.getElementById('cover-image');
    if (topPhotoLink) {
      coverImageElem.src = topPhotoLink;
    }

    // -------------------------
    // 2) 目次リスト (横並び)
    // -------------------------
    for (let themeName in data) {
      if(!data.hasOwnProperty(themeName)) continue;

      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = `#theme-${themeName}`;
      anchor.textContent = themeName;
      li.appendChild(anchor);
      tocList.appendChild(li);
    }

    // -------------------------
    // 3) テーマごとセクション
    // -------------------------
    for (let themeName in data) {
      if(!data.hasOwnProperty(themeName)) continue;

      const section = document.createElement('section');
      section.id = `theme-${themeName}`;
      section.className = 'theme-section';

      // 見出し
      const h2 = document.createElement('h2');
      h2.textContent = themeName;
      section.appendChild(h2);

      // 導入文 (THEME_INTRO_TEXTから取得)
      const intro = document.createElement('p');
      intro.className = 'theme-intro';
      intro.textContent = THEME_INTRO_TEXT[themeName] || 
        `${themeName}に関する素敵な投稿をご紹介します。`;
      section.appendChild(intro);

      // 画像リスト
      const items = data[themeName];

      // 1テーマ内で「9枚1セット: (1) 大1枚+縦2枚 → (2) 3カラム → (3)3カラム」を繰り返す
      // SP版なので、それぞれ単一カラムで順番に並べるレイアウト
      let index = 0;
      while (index < items.length) {
        // (1) 大1枚+縦2枚
        const photoSet1 = document.createElement('div');
        photoSet1.className = "photoset-large-and-vertical2";

        // 大画像
        const leftDiv = document.createElement('div');
        leftDiv.className = "left-large-img";
        if (items[index]) {
          const img = document.createElement('img');
          img.src = items[index].filenamelink;
          leftDiv.appendChild(img);
          index++;
        }
        photoSet1.appendChild(leftDiv);

        // 縦2枚
        const rightDiv = document.createElement('div');
        rightDiv.className = "right-vertical-2";
        for (let i=0; i<2; i++) {
          if (items[index]) {
            const img = document.createElement('img');
            img.src = items[index].filenamelink;
            rightDiv.appendChild(img);
            index++;
          }
        }
        photoSet1.appendChild(rightDiv);

        section.appendChild(photoSet1);

        // (2) 3カラム → SP版では3枚を順番に縦
        const photoSet2 = document.createElement('div');
        photoSet2.className = "photoset-3columns";
        for (let i=0; i<3; i++) {
          if (items[index]) {
            const img = document.createElement('img');
            img.src = items[index].filenamelink;
            photoSet2.appendChild(img);
            index++;
          }
        }
        section.appendChild(photoSet2);

        // (3) 3カラム
        const photoSet3 = document.createElement('div');
        photoSet3.className = "photoset-3columns";
        for (let i=0; i<3; i++) {
          if (items[index]) {
            const img = document.createElement('img');
            img.src = items[index].filenamelink;
            photoSet3.appendChild(img);
            index++;
          }
        }
        section.appendChild(photoSet3);
      }

      themesContainer.appendChild(section);
    }

  })
  .catch(err => {
    console.error("Error loading JSON:", err);
  });
