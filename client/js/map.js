let markers;

const updateMarkers = (markers, result) => {
  markers.forEach((marker) => {
    const content = marker.getContent();
    const parser = new DOMParser();
    const dom = parser.parseFromString(content, 'text/html');
    const dongTitleEl = dom.querySelector('.dong-title');
    const dongCountEl = dom.querySelector('.dong-count');
    const dong = result[dongTitleEl.innerText];
    const count = dong !== undefined && dong !== 0 ? dong + '호' : '';
    dongCountEl.innerText = count;
    const newContent = dom.documentElement.innerHTML;
    marker.setContent(newContent);
  });
  drawNoCount();
};

const addPredictionMonthBtnClickEventListener = () => {
  const predictionMonthBtns = document.querySelectorAll(
    '[id*="predictionMonthBtn"]',
  );
  predictionMonthBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // 클릭한 버튼의 id에서 월 값을 추출하여 months 배열에 추가
      const month = btn.id.split('-')[1];
      const data = {
        location: '진주시',
        charterRent: '전월세',
        months: [parseInt(month)],
      };
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `/dong`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 201) {
            // 응답 처리 로직
            const result = JSON.parse(xhr.responseText);
            updateMarkers(markers, result.result);
          } else {
            console.log('요청 실패');
          }
        }
      };
    });
  });
};

const addDongBtnClickEventListener = () => {
  const dongBtns = document.querySelectorAll('.dong-box');
  dongBtns.forEach((btn) => {
    btn.addEventListener('click', getPredictionData);
  });
};

const drawNoCount = () => {
  const dongCounts = document.querySelectorAll('.dong-count');
  dongCounts.forEach((count) => {
    if (!count.textContent.trim()) {
      count.closest('.dong-box').classList.add('no-count');
    }
  });
};

var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(35.1759, 128.09256), //지도의 중심좌표.
  level: 6, //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

const geoJsonData = fetch('client/json/Jinju_dong_centerLocation.json')
  .then((response) => response.json())
  .then((data) => {
    return data;
  });

geoJsonData.then((data) => {
  markers = data.map((location) => {
    const content = `<div class="dong-box">
                      <p class="dong-title">${location.dong}</p>
                      <p class="dong-count"></p>
                    </div>`;
    const position = new kakao.maps.LatLng(location.lat, location.lng);
    const customOverlay = new kakao.maps.CustomOverlay({
      map: map,
      position: position,
      content: content,
      xAnchor: 0.5,
      yAnchor: 1.0,
    });
    return customOverlay;
  });
  updateMarkers(markers, result);
  addDongBtnClickEventListener();
});

addPredictionMonthBtnClickEventListener();

kakao.maps.event.addListener(map, 'dragend', function () {
  // 스크롤 이동 시 실행할 코드 작성
  drawNoCount();
  addDongBtnClickEventListener();
});
