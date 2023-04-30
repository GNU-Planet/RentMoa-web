const getBuiltYearData = (dongTitle) => {
  return new Promise((resolve, reject) => {
    const data = {
      location: dongTitle,
      months: [7],
    };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/built-year`);
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

const getPredictionData = async (e) => {
  const dongTitle =
    e.target.parentNode.querySelector('.dong-title').textContent;
  let selectedClass = null;

  filterBtns.forEach((btn) => {
    if (btn.classList.contains('selected')) {
      selectedClass = btn.id.split('-')[0];
    }
  });

  // 필터 컨테이너 삭제
  filterContainer.forEach((container) => {
    container.classList.add('except-content');
  });

  try {
    const builtYearData = await getBuiltYearData(dongTitle);
    drawPredictionData(dongTitle, builtYearData);
  } catch (err) {
    console.log(err);
  }
};
