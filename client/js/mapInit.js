let dongMarkers;
let offiMarkers;

const updatedDongMarkers = (dongMarkers, result) => {
  const parser = new DOMParser();
  dongMarkers.forEach((marker) => {
    const content = marker.getContent();
    const dom = parser.parseFromString(content, 'text/html');
    const dongTitleEl = dom.querySelector('.dong-title');
    const dongCountEl = dom.querySelector('.dong-count');
    const dong = result[dongTitleEl.innerText];
    const count = dong !== undefined && dong.합계 !== 0 ? dong.합계 + '호' : '';
    dongCountEl.innerText = count;
    const newContent = dom.documentElement.innerHTML;
    marker.setContent(newContent);
  });
  drawNoCount();
  addDongBtnClickEventListener();
};

const hideDongMarkers = (dongMarkers) => {};

const handleClick = async function () {
  await getPredictionData(this);
  const lat = Number(this.dataset.lat);
  const lng = Number(this.dataset.lng);
  map.panTo(new kakao.maps.LatLng(lat, lng));
  drawNoCount();
};

const addDongBtnClickEventListener = () => {
  const dongBtns = document.querySelectorAll('.dong-box');
  dongBtns.forEach((btn) => {
    btn.removeEventListener('click', handleClick);
    btn.addEventListener('click', handleClick);
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

const dongGeoJsonData = fetch('client/json/Jinju_dong_centerLocation.json')
  .then((response) => response.json())
  .then((data) => {
    return data;
  });

dongGeoJsonData.then((data) => {
  dongMarkers = data.map((location) => {
    const content = `<div class="dong-box" data-lat=${location.lat} data-lng=${location.lng}>
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
  updatedDongMarkers(dongMarkers, result);
});

const offiGeoJsonData = fetch('client/json/Jinju_offi_centerLocation.json')
  .then((response) => response.json())
  .then((data) => {
    return data;
  });

offiGeoJsonData.then((data) => {
  offiMarkers = data.map((location) => {
    var markerImage = new kakao.maps.MarkerImage(
      'client/houseIcon.png',
      new kakao.maps.Size(50, 50),
      { offset: new kakao.maps.Point(15, 30) },
    );
    const position = new kakao.maps.LatLng(location.lat, location.lng);
    // 마커를 생성합니다
    const customOverlay = new kakao.maps.Marker({
      map: null,
      position: position,
      image: markerImage, // 마커이미지 설정
    });

    return customOverlay;
  });
});

// 맵 스크롤 이벤트 핸들러
kakao.maps.event.addListener(map, 'dragend', function () {
  drawNoCount();
  addDongBtnClickEventListener();
});

// 확대 레벨 변경 이벤트 핸들러
kakao.maps.event.addListener(map, 'zoom_changed', function () {
  var currentZoomLevel = map.getLevel(); // 현재 확대 레벨 확인
  console.log(currentZoomLevel);

  if (currentZoomLevel > 4) {
    dongMarkers.forEach((marker) => {
      marker.setMap(map);
    });
    offiMarkers.forEach((marker) => {
      marker.setMap(null);
    });
  } else {
    dongMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    offiMarkers.forEach((marker) => {
      marker.setMap(map);
    });
  }
});
