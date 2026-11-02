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
$('td-date').textContent=fmt(before?tripStart:after?tripEnd:now);
$('td-place').textContent=before?'출발 준비 중 · 첫 목적지 Helsinki':after?'여행 일정 보관 · Finland':selected.place;
$('td-count').textContent=before?'출발 D-'+Math.ceil((utc(tripStart)-utc(now))/86400000):after?'TRIP COMPLETE':'DAY '+dayNo+' / 8';
$('td-day-label').textContent='DAY '+dayNo;
$('td-plan-title').textContent=before?'출발 준비 · 헬싱키 도착':after?'여행 기록 다시 보기':selected.title;
$('td-plan-desc').textContent=before?'여행 시작까지 '+Math.ceil((utc(tripStart)-utc(now))/86400000)+'일 남았어요. 첫날 일정과 예약 정보를 미리 확인하세요.':after?'여행이 끝났어요. 날짜를 기준으로 해당 일정을 다시 확인할 수 있습니다.':selected.desc;
$('td-plan-link').href=selected.file;
$('td-tool-links').innerHTML='<a href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(selected.city+' Finland')+'" target="_blank" rel="noopener">🗺️ 주변 지도</a><a href="day5.html">🐕 예약·픽업</a><a href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('pharmacy '+selected.city+' Finland')+'" target="_blank" rel="noopener">💊 약국 찾기</a><a href="mobility-assistant.html">🚆 이동 도우미</a><a href="tel:112">🆘 긴급전화 112</a>';
const auroraDate=delta<3?'2026-11-24':delta>5?'2026-11-26':now;
$('td-aurora-title').textContent=before?'11/24–26 사리셀카 관측 준비':'사리셀카 오로라 관측';
$('td-aurora-desc').textContent='관측 가능성은 구름량과 태양활동에 따라 달라집니다. 구름량은 참고 지표이며 오로라 출현을 보장하지 않습니다.';
async function weather(lat,lon,date,target){
 const el=$(target);el.textContent='최신 예보 확인 중…';
 const url='https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&daily=weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max,wind_speed_10m_max&hourly=cloud_cover,apparent_temperature&timezone=Europe%2FHelsinki&forecast_days=16';
 try{
  const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('weather unavailable');
  const d=await r.json();const i=d.daily.time.indexOf(date);
  if(i<0){el.textContent='해당 날짜 예보는 출발일이 가까워지면 확인할 수 있어요 (최대 16일 예보)';return null}
  const min=Math.round(d.daily.temperature_2m_min[i]),max=Math.round(d.daily.temperature_2m_max[i]);
  const rain=d.daily.precipitation_probability_max?.[i],wind=Math.round(d.daily.wind_speed_10m_max?.[i]||0);
  const h=d.hourly.time.map((t,j)=>({t,v:d.hourly.cloud_cover[j]})).filter(x=>x.t.startsWith(date+'T')&&Number(x.t.slice(11,13))>=20&&Number(x.t.slice(11,13))<=23&&Number.isFinite(x.v));
  const cloud=h.length?Math.round(h.reduce((a,x)=>a+x.v,0)/h.length):null;
  return {min,max,rain,wind,cloud};
 }catch(e){el.textContent='날씨 예보를 불러오지 못했어요. 인터넷 연결 후 다시 확인해 주세요.';return null}
}
async function loadWeather(){
 const w=await weather(selected.lat,selected.lon,before?tripStart:after?tripEnd:now,'td-weather-meta');
 if(w){$('td-weather-label').textContent=(before?'여행 첫날 예보 · ':after?'마지막 날 기록 · ':'오늘의 예보 · ')+selected.city;$('td-temp').textContent=w.min+'° / '+w.max+'°';$('td-weather-icon').textContent='🌡️';$('td-weather-meta').textContent='최저 '+w.min+'° · 최고 '+w.max+'° · 강수확률 '+(w.rain??'—')+'% · 최대풍속 '+w.wind+'km/h';}
 const a=await weather(68.419,27.412,auroraDate,'td-cloud');
 if(a){$('td-cloud').textContent='11월 '+Number(auroraDate.slice(8,10))+'일 밤 구름량 '+(a.cloud===null?'정보 없음':a.cloud+'%')+' · 체감온도 '+a.min+'~'+a.max+'°C';}
}
$('td-refresh').addEventListener('click',loadWeather);
loadWeather();
const checks=[...document.querySelectorAll('[data-trip-check]')],key='finland-trip-checklist-v1';
try{const saved=JSON.parse(localStorage.getItem(key)||'{}');checks.forEach(c=>c.checked=!!saved[c.dataset.tripCheck]);}catch(e){}
function progress(){const done=checks.filter(c=>c.checked).length;$('td-check-progress').textContent=done+'/'+checks.length+' 완료';}
checks.forEach(c=>c.addEventListener('change',()=>{const data={};checks.forEach(x=>data[x.dataset.tripCheck]=x.checked);try{localStorage.setItem(key,JSON.stringify(data));}catch(e){}progress();}));
progress();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').then(()=>{$('td-offline').innerHTML='<span class="td-offline-dot"></span><span><b>오프라인 여행 모드 준비 완료</b> · 이 페이지와 일정·숙소·비용 페이지는 방문 후 저장되어 인터넷이 끊겨도 다시 열 수 있습니다. 날씨·오로라 최신 예보는 인터넷이 필요합니다.</span>';}).catch(()=>{$('td-offline').innerHTML='<span class="td-offline-dot"></span><span><b>오프라인 저장 대기</b> · 페이지를 다시 열고 인터넷 연결 상태를 확인해 주세요.</span>';});
})();