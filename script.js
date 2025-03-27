// Get references to the HTML elements
const outputTextarea = document.getElementById('output');
const keyboardContainer = document.getElementById('keyboard');
const coderButton = document.getElementById('coder-button');
const decoderButton = document.getElementById('decoder-button'); // Get decoder button
const codingFactorInput = document.getElementById('coding-factor');
const copyButton = document.getElementById('copy-button');

// State variables
let isCoderModeActive = false;
let isDecoderModeActive = false; // State for decoder mode

// Keyboard layout
const keyLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['Space']
];

// --- Helper function to parse shift factor ---
function getShiftValue() {
    let shiftFactor = parseInt(codingFactorInput.value);
    if (isNaN(shiftFactor) || shiftFactor < 0) {
        shiftFactor = 0;
    }
    return shiftFactor % 26; // Ensure it's between 0 and 25
}

// --- Coder (Encode) Logic ---
function getShiftedLetter(char, shiftFactor) {
    if (char >= 'A' && char <= 'Z') {
        const charCode = char.charCodeAt(0);
        let shiftedCode = charCode + shiftFactor;
        if (shiftedCode > 'Z'.charCodeAt(0)) {
            shiftedCode -= 26; // Wrap around
        }
        return String.fromCharCode(shiftedCode);
    }
    return char;
}

coderButton.addEventListener('click', () => {
    isCoderModeActive = !isCoderModeActive; // Toggle coder state
    if (isCoderModeActive) {
        isDecoderModeActive = false; // Turn off decoder if turning coder on
        decoderButton.classList.remove('active');
        coderButton.classList.add('active');
    } else {
        coderButton.classList.remove('active');
    }
    console.log('Coder mode:', isCoderModeActive, 'Decoder mode:', isDecoderModeActive);
});

// --- Decoder Logic ---
function getUnshiftedLetter(char, shiftFactor) {
    if (char >= 'A' && char <= 'Z') {
        const charCode = char.charCodeAt(0);
        let unshiftedCode = charCode - shiftFactor;
        if (unshiftedCode < 'A'.charCodeAt(0)) {
            unshiftedCode += 26; // Wrap around backwards
        }
        return String.fromCharCode(unshiftedCode);
    }
    return char;
}

decoderButton.addEventListener('click', () => {
    isDecoderModeActive = !isDecoderModeActive; // Toggle decoder state
    if (isDecoderModeActive) {
        isCoderModeActive = false; // Turn off coder if turning decoder on
        coderButton.classList.remove('active');
        decoderButton.classList.add('active');
    } else {
        decoderButton.classList.remove('active');
    }
    console.log('Coder mode:', isCoderModeActive, 'Decoder mode:', isDecoderModeActive);
});


// --- Copy to Clipboard Logic ---
copyButton.addEventListener('click', () => {
    const textToCopy = outputTextarea.value;
    if (!navigator.clipboard) {
        alert("Clipboard API not available.");
        return;
    }
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyButton.textContent;
        copyButton.textContent = '✅'; // Checkmark feedback
        copyButton.disabled = true;
        setTimeout(() => {
            copyButton.textContent = '📋'; // Revert to icon
            copyButton.disabled = false;
        }, 1200); // Shorter revert time
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text.');
    });
});


// --- Key Press Handling ---
function handleKeyPress(key) {
    // Don't process clicks on inactive modes
    // (This logic is mainly handled by checking the boolean flags below)

    if (key === 'Backspace') {
        outputTextarea.value = outputTextarea.value.slice(0, -1);
    } else if (key === 'Space') {
        outputTextarea.value += ' ';
    } else if (key.length === 1 && key >= 'A' && key <= 'Z') { // Process only single uppercase letters
        const shiftFactor = getShiftValue();
        let charToAdd = key; // Default to the key pressed

        if (isDecoderModeActive) { // Check Decoder mode FIRST
            charToAdd = getUnshiftedLetter(key, shiftFactor);
            console.log(`Decoding '${key}' by ${shiftFactor} -> '${charToAdd}'`);
        } else if (isCoderModeActive) { // Check Coder mode if Decoder is OFF
            charToAdd = getShiftedLetter(key, shiftFactor);
            console.log(`Encoding '${key}' by ${shiftFactor} -> '${charToAdd}'`);
        }
        // If neither mode is active, charToAdd remains the original key

        outputTextarea.value += charToAdd.toLowerCase(); // Always add lowercase

    } else if (key.length === 1 && key >= '0' && key <= '9') { // Handle numbers directly
         outputTextarea.value += key;
    }
    // Other keys from layout (like 'Backspace', 'Space' text) are ignored here

    // outputTextarea.focus(); // Keep focus (optional, can be annoying)
}

// --- Generate Keyboard ---
keyLayout.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('keyboard-row');
    row.forEach(keyChar => {
        const keyButton = document.createElement('button');
        keyButton.classList.add('key');
        keyButton.textContent = keyChar;

        if (keyChar === 'Space') keyButton.classList.add('key-space');
        else if (keyChar === 'Backspace') keyButton.classList.add('key-backspace');

        keyButton.addEventListener('click', () => handleKeyPress(keyChar));
        rowDiv.appendChild(keyButton);
    });
    keyboardContainer.appendChild(rowDiv);
});

console.log("Virtual keyboard initialized with Encode/Decode modes and reduced size.");