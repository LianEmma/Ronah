document.addEventListener("DOMContentLoaded", function() {

    // Elements and variables
    const revealButton = document.getElementById("revealButton");
    const backgroundMusic = document.getElementById("backgroundMusic");
    const confettiContainer = document.querySelector(".confetti-container");
    const heartContainer = document.getElementById("heartContainer");
    const volumeControl = document.getElementById("volumeControl");
    const navbar = document.getElementById("navbar");
    const card = document.querySelector(".card");
    const audioControls = document.querySelector(".audioControls");

    const messages = [
        "You are amazing! 🌟", "Thank you for being you 💖", "You light up my world! ✨",
        "Forever grateful for you 🌈", "Best friend anyone could ask for ❤️", "You're one of a kind 💎",
        "Always here for you 🫶", "You make me smile 😊", "Friends forever 💞", "You inspire me 🌠",
        "Love and light ✨", "Beyond words ❤️", "A true blessing 🙏", "You’re my sunshine ☀️",
        "Always appreciated 🌺", "Forever by your side 👫", "Grateful beyond words 💖",
        "With all my heart ❤️", "Special in every way 💕", "To my dearest Ronah 💖"
    ];

    let messageIndex = 0;
    let messageInterval; // Interval for popup messages

    // Event listener for the reveal button
    revealButton.addEventListener("click", () => {
        card.style.display = "none"; // Hide the card after button click
        startConfetti();
        startMusic();
        slideDownNavbar();
        startPopupMessages();
        setupEndOfSong();
    });

    // Start background music and visualizer
    function startMusic() {
        backgroundMusic.play();
        startAudioVisualizer();
    }

    // Play/pause and audio control buttons
    document.getElementById("playButton").onclick = startMusic;
    document.getElementById("pauseButton").onclick = () => backgroundMusic.pause();
    document.getElementById("backwardButton").onclick = () => backgroundMusic.currentTime -= 5;
    document.getElementById("forwardButton").onclick = () => backgroundMusic.currentTime += 5;

    // Volume control slider effect
    volumeControl.addEventListener("input", (e) => {
        const volumeValue = e.target.value;
        backgroundMusic.volume = volumeValue;
        document.querySelector(".volume-slider-container").style.width = `${volumeValue * 100}%`;
    });

    // Slide down the navbar and populate with marquee messages
    function slideDownNavbar() {
        const navbar = document.querySelector(".navbar");
        const marquee = document.querySelector(".marquee");
        
        if (!navbar || !marquee) {
            console.error("Navbar or Marquee element not found.");
            return;
        }
        
        navbar.classList.add("show"); // Show the navbar
        function populateMarquee() {
            const marqueeContent = document.querySelector(".marquee-content");
        
            if (!marqueeContent) {
                console.error("Marquee content element not found.");
                return;
            }

            // Clear any existing content in the marquee
            marqueeContent.innerHTML = "";
        
            // Loop through each message and add it to the marquee
            messages.forEach(message => {
                const messageElement = document.createElement("span");
                messageElement.classList.add("text");
                messageElement.textContent = message;
                marqueeContent.appendChild(messageElement);
            });
        
            // Duplicate content to create a seamless looping effect
            const duplicateContent = marqueeContent.cloneNode(true);
            marqueeContent.appendChild(duplicateContent);
        
            // Trigger layout recalculation to start the animation immediately
            marqueeContent.offsetWidth;  // This forces a reflow, so the animation starts immediately
        
            // Start the animation
            marqueeContent.style.animationPlayState = "running";
        }
        
        // Call the function to populate the marquee with messages
        populateMarquee();
        
    }

    // Start popup messages
    function startPopupMessages() {
        messageInterval = setInterval(() => {
            const popup = document.createElement("div");
            popup.className = "popup-message";
            popup.textContent = messages[messageIndex];
            popup.style.left = `${Math.random() * 80}vw`;
            popup.style.top = `${Math.random() * 80}vh`;
            document.body.appendChild(popup);

            messageIndex = (messageIndex + 1) % messages.length;

            setTimeout(() => popup.remove(), 3000);
        }, 3000);
    }

    // Setup end-of-song events
    function setupEndOfSong() {
        backgroundMusic.onended = function() {
            clearInterval(messageInterval); // Stop popup messages
            displayEndScreen();
        };
    }

    // Display the end screen and move buttons to center
    function displayEndScreen() {
        navbar.classList.remove("show"); // Slide away navbar
        const endScreen = document.createElement("div");
        endScreen.className = "end-screen";
        endScreen.innerHTML = "<h1>Thank You, My Darling Ronah ❤️</h1>";
        document.body.appendChild(endScreen);

        // Move audio controls to the center only at the end
        audioControls.classList.add("centered");
    }

    // Start confetti animation from the top
    function startConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement("div");
            confetti.classList.add("confetti");
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = `-${Math.random() * 10}vh`; // Starts above the screen
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confettiContainer.appendChild(confetti);
            confetti.addEventListener("animationend", () => confetti.remove());
        }
    }

    // Rhythm-based background color animation
    function startAudioVisualizer() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(backgroundMusic);
        const analyzer = audioContext.createAnalyser();

        source.connect(analyzer);
        analyzer.connect(audioContext.destination);
        analyzer.fftSize = 256;

        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function animateBackground() {
            analyzer.getByteFrequencyData(dataArray);

            const averageBass = dataArray.slice(0, bufferLength / 2).reduce((a, b) => a + b, 0) / (bufferLength / 2);
            const intensity = Math.min(255, averageBass * 2);
            const darkColorValue = Math.max(20, 255 - intensity);

            document.body.style.backgroundColor = `rgb(${darkColorValue / 3}, ${darkColorValue / 4}, ${darkColorValue / 2})`;

            requestAnimationFrame(animateBackground);
        }

        requestAnimationFrame(animateBackground);
    }

    // Utility function to get random color for confetti
    function getRandomColor() {
        const colors = ["#040108", "#111111", "#2c2c2c", "#3d3d3d", "#5a5a5a"];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
});
