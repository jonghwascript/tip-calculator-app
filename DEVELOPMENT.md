# 개발 안내

HTML과 Gulp·SCSS를 사용하는 팁 계산기 화면 뼈대입니다.

## 실행

```sh
npm ci
npm run build
```

빌드 후 `index.html`을 브라우저에서 엽니다. `npm run dev`는 SCSS 변경을 감시하고 CSS를 다시 생성합니다. 별도 웹 서버나 자동 새로고침은 제공하지 않습니다.

## 구조

- `index.html`: 금액·팁·인원 입력 폼과 결과 영역
- `src/scss/_variables.scss`: 스타일 가이드의 색상, 폰트, 분기점
- `src/scss/_fonts.scss`: 기본 폰트 설정
- `src/scss/_reset.scss`, `_mixins.scss`: 리셋과 공통 믹스인
- `src/scss/style.scss`: 색상·타이포그래피·입력 요소 기본 스타일
- `css/style.css`: 빌드 결과물. 스타일 수정은 SCSS에서 진행합니다.
- `images/`: 로고와 입력 아이콘

Space Mono 700은 Google Fonts에서 불러오며, 연결이 없으면 monospace로 표시합니다. 디자인 기준 폭은 모바일 375px, 데스크톱 1440px입니다. 모바일·데스크톱 레이아웃은 직접 구성할 수 있도록 비워 두었습니다. 분기점 변수와 미디어 쿼리 믹스인은 추후 사용할 수 있는 도구로만 남아 있습니다.

## 검증과 후속 작업

`npm run check`로 포맷을 검사하고 `npm run build`로 SCSS 컴파일을 확인합니다.

현재 기본 팁 선택과 폼 초기화는 HTML 기본 동작을 사용합니다. 결과는 `$0.00` 자리 표시자입니다. 후속 작업으로 계산 로직, 기본 팁과 Custom 입력의 선택 연동, 인원 0에 대한 오류 표시, 결과에 연동한 초기화 상태를 구현해야 합니다.
