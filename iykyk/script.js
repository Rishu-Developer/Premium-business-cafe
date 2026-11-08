
/* ==========================================
   AURA - A LITTLE WORLD FOR CHAHAT
   20 CHAPTERS | 400 PAGES
========================================== */

const TOTAL_PAGES = 400;
const PAGES_PER_CHAPTER = 20;

const chapters = [
    "A Little Beginning",
    "The Girl Named Chahat",
    "Your Beautiful Smile",
    "Little Things About You",
    "The Magic of Your Eyes",
    "Your Beautiful Heart",
    "Things I Never Said",
    "A Thousand Feelings",
    "The Moon and You",
    "Your Little World",
    "Memories and Moments",
    "Your Cute Side",
    "The Things I Admire",
    "If Words Could Speak",
    "A Little Appreciation",
    "Dreams and Wishes",
    "A Beautiful Soul",
    "The Unwritten Pages",
    "A Letter to You",
    "Until the Last Page"
];

const chapterMessages = [
    "Every beautiful story begins with a little moment. This collection is one such little beginning.",
    "Your name has its own little charm. Chahat, a name that sounds like something beautiful.",
    "A smile can make an ordinary moment feel special. Never underestimate the beauty of yours.",
    "Sometimes it is the smallest details that make someone memorable.",
    "There is something magical about the way eyes can express feelings without saying a word.",
    "Beauty is not only about appearance. A kind heart makes a person even more beautiful.",
    "Some thoughts are difficult to say aloud, so they find a home between these pages.",
    "Feelings are sometimes too big for ordinary words. This little book is my attempt.",
    "Like the moon in a quiet night, some things are beautiful simply because they exist.",
    "Everyone deserves a little world where they can feel appreciated and understood.",
    "Memories do not always need grand occasions. Sometimes ordinary moments become special.",
    "Your playful side, your little habits and your unique way of being make you you.",
    "There are countless little things worth appreciating about a person.",
    "If words could speak perfectly, perhaps these pages would still have more to say.",
    "A little appreciation can brighten an ordinary day. You deserve kindness and respect.",
    "May your dreams grow bigger and your courage grow stronger with every passing day.",
    "A beautiful soul is something that deserves appreciation beyond appearances.",
    "Not every story has to be perfectly written. Some pages are beautiful because they are honest.",
    "This is a small letter made of thoughts that deserved a place of their own.",
    "And even when the last page arrives, the kindness in these words can remain."
];

const pageVariations = [
    "There are little things in life that make a day feel brighter. Sometimes, simply remembering them is enough.",
    "You do not have to be perfect to be wonderful. Being yourself is already something worth celebrating.",
    "I hope you always find reasons to smile, people who understand you and moments that make you feel peaceful.",
    "Some people bring a different kind of warmth into ordinary conversations. That little warmth matters.",
    "May you never forget how much your dreams, your happiness and your peace are worth.",
    "There is beauty in being different. Never feel that you have to become someone else to be appreciated.",
    "A simple moment can hold a thousand feelings. Not everything beautiful needs a grand explanation.",
    "I hope life surprises you with beautiful opportunities and gives you the courage to take them.",
    "You deserve conversations where you feel heard, friendships where you feel safe and moments where you feel free.",
    "Sometimes the best thing you can do is pause, breathe and appreciate how far you have come.",
    "Your happiness matters. Keep making space for the things that make your heart feel light.",
    "Never let a difficult day convince you that beautiful days are not waiting ahead.",
    "There is no deadline for becoming the person you dream of being. Grow at your own pace.",
    "The little things you may overlook can be the things that make you uniquely special.",
    "May your heart always have room for kindness, laughter, hope and new beginnings.",
    "You deserve respect not only on special days but in all the ordinary moments too.",
    "A beautiful future is built through little steps, patient choices and the courage to keep going.",
    "I hope you always find a reason to believe in yourself, even on days when things feel difficult.",
    "Some words are written to be read slowly, with a smile and a little peace in your heart.",
    "This page is a small reminder that your story is still unfolding, and there is so much ahead."
];


/* ==========================================
   ELEMENTS
========================================== */

const chapterGrid = document.getElementById("chapterGrid");
const pageNumber = document.getElementById("pageNumber");
const totalPages = document.getElementById("totalPages");
const pageChapter = document.getElementById("pageChapter");
const pageTitle = document.getElementById("pageTitle");
const pageContent = document.getElementById("pageContent");
const pageFooterNumber = document.getElementById("pageFooterNumber");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const bookPage = document.getElementById("bookPage");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const readAloudBtn = document.getElementById("readAloudBtn");
const stopReadingBtn = document.getElementById("stopReadingBtn");

