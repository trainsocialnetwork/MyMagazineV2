/**
 * script.js
 * - magazine_data.json をfetchして取得
 * - JSONに含まれる各テーマの投稿リストをループし、
 *   HTML要素を生成して #themes-container に追加
 * - 目次(#toc-list)にテーマリストを生成
 * - 表紙画像(cover-image)を最もスコアの高い投稿に差し替え など
 */

// 一例として、一番スコアが高い投稿を表紙画像に使う:
//   JSON読み込み後に全データをスキャンして maxスコア を見つける

fetch('magazine_data.json')
  .then(response => response.json())
  .then(data => {
    // data は {"季節":[...], "ヴィンテージスタイル":[...], ...} の形
    const tocList = document.getElementById('toc-list');
    const themesContainer = document.getElementById('themes-container');

    // -------------------------
    // 1) 表紙画像に使う投稿を決める
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
    // cover-image のsrcに設定
    const coverImageElem = document.getElementById('cover-image');
    if (topPhotoLink) {
      coverImageElem.src = topPhotoLink;
    } else {
      // データがない場合はデフォルト画像を設定
      coverImageElem.src = "https://via.placeholder.com/1000x600?text=Cover+Image";
    }

    // -------------------------
    // 2) 目次リスト生成
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
    // 3) テーマごとのセクション生成
    // -------------------------
    for (let themeName in data) {
      if(!data.hasOwnProperty(themeName)) continue;

      const section = document.createElement('section');
      section.id = `theme-${themeName}`;
      section.className = 'theme-section';

      // 見出し(テーマ名)
      const h2 = document.createElement('h2');
      h2.textContent = themeName;
      section.appendChild(h2);

      // 導入文(仮)
      const intro = document.createElement('p');
      intro.className = 'theme-intro';
      intro.textContent = `${themeName}に関連する投稿をご紹介します...`;
      section.appendChild(intro);

      // 画像リストを取得 (すでに要件の投稿数だけに絞られている想定)
      const items = data[themeName];

      // ここでは1テーマにつき投稿数が多くても、とりあえず全部並べてみる例。
      // 指示通りに "大きい1枚+縦2枚" + "3カラム" + "3カラム" を繰り返すなど、
      // 実際の仕様に応じてレイアウト。
      // 以下の例では 9枚単位で1セット、とし、複数セットがある場合は繰り返す。

      let index = 0;
      while (index < items.length) {
        // (1) 大1枚 + 縦2枚
        const photoSet1 = document.createElement('div');
        photoSet1.className = "photoset photoset-large-and-vertical2";
        const leftDiv = document.createElement('div');
        leftDiv.className = "left-large-img";
        const rightDiv = document.createElement('div');
        rightDiv.className = "right-vertical-2";

        // 左に1枚
        if (items[index]) {
          const img = document.createElement('img');
          img.src = items[index].filenamelink;
          leftDiv.appendChild(img);
          index++;
        }
        // 右上
        if (items[index]) {
          const img = document.createElement('img');
          img.src = items[index].filenamelink;
          rightDiv.appendChild(img);
          index++;
        }
        // 右下
        if (items[index]) {
          const img = document.createElement('img');
          img.src = items[index].filenamelink;
          rightDiv.appendChild(img);
          index++;
        }
        photoSet1.appendChild(leftDiv);
        photoSet1.appendChild(rightDiv);
        section.appendChild(photoSet1);

        // (2) 3カラム
        const photoSet2 = document.createElement('div');
        photoSet2.className = "photoset photoset-3columns";
        for (let c=0; c<3; c++) {
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
        photoSet3.className = "photoset photoset-3columns";
        for (let c=0; c<3; c++) {
          if (items[index]) {
            const img = document.createElement('img');
            img.src = items[index].filenamelink;
            photoSet3.appendChild(img);
            index++;
          }
        }
        section.appendChild(photoSet3);
      }

      // セクションをDOMに追加
      themesContainer.appendChild(section);
    }
  })
  .catch(err => {
    console.error("Error loading JSON:", err);
  });
