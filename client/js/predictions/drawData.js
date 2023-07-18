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
  const infoContainer = document.querySelector('.house-container');
  const closeBtn = infoContainer.querySelector('.close_btn');
  const areaFilter = document.querySelector('.area-filter');
  const realPriceChart = document.querySelector('#real-price-chart');

  infoContainer.classList.remove('except-content');
  closeBtn.addEventListener('click', () => {
    infoContainer.classList.add('except-content');
    filterContainer.forEach((container) => {
      container.classList.remove('except-content');
    });
  });

  const headerInfo = infoContainer.querySelector('.header-info');
  const houseNameQuery = headerInfo.querySelector('.title');
  const houseAddressQuery = headerInfo.nextElementSibling;
  houseNameQuery.innerHTML = houseName;
  houseAddressQuery.innerHTML = houseAddress;

  while (areaFilter.firstChild) {
    areaFilter.firstChild.remove();
  }
  Object.keys(houseAreaData)
    .reverse()
    .forEach((area, index) => {
      const filterBtn = document.createElement('span');
      filterBtn.classList.add('filterBtn');
      if (index === 0) filterBtn.classList.add('selected');
      filterBtn.innerText = `${area}평`;
      areaFilter.appendChild(filterBtn);
    });

  const preInfo = infoContainer.querySelector('.pre-info');
  const preTypes = preInfo.querySelectorAll('.sub-info-box');
  preTypes.forEach((count, index) => {
    const text = count.querySelector('.text');
    text.textContent = `${Object.values(houseData)[index]}호`;
  });

  const areaContainers = infoContainer.querySelectorAll('.area-box');
  areaContainers.forEach((areaContainer) => {
    areaContainer.remove();
  });

  const drawTable = (data) => {
    const table = document.createElement('table');
    table.classList.add('info-table');
    const headers = ['계약일', '실거래가', '층수'];
    const tr = document.createElement('tr');
    headers.forEach((headerText) => {
      const th = document.createElement('th');
      th.textContent = headerText;
      tr.appendChild(th);
    });
    table.appendChild(tr);
    data.forEach((contractData) => {
      const { 날짜, 계약종류, 금액, 층 } = contractData;
      const tr = document.createElement('tr');
      const tdDate = document.createElement('td');
      const tdTypePrice = document.createElement('td');
      const spanPrice = document.createElement('span');
      const tdFloor = document.createElement('td');
      tdDate.textContent = 날짜;
      spanPrice.textContent = ` ${금액}`;
      tdTypePrice.appendChild(spanPrice);
      tdFloor.textContent = 층;
      tr.appendChild(tdDate);
      tr.appendChild(tdTypePrice);
      tr.appendChild(tdFloor);

      if (계약종류 === '갱신') {
        const spanType = document.createElement('span');
        spanType.textContent = 계약종류;
        spanType.classList.add('renewal-contract');
        tdTypePrice.prepend(spanType);
      }

      table.appendChild(tr);
    });

    return table;
  };

  const drawMoreContracts = () => {
    const areaContainer = document.createElement('div');
    areaContainer.classList.add('area-box');
    realPriceChart.appendChild(areaContainer);

    const currentData = houseAreaData[Object.keys(houseAreaData)[0]];
    let visibleContracts = 5;
    const updateContractTable = () => {
      const existingTable = areaContainer.querySelector('.info-table');
      if (existingTable) {
        existingTable.remove();
      }

      const data = currentData.slice(0, visibleContracts);
      if (data.length > 0) {
        const table = drawTable(data);
        areaContainer.appendChild(table);

        if (visibleContracts < currentData.length) {
          const showMoreButton = document.createElement('button');
          showMoreButton.classList.add('show-more-button');
          showMoreButton.textContent = '더보기';
          table.appendChild(showMoreButton);

          showMoreButton.addEventListener('click', () => {
            visibleContracts += 5;
            updateContractTable();
          });
        }
      }
    };

    updateContractTable();
  };

  const data = houseAreaData[Object.keys(houseAreaData)[0]];
  drawAverageDepositGraph(data);
  drawMoreContracts();
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
