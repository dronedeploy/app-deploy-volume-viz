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
  console.log('token', `Bearer ${token}`);
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  // console.log('request url', `${functionUrl}/${curAnnId}`);
  // return await fetch(`${functionUrl}/${curAnnId}`, options);
  return await fetch(`${functionUrl}/5bd21859b3f8e5000184e126`, options);

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
      const result = await res.text();
      const { result: { data: { cut_type, gltf, path_to_gif, annotation_id}}}  = JSON.parse(result);
      console.log('result', cut_type);
      console.log('result', path_to_gif);
      console.log('result', annotation_id);
    }
  }
}

async function onAppInit() {
  const api = await dronedeploy;
  const curPlan = await api.Plans.getCurrentlyViewed();
  curPlanId = curPlan.id;
  return api.Annotations.getCurrentlyViewed().subscribe((annotationId) => eventHandler(annotationId));
}
function putRequest () {
  console.log('sending Get request');
}

onAppInit();
let curAnnId = '';
let curPlanId = '';

async function isQualified () {
  const isVolume = await checkCurAnnTypeIsVolume();
  const toggleIsOn = toggle.value;
  // const hasStaticAssets = hmmm
  return isVolume && toggleIsOn;
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
