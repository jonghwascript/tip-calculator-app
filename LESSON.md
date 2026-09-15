# output 시맨틱 태그 
HTML <output> 요소는 웹 사이트나 앱에서 계산이나 사용자 행동의 결과를 삽입할 수 있는 컨테이너 요소입니다.

# fieldset
HTML <fieldset> 요소는 웹 양식의 여러 컨트롤과 레이블(<label>)을 묶을 때 사용합니다.

# legend
HTML <legend> 요소는 부모 <fieldset> 콘텐츠의 설명을 나타냅니다.


# 화면이 100px이하일 때에도 레이아웃이 변경 되지 않아야 한다. 
원하시는 건 **375px의 배치와 비율을 유지하면서 글자·패딩·간격·버튼이 함께 작아지는 방식**이군요.

이 경우 **기준 단위를 하나 정하고 모든 크기를 `rem`으로 맞추는 방법**이 간단합니다.

### 1. 화면에 따라 기준 크기 줄이기

```scss
html {
  // 375px 이상: 1rem = 16px
  // 375px 미만: 화면 너비에 비례해서 축소
  font-size: min(16px, 4.2666667vw);
}
```

계산은 `16 ÷ 375 × 100 = 4.2666667vw`예요.

### 2. 고정 px을 rem으로 변환하기

**기존 px 값을 16으로 나누면 됩니다.**

```scss
.calculator {
  padding: 2rem 1.5rem; // 32px 24px
  gap: 2rem; // 32px
  border-radius: 1.5625rem 1.5625rem 0 0; // 25px
}

.calculator__result {
  padding: 1.5rem; // 24px

  output {
    @include m.font-style(2rem, 700, 1); // 32px

    @include m.mq('tablet') {
      font-size: 3rem; // 48px
    }
  }
}
```

**설명 글자, 입력창, 버튼, 로고 너비, margin, 자간도 같은 방식으로 바꿔야** 전체 비율이 유지돼요. `width: 100%`와 단위 없는 `line-height`는 그대로 둡니다.

| 요소 | 375px 화면 | 100px 화면 |
|---|---:|---:|
| 결과 글자 `2rem` | 32px | 약 8.53px |
| 패딩 `1.5rem` | 24px | 약 6.4px |
| 설명 글자 `1rem` | 16px | 약 4.27px |

첨부 예시에는 `body { min-width: 320px; }`와 고정 px 크기가 많아서, **그 코드 자체가 100px까지 전체 비례 축소되는 구조는 아니에요.** 위 방식은 비율을 유지하지만, 100px에서는 글자와 조작 영역도 매우 작아집니다.


# 로고 이미지도 화면 크기에 비례해서 작아지게 하고 싶다. 
로고도 함께 줄어들게 하려면 **이미지 너비를 `rem`으로 지정**하면 됩니다. 앞서 설정한 유동적인 `html` 글자 크기가 적용되어 있다는 기준이에요.

```scss
.title img {
  width: 5.4375rem; // 1rem = 16px일 때 87px
  max-width: 100%;  // 부모 너비를 넘지 않도록
  height: auto;    // 원본 비율 유지
  margin-inline: auto;
}
```

여기서 `87px`은 예시 기준 너비예요. 원하는 로고 너비를 **16으로 나누어 `rem`으로 설정**하세요.

SVG 파일 자체는 수정할 필요 없고, `<img>`의 CSS 크기만 조절하면 됩니다.

# SCSS 질문 정리

아래 라인 번호는 질문 당시 기준입니다. 코드가 변경되면 선택자 이름으로 찾습니다. 예제는 기존 SCSS의 해당 블록에 반영하는 방식입니다.

## 1. label 안의 텍스트를 중앙 정렬하려면? (147라인)

부모 `li`의 flex 정렬은 자식인 `label`의 위치를 정합니다. label 내부 텍스트를 가로·세로 중앙에 배치하려면 label 자체에도 flex를 설정합니다.

```scss
label {
  display: flex;
  justify-content: center; // 기본 row 방향에서 가로 중앙
  align-items: center;     // 기본 row 방향에서 세로 중앙
  width: 100%;
  height: 100%;
}
```

## 2. input.active ~ label이 적용되지 않는 이유 (161라인)

`~`는 같은 부모 아래에서 앞 요소 뒤에 나오는 형제를 선택합니다. 현재 HTML에서는 label이 input의 부모이므로 일치하지 않습니다.

```html
<label><input type="radio" name="tip" value="5">5%</label>
```

부모 label을 선택하려면 `:has()`를 사용합니다.

```scss
label:has(input[name='tip'].active) {
  background-color: v.$green-400;
  color: v.$green-900;
}
```

