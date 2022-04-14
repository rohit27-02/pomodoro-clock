import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react'

function Length({title,changeTime,type,time,formatTime}){
  return (
    <div className=' p-2 rounded text-center text-warning' >
      <h3>{title}</h3>
      <div className='d-flex '>
        <button className='btn btn-outline-dark m-1 bg-danger' onClick={()=>changeTime(-60,type)}>
        <i class="bi bi-arrow-down"></i> </button>
        <h3>{formatTime(time)}</h3>
        <button className='btn btn-outline-dark m-1 bg-success' onClick={()=>changeTime(+60,type)}>
        <i class="bi bi-arrow-up"></i>
        </button>
      </div>
    </div>
  )
}
function App() {
  const [displayTime,setDisplayTime]=React.useState(25*60);
  const [breakTime,setBreakTime]=React.useState(5*60);
  const [sessionTime,setSessionTime]=React.useState(25*60);
  const [timerOn,setTimerOn]=React.useState(false);
  const [onBreak,setOnBreak]=React.useState(false);
  const [breakAudio,setBreakAudio]=React.useState(new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"));
  const formatTime=(time)=>{
    let minutes=Math.floor(time/60);
    let seconds=time%60;
    return (
      (minutes<10?"0"+minutes:minutes)+":"+
      (seconds<10?"0"+seconds:seconds)
    );
  };
  const changeTime=(amount,type)=>{
    if(type=="break"){
      if(breakTime<=60 && amount< 0){
        return;
      }
      setBreakTime(prev=>prev+amount);
    }
    else{
      if(sessionTime<=60 && amount< 0){
        return;
      }
      setSessionTime(prev=>prev+amount);
      if(!timerOn){
        setDisplayTime(sessionTime+amount);
      }
    }

  };
  const playBreakSound=()=>{
    breakAudio.currentTime=0;
    breakAudio.play();
  };
  const controlTime=()=>{
    let second=1000;
    let date=new Date().getTime();
    let nextDate=new Date().getTime() + second;
    
    if(!timerOn){
      let interval = setInterval(()=>{
        date=new Date().getTime();
        if(date>nextDate){
          setDisplayTime((prev)=> {
            if(prev<=0 && onBreak){
              playBreakSound();
              setOnBreak(false);
             
              console.log(onBreak);
              return sessionTime;
            }
           if(prev <= 0 && !onBreak){
              playBreakSound();
              setOnBreak(true);
              
              console.log(onBreak);
              return breakTime;
            }
            
            
            return prev-1;
           
            }
          );
          nextDate += second;
        }
      },30);
      localStorage.clear();
      localStorage.setItem("id",interval);
    }
    if(timerOn){
      clearInterval(localStorage.getItem("id"));  
    }
    setTimerOn(!timerOn);
  };
  const resetTime=()=>{
    setBreakTime(5*60);
    setDisplayTime(25*60);
    setSessionTime(25*60);
  };
  return (
    <div className=" position-absolute top-50 start-50 translate-middle">
      <h3 className='text-center fw-bold'>{onBreak?"BREAK":"SESSION"}</h3>
      <div className='d-flex vw-100 justify-content-evenly'>
      <Length title={"break length"} changeTime={changeTime} type={"break"} time={breakTime} formatTime={formatTime}/>
      <Length title={"session length"} changeTime={changeTime} type={"session"} time={sessionTime} formatTime={formatTime}/> 
      </div>
      
      <h1 className='text-center fw-bold font-monospace '>{formatTime(displayTime)}</h1>
      <div className='d-flex position-absolute bottom-10 start-50 translate-middle-x my-2'>
      <button onClick={controlTime} className='btn  btn-outline-warning px-4 mx-4'>
        {
          timerOn?(<i class="bi bi-pause-fill"></i>):(<i class="bi bi-play-fill"></i>)
        }
      </button>
      <button onClick={resetTime} className='btn  btn-outline-warning px-4 mx-4 '>
      <i class="bi bi-arrow-repeat"></i>
      </button>
      </div>
    </div>
  
  );
}

export default App;
