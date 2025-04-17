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

fetch("./magazine_data.json")
  .then(res => res.json())
  .then(data => {
    const themeNames = Object.keys(data);

    // (1) スコア最大 => 表紙背景に
    let maxScore = -1;
    let topLink = "";
    themeNames.forEach(theme => {
      data[theme].forEach(item => {
        if (item.score > maxScore) {
          maxScore = item.score;
          topLink = item.filenamelink; // 最もスコアが高い画像
        }
      });
    });
    if (topLink) {
      document.querySelector(".v601_23").style.backgroundImage = `url(${topLink})`;
    }

    // (2) 目次生成
    const tocList = document.getElementById("toc-list");
    themeNames.forEach(theme => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#theme-${theme}`;
      a.textContent = theme;
      li.appendChild(a);
      tocList.appendChild(li);
    });

    // (3) テーマ別コンテンツ
    const container = document.getElementById("themes-container");
    themeNames.forEach(theme => {
      const items = data[theme];

      // 見出し
      const titleEl = document.createElement("div");
      titleEl.className = "theme-section-title";
      titleEl.id = `theme-${theme}`; // 目次リンク飛び先
      titleEl.textContent = theme;
      container.appendChild(titleEl);

      // 導入文
      const introEl = document.createElement("div");
      introEl.className = "theme-section-intro";
      introEl.textContent =
        THEME_INTRO_TEXT[theme] || `${theme}の投稿をご紹介します。`;
      container.appendChild(introEl);

      let i = 0;
      while (i < items.length) {
        // --- (大1+縦2) ---
        const set1 = document.createElement("div");
        set1.className = "photoset-large-and-vertical2";

        // 左(大1枚)
        const leftDiv = document.createElement("div");
        leftDiv.className = "left-large-img";
        if (items[i]) {
          // ▼ リンク要素を作成する
          const anchor = document.createElement("a");
          anchor.href = items[i].photo_url;
          anchor.target = "_blank"; // 新規タブで開く場合

          const img = document.createElement("img");
          img.src = items[i].filenamelink;

          anchor.appendChild(img);
          leftDiv.appendChild(anchor);
          i++;
        }
        set1.appendChild(leftDiv);

        // 右(縦2枚)
        const rightDiv = document.createElement("div");
        rightDiv.className = "right-vertical-2";
        for (let j = 0; j < 2; j++) {
          if (items[i]) {
            const anchor = document.createElement("a");
            anchor.href = items[i].photo_url;
            anchor.target = "_blank";

            const img = document.createElement("img");
            img.src = items[i].filenamelink;

            anchor.appendChild(img);
            rightDiv.appendChild(anchor);
            i++;
          }
        }
        set1.appendChild(rightDiv);
        container.appendChild(set1);

        // --- 3カラム (1回目) ---
        const set2 = document.createElement("div");
        set2.className = "photoset-3columns";
        for (let j = 0; j < 3; j++) {
          if (items[i]) {
            const anchor = document.createElement("a");
            anchor.href = items[i].photo_url;
            anchor.target = "_blank";

            const img = document.createElement("img");
            img.src = items[i].filenamelink;

            anchor.appendChild(img);
            set2.appendChild(anchor);
            i++;
          }
        }
        container.appendChild(set2);

        // --- 3カラム (2回目) ---
        const set3 = document.createElement("div");
        set3.className = "photoset-3columns";
        for (let j = 0; j < 3; j++) {
          if (items[i]) {
            const anchor = document.createElement("a");
            anchor.href = items[i].photo_url;
            anchor.target = "_blank";

            const img = document.createElement("img");
            img.src = items[i].filenamelink;

            anchor.appendChild(img);
            set3.appendChild(anchor);
            i++;
          }
        }
        container.appendChild(set3);
      }
    });
  })
  .catch(err => {
    console.error("Error loading magazine_data.json:", err);
  });
