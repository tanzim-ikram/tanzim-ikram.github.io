// Global variables
let allPublications = [];
let showingSelected = true;

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
  // Load publications data
  loadPublications();

  // Staggered section reveal via Intersection Observer
  initSectionReveal();

  // Add event listener for toggle button
  const toggleButton = document.getElementById('toggle-publications');
  if (toggleButton) {
    toggleButton.addEventListener('click', togglePublications);
  }

  // Initialize scrollspy for navigation effects
  initScrollspy();
  
  // Initialize mobile menu
  initMobileMenu();

  // Initialize collapsible experience detail toggles
  initExpToggles();

  // Scroll progress bar
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }
});

// Staggered section reveal with IntersectionObserver
function initSectionReveal() {
  const sections = document.querySelectorAll('section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -40px 0px'
  });

  sections.forEach((section, index) => {
    // Stagger delay based on index but cap it so late sections don't wait too long
    section.style.animationDelay = `${Math.min(index * 0.05, 0.3)}s`;
    observer.observe(section);
  });
}

// Initialize mobile menu toggle functionality
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('.side-nav');
  const navLinks = document.querySelectorAll('.side-nav a');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('menu-open');
      const isExpanded = nav.classList.contains('menu-open');
      hamburger.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// Initialize collapsible experience detail toggles
