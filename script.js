// ============================================
// LUX AI
// ============================================


// ============================================
// DOM ELEMENTS
// ============================================

const input =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const messages =
    document.getElementById("messages");

const welcome =
    document.getElementById("welcome");

const uploadBtn =
    document.getElementById("uploadBtn");

const fileInput =
    document.getElementById("fileInput");

const attachmentPreview =
    document.getElementById(
        "attachmentPreview"
    );

const newChat =
    document.getElementById("newChat");

const clearChat =
    document.getElementById("clearChat");

const chatHistory =
    document.getElementById("chatHistory");


// ============================================
// SIDEBAR BUTTONS
// ============================================

const settingsBtn =
    document.getElementById("settingsBtn");

const privateBtn =
    document.getElementById("privateBtn");

const aboutBtn =
    document.getElementById("aboutBtn");


// ============================================
// USER ACCOUNT
// ============================================

const userNameElement =
    document.getElementById("userName");

let savedAccount = null;

try {

    savedAccount =
        JSON.parse(
            localStorage.getItem("luxAccount")
        );

} catch (error) {

    console.error(
        "Account data error:",
        error
    );

    savedAccount = null;
}


// Show account name

if (
    userNameElement &&
    savedAccount &&
    savedAccount.name
) {

    userNameElement.textContent =
        savedAccount.name;

} else if (userNameElement) {

    userNameElement.textContent =
        "Guest";
}


// ============================================
// FLOWISE URL
// ============================================

const FLOWISE_URL =
    "http://localhost:3000/api/v1/prediction/f97767e1-685d-4f53-97e2-5e168cf6c7ce";


// ============================================
// VARIABLES
// ============================================

let selectedImages = [];

let savedChats = [];

try {

    savedChats =
        JSON.parse(
            localStorage.getItem("luxChats")
        ) || [];

} catch (error) {

    console.error(
        "Chat history error:",
        error
    );

    savedChats = [];
}


// ============================================
// FILE → DATA URL
// ============================================

function fileToDataURL(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    resolve(
                        reader.result
                    );
                };


            reader.onerror =
                () => {

                    reject(
                        reader.error
                    );
                };


            reader.readAsDataURL(file);
        }
    );
}


// ============================================
// ESCAPE HTML
// ============================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


// ============================================
// ADD MESSAGE
// ============================================

function addMessage(
    text,
    type,
    allowHTML = false
) {

    const message =
        document.createElement("div");


    message.className =
        "message " + type;


    const content =
        allowHTML
            ? text
            : escapeHTML(text);


    message.innerHTML = `
        <div class="message-avatar">
            ${
                type === "user"
                    ? "👤"
                    : "✦"
            }
        </div>

        <div class="message-content">
            ${content}
        </div>
    `;


    messages.appendChild(
        message
    );


    messages.scrollTop =
        messages.scrollHeight;


    return message;
}


// ============================================
// SHOW IMAGE PREVIEWS
// ============================================

function showImagePreviews() {

    attachmentPreview.innerHTML =
        "";


    if (
        selectedImages.length === 0
    ) {

        attachmentPreview.classList.remove(
            "active"
        );

        return;
    }


    attachmentPreview.classList.add(
        "active"
    );


    selectedImages.forEach(
        (file, index) => {

            const item =
                document.createElement("div");


            item.className =
                "attachment-item";


            const imageURL =
                URL.createObjectURL(
                    file
                );


            item.innerHTML = `
                <img
                    src="${imageURL}"
                    alt="Selected image"
                >

                <span class="attachment-name">
                    ${escapeHTML(
                        file.name
                    )}
                </span>

                <button
                    type="button"
                    class="remove-attachment"
                    title="Remove image"
                >
                    ×
                </button>
            `;


            attachmentPreview.appendChild(
                item
            );


            const removeBtn =
                item.querySelector(
                    ".remove-attachment"
                );


            removeBtn.addEventListener(
                "click",
                function () {

                    selectedImages.splice(
                        index,
                        1
                    );


                    showImagePreviews();


                    updateImagePlaceholder();
                }
            );
        }
    );
}


// ============================================
// IMAGE PLACEHOLDER
// ============================================

function updateImagePlaceholder() {

    if (
        selectedImages.length === 0
    ) {

        input.placeholder =
            "Ask LUX AI anything...";

        return;
    }


    if (
        selectedImages.length === 1
    ) {

        input.placeholder =
            "Ask about this image...";

        return;
    }


    input.placeholder =
        selectedImages.length +
        " images selected...";
}


// ============================================
// CLEAR IMAGE PREVIEW
// ============================================

function clearImagePreview() {

    attachmentPreview.innerHTML =
        "";

    attachmentPreview.classList.remove(
        "active"
    );
}


// ============================================
// CHAT TITLE
// ============================================

