//Initialize the DroneDeploy API
const dronedeploy = new DroneDeploy({version: 1});

// Name of the function to call. Name should be the same set in serverless.yml
const FUNCTION_NAME = "volume-viz";


/**
 * Actions to take when a user expands the app
 * 1. Show the loading page
 * 2. Query DroneDeploy Datastore for the stored URL
 * 3. Handle UI depending on response code
 */
/**
 * Generic function for calling out to Function
 */

async function callFunction() {
  const api = await dronedeploy;

  // Grabs the URL of the function to call by name of function
  const functionUrl = await api.Functions.getUrl(FUNCTION_NAME);

  // Get a token to ensure auth when calling your function
  const token = await api.Authorization.getScopedToken();
  console.log('token', `Bearer ${token}`);
  // options = {
  //   method: "POST",
  //   body: JSON.stringify({ data: "hello world" }),
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   }
  // }
  // return fetch(`${functionUrl}`, options);
}
async function onExpand() {
  console.log('working');
  // callFunction();

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
