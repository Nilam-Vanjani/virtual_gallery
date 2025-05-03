// Art collection data
const artCollection = [
    {
        id: 1,
        title: "Bharat Mata",
        artist: "Abanindranath Tagore",
        year: "1905",
        description: "This iconic watercolor portrays a saffron-clad woman, symbolizing Mother India, holding a book, sheaves of paddy, a piece of white cloth, and a rosary. It became a symbol of the Swadeshi movement during India's struggle for independence.",
        image: "public/mata.jpg"
    },
    {
        id: 2,
        title: "Shakuntala",
        artist: "Raja Ravi Varma",
        year: "1870",
        description: "Depicting a scene from the Mahabharata, Shakuntala is shown pretending to remove a thorn from her foot while secretly glancing for her husband, Dushyanta. This oil painting exemplifies Varma's fusion of Indian themes with European techniques.",
        image: "public/sita.jpg"
    },
    {
        id: 3,
        title: "Bapuji (Dandi March)",
        artist: "Nandalal Bose",
        year: "1930",
        description: "A linocut print capturing Mahatma Gandhi's historic 240-mile Dandi March, symbolizing civil disobedience against British salt laws. The black-and-white artwork emphasizes the simplicity and strength of the movement.",
        image: "public/bapuji.jpg"
    },
    {
        id: 4,
        title: "Young Girls",
        artist: "Amrita Sher-Gil",
        year: "1932",
        description: "Painted in Paris, this oil on canvas features two women in close conversation, reflecting Sher-Gil's exploration of female intimacy and identity. It earned her a gold medal at the 1933 Paris Salon.",
        image: "public/girls.jpg"
    },
    {
        id: 5,
        title: "The Little Girl in Blue",
        artist: "Amrita Sher-Gil",
        year: "1934",
        description: "This portrait of an eight-year-old girl from Amritsar marks Sher-Gil's transition from European to Indian themes, capturing the innocence and introspection of childhood.",
        image: "public/blue_girl.jpg"
    },
    {
        id: 6,
        title: "Mahishasura",
        artist: "Tyeb Mehta",
        year: "1997",
        description: "A modern interpretation of the demon Mahishasura, blending mythology with contemporary expressionism. Mehta's bold lines and colors convey intense emotion and conflict.",
        image: "public/mahishasur.jpg"
    },
    {
        id: 7,
        title: "Mother India",
        artist: "Amrita Sher-Gil",
        year: "1935",
        description: " An oil painting portraying an Indian peasant mother with her children, symbolizing the nation's resilience and maternal strength during colonial times.",
        image: "public/mother_india.jpg"
    },
    {
        id: 8,
        title: "Bride's Toilet",
        artist: " Amrita Sher-Gil",
        year: "1937",
        description: "Part of her South Indian trilogy, this painting depicts a bride being prepared for her wedding, highlighting Sher-Gil's focus on women's lives and traditional rituals.",
        image: "public/brides_toilet.jpg"
    }
    
];

// DOM Elements
const galleryGrid = document.getElementById('gallery-grid');
const exhibitView = document.getElementById('exhibit-view');
const currentArtwork = document.getElementById('current-artwork');
const artworkTitle = document.getElementById('artwork-title');
const artworkArtist = document.getElementById('artwork-artist');
const artworkYear = document.getElementById('artwork-year');
const artworkDescription = document.getElementById('artwork-description');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const galleryViewBtn = document.getElementById('gallery-view-btn');
const zoomView = document.getElementById('zoom-view');
const zoomArtwork = document.getElementById('zoom-artwork');
const closeZoomBtn = document.getElementById('close-zoom-btn');

// State variables
let currentArtworkIndex = 0;
let isDragging = false;
let startPos = { x: 0, y: 0 };
let currentPos = { x: 0, y: 0 };