totalPages.textContent = TOTAL_PAGES;


/* ==========================================
   STATE
========================================== */

let currentPage = 1;
let isReading = false;
let isPaused = false;
let speechToken = 0;
let audioContext = null;


/* ==========================================
   GENERATE 400 PAGES
========================================== */

function getPageData(page) {

    const chapterIndex = Math.floor((page - 1) / PAGES_PER_CHAPTER);
    const localPage = (page - 1) % PAGES_PER_CHAPTER;

    const chapterName = chapters[chapterIndex];

    const opening = chapterMessages[chapterIndex];
    const variation = pageVariations[localPage];

    const titles = [
        "A Thought for You",
        "Something Beautiful",
        "A Little Reminder",
        "Words from the Heart",
        "A Special Little Moment"
    ];

    const title = localPage === 0
        ? chapterName
        : titles[(localPage + chapterIndex) % titles.length];

    const content = opening + "\n\n" + variation;

    return {
        chapter: chapterIndex + 1,
        chapterName,
        title,
        content,
        page
    };
}


/* ==========================================
   CHAPTER GENERATION
========================================== */

function generateChapters() {

    chapterGrid.innerHTML = "";

    chapters.forEach((chapter, index) => {

        const card = document.createElement("button");

        card.className = "chapter-card";
        card.type = "button";

        card.innerHTML = `
            <span class="chapter-number">
                CHAPTER ${(index + 1).toString().padStart(2, "0")}
            </span>
            <span class="chapter-name">${chapter}</span>
        `;

        card.addEventListener("click", () => {

            stopReading();

            const targetPage = index * PAGES_PER_CHAPTER + 1;

            showPage(targetPage, "next");

            document.getElementById("book").scrollIntoView({
                behavior: "smooth"
            });

        });

        chapterGrid.appendChild(card);

    });

}


/* ==========================================
   UPDATE ACTIVE CHAPTER
========================================== */

function updateActiveChapter() {

    const chapterIndex = Math.floor(
        (currentPage - 1) / PAGES_PER_CHAPTER
    );

    document.querySelectorAll(".chapter-card").forEach(
        (card, index) => {

            card.classList.toggle(
                "active",
                index === chapterIndex
            );

        }
    );

}


/* ==========================================
   SHOW PAGE
========================================== */

function showPage(page, direction = "next", withSound = false) {

    if (page < 1 || page > TOTAL_PAGES) return;

    currentPage = page;

    const data = getPageData(currentPage);

    bookPage.classList.remove("turn-next", "turn-prev");

    void bookPage.offsetWidth;

    bookPage.classList.add(
        direction === "prev" ? "turn-prev" : "turn-next"
    );

    pageNumber.textContent = String(currentPage).padStart(2, "0");

    pageFooterNumber.textContent = String(currentPage).padStart(2, "0");

    pageChapter.textContent =
        "CHAPTER " + String(data.chapter).padStart(2, "0");

    pageTitle.textContent = data.title;

    pageContent.textContent = data.content;

    const percentage = Math.round(
        (currentPage / TOTAL_PAGES) * 100
    );

    progressPercent.textContent = percentage + "%";

    progressFill.style.width = percentage + "%";

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === TOTAL_PAGES;

    prevBtn.style.opacity = currentPage === 1 ? "0.4" : "1";
    nextBtn.style.opacity = currentPage === TOTAL_PAGES ? "0.4" : "1";

    updateActiveChapter();

    if (withSound) {
        playPageSound();
    }

}


/* ==========================================
   PAGE NAVIGATION
========================================== */

nextBtn.addEventListener("click", () => {

    stopReading();

    if (currentPage < TOTAL_PAGES) {
        showPage(currentPage + 1, "next", true);
    }

});

prevBtn.addEventListener("click", () => {

    stopReading();

    if (currentPage > 1) {
        showPage(currentPage - 1, "prev", true);
    }

});


/* ==========================================
   REALISTIC PAPER TURN SOUND
   Generated using Web Audio API
========================================== */