`.active`는 직접 붙이는 클래스이며, 라디오를 클릭해도 자동으로 추가되지 않습니다. 실제 선택 상태에 반응하려면 `:checked`를 사용합니다.

```scss
label:has(input[name='tip']:checked) {
  background-color: v.$green-400;
  color: v.$green-900;
}
```

## 3. c__gray_50 클래스의 배경색이 적용되지 않는 이유

전역 `.c__gray_50`보다 중첩된 label 선택자가 더 구체적이어서 기본 초록색 배경이 우선 적용됩니다. 같은 출처·레이어·중요도의 규칙에서는 선택자 명시도가 높은 규칙이 우선하며, 명시도까지 같으면 뒤에 선언한 규칙이 적용됩니다.

기존 label 블록 안에 `&.c__gray_50`을 추가하면 해당 label에 대한 구체적인 규칙을 만들 수 있습니다.

```scss
label {
  background-color: v.$green-900;
  color: white;

  &.c__gray_50 {
    background-color: v.$grey-50;
    color: v.$grey-500;
  }

  &:has(input[name='tip']:checked) {
    background-color: v.$green-400;
    color: v.$green-900;
  }
}
```

`&`는 현재 부모 선택자를 뜻합니다. 위 예제에서 Custom은 기본적으로 밝은 배경이고, 선택하면 초록색으로 바뀝니다. `background-color`는 배경색, `color`는 글자색입니다.

## 4. 사람 아이콘으로 덮어쓰기가 안 되는 이유 (105라인)

기존 아이콘은 `.input-group::after`에 있는데, `input[name=people]::after`는 input의 가상 요소를 대상으로 합니다. 대상이 다르므로 기존 배경 이미지를 덮어쓰지 않습니다.

```scss
@at-root .input-group {
  &::after {
    content: '';
    // 기존 위치와 크기 설정 유지
    background-image: url('../images/icon-dollar.svg');
  }

  &:has(input[name='people'])::after {
    background-image: url('../images/icon-person.svg');
  }
}
```

이 선택자는 people input을 포함한 `.input-group`의 `::after`를 가리킵니다. 위치와 크기는 유지하고 이미지만 변경합니다. `@at-root`는 바깥 선택자의 중첩에서 규칙을 꺼내며, HTML의 부모·자식 관계를 변경하지는 않습니다.

## 5. Reset 버튼을 결과 영역 맨 아래로 보내려면? (243라인)

desktop에서 결과 영역을 세로 flex로 만들고 버튼 위쪽 여백을 `auto`로 설정합니다. 기존 `margin-top: 100px`은 제거합니다.

```scss
.calculator__result {
  @include m.mq('desktop') {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .reset-btn {
    margin-block-start: 32px;

    @include m.mq('desktop') {
      margin-block-start: auto;
    }
  }
}
```

`auto` 여백이 부모의 남은 세로 공간을 차지해 버튼을 아래로 밀어냅니다. 부모의 하단 패딩은 유지됩니다. 부모에 남는 높이가 없다면 밀어낼 공간도 없으므로 부모 높이와 늘어남 설정을 함께 확인합니다.

## 6. desktop에서도 calculator가 920px보다 작을 수 있나?

가능합니다. desktop 미디어 쿼리는 화면 너비 조건이며 요소 너비를 보장하지 않습니다. 이 프로젝트의 desktop 기준은 1024px 이상입니다.

```scss
width: 100%;      // 부모의 콘텐츠 너비 기준
max-width: 920px; // 최대 너비 제한
```

부모 `.container`가 920px보다 좁으면 calculator도 작아질 수 있습니다. 현재 reset의 `box-sizing: border-box`에 따라 지정한 너비에는 패딩과 테두리가 포함됩니다.

desktop에서 부모 너비를 명시하는 방법은 다음과 같습니다.

```scss
.container {
  @include m.mq('desktop') {
    width: 920px;
  }
}
```

## 7. container는 꼭 width: 100%여야 하나?

필수는 아닙니다. 현재 body는 `flex-direction: column`과 `align-items: center`를 사용하므로 자식 container가 가로로 자동 확장되지 않습니다. 너비를 지정하지 않으면 내용에 따라 너비가 결정될 수 있습니다.

부모가 화면의 가용 너비를 확보하고 calculator만 최대 920px로 제한하려면 다음 구조를 사용할 수 있습니다.

```scss
.container {
  width: 100%;

  .calculator {
    @include m.mq('desktop') {
      width: 100%;
      max-width: 920px;
      margin-inline: auto;
    }
  }
}
```

`100%`는 항상 화면 너비를 뜻하는 것이 아니라 이 구조에서 부모 너비를 따라가는 값입니다. desktop에서 container를 `920px`로 지정하는 방법과 위 방법 중 원하는 레이아웃에 맞게 선택하면 됩니다.
