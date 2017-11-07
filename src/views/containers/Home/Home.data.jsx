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
              fr: "",
              en: "",
              jp: ""
            }
          },
          color: "#3399cc",
          visuals: { type: "video", url: "" }
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
          visuals: { type: "video", url: "" }
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
      name: "clients",
      title: { fr: "Clients", en: "Clients", jp: "クライアント" },
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
