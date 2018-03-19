import {combineReducers} from 'redux';
import start from "./startReducer";
import startEnd from "./startEndReducer"
import isWorking from "./isWorkingReducer"


const rootReducer = combineReducers({
    start,
    startEnd,
    isWorking
});

export default rootReducer;