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

  houseIdx = Number(
    tempElement
      .querySelector('.house-info-window_name')
      .getAttribute('house-id'),
  );

  const houseName = tempElement.querySelector(
    '.house-info-window_name',
  ).textContent;

  // Retrieve the content of the element with class house-info-window_address
  const houseAddress = tempElement.querySelector(
    '.house-info-window_address',
  ).textContent;

  try {
    const body = {
      houseType,
      houseIdx,
      months,
      charterRent: leaseType,
    };
    const houseAreaData = await requestData(body, '/apartments/house-area');
    drawHousePredictionData(houseName, houseAddress, houseAreaData, months[0]);
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
    const builtYearData = await requestData(body, '/detached/built-year');
    const typeAreaData = await requestData(body, '/detached/type-area');
    drawDongPredictionData(dongTitle, builtYearData, typeAreaData);
  } catch (err) {
    console.log(err);
  }
};
