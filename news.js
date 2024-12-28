// 뉴스 데이터를 HTML로 생성하는 함수
function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';  // 기존 뉴스 삭제

    if (articles.length === 0) {
        newsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
        return;
    }

    // 뉴스 항목을 HTML로 생성
    articles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');

        const title = document.createElement('h2');
        title.textContent = article.title || '제목 없음';  // 제목이 없으면 '제목 없음'으로 표시

        const link = document.createElement('a');
        link.href = article.url;
        link.target = '_blank';
        link.textContent = '자세히 보기';

        // 생성한 요소들을 뉴스 항목에 추가
        newsItem.appendChild(title);
        newsItem.appendChild(link);

        // 뉴스 항목을 컨테이너에 추가
        newsContainer.appendChild(newsItem);
    });
}

// 검색 버튼 클릭 시 실행되는 함수
document.getElementById('searchButton').addEventListener('click', () => {
    const keyword = document.getElementById('searchKeyword').value.trim();  // 입력된 키워드 가져오기

    if (!keyword) {
        alert('검색어를 입력하세요');
        return;
    }

    // 검색어에 맞는 뉴스 항목을 가져오는 함수 호출
    fetchHackerNews(keyword);
});

// 엔터키로 검색할 수 있도록 처리
document.getElementById('searchKeyword').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const keyword = document.getElementById('searchKeyword').value.trim();
        if (keyword) {
            fetchHackerNews(keyword);
        }
    }
});

// Hacker News API에서 뉴스 가져오기
function fetchHackerNews(keyword = '') {
    let url = 'https://hn.algolia.com/api/v1/search?query=&tags=story&hitsPerPage=7';  // 기본은 인기 뉴스, 7개 항목만
    if (keyword) {
        url = `https://hn.algolia.com/api/v1/search?query=${keyword}&tags=story&hitsPerPage=7`;  // 키워드로 뉴스 검색, 7개 항목만
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.hits.length === 0) {
                alert('검색 결과가 없습니다.');
                return;
            }

            // 뉴스 항목을 HTML로 생성하여 표시
            displayNews(data.hits);
        })
        .catch(error => {
            alert('뉴스를 가져오는 데 실패했습니다');
            console.error('Error fetching data:', error);
        });
}

// 페이지 로드 시 인기 뉴스 불러오기
fetchHackerNews();
