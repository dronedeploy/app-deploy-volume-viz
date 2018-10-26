if ( WEBGL.isWebGLAvailable() === false ) {
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
let container, controls, tempNode;
let boundingBox, camera, center, scene, renderer, light, modelCluster;
init();
animate();

function init() {
  tempNode = document.getElementById('temp-view');
  if (tempNode) window.viewWrapper.removeChild(tempNode);
  container = document.createElement( 'div' );
  container.id = 'temp-view';
  console.log('the viewWrapper div', window.viewWrapper);
  console.log('the viewWrapper div', window.viewWrapper.hasChildNodes());
  window.viewWrapper.appendChild( container );
  camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set( 10, -70, 180 );
  controls = new THREE.OrbitControls( camera );
  // controls.target.set( 0, -0.2, -0.2 );
  // controls.update();

  // background

  scene = new THREE.Scene();
  scene.background = new THREE.Color('antiquewhite');
  light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
  light.position.set( 0, 1, 0 );
  scene.add( light );

  // models
  modelCluster = new THREE.Group();

  const loader = new THREE.GLTFLoader();
  const defaultCut = `models/5b2062c65f810c00019a7f74cut.gltf`;
  const defaultFill = 'models/5b2062c65f810c00019a7f74fill.gltf';
  const actualCut = window.resultCut || defaultCut;
  const actualFill = window.resultFill || defaultFill;
  loader.load(actualCut, function ( gltf ) {
    // boundingBox = new THREE.Box3();
    // boundingBox.setFromObject( modelCluster );
    // center = boundingBox.getCenter();

    // console.log('What is at the center', center)

    modelCluster.add( gltf.scene );
    scene.add( gltf.scene );
  }, undefined, function ( e ) {
    console.error( e );
  } );

  loader.load(actualFill, function ( gltf ) {
    modelCluster.add( gltf.scene );
    scene.add( gltf.scene );
  }, undefined, function ( e ) {
    console.error( e );
  } );

  // setting center from the object

  // boundingBox = new THREE.Box3();
  // boundingBox.setFromObject( modelCluster );
  // center = boundingBox.getCenter();

  // console.log('What is at the center', center)
  // TODO: set camera to rotate around center of object
  controls.target.set(0, 0, 0);
  controls.update();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.gammaOutput = true;
  container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
