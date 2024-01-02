// script.js

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; 
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; 
};

const generateResponse = (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    const lowercaseUserMessage = userMessage.toLowerCase();
    const lowercaseDataKeys = Object.keys(customData).map(key => key.toLowerCase());

    const matchIndex = lowercaseDataKeys.indexOf(lowercaseUserMessage);
    if (matchIndex !== -1) {
        const matchedKey = Object.keys(customData)[matchIndex];
        messageElement.textContent = customData[matchedKey];
    } else {
        const partialMatches = lowercaseDataKeys.filter(key => key.includes(lowercaseUserMessage));

        if (partialMatches.length > 0) {
            const randomIndex = Math.floor(Math.random() * partialMatches.length);
            const matchedKey = Object.keys(customData)[lowercaseDataKeys.indexOf(partialMatches[randomIndex])];
            messageElement.textContent = customData[matchedKey];
        } else {
            const lowercaseGeneralPhrases = lowercaseDataKeys.filter(key => customData[key] instanceof Array);
            const matchedGeneralPhrases = lowercaseGeneralPhrases
                .flatMap(key => customData[key].filter(phrase => phrase.toLowerCase().includes(lowercaseUserMessage)));

            if (matchedGeneralPhrases.length > 0) {
                const randomIndex = Math.floor(Math.random() * matchedGeneralPhrases.length);
                messageElement.textContent = matchedGeneralPhrases[randomIndex];
            } else {
                messageElement.classList.add("error");
                messageElement.textContent = customData.unknown;
            }
        }
    }

    chatbox.scrollTo(0, chatbox.scrollHeight);
};


const getGeneralPhrases = (userMessage) => {
    const keys = Object.keys(customData);
    const generalPhrases = keys.filter(key => key !== "unknown" && customData[key] instanceof Array);
    const matchedPhrases = [];

    for (const key of generalPhrases) {
        for (const phrase of customData[key]) {
            if (phrase.toLowerCase().includes(userMessage.toLowerCase())) {
                matchedPhrases.push(phrase);
            }
        }
    }

    return matchedPhrases;
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