function initExpToggles() {
  document.querySelectorAll('button.exp-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('aria-controls');
      const details = document.getElementById(targetId);
      if (!details) return;

      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        details.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      } else {
        details.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// Load publications from JSON file
function loadPublications() {
  fetch('publications.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Publications loaded successfully:", data);
      allPublications = data.publications;
      updatePublicationHeaderAndButton();
      renderPublications(true);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      // Create fallback publications display if JSON loading fails
      displayFallbackPublications();
    });
}

// Fallback if JSON loading fails
function displayFallbackPublications() {
  const container = document.getElementById('publications-container');
  container.innerHTML = `Error loading publications.`;
}

// Toggle between showing all or selected publications
function togglePublications() {
  showingSelected = !showingSelected;
  updatePublicationHeaderAndButton();
  renderPublications(showingSelected);
}

// Update the header and toggle button label with publication counts
function updatePublicationHeaderAndButton() {
  const selectedCount = allPublications.filter(pub => pub.selected === 1).length;
  const totalCount = allPublications.length;

  const toggleButton = document.getElementById('toggle-publications');
  const toggleHeader = document.getElementById('toggle-header');

  if (toggleButton) {
    toggleButton.textContent = showingSelected ? `Show All (${totalCount})` : `Show Selected (${selectedCount})`;
  }
  if (toggleHeader) {
    toggleHeader.textContent = showingSelected ? `Selected Publications (${selectedCount})` : `All Publications (${totalCount})`;
  }
}

// Render publications based on selection state
function renderPublications(selectedOnly) {
  const publicationsContainer = document.getElementById('publications-container');
  publicationsContainer.innerHTML = '';

  const pubsToShow = selectedOnly ?
    allPublications.filter(pub => pub.selected === 1) :
    allPublications;

  pubsToShow.forEach(publication => {
    const pubElement = createPublicationElement(publication);
    publicationsContainer.appendChild(pubElement);
  });
}

// Create HTML element for a publication
function createPublicationElement(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';

  // Create thumbnail
  const thumbnail = document.createElement('div');
  thumbnail.className = 'pub-thumbnail';
  thumbnail.onclick = () => openModal(publication.thumbnail);

  const thumbnailImg = document.createElement('img');
  thumbnailImg.src = publication.thumbnail;
  thumbnailImg.alt = `${publication.title} thumbnail`;
  thumbnail.appendChild(thumbnailImg);

  // Create content container
  const content = document.createElement('div');
  content.className = 'pub-content';

  // Add title
  const title = document.createElement('div');
  title.className = 'pub-title';
  title.textContent = publication.title;
  content.appendChild(title);

  // Add authors with highlight
  const authors = document.createElement('div');
  authors.className = 'pub-authors';

  // Format authors with highlighting
  let authorsHTML = '';
  publication.authors.forEach((author, index) => {
    if (author.includes('T. I. Sheikh')) { // Highlight Tanzim Ikram Sheikh
      authorsHTML += `<span class="highlight-name">${author}</span>`;
    } else {
      authorsHTML += author;
    }

    if (index < publication.authors.length - 1) {
      authorsHTML += ', ';
    }
  });

  authors.innerHTML = authorsHTML;
  content.appendChild(authors);

  // Add venue with award if present
  const venueContainer = document.createElement('div');
  venueContainer.className = 'pub-venue-container';

  const venueWrapper = document.createElement('div');
  venueWrapper.className = 'pub-venue-line';

  const venue = document.createElement('span');
  venue.className = 'pub-venue';
  venue.textContent = publication.venue;
  venueWrapper.appendChild(venue);

  // Add DOI inline next to venue
  if (publication.links && publication.links.doi) {
    const sep = document.createElement('span');
    sep.className = 'pub-venue-sep';
    sep.textContent = '·';
    venueWrapper.appendChild(sep);

    const doiLink = document.createElement('a');
    doiLink.href = publication.links.doi;
    doiLink.target = '_blank';
    doiLink.rel = 'noopener';
    doiLink.className = 'pub-doi-link';
    doiLink.innerHTML = '<i class="fas fa-link" aria-hidden="true"></i> DOI';
    venueWrapper.appendChild(doiLink);
  }

  venueContainer.appendChild(venueWrapper);

  // Add award if it exists
  if (publication.award && publication.award.length > 0) {
    const award = document.createElement('div');
    award.className = 'pub-award';
    award.textContent = publication.award;
    venueContainer.appendChild(award);
  }

  content.appendChild(venueContainer);

  // Add other links (pdf, code, project) if they exist
  const hasExtraLinks = publication.links && (publication.links.pdf || publication.links.code || publication.links.project);
  if (hasExtraLinks) {
    const links = document.createElement('div');
    links.className = 'pub-links';

    if (publication.links.pdf) {
      const pdfLink = document.createElement('a');
      pdfLink.href = publication.links.pdf;
      pdfLink.target = '_blank';
      pdfLink.rel = 'noopener';
      pdfLink.textContent = '[PDF]';
      links.appendChild(pdfLink);
    }

    if (publication.links.code) {
      const codeLink = document.createElement('a');
      codeLink.href = publication.links.code;
      codeLink.target = '_blank';
      codeLink.rel = 'noopener';
      codeLink.textContent = '[Code]';
      links.appendChild(codeLink);
    }

    if (publication.links.project) {
      const projectLink = document.createElement('a');
      projectLink.href = publication.links.project;
      projectLink.target = '_blank';
      projectLink.rel = 'noopener';
      projectLink.textContent = '[Project Page]';
      links.appendChild(projectLink);
    }

    content.appendChild(links);
  }

  // Assemble the publication item
  pubItem.appendChild(thumbnail);
  pubItem.appendChild(content);

  return pubItem;
}

// Modal functionality for viewing original images
function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  modalImg.src = imageSrc;
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Close modal when clicking outside the image
window.onclick = function (event) {
  const modal = document.getElementById('imageModal');
  if (event.target == modal) {
    closeModal();
  }
}

// Scrollspy and dynamic navigation effects
function initScrollspy() {
  const nav = document.querySelector('nav.side-nav');
  if (!nav) return;

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav.side-nav a');

  function onScroll() {
    // Show nav only when scrolled down
    if (window.scrollY > 150) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }

    // Find current section
    let currentId = '';

    // Check if we are at the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
      currentId = sections[sections.length - 1].getAttribute('id');
    } else {
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          currentId = section.getAttribute('id');
        }
      });
    }

    if (!currentId && sections.length > 0) {
      currentId = sections[0].getAttribute('id');
    }

    let foundActive = false;
    navLinks.forEach(link => {
      link.classList.remove('active', 'past', 'future');

      const href = link.getAttribute('href').substring(1);

      if (href === currentId) {
        link.classList.add('active');
        foundActive = true;
      } else if (!foundActive) {
        link.classList.add('past');
      } else {
        link.classList.add('future');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Call once to set initial state
  onScroll();
}

// Back to Top Button functionality
document.addEventListener('DOMContentLoaded', () => {
  const backToTopButton = document.getElementById('back-to-top');
  
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    }, { passive: true });
  }
});
