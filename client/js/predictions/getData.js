const requestData = (body, endpoint) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 201) {
          // 응답 처리 로직
          const result = JSON.parse(xhr.responseText).result;
          resolve(result);
        } else {
          console.log('요청 실패');
          reject(null);
        }
      }
    };
  });
};

const getHousePredictionData = async (infoWindow) => {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = infoWindow;

  const houseShowName = tempElement.querySelector(
    '.house-info-window_name',
  ).textContent;

  let houseDBName = tempElement.querySelector('.house-info-window_name');
  houseDBName = houseDBName.getAttribute('data-house');

  // Retrieve the content of the element with class house-info-window_address
  const houseAddress = tempElement.querySelector(
    '.house-info-window_address',
  ).textContent;

  try {
    const body = {
      houseType,
      houseName: houseDBName,
      months,
    };
    const houseData = await requestData(body, '/house');
    const houseAreaData = await requestData(body, '/house-area');
    drawHousePredictionData(
      houseShowName,
      houseAddress,
      houseData,
      houseAreaData,
    );
  } catch (err) {
    console.log(err);
  }
};

const getDetachedHousePredictionData = async (btn) => {
  const dongTitle = btn.querySelector('.dong-title').textContent;

  // 필터 컨테이너 삭제
  filterContainer.forEach((container) => {
    container.classList.add('except-content');
  });

  try {
    const body = {
      location: dongTitle,
      months,
    };
    const builtYearData = await requestData(body, '/built-year');
    const typeAreaData = await requestData(body, '/type-area');
    drawDongPredictionData(dongTitle, builtYearData, typeAreaData);
  } catch (err) {
    console.log(err);
  }
};
