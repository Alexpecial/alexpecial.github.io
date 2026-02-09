---
layout: default
title: Gallery
order: 10
photos:
  - filename: "20210110.jpg" 
    caption: "겨울의 시작, 서울" # 캡션 예시
  - filename: "20210424.jpg"
    caption: "따뜻했던 오후"
  - filename: "20210603.jpg"
    # 캡션이 없으면 생략 가능
  # 사진을 계속 추가하세요
---

<div class="gallery-container">
  {% for photo in page.photos %}
    <div class="gallery-item" onclick="openModal(this)" 
         data-src="{{ 'assets/photos/' | relative_url }}{{ photo.filename }}" 
         data-caption="{{ photo.caption | default: '' }}">
      
      <img src="{{ 'assets/photos/' | relative_url }}{{ photo.filename }}" 
           alt="{{ photo.caption | default: 'Gallery Image' }}" 
           loading="lazy">
      
      <div class="item-overlay">
        <span class="overlay-text">View</span>
      </div>
    </div>
  {% endfor %}
</div>

<div id="imageModal" class="modal" onclick="closeModal(event)">
  <span class="close-btn" onclick="closeModal(event)">&times;</span>
  <div class="modal-content-wrapper">
    <img class="modal-content" id="modalImg">
    <div id="modalCaption"></div>
  </div>
</div>

<style>
/* 1. 갤러리 컨테이너 (Masonry Layout) */
.gallery-container {
    column-count: 3; /* PC 3열 */
    column-gap: 20px;
    width: 100%;
    padding: 20px 0;
}

/* 2. 개별 아이템 스타일 */
.gallery-item {
    break-inside: avoid;
    margin-bottom: 20px;
    position: relative;
    border-radius: 16px; /* 더 둥글고 부드럽게 */
    overflow: hidden;
    cursor: zoom-in;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: #f0f0f0; /* 로딩 전 배경색 */
}

.gallery-item img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.5s ease;
}

/* 3. 호버 효과 (PC) */
.gallery-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.2);
}

.gallery-item:hover img {
    transform: scale(1.03);
}

/* 호버 오버레이 (어두운 막 + 텍스트) */
.item-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.gallery-item:hover .item-overlay {
    opacity: 1;
}

.overlay-text {
    color: white;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 1px;
    border: 1px solid rgba(255,255,255,0.6);
    padding: 8px 16px;
    border-radius: 20px;
    backdrop-filter: blur(4px);
}

/* 4. 모달 (라이트박스) 스타일 */
.modal {
    display: none; /* 평소엔 숨김 */
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.85); /* 짙은 배경 */
    backdrop-filter: blur(8px); /* 배경 블러 처리 (트렌디함) */
    opacity: 0;
    transition: opacity 0.3s ease;
}

.modal.show {
    opacity: 1;
}

.modal-content-wrapper {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90%;
    max-height: 90%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal-content {
    max-width: 100%;
    max-height: 80vh;
    border-radius: 8px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    object-fit: contain;
}

#modalCaption {
    margin-top: 15px;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 300;
    text-shadow: 0 2px 4px rgba(0,0,0,0.8);
    opacity: 0.9;
}

/* 닫기 버튼 */
.close-btn {
    position: absolute;
    top: 20px;
    right: 30px;
    color: #f1f1f1;
    font-size: 40px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.2s;
    z-index: 1001;
}

.close-btn:hover {
    color: #bbb;
}

/* 5. 반응형 미디어 쿼리 */
@media screen and (max-width: 980px) {
    .gallery-container { column-count: 2; }
}

@media screen and (max-width: 600px) {
    .gallery-container { column-count: 1; }
    .gallery-item:hover { transform: none; } /* 모바일에서는 호버 효과 제거 */
    .item-overlay { display: none; } /* 모바일에서는 오버레이 제거하고 바로 클릭 */
}
</style>

<script>
// 모달 열기 함수
function openModal(element) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const captionText = document.getElementById("modalCaption");

    // 데이터 속성에서 이미지 주소와 캡션 가져오기
    const src = element.getAttribute("data-src");
    const caption = element.getAttribute("data-caption");

    modal.style.display = "block";
    
    // 약간의 딜레이를 주어 CSS transition(페이드인)이 먹히게 함
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);

    modalImg.src = src;
    captionText.innerHTML = caption ? caption : ""; // 캡션이 없으면 빈칸
    
    // 스크롤 방지
    document.body.style.overflow = "hidden";
}

// 모달 닫기 함수
function closeModal(event) {
    // 이미지 자체를 클릭했을 때는 닫히지 않게 (배경이나 X버튼 클릭 시에만)
    if (event.target.id === "modalImg") return;

    const modal = document.getElementById("imageModal");
    modal.classList.remove("show");
    
    setTimeout(() => {
        modal.style.display = "none";
        document.getElementById("modalImg").src = ""; // 이미지 초기화
    }, 300); // transition 시간과 맞춤

    // 스크롤 허용
    document.body.style.overflow = "auto";
}

// ESC 키로 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        const modal = document.getElementById("imageModal");
        if (modal.style.display === "block") {
            closeModal({ target: modal }); // 가짜 이벤트 객체 전달
        }
    }
});
</script>