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


// 카드 저장
document.querySelector('#joinbtn').addEventListener('click', async (e) => {
    let image = $('#image').val();
    let name = $('#name').val();
    let blog = $('#blog').val();
    let github = $('#github').val();
    let scontent = $('#scontent').val();
    let bcontent = $('#bcontent').val();
    let mbti = $('#mbti').val();

    let doc = {  // firebase 데이터 값 저장
        'image': image,
        'name': name,
        'blog': blog,
        'github': github,
        'scontent': scontent,
        'bcontent': bcontent,
        'mbti': mbti,
        'timestamp': new Date()  // 현재 시간 추가
    };

    try {
        await addDoc(collection(db, "memcard"), doc);
        alert('저장 완료!');
        window.location.reload();
    } catch (error) {
        alert("카드를 저장하는 중 오류가 발생했습니다.");
    }
});