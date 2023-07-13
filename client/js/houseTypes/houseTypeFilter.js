const addHouseTypeBtnClickEventListener = () => {
  const housingTypeBtns = document.querySelectorAll('[id*="housingTypeBtn"]');
  housingTypeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // 기존의 selected 버튼 삭제
      housingTypeBtns.forEach((btn) => {
        btn.classList.remove('selected');
      });
      // 클릭한 버튼에 selected 클래스 추가
      btn.classList.add('selected');
      // 클릭한 버튼의 id에서 houseType 추출
      houseType = btn.textContent.replace('/', '');

      const data = {
        houseType,
        location: '진주시',
        months,
      };
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `/dong-count`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 201) {
            // 응답 처리 로직
            result = JSON.parse(xhr.responseText).result;
            updateDongMarkers(dongMarkers, result);
          } else {
            console.log('요청 실패');
          }
        }
      };
      // 클릭한 버튼에 따라 집 마커 업데이트
      updateHouseTypeMarkers(houseType);
    });
  });
};

// 주택 유형에 따라 마커 업데이트
const updateHouseTypeMarkers = async (houseType) => {
  // 기존의 마커 삭제
  if (houseMarkers) {
    houseMarkers.forEach((marker) => {
      marker.setMap(null);
    });
  }
  const apartmentJsonDatas = requestData({ houseType }, '/apartments/location');
  apartmentJsonDatas.then((data) => {
    if (!data) return;
    houseMarkers = data.map((data) => {
      var markerImage = new kakao.maps.MarkerImage(
        'client/houseIcon.png',
        new kakao.maps.Size(50, 50),
        { offset: new kakao.maps.Point(15, 30) },
      );
      const position = new kakao.maps.LatLng(
        data.building_lat,
        data.building_lng,
      );
      // 마커를 생성합니다
      const customOverlay = new kakao.maps.Marker({
        map: null,
        position: position,
        image: markerImage, // 마커이미지 설정
      });
      const houseInfoWindow = new kakao.maps.InfoWindow({
        content: `
        <div class="house-info-window_name" house-id="${data.id}"> ${data.building_name}</div>
        <div class="house-info-window_address"> ${data.dong}</div>
        `,
      });

      kakao.maps.event.addListener(customOverlay, 'click', function () {
        const lat = this.getPosition().getLat();
        const lng = this.getPosition().getLng();
        getHousePredictionData(houseInfoWindow.getContent());
        map.panTo(new kakao.maps.LatLng(lat, lng));
      });
      // 마우스오버 이벤트 설정
      kakao.maps.event.addListener(customOverlay, 'mouseover', function () {
        // 인포윈도우 설정
        houseInfoWindow.open(map, customOverlay);
      });

      // 마우스아웃 이벤트 설정
      kakao.maps.event.addListener(customOverlay, 'mouseout', function () {
        houseInfoWindow.close();
      });

      // 마커가 지도 위에 표시되도록 설정
      var currentZoomLevel = map.getLevel(); // 현재 확대 레벨 확인
      if (currentZoomLevel <= 4) {
        customOverlay.setMap(map);
      }

      return customOverlay;
    });
  });
};

addHouseTypeBtnClickEventListener();
