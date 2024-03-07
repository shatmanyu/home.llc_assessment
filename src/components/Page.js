import React from 'react'
import Select from 'react-select';
import Battery from '../assets/Battery.svg';
import Cellular from '../assets/Cellular Connection.svg';
import Wifi from '../assets/Wifi.svg'
import Bitmap from '../assets/bit-title.svg'
import Wall from '../assets/bit_png.png'
import { useState,useEffect,useRef } from 'react';
import { Chart as ChartJS,LineElement,CategoryScale,LinearScale,PointElement,Legend, Tooltip  } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Legend,
    Tooltip
)

export default function () {
    const [time,setTime] = useState(new Date()) 
    const timeRef = useRef(new Date());
    const [data,setData] = useState(null)
    const arr1 = [31,29,31,30,31,30,31,31,30,31,30,31]
    const [err,setErr] = useState(null)
    const [wall,setWall] = useState(false)
    const monthData = [{value:0,label:'Jan'},{value:1,label:'Feb'},{value:2,label:'Mar'},{value:3,label:'Apr'},{value:4,label:'May'},{value:5,label:'Jun'},{value:6,label:'Jul'},
    {value:7,label:'Aug'},{value:8,label:'Sep'},{value:9,label:'Oct'},{value:10,label:'Nov'},{value:11,label:'Dec'}]
    const iconArr = [<i class="bi bi-clouds"></i>,<i class="bi bi-brightness-high-fill"></i>,<i class="bi bi-cloud-rain-heavy-fill"></i>,<i class="bi bi-cloud-sun-fill"></i>,<i class="bi bi-cloud-hail-fill"></i>]
    const [selectedValue, setSelectedValue] = useState(monthData[time.getMonth()]);
    async function updateData(){
        try {
            const res = await axios.get("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=America%2FNew_York")
            setData(res.data)
            updateChart(selectedValue)
        } catch (error) {
            setErr(error)
        }finally{
            // if loader to be added
        }
    }

  useEffect(()=>{
    const updateTime = setInterval(()=>{
        timeRef.current = new Date()
    },1000)
    updateData()
    return ()=>{
        clearInterval(updateTime)
    }
  },[selectedValue])
 

  const getLabels = (num) => {
    console.log({num})
    const labelArr = []
    for(let i = 0;i < num;i++){
        labelArr.push(i+1)
    }
    return labelArr
  }
  const chartData = {
    labels:getLabels(arr1[selectedValue.value]) ? getLabels(arr1[selectedValue.value]) : [],
    datasets:[
        {
            label:'Temperature',
            data:data?.hourly?.temperature_2m?.slice(0,arr1[selectedValue.value]),
            backgroundColor:'#FF8900',
            borderColor: 'black',
            pointRadius:5,
            pointHoverRadius: 12,
            tension:0.5
        }
    ]
  }
  const options = {
    responsive: true,
    plugins:{
        legend:false
    },
    scales:{
        y:{
            min:-2,
            max:13,
            ticks: {
                stepSize: 1.5,
              }
        }
    },   
  }
  const updateChart = (event) => {
    const newData = chartData
    newData.labels = getLabels(arr1[event.value]) ? getLabels(arr1[event.value]) : []
    newData.datasets[0].data = data?.hourly?.temperature_2m?.slice(event.value,event.value + arr1[selectedValue.value])
    // setChartData(newData)
  }
  const handleChange = (event) => {
    setSelectedValue(event)
  };
  useEffect(()=>{
    if(data){
        updateChart(selectedValue)
    }
  },[data])
  console.log({data},{chartData})
  return (
 <>
 {wall ? <div className='container-fluid' style={{width:`${wall ? '100%' : ''}`,
    height:`${wall ? '150vh' : ''}`,
    backgroundSize:`${wall ? 'cover' : ''}`,
    backgroundPosition:`${wall ? 'center' : ''}`,
    backgroundRepeat:`${wall ? 'no-repeat' : ''}`,
    backgroundImage:`${wall ? `url(${Wall})` : null}`}}>
        <div class="status container text-center d-flex" style={{justifyContent:"space-between",padding:'1.5%'}}>
            <div class="status-col" style={{fontFamily:'abhiya libre' ,color:`${wall ? 'white' : ''}`}}>
                {timeRef.current.getHours()}:{timeRef.current.getMinutes() < 9 ? "0" + timeRef.current.getMinutes() :timeRef.current.getMinutes()}
            </div>
        <div class="status-col d-flex" style={{gap:'10px'}}>
            {wall ? <>
                <i style={{color:'white'}} class="bi bi-reception-4"></i>
                <i style={{color:'white'}} class="bi bi-wifi"></i>
                <i style={{color:'white'}} class="bi bi-battery-full"></i>
            </> : <>
            <img src={Cellular} class="img-fluid" alt="alt"/>
            <img src={Wifi} class="img-fluid" alt="alt"/>
            <img src={Battery} class="img-fluid" alt="alt"/>
            </>}
        </div>
        </div>
        {wall && 
      <div className='container-fluid close-bar d-flex' style={{placeContent:'center',justifyContent:'space-between',padding:'25px 12%',cursor:'pointer'}}>
        <i class="bi bi-x-lg" style={{color:'white'}}onClick={()=>{setWall(prev=>!prev)}}></i>
        <button style={{backgroundColor:'#FF2D55',border:'none',width:'53px'}} class="btn btn-primary btn-sm" type="submit">Live</button>
        </div>}
        <br /><br /><br />
        <div style={{}}>
        <span style={{color:'white',fontSize:'30px',fontFamily:'abhiya',padding:'2%'}}>{data?.timezone}</span>
        <br /><br /><br />
        <span style={{color:'white',fontSize:'30px',fontFamily:'abhiya',padding:'2%'}}>New York,United States</span>
        </div>
        </div> : <>
        <div className='container-fluid'>
        <div class="status container text-center d-flex" style={{justifyContent:"space-between",padding:'1.5%'}}>
            <div class="status-col" style={{fontFamily:'abhiya libre' ,color:`${wall ? 'white' : ''}`}}>
                {timeRef.current.getHours()}:{timeRef.current.getMinutes() < 9 ? "0" + timeRef.current.getMinutes() :timeRef.current.getMinutes()}
            </div>
        <div class="status-col d-flex" style={{gap:'10px'}}>
            {wall ? <>
                <i style={{color:'white'}} class="bi bi-reception-4"></i>
                <i style={{color:'white'}} class="bi bi-wifi"></i>
                <i style={{color:'white'}} class="bi bi-battery-full"></i>
            </> : <>
            <img src={Cellular} class="img-fluid" alt="alt"/>
            <img src={Wifi} class="img-fluid" alt="alt"/>
            <img src={Battery} class="img-fluid" alt="alt"/>
            </>}
        </div>
        </div>
        {wall && 
      <div className='container-fluid close-bar d-flex' style={{placeContent:'center',justifyContent:'space-between',padding:'25px 12%',cursor:'pointer'}}>
        <i class="bi bi-x-lg" style={{color:'white'}}onClick={()=>{setWall(prev=>!prev)}}></i>
        <button style={{backgroundColor:'#FF2D55',border:'none',width:'53px'}} class="btn btn-primary btn-sm" type="submit">Live</button>
        </div>}
        </div>
        </>}


        {!wall && (
        <>
        <div className="d-flex container-fluid controls" style={{justifyContent:"space-between",padding:'3% 3.5%'}}>
            <span><i class="bi bi-list"></i></span>
            <span style={{marginRight:'2%'}}><i class="bi bi-search"></i></span>
        </div>

        <div className="container-fluid title-section d-flex" style={{justifyContent:"space-between",alignItems:"center",padding:'2.5%'}}>

            <div className="location">
                <h3>New York,United States</h3>
                <span>{monthData[timeRef.current.getMonth()]?.label} {timeRef.current.getDay() < 9 ? '0' + timeRef.current.getDay() : timeRef.current.getDay()},{timeRef.current.getFullYear()}</span>
                <span style={{color:'#057BFF',padding:'15px'}}>{iconArr[0]} Cloudy</span>
            </div>
            <div className="title-img" style={{position:'relative',marginRight:'2%'}}>
            <img src={Bitmap} class="img-fluid" alt="alt"/>
            <button style={{backgroundColor:'#FF2D55',position:'absolute',border:'none',zIndex:'5',top:'60%',right:'6%'}} class="btn btn-primary btn-sm" type="submit" onClick={()=>{setWall(prev=>!prev)}}>Live</button>
            </div>
        </div>

        <div className="container-fluid d-flex temp" style={{backgroundColor:"#003339",borderRadius:'20px',justifyContent:'space-between',alignItems:'center',width:'94%',padding:'1% 5%',margin:'2% 2%'}}>
            {data?.hourly.temperature_2m.slice(0,5)?.map((ele,index)=> {
                return (
                <div key={index} className='item' style={{display:'flex',flexDirection:'column',height:'80px',width:'50px',alignContent:'center',justifyContent:'center'}}>
                    <span className='item-time' style={{color:'white',fontFamily:'abhaya Libre',textAlign:'center'}}>
                        {data?.hourly.time[index]?.slice(11)}
                    </span>
                    <span style={{color:'white',textAlign:'center'}}>
                        {iconArr[index]}
                    </span>
                    <span style={{color:'white',fontFamily:'abhaya Libre',textAlign:'center'}}>
                        {data.hourly.temperature_2m[index]}
                    </span>
                    
                     
                </div>
                )
            })}
        </div>

        <div className='add-info' style={{padding:'1.5%'}}>
            
            <div class="container-fluid text-center" style={{backgroundColor:''}}>
                <h3 style={{fontFamily:'abhaya Libre',marginBottom:'21px',textAlign:'left'}}>Additonal Info</h3>
            <div class="row align-items-start" style={{paddingBottom:'35px'}}>
                <div style={{fontFamily:'abhaya Libre',flexDirection:'column',display:'flex',gap:'8px'}} class="col">
                    <span style={{color:'#96969A',textAlign:'left'}}>Precipitation</span>
                    <span style={{textAlign:'left',color:'#003339'}}>{data?.hourly.temperature_2m[4]}%</span>
                </div>
                <div class="col" style={{fontFamily:'abhaya Libre',flexDirection:'column',display:'flex',gap:'8px'}}>
                    <span style={{color:'#96969A',textAlign:'center'}}>Humidity</span>
                    <span style={{textAlign:'center',color:'#003339'}}>{data?.hourly.relative_humidity_2m[5]}%</span>
                </div>
                <div class="col" style={{fontFamily:'abhaya Libre',flexDirection:'column',display:'flex',gap:'8px'}}>
                    <span style={{color:'#96969A'}}>Windy</span>
                    <span style={{textAlign:'center',color:'#003339'}}>{data?.hourly.wind_speed_10m[1]}km/h</span>
                </div>
            </div>
            </div>
        </div>
        <div style={{backgroundColor:'#CCCCCC',height:'1px',margin:'0px 2.5%'}}></div>

        <div className="temp-chart" style={{padding:'4%',fontFamily:'abhiya libre'}}>
            <div className='line-chart-box container-fluid d-flex' style={{alignItems:'center',justifyContent:'space-between'}} >
            <span style={{color:'#003339',fontFamily:'abhiya',fontSize:'50px',padding:'0px 5%'}}>Temperature</span>
            <Select
                options={monthData}
                value={selectedValue}
                onChange={handleChange}
                value={selectedValue}
                isSearchable={false}
                components={{
                    IndicatorSeparator:null
                }}
                styles={{
                    container:(base)=>({
                        ...base,
                        padding:'0px 4%'
                    }),
                    control:(base)=>({
                        ...base,
                        width:200,
                        borderColor:'#003339',
                        boxShadow:'none',
                        padding:'0px 10px',
                        ':hover':{
                            borderColor:'#003339'
                        }
                    })
                }}
            />
            </div>
              {console.log(chartData.datasets)}
            {
            <Line
                data = {chartData}
                options = {options}
            ></Line>}

        </div>

        </>)}
    </>
    
  )
}
