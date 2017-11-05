const data = {
  keys: [
    {
      note: "C3",
      code: "KeyZ",
      pressed: false,
    },
    {
      note: "C#3",
      code: "KeyS",
      pressed: false,
    },
    {
      note: "D3",
      code: "KeyX",
      pressed: false,
    },
    {
      note: "D#3",
      code: "KeyD",
      pressed: false,
    },
    {
      note: "E3",
      code: "KeyC",
      pressed: false,
    },
    {
      note: "F3",
      code: "KeyV",
      pressed: false,
    },
    {
      note: "F#3",
      code: "KeyG",
      pressed: false,
    },
    {
      note: "G3",
      code: "KeyB",
      pressed: false,
    },
    {
      note: "G#3",
      code: "KeyH",
      pressed: false,
    },
    {
      note: "A3",
      code: "KeyN",
      pressed: false,
    },
    {
      note: "A#3",
      code: "KeyJ",
      pressed: false,
    },
    {
      note: "B3",
      code: "KeyM",
      pressed: false,
    },
    {
      note: "C4",
      code: "KeyQ",
      pressed: false,
    },
    {
      note: "C#4",
      code: "Digit2",
      pressed: false,
    },
    {
      note: "D4",
      code: "KeyW",
      pressed: false,
    },
    {
      note: "D#4",
      code: "Digit3",
      pressed: false,
    },
    {
      note: "E4",
      code: "KeyE",
      pressed: false,
    },
    {
      note: "F4",
      code: "KeyR",
      pressed: false,
    },
    {
      note: "F#4",
      code: "Digit5",
      pressed: false,
    },
    {
      note: "G4",
      code: "KeyT",
      pressed: false,
    },
    {
      note: "G#4",
      code: "Digit6",
      pressed: false,
    },
    {
      note: "A4",
      code: "KeyY",
      pressed: false,
    },
    {
      note: "A#4",
      code: "Digit7",
      pressed: false,
    },
    {
      note: "B4",
      code: "KeyU",
      pressed: false,
    },
    {
      note: "C5",
      code: "KeyI",
      pressed: false,
    }
  ],
  keyLayout: {
    KeyZ: { azerty: "W", qwerty: "Z" },
    KeyS: { azerty: "S", qwerty: "S" },
    KeyX: { azerty: "X", qwerty: "X" },
    KeyD: { azerty: "D", qwerty: "D" },
    KeyC: { azerty: "C", qwerty: "C" },
    KeyV: { azerty: "V", qwerty: "V" },
    KeyG: { azerty: "G", qwerty: "G" },
    KeyB: { azerty: "B", qwerty: "B" },
    KeyH: { azerty: "H", qwerty: "H" },
    KeyN: { azerty: "N", qwerty: "N" },
    KeyJ: { azerty: "J", qwerty: "J" },
    KeyM: { azerty: "?", qwerty: "M" },
    KeyQ: { azerty: "A", qwerty: "Q" },
    Digit2: { azerty: "2", qwerty: "2" },
    KeyW: { azerty: "Z", qwerty: "W" },
    Digit3: { azerty: "3", qwerty: "3" },
    KeyE: { azerty: "E", qwerty: "E" },
    KeyR: { azerty: "R", qwerty: "R" },
    Digit5: { azerty: "5", qwerty: "5" },
    KeyT: { azerty: "T", qwerty: "T" },
    Digit6: { azerty: "6", qwerty: "6" },
    KeyY: { azerty: "Y", qwerty: "Y" },
    Digit7: { azerty: "7", qwerty: "7" },
    KeyU: { azerty: "U", qwerty: "U" },
    KeyI: { azerty: "I", qwerty: "I" },
  },
  noteNames: {
    A: { azerty: "La", qwerty: "A" },
    B: { azerty: "Si", qwerty: "B" },
    C: { azerty: "Do", qwerty: "C" },
    D: { azerty: "Ré", qwerty: "D" },
    E: { azerty: "Mi", qwerty: "E" },
    F: { azerty: "Fa", qwerty: "F" },
    G: { azerty: "Sol", qwerty: "G" }
  },
  translations: {
    midi: { fr: "Périphérique MIDI", en: "MIDI device", jp: "MIDIデバイス" },
    status: { fr: "Statut ", en: "Status", jp: "状況" },
    note: { fr: "Note ", en: "Note", jp: "ノート" },
    connected: { fr: "Connecté", en: "Connected", jp: "接続中" },
    disconnected: { fr: "Déconnecté", en: "Disconnected", jp: "切断されている" }
  }
};

export default data;
