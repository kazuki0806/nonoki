/* AI chat window, shape only.
   Nothing is sent anywhere and no AI is called: questions are matched to fixed answers taken from
   ののき工務店.md. The panel says so up front, so no visitor mistakes it for a live assistant. */
(function () {
  var site = document.querySelector('[data-site]');
  if (!site) { return; }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Checked in order: more specific words first (「木」 alone would swallow 「木質化」, so it comes late).
  var FAQ = [
    { chip: '見学会の日程', q: '次の見学会はいつですか？', keys: ['見学', 'イベント', '予約', '申し込', '申込'],
      a: '次回の完成見学会は、2026年10月17日（土）・18日（日）です。築38年の二階建てのリノベーションで、場所は埼玉県〇〇市。1組ずつの予約制で、1回90分。建てた大工に直接ご質問いただけます。',
      link: ['#event', '見学会の案内を見る'] },
    { chip: '新築の費用', q: '新築の費用の目安を教えてください', keys: ['費用', '価格', 'いくら', '値段', '予算', '金額', '見積'],
      a: '木の家の新築は、建物本体で2,800万〜3,800万円（税込）が目安です。事例では、築42年の平屋のリノベーションが1,850万円（税込）、延床面積102㎡の新築が3,200万円（建物本体・税込）でした。現地を見ないまま金額を決めることはしません。',
      link: ['#works', '施工事例を見る'] },
    { chip: '工事できる範囲', q: 'どの地域まで工事に来てもらえますか？', keys: ['エリア', '範囲', '地域', 'どこまで', '埼玉', '遠い', '来てもらえ'],
      a: '工事にうかがえるのは、事務所から車で40分以内です。埼玉県の西部が中心です。' },
    { chip: '30年の点検', q: '建てたあとの点検について教えてください', keys: ['点検', 'アフター', 'メンテナンス', '建てたあと', '建てた後'],
      a: 'お引き渡しのあと、1年目・2年目・5年目・10年目、その先は5年ごとに30年目まで点検に伺います。伺うのは、その家を建てた大工です。' },
    { chip: '小さな修繕', q: '小さな修理だけでも頼めますか？', keys: ['修繕', '修理', '網戸', 'きしむ', '小さな', '直して', '直し'],
      a: '網戸1枚の張り替え、きしむ床1か所からお受けします。お電話をいただければ、最短で翌日に大工が伺います。' },
    { chip: '工期の目安', q: '家が建つまで、どのくらいかかりますか？', keys: ['工期', '期間', 'どのくらい', 'どれくらい', '何か月', '何ヶ月', '流れ', 'スケジュール'],
      a: 'プランと概算のご提案に約1か月、詳しい設計に約2か月、着工から完成までは新築で約5か月です。打ち合わせには、実際に建てる大工も同席します。',
      link: ['#flow', '家づくりの流れを見る'] },
    { chip: null, q: '', keys: ['新築', '建てたい', '注文住宅', '間取り'],
      a: '木の家の新築は、間取りを一から自由に決められます。杉の床、ひのきの柱、しっくいの壁が標準です。価格の目安は、建物本体で2,800万〜3,800万円（税込）です。' },
    { chip: null, q: '', keys: ['リノベ', 'リフォーム', '改修', '耐震', '断熱', '古い家', '築30', '築年'],
      a: '築30年以上の家を、耐震と断熱から見直します。残せる柱や梁は残し、いまの暮らしに合わせて間取りを変えます。' },
    { chip: null, q: '', keys: ['店舗', 'お店', 'カフェ', 'オフィス', '木質化', '空き家', '会社の工事'],
      a: '店舗・カフェの内装、オフィスの木質化、空き家の再生をお受けしています。営業を続けながらの改装も、定休日に工事をまとめる進め方でお受けします。' },
    { chip: null, q: '', keys: ['冊子', '資料', 'パンフ', '手帖', 'カタログ'],
      a: '家づくりの費用と流れを40ページにまとめた冊子「木の家の手帖」を、無料でお送りしています。' },
    { chip: null, q: '', keys: ['相談', '問い合わせ', '問合せ', '電話', '連絡', '営業時間', '定休', '休み'],
      a: '新築・リノベーション・修繕、どのご相談も無料です。お電話は 000-000-0000（9:00〜18:00、水曜定休）です。',
      link: ['#contact', 'お問い合わせを見る'] },
    { chip: null, q: '', keys: ['大工', '職人', '社員', '誰が'],
      a: '家を建てるのは、社員として働く6人の大工です。設計の打ち合わせにも大工が同席するので、「この棚はあと5cm低く」といった話が、そのまま現場に届きます。' },
    { chip: null, q: '', keys: ['杉', 'ひのき', 'ヒノキ', '檜', '素材', '無垢', 'しっくい', '漆喰', '木'],
      a: '使う木は、地元の山で育った杉とひのきです。新築は、杉の床、ひのきの柱、しっくいの壁が標準です。製材所は事務所から車で30分のところにあり、柱1本ずつ、どの山の木かをご説明できます。' }
  ];
  var GREETING = 'こんにちは、ののき工務店です。見学会の日程や費用の目安、工事できる範囲など、よくあるご質問にお答えします。下から選ぶか、入力してください。';
  var FALLBACK = '申し訳ありません。このデモでは、決まったご質問にだけお答えしています。下の質問から選んでください。実際のサイトでは、会社の資料をもとにAIがお答えします。';

  var wrap = document.createElement('div');
  wrap.className = 'chat';
  wrap.innerHTML =
    '<button class="chat__launch" type="button" aria-expanded="false" aria-controls="chat-panel">' +
      '<svg class="chat__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"></path></svg>' +
      '<span>ご質問はこちら</span>' +
    '</button>' +
    '<div class="chat__panel" id="chat-panel" role="dialog" aria-labelledby="chat-title" hidden>' +
      '<div class="chat__head">' +
        '<div><p class="chat__en">Chat / Demo</p><p class="chat__title" id="chat-title">ご質問にお答えします</p></div>' +
        '<button class="chat__close" type="button" aria-label="閉じる"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"></path></svg></button>' +
      '</div>' +
      '<p class="chat__notice">AIチャット窓口の作例です。AIにはつながっておらず、決まった答えを返します。入力した内容は送信も保存もされません。</p>' +
      '<ol class="chat__log" aria-live="polite"></ol>' +
      '<div class="chat__chips" role="group" aria-label="よくあるご質問"></div>' +
      '<form class="chat__form" novalidate>' +
        '<label class="vh" for="chat-input">ご質問を入力</label>' +
        '<input class="chat__input" id="chat-input" type="text" autocomplete="off" enterkeyhint="send" placeholder="例：次の見学会はいつですか">' +
        '<button class="chat__send" type="submit">送信</button>' +
      '</form>' +
    '</div>';
  site.appendChild(wrap);

  var launch = wrap.querySelector('.chat__launch');
  var panel = wrap.querySelector('.chat__panel');
  var closeBtn = wrap.querySelector('.chat__close');
  var log = wrap.querySelector('.chat__log');
  var chips = wrap.querySelector('.chat__chips');
  var form = wrap.querySelector('.chat__form');
  var input = wrap.querySelector('.chat__input');
  var busy = false;
  var greeted = false;

  FAQ.forEach(function (item) {
    if (!item.chip) { return; }
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chat__chip';
    b.textContent = item.chip;
    b.addEventListener('click', function () { ask(item.q, item); });
    chips.appendChild(b);
  });

  function scrollLog() { log.scrollTop = log.scrollHeight; }

  function addMessage(role, text, link) {
    var li = document.createElement('li');
    li.className = 'chat__msg chat__msg--' + role;
    var p = document.createElement('p');
    p.textContent = text;
    li.appendChild(p);
    if (link) {
      var a = document.createElement('a');
      a.href = link[0];
      a.textContent = link[1];
      a.addEventListener('click', function () { setOpen(false, true); });
      li.appendChild(a);
    }
    if (role === 'user') { li.setAttribute('aria-label', 'あなた：' + text); }
    log.appendChild(li);
    scrollLog();
  }

  function normalize(s) { return String(s).toLowerCase().replace(/[\s　？?。、！!]/g, ''); }

  function findAnswer(text) {
    var t = normalize(text);
    for (var i = 0; i < FAQ.length; i++) {
      for (var k = 0; k < FAQ[i].keys.length; k++) {
        if (t.indexOf(FAQ[i].keys[k].toLowerCase()) !== -1) { return FAQ[i]; }
      }
    }
    return null;
  }

  function ask(question, item) {
    if (busy || !question) { return; }
    busy = true;
    addMessage('user', question);
    var answer = item || findAnswer(question);
    var typing = document.createElement('li');
    typing.className = 'chat__msg chat__msg--bot chat__typing';
    typing.setAttribute('aria-hidden', 'true');
    typing.innerHTML = '<span></span><span></span><span></span>';
    log.appendChild(typing);
    scrollLog();
    window.setTimeout(function () {
      typing.remove();
      if (answer) { addMessage('bot', answer.a, answer.link); }
      else { addMessage('bot', FALLBACK, null); }
      busy = false;
    }, reduce ? 0 : 700);
  }

  function setOpen(open, keepFocus) {
    wrap.setAttribute('data-open', String(open));
    launch.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (open) {
      if (!greeted) { addMessage('bot', GREETING, null); greeted = true; }
      window.setTimeout(function () { input.focus(); }, 30);
    } else if (!keepFocus) {
      window.setTimeout(function () { launch.focus(); }, 30);
    }
  }

  launch.addEventListener('click', function () { setOpen(true); });
  closeBtn.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) { e.preventDefault(); setOpen(false); }
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) { input.focus(); return; }
    input.value = '';
    ask(text, null);
  });
})();