function getChatTitle() {

    const firstUserMessage =
        messages.querySelector(
            ".message.user .message-content"
        );


    if (!firstUserMessage) {

        return "New conversation";
    }


    let title =
        firstUserMessage.textContent.trim();


    if (title.length > 28) {

        title =
            title.substring(0, 28) +
            "...";
    }


    return title ||
        "New conversation";
}


// ============================================
// SAVE CHAT
// ============================================

function autoSaveCurrentChat() {

    const content =
        messages.innerHTML.trim();


    if (!content) {
        return;
    }


    const title =
        getChatTitle();


    if (
        savedChats.length > 0 &&
        savedChats[0].title === title
    ) {

        savedChats[0].content =
            content;

    } else {

        savedChats.unshift({

            id: Date.now(),

            title: title,

            content: content
        });
    }


    savedChats =
        savedChats.slice(0, 10);


    localStorage.setItem(
        "luxChats",
        JSON.stringify(
            savedChats
        )
    );


    loadChatHistory();
}


// ============================================
// LOAD RECENT CHATS
// ============================================

function loadChatHistory() {

    chatHistory.innerHTML =
        "";


    if (
        savedChats.length === 0
    ) {

        const item =
            document.createElement("div");


        item.className =
            "history-item";


        item.textContent =
            "💬 New conversation";


        item.addEventListener(
            "click",
            startNewChat
        );


        chatHistory.appendChild(
            item
        );


        return;
    }


    savedChats.forEach(
        (chat, index) => {

            const item =
                document.createElement("div");


            item.className =
                "history-item";


            item.textContent =
                "💬 " +
                (
                    chat.title ||
                    "Conversation " +
                    (index + 1)
                );


            item.addEventListener(
                "click",
                function () {

                    openChat(
                        chat.id
                    );
                }
            );


            chatHistory.appendChild(
                item
            );
        }
    );
}


// ============================================
// OPEN SAVED CHAT
// ============================================

function openChat(chatId) {

    const chat =
        savedChats.find(
            item =>
                item.id === chatId
        );


    if (!chat) {
        return;
    }


    messages.innerHTML =
        chat.content;


    welcome.style.display =
        "none";


    input.value =
        "";


    selectedImages = [];


    fileInput.value =
        "";


    clearImagePreview();


    input.placeholder =
        "Ask LUX AI anything...";


    messages.scrollTop =
        messages.scrollHeight;
}


// ============================================
// START NEW CHAT
// ============================================

function startNewChat() {

    messages.innerHTML =
        "";


    welcome.style.display =
        "block";


    input.value =
        "";


    selectedImages = [];


    fileInput.value =
        "";


    clearImagePreview();


    input.placeholder =
        "Ask LUX AI anything...";
}


// ============================================
// SEND MESSAGE
// ============================================

async function sendMessage() {

    const question =
        input.value.trim();


    if (
        !question &&
        selectedImages.length === 0
    ) {
        return;
    }


    welcome.style.display =
        "none";


    // ========================================
    // SHOW TEXT
    // ========================================

    if (question) {

        addMessage(
            question,
            "user"
        );
    }


    // ========================================
    // SHOW IMAGES
    // ========================================

    if (
        selectedImages.length > 0
    ) {

        let imageHTML =
            `<div class="chat-image-grid">`;


        selectedImages.forEach(
            file => {

                const imageURL =
                    URL.createObjectURL(
                        file
                    );


                imageHTML += `
                    <div class="chat-image-card">

                        <img
                            src="${imageURL}"
                            alt="Uploaded image"
                        >

                        <div class="chat-image-name">
                            📎 ${escapeHTML(
                                file.name
                            )}
                        </div>

                    </div>
                `;
            }
        );


        imageHTML +=
            "</div>";


        addMessage(
            imageHTML,
            "user",
            true
        );
    }


    input.value =
        "";


    // ========================================
    // TYPING
    // ========================================

    const typing =
        addMessage(
            "LUX AI is thinking...",
            "bot"
        );


    // ========================================
    // SEND TO FLOWISE
    // ========================================

    try {

        let uploads = [];


        // Convert all images

        for (
            const file of selectedImages
        ) {

            const imageData =
                await fileToDataURL(
                    file
                );


            uploads.push({

                data:
                    imageData,

                type:
                    "file",

                name:
                    file.name,

                mime:
                    file.type
            });
        }


        // ====================================
        // QUESTION
        // ====================================

        let finalQuestion =
            question;


        if (
            !finalQuestion &&
            selectedImages.length === 1
        ) {

            finalQuestion =
                "Tell me about this image.";
        }


        if (
            !finalQuestion &&
            selectedImages.length > 1
        ) {

            finalQuestion =
                "Analyze these images and describe or compare them.";
        }


        // ====================================
        // REQUEST BODY
        // ====================================

        const requestBody = {

            question:
                finalQuestion,

            uploads:
                uploads
        };


        console.log(
            "LUX AI Request:",
            requestBody
        );


        // ====================================
        // FETCH
        // ====================================

        const response =
            await fetch(
                FLOWISE_URL,
                {

                    method:
                        "POST",

                    headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                    body:
                        JSON.stringify(
                            requestBody
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                "Flowise HTTP Error: " +
                response.status
            );
        }


        // ====================================
        // RESPONSE
        // ====================================

        const data =
            await response.json();


        console.log(
            "LUX AI Response:",
            data
        );


        typing.remove();


        const answer =
            data.text ||
            data.answer ||
            data.message ||
            "No response received.";


        addMessage(
            answer,
            "bot"
        );


        // Save chat

        autoSaveCurrentChat();


    } catch (error) {

        console.error(
            "LUX AI ERROR:",
            error
        );


        typing.remove();


        addMessage(
            "⚠️ Unable to connect to LUX AI. Please check Flowise and Ollama.",
            "bot"
        );
    }


    // ========================================
    // RESET IMAGE
    // ========================================

    selectedImages = [];

    fileInput.value = "";

    clearImagePreview();

    input.placeholder =
        "Ask LUX AI anything...";
}


// ============================================
// SEND BUTTON
// ============================================

sendBtn.addEventListener(
    "click",
    sendMessage
);


// ============================================
// ENTER KEY
// ============================================

input.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();
        }
    }
);


