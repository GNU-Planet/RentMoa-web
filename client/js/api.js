const filterContainer = document.querySelectorAll('.filter-container');
const infoContainer = document.querySelector('.info-container');

const drawPredictionData = (data) => {
  const closeBtn = infoContainer.querySelector('.close_btn');
  infoContainer.classList.remove('except-content');
  closeBtn.addEventListener('click', () => {
    infoContainer.classList.add('except-content');
    filterContainer.forEach((container) => {
      container.classList.remove('except-content');
    });
  });
};

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
  filterContainer.forEach((container) => {
    container.classList.add('except-content');
  });

  drawPredictionData();
};
