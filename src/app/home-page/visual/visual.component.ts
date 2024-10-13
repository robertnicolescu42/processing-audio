import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import p5 from 'p5';
import * as Tone from 'tone';

@Component({
  selector: 'app-visual',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './visual.component.html',
  styleUrls: ['./visual.component.css'],
})
export class VisualComponent implements OnInit {
  canvas: any;
  oscillators: any[] = [];
  reverb: any;
  freq1 = 220; // Frequency for oscillator 1
  freq2 = 330; // Frequency for oscillator 2
  phase1 = 0; // Phase for oscillator 1
  phase2 = 90; // Phase for oscillator 2
  reverbValue = 1; // Start with full reverb
  maxReverbValue = 5; // Max reverb level for the slider
  reverbDecay = 10; // Initial decay time for reverb (longer reverb tail)
  maxReverbDecay = 20; // Max value for the decay slider
  isPlaying = false; // Track play state

  constructor() {}

  ngOnInit() {
    // Create two oscillators (without starting them when the component initalizes)
    this.oscillators[0] = new Tone.Oscillator(this.freq1, 'sine');
    this.oscillators[1] = new Tone.Oscillator(this.freq2, 'sine');

    // Create reverb with a long decay and connect the oscillators
    this.reverb = new Tone.Reverb({ decay: this.reverbDecay }).toDestination();
    this.oscillators[0].connect(this.reverb);
    this.oscillators[1].connect(this.reverb);

    // Set initial reverb wetness
    this.reverb.wet.value = this.reverbValue;

    const sketch = (s) => {
      s.setup = () => {
        let canvas2 = s.createCanvas(s.windowWidth - 730, s.windowHeight - 180);
        canvas2.parent('sketch-holder');
        s.background(0);
      };

      s.draw = () => {
        s.background(0);

        // Map frequencies to visual size
        let radius1 = s.map(this.freq1, 100, 1000, 50, 200);
        let radius2 = s.map(this.freq2, 100, 1000, 50, 200);

        // Map phases to positions
        let x1 = s.map(s.sin(this.phase1), -1, 1, 100, s.width - 100);
        let x2 = s.map(s.sin(this.phase2), -1, 1, 100, s.width - 100);

        // Draw spheres based on sound properties
        s.fill(148, 0, 211);
        s.ellipse(x1, s.height / 2, radius1, radius1);

        s.fill(0, 255, 0);
        s.ellipse(x2, s.height / 2 + 100, radius2, radius2);

        // Update phases for animation
        if (this.isPlaying) {
          this.phase1 += 0.01;
          this.phase2 += 0.01;
        }
      };
    };

    this.canvas = new p5(sketch);
  }

  // Start the sound
  startSound() {
    if (!this.isPlaying) {
      this.oscillators[0].start();
      this.oscillators[1].start();
      Tone.Transport.start();
      this.isPlaying = true;
    }
  }

  // Stop the sound
  stopSound() {
    if (this.isPlaying) {
      this.oscillators[0].stop();
      this.oscillators[1].stop();
      Tone.Transport.stop();
      this.isPlaying = false;
    }
  }

  updateSound() {
    this.oscillators[0].frequency.value = this.freq1;
    this.oscillators[1].frequency.value = this.freq2;

    this.reverb.wet.value = this.reverbValue;
    this.reverb.decay = this.reverbDecay;

    // Phases are updated only when playing (see draw method)
  }
}
