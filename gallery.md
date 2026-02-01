---
layout: default
title: Gallery
image: ""
order: 10
# 여기에 사진 파일명을 리스트로 적어주세요 (assets/photos/ 폴더 기준)
photos:
  - filename: "20210110.jpg" # 예시: 실제 파일명으로 바꾸세요
  - filename: "20210424.jpg"
  - filename: "20210603.jpg"
  # 계속 추가 가능
---

<div class="iphone-gallery">
  {% for photo in page.photos %}
    <div class="gallery-item">
      <img src="{{ 'assets/photos/' | relative_url }}{{ photo.filename }}" alt="Gallery Image" loading="lazy">
    </div>
  {% endfor %}
</div>

<style>
/* 아이폰/핀터레스트 스타일의 Masonry 레이아웃 */
.iphone-gallery {
    column-count: 3; /* PC에서는 3열 */
    column-gap: 15px; /* 사진 사이 간격 */
    width: 100%;
}

.gallery-item {
    break-inside: avoid; /* 컬럼 중간에서 사진이 잘리지 않도록 함 */
    margin-bottom: 15px; /* 상하 간격 */
    border-radius: 12px; /* 아이폰처럼 둥근 모서리 */
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3); /* 살짝 그림자 */
    transition: transform 0.3s ease, filter 0.3s ease;
    cursor: pointer;
}

.gallery-item img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.5s ease;
}

/* 호버 효과 (마우스 올렸을 때) */
.gallery-item:hover {
    transform: translateY(-5px); /* 살짝 위로 떠오름 */
    box-shadow: 0 8px 20px rgba(0,0,0,0.5);
}

.gallery-item:hover img {
    transform: scale(1.05); /* 내부 이미지가 살짝 확대됨 */
}

/* 모바일 반응형 (화면이 작아지면 컬럼 수 조절) */
@media screen and (max-width: 980px) {
    .iphone-gallery {
        column-count: 2;
    }
}

@media screen and (max-width: 480px) {
    .iphone-gallery {
        column-count: 1; /* 아주 작은 화면에서는 1열 */
    }
}
</style>