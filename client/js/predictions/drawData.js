const filterContainer = document.querySelectorAll('.filter-container');
const filterBtns = document.querySelectorAll('.filterBtn');
const detachedContainer = document.querySelector('.detached-container');
let infoContainer;

const drawHousePredictionData = (
  houseName,
  houseAddress,
  houseAreaData,
  month,
) => {
  const infoContainer = document.querySelector('.house-container');
  const closeBtn = infoContainer.querySelector('.close_btn');
  const areaFilter = document.querySelector('.area-filter');
  const leaseFilter = document.querySelector('.lease-filter');
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

  const handleLeaseFilter = async (event) => {
    const selectedBtn = event.currentTarget;
    const leaseFilterBtns = leaseFilter.querySelectorAll('.filterBtn');
    leaseFilterBtns.forEach((btn) => {
      btn.classList.remove('selected');
    });
    selectedBtn.classList.add('selected');
    // 데이터 요청
    leaseType = selectedBtn.innerText;
    try {
      const body = {
        houseType,
        houseIdx,
        months,
        charterRent: leaseType,
      };
      const houseAreaData = await requestData(body, '/apartments/house-area');
      drawHousePredictionData(
        houseName,
        houseAddress,
        houseAreaData,
        months[0],
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 전세, 월세 , 전세가율 필터링
  const leaseFilterBtns = leaseFilter.querySelectorAll('.filterBtn');

  // 기존 버튼 모두 제거
  leaseFilterBtns.forEach((btn) => {
    btn.remove();
  });

  // 새로운 버튼 생성 및 이벤트 리스너 추가
  const leaseTypes = ['전세', '월세', '전세가율'];
  leaseTypes.forEach((type) => {
    const btn = document.createElement('span');
    btn.classList.add('filterBtn');
    if (leaseType === type) btn.classList.add('selected');
    btn.innerText = type;
    btn.addEventListener('click', handleLeaseFilter);
    leaseFilter.appendChild(btn);
  });

  // 평 수 필터링
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
      filterBtn.removeEventListener('click', () => {});
      filterBtn.addEventListener('click', () => {
        const areaFilterBtns = areaFilter.querySelectorAll('.filterBtn');
        areaFilterBtns.forEach((btn) => {
          btn.classList.remove('selected');
        });
        filterBtn.classList.add('selected');
        const data = houseAreaData[area];
        const predictedData = data.filter((item) => {
          const endDateParts = item.contract_end_date.split('.');
          const endYear = Number(endDateParts[0]);
          const endMonth = Number(endDateParts[1]);

          return endYear == year && endMonth == month;
        });
        drawAverageDepositGraph(data);
        drawFloorGraph(predictedData, month);
        drawPredictionCount(predictedData);
        drawMoreContracts();
      });
      areaFilter.appendChild(filterBtn);
    });

  // 실거래 데이터
  const areaContainers = infoContainer.querySelectorAll('.area-box');
  areaContainers.forEach((areaContainer) => {
    areaContainer.remove();
  });

  const drawTable = (data) => {
    const table = document.createElement('table');
    table.classList.add('info-table');
    const headers =
      leaseType === '전세'
        ? ['계약일', '실거래가', '층수']
        : ['계약일', '실거래가', '환산월세', '층수'];
    const tr = document.createElement('tr');
    headers.forEach((headerText) => {
      const th = document.createElement('th');
      th.textContent = headerText;
      tr.appendChild(th);
    });
    table.appendChild(tr);
    data.forEach((contractData) => {
      let { contract_start_date, contract_type, price, floor } = contractData;
      const tr = document.createElement('tr');
      const tdDate = document.createElement('td');
      const tdTypePrice = document.createElement('td');
      const tdConvertedPrice = document.createElement('td');
      const spanPrice = document.createElement('span');
      const tdFloor = document.createElement('td');
      tdDate.textContent = contract_start_date;
      spanPrice.textContent = ` ${price}`;
      tdTypePrice.appendChild(spanPrice);
      if (leaseType === '월세') {
        const convertedPrice = Math.round(
          Number(price.split('/')[1]) + Number(price.split('/')[0]) / 300,
        );
        const spanConvertedPrice = document.createElement('span');
        spanConvertedPrice.textContent = `${convertedPrice}`;
        tdConvertedPrice.appendChild(spanConvertedPrice);
      }
      tdFloor.textContent = floor;
      tr.appendChild(tdDate);
      tr.appendChild(tdTypePrice);
      if (leaseType === '월세') tr.appendChild(tdConvertedPrice);
      tr.appendChild(tdFloor);

      if (contract_type === '갱신') {
        const spanType = document.createElement('span');
        spanType.textContent = contract_type;
        spanType.classList.add('renewal-contract');
        tdTypePrice.prepend(spanType);
      }

      table.appendChild(tr);
    });

    return table;
  };

  const drawMoreContracts = () => {
    if (realPriceChart.querySelector('.area-box'))
      realPriceChart.querySelector('.area-box').remove();
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

  const drawPredictionCount = (data) => {
    const preInfo = infoContainer.querySelector('.pre-info');
    const text = preInfo.querySelector('.text');
    if (data.length === 0) {
      text.textContent = '0호';
    } else {
      text.textContent = `${data.length}호`;
    }
  };
  const keysArray = Object.keys(houseAreaData);
  const lastKey = keysArray[keysArray.length - 1];
  console.log(lastKey);
  const data = houseAreaData[lastKey];
  // 계약 종료일이 해당 월인 데이터만 필터링
  const predictedData = data.filter((item) => {
    const endDateParts = item.contract_end_date.split('.');
    const endYear = Number(endDateParts[0]);
    const endMonth = Number(endDateParts[1]);

    return endYear == year && endMonth == month;
  });
  drawAverageDepositGraph(data);
  drawFloorGraph(predictedData, month);
  drawPredictionCount(predictedData);
  drawMoreContracts();
};

// TODO: 리팩토링 필요
const drawDongPredictionData = (dongTitle, builtYearData, typeAreaData) => {
  if (infoContainer) infoContainer.classList.add('except-content');
  if (houseType == '단독다가구')
    infoContainer = document.querySelector('.detached-container');
  else if (houseType == '오피스텔')
    infoContainer = document.querySelector('.offi-container');
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
