// This function will be converted into a string so
// the scope is limited to this function only.

// To pass external data use the 'input' function. See other examples.

export function spCode()  {
  return `let res = getResolution()
rotateY(time)
let ratio = res.y/res.x
let s = getSpace()
let v = vec2(s.x*ratio, s.y)+0.5
let col = sampleBufferA(v)
col.x = pow(col.x, 6)
col.y = pow(col.y, 6)
col.z = pow(col.z, 6)
color(col);

box(vec3(.5));`
};


export function blurPassCode() {
  return `let kk = enable2D()
  let p = 0.5*getPixelCoord()/getResolution();
  //p = (p -.5) *1.1 + .5
  let c = sampleLastFrame(p)
  
  let init = vec3(0.5+0.5*noise(70*vec3(p.x,p.y, 0)))
  let pxs = 1/getResolution()
  
  let comps = [
    sampleLastFrame(p+vec2(-1*pxs.x,0)),
    sampleLastFrame(p+vec2(pxs.x,0)),
    sampleLastFrame(p+vec2(0,pxs.y)),
    sampleLastFrame(p+vec2(0,-1*pxs.y))
  ]
  
  let col = vec3(c.x, c.y, c.z)
  
  let cb = comps.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    vec4(0)
  )
  cb /= 4
  cb = vec3(cb.x, cb.y, cb.z)
  color(mix(cb, init, pow(nsin(time), 14)));`;
}

export function defaultPassCode() {
  return `let res = getResolution()
  let ratio = res.y/res.x
  //rotateY(time)
  let s = getSpace()
  let n = noise(s*10+time)*.5+.5;
  s*= nsin(time)+.4+n*.1;
  let v = vec2(s.x*ratio, s.y)+0.5
  let col = sampleLastFrame(v);
  col = vec3(col.x, col.y, col.z)
  col = mix(normal*.9+vec3(0, 0, .1), col, tryMakeNum(nsin(time)));
  color(col);
  metal(n)
  shine(n);
  sphere(1.2+n*.004);
`
};

// export function defaultPassCode() {
//   return `enable2D();
// color(1, 1, 0);
// `
// };