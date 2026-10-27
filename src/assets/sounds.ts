// The sounds the pages play, made from tones: nothing is read for them.
// Frequencies are in hertz, lengths in milliseconds, loudness 0 to 1.

import { noise, sequence, sound, type Sound, tone } from "neottx-server-ts-ui-components";

/** C major from middle C up an octave, in hertz. */
const SCALE_HZ = [262, 294, 330, 349, 392, 440, 494, 523];
/** The two notes of a siren, in hertz, and how many times it goes between them. */
const SIREN_LOW_HZ = 700;
const SIREN_HIGH_HZ = 900;
const SIREN_NOTES = 6;

export const SOUNDS = {
  click: sound("Click", tone(1_200, 30, "square", 0.4)),
  right: sound("Right", sequence(tone(660, 120), tone(880, 200))),
  wrong: sound("Wrong", sequence(tone(220, 180, "square", 0.5), tone(185, 260, "square", 0.5))),
  tick: sound("Tick", tone(1_800, 15, "square", 0.3)),
  done: sound("Ding", sequence(tone(1_046, 120), tone(1_318, 120), tone(1_568, 300))),
  eat: sound("Eat", tone(990, 60, "triangle")),
  crash: sound("Crash", noise(400, 0.6)),
  chime: sound("Chime", sequence(tone(784, 150), tone(659, 150), tone(523, 400))),
  scale: sound("Scale", sequence(...SCALE_HZ.map((frequency) => tone(frequency, 140)))),
  siren: sound("Siren", sequence(...Array.from({ length: SIREN_NOTES }, (_, index) => tone(index % 2 === 0 ? SIREN_LOW_HZ : SIREN_HIGH_HZ, 200, "triangle")))),
} as const satisfies Record<string, Sound>;
