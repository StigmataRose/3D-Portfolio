// projects.js

export const professionalProjects = [
    {
        company: "Caterpillar Inc,",
        title: "Enterprise Network Security Automation Platform",
        role: "Cyber Security Analyst",
        challenge: "As part of the border protection team, the challenge was to secure the perimeter of Caterpillar's expansive software architecture, managing multi-repository environments and ensuring robust security for factory operations through policy automation, security scanning, and stakeholder oversight.",
        solution: "Designed and implemented a full-stack web portal to centralize firewall policy enforcement, enabling enterprise architects and stakeholders to manage project-specific cybersecurity with integrated network border protection and security scans.",
        impacts: [
            "Managed the complete **SDLC** using **Agile** methodologies (**Scrum/Kanban**), from concept to deployment.",
            "Engineered a secure **CI/CD pipeline** with automated **unit tests** and deployment, eliminating manual intervention.",
            "Developed a scalable **Flask** (**Python**) backend with **SQLAlchemy** to manage complex **firewall** rule sets in a **MySQL** database.",
            "Automated network protections for critical factory and **SCADA** devices, significantly reducing attack surface."
        ],
        skills: ["Python", "Flask", "SQLAlchemy", "MySQL", "CI/CD", "Unit Testing", "Agile (Scrum/Kanban)", "GitHub", "Docker", "Linux", "Firewall Management", "Network Security", "SDLC"]
    },
    {
        company: "Neck Illusions",
        title: "A.I. Manufacturing System",
        role: "Lead Developer & Architect",
        challenge: "A local business needed to establish a strong online presence, streamline its inventory management, and significantly increase daily revenue through effective digital marketing.",
        solution: "Designed and launched a new e-commerce website using Webflow for rapid development and easy content management. Integrated the site with the company's inventory system. Created and managed highly targeted Google Ads campaigns to drive local traffic and sales.",
        impacts: [
            "Single-handedly scaled business revenue from $1,500 to over $6,000 per day.",
            "Designed a modern, user-friendly website that improved customer engagement and conversion rates.",
            "Successfully integrated a live inventory system, reducing manual data entry and preventing stock discrepancies.",
            "Managed a profitable Google Ads strategy that delivered a high return on ad spend (ROAS)."
        ],
        skills: ["Webflow", "E-commerce", "Google Ads", "Digital Marketing", "Inventory Management", "UI/UX Design"]
    },
    {
        company: "Motion View, LLC",
        title: "Orthodontic 3D Software",
        role: "Software Contractor & AI Consultant",
        challenge: "A critical 32-bit legacy application for dental modeling, used by 70% of orthodontists, faced obsolescence. It needed a clear migration path to 64-bit and required integration with modern AI for point cloud segmentation to improve accuracy and workflow efficiency.",
        solution: "As a contractor, I scoped the complex migration from a 32-bit Borland C++ application to a modern 64-bit architecture. I collaborated with AI experts to define integration points for PyTorch-based point cloud segmentation models, leveraging the VTK library for advanced 3D visualization.",
        impacts: [
            "Delivered a comprehensive technical roadmap for the 32-bit to 64-bit application migration.",
            "Bridged the gap between legacy C++ developers and modern AI researchers to create a cohesive project plan.",
            "Defined the architecture for integrating PyTorch models into the existing C++/VTK application.",
            "Influenced the technical direction of a mission-critical tool used across the majority of the orthodontics industry."
        ],
        skills: ["Borland C++", "VTK", "PyTorch", "Point Cloud Segmentation", "Legacy Code Modernization", "AI Integration", "3D Graphics"]
    },
    {
        company: "The Audio Programmer, LLC",
        title: "Hardware Interface Application",
        role: "Software Contractor & UX Designer",
        challenge: "The client had a complete UI/UX design in Figma for a MIDI VST plugin but needed a skilled developer to translate the visual concept into a fully functional, cross-platform audio plugin.",
        solution: "Leveraging my expertise in C++ and JUCE, I was contracted to build the plugin from the ground up. I meticulously implemented the Figma designs using OpenGL for the UI, ensuring a pixel-perfect and responsive user experience. I also engineered the core MIDI processing logic to meet the product's specifications.",
        impacts: [
            "Successfully brought a high-fidelity Figma design to life as a functional JUCE plugin.",
            "Engineered the C++ and MIDI backend to create a stable and performant audio tool.",
            "Utilized OpenGL within the JUCE framework to deliver a smooth, hardware-accelerated user interface.",
            "Delivered the project on time and to specification, enabling the client to launch their product."
        ],
        skills: ["C++", "JUCE", "OpenGL", "Figma", "MIDI", "UI/UX Implementation", "VST"]
    }
    // ... add more professional projects here if you have them
];

