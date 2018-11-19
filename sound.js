
var socket;

var mic, recorder, soundFile;

var state = 0;

var carrier; // these are for oscillator
var modulator; 
var fft;

function preload() {
  // preload your audio file so everything is ready on page load
  soundFormats('mp3', 'ogg');
  mySound = loadSound('scanneruno.mp3');

}

let t = 0; // time variable
var mic;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create an Audio input
  mic = new p5.AudioIn();

  mic.start();
 
  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);

  soundFile = new p5.SoundFile();

  //var louder = map(vol, 0, 1, height, 0);
  mySound.setVolume(5);
  mySound.play();

  carrier = new p5.Oscillator(); // connects to master output by default
  carrier.freq(340);
  carrier.amp(0);
  // carrier's amp is 0 by default, giving our modulator total control

  carrier.start();

  modulator = new p5.Oscillator('triangle');
  modulator.disconnect();  // disconnect the modulator from master output
  modulator.freq(5);
  modulator.amp(1);
  modulator.start();

  // Modulate the carrier's amplitude with the modulator
  // Optionally, we can scale the signal.
  carrier.amp(modulator.scale(-1,1,1,-1));

  // create an fft to analyze the audio
  fft = new p5.FFT();

  socket = io.connect('http://169.233.184.0.:8080');
}


function draw() {
  background(10,10);
  noStroke();
  fill(random(200,255),0,0,random(1,25));

    quad(random(windowWidth), random(height), 
         random(windowWidth), random(height),
         random(windowWidth), random(height), 
         random(windowWidth), random(height));

  // map mouseY to moodulator freq between 0 and 20hz
  var modFreq = map(mouseY, 0, height, 20, 0);
  modulator.freq(modFreq);

  var modAmp = map(mouseX, 0, width, 0, 1);
  modulator.amp(modAmp, 0.01); // fade time of 0.1 for smooth fading

}
//frameRate(random(5,25);

//}

function mousePressed() {
  // use the '.enabled' boolean to make sure user enabled the mic (otherwise we'd record silence)
  if (state === 0 && mic.enabled) {

    // Tell recorder to record to a p5.SoundFile which we will use for playback
    recorder.record(soundFile);
    background(255,0,0);
    state++;
  }

  else if (state === 1) {
    recorder.stop(); // stop recorder, and send the result to soundFile

    background(0);
    textSize(42);
    textAlign(CENTER);
    text('RECORDING HALTED. Click again to play and save.', windowWidth/2, windowHeight/2);
    state++;
    //frameRate(20);
    //I am trying to figure out how to make this stay longer or flash at the viewer
  }

  else if (state === 2) {
    soundFile.play(); // play the result!
    saveSound(soundFile, 'myChaos.wav'); // save file
    state++;
  }
}

  t = t + 0.01; // update time

  var vol = mic.getLevel();
  //for some reason this is not able to read "getLevel" on the developper conso
  console.log(vol);