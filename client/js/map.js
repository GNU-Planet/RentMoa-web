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
  const markers = data.map((location) => {
    const dong = result[location.dong];
    const count = dong !== undefined && dong !== 0 ? dong + '호' : '';
    const content = `<div class="dong-box">
                      <p class="dong-title">${location.dong}</p>
                      <p class="dong-count">${count}</p>
                    </div>`;
    const position = new kakao.maps.LatLng(location.lat, location.lng);
    const customOverlay = new kakao.maps.CustomOverlay({
      map: map,
      position: position,
      content: content,
      xAnchor: 0.5,
      yAnchor: 1.0,
    });
    drawNoCount();
    addDongBtnClickEventListener();
  });
});

kakao.maps.event.addListener(map, 'dragend', function () {
  // 스크롤 이동 시 실행할 코드 작성
  drawNoCount();
  addDongBtnClickEventListener();
});
