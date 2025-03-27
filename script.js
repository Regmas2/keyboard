// Get references to the HTML elements
const outputTextarea = document.getElementById('output');
const keyboardContainer = document.getElementById('keyboard');
const coderButton = document.getElementById('coder-button');
const codingFactorInput = document.getElementById('coding-factor'); // Get the input field
const copyButton = document.getElementById('copy-button'); // Get the copy button

// State variable for Coder mode
let isCoderModeActive = false;

// Keyboard layout
const keyLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['Space']
];

// --- Coder Mode & Shift Logic ---

// Function to get the shifted letter based on a factor
function getShiftedLetter(char, shiftFactor) {
    // Ensure shiftFactor is a valid number between 0 and 25
    shiftFactor = parseInt(shiftFactor);
    if (isNaN(shiftFactor) || shiftFactor < 0) {
        shiftFactor = 0; // Default to 0 if invalid
    }
    shiftFactor = shiftFactor % 26; // Ensure it wraps around (e.g., 26 is same as 0)

    if (char >= 'A' && char <= 'Z') { // Check if it's an uppercase letter
        let charCode = char.charCodeAt(0);
        let shiftedCode = charCode + shiftFactor;

        // Wrap around if the shift goes past 'Z'
        if (shiftedCode > 'Z'.charCodeAt(0)) {
            shiftedCode -= 26; // Wrap back to the start of the alphabet
        }
        return String.fromCharCode(shiftedCode);
    }
    return char; // Return original character if not an uppercase letter
}

// Event listener for the Coder button
coderButton.addEventListener('click', () => {
    isCoderModeActive = !isCoderModeActive;
    console.log('Coder mode:', isCoderModeActive);
    coderButton.classList.toggle('active');
});

// --- Copy to Clipboard Logic ---
copyButton.addEventListener('click', () => {
    const textToCopy = outputTextarea.value;

    if (!navigator.clipboard) {
        // Fallback or error for older browsers
        alert("Clipboard API not available in this browser.");
        return;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
        // Success feedback
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        copyButton.disabled = true; // Briefly disable button

        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.disabled = false;
        }, 1500); // Revert after 1.5 seconds

    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text. See console for details.');
    });
});


// --- Key Press Handling ---
function handleKeyPress(key) {
    console.log(`Key pressed: ${key}`);

    if (key === 'Backspace') {
        outputTextarea.value = outputTextarea.value.slice(0, -1);
    } else if (key === 'Space') {
        outputTextarea.value += ' ';
    } else {
        let charToAdd = key; // Default to the key pressed

        // If Coder mode is active AND the key is a letter...
        if (isCoderModeActive && key.length === 1 && key >= 'A' && key <= 'Z') {
            // Read the current shift factor from the input field
            const shiftFactor = codingFactorInput.value;
            charToAdd = getShiftedLetter(key, shiftFactor); // Get the shifted letter
            console.log(`Shifting '${key}' by ${shiftFactor} -> '${charToAdd}'`);
        }

        // Add the character (original or shifted) to the textarea, in lowercase
        if (charToAdd.length === 1) { // Only add single characters (ignore "Backspace" text etc.)
             outputTextarea.value += charToAdd.toLowerCase();
        }
    }

    outputTextarea.focus(); // Keep focus on the textarea
}

// --- Generate Keyboard (No changes needed here) ---
keyLayout.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('keyboard-row');

    row.forEach(keyChar => {
        const keyButton = document.createElement('button');
        keyButton.classList.add('key');
        keyButton.textContent = keyChar;

        if (keyChar === 'Space') {
            keyButton.classList.add('key-space');
        } else if (keyChar === 'Backspace') {
            keyButton.classList.add('key-backspace');
        }

        keyButton.addEventListener('click', () => {
            handleKeyPress(keyChar);
        });

        rowDiv.appendChild(keyButton);
    });

    keyboardContainer.appendChild(rowDiv);
});

console.log("Virtual keyboard initialized with coder factor and copy button.");