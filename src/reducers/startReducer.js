import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function startReducer(state=initialState , action){
    switch (action.type) {
        case types.START_WORKING_SUCCESS:
            return   Object.assign({},...state , {timer:action.timer});
        
        case types.IS_WORKING:
            let newState = JSON.parse(JSON.stringify(state));
            newState.working = action.working;
            console.log(newState)
            return newState;
        case types.LOAD_ALL_TIMER:
            let initState = JSON.parse(JSON.stringify(state));
            initState.start = action.timer.start;
            initState.end = action.timer.end;
            console.log(initialState)
            return initState;
        default:
            return state;
    }
};