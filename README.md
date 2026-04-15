# 인천경기지역본부 AI 혁신 랜딩페이지

## 폴더 구조

```
nhis-ai-project/
├── index.html          ← 마크업 (내용 수정은 여기)
├── css/
│   └── style.css       ← 전체 스타일
├── js/
│   └── main.js         ← 애니메이션 / 인터랙션 로직
├── assets/             ← 스크린샷 이미지 여기에 넣기
└── README.md
```

---

## 자주 수정하는 항목

### 과제 카드 내용 변경 (`index.html`)

각 `.pc` 블록을 찾아서 수정합니다.

```html
<div class="pc">
  <div class="thumb">
    <!-- 배경 색상 변경 -->
    <div class="thumb-bg" style="--c1:#FFF0F3; --c2:#FFD6E0;"></div>

    <!-- 이모지 대신 실제 이미지 사용 시 -->
    <!-- <img src="assets/screenshot1.png" alt=""> -->
    <span class="thumb-em">📋</span>

    <span class="type-pill">카테고리명</span>
  </div>
  <div class="cbody">
    <!-- 상태 클래스: on(운영 중) / try(시범 운영) / dev(개발 중) -->
    <div class="chip on">운영 중</div>
    <div class="ct">과제 제목</div>
    <div class="cd">과제 설명 (2~3줄)</div>
    <div class="kpis">
      <div class="kpi"><div class="kv">수치</div><div class="kl">라벨</div></div>
      <div class="kpi"><div class="kv">수치</div><div class="kl">라벨</div></div>
      <div class="kpi"><div class="kv">수치</div><div class="kl">라벨</div></div>
    </div>
    <div class="cfooter">
      <!-- href에 실제 서비스 URL 입력 -->
      <a href="https://실제URL" class="btn-go">바로가기 →</a>
      <a href="#" class="btn-more">⋯</a>
    </div>
  </div>
</div>
```

---

### 스크린샷 이미지 교체

1. `assets/` 폴더에 이미지 파일 넣기
2. `index.html`에서 `<span class="thumb-em">` 부분을 아래로 교체:

```html
<img src="assets/파일명.png" alt="서비스 스크린샷">
```

---

### 히어로 숫자 변경 (`index.html`)

```html
<span class="counter" data-t="8">0</span>   <!-- 8 → 실제 과제 수로 변경 -->
<span class="counter" data-t="1240">0</span> <!-- 이용 직원 수 -->
<span class="counter" data-t="93">0</span>   <!-- 만족도 % -->
```

---

### 스플래시 속도 조절 (`js/main.js`)

`TIMINGS` 객체의 숫자(ms)를 조절합니다.

```js
const TIMINGS = {
  line1: 1000,  // "현장에서" 등장 시점
  line2: 1420,  // "시작한"
  line3: 1880,  // "AI 혁신이"
  line4: 2360,  // "공단을 바꿉니다"
  auto:  7200,  // 자동 전환 시점 (줄이면 더 빠르게 넘어감)
};
```

---

### 공단 레드 색상 변경 (`css/style.css`)

`:root` 최상단에서 수정:

```css
:root {
  --red: #C8002E;  /* 메인 레드 */
}
```

---

## 배포 방법 (Vercel 기준)

1. [vercel.com](https://vercel.com) 접속 → 회원가입
2. "Add New Project" → 폴더 전체 드래그 업로드
3. 자동 배포 완료 → `https://xxx.vercel.app` URL 생성
4. URL로 QR 코드 생성 (qr.io 등)