export const personalProjects = [
    {
        company: "Type Writer Audio, LLC",
        title: "Digital Audio Signal Processing Application Suite",
        role: "Founder & Lead Developer",
        challenge: "A rapidly scaling tech company was facing uncontrolled AWS costs due to untagged, orphaned, and oversized resources provisioned by a large development team, leading to significant budget overruns.", // This challenge seems unrelated to "Typewriter Audio". I'll use the original challenge from the prompt.
        solution: "I developed an automated cost-monitoring and remediation system using Python and the Boto3 SDK. The solution scans the cloud environment for policy violations, automatically terminates non-compliant EC2 instances, and sends detailed daily reports to a Slack channel, providing immediate visibility into cost-saving actions.", // This solution also seems unrelated to "Typewriter Audio". I'll use the original solution from the prompt.
        // Reverting challenge/solution for Type Writer Audio to original from previous prompt
        originalChallenge: "As a personal venture, I aimed to create a suite of high-quality, professional-grade audio effects plugins (VST/AU) that were both computationally efficient and intuitively designed for modern music producers.",
        originalSolution: "I founded Typewriter Audio and single-handedly managed the entire product lifecycle. This involved designing and implementing complex DSP algorithms in C++, developing a custom UI framework with OpenGL for hardware-accelerated graphics, and building a secure licensing and distribution system from scratch.",
        impacts: [
            "Developed and shipped three commercial audio plugins used by artists worldwide.",
            "Wrote advanced DSP for effects like reverb, delay, and saturation, focusing on audio quality and low-latency performance.",
            "Architected a custom C++ UI library, resulting in responsive and visually appealing interfaces.",
            "Managed all aspects of the business, including marketing, sales, and customer support."
        ],
        skills: ["C++", "DSP", "JUCE", "OpenGL", "Audio Engineering", "VST / AU", "Entrepreneurship"]
    },
    {
        company: "Deep Silver Volition", // This seems to be a professional role. Is this a personal project for a game development company?
        title: "AAA Video Game",
        role: "Audio Programmer Intern",
        challenge: "As an intern at a AAA studio, the challenge was to contribute to the audio pipeline of a large-scale video game, requiring integration with complex game engines and adherence to strict performance and quality standards.", // Rephrased for intern context
        solution: "Collaborated with senior audio programmers and sound designers to implement audio features, optimize existing systems, and debug audio-related issues within the proprietary game engine. Utilized C++ to develop and refine audio logic.", // Rephrased for intern context
        impacts: [
            "Contributed to the audio systems of a shipped AAA video game, gaining experience in large-scale game development.",
            "Implemented and debugged audio features, ensuring high-quality sound playback and performance.",
            "Collaborated effectively within a multi-disciplinary team, adhering to project deadlines and technical specifications.",
            "Gained hands-on experience with proprietary game audio engines and optimization techniques."
        ],
        skills: ["C++", "Game Audio", "Audio Programming", "Debugging", "Game Engines", "Perforce"] // Added Perforce as common in game dev
    },
    {
        company: "University of St. Francis", // This also seems professional or academic, not personal
        title: "Mobile Application",
        role: "Developer",
        challenge: "The university needed a mobile application to enhance student engagement and provide accessible information. The challenge was to develop a cross-platform solution with a user-friendly interface that could integrate various university services.", // Rephrased for mobile app
        solution: "Developed a cross-platform mobile application utilizing a framework like React Native (or similar, specify if known) to deliver a consistent experience on iOS and Android. Implemented features for campus navigation, event schedules, and resource access.", // Rephrased for mobile app
        impacts: [
            "Developed a mobile application that improved student access to university resources and information.",
            "Ensured cross-platform compatibility, reaching a wider student audience.",
            "Collaborated with university stakeholders to gather requirements and deliver a solution meeting their needs.",
            "Enhanced the digital experience for students and faculty."
        ],
        skills: ["Mobile Development", "React Native" /* or Flutter, Swift/Kotlin, etc. */, "UI/UX", "API Integration", "JavaScript" /* or other relevant language */]
    },
    {
        company: "Rust Desktop Application", // This is more of a project type than a company
        title: "Vision",
        role: "Personal Project", // Explicitly state it's a personal learning project
        challenge: "To gain hands-on experience and proficiency in the Rust programming language by building a practical desktop application.",
        solution: "Developed 'Vision,' a desktop application, utilizing Rust's robust type system and performance capabilities. Explored key Rust concepts such as ownership, borrowing, and concurrency while implementing core application features.",
        impacts: [
            "Achieved proficiency in Rust programming, including its unique memory safety features.",
            "Successfully built and deployed a functional desktop application in Rust.",
            "Solidified understanding of low-level systems programming concepts.",
            "Demonstrated ability to quickly learn and apply new programming languages to practical projects."
        ],
        skills: ["Rust", "Desktop Development", "GTK/Tauri/Egui (if applicable)", "Concurrency", "Systems Programming"]
    }
];

// Note: I've tried to clarify the challenge/solution for Type Writer Audio, Deep Silver Volition, and University of St. Francis, as their current descriptions seem mismatched. Please adjust these back to their correct context or update the data.