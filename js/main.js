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
  if (!bill.val() || Number(bill.val()) <= 0) {
    $('label[for=bill] + .error').addClass('active');
    return false;
  } else {
    $('label[for=bill] + .error').removeClass('active');
  }

  if (
    !people.val() ||
    Number(people.val()) <= 0 ||
    !Number.isInteger(Number(people.val()))
  ) {
    $('label[for=people] + .error').addClass('active');
    return false;
  } else {
    $('label[for=people] + .error').removeClass('active');
  }

  return true;
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

  renderResult();
}

function renderResult(tipAmount = 0, total = 0) {
  $('.output-tip .tip').text(`$${tipAmount.toFixed(2)}`);
  $('.output-result .result').text(`$${total.toFixed(2)}`);
}
