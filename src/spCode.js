// This function will be converted into a string so
// the scope is limited to this function only.

// To pass external data use the 'input' function. See other examples.

export function spCode()  {
  let features = {};
  let mirror = () => {
    if(fxrand() > .4) {
      
      features['Mirror'] = true;
      return `mirrorXYZ();`
    } else {
      features['Mirror'] = false;
      return ''
    }
  };

  let shape = () => {
    let prob = fxrand();
    console.log(prob)
    if(prob < .1) {
      features['Shape'] = 'Grid';
      return `let spacer = .06;
let reps = 3;
layoutGrid(reps, spacer, shape((i) => {
  // rotateY(time);
  line(vec3(0, 0, -.5), vec3(.0, .0, .5), .03);
}));
function layoutGrid(reps, spacerSize, draw) {
  for(let i = 0; i < reps; i++) {
    repeat(vec3(spacerSize * i, spacerSize * i , spacerSize * i) , vec3(reps, reps, reps));
    draw(i / reps);
  }
};`

    } else if(prob < .2) {
      features['Shape'] = 'Torus';
      return `rotateX(PI/2);
torus(vec2(.5+n*.001));`
    } else if(prob < .4) {
      features['Shape'] = 'Sphere';
      return `sphere(.9+n*.001);`
    } else if (prob < .5) {
      features['Shape'] = 'Sphere Segments';
      return `let sphereSegments = shape((maxIter, maxSize) => {
  for(let i = 1.0; i <= maxIter; i++) {
    sphere(pow(maxSize/(i*1.0), .35));
    shell(.01);
  }
});
sphereSegments(5, .8);
`;
    } else {
      features['Shape'] = 'Box';
      return `box(vec3(.64+n*.001));`
    }
  }

  let maxIterations = () => {
    let prob = fxrand();
    console.log(prob)
    if(prob < .1) {
      features['Raymarching Iterations'] = 'Low';
      return `setMaxIterations(10);`;
    } else {
      features['Raymarching Iterations'] = 'High';
      return ``;
    }    
  }

  let noise = () => {
    let prob = fxrand();
    console.log(prob)
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
    if(prob<.9) {
      features['Color'] = 'Black & White';
      let occlusionAmt = -100;
      console.log('nose enableed', features['Noise Enabled'])
      if(features['Noise Enabled']) {
        occlusionAmt = -30;
      }
      return `color(vec3(length(col))+glo*.02);
occlusion(${occlusionAmt})`;
      
    } else {
      features['Color'] = 'Depth';
      return `color(cosPallette(length(s), vec3(.5), vec3(.5), vec3(.5, 0, 1), vec3(phase))+glo*.3);
occlusion(-4);`
    }
  }
  
  function getFeatureString(value) {
    if (value < 0.5) return "low"
    if (value < 0.9) return "medium"
    else return "high"
  }
  
  window.$fxhashFeatures = features




  return `function gyroid(scale) {
  let s = getSpace();
  s = s* scale;
  return dot(sin(s+time), cos(vec3(s.z, s.x, s.y) + time))/ scale ;
}
${maxIterations()}
setStepSize(.4);
let noiseScale = input(20, 0, 200);
//backgroundColor(0, 0, 0);
lightDirection(getRayDirection())
${mirror()}
let gyScale = input(10, 0, 200);
let gy = gyroid(gyScale);

${noise()}
let glo = max(1.0-1.0*dot(-1.0*normal,getRayDirection()),0.0);
let col = gy * n * 0.1;
metal(abs(n) * 2);
shine(.2);

let cosPallette = (t, brightness, contrast, oscelation, phase) => {
  return brightness + contrast * cos(PI*2*(oscelation*t+phase));
}

let phase = input(.5, 0, 10);
let s = getSpace();
${color()}

${shape()}
intersect();
setSDF(gy+n*.01);
`;
};