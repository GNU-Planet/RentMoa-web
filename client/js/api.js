const filterContainer = document.querySelectorAll('.filter-container');
const infoContainer = document.querySelector('.info-container');
const filterBtns = document.querySelectorAll('.filterBtn');

const drawPredictionData = (dongTitle) => {
  const closeBtn = infoContainer.querySelector('.close_btn');
  infoContainer.classList.remove('except-content');
  // 기존 사이드 필터박스 삭제
  closeBtn.addEventListener('click', () => {
    infoContainer.classList.add('except-content');
    filterContainer.forEach((container) => {
      container.classList.remove('except-content');
    });
  });

  // 예측 header 정보창 그리기
  const headerInfo = document.querySelector('.header-info');
  const dong = headerInfo.querySelector('.title');
  const month = headerInfo.nextElementSibling;
  let monthInfo;
  filterBtns.forEach((btn) => {
    if (btn.classList.contains('selected')) {
      monthInfo = btn.id.split('-')[1];
    }
  });
  dong.innerHTML = dongTitle;
  month.innerHTML = `2023년 ${monthInfo}월`;

  // 전월세 요약 정보창 그리기
  const preInfo = document.querySelector('.pre-info');
  const charterInfo = document.querySelector('.charter-info');
  const rentInfo = document.querySelector('.rent-info');
  const charRentSum = preInfo.querySelector('.text');
  const charSum = charterInfo.querySelector('.text');
  const rentSum = rentInfo.querySelector('.text');
  charRentSum.innerHTML = `${result[dongTitle]?.합계 || 0}호`;
  charSum.innerHTML = `${result[dongTitle]?.전세 || 0}호`;
  rentSum.innerHTML = `${result[dongTitle]?.월세 || 0}호`;
};

const getPredictionData = (e) => {
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

  drawPredictionData(dongTitle);
};
