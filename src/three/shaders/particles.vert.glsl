uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform float uIntensity;
uniform float uExplosion;

attribute float aScale;
attribute float aPhase;

varying float vPhase;
varying float vDistance;
varying float vExplosion;

void main() {
  vec3 pos = position;

  // oscilación lenta vertical/horizontal por partícula
  pos.y += sin(uTime * 0.4 + aPhase) * 0.18;
  pos.x += cos(uTime * 0.3 + aPhase * 1.7) * 0.12;
  pos.z += sin(uTime * 0.25 + aPhase * 0.6) * 0.1;

  // Durante el pico, las partículas empujan radialmente — sensación de explosión
  float burst = uExplosion * (0.6 + 0.4 * sin(aPhase * 3.0));
  pos *= 1.0 + burst * 0.06;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // tamaño con falloff por distancia, modulación por scale + intensidad,
  // y un pulso adicional durante la explosión
  float distFactor = 1.0 / -mvPosition.z;
  float burstSize = 1.0 + uExplosion * 1.6 * (0.7 + 0.3 * sin(uTime * 8.0 + aPhase * 4.0));
  gl_PointSize = uSize * uPixelRatio * aScale * distFactor * (0.5 + uIntensity * 0.8) * burstSize;

  vPhase = aPhase;
  vDistance = -mvPosition.z;
  vExplosion = uExplosion;
}
