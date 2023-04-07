const drawPredictionData = (data) => {};

const getPredictionData = (e) => {
  const dongTitle =
    e.target.parentNode.querySelector('.dong-title').textContent;
  const filterBtns = document.querySelectorAll('.filterBtn');
  let selectedClass = null;

  filterBtns.forEach((btn) => {
    if (btn.classList.contains('selected')) {
      selectedClass = btn.id.split('-')[0];
    }
  });

  // 필터 컨테이너 삭제
  const filterContainer = document.querySelectorAll('.filter-container');
  filterContainer.forEach((container) => {
    container.classList.add('except-content');
  });

  const xhr = new XMLHttpRequest();
  const queryString = `location=${dongTitle}`;
  xhr.open('GET', `/type-area?${queryString}`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // 응답 처리 로직
        console.log(xhr.responseText);
      } else {
        console.log('요청 실패');
      }
    }
  };
};
