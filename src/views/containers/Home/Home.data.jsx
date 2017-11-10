import video_15thtriad from './assets/15thtriad.mp4';
import video_iwtwwy from './assets/iwtwwy.mp4';

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
          url: "https://15thtriad.com",
          details: {
            role: ["dev", "design", "audio"],
            stack: ["backbone", "webpack", "webaudio", "canvas", "webgl", "node.js", "socket.io", "couchdb"],
            github: "http://github.com/victoriaNine/xvthTriad",
            about: {
              fr: "Mon projet bac-à-sable. The Fifteenth Triad est un jeu de cartes multijoueur basé sur l'univers de Final Fantasy. Situé dans l'univers du 15ème épisode de la série, il reprend le jeu de cartes apprécié des fans du 8ème épisode, le \"Triple Triad\". The Fifteenth Triad propose un mode solo contre une IA (trois niveaux de difficulté), un mode versus pour jouer contre un ami, un salon pour discuter et défier d'autre joueurs, des classements hebdomadaires automatisés, et un tas d'autres fonctionnalités personnalisables.",
              en: "My sandbox project. The Fifteenth Triad is a multiplayer card game based on the Final Fantasy universe. Set in the series' 15th installment's universe, it takes after the beloved card game from the 8th installment, the \"Triple Triad\". The Fifteenth Triad features a solo mode against an AI (three difficulty levels), a versus mode to play against a friend, a lounge to chat and challenge other players, automated weekly rankings, and many other customizable features.",
              jp: ""
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
              fr: "",
              en: "",
              jp: ""
            }
          },
          color: "#6233cc",
          visuals: { type: "video", url: video_iwtwwy }
        },
        {
          id: "psychoCube",
          title: "Psycho-Cube",
          type: "project",
          url: "http://orion9.net/_demos/psychoCube",
          details: {
            role: ["dev", "design", "audio", "sd"],
            stack: ["custom framework", "webaudio", "css3d", "canvas"],
            about: {
              fr: "",
              en: "",
              jp: ""
            }
          },
          color: "#20cad9",
          visuals: { type: "video", url: "" }
        },
        {
          id: "waltz",
          title: "Waltz Waltz Revolution",
          type: "project",
          url: "http://orion9.net/_demos/waltzRevolution",
          details: {
            role: ["dev", "design", "audio", "music", "sd"],
            stack: ["custom framework", "webaudio", "canvas"],
            about: {
              fr: "",
              en: "",
              jp: ""
            }
          },
          color: "#d48930",
          visuals: { type: "video", url: "" }
        }
      ]
    },
    {
      name: "experiments",
      title: { fr: "Expériences", en: "Experiments", jp: "試験" },
      items: [
        {
          id: "meteorRain",
          title: "Meteor Rain",
          type: "experiment",
          url: "http://orion9.net/_demos/meteorRain",
          details: {
            role: ["dev", "design"],
            stack: ["vanillajs", "canvas", "svg"],
            about: {
              fr: "",
              en: "",
              jp: ""
            }
          },
          color: "#d44b30",
          visuals: { type: "video", url: "" }
        },
        {
          id: "intertap",
          title: "Intertap",
          type: "experiment",
          url: "http://orion9.net/_demos/intertap",
          details: {
            role: ["dev", "design", "audio", "sd"],
            stack: ["custom framework", "webaudio", "canvas"],
            about: {
              fr: "",
              en: "",
              jp: ""
            }
          },
          color: "#e4347a",
          visuals: { type: "video", url: "" }
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
          url: "mailto:victoria-nine[ at ]orion9.net"
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
        }
      ]
    }
  ]
};

export default data;
