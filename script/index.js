/**
 * English Janala - Core JS Logic
 * Fully functional with Vanilla JS
 */

const API_BASE = "https://openapi.programming-hero.com/api";

// DOM Elements
const levelContainer = document.getElementById("level-container");
const wordContainer = document.getElementById("word-container");
const modalOverlay = document.getElementById("modal-overlay");
const modalWordTitle = document.getElementById("modal-word-title");
const modalMeaning = document.getElementById("modal-meaning");
const modalPronunciation = document.getElementById("modal-pronunciation");
const closeModal = document.getElementById("close-modal");

/**
 * Fetch and display all lesson levels
 */
const loadLessons = async () => {
    try {
        const res = await fetch(`${API_BASE}/levels/all`);
        const json = await res.json();
        displayLesson(json.data);
    } catch (error) {
        console.error("Error loading lessons:", error);
        levelContainer.innerHTML = `<p class="error-msg">Failed to load lessons. Please try again later.</p>`;
    }
};

/**
 * Display the lesson buttons
 */
const displayLesson = (lessons) => {
    if (!lessons || lessons.length === 0) return;
    
    levelContainer.innerHTML = ""; // Clear loader
    
    lessons.forEach(lesson => {
        const btn = document.createElement("button");
        btn.id = `lesson-btn-${lesson.level_no}`;
        btn.className = "lesson-btn";
        btn.innerHTML = `<i class="fa-solid fa-book-open"></i> Lesson-${lesson.level_no}`;
        btn.onclick = () => loadLevelWord(lesson.level_no);
        levelContainer.append(btn);
    });
};

/**
 * Fetch and display words for a specific level
 */
const loadLevelWord = async (id) => {
    try {
        // Update active state
        removeActive();
        const clickedBtn = document.getElementById(`lesson-btn-${id}`);
        if(clickedBtn) clickedBtn.classList.add("active");
        
        // Show loading state in word container
        wordContainer.innerHTML = `<div class="loading-spinner">Loading vocabulary for Lesson ${id}...</div>`;

        const res = await fetch(`${API_BASE}/level/${id}`);
        const data = await res.json();
        
        displayLevelWord(data.data);
        
        // Scroll to words section smoothly
        document.getElementById("words-section").scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error("Error loading level words:", error);
        wordContainer.innerHTML = `<div class="empty-state"><p>Error loading words. Check your connection.</p></div>`;
    }
};

/**
 * Display the word cards
 */
const displayLevelWord = (words) => {
    wordContainer.innerHTML = "";

    if (!words || words.length === 0) {
        wordContainer.innerHTML = `
            <div class="empty-state">
                <img src="./assets/alert-error.png" alt="No data">
                <p class="font-bangla" style="color: var(--text-muted);">এই Lesson এ এখনো কোনো Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-bangla" style="font-size: 2rem;">পরবর্তী Lesson ট্রাই করুন!</h2>
            </div>`;
        return;
    }

    words.forEach(word => {
        const card = document.createElement("div");
        card.className = "word-card";
        
        const safeWord = word.word || "শব্দ পাওয়া যায়নি";
        const safeMeaning = word.meaning || "অর্থ পাওয়া যায়নি";
        const safePronunciation = word.pronunciation || "প্রোনানসিয়েশন পাওয়া যায়নি";

        card.innerHTML = `
            <h2 class="word-title">${safeWord}</h2>
            <div class="word-meaning font-bangla">${safeMeaning}</div>
            <div class="word-pronunciation" style="color: var(--text-muted)">(${safePronunciation})</div>
            <div class="word-actions">
                <button class="icon-btn info-btn" title="View Info">
                    <i class="fa-solid fa-circle-info"></i>
                </button>
                <button class="icon-btn volume-btn" title="Listen">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
        `;

        // Action: Info (Modal)
        card.querySelector('.info-btn').onclick = () => showWordModal(word);

        // Action: Volume (TTS)
        card.querySelector('.volume-btn').onclick = () => speakWord(safeWord);

        wordContainer.append(card);
    });
};

/**
 * Remove active class from all lesson buttons
 */
const removeActive = () => {
    document.querySelectorAll(".lesson-btn").forEach(btn => btn.classList.remove("active"));
};

/**
 * Show Modal with detailed word info
 */
const showWordModal = (word) => {
    modalWordTitle.innerText = word.word || "Unknown";
    modalMeaning.innerText = word.meaning || "N/A";
    modalPronunciation.innerText = word.pronunciation || "N/A";
    modalOverlay.style.display = "flex";
};

// Close Modal
const hideModal = () => {
    modalOverlay.style.display = "none";
};

closeModal.onclick = hideModal;
window.onclick = (e) => {
    if (e.target === modalOverlay) hideModal();
};

/**
 * Text-to-Speech Implementation
 */
const speakWord = (text) => {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Sorry, your browser doesn't support text-to-speech.");
    }
};

// Simple simulation for Getting Started
const getStartedBtn = document.querySelector(".btn-primary");
getStartedBtn.onclick = () => {
    const nameInput = document.querySelector(".input-field[placeholder='Enter Your Name']");
    if(nameInput && nameInput.value.trim()){
        alert(`Welcome, ${nameInput.value}! let's start learning.`);
        document.getElementById("lessons-section").scrollIntoView({ behavior: "smooth" });
    } else {
        alert("Please enter your name first!");
    }
}

// Initial Call
loadLessons();
