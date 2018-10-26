if ( WEBGL.isWebGLAvailable() === false ) {
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
let container, controls;
let camera, center, scene, renderer, light;
init();
animate();

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 10, -70, 180 );
  controls = new THREE.OrbitControls( camera );
  controls.target.set( 0, -0.2, -0.2 );
  controls.update();

  // let boundingBox = new THREE.Box3();

  // background

  scene = new THREE.Scene();
  scene.background = new THREE.Color('antiquewhite');
  light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
  light.position.set( 0, 1, 0 );
  scene.add( light );

  // model
  const loader = new THREE.GLTFLoader();
  loader.load( 'models/cut1.gltf', function ( gltf ) {
    // boundingBox.setFromObject( gltf );
    // center = boundingBox.getCenter();

    // // set camera to rotate around center of object
    // controls.target = center;

    // controls.target.set( 0, -0.2, -0.2 );
    // controls.update();

    scene.add( gltf.scene );
  }, undefined, function ( e ) {
    console.error( e );
  } );

  loader.load( 'models/fill1.gltf', function ( gltf ) {

    scene.add( gltf.scene );
  }, undefined, function ( e ) {
    console.error( e );
  } );
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.gammaOutput = true;
  container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
}

//helper to define axes
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

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