// Initialize the gallery
function initGallery() {
    // Generate gallery thumbnails
    artCollection.forEach((artwork, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'artwork-thumbnail';
        thumbnail.innerHTML = `
            <img src="${artwork.image}" alt="${artwork.title}">
            <div class="thumbnail-info">
                <h3>${artwork.title}</h3>
                <p>${artwork.artist}</p>
            </div>
        `;
        thumbnail.addEventListener('click', () => {
            showExhibit(index);
        });
        galleryGrid.appendChild(thumbnail);
    });

    // Set up navigation buttons
    prevBtn.addEventListener('click', showPreviousArtwork);
    nextBtn.addEventListener('click', showNextArtwork);
    galleryViewBtn.addEventListener('click', showGalleryView);
    
    // Set up zoom functionality
    currentArtwork.addEventListener('click', enableZoom);
    closeZoomBtn.addEventListener('click', disableZoom);
    
    // Set up zoom dragging
    zoomArtwork.addEventListener('mousedown', startDrag);
    zoomArtwork.addEventListener('touchstart', startDrag, { passive: false });
    
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, { passive: false });
    
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    
    // Initialize with gallery view
    updateNavButtons();
}

// Show the exhibit view with the selected artwork
function showExhibit(index) {
    currentArtworkIndex = index;
    const artwork = artCollection[index];
    
    // Update the exhibit view with artwork details
    currentArtwork.src = artwork.image;
    artworkTitle.textContent = artwork.title;
    artworkArtist.textContent = artwork.artist;
    artworkYear.textContent = artwork.year;
    artworkDescription.textContent = artwork.description;
    
    // Show exhibit view, hide gallery grid
    galleryGrid.classList.add('hidden');
    exhibitView.classList.remove('hidden');
    
    updateNavButtons();
}

// Show the previous artwork
function showPreviousArtwork() {
    if (currentArtworkIndex > 0) {
        showExhibit(currentArtworkIndex - 1);
    }
}

// Show the next artwork
function showNextArtwork() {
    if (currentArtworkIndex < artCollection.length - 1) {
        showExhibit(currentArtworkIndex + 1);
    }
}

// Return to gallery view
function showGalleryView() {
    exhibitView.classList.add('hidden');
    galleryGrid.classList.remove('hidden');
}

// Update navigation button states
function updateNavButtons() {
    prevBtn.disabled = currentArtworkIndex === 0;
    nextBtn.disabled = currentArtworkIndex === artCollection.length - 1;
}

// Enable zoom view
function enableZoom() {
    zoomArtwork.src = artCollection[currentArtworkIndex].image;
    zoomView.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Reset transform
    zoomArtwork.style.transform = 'translate(0, 0)';
}

// Disable zoom view
function disableZoom() {
    zoomView.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

// Start dragging the zoomed image
function startDrag(e) {
    isDragging = true;
    
    // Get initial position
    if (e.type === 'mousedown') {
        startPos.x = e.clientX;
        startPos.y = e.clientY;
    } else if (e.type === 'touchstart') {
        e.preventDefault();
        startPos.x = e.touches[0].clientX;
        startPos.y = e.touches[0].clientY;
    }
    
    // Get current transform values
    const transform = zoomArtwork.style.transform;
    const matrix = new DOMMatrix(transform || 'translate(0, 0)');
    currentPos.x = matrix.e;
    currentPos.y = matrix.f;
    
    zoomArtwork.style.cursor = 'grabbing';
}

// Drag the zoomed image
function drag(e) {
    if (!isDragging) return;
    
    let moveX, moveY;
    
    if (e.type === 'mousemove') {
        moveX = e.clientX - startPos.x;
        moveY = e.clientY - startPos.y;
    } else if (e.type === 'touchmove') {
        e.preventDefault();
        moveX = e.touches[0].clientX - startPos.x;
        moveY = e.touches[0].clientY - startPos.y;
    }
    
    // Apply the new transform
    const newX = currentPos.x + moveX;
    const newY = currentPos.y + moveY;
    zoomArtwork.style.transform = `translate(${newX}px, ${newY}px)`;
}

// End dragging
function endDrag() {
    isDragging = false;
    zoomArtwork.style.cursor = 'move';
}

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (exhibitView.classList.contains('hidden')) return;
    
    switch (e.key) {
        case 'ArrowLeft':
            showPreviousArtwork();
            break;
        case 'ArrowRight':
            showNextArtwork();
            break;
        case 'Escape':
            if (!zoomView.classList.contains('hidden')) {
                disableZoom();
            } else {
                showGalleryView();
            }
            break;
    }
});

// Initialize the gallery when the page loads
window.addEventListener('load', initGallery);