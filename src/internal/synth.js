import * as Tone from 'tone';
import * as dat from './dat.gui';

function getSynth () {
  const settings = {
    vibratoAmount: 0.3,
    vibratoRate: 4,
    harmonicity: 1,
    voice0: {
      volume: -24,
      portamento: 0,
      oscillator: {
        type: "sine"
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0,
        sustain: 1,
        release: 0.01
      },
      envelope: {
        attack: 0.04,
        decay: 0,
        sustain: 1,
        release: 0.01
      }
    },
    voice1: {
      volume: -24,
      portamento: 0,
      oscillator: {
        type: "amtriangle"
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0,
        sustain: 1,
        release: 0.01
      },
      envelope: {
        attack: 0.05,
        decay: 0,
        sustain: 1,
        release: 0.01
      }
    }
  };

  const bitCrusher = new Tone.BitCrusher(6).toMaster();
  bitCrusher.wet.value = 0.02;

  const filter = new Tone.Filter(4000, "highpass").toMaster();
  filter.Q.value = 0.1;

  const chorus = new Tone.Chorus("8n", 1.5, 0.25).toMaster();

  const autoFilter = new Tone.AutoFilter("4n").toMaster().start();
  autoFilter.min = 1800;
  autoFilter.filter.type = "lowpass";

  const analyser = new Tone.Analyser("waveform");

  const synth = new Tone.PolySynth(10, Tone.DuoSynth).set(settings)
    .connect(filter).connect(chorus).connect(autoFilter)
    .connect(analyser).toMaster();

  if (__IS_DEV__) {
    const oscillatorTypes = [
      'sine', 'sawtooth', 'triangle', 'square',
      'pwm', 'pulse',
      'fmsine', 'fmsawtooth', 'fmtriangle', 'fmsquare',
      'amsine', 'amsawtooth', 'amtriangle', 'amsquare',
      'fatsine', 'fatsawtooth', 'fattriangle', 'fatsquare'
    ];

    const gui = new dat.GUI();
    gui.domElement.parentNode.style.zIndex = "1000";

    const c1 = gui.add(settings, 'vibratoAmount', 0);
    const c2 = gui.add(settings, 'vibratoRate', 0);
    const c3 = gui.add(settings, 'harmonicity', 0);

    const f1 = gui.addFolder('voice0');
    const c4 = f1.add(settings.voice0, 'volume', -48, -10);
    const c5 = f1.add(settings.voice0, 'portamento', 0);
    const c6 = f1.add(settings.voice0.oscillator, 'type', oscillatorTypes);
    const f1f1 = f1.addFolder('filterEnvelope');
    const c7 = f1f1.add(settings.voice0.filterEnvelope, 'attack', 0.01);
    const c8 = f1f1.add(settings.voice0.filterEnvelope, 'decay', 0);
    const c9 = f1f1.add(settings.voice0.filterEnvelope, 'sustain', 0, 1);
    const c10 = f1f1.add(settings.voice0.filterEnvelope, 'release', 0);
    const f1f2 = f1.addFolder('envelope');
    const c11 = f1f2.add(settings.voice0.envelope, 'attack', 0.01);
    const c12 = f1f2.add(settings.voice0.envelope, 'decay', 0);
    const c13 = f1f2.add(settings.voice0.envelope, 'sustain', 0, 1);
    const c14 = f1f2.add(settings.voice0.envelope, 'release', 0);
    f1.open();
    f1f1.open();
    f1f2.open();

    const f2 = gui.addFolder('voice1');
    const c15 = f2.add(settings.voice1, 'volume', -48, -10);
    const c16 = f2.add(settings.voice1, 'portamento', 0);
    const c17 = f2.add(settings.voice1.oscillator, 'type', oscillatorTypes);
    const f2f1 = f2.addFolder('filterEnvelope');
    const c18 = f2f1.add(settings.voice1.filterEnvelope, 'attack', 0.01);
    const c19 = f2f1.add(settings.voice1.filterEnvelope, 'decay', 0);
    const c20 = f2f1.add(settings.voice1.filterEnvelope, 'sustain', 0, 1);
    const c21 = f2f1.add(settings.voice1.filterEnvelope, 'release', 0);
    const f2f2 = f2.addFolder('envelope');
    const c22 = f2f2.add(settings.voice1.envelope, 'attack', 0.01);
    const c23 = f2f2.add(settings.voice1.envelope, 'decay', 0);
    const c24 = f2f2.add(settings.voice1.envelope, 'sustain', 0, 1);
    const c25 = f2f2.add(settings.voice1.envelope, 'release', 0);
    f2.open();
    f2f1.open();
    f2f2.open();
    gui.close();

    [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23, c24, c25].forEach((controller) => {
      controller.onChange(() => { synth.set(settings); });
    });
  }

  return { synth, analyser };
}

export default getSynth();
