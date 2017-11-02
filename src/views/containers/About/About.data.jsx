import { h } from 'preact';

const data = {
  sections: [
    {
      title: { fr: "Compétences & Outils", en: "Skills & Tools", jp: "スキルとツール" },
      text: "HTML5, CSS3, ES2017+, PostCSS, SASS, Greensock, Canvas, WebAudio API, Gamepad API, jQuery, React, Preact, Backbone, Webpack, RequireJS, Grunt, lodash, Socket.io, CouchDB, Node.js, Git, Homemade framework development, Photoshop, Illustrator, Premiere Pro, Webdesign, Audio"
    },
    {
      title: { fr: "Divers", en: "Trivia", jp: "豆知識" },
      items: [
        {
          title: {
            fr: "Je joue de la guitare depuis mes 9 ans",
            en: "I've been playing the guitar since I was 9y/o",
            jp: "9歳の頃からギターを弾いています。"
          },
          gif: "https://media.giphy.com/media/3ov9k9lWAlJ01SdySc/giphy.gif"
        },
        {
          title: {
            fr: "Je joue à Final Fantasy depuis mes 5 ans",
            en: "I've been playing Final Fantasy since I was 5y/o",
            jp: "5歳の頃からファイナルファンタジーをやっています。"
          },
          gif: "https://media.giphy.com/media/3ohhwGqvtfynPcIDf2/giphy.gif",
        },
        {
          title: {
            fr: "J'écris parfois de la musique de bande originale",
            en: "I occasionally write soundtrack music",
            jp: "サウンドトラック音楽を時々作曲します。"
          },
          gif: "http://3.bp.blogspot.com/-8kTgUO2OJxU/VOoh0ON6F0I/AAAAAAAAFPs/QucxppiL-1o/s1600/whiplash_writing_128.gif",
        },
        {
          title: {
            fr: "Fière d'être Serdaigle",
            en: "I'm a proud Ravenclaw",
            jp: "レイブンクロー万歳！"
          },
          gif: "https://media.giphy.com/media/O2jbWYHzSOuT6/giphy.gif",
        },
        {
          title: {
            fr: <span>Je passe trop de temps sur <strike>Vikipedia</strike> Wikipedia</span>,
            en: <span>I spend too much time on <strike>Vikipedia</strike> Wikipedia</span>,
            jp: <span><strike>Vikipedia</strike> Wikipediaで読書をしている時間が長すぎる。</span>
          },
          gif: "https://media.giphy.com/media/xbL4LuxQAOFwI/giphy.gif"
        }
      ]
    }
  ]
};

export default data;
