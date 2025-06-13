// src/generate-projects.js
import { professionalProjects, personalProjects } from './projects.js'; // Adjust path if needed

const projectIconSvg = `<svg class="w-6 h-6 text-cyan-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

// Helper function to create a valid ID from a string
function createId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
}

function generateProjectContent(project) {
    const impactsHtml = project.impacts.map(impact =>
        `<li class="flex items-start">${projectIconSvg}<span>${impact}</span></li>`
    ).join('');

    const skillsHtml = project.skills.map(skill =>
        `<span class="skill-tag">${skill}</span>`
    ).join('');

    // Use originalChallenge/Solution if they exist, otherwise use challenge/solution
    const challengeText = project.originalChallenge || project.challenge;
    const solutionText = project.originalSolution || project.solution;

    return `
        <div class="max-w-7xl mx-auto w-full">
            <div class="project-header text-center mb-12">
                <p class="text-lg font-medium text-cyan-400">${project.company}</p>
                <h2 class="text-4xl font-bold tracking-tight text-white sm:text-5xl mt-2">${project.title}</h2>
                <p class="mt-4 text-xl text-gray-400">${project.role}</p>
                <button class="toggle-section-btn mt-8 px-6 py-2 bg-cyan-500 text-white font-medium rounded-full hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-all duration-200">Show Details</button>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                <div class="lg:col-span-3 space-y-6">
                    <div class="card">
                        <h3 class="text-2xl font-semibold text-white">The Challenge</h3>
                        <p class="mt-3 text-lg leading-relaxed text-gray-300">${challengeText}</p>
                    </div>
                    <div class="card">
                        <h3 class="text-2xl font-semibold text-white">The Solution</h3>
                        <p class="mt-3 text-lg leading-relaxed text-gray-300">${solutionText}</p>
                    </div>
                </div>
                <aside class="lg:col-span-2 space-y-6">
                    <div class="card">
                        <h3 class="text-xl font-semibold text-white border-b border-gray-700 pb-3 mb-4">My Impact &amp; Contributions</h3>
                        <ul class="space-y-3 text-gray-300">${impactsHtml}</ul>
                    </div>
                    <div class="card">
                        <h3 class="text-xl font-semibold text-white border-b border-gray-700 pb-3 mb-4">Technology &amp; Skills</h3>
                        <div class="flex flex-wrap">${skillsHtml}</div>
                    </div>
                </aside>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    // Populate Professional Projects
    professionalProjects.forEach(project => {
        const sectionId = createId(project.company); // Using company name for ID
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.innerHTML = generateProjectContent(project);
        } else {
            console.warn(`Section with ID '${sectionId}' not found for project: ${project.company}`);
        }
    });

    // Populate Personal Projects
    personalProjects.forEach(project => {
        const sectionId = createId(project.company); // Using company name for ID
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.innerHTML = generateProjectContent(project);
        } else {
            // Fallback for personal projects which might use titles as company
            const sectionIdFromTitle = createId(project.title);
            const targetSectionFromTitle = document.getElementById(sectionIdFromTitle);
            if (targetSectionFromTitle) {
                targetSectionFromTitle.innerHTML = generateProjectContent(project);
            } else {
                console.warn(`Section with ID '${sectionId}' or '${sectionIdFromTitle}' not found for personal project: ${project.company || project.title}`);
            }
        }
    });

    // Re-initialize toggle button logic after content is loaded
    initializeToggleButtons();
});

// Move your existing toggle button script into a function to be called after dynamic content is loaded
function initializeToggleButtons() {
    const toggleButtons = document.querySelectorAll('.toggle-section-btn');

    toggleButtons.forEach(button => {
        const section = button.closest('section');
        if (!section) return;

        const cards = section.querySelectorAll('.card');

        // --- 1. INITIAL STATE SETUP: HIDE CARDS ON LOAD ---

        // Hide cards instantly without an animation
        cards.forEach(card => {
            card.style.transition = 'none'; // Temporarily disable transitions
            card.style.opacity = '0';
            // Place cards in their "scattered" hidden position so the "show" animation is correct
            const x = (Math.random() - 0.5) * 2 * (window.innerWidth / 3);
            const y = (Math.random() - 0.5) * 2 * (window.innerHeight / 4);
            const rotation = (Math.random() - 0.5) * 60;
            card.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(0.5)`;
        });

        // Set the initial state and button text
        button.textContent = 'Show Details';
        section.dataset.visible = 'false'; // Keep this data attribute to track visibility

        // Re-enable transitions after a very short delay.
        setTimeout(() => {
            cards.forEach(card => card.style.transition = ''); // Resets to use the transition from your CSS file
        }, 50);


        // --- 2. CLICK EVENT LISTENER TO TOGGLE VISIBILITY ---
        button.addEventListener('click', () => {
            const isVisible = section.dataset.visible === 'true';

            if (isVisible) {
                // --- ANIMATE OUT (HIDE) CARDS ---
                cards.forEach(card => {
                    const x = (Math.random() - 0.5) * 2 * (window.innerWidth / 2);
                    const y = (Math.random() - 0.5) * 2 * (window.innerHeight / 3);
                    const rotation = (Math.random() - 0.5) * 90;
                    card.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(0.5)`;
                    card.style.opacity = '0';
                });

                button.textContent = 'Show Details';
                section.dataset.visible = 'false';

            } else {
                // --- ANIMATE IN (SHOW) CARDS ---
                cards.forEach(card => {
                    card.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
                    card.style.opacity = '1';
                });

                button.textContent = 'Hide Details';
                section.dataset.visible = 'true';
            }
        });
    });
}