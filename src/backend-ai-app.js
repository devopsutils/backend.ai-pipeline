export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.

  if (['/summary', '/job', '/experiment', '/data'].includes(path) != true) { // Fallback for Electron Shell/Windows OS
    path = path.split(/[\/]+/).pop();
  }
  if (path === 'index.html' || path === '') {
    path = '/';
  }
  let page;
  if (path === '/') {
    page = 'summary';
  } else if (path[0] === '/') {
    page = path.slice(1);
  } else {
    page = path;
  }
  //const page = path === '/' ? 'summary' : path.slice(1);
  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));

  // Close the drawer - in case the *path* change came from a link in the drawer.
  dispatch(updateDrawerState(false));
};

const loadPage = (page) => (dispatch) => {
  let view = page;
  console.log("Navigating page:", page);
  switch (page) {
    case 'summary':
      import('./components/backend-ai-summary-view.js').then((module) => {
        // TODO: after page changing?
      });
      break;
    case 'job':
      import('./components/backend-ai-session-view.js');
      break;
    case 'experiment':
      import('./components/backend-ai-experiment-view.js');
      break;
    case 'data':
      import('./components/backend-ai-data-view.js');
      break;
    default:
      import('./components/backend-ai-summary-view.js').then((module) => {
      });
      break;
  }

  dispatch(updatePage(page));
};

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
};

let offlineTimer;

export const showOffline = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  window.clearTimeout(offlineTimer);
  offlineTimer = window.setTimeout(() =>
    dispatch({type: CLOSE_SNACKBAR}), 3000);
};

export const updateOffline = (offline) => (dispatch, getState) => {
  // Show the snackbar only if offline status changes.
  if (offline !== getState().app.offline) {
    dispatch(showOffline());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const updateDrawerState = (opened) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  };
};
