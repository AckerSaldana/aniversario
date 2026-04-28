uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uIntensity;

varying float vPhase;
varying float vDistance;

void main() {
  // disco suave, falloff radial — funciona en fondo claro u oscuro
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.0, d);
  alpha = pow(alpha, 1.4);

  // mezcla rose / dorado oscilante con fase única por partícula
  float mixT = 0.5 + 0.5 * sin(uTime * 0.6 + vPhase * 2.0);
  vec3 color = mix(uColorA, uColorB, mixT);

  // toque cálido en el centro del sprite
  float core = smoothstep(0.18, 0.0, d);
  color = mix(color, color * 0.7 + vec3(0.18, 0.12, 0.08), core * 0.5);

  gl_FragColor = vec4(color, alpha * uIntensity * 0.8);
}