// ============================================
// UPLOAD BUTTON
// ============================================

uploadBtn.addEventListener(
    "click",
    function () {

        fileInput.click();
    }
);


// ============================================
// FILE INPUT
// ============================================

fileInput.addEventListener(
    "change",
    function () {

        if (
            !fileInput.files ||
            fileInput.files.length === 0
        ) {
            return;
        }


        const files =
            Array.from(
                fileInput.files
            );


        for (
            const file of files
        ) {

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                continue;
            }


            const duplicate =
                selectedImages.some(
                    existingFile =>

                        existingFile.name ===
                            file.name &&

                        existingFile.size ===
                            file.size &&

                        existingFile.lastModified ===
                            file.lastModified
                );


            if (!duplicate) {

                selectedImages.push(
                    file
                );
            }
        }


        showImagePreviews();

        updateImagePlaceholder();


        // Reset file input so
        // the same file can be selected again

        fileInput.value = "";


        console.log(
            "Selected images:",
            selectedImages
        );
    }
);


// ============================================
// STARTER PROMPTS
// ============================================

document
    .querySelectorAll(
        ".prompt-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    input.value =
                        button.dataset.prompt;


                    sendMessage();
                }
            );
        }
    );


// ============================================
// NEW CHAT
// ============================================

newChat.addEventListener(
    "click",
    function () {

        if (
            messages.innerHTML.trim()
        ) {

            autoSaveCurrentChat();
        }


        startNewChat();
    }
);


// ============================================
// CLEAR CHAT
// ============================================

clearChat.addEventListener(
    "click",
    function () {

        messages.innerHTML =
            "";


        welcome.style.display =
            "block";


        input.value =
            "";


        selectedImages = [];


        fileInput.value =
            "";


        clearImagePreview();


        input.placeholder =
            "Ask LUX AI anything...";
    }
);


// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal(modalId) {

    const modal =
        document.getElementById(
            modalId
        );


    if (modal) {

        modal.classList.add(
            "active"
        );
    }
}


function closeModal(modalId) {

    const modal =
        document.getElementById(
            modalId
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );
    }
}


// ============================================
// SETTINGS
// ============================================

if (settingsBtn) {

    settingsBtn.addEventListener(
        "click",
        function () {

            openModal(
                "settingsModal"
            );
        }
    );
}


// ============================================
// PRIVATE AI
// ============================================

if (privateBtn) {

    privateBtn.addEventListener(
        "click",
        function () {

            openModal(
                "privateModal"
            );
        }
    );
}


// ============================================
// ABOUT
// ============================================

if (aboutBtn) {

    aboutBtn.addEventListener(
        "click",
        function () {

            openModal(
                "aboutModal"
            );
        }
    );
}


// ============================================
// CLOSE MODALS
// ============================================

document
    .querySelectorAll(
        "[data-close]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    closeModal(
                        button.dataset.close
                    );
                }
            );
        }
    );


// ============================================
// CLICK OUTSIDE MODAL
// ============================================

document
    .querySelectorAll(
        ".modal"
    )
    .forEach(
        modal => {

            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === modal
                    ) {

                        modal.classList.remove(
                            "active"
                        );
                    }
                }
            );
        }
    );


// ============================================
// ESCAPE KEY
// ============================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            document
                .querySelectorAll(
                    ".modal.active"
                )
                .forEach(
                    modal => {

                        modal.classList.remove(
                            "active"
                        );
                    }
                );
        }
    }
);


// ============================================
// INITIALIZE
// ============================================

loadChatHistory();