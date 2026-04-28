uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform float uIntensity;

attribute float aScale;
attribute float aPhase;

varying float vPhase;
varying float vDistance;

void main() {
  vec3 pos = position;

  // oscilación lenta vertical/horizontal por partícula
  pos.y += sin(uTime * 0.4 + aPhase) * 0.18;
  pos.x += cos(uTime * 0.3 + aPhase * 1.7) * 0.12;
  pos.z += sin(uTime * 0.25 + aPhase * 0.6) * 0.1;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // tamaño con falloff por distancia y modulación por scale + intensidad
  float distFactor = 1.0 / -mvPosition.z;
  gl_PointSize = uSize * uPixelRatio * aScale * distFactor * (0.5 + uIntensity * 0.8);

  vPhase = aPhase;
  vDistance = -mvPosition.z;
}
