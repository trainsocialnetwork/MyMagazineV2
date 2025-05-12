/**
 * script.js
 * - magazine_data.json をfetch
 * - 1) スコア最大の画像を .v601_23 (表紙)に設定
 * - 2) 目次生成
 * - 3) テーマごとの画像を (大1枚+縦2枚) + (3カラム×2) で追加
 */

// テーマ導入文サンプル
const THEME_INTRO_TEXT = {
  "4月に初投稿したユーザーと投稿紹介": "4月に投稿デビューしたユーザーさんの初々しいアイデアをピックアップ。新鮮な視点を楽しもう！",
  "4月に連載で紹介したユーザーさん": "4月の特集企画で継続的に紹介されたユーザーさんをご覧ください。インテリアの奥深いこだわりに迫ります。",
  "シーズナル特集（イースター・新生活）": "春らしいイースターの装飾や、新生活を彩るインテリアアイデアを集めました。",
  "コンテンツ見応え系A（北欧インテリア）": "シンプルで温かみのある北欧テイスト。北欧インテリアの魅力を堪能しましょう。",
  "コンテンツ見応え系B（モダンインテリア）": "洗練されたデザインが目を引くモダンインテリア。スタイリッシュな空間づくりを楽しもう。",
  "4月に投稿イベントで受賞したユーザーと投稿紹介": "4月の投稿イベントで見事受賞した作品を紹介。センスとアイデアが光るお部屋をチェック！",
  "コンテンツ見応え系C（レトロ・昭和なインテリア）": "懐かしさと温もりを感じるレトロ・昭和風インテリア特集。",
  "コンテンツ見応え系D（コーヒーのある暮らし）": "コーヒー好きにはたまらない！日常に癒しと香りをプラスするコーヒーのある暮らし。",
  "みんなの収納アイデア": "部屋をスッキリと片付けるテクニック満載。みんなの収納術を参考に！",
  "暮らしの色（ピンク）": "優しく華やかなピンクを取り入れて、毎日をちょっと明るくするインテリアを紹介。",
  "買ったもの": "RoomClipユーザーが買って良かったアイテムを厳選。暮らしを充実させるヒントが盛りだくさん！",
  "暮らしのひとコマ": "何気ない日常のワンシーンを切り取った写真たち。みんなの暮らしぶりをのぞいてみよう。",
  "n月に久しぶりに投稿したユーザーと投稿紹介": "n月に久々の投稿で戻ってきたユーザーさんをフィーチャー。再開したインテリアの進化に注目です。"
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
