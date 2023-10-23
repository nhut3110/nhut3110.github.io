const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("Your browser does not support WebGL");
}

function showExercise(exerciseNumber) {
  switch (exerciseNumber) {
    case 1:
      drawTriangle();
      break;
    case 2:
      drawTriangleWithGradient();
      break;
    case 3:
      drawPoints();
      break;
    case 4:
      drawPointsWithPointCoord();
      break;
  }
}

showExercise(1);

function drawTriangle() {
  // Define the triangle's vertices
  const triangleVertices = new Float32Array([0.0, 1.0, -1.0, -1.0, 1.0, -1.0]);

  const triangleVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
  triangleVertexBuffer.itemSize = 2;
  triangleVertexBuffer.numberOfItems = 3;

  // Vertex Shader
  const vsSource = `
        attribute vec2 coordinates;
        void main(void) {
            gl_Position = vec4(coordinates, 0.0, 1.0);
        }
    `;

  // Fragment Shader
  const fsSource = `
        void main(void) {
            gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0); // Orange color
        }
    `;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "coordinates"
  );
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  // Draw the triangle
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    triangleVertexBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.drawArrays(gl.TRIANGLES, 0, triangleVertexBuffer.numberOfItems);
}

function drawTriangleWithGradient() {
  // Define the triangle's vertices and colors
  const triangleVertices = new Float32Array([
    0.0,
    1.0, // Vertex 1
    -1.0,
    -1.0, // Vertex 2
    1.0,
    -1.0, // Vertex 3
  ]);

  const triangleColors = new Float32Array([
    1.0,
    0.0,
    0.0,
    1.0, // Red
    0.0,
    1.0,
    0.0,
    1.0, // Green
    0.0,
    0.0,
    1.0,
    1.0, // Blue
  ]);

  const triangleVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);

  const triangleColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleColors, gl.STATIC_DRAW);

  // Vertex Shader
  const vsSource = `
        attribute vec2 coordinates;
        attribute vec4 color;
        varying vec4 vColor;
        void main(void) {
            gl_Position = vec4(coordinates, 0.0, 1.0);
            vColor = color;
        }
    `;

  // Fragment Shader
  const fsSource = `
        precision mediump float;
        varying vec4 vColor;
        void main(void) {
            gl_FragColor = vColor;
        }
    `;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  const vertexPosition = gl.getAttribLocation(shaderProgram, "coordinates");
  gl.enableVertexAttribArray(vertexPosition);

  const vertexColor = gl.getAttribLocation(shaderProgram, "color");
  gl.enableVertexAttribArray(vertexColor);

  // Draw the triangle
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
  gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function drawPoints() {
  // Define the points' positions
  const pointVertices = new Float32Array([
    0.0,
    0.8, // Top point
    -0.8,
    -0.4, // Bottom-left point
    0.8,
    -0.4, // Bottom-right point
  ]);

  const pointVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, pointVertices, gl.STATIC_DRAW);

  // Vertex Shader
  const vsSource = `
        attribute vec2 coordinates;
        uniform float uAspectRatio;
        void main(void) {
            gl_Position = vec4(coordinates * vec2(1.0, uAspectRatio), 0.0, 1.0);
            gl_PointSize = 20.0; // Set the point size
        }
    `;

  // Fragment Shader
  const fsSource = `
        precision mediump float;
        void main(void) {
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);  // Blue color for the point
        }
    `;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  const vertexPosition = gl.getAttribLocation(shaderProgram, "coordinates");
  gl.enableVertexAttribArray(vertexPosition);

  // Set the aspect ratio uniform
  const aspectRatioLocation = gl.getUniformLocation(
    shaderProgram,
    "uAspectRatio"
  );
  const canvasAspectRatio = gl.canvas.width / gl.canvas.height;
  gl.uniform1f(aspectRatioLocation, canvasAspectRatio);

  // Draw the points
  gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexBuffer);
  gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.POINTS, 0, 3);
}

function drawPointsWithPointCoord() {
  // Define the points' positions
  const pointVertices = new Float32Array([
    0.0,
    1.0, // Top point
    -0.5,
    -1.0, // Bottom-left point
    0.5,
    -1.0, // Bottom-right point
  ]);

  const pointVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, pointVertices, gl.STATIC_DRAW);

  // Vertex Shader
  const vsSource = `
        attribute vec2 aVertexPosition;
        void main() {
            gl_Position = vec4(aVertexPosition, 0.0, 1.0);
            gl_PointSize = 100.0; 
        }
    `;

  // Fragment Shader
  const fsSource = `
        void main() {
            if (gl_PointCoord.x < 0.25) {
                gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); // Blue
            } else {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red
            }
        }
    `;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  const vertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPosition);

  // Draw the points
  gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexBuffer);
  gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.POINTS, 0, 3);
}
