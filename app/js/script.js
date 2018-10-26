//Initialize the DroneDeploy API
const dronedeploy = new DroneDeploy({version: 1});

// Name of the function to call. Name should be the same set in serverless.yml
const FUNCTION_NAME = "volume-viz";

/* ****************************************************************************
    Random auth token stuff for postman
   **************************************************************************** */
async function callFunction() {
  const api = await dronedeploy;
  // Grabs the URL of the function to call by name of function
  const functionUrl = await api.Functions.getUrl(FUNCTION_NAME);

  // Get a token to ensure auth when calling your function
  const token = await api.Authorization.getScopedToken();
  // console.log('token', `Bearer ${token}`);
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  // console.log('request url', `${functionUrl}/${curAnnId}`);
  // return await fetch(`${functionUrl}/${curAnnId}`, options);
  const resCut = await fetch(`${functionUrl}/${curAnnId}-cut`, options);
  const resFill = await fetch(`${functionUrl}/${curAnnId}-fill`, options);
  await bakeRESTresult(resCut);
  await bakeRESTresult(resFill);
  init();
  animate();
  return ;  // this is hard coded for now since this is the only valid data in the database currently
}

async function bakeRESTresult(res){
  const rawRes = await res.text();
  const { result: { data: { cut_type, gltf, annotation_id } } } = JSON.parse(rawRes);
  console.log('cut_type', cut_type);
  console.log('annotation_id', annotation_id);
  if (annotation_id){
    window.resultCut = `models/${annotation_id}cut.gltf`;
    window.resultFill = `models/${annotation_id}fill.gltf`;
    console.log('gltf', window.resultCut );
    console.log('gltf', window.resultFill);
    return annotation_id;

  }
}

/* ****************************************************************************
    Logic for subscribe to annotations
   **************************************************************************** */
async function getCurrentActiveAnnInfo(annotationId, planID) {
  const api = await dronedeploy;
  const curPlanAnnotations = await api.Annotations.get(planID);
  let annotation = null;
  for (let i = 0; i < curPlanAnnotations.length; i++) {
    if (curPlanAnnotations[i].id === annotationId) {
      annotation = curPlanAnnotations[i];
    }
  }
  console.log('cur ann', annotation);
  return annotation;
}

async function checkCurAnnTypeIsVolume () {
  const curAnn = await getCurrentActiveAnnInfo(curAnnId, curPlanId);
  console.log('isVolumeType', curAnn.annotationType === "VOLUME");
  return curAnn.annotationType === "VOLUME";
}

async function eventHandler(annotationId) {
  console.log('annotationId', annotationId);
  if (annotationId && annotationId !== curAnnId) {
    curAnnId = annotationId;
    console.log('curAnn', curAnnId)
    const isValidRequestCandidate = await isQualified();
    console.log('isValidRequestCandidate', isValidRequestCandidate)
    if (isValidRequestCandidate) {
      const res = await callFunction();
      console.log('got responses, rendering model');
      // if(cut_type)
      // window.resultCut = gltf;
      // window.resultFill = gltf
      // console.log('result', cut_type);
      // console.log('result', annotation_id);
    }
  }
}

async function onAppInit() {
  const api = await dronedeploy;
  const curPlan = await api.Plans.getCurrentlyViewed();
  curPlanId = curPlan.id;
  return api.Annotations.getCurrentlyViewed().subscribe((annotationId) => eventHandler(annotationId));
}

onAppInit();
let curAnnId = '';
let curPlanId = '';
window.resultCut = '';
window.resultFill = '';
window.viewWrapper = document.getElementById('view-wrapper');
async function isQualified () {
  const isVolume = await checkCurAnnTypeIsVolume();
  return isVolume;
  // const toggleIsOn = toggle.value;
  // return isVolume && toggleIsOn;
}

/* ****************************************************************************
    Toggle control section
   **************************************************************************** */
const toggle = document.querySelector('dd-toggle');
const planRow = document.querySelector('.plan-hidden-rows');
const toggleControls = function (on) {
  if (on) {
    planRow.style.display = 'block';
  } else {
    planRow.style.display = 'none';
  }
}
toggle.addEventListener('change', function (e) {
  toggleControls(e.target.value);
});

/* ****************************************************************************
    Expandable Section
   **************************************************************************** */

var isExpanded = false;
var upArrow = 'https://s3.amazonaws.com/drone-deploy-plugins/templates/login-example-imgs/arrow-up.svg';
var downArrow = 'https://s3.amazonaws.com/drone-deploy-plugins/templates/login-example-imgs/arrow-down.svg';
var expandArrow = document.querySelector('.expand-arrow');
var expandBody = document.querySelector('.expand-section');
var expandRow = document.querySelector('.expand-row');

expandRow.addEventListener('click', function () {
  isExpanded = !isExpanded
  if (isExpanded) {
    expandArrow.src = upArrow;
    expandBody.style.display = 'block';
  } else {
    expandArrow.src = downArrow;
    expandBody.style.display = 'none';
  }
});
