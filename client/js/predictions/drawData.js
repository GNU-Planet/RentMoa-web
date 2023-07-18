const filterContainer = document.querySelectorAll('.filter-container');
const filterBtns = document.querySelectorAll('.filterBtn');
const detachedContainer = document.querySelector('.detached-container');
let infoContainer;

const drawHousePredictionData = (
  houseName,
  houseAddress,
  houseData,
  houseAreaData,
) => {
  if (infoContainer) infoContainer.classList.add('except-content');
  infoContainer = document.querySelector('.house-container');
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
  const headerInfo = infoContainer.querySelector('.header-info');
  const houseNameQuery = headerInfo.querySelector('.title');
  const houseAddressQuery = headerInfo.nextElementSibling;

  houseNameQuery.innerHTML = houseName;
  houseAddressQuery.innerHTML = houseAddress;

  // 평수 불러오기
  const sizeFilter = document.querySelector('.size-filter');
  // 기존 요소 삭제
  while (sizeFilter.firstChild) {
    sizeFilter.firstChild.remove();
  }
  Object.keys(houseAreaData)
    .reverse()
    .forEach((area, index) => {
      const filterBtn = document.createElement('span');
      filterBtn.classList.add('filterBtn');
      // index가 배열의 끝일 경우 selected 클래스 추가
      if (index == 0) filterBtn.classList.add('selected');
      filterBtn.innerText = `${area}평`;
      sizeFilter.appendChild(filterBtn);
    });

  // 공통 전월세 요약 정보창 그리기
  const preInfo = infoContainer.querySelector('.pre-info');
  const preTypes = preInfo.querySelectorAll('.sub-info-box');

  preTypes.forEach((count, index) => {
    const text = count.querySelector('.text');
    text.textContent = `${Object.values(houseData)[index]}호`;
  });

  // 집 면적별 예측물량 그리기
  const areaContainers = infoContainer.querySelectorAll('.area-box');
  areaContainers.forEach((areaContainer) => {
    areaContainer.remove();
  });
  Object.keys(houseAreaData).forEach((area) => {
    const areaContainer = document.createElement('div');
    areaContainer.classList.add('info-box');
    areaContainer.classList.add('area-box');
    const areaTitle = document.createElement('p');
    areaTitle.classList.add('big-title');
    areaTitle.textContent = `${area}평`;
    areaContainer.appendChild(areaTitle);
    infoContainer.appendChild(areaContainer);
    if (houseAreaData[area].length > 0) {
      const table = document.createElement('table');
      table.classList.add('info-table');
      areaContainer.appendChild(table);

      const headers = ['계약일', '실거래가', '층수'];
      const tr = document.createElement('tr');
      table.appendChild(tr);

      headers.forEach((headerText) => {
        const th = document.createElement('th');
        th.textContent = headerText;
        tr.appendChild(th);
      });
      areaContainer.appendChild(table);
      houseAreaData[area].forEach((contractData) => {
        const tr = document.createElement('tr');
        table.appendChild(tr);
        Object.values(contractData).forEach((value) => {
          const td = document.createElement('td');
          td.textContent = value;
          tr.appendChild(td);
        });
      });
    }
  });
};

const drawDongPredictionData = (dongTitle, builtYearData, typeAreaData) => {
  if (infoContainer) infoContainer.classList.add('except-content');
  if (houseType == '오피스텔')
    infoContainer = document.querySelector('.offi-container');
  else if (houseType == '단독다가구')
    infoContainer = document.querySelector('.detached-container');
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
  const headerInfo = infoContainer.querySelector('.header-info');
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

  // 공통 전월세 요약 정보창 그리기
  const preInfo = infoContainer.querySelector('.pre-info');
  const preTypes = preInfo.querySelectorAll('.sub-info-box');

  preTypes.forEach((year, index) => {
    const text = year.querySelector('.text');
    let total;
    if (result) {
      total = Object.values(result[dongTitle])[index];
    } else {
      total = 0;
    }
    text.textContent = `${total}호`;
  });

  // 오피스텔 전월세 요약 정보창 그리기

  // 단독다가구 전월세 요약 정보창 그리기
  if (houseType == '단독다가구') {
    // 면적별 예측물량 그리기
    drawTypeAreaGraph(typeAreaData);

    // 건축연한별 예측물량 그리기
    drawBuiltYearGraph(builtYearData);
  }
};
