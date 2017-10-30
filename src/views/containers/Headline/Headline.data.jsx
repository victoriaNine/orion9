import { h } from 'preact';

const data = [
  {
    text: {
      fr: "bonjour — je suis victoria nine, creative front-end developer et musicienne${note} de ${age} ans",
      en: "hi — i'm victoria nine, a ${age}y/o french creative front-end developer and musician${note}",
      jp: "こんにちは — victoria nineと言います。${age}歳のフランスのクリエーティブ・フロントエンド・デベロッパーと音楽家${note}です。",
    },
  },
  {
    text: {
      fr: <span>contente que vous soyez là !<br />une idée à partager ? contactez-moi</span>,
      en: <span>i’m glad you’re stopping by!<br />have an idea to share? please get in touch</span>,
      jp: <span>ここまで来てくれたよかった！<br />アイデアを共有したい場合は是非連絡してください。</span>,
    },
  }
];

export default data;
