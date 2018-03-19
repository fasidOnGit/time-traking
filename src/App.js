import React, { Component } from 'react';
import logo from './img/logo.png';
import play from './img/play.svg';
import stop from './img/stop.svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as startActions  from './actions/startWorkingActions';
import * as startEndActions from './actions/startEndWorkAction';
import timer from './timer';
import './App.css';

//workaround for accessing Electron modules;
const electron = window.require('electron');
const ipc = electron.ipcRenderer;

class App extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {
      timer : {
        hours: '00',
        minutes: '00',
        seconds: '00'
      },
      working:false,
      start:'',
      end:''
    }
    this.startWorking = this.startWorking.bind(this);
    this.stopWorking = this.stopWorking.bind(this);
    this.onClick = this.onClick.bind(this);
    this.isWorking = this.isWorking.bind(this);
    this.timer = this.timer;
  }

  timer = '';
  onClick(){
    this.isWorking();
    let state = JSON.parse(JSON.stringify(this.state));
    state.start = (state.start)? state.start : moment();
    state.working = true;
    this.setState(state , ()=>{
      this.props.seActions.startWork(this.state.start);
      this.props.actions.isWorking(this.state.working)
      console.log(this.props)
    });
    this.startWorking();
  }
  isWorking(){
    const newState = toggleWorking(this.state);
    console.log(newState)
    this.setState({working: true});
  }
  startWorking(){
    this.timer = setInterval(()=>{
      let track = Object.assign({}, this.state.timer); 
      const timerState =  timer(track.hours, track.minutes, track.seconds);
      // ipc.send('timer' , () => timerState);
      let state = {
        hours: Dec2Converter(timerState.hours),
        minutes: Dec2Converter(timerState.minutes),
        seconds: Dec2Converter(timerState.seconds)
      }
      this.setState({timer: state,
        working:true});
      this.props.actions.startWorking(this.state.timer);
    },1000)
  }
  stopWorking(){
    clearInterval(this.timer);
    this.setState({
      working : false,
      end:moment()
    }, _=>{
      this.props.seActions.endWork(this.state.end);
      this.props.actions.isWorking(this.state.working)
    });
    console.log(this.props)
  }
  componentDidMount(){
    this.props.actions.loadTimer();
    ipc.send('countdown-start');
  }
  componentWillUnmount(){
    console.log('unmounted')
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img className="App-logo" src={logo} alt="Time Doctor Logo"/>
          <label> Time Doctor</label>
        </header>
        <main className="App-main">
          <h1>
            <time><label>{this.props.timer.hours}</label>:<label>{this.props.timer.minutes}</label>:<label>{this.props.timer.seconds}</label></time> 
            {!this.state.working && <img src={play} alt="Start Working" onClick={this.onClick}/>}
            {this.state.working && <img src={stop} alt="Stop Working" onClick={this.stopWorking}/>}
          </h1>
        </main>
      </div>
    );
  }
}

function toggleWorking(state){
  let newState = JSON.parse(JSON.stringify(state));
  newState.working = !state.working;
  return newState;
}

function mapStateToProps(state, ownProps){
  console.log(state)
  return Object.assign({}, state.start , state.startEnd , state.isWorking);
}
function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(startActions, dispatch),
    seActions:bindActionCreators(startEndActions,dispatch)
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(App);

function Dec2Converter(time){
  let timer  = time.toString();
  return (timer.length !== 2) ? `0${timer}` : timer.toString();
}