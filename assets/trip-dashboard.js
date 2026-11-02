(()=> {
const $=id=>document.getElementById(id);
const tripStart='2026-11-21',tripEnd='2026-11-28';
const days=[
 {date:'2026-11-21',city:'Helsinki',place:'헬싱키 · 도착 및 시내 일정',title:'헬싱키 도착 · 야간열차 탑승',desc:'공항 도착, 헬싱키 시내 일정 후 19:29 로바니에미행 야간열차 탑승',file:'day1.html',lat:60.1699,lon:24.9384},
 {date:'2026-11-22',city:'Rovaniemi',place:'로바니에미 · 첫날',title:'로바니에미 도착 · 시내 탐방',desc:'07:20 야간열차 도착, Hotel Aakenus 짐 보관 및 시내 일정',file:'day2.html',lat:66.5039,lon:25.7294},
 {date:'2026-11-23',city:'Rovaniemi',place:'로바니에미 · 산타마을',title:'산타클로스 빌리지',desc:'산타마을, 산타 오피스, 우체국과 북극권 체험',file:'day3.html',lat:66.5436,lon:25.8478},
 {date:'2026-11-24',city:'Saariselkä',place:'사리셀카 · 이동 및 오로라',title:'사리셀카 이동 · 오로라 헌팅',desc:'로바니에미에서 사리셀카로 이동, 숙소 체크인 후 첫 오로라 관측 도전',file:'day4.html',lat:68.419,lon:27.412},
 {date:'2026-11-25',city:'Saariselkä',place:'사리셀카 · 허스키 & 오로라',title:'허스키 사파리 · 오로라 투어',desc:'10:25 허스키 픽업, 11:00 사파리 · 20:00 오로라 투어',file:'day5.html',lat:68.419,lon:27.412},
 {date:'2026-11-26',city:'Saariselkä',place:'사리셀카 · 얼음낚시',title:'얼음낚시 · 자유시간',desc:'얼음낚시 체험과 설원 산책, 날씨가 좋으면 오로라 재도전',file:'day6.html',lat:68.419,lon:27.412},
 {date:'2026-11-27',city:'Helsinki',place:'이발로 → 헬싱키 · 항공 이동',title:'AY604 · 헬싱키 복귀',desc:'13:15 이발로 출발, 14:50 헬싱키 도착 후 마지막 시내 일정',file:'day7.html',lat:60.1699,lon:24.9384},
 {date:'2026-11-28',city:'Helsinki',place:'헬싱키 · 귀국',title:'헬싱키 출국 · 인천 귀국',desc:'마지막 점심과 쇼핑 후 17:35 인천행 항공편 탑승',file:'day8.html',lat:60.1699,lon:24.9384}
];
const utc=s=>Date.parse(s+'T00:00:00Z');
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Helsinki',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const fmt=s=>new Intl.DateTimeFormat('ko-KR',{timeZone:'Europe/Helsinki',month:'long',day:'numeric',weekday:'long'}).format(new Date(s+'T12:00:00+02:00'));
const now=today(),delta=Math.floor((utc(now)-utc(tripStart))/86400000);
let selected=days[Math.max(0,Math.min(7,delta))];
const before=now<tripStart,after=now>tripEnd;
if(before) selected=days[0];
const dayNo=before?1:after?8:delta+1;
const weatherDetail=$('td-weather-detail');if(weatherDetail)weatherDetail.href='https://www.windy.com/?'+selected.lat+','+selected.lon+',8';
$('td-date').textContent=fmt(before?tripStart:after?tripEnd:now);
$('td-place').textContent=before?'출발 준비 중 · 첫 목적지 Helsinki':after?'여행 일정 보관 · Finland':selected.place;
$('td-count').textContent=before?'출발 D-'+Math.ceil((utc(tripStart)-utc(now))/86400000):after?'TRIP COMPLETE':'DAY '+dayNo+' / 8';
const dayLabel=$('td-day-label');if(dayLabel)dayLabel.textContent='DAY '+dayNo;

$('td-plan-desc').textContent=before?'여행 시작까지 '+Math.ceil((utc(tripStart)-utc(now))/86400000)+'일 남았어요. 첫날 일정과 예약 정보를 미리 확인하세요.':after?'여행이 끝났어요. 날짜를 기준으로 해당 일정을 다시 확인할 수 있습니다.':selected.desc;
$('td-plan-link').href=selected.file;
$('td-tool-links').innerHTML='<a href="mobility-assistant.html">🚆 이동 도우미</a><a href="travel-assistant.html">🧭 현지 여행 비서</a>';
const auroraDate=delta<3?'2026-11-24':delta>5?'2026-11-26':now;
const auroraCity=before?'헬싱키':after?'헬싱키':selected.city==='Helsinki'?'헬싱키':selected.city==='Rovaniemi'?'로바니에미':'사리셀카';
$('td-aurora-title').textContent=auroraCity+' 오로라 관측 현황';
$('td-aurora-desc').textContent=before?'여행 전 · 헬싱키 기준':after?'여행 종료 · 마지막 일정 지역 기준':'여행 중 · 오늘 일정 지역 기준';
async function weather(lat,lon,date,target){
 const el=$(target);el.textContent='최신 예보 확인 중…';
 const url='https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max,precipitation_sum,wind_speed_10m_max&hourly=cloud_cover,apparent_temperature,precipitation_probability,precipitation&timezone=Europe%2FHelsinki&forecast_days=16';
 try{
  const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('weather unavailable');
  const d=await r.json();const i=d.daily.time.indexOf(date);
  if(i<0){const q=d.current||{};if(Number.isFinite(q.temperature_2m)){const hi=d.hourly.time.findIndex(t=>new Date(t)>=new Date(Date.now()-30*60000));const hp=hi>=0?d.hourly.precipitation_probability?.[hi]:null;return {current:true,temp:Math.round(q.temperature_2m),feels:Number.isFinite(q.apparent_temperature)?Math.round(q.apparent_temperature):null,wind:Math.round(q.wind_speed_10m||0),rain:q.precipitation,prob:hp};}el.textContent='해당 날짜 예보는 출발일이 가까워지면 확인할 수 있어요 (최대 16일 예보)';return null}
  const min=Math.round(d.daily.temperature_2m_min[i]),max=Math.round(d.daily.temperature_2m_max[i]);
  const rain=d.daily.precipitation_probability_max?.[i],amount=d.daily.precipitation_sum?.[i],wind=Math.round(d.daily.wind_speed_10m_max?.[i]||0);
  const h=d.hourly.time.map((t,j)=>({t,v:d.hourly.cloud_cover[j]})).filter(x=>x.t.startsWith(date+'T')&&Number(x.t.slice(11,13))>=20&&Number(x.t.slice(11,13))<=23&&Number.isFinite(x.v));
  const cloud=h.length?Math.round(h.reduce((a,x)=>a+x.v,0)/h.length):null;
  return {min,max,rain,amount,wind,cloud};
 }catch(e){el.textContent='날씨 예보를 불러오지 못했어요. 인터넷 연결 후 다시 확인해 주세요.';return null}
}
async function loadWeather(){
 const w=await weather(selected.lat,selected.lon,before?tripStart:after?tripEnd:now,'td-weather-meta');
 if(w){$('td-weather-label').textContent=(w.current?'현재 날씨 · ':before?'여행 첫날 예보 · ':after?'마지막 날 기록 · ':'오늘의 예보 · ')+selected.city;$('td-temp').textContent=w.current?w.temp+'°':w.min+'° / '+w.max+'°';$('td-weather-icon').textContent='🌡️';$('td-weather-meta').textContent=w.current?'체감 '+(w.feels===null?'—':w.feels+'°')+' · 강수량 '+(w.rain??'—')+'mm · 강수확률 '+(w.prob??'—')+'% · 풍속 '+w.wind+'km/h':'최저 '+w.min+'° · 최고 '+w.max+'° · 예상 강수량 '+(w.amount??'—')+'mm · 강수확률 '+(w.rain??'—')+'% · 최대풍속 '+w.wind+'km/h';}
 const ap=before?{city:'Helsinki',lat:60.1699,lon:24.9384}:selected;
 const el=$('td-cloud');el.textContent=ap.city+' 기준 관측 조건 확인 중…';
 try{
  const u='https://api.open-meteo.com/v1/forecast?latitude='+ap.lat+'&longitude='+ap.lon+'&hourly=cloud_cover&forecast_days=2&timezone=Europe%2FHelsinki';
  const [wr,kr]=await Promise.all([fetch(u,{cache:'no-store'}),fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json',{cache:'no-store'})]);
  if(!wr.ok||!kr.ok)throw Error('aurora');
  const [wd,kd]=await Promise.all([wr.json(),kr.json()]);
  const local=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Helsinki',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
  const part=k=>local.find(x=>x.type===k)?.value;
  const day=part('year')+'-'+part('month')+'-'+part('day');
  let hs=wd.hourly.time.map((t,i)=>({t,v:wd.hourly.cloud_cover[i]})).filter(x=>x.t.startsWith(day+'T')&&Number(x.t.slice(11,13))>=21&&Number(x.t.slice(11,13))<=23);
  if(!hs.length)hs=wd.hourly.time.map((t,i)=>({t,v:wd.hourly.cloud_cover[i]})).filter(x=>Number.isFinite(x.v)).slice(0,3);
  const cloud=hs.length?Math.round(hs.reduce((n,x)=>n+x.v,0)/hs.length):null;
  const rows=kd.slice(1).filter(x=>x[0]&&Number.isFinite(Number(x[1])));
  const nowMs=Date.now();const kpRow=rows.find(x=>new Date(x[0]+'Z').getTime()>=nowMs-3*3600000)||rows[rows.length-1];
  const kp=kpRow?Number(kpRow[1]):null;
  const score=cloud===null?'—':cloud<=30?(kp!==null&&kp>=5?'높음':kp!==null&&kp>=3?'보통':'구름 양호'):cloud<=60?(kp!==null&&kp>=5?'보통':'낮음'):'낮음';
  el.textContent=ap.city+' · 구름량 '+(cloud===null?'—':cloud+'%')+' · KP '+(kp===null?'자료 없음':kp.toFixed(1))+' · 관측 여건 '+score;
 }catch(e){el.textContent=ap.city+' · 구름/KP 정보를 일시적으로 불러오지 못했어요.';}
}
$('td-refresh').addEventListener('click',loadWeather);
loadWeather();
const checks=[...document.querySelectorAll('[data-trip-check]')],key='finland-trip-checklist-v1';
try{const saved=JSON.parse(localStorage.getItem(key)||'{}');checks.forEach(c=>c.checked=!!saved[c.dataset.tripCheck]);}catch(e){}
function progress(){const done=checks.filter(c=>c.checked).length;const el=$('td-check-progress');if(el)el.textContent=done+'/'+checks.length+' 완료';}
checks.forEach(c=>c.addEventListener('change',()=>{const data={};checks.forEach(x=>data[x.dataset.tripCheck]=x.checked);try{localStorage.setItem(key,JSON.stringify(data));}catch(e){}progress();}));
progress();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').then(()=>{$('td-offline').innerHTML='<span class="td-offline-dot"></span><span><b>오프라인 여행 모드 준비 완료</b> · 이 페이지와 일정·숙소·비용 페이지는 방문 후 저장되어 인터넷이 끊겨도 다시 열 수 있습니다. 날씨·오로라 최신 예보는 인터넷이 필요합니다.</span>';}).catch(()=>{$('td-offline').innerHTML='<span class="td-offline-dot"></span><span><b>오프라인 저장 대기</b> · 페이지를 다시 열고 인터넷 연결 상태를 확인해 주세요.</span>';});
})();