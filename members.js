import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc, getDocs, query, orderBy, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAGLavPX9JEbTXPFn1Mb5-GR7CP5s8zvPk",
    authDomain: "sparta-8a3f8.firebaseapp.com",
    projectId: "sparta-8a3f8",
    storageBucket: "sparta-8a3f8.firebasestorage.app",
    messagingSenderId: "802229582034",
    appId: "1:802229582034:web:18e0b25b531e37085f950b",
    measurementId: "G-GP94P2EY1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let idxarr = [];
let idx = 1;

// Firestore에서 시간순으로 데이터 읽기
const q = query(collection(db, "memcard"), orderBy("timestamp"));  // timestamp 기준으로 정렬
const querySnapshot = await getDocs(q);

if (!querySnapshot.empty) {
    // 데이터를 받아와서 카드 HTML 생성
    querySnapshot.forEach((doc) => {
        let row = doc.data();
        let docId = doc.id;
        let image = row['image'];
        let name = row['name'];
        let blog = row['blog'];
        let github = row['github'];
        let scontent = row['scontent'];
        let bcontent = row['bcontent'];
        let mbti = row['mbti'];

        let temp_html = `            
        <div class="card" id='card-${docId}' data-index='${idx}' data-id="${docId}">
        <div class="" id='checknum${idx}' data-turn='${idx}'>
        <div class="introImg">
            <img src="${image}" alt="내 사진">
            <label class="name" for="Name"><p contenteditable="false" class="editable " data-field="name" data-id="${docId}" placeholder="이름">${name}</p></label>
            <label class="mbti" for="modMbti"><p contenteditable="false" class="editable " data-field="mbti" data-id="${docId}" placeholder="MBTI">${mbti}</p></label>
            <label class="blog" for="modBlog"><i class="fa-brands fa-blogger-b"></i><p contenteditable="false" class="editable " data-field="blog" data-id="${docId}" placeholder="블로그 주소"><a href="${blog}">${blog}</a></p></label>
            <label class="github" for="modGithub"><i class="fa-brands fa-github"></i><p contenteditable="false" class="editable " data-field="github" data-id="${docId}" placeholder="git 주소"><a href="${github}">${github}</a></p></label>
            
            </div>
        <div class="">
            <p contenteditable="false" class="editable URL" data-field="image" data-id="${docId}" placeholder="사진" style="display:none">${image}</p>
        </div>
        <div class="">
            <label for="modScon">좌우명</label>
            <p contenteditable="false" class="editable " data-field="scontent" data-id="${docId}" placeholder="좌우명">${scontent}</p>
        </div>
        <div class="">
            <label for="modBcon">자기 소개</label>
            <p contenteditable="false" class="editable " data-field="bcontent" data-id="${docId}" placeholder="자기 소개">${bcontent}</p>
        </div>
        <button class="extendBtn fa-solid fa-maximize"  data-index='${idx}'><i></i></button>
        <button class="editBtn fa-solid fa-pen-to-square" data-id="${docId}" placeholder="사진"><i></i></button>
        <button class="saveBtn fa-solid fa-floppy-disk" data-id="${docId}" style="display:none;" placeholder="사진"><i></i></button>
        <button class="deleteBtn fa-solid fa-trash" data-id="${docId}" placeholder="사진"><i></i></button>
        </div>
        </div>`;

        // 새 카드 HTML을 DOM에 추가
        const cardSlot = document.getElementById('cardSlot');
        cardSlot.insertAdjacentHTML('beforeend', temp_html);

        const cn = document.getElementById(`checknum${idx}`);
        const dataTurn = cn.getAttribute('data-turn');

        if (dataTurn % 2 === 0) {
            cn.classList.add('even');
        } else {
            cn.classList.add('odd');
        }

        idx++;

    });
} else {
    alert("멤버카드를 추가해주세요.");
}

// 수정 버튼 이벤트 리스너
document.querySelectorAll('.editBtn').forEach((edit) => {   // editbtn 클래스를 가진 모든 버튼 (수정 버튼) 호출
    edit.addEventListener('click', (event) => {   // 클릭 이벤트 추가
        let docId = event.target.dataset.id;   // 클릭된 editbtn의 파이어베이스 memcard(docId)를 가져옴
        let card = document.querySelector(`#card-${docId}`);   // 해당된 card 아이디의 temp_html 호출
        let editableFields = card.querySelectorAll('.editable');   // temp_html 안에 모든 editable 클래스 호출

        editableFields.forEach((field) => {
            field.setAttribute('contenteditable', 'true');   // contenteditable 로 true 요소를 편집 가능하게 함
            field.classList.add('form-control');   // editable 클래스가 있는 요소에 form-control 클래스 추가
        });

        card.querySelector('.URL').style.display = 'block'   // image 주소가 적혀있는 박스를 block
        card.querySelector('.editBtn').style.display = 'none';   // 수정 버튼 숨김
        card.querySelector('.saveBtn').style.display = 'inline-block';   // 완료 버튼 보이기
    });
});

