// This function will be converted into a string so
// the scope is limited to this function only.

// To pass external data use the 'input' function. See other examples.
export function getFeatureString(val, max) {
  if (val / max < 0.3333) return "Low"
  if (val / max <= 0.6666) return "Medium"
  else return "High"
}

export function spCode()  {
  let features = {};

  // Editor Dark Mode
  let darkModeProb = fxrand();
  if(darkModeProb < .5) {
    features['Editor Dark Mode'] = true;
  } else {
    features['Editor Dark Mode'] = false;
  }

  let mirror = () => {
    let prob = fxrand();
    if(features['Shape'] == 'Inside Torus') {
      prob = .2;
    }
    if(prob > .4) {
      features['Mirror'] = true;
      return `mirrorXYZ();`
    } else {
      features['Mirror'] = false;
      return ''
    }
  };

  let layoutGrid = `function layoutGrid(reps, spacerSize, draw) {
  for(let i = 0; i < reps; i++) {
    repeat(vec3(spacerSize * i, spacerSize * i , spacerSize * i) , vec3(reps, reps, reps));
    draw(i / reps);
  }
};`

  let shape = () => {
    let prob = fxrand();
    if(features['Shape'] == 'Inside Torus') {
      features['Editor Dark Mode'] = true;
      return '';
    }

    if(prob < .1) {
      if(features['Noise Enabled']) {
        return shape();
      }
      features['Shape'] = 'Grid Lines';
      return `let spacer = .045;
let reps = 3;
layoutGrid(reps, spacer, shape((i) => {
  line(vec3(0, 0, -.5), vec3(.0, .0, .4), .03);
}));
${layoutGrid}`;
    } else if (prob < .15) {
      if(features['Noise Enabled']) {
        return shape();
      }
      features['Shape'] = 'Grid Spheres';
      return `let spacer = .03;
let reps = 4;
layoutGrid(reps, spacer, shape((i) => {
  sphere(.01);
}));
${layoutGrid}`;
    } else if(prob < .2) {
      features['Shape'] = 'Torus';
      return `rotateX(PI/2);
torus(vec2(.5 + n * .001));`
    } else if(prob < .4) {
      features['Shape'] = 'Sphere';
      return `sphere(.9 + n * .001);`
    } else if (prob < .5) {
      features['Shape'] = 'Sphere Segments';
      return `let sphereSegments = shape((maxIter, maxSize) => {
  for(let i = 1.0; i <= maxIter; i++) {
    sphere(pow(maxSize / i, .35));
    shell(.01);
  }
});
sphereSegments(5, .8);
`;
    } else {
      features['Shape'] = 'Box';
      return `box(vec3(.64 + n * .001));`
    }
  }

  let opMode = () => {
    let prob = fxrand();
    if(prob < .05) {
      features['Shape'] = 'Inside Torus';
      features['CSG Mode'] = 'Difference';
      return '';
    } else if(prob < .1) {
      features['CSG Mode'] = 'Intersect';
      return `intersect();`
    } else if(prob < .4) {
      features['CSG Mode'] = 'Mix';
      let mixProb = fxrand();
      features['Mix Amount'] = getFeatureString(mixProb, 1.0);
      let mixAmt = mixProb * .4 + .3;
      features['CSG Mode'] = 'Mix';
      return `mixGeo(${mixAmt});`
    } else {
      features['CSG Mode'] = 'Difference';
      return `difference();`
    } 
  }

  let maxIterations = () => {
    let prob = fxrand();
    if(prob < .5 && features['CSG Mode'] == 'Mix') {
      features['Raymarching Iterations'] = 'Low';
      features['Editor Dark Mode'] = true;
      return `setMaxIterations(10);`;
    } else {
      features['Raymarching Iterations'] = 'High';
      return ``;
    }
  }

  let noise = () => {
    let prob = fxrand();
    if(prob < .5) {
      features['Noise Enabled'] = false;
      return `let n = .01;`
    } else {
      features['Noise Enabled'] = true;
      return `let n = noise(getRayDirection() * noiseScale+time ) * 10;`
    }
  }

  let color = ()=> {
    let prob = fxrand();
    if(features['Shape'] == 'Inside Torus') {
      prob = .2;
    }

    if(prob < .4) {
      features['Color'] = 'Black & White';
      let occlusionAmt = -100;
      if(features['Noise Enabled']) {
        occlusionAmt = -30;
      }
      return `color(vec3(length(col)) + glo * .02);
occlusion(${occlusionAmt})`;
      
    } else {
      features['Color'] = 'Depth';
      return `let cosPallette = (t, brightness, contrast, oscillation, phase) => {
  return brightness + contrast * cos(PI * 2 * (oscillation * t + phase));
}

color(cosPallette(length(getSpace()), vec3(.5), vec3(.5), vec3(.5, 0, 1), vec3(phase)) + glo * .3);
occlusion(-4);`
    }
  }

  let after = () => {
    if(features['Shape'] == 'Inside Torus') {
      return `difference();
torus(2.0, 2.0);`;
    }
    return '';
  }
  
  window.$fxhashFeatures = features

  let mode = opMode();
  let sdfNoiseScale = .01;
  if(features['CSG Mode'] == 'Mix') {
    sdfNoiseScale = .001;
  }
  return `let goWild = input();
function gyroid(scale) {
  let s = getSpace();
  s = s * scale;
  let v = mix(sin(s + time), tan(s + nsin(time) * .2), goWild);
  return dot(v, cos(vec3(s.z, s.x, s.y) + time)) / scale ;
}
${maxIterations()}
setStepSize(.4);
let noiseScale = input(20, 0, 200);
lightDirection(getRayDirection());
${mirror()}
let gyScale = input(10, 0, 200);
let gy = gyroid(gyScale);

${noise()}
let glo = max(1.0-1.0*dot(-1.0 * normal, getRayDirection()), 0.0);
let col = gy * n * 0.1;
metal(abs(n) * 2);
shine(.2);
let phase = input(.5, 0, 10);
${color()}
${shape()}
${mode}
setSDF(gy + n * ${sdfNoiseScale});
${after()}`;
};