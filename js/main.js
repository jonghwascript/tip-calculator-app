const bill = $('input[name=bill]');
const people = $('input[name=people]');
const tipRadio = $('input[name=tip]');
const resetBtn = $('.reset-btn');
const custom = $('input[name=custom]');

tipRadio
  .add(bill)
  .add(people)
  .add(custom)
  .on('input change', function () {
    resetBtn.removeClass('active');

    // Custom 입력 시 라디오 선택을 해제
    if ($(this).is(custom)) {
      tipRadio.prop('checked', false);
    } else if ($(this).is(tipRadio)) {
      custom.val('');
    }

    if (!isValid()) {
      renderResult();
      return;
    }
    const billAmount = Number(bill.val());
    const peopleCount = Number(people.val());

    const selectedTip = tipRadio.filter(':checked');
    const tipPercent = selectedTip.length
      ? Number(selectedTip.val())
      : Number(custom.val());

  /**
   * isFinite() 함수는 어떤 값이 유한한 숫자(Finite Number)인지 판별. 
   * 아래의 3가지 경우에만 false
   * 1. Infinity (무한대)
   * 2. -Infinity (음의 무한대)
   * 3. NaN (Not a Number, 숫자가 아님
   */      
    if (!Number.isFinite(tipPercent) || tipPercent < 0) {
      renderResult();
      return;
    }

    const tipAmount = (billAmount * (tipPercent / 100)) / peopleCount;
    const total = billAmount / peopleCount + tipAmount;

    renderResult(tipAmount, total);

    resetBtn.addClass('active');
  });

function isValid() {
  const billAmount = Number(bill.val());
  const peopleCount = Number(people.val());
  
  const billValid = Number.isFinite(billAmount) && billAmount > 0;      //소수점이 있든 없든, 끝이 있는 정상적인 숫자면 다 통과!" (실수 + 정수)
  const peopleValid = Number.isInteger(peopleCount) && peopleCount > 0; //소수점은 절대 안 돼! 딱 떨어지는 깔끔한 정수만 통과!" (오직 정수)

  //두번째 인자: 입력값이 정상이면 active를 뺀다. 
  $('#bill-error').toggleClass('active', !billValid);
  $('#people-error').toggleClass('active', !peopleValid);

  // 스크린 리더기를 위해 input 태그의 aria-invalid 상태도 같이 업데이트
  bill.attr('aria-invalid', String(!billValid));
  people.attr('aria-invalid', String(!peopleValid));


  if (billValid) {
    bill.removeAttr('aria-describedby');  // 속성 자체를 깔끔하게 삭제
  } else {
    //에러가 났을 때 (!billValid): 스크린 리더기가 "결제 금액, 잘못된 입력입니다. 0보다 큰 숫자를 입력하세요(에러 메시지 내용).""
    bill.attr('aria-describedby', 'bill-error'); // 속성 추가 및 값 부여
  }

  if (peopleValid) {
    people.removeAttr('aria-describedby');
  } else {
    people.attr('aria-describedby', 'people-error');
  }

  return billValid && peopleValid;
}

resetBtn.on('click', resetFn);

function resetFn() {
  bill.val('0');
  people.val('0');
  custom.val('');
  tipRadio.prop('checked', false);

  resetBtn.removeClass('active');

  $('label[for=bill] + .error').removeClass('active');
  $('label[for=people] + .error').removeClass('active');

  bill.add(people).attr('aria-invalid', 'false');
  bill.add(people).removeAttr('aria-describedby');

  renderResult();
}

/**
 * 게산값을 출력 또는 초기화
 * @param {*} tipAmount 
 * @param {*} total 
 */
function renderResult(tipAmount = 0, total = 0) {
  $('.output-tip .tip').text(`$${tipAmount.toFixed(2)}`);
  $('.output-result .result').text(`$${total.toFixed(2)}`);
}
