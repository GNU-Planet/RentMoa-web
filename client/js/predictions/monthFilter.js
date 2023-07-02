const addPredictionMonthBtnClickEventListener = () => {
  const predictionMonthBtns = document.querySelectorAll(
    '[id*="predictionMonthBtn"]',
  );
  predictionMonthBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // 기존의 selected 버튼 삭제
      predictionMonthBtns.forEach((btn) => {
        btn.classList.remove('selected');
      });
      // 클릭한 버튼에 selected 클래스 추가
      btn.classList.add('selected');
      // 클릭한 버튼의 id에서 월 값을 추출하여 months 배열에 추가
      months = [];
      months.push(parseInt(btn.id.split('-')[1]));
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
    });
  });
};

addPredictionMonthBtnClickEventListener();
