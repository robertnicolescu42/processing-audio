import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import p5 from 'p5';
import * as Tone from 'tone';

@Component({
  selector: 'app-visual',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.css'],
})
export class VisualComponent implements OnInit {
  canvas: any;
  oscillators: any[] = [];
  reverb: any;
  numOscillators = 1; // Start with one oscillator
  freq = []; // Frequencies for oscillators
  volumeControl = -15; // Start with a reasonable volume
  reverbValue = 1; // Start with reverb wetness
  reverbDecay = 15; // Set initial decay for long-lasting reverb
  maxReverbDecay = 30; // Maximum decay time for a larger reverb tail
  isPlaying = false; // Track play state
  time = 0; // Time variable for animation

  constructor() {}

  ngOnInit() {
    // this.initializeOscillators();

    const sketch = (s) => {
      s.setup = () => {
        let canvas2 = s.createCanvas(s.windowWidth - 730, s.windowHeight - 180);
        canvas2.parent('sketch-holder');
        s.background(10);
        s.noFill();
        s.stroke(255, 100);
      };

      s.draw = () => {
        s.background(10);
        s.strokeWeight(1);

        // Lissajous curves based on oscillators' frequencies
        for (let i = 0; i < this.numOscillators; i++) {
          let freq = this.freq[i];
          let xAmplitude = s.map(freq, 100, 1000, 100, s.width / 2);
          let yAmplitude = s.map(freq, 100, 1000, 100, s.height / 2);

          s.beginShape();

          for (let t = 0; t < s.TWO_PI; t += 0.01) {
            // Lissajous curve formula equations
            // x = xAmplitude * sin(t + time * 0.01 * (i + 1))
            // y = yAmplitude * sin(2 * t + time * 0.01 * (i + 1))
            let x = xAmplitude * s.sin(t + this.time * 0.01 * (i + 1));
            let y = yAmplitude * s.sin(2 * t + this.time * 0.01 * (i + 1));
            s.vertex(s.width / 2 + x, s.height / 2 + y);
          }
          s.endShape();
        }

        // This could be a slider in itself
        this.time += 0.5; // Increment time for continuous animation
      };
    };

    this.canvas = new p5(sketch);
  }

  initializeOscillators() {
    this.stopOscillators();

    this.oscillators = [];
    this.freq = [];

    // Reinitialize reverb with updated settings
    if (this.reverb) this.reverb.dispose(); // Dispose of old reverb
    this.reverb = new Tone.Reverb({ decay: this.reverbDecay }).toDestination();
    this.reverb.wet.value = this.reverbValue;

    // Create oscillators and connect them to reverb
    for (let i = 0; i < this.numOscillators; i++) {
      const freq = 200 + i * 50; // Frequencies spaced by 50 Hz
      this.freq.push(freq);

      const osc = new Tone.Oscillator(freq, 'sine').start();
      // Adjust volume based on number of oscillators to prevent clipping / loudness issues
      osc.volume.value =
        this.volumeControl - 3 * Math.log2(this.numOscillators);
      osc.connect(this.reverb);

      this.oscillators.push(osc);
    }
  }

  // Start the sound
  startSound() {
    if (!this.isPlaying) {
      this.initializeOscillators();
      Tone.Transport.start();
      this.isPlaying = true;
    }
  }

  // Stop the sound
  stopSound() {
    if (this.isPlaying) {
      this.stopOscillators();
      Tone.Transport.stop(); // Stop Tone.js transport
      this.isPlaying = false;
    }
  }

  // Stop all oscillators
  stopOscillators() {
    this.oscillators.forEach((osc) => osc.stop());
    this.oscillators = [];
  }

  // Handle oscillator count change
  handleOscillatorChange(event: any) {
    const selectedValue = event.target.value;
    this.numOscillators = parseInt(selectedValue, 10);
    this.initializeOscillators(); // Re-initialize oscillators based on selection
  }

  updateSoundSettings() {
    this.reverb.wet.value = this.reverbValue;
    this.reverb.decay = this.reverbDecay;
  }
}
