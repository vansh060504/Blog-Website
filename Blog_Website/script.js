// Store comments in localStorage
const comments = JSON.parse(localStorage.getItem('comments')) || {};

// Function to save comments to localStorage
function saveComments() {
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Function to add a comment
function addComment(postId, name, text) {
    if (!comments[postId]) {
        comments[postId] = [];
    }
    
    const comment = {
        id: Date.now(),
        name: name,
        text: text,
        date: new Date().toLocaleDateString()
    };
    
    comments[postId].push(comment);
    saveComments();
    displayComments(postId);
}

// Function to display comments
function displayComments(postId) {
    const commentsList = document.querySelector(`#${postId} .comments-list`);
    if (!commentsList) return;
    
    commentsList.innerHTML = '';
    
    if (!comments[postId] || comments[postId].length === 0) {
        commentsList.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        return;
    }
    
    comments[postId].forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <strong>${comment.name}</strong>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-content">
                ${comment.text}
            </div>
        `;
        commentsList.appendChild(commentElement);
    });
}

// Function to handle comment submission
function handleCommentSubmit(event) {
    event.preventDefault();
    const post = event.target.closest('.post');
    const postId = post.id;
    const nameInput = post.querySelector('.comment-name');
    const textInput = post.querySelector('.comment-text');
    
    if (!nameInput.value.trim() || !textInput.value.trim()) {
        alert('Please fill in both name and comment fields.');
        return;
    }
    
    addComment(postId, nameInput.value.trim(), textInput.value.trim());
    nameInput.value = '';
    textInput.value = '';
}

// Function to handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const posts = document.querySelectorAll('.post');
    
    posts.forEach(post => {
        const title = post.querySelector('h2').textContent.toLowerCase();
        const content = post.querySelector('.post-content').textContent.toLowerCase();
        const category = post.querySelector('.category').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm)) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

// Function to handle social sharing
function handleSocialShare(platform, postId) {
    const post = document.getElementById(postId);
    const title = post.querySelector('h2').textContent;
    const url = window.location.href;
    
    let shareUrl;
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
            break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Function to handle navigation
function handleNavigation(event) {
    event.preventDefault();
    const target = event.target.getAttribute('href').substring(1);
    
    // Hide all sections
    document.querySelector('.blog-posts').style.display = 'none';
    document.querySelector('.contact-section').style.display = 'none';
    
    // Show target section
    if (target === 'contact') {
        document.querySelector('.contact-section').style.display = 'block';
    } else if (target === 'posts' || target === 'home') {
        document.querySelector('.blog-posts').style.display = 'grid';
    }
}

// Function to handle hamburger menu toggle
function handleHamburgerMenu() {
    const navContainer = document.querySelector('.nav-container');
    navContainer.classList.toggle('active');
}

// Initialize the blog
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for hamburger menu
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', handleHamburgerMenu);
    }

    // Add event listeners for navigation links to close mobile menu
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            const navContainer = document.querySelector('.nav-container');
            if (navContainer.classList.contains('active')) {
                navContainer.classList.remove('active');
            }
        });
    });

    // Add event listeners for comment forms
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', handleCommentSubmit);
    });
    
    // Add event listener for search
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Add event listeners for social share buttons
    document.querySelectorAll('.social-share button').forEach(button => {
        button.addEventListener('click', (event) => {
            const post = event.target.closest('.post');
            const platform = event.target.className.split('fa-')[1];
            handleSocialShare(platform, post.id);
        });
    });
    
    // Add event listeners for navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Display existing comments
    document.querySelectorAll('.post').forEach(post => {
        displayComments(post.id);
    });
}); 