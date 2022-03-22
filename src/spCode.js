// This function will be converted into a string so
// the scope is limited to this function only.

// To pass external data use the 'input' function. See other examples.

export function spCode()  {
  return `let s = getSpace();
let col = sampleBufferA(vec2(s.x, s.y));
color(col);
sphere(.5);`
};

export function defaultPassCode() {
  return `enable2D();
color(1, 1, 0);
`
};