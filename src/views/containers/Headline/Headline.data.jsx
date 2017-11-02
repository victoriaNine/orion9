import { h } from 'preact';

const data = {
  baseline1: {
    fr: "Bonjour — Je suis Victoria Nine, creative front-end developer et musicienne${note}",
    en: "Hi — I'm Victoria Nine, a French creative front-end developer and musician${note}",
    jp: "こんにちは — Victoria Nineと言います。フランスのクリエーティブ・フロントエンド・デベロッパーと音楽家${note}です。",
  },
  baseline2: {
    fr: <span>contente que vous soyez là !<br />une idée à partager ? contactez-moi</span>,
    en: <span>i’m glad you’re stopping by!<br />have an idea to share? get in touch</span>,
    jp: <span>ここまで来てくれたよかった！<br />アイデアを共有したい場合は是非連絡してください。</span>,
  },
  translations: {
    dev: { fr: "Développement", en: "Development", jp: "開発" },
    audio: { fr: "Édition audio", en: "Audio editing", jp: "オーディオ編集" },
    design: { fr: "Design", en: "Design", jp: "デザイン" },
    sd: { fr: "Sound design", en: "Sound design", jp: "サウンド・デザイン" },
    music: { fr: "Musique", en: "Music", jp: "音楽" },
    separator: { fr: ", ", en: ", ", jp: "、" }
  }
};

export default data;
