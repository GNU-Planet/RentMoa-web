const filterContainer = document.querySelectorAll('.filter-container');
const infoContainer = document.querySelector('.info-container');
const filterBtns = document.querySelectorAll('.filterBtn');

const drawPredictionData = (dongTitle, builtYearData) => {
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
  const preTypes = preInfo.querySelectorAll('.sub-info-box');

  console.log(Object.values(result[dongTitle]));
  preTypes.forEach((year, index) => {
    const text = year.querySelector('.text');
    const total = Object.values(result[dongTitle])[index] || 0;
    text.textContent = `${total}호`;
  });

  // 건축연한별 예측물량 그리기
  const builtYearInfo = document.querySelector('.built-year-info');
  const builtYears = builtYearInfo.querySelectorAll('.sub-info-box');
  builtYears.forEach((year, index) => {
    const text = year.querySelector('.text');
    const total = Object.values(builtYearData.합계)[index];
    text.textContent = `${total}호`;
  });
};
