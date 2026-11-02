const vertexSource = `
attribute vec2 aPosition;
varying vec2 vUV;
void main() {
  vUV = vec2(aPosition.x * .5 + .5, .5 - aPosition.y * .5);
  gl_Position = vec4(aPosition, 0., 1.);
}`;

const fragmentSource = `
precision highp float;
varying vec2 vUV;
uniform sampler2D uPhoto;
uniform sampler2D uRelief;
uniform vec2 uTexel;
uniform vec2 uSize;
uniform vec3 uLight;
uniform float uDepth;
uniform float uStrength;

float heightAt(vec2 uv) {
  return dot(texture2D(uRelief, uv).rg, vec2(256. / 257., 1. / 257.)) * uDepth;
}

void main() {
  vec3 photo = texture2D(uPhoto, vUV).rgb;
  vec4 data = texture2D(uRelief, vUV);
  float h = heightAt(vUV);
  vec2 slope = vec2(
    heightAt(vUV + vec2(uTexel.x, 0.)) - heightAt(vUV - vec2(uTexel.x, 0.)),
    heightAt(vUV + vec2(0., uTexel.y)) - heightAt(vUV - vec2(0., uTexel.y))
  ) / (2. * uTexel * uSize);
  vec3 normal = normalize(vec3(-slope, 1.));
  vec3 light = normalize(uLight - vec3(vUV * uSize, h));

  // Trace the height field toward the light. A raised letter occludes cloth
  // on the opposite side, including the spaces between adjacent letter edges.
  float visibility = 1.;
  float horizontal = max(length(light.xy), .001);
  for (int i = 1; i <= 24; i++) {
    float distance = float(i) * uDepth * .14;
    vec2 uv = vUV + light.xy / horizontal * distance / uSize;
    float rayHeight = h + distance * light.z / horizontal;
    float clearance = rayHeight - heightAt(uv);
    visibility = min(visibility, smoothstep(-.7, 1.3 + distance * .1, clearance + .8));
  }
  float diffuse = max(dot(normal, light), 0.);
  vec3 halfway = normalize(light + vec3(0., 0., 1.));
  float specular = .012 * pow(max(dot(normal, halfway), 0.), 20.);
  float illumination = (.68 + visibility * (.5 * diffuse + specular))
    / (.68 + .5 * max(light.z, 0.) + .012 * pow(max(halfway.z, 0.), 20.));

  // Remove the photographed lighting while retaining the original fine weave.
  // Only the reconstructed relief is re-lit; the edge blends stay untouched.
  vec3 cloth = photo * .903 / max(data.b, .35);
  vec3 relit = clamp(cloth * illumination, 0., 1.);
  gl_FragColor = vec4(mix(photo, relit, data.a * uStrength * .9), 1.);
}`;

export async function loadReliefData() {
  const response = await fetch(new URL('./logo-relief.bin', import.meta.url));
  if (!response.ok) throw new Error('Relief data unavailable');
  const buffer = await response.arrayBuffer();
  const view = new DataView(buffer);
  if (view.getUint32(0, false) !== 0x524c4631) throw new Error('Invalid relief data');
  const width = view.getUint16(4, true);
  const height = view.getUint16(6, true);
  if (buffer.byteLength !== 8 + width * height * 4) throw new Error('Incomplete relief data');
  return { width, height, pixels: new Uint8Array(buffer, 8) };
}

export async function createLogoRelief(anchor, data) {
  const image = anchor.querySelector('img');
  try { await image.decode(); } catch { return null; }
  const canvas = document.createElement('canvas');
  canvas.className = 'logo-relief';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
  if (!gl) return null;
  const photo = document.createElement('canvas');
  const surface = photo.getContext('2d');
  if (!surface) {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return null;
  }
  let photoTexture;

  function shader(type, source) {
    const result = gl.createShader(type);
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error('Relief shader unavailable');
    return result;
  }
  let program;
  try {
    program = gl.createProgram();
    const vertex = shader(gl.VERTEX_SHADER, vertexSource);
    const fragment = shader(gl.FRAGMENT_SHADER, fragmentSource);
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Relief program unavailable');
    gl.useProgram(program);
    const vertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    for (const [unit, name] of [[0, 'uPhoto'], [1, 'uRelief']]) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      if (unit === 0) {
        photoTexture = texture;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255]));
      }
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, data.width, data.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data.pixels);
      gl.uniform1i(gl.getUniformLocation(program, name), unit);
    }
  } catch {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return null;
  }

  const locations = Object.fromEntries(['uSize', 'uLight', 'uDepth', 'uStrength', 'uTexel'].map(name => [name, gl.getUniformLocation(program, name)]));
  gl.uniform2f(locations.uTexel, 1 / data.width, 1 / data.height);
  let available = true;
  canvas.addEventListener('webglcontextlost', () => {
    available = false;
    anchor.classList.remove('has-relief');
    canvas.remove();
  });
  anchor.append(canvas);

  const renderer = {
    anchor,
    visible: true,
    render(pointer, strength) {
      if (!available || !this.visible) return;
      const rect = image.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        // Pre-filter the photo at its displayed resolution. Direct minification
        // of the full bitmap would alias the fine weave into a different pattern.
        photo.width = width;
        photo.height = height;
        surface.imageSmoothingQuality = 'high';
        surface.drawImage(image, 0, 0, width, height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, photoTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, photo);
      }
      const x = pointer ? pointer.x - rect.left : -rect.width;
      const y = pointer ? pointer.y - rect.top : -rect.height;
      const distance = Math.hypot(x - rect.width / 2, y - rect.height / 2);
      gl.uniform2f(locations.uSize, rect.width, rect.height);
      gl.uniform3f(locations.uLight, x, y, Math.max(rect.width * .48, distance * .65));
      gl.uniform1f(locations.uDepth, rect.width * .020);
      gl.uniform1f(locations.uStrength, strength);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
  renderer.render(null, 0);
  anchor.classList.add('has-relief');
  return renderer;
}
