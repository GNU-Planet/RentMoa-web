const requestData = (dongTitle, endpoint) => {
  return new Promise((resolve, reject) => {
    const data = {
      location: dongTitle,
      months,
    };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
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

  const houseDBName = tempElement
    .querySelector('.house-info-window_name')
    .getAttribute('data-name');

  // Retrieve the content of the element with class house-info-window_address
  const houseAddress = tempElement.querySelector(
    '.house-info-window_address',
  ).textContent;

  try {
    drawHousePredictionData(houseShowName, houseAddress);
  } catch (err) {
    console.log(err);
  }
};

const getDongPredictionData = async (btn) => {
  const dongTitle = btn.querySelector('.dong-title').textContent;

  // 필터 컨테이너 삭제
  filterContainer.forEach((container) => {
    container.classList.add('except-content');
  });

  try {
    const builtYearData = await requestData(dongTitle, '/built-year');
    const typeAreaData = await requestData(dongTitle, '/type-area');
    drawDongPredictionData(dongTitle, builtYearData, typeAreaData);
  } catch (err) {
    console.log(err);
  }
};
