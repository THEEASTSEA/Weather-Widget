import axios from "axios";

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate()
const nowDay = Number(`${year}${month < 10 ? '0' : ''}${month}${date < 10 ? '0' : ''}${date}`);


function nowTime() {
  let hours = Number(today.getHours())
  if (hours < 10) {
    hours = `0${hours}`
  }
  return (hours - 1) + `00`
}
const nowTimes = nowTime()

export async function requestWeather() {
  try {
    const res = await axios({
      url: `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=GIOewzsyL6c7QAoFJ9C0NRCjCz5AtY51ltorfDz2H2HQNex8OsQVZV98TCCXSJ6zyPDm2UMm3MFNzEeorHNiSg%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${nowDay}&base_time=${nowTimes}&nx=64&ny=127`,
      method: "GET"
    });
    console.log("requestWeather() is finished");
    return res.data.response.body.items.item
  } catch (err) {
    console.log("requestWeather() is failed", err);
  }
}

export async function skyState() {
  try {
    const sky = await axios({
      url: `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=GIOewzsyL6c7QAoFJ9C0NRCjCz5AtY51ltorfDz2H2HQNex8OsQVZV98TCCXSJ6zyPDm2UMm3MFNzEeorHNiSg%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${nowDay}&base_time=${nowTimes}&nx=64&ny=127`,
      method: "GET"
    });
    console.log("requestSky() is finished");
    return sky.data.response.body.items.item[18].fcstValue
  } catch (err) {
    console.log("requestSky() is failed", err);
  }
}

export async function dayMaxMinDegree() {
  try {
    const dayMaxMin = await axios({
      url: `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=GIOewzsyL6c7QAoFJ9C0NRCjCz5AtY51ltorfDz2H2HQNex8OsQVZV98TCCXSJ6zyPDm2UMm3MFNzEeorHNiSg%3D%3D&pageNo=1&numOfRows=400&dataType=JSON&base_date=${nowDay}&base_time=${nowTimes}&nx=64&ny=127`,
      method: "GET"
    });
    return [dayMaxMin.data.response.body.items.item[301].fcstValue, dayMaxMin.data.response.body.items.item[120].fcstValue]
  }
  finally {
    console.log("dayMaxMinDegree() is finished");
  }
}


function changedBackground() {
  const bgState = document.getElementById('sky').textContent
  console.log(bgState)
  const bg = document.querySelector('.wheather .inner')
  console.log(bg)
  switch (bgState) {
    case '🌞':
      bg.style.backgroundImage = "url('https://dispatch.cdnser.be/wp-content/uploads/2018/05/20180518171321_0.jpg')"
      break;
    case '🌤':
      bg.style.backgroundImage = "url('https://img7.yna.co.kr/photo/yna/YH/2019/05/20/PYH2019052008240006000_P4.jpg')"
      break;
    case '🌥':
      bg.style.backgroundImage = "url('https://cphoto.asiae.co.kr/listimglink/1/2018092713102821177_1538021429.jpg')"
      break;
    case '☁️':
      bg.style.backgroundImage = "url('https://mblogthumb-phinf.pstatic.net/MjAxODA2MTlfMjE5/MDAxNTI5MzcwNzU2MDg1.T2dOXEVSiTpTnHR8UCISfbxCSlAmpk-k43Wwdc7gWO0g.gxXf1QQybSePUaDIMQ7qNJPgk4lIrtyIYSwg57VUwhkg.JPEG.yywwdkdk/18-06-11-11-49-22-264_photo.jpg?type=w2')"
      break;
  }
}

async function printWeatherData() {
  const weatherData = await requestWeather()

  const deg = document.getElementById('deg')
  deg.textContent = Math.round(Number(weatherData[3].obsrValue)) + '°'

  const hum = document.getElementById('hum')
  hum.textContent = weatherData[1].obsrValue + '%'

  const wind = document.getElementById('wind')
  const windText = Number(weatherData[7].obsrValue)
  console.log(windText)
  if (windText === 0) {
    wind.textContent = '바람은 불지 않고,'
  } else {
    wind.textContent = `바람은 ${windText}m/s로 불고 있으며,`
  }

  const rain = document.getElementById('rain')
  const rainText = Number(weatherData[2].obsrValue)
  if (rainText === 0) {
    rain.textContent = '비는 오지 않습니다.'
  } else {
    rain.textContent = + `현재 강수량은 ${rainText}mm 입니다.`
  }

  const skystate = await skyState()
  switch (skystate) {
    case '1':
      document.getElementById('sky').textContent = '🌞'
      document.getElementById('skyText').textContent = '맑음'
      break;
    case '2':
      document.getElementById('sky').textContent = '🌤'
      document.getElementById('skyText').textContent = '구름조금'
      break;
    case '3':
      document.getElementById('sky').textContent = '🌥'
      document.getElementById('skyText').textContent = '구름많음'
      break;
    case '4':
      document.getElementById('sky').textContent = '☁️'
      document.getElementById('skyText').textContent = '흐림'
      break;
  }

  await changedBackground()

  const minmax = await dayMaxMinDegree()
  document.getElementById('min').textContent = Math.round(minmax[0])
  document.getElementById('max').textContent = Math.round(minmax[1])


}
printWeatherData()


