uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uIntensity;

varying float vPhase;
varying float vDistance;
varying float vExplosion;

void main() {
  // disco suave, falloff radial — funciona en fondo claro u oscuro
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.0, d);
  alpha = pow(alpha, 1.4);

  // mezcla A↔B oscilante con fase única por partícula
  float mixT = 0.5 + 0.5 * sin(uTime * 0.6 + vPhase * 2.0);
  vec3 color = mix(uColorA, uColorB, mixT);

  // Highlight color (uColorC) toma fuerza durante el pico de explosión
  // y añade chispas de oro/coral encendido a las partículas
  float highlight = vExplosion * (0.55 + 0.45 * sin(uTime * 5.0 + vPhase * 3.7));
  color = mix(color, uColorC, highlight);

  // Core cálido — más intenso durante la explosión
  float core = smoothstep(0.18, 0.0, d);
  vec3 coreTint = mix(vec3(0.18, 0.12, 0.08), uColorC, vExplosion);
  color = mix(color, color * 0.7 + coreTint, core * (0.5 + vExplosion * 0.6));

  // Boost de brillo en pico
  color *= 1.0 + vExplosion * 0.5;

  // Alpha base con piso mínimo para no perder partículas en suspenso,
  // y boost durante la explosión para que chispeen
  float baseAlpha = alpha * (uIntensity * 0.85 + 0.05);
  float finalAlpha = baseAlpha * (1.0 + vExplosion * 0.4);

  gl_FragColor = vec4(color, finalAlpha);
}