function playPageSound() {

    try {

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const duration = 0.24;
        const bufferSize = Math.floor(
            audioContext.sampleRate * duration
        );

        const buffer = audioContext.createBuffer(
            1,
            bufferSize,
            audioContext.sampleRate
        );

        const channel = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {

            const fade = Math.pow(1 - i / bufferSize, 2);

            channel[i] = (Math.random() * 2 - 1) * fade;

        }

        const noise = audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = audioContext.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1100;

        const volume = audioContext.createGain();

        volume.gain.setValueAtTime(
            0.0001,
            audioContext.currentTime
        );

        volume.gain.exponentialRampToValueAtTime(
            0.12,
            audioContext.currentTime + 0.035
        );

        volume.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + duration
        );

        noise.connect(filter);
        filter.connect(volume);
        volume.connect(audioContext.destination);

        noise.start();
        noise.stop(audioContext.currentTime + duration);

    } catch (error) {
        console.log("Page sound unavailable:", error);
    }

}


/* ==========================================
   READ ALOUD
========================================== */

function readCurrentPage(token) {

    if (!isReading || isPaused || token !== speechToken) {
        return;
    }

    if (!("speechSynthesis" in window)) {
        alert("Your browser does not support Read Aloud.");
        stopReading();
        return;
    }

    const data = getPageData(currentPage);

    const textToRead =
        data.chapterName + ". " +
        data.title + ". " +
        data.content;

    const utterance = new SpeechSynthesisUtterance(textToRead);

    utterance.lang = "en-IN";
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {

        if (!isReading || token !== speechToken) return;

        if (currentPage < TOTAL_PAGES) {

            showPage(currentPage + 1, "next", true);

            setTimeout(() => {
                readCurrentPage(token);
            }, 900);

        } else {

            stopReading();

            alert("You have reached the last page. ❤️");

        }

    };

    utterance.onerror = (event) => {

        if (event.error === "interrupted" ||
            event.error === "canceled") return;

        console.log("Speech error:", event.error);

    };

    window.speechSynthesis.speak(utterance);

}


/* ==========================================
   READ BUTTON
========================================== */

readAloudBtn.addEventListener("click", () => {

    if (!("speechSynthesis" in window)) {
        alert("Please use Chrome or another supported browser.");
        return;
    }

    if (isReading && isPaused) {

        isPaused = false;

        window.speechSynthesis.resume();

        readAloudBtn.innerHTML = "🔊 Reading...";
        return;

    }

    if (isReading) {
        return;
    }

    isReading = true;
    isPaused = false;

    speechToken++;

    const token = speechToken;

    readAloudBtn.innerHTML = "🔊 Reading...";

    readAloudBtn.style.opacity = "0.7";

    readCurrentPage(token);

});


/* ==========================================
   STOP / PAUSE BUTTON
========================================== */

stopReadingBtn.addEventListener("click", () => {

    if (!isReading) return;

    if (!isPaused) {

        isPaused = true;

        window.speechSynthesis.pause();

        readAloudBtn.innerHTML = "▶ Resume Reading";

        return;

    }

    stopReading();

});


function stopReading() {

    isReading = false;
    isPaused = false;

    speechToken++;

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    readAloudBtn.innerHTML = "🔊 Read Aloud";

    readAloudBtn.style.opacity = "1";

}


/* ==========================================
   KEYBOARD CONTROLS
========================================== */

document.addEventListener("keydown", (event) => {

    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
    ) return;

    if (event.key === "ArrowRight") {
        stopReading();
        showPage(currentPage + 1, "next", true);
    }

    if (event.key === "ArrowLeft") {
        stopReading();
        showPage(currentPage - 1, "prev", true);
    }

});


/* ==========================================
   FLOATING PARTICLES
========================================== */

function createParticles() {

    const container = document.getElementById("particles");

    if (!container) return;

    for (let i = 0; i < 18; i++) {

        const particle = document.createElement("span");

        particle.innerHTML = "✦";

        particle.style.position = "fixed";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.bottom = "-20px";
        particle.style.fontSize = (8 + Math.random() * 10) + "px";
        particle.style.color = "#d6ad72";
        particle.style.opacity = "0.3";
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "0";

        particle.style.animation =
            `floatParticle ${10 + Math.random() * 12}s linear infinite`;

        particle.style.animationDelay =
            Math.random() * 12 + "s";

        container.appendChild(particle);

    }

}


/* ==========================================
   INITIALIZE WEBSITE
========================================== */

generateChapters();

createParticles();

showPage(1);

console.log("AURA initialized successfully!");
console.log("Total Chapters:", chapters.length);
console.log("Total Pages:", TOTAL_PAGES);
