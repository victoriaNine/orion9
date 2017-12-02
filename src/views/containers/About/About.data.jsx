import { h } from 'preact';

import visuals_guitar from './assets/guitar.mp4';
import visuals_finalFantasy from './assets/finalFantasy.mp4';
import visuals_soundtrack from './assets/soundtrack.mp4';
import visuals_ravenclaw from './assets/ravenclaw.mp4';
import visuals_wikipedia from './assets/wikipedia.mp4';

const data = {
  sections: [
    {
      title: { fr: "Compétences & Outils", en: "Skills & Tools", jp: "スキルとツール" },
      text: "HTML5, CSS3, ES2017+, PostCSS, SASS, Greensock, mo.js, Canvas, PixiJS, SeriouslyJS, WebAudio API, Tone.js, Gamepad API, jQuery, React, Preact, Backbone, Webpack, RequireJS, Grunt, lodash, Jest, Enzyme, Socket.io, CouchDB, Node.js, Git, Homemade framework development, Photoshop, Illustrator, Premiere Pro, Design, Audio"
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
          visuals: { type: "video", url: visuals_guitar }
        },
        {
          title: {
            fr: "Je joue à Final Fantasy depuis mes 5 ans",
            en: "I've been playing Final Fantasy since I was 5y/o",
            jp: "5歳の頃からファイナルファンタジーをやっています。"
          },
          visuals: { type: "video", url: visuals_finalFantasy }
        },
        {
          title: {
            fr: "J'écris parfois de la musique de bande originale",
            en: "I occasionally write soundtrack music",
            jp: "サウンドトラック音楽を時々作曲します。"
          },
          visuals: { type: "video", url: visuals_soundtrack }
        },
        {
          title: {
            fr: "Fière d'être Serdaigle",
            en: "I'm a proud Ravenclaw",
            jp: "レイブンクロー万歳！"
          },
          visuals: { type: "video", url: visuals_ravenclaw }
        },
        {
          title: {
            fr: <span>Je passe trop de temps sur <strike>Vikipedia</strike> Wikipedia</span>,
            en: <span>I spend too much time on <strike>Vikipedia</strike> Wikipedia</span>,
            jp: <span><strike>Vikipedia</strike> Wikipediaで読書をしている時間が長すぎる。</span>
          },
          visuals: { type: "video", url: visuals_wikipedia, options: { subtitle: "Wikipedia is quite useful" } }
        }
      ]
    }
  ]
};

export default data;
