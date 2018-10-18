import video_15thtriad from './assets/15thtriad.mp4';
import video_iwtwwy from './assets/iwtwwy.mp4';
import video_psychoCube from './assets/psychoCube.mp4';
import video_waltzRevolution from './assets/waltzRevolution.mp4';

const data = {
  sections: [
    {
      name: "projects",
      title: { fr: "Projets", en: "Projects", jp: "プロジェクト" },
      items: [
        {
          id: "15thtriad",
          title: "The Fifteenth Triad",
          type: "project",
          // url: "https://15thtriad.com",
          details: {
            role: ["dev", "design", "audio"],
            stack: ["backbone", "webpack", "webaudio", "canvas", "webgl", "node.js", "socket.io", "couchdb"],
            github: "http://github.com/victoriaNine/xvthTriad",
            about: {
              fr: "Mon projet bac-à-sable. The Fifteenth Triad est un jeu de cartes multijoueur basé sur l'univers de Final Fantasy. Situé dans l'univers du 15ème épisode de la série, il reprend le jeu de cartes apprécié des fans du 8ème épisode, le \"Triple Triad\". The Fifteenth Triad propose un mode solo contre une IA (trois niveaux de difficulté), un mode versus pour jouer contre un ami, un salon pour discuter et défier d'autre joueurs, des classements hebdomadaires automatisés, et un tas d'autres fonctionnalités personnalisables.",
              en: "My experiment sandbox project. The Fifteenth Triad is a multiplayer card game based on the Final Fantasy universe. Set in the series' 15th installment's universe, it takes up the beloved card game from the 8th installment, the \"Triple Triad\". The Fifteenth Triad features a solo mode against an AI (three difficulty levels), a versus mode to play against a friend, a lounge to chat and challenge other players, automated weekly rankings, and many other customizable features.",
              jp: "研究のサンドボックス・プロジェクトです。「The Fifteenth Triad」は、ファイナルファンタジーの世界に基づいたマルチプレイヤーカードゲームです。シリーズの第15作目の世界の中で、第8作目からの愛された「トリプルトライド」と言うカードゲームを取り上げています。AIと対戦するソロモード（難易度レベルが3つ）、友人と対戦するバーサスモード、他のプレイヤーにチャットしてチャレンジするラウンジ、週ごとの自動化されたランキングやその他の多くのカスタマイズ可能な機能を備えています。"
            }
          },
          color: "#3399cc",
          visuals: { type: "video", url: video_15thtriad }
        },
        {
          id: "iwtwwy",
          title: "I Want To Work With You",
          type: "project",
          url: "http://orion9.net/iWantToWork/#!/With/You",
          details: {
            role: ["dev", "design", "audio", "sd"],
            stack: ["custom framework", "webaudio", "css3d", "canvas"],
            about: {
              fr: "Une lettre de motivation interactive et personnalisable, avec un sound design concocté pour l'occasion.",
              en: "An interactive and customizable cover letter, featuring some sound design I made for the occasion.",
              jp: "インタラクティブでカスタマイズ可能な送付状。その為に作ったサウンド・デザインも特徴です。"
            }
          },
          color: "#6233cc",
          visuals: { type: "video", url: video_iwtwwy }
        },
        {
          id: "psychoCube",
          title: "PSYCHO-CUBE",
          type: "project",
          url: "http://orion9.net/_demos/psychoCube",
          details: {
            role: ["dev", "design", "audio", "sd"],
            stack: ["custom framework", "webaudio", "css3d", "tridiv", "canvas"],
            about: {
              fr: "Un rubik's cube intégralement crée en CSS3D basé sur l'anime PSYCHO-PASS.",
              en: "A rubik's cube game entirely generated with CSS3D based on the PSYCHO-PASS anime.",
              jp: "「PSYCHO-PASS」と言うアニメに基づいてCSS3Dで完全に生成されたルービックキューブゲーム。"
            }
          },
          color: "#20cad9",
          visuals: { type: "video", url: video_psychoCube }
        },
        {
          id: "waltzRevolution",
          title: "Waltz Waltz Revolution",
          type: "project",
          url: "http://orion9.net/_demos/waltzRevolution",
          details: {
            role: ["dev", "design", "audio", "music", "sd"],
            stack: ["custom framework", "webaudio", "canvas"],
            about: {
              fr: "Un jeu de rythme avec visualisation audio en temps réel. J'ai également créé les musiques de l'expérience.",
              en: "A rhythm game with real-time audio visualization. I've also created the music pieces featured in the game.",
              jp: "リアルタイムのオーディオ・ビジュアリゼーションを有するリズムゲーム。ゲームの作曲も作りました。"
            }
          },
          color: "#e5672d",
          visuals: { type: "video", url: video_waltzRevolution }
        }
      ]
    },
    {
      name: "clientsAgencies",
      title: { fr: "Clients & Agences", en: "Clients & Agencies", jp: "クライアントとエージェンシー" },
      text: {
        fr: "J'ai eu le plaisir de travailler avec HBO, Netflix, Google, Canal+, Dinahmoe & plus",
        en: "I’ve had the pleasure of working with HBO, Netflix, Google, Canal+, Dinahmoe & more",
        jp: "HBO、Netflix、Google、Canal+またはDinahmoeと一緒に仕事ができて光栄です。"
      }
    },
    {
      name: "contact",
      title: { fr: "Contact", en: "Contact", jp: "連絡" },
      items: [
        {
          title: { fr: "M'écrire un mail", en: "Send me an email", jp: "メールを送る" },
          url: "mailto:victoria-nine[ at ]orion9[ dot ]net"
        },
        {
          title: { fr: "M'envoyer un tweet", en: "Tweet me something", jp: "ツイートする" },
          url: "http://twitter.com/victoria9nine",
          color: "#00aced"
        },
        {
          title: { fr: "Voir mon GitHub", en: "Check my GitHub", jp: "GitHubを見る" },
          url: "http://github.com/victoriaNine",
          color: "#6e5494"
        },
        {
          title: { fr: "Me contacter sur LinkedIn", en: "Get in touch on LinkedIn", jp: "LinkedInで連絡する" },
          url: "https://www.linkedin.com/in/victoria9nine",
          color: "#1074af"
        }
      ]
    }
  ]
};

export default data;
