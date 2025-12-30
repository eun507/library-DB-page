// 전역 변수 설정
let allData = [];
const PREVIEW_COUNT = 3; 
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('searchInput');

// 모달 관련 요소 가져오기
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("expandedImg");
const captionText = document.getElementById("caption");
const closeSpan = document.getElementsByClassName("close")[0];

// 1. 데이터 로드
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        allData = data;
        renderItems(allData.slice(0, PREVIEW_COUNT)); 
    })
    .catch(error => console.error('Error loading data:', error));

// 2. 화면 그리기 함수
function renderItems(items) {
    items.forEach(dept => {
        const section = document.createElement('div');
        section.className = 'dept-section';
        
        section.innerHTML = `
            <div class="dept-header">
                <span>Subject Analysis</span>
                <h2>${dept.name}</h2>
            </div>
            
            <div class="viz-layout">
                <div class="viz-box sankey-box">
                    <h3>Curriculum Flow</h3>
                    <iframe src="${dept.sankeyHtml}" width="100%" height="600" loading="lazy"></iframe>
                </div>
                
                <div class="viz-right-col">
                    <div class="viz-box wc-box">
                        <h3>Keyword Cloud</h3>
                        <img src="${dept.wordcloudPng}" alt="워드클라우드" class="wc-img">
                    </div>
                    
                    <div class="viz-box semantic-box">
                        <h3>Semantic Network</h3>
                        <img src="${dept.semanticNetworkPng}" 
                             alt="${dept.name} 시맨틱 네트워크" 
                             class="wc-img clickable-img">
                        <p style="text-align:center; font-size:0.8rem; color:#888; margin-top:5px;">(클릭하여 확대보기)</p>
                    </div>
                </div>
            </div>
        `;
        
        gallery.appendChild(section);
        setTimeout(() => section.classList.add('visible'), 100);
    });
}

// 3. [핵심 수정] 이벤트 위임 방식으로 클릭 감지 (훨씬 안정적임)
gallery.addEventListener('click', function(e) {
    // 클릭된 요소가 'clickable-img' 클래스를 가지고 있는지 확인
    if (e.target.classList.contains('clickable-img')) {
        modal.style.display = "block";
        modalImg.src = e.target.src;
        captionText.innerHTML = e.target.alt;
    }
});

// 4. 모달 닫기 기능들
// X 버튼 클릭 시 닫기
if (closeSpan) {
    closeSpan.onclick = function() { 
        modal.style.display = "none";
    }
}

// 배경 클릭 시 닫기
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 5. '전체 보기' 버튼 & 검색 기능 (기존 동일)
loadMoreBtn.addEventListener('click', () => {
    const remainingData = allData.slice(PREVIEW_COUNT);
    renderItems(remainingData);
    loadMoreBtn.style.display = 'none'; 
});

searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    gallery.innerHTML = '';
    
    if (keyword.length > 0) {
        const filtered = allData.filter(dept => dept.name.includes(keyword));
        if(filtered.length === 0) {
            gallery.innerHTML = '<p style="text-align:center; padding:50px;">검색 결과가 없습니다.</p>';
        } else {
            renderItems(filtered);
        }
        loadMoreBtn.style.display = 'none'; 
    } else {
        renderItems(allData.slice(0, PREVIEW_COUNT));
        loadMoreBtn.style.display = 'inline-block';
    }
});

function scrollToSearch() {
    const searchSec = document.getElementById('search-section');
    if(searchSec) searchSec.scrollIntoView({ behavior: 'smooth' });
}