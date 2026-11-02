(()=>{
  // 상세 DAY 페이지의 hero를 메인 일정 카드에 동기화한다.
  // 상세 페이지의 제목/요약만 바꾸면 메인 화면도 다음 방문 때 자동 갱신된다.
  const cards=[...document.querySelectorAll('.section .grid .day')];
  cards.forEach(async card=>{
    const link=card.querySelector('a[href^="day"]');
    if(!link)return;
    try{
      const response=await fetch(link.getAttribute('href'),{cache:'no-store'});
      if(!response.ok)throw new Error('상세 일정 로드 실패');
      const html=await response.text();
      const doc=new DOMParser().parseFromString(html,'text/html');
      const hero=doc.querySelector('.hero');
      if(!hero)return;
      const title=hero.querySelector('h1');
      const paragraphs=[...hero.querySelectorAll('p')];
      const summary=paragraphs.length>1?paragraphs[1]:paragraphs[0];
      const heading=card.querySelector('h3');
      const route=card.querySelector('.route');
      if(title&&heading)heading.textContent=title.textContent.trim();
      if(summary&&route)route.textContent=summary.textContent.trim();
      card.dataset.syncedFrom=link.getAttribute('href');
    }catch(error){
      // 네트워크가 끊긴 경우 기존 메인 일정 문구를 그대로 사용한다.
      console.info('일정 동기화 보류:',link.getAttribute('href'));
    }
  });
})();
