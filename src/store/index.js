import createSagaMiddleware from "redux-saga";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import rootSaga from "../sagas/index";
import createRootReducer from "../reducers";

const createBrowserHistory = require("history").createBrowserHistory;

export const history = (() => {
  let historyTemp = createBrowserHistory();
  historyTemp.pathHistory = [historyTemp.location.pathname];
  const oldPush = historyTemp.push
  historyTemp.push = function (...args) {
    historyTemp.pathHistory.unshift(args[0])
    historyTemp.pathHistory.splice(100)
    oldPush.apply(this, args)
  }
  const oldReplace = historyTemp.replace
  historyTemp.replace = function (...args) {
    historyTemp.pathHistory[0] = args[0]
    oldReplace.apply(this, args)
  }
  return historyTemp
})();

const routeMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware, routeMiddleware];

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        ...middlewares
      )
    )
  );

  sagaMiddleware.run(rootSaga);
  return store;
}
