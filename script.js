const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");
const inputWord = document.getElementById("inp-word");

// Fetch word definition
async function fetchWordDefinition(word) {
    try {
        const response = await fetch(`${url}${word}`);
        const data = await response.json();
        
        // Find first available phonetic audio
        const phoneticsWithAudio = data[0].phonetics.find(p => p.audio);
        const audioUrl = phoneticsWithAudio ? phoneticsWithAudio.audio : null;

        // Prepare definition details
        const meanings = data[0].meanings[0];
        const definition = meanings.definitions[0];

        result.innerHTML = `
            <div class="word">
                <h3>${word}</h3>
                ${audioUrl ? `
                <button onclick="playSound('${audioUrl}')">
                    <i class="fas fa-volume-up"></i>
                </button>` : ''}
            </div>
            <div class="details">
                <p>${meanings.partOfSpeech}</p>
                <p>/${data[0].phonetic || 'No phonetic information'}/</p>
            </div>
            <p class="word-meaning">
               ${definition.definition}
            </p>
            ${definition.example ? `
            <p class="word-example">
                Example: ${definition.example}
            </p>` : ''}
        `;
    } catch (error) {
        result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
        console.error("Error fetching word:", error);
    }
}

// Play sound function
function playSound(audioUrl) {
    if (audioUrl) {
        sound.src = audioUrl.startsWith('https:') ? audioUrl : `https:${audioUrl}`;
        sound.play().catch(error => {
            console.error("Error playing audio:", error);
            alert("Unable to play audio. The audio file might be unavailable.");
        });
    } else {
        alert("No audio available for this word.");
    }
}

// Event listeners
btn.addEventListener("click", () => {
    const word = inputWord.value.trim();
    if (word) {
        fetchWordDefinition(word);
    }
});

// Allow Enter key to trigger search
inputWord.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const word = inputWord.value.trim();
        if (word) {
            fetchWordDefinition(word);
        }
    }
});