import { h } from 'preact';

const data = {
  home: {
    baseline1: {
      fr: "Bonjour — Je suis Victoria Nine, creative front-end developer et musicienne${note}",
      en: "Hi — I'm Victoria Nine, a French creative front-end developer and musician${note}",
      jp: "こんにちは — Victoria Nineと言います。フランスのクリエーティブ・フロントエンド・デベロッパーと音楽家${note}です。",
    },
    baseline2: {
      fr: <span>contente que vous soyez là !<br />une idée à partager ? contactez-moi</span>,
      en: <span>i'm glad you're stopping by!<br />have an idea to share? get in touch</span>,
      jp: <span>ここまで来てくれたよかった！<br />アイデアを共有したい場合は是非連絡してください。</span>,
    }
  },
  about: {
    baseline1: {
      fr: "Je suis une creative front-end developer et artiste freelance originaire de Paris vivant à Brighton, en Angleterre.",
      en: "I'm a freelance creative front-end developer and artist from Paris, France, living in beautiful Brighton, UK.",
      jp: "英国の美しいブライトンに住んでいて、フランスのパリのフリーランス・クリエーティブ・フロントエンド・デベロッパーとアーティストです。",
    },
    baseline2: {
      fr: <span>J'aime les sites interactifs, expérimentaux et musicaux.<br />Je suis ouverte aux collaborations, venez dire bonjour :)</span>,
      en: <span>I love interactive, experimental and musical websites.<br />I'm open to collabs, come say hi :)</span>,
      jp: <span>インタラクティブ、実験的で音楽的なウェブサイトが好きです。<br />コラボは喜んで受けます。どぞよろしく:)</span>,
    }
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
