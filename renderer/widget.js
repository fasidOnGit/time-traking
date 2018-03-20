const {ipcRenderer} = require('electron')
const React = require('react');
const ReactDOM = require('react-dom');

let working = false;

let span = document.getElementById("timer");
ipcRenderer.on("timer-start", (event, args)=>{
    let time=args.timer.hours+":"+args.timer.seconds;
    ReactDOM.render(
       time ,span
    );
    let src;
    working = args.working;
    if(args.working){
        src="../src/img/stop.svg";
    }else{
        src="../src/img/play.svg";
    }
    ReactDOM.render(
        React.createElement(
            "img",
            {src , onClick:onClick}
        )
        ,document.getElementById('play-pause')
    )
});

function onClick(evt){
    working = !working;
    playPause(working);
    ipcRenderer.send("timer-state-change" , {working})
}
// playPause(working);

function playPause(work){
    let img = document.getElementById('play-pause');
    if(work){
        img.src="../src/img/stop.svg"
    }else{
        img.src="../src/img/play.svg"
    }
}



require('../electronStarter');