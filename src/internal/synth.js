import * as Tone from 'tone';
import StartAudioContext from 'startaudiocontext';
import * as dat from './dat.gui';

function getSynth () {
  const settings = {
    oscillator  : {
      type: "amsine",
      harmonicity: 1,
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 1,
      release: 0.5
    }
  };

  const bitCrusher = new Tone.BitCrusher(6);
  bitCrusher.wet.value = 0.02;

  const chorus = new Tone.Chorus("8n", 1.5, 0.35).toMaster();

  const autoFilter = new Tone.AutoFilter("1m").start().toMaster();
  autoFilter.min = 1800;
  autoFilter.filter.type = "lowpass";

  const analyser = new Tone.Analyser("waveform");

  const synth = new Tone.PolySynth(10, Tone.Synth).set(settings)
    .connect(chorus).connect(autoFilter)
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

    const c1 = gui.add(settings.oscillator, 'type', oscillatorTypes);
    const c2 = gui.add(settings.envelope, 'attack', 0.01);
    const c3 = gui.add(settings.envelope, 'decay', 0);
    const c4 = gui.add(settings.envelope, 'sustain', 0, 1);
    const c5 = gui.add(settings.envelope, 'release', 0);
    gui.close();

    [c1, c2, c3, c4, c5].forEach((controller) => {
      controller.onChange(() => { synth.set(settings); });
    });
  }

  StartAudioContext(synth._context._context);

  return { synth, analyser };
}

export default getSynth();