// 완료 버튼 이벤트 리스너
document.querySelectorAll('.saveBtn').forEach((save) => {   // savebtn 클래스를 가진 모든 버튼 (완료 버튼) 호출
    save.addEventListener('click', async (event) => {   // 클릭 이벤트 추가
        let docId = event.target.dataset.id;   // 클릭된 savebtn의 파이어베이스 memcard(docId)를 가져옴
        let card = document.querySelector(`#card-${docId}`);   // 해당된 card 아이디의 temp_html 호출
        let editableFields = card.querySelectorAll('.editable');   // temp_html 안에 모든 editable 요소 호출

        let editableImg = card.querySelector('.introImg img');   // 이미지 요소 호출
        let editableImgField = card.querySelector('.URL');   // URL 주소 호출

        let updates = {};   // 파이어베이스에 업데이트 될 데이터를 저장할 객체

        editableFields.forEach((field) => {
            let fieldName = field.dataset.field;   // 데이터 이름 (image, name ,mbti, scontent, bcontent, blog, github)
            let fieldValue = field.textContent.trim();   // 데이터 안에 들어갈 내용
            updates[fieldName] = fieldValue;   // 데이터를 객체에 저장
            if (fieldName === 'image') {
                editableImg.src = fieldValue;   // 이미지 주소 src에 넣기
            }
        });

        await updateDoc(doc(db, "memcard", docId), updates);   // 파이어베이스 memcard에 데이터 업데이트

        editableFields.forEach((field) => {
            field.setAttribute('contenteditable', 'false');   // false 로 수정 비활성화
            field.classList.remove('form-control'); // form-control 클래스 제거
        });

        card.querySelector('.URL').style.display = 'none'   // image 주소가 적혀있는 필드를 숨김
        card.querySelector('.saveBtn').style.display = 'none';   // 완료 버튼 숨김
        card.querySelector('.editBtn').style.display = 'inline-block';   // 수정 버튼 보이기

        alert('수정이 완료되었습니다!');
    });
});

// 삭제 버튼 리벤트 리스너
document.querySelectorAll('.deleteBtn').forEach((del) => {
    del.addEventListener('click', async (event) => {
        let docId = event.target.dataset.id;   // 클릭된 deletebtn의 파이어베이스 memcard(docId)를 가져옴

        if (confirm('정말 삭제하시겠습니까?')) {   // 확인 창을 열고 확인을 받으면
            await deleteDoc(doc(db, "memcard", docId));   // 파이어베이스내의 해당 memcard 문서 삭제
            alert('삭제가 완료되었습니다!');   // 삭제 완료 경고창 표시
            window.location.reload();   // 페이지 새로고침
        }
    });
});

// extendBtn 버튼 요소들을 모두 선택
const buttons = document.querySelectorAll('.extendBtn');

// 각 버튼에 대해 클릭 이벤트 처리
buttons.forEach((button) => {
    const cardId = button.getAttribute('data-index');
    let cardState = localStorage.getItem(cardId);

    const openCard = (card) => {
        card.classList.add('opened');
        localStorage.setItem(cardId, 'active');  // 상태를 active로 저장
    };

    const closeCard = (card) => {
        card.classList.remove('opened');
        localStorage.setItem(cardId, null);  // 상태를 null로 저장
    };

    // 페이지 로드 시 기존 상태가 있으면 그에 맞는 클래스 추가
    const parentCard = button.closest('.card');
    if (parentCard && cardState === 'active') {
        openCard(parentCard);
    }

    // 버튼 클릭 시 상위 카드의 상태를 변경
    button.addEventListener('click', () => {
        const parentCard = button.closest('.card'); // 상위 div(class card) 찾기
        if (!parentCard) return; // 상위 카드가 없으면 중단

        cardState = localStorage.getItem(cardId);  // 상태를 새로 가져옴
        cardState !== 'active' ? openCard(parentCard) : closeCard(parentCard);
    });
});