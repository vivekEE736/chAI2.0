import React, { Suspense, lazy, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const Spline = lazy(() => import('@splinetool/react-spline'));

// ===================================================================================
// START: Google Sheets Integration Setup
//
// PLEASE FOLLOW THESE STEPS TO ENABLE SAVING VOTES AND RECOMMENDATIONS:
//
// 1. CREATE A NEW GOOGLE SHEET:
//    - Go to sheets.google.com and create a new, blank spreadsheet.
//    - You can name it "chAI Initiative Data" or anything you like.
//
// 2. OPEN THE SCRIPT EDITOR:
//    - In your new spreadsheet, go to "Extensions" > "Apps Script".
//    - A new script editor tab will open.
//
// 3. PASTE THE SCRIPT CODE:
//    - Delete any existing code in the `Code.gs` file.
//    - Copy the entire `doPost` function below and paste it into the script editor.
/*
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet;
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (data.type === "vote") {
      sheet = spreadsheet.getSheetByName("Votes");
      if (!sheet) {
        sheet = spreadsheet.insertSheet("Votes");
        sheet.appendRow(["Timestamp", "Name", "Project", "Role"]);
      }
      sheet.appendRow([new Date(), data.name, data.project, data.role]);

    } else if (data.type === "recommendation") {
      sheet = spreadsheet.getSheetByName("Recommendations");
      if (!sheet) {
        sheet = spreadsheet.insertSheet("Recommendations");
        sheet.appendRow(["Timestamp", "Name", "Recommendation"]);
      }
      sheet.appendRow([new Date(), data.name, data.recommendation]);

    } else {
      return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Invalid data type" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "data": JSON.stringify(data) })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
*/
//
// 4. DEPLOY THE SCRIPT AS A WEB APP:
//    - Click the "Deploy" button (top right), then "New deployment".
//    - Click the gear icon next to "Select type" and choose "Web app".
//    - In the dialog:
//      - For "Execute as", select "Me".
//      - For "Who has access", select "Anyone". **THIS IS IMPORTANT**.
//    - Click "Deploy".
//
// 5. AUTHORIZE THE SCRIPT:
//    - Google will ask for permission to run the script. Click "Authorize access".
//    - Choose your Google account.
//    - You might see a "Google hasn’t verified this app" warning. Click "Advanced", then "Go to [Your Script Name] (unsafe)".
//    - Click "Allow" on the next screen.
//
// 6. GET THE WEB APP URL:
//    - After deploying, a "Deployment successfully updated" dialog will appear.
//    - Copy the "Web app" URL. It will look like `https://script.google.com/macros/s/.../exec`.
//
// 7. PASTE THE URL BELOW:
//    - Replace the placeholder URL in the `SCRIPT_URL` constant below with the URL you just copied.
//
// ===================================================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw2M4WApeR4plwbq3U1yHa2pJI1bmHonPVJWhbKDRV0W_lp9wHef3g2UNzeG7UWa3fbgQ/exec';

const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

const projectsData = [
    {
        name: "Orbit",
        subtitle: "Our network CRM on steroids",
        logo: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)" stroke="currentColor" />
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)" stroke="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
        ),
        description: [
            "Auto-captures latest interactions by whom",
            "Ability to update voice notes and text",
            "Flags relationship decay",
            "How to get to whom paths?",
            "Ability to drop voice notes or text for latest context",
            "Reminds on personal milestones (Anniversary bdays) etc.",
            "Engagement Tier",
        ],
        effort: "Very High",
        priority: "High",
    },
    {
        name: "Chronos",
        subtitle: "Calender Optimizer",
        logo: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
            </svg>
        ),
        description: [
            "Nudge for Meeting prep",
            "Prioirty wise heatmap of time",
            "Calendar stability",
            "Inefficiencies Flags/Optimization",
        ],
        effort: "High",
        priority: "High",
    },
    {
        name: "Echo",
        subtitle: "EPIC Narrative Guardian",
        logo: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 4.5 18 12m0 0-7.5 7.5" opacity="0.6"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 4.5 15 12m0 0-7.5 7.5" opacity="0.3"/>
            </svg>
        ),
        description: "AI marketing engine that generates on-brand content, transforms insights into multi-format assets, aligns with founder tone, and maintains narrative consistency across EPIC & Elevar.",
        effort: "High",
        priority: "High",
    },
    {
        name: "Chief Care Assistant",
        subtitle: "People Ops automated",
        logo: (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
        description: "AI-powered people ops engine that streamlines hiring, onboarding, payroll, and exit processes across EPIC & Elevar with auto-JD creation, candidate matching, doc collection, system triggers, and ritualized onboarding and offboarding.",
        effort: "Medium",
        priority: "High",
    },
    {
        name: "Visual Identity Assistant",
        subtitle: "Brand Visual Library",
        logo: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639l4.368-7.28A1.012 1.012 0 0 1 7.231 4.02h9.538a1.012 1.012 0 0 1 .827.412l4.368 7.28a1.012 1.012 0 0 1 0 .639l-4.368 7.28A1.012 1.012 0 0 1 16.769 19.98H7.23a1.012 1.012 0 0 1-.827-.412l-4.368-7.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            </svg>
        ),
        description: "AI-Powered Brand Image Library: Generates and curates a library of AI-created photographs and visuals that align with EPIC & Elevar's brand tone, mood, and storytelling aesthetic. Allows on-demand generation of brand-compliant visuals for social, decks, events, reports, etc.",
        effort: "High",
        priority: "Medium",
    },
    {
        name: "External Events Intelligence",
        subtitle: "Scans external events and scores each based on strategic fit",
        logo: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v.015m0 3.735v.015m0 3.735v.015m0 3.735v.015m0 3.735v.015M5.25 9.75v.015m0 3.735v.015M7.5 6.75v.015m0 9.47v.015m4.5-12.9v.015m0 15.87v.015M18.75 9.75v.015m0 3.735v.015M16.5 6.75v.015m0 9.47v.015" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
        description: "Scans external events and scores each based on strategic fit (audience, theme, visibility, capital exposure). Recommends whether to attend, who should go, and prep packs and post-event nudges to capture and circulate learnings.",
        effort: "Medium",
        priority: "Medium",
    },
    {
        name: "The Kundli Engine",
        subtitle: "Meeting Context Packs",
        logo: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518 .442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 8.5 4 4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 16.5-2 3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m17.5 16.5 2 3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 8.5 20 4" />
            </svg>
        ),
        description: "For any person or org, gives a 1-pager with who they are, background, possible synergies, who connected etc.",
        effort: "Low",
        priority: "High",
    },
    {
        name: "Origins",
        subtitle: "Org History & Context Bot",
        logo: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-3m0-6V3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v3a3 3 0 0 0 3 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3m9-3a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3" />
            </svg>
        ),
        description: "Induction experience that translates 20+ years of Elevar and EPIC history into an engaging, modular format, podcasts, timelines, decks, or visual explainers. Includes an interactive chatbot for Q&A and real-time clarification. Designed for new hires, network champions, and exploratory talent to ramp up fast with institutional context.",
        effort: "Medium",
        priority: "Medium",
    },
    {
        name: "AI Common Goods - Eliza Santosh",
        subtitle: "Awaiting Pitch",
        logo: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
        ),
        description: "JK to pitch in here",
        effort: "TBD",
        priority: "TBD",
    },
];

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  return (
    <Suspense
      fallback={
        <div className={`w-full h-full flex items-center justify-center bg-gray-900 text-white ${className}`}>
          <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
          </svg>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className} 
      />
    </Suspense>
  );
}

const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "AI Projects", href: "#projects" },
    { name: "Your Recommendation", href: "#recommendation" },
    { name: "Contact", href: "#contact" },
];

const Section = ({ id, children, className = '', useMinHeight = true, padding = 'py-24' }) => (
    <section id={id} className={`flex flex-col items-center ${useMinHeight ? 'min-h-screen justify-center' : ''} ${padding} px-8 scroll-mt-20 ${className}`}>
        <div className="container mx-auto text-left w-full">
            {children}
        </div>
    </section>
);

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1); // Remove the '#'
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
};

const Navbar = () => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-sm z-50">
            <nav className="container mx-auto pl-8 pr-[10px] py-4 flex justify-end">
                <div className="flex items-center space-x-4 translate-x-10">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            aria-label={item.name}
                            className="px-6 py-2 rounded-full text-gray-300 font-medium transition-all duration-300 ease-in-out text-base drop-shadow-md hover:text-white hover:scale-105 hover:bg-white/10 active:scale-100 active:shadow-[0_0_15px_#a855f7]"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            </nav>
        </header>
    );
};

const Hero = () => {
    return (
        <section id="home" className="relative w-screen h-screen overflow-hidden bg-black">
            <InteractiveRobotSpline
                scene={ROBOT_SCENE_URL}
                className="absolute top-0 bottom-0 right-0 left-[-450px] z-0" 
            />

            <div className="absolute top-1/2 -translate-y-1/2 right-[116px] w-[778px] h-[600px] z-5 transition-transform duration-300 ease-in-out hover:scale-[1.02]">
                <div className="w-full h-full p-[2px] rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400">
                    <div className="w-full h-full bg-black rounded-xl flex flex-col justify-center items-start p-12 text-white">
                        <h2 className="text-4xl font-bold mb-4">Welcome to the Epicenter of AI Innovation.</h2>
                        <p className="text-lg text-slate-300 mb-4 leading-relaxed">
                            The chAI Initiative is our commitment to harnessing artificial intelligence to redefine our future. We believe the most groundbreaking solutions stem from a culture of open collaboration and relentless curiosity.
                        </p>
                        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                            Explore our proposed projects, vote for those you believe in, or bring your own ideas to the table. Let's build the future, together.
                        </p>
                        <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-[0_4px_14px_rgba(168,85,247,0.4)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.6)]">
                            Explore AI Projects
                        </a>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 z-10 flex flex-col items-start justify-start text-left pointer-events-none pt-32 pl-24">
                <div className="pointer-events-auto">
                    <h1 
                        className="text-4xl md:text-6xl font-extrabold text-white"
                    >
                        The <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400">chAI</span> Initiative
                    </h1>
                    <p 
                        className="mt-4 text-base md:text-lg text-gray-300 font-light tracking-wider"
                    >
                        Our Journey To AI Automation
                    </p>
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-black z-10"></div>
        </section> 
    );
};

const PillarCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-purple-200/50 hover:border-purple-300 hover:-translate-y-2 h-full flex flex-col z-20">
        <div className="flex-shrink-0 flex justify-center items-center mb-5 w-14 h-14 rounded-full bg-fuchsia-100 mx-auto ring-8 ring-fuchsia-50">
            <span className="text-purple-600">{icon}</span>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed flex-grow">{description}</p>
        </div>
    </div>
);

const aboutPillars = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c-1.421-.492-2.682-.998-3.624-1.516a6.002 6.002 0 0 1-1.49-1.84c-.476-.792-.804-1.664-.98-2.572a8.958 8.958 0 0 1-.26-4.014.512.512 0 0 1 .512-.512h14.256a.513.513 0 0 1 .512.512 8.958 8.958 0 0 1-.26 4.014c-.177.908-.504 1.78-.98 2.572a6.002 6.002 0 0 1-1.49 1.84c-.942.518-2.203 1.024-3.624 1.516Z" /></svg>,
        title: "Ideation",
        description: "Source and refine groundbreaking AI project ideas from across the organization to tackle our most pressing challenges."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.226A3 3 0 0 1 18 15.72M6.75 15.75A3 3 0 0 1 9 12.75m6.75 3a3 3 0 0 1-3-3m-3.75 0h.008v.015h-.008V12.75Zm-4.5 0h.008v.015h-.008V12.75Zm2.25 0h.008v.015h-.008V12.75ZM12 15.75a3 3 0 0 1-3-3m6.75 0a3 3 0 0 1-3-3M3.276 12.75a3 3 0 0 1 2.25-2.613m14.248 2.613a3 3 0 0 0-2.25-2.613M15 9a3 3 0 0 1-3-3m5.25 0a3 3 0 0 1-3-3m-3.75 0a3 3 0 0 1-3-3M9 12.75a3 3 0 0 1-3-3" /></svg>,
        title: "Collaboration",
        description: "Empower teams to form around projects they're passionate about, casting votes to champion the most promising initiatives."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>,
        title: "Execution",
        description: "Provide the resources, support, and agile framework needed to rapidly develop and deploy robust AI solutions."
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>,
        title: "Impact",
        description: "Integrate successful projects into our core operations, measuring their impact and sharing successes across the company."
    },
];

const About = () => (
    <Section id="about" className="bg-slate-50" useMinHeight={false} padding="py-40">
        <div className="container mx-auto max-w-7xl">
            {/* Text Content */}
            <div className="text-left max-w-5xl mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
                    Architecting the Future with <br/>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400">
                        The chAI Initiative
                    </span>
                </h2>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                    The chAI Initiative is our dynamic framework for weaving artificial intelligence into the core of our operations. It’s more than a pipeline for new projects; it’s a cultural catalyst, designed to empower every team member to become a co-creator in our AI evolution. We're building a space where innovation is collaborative, continuous, and accessible to all.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Our mission is to systematically harness collective genius to solve critical challenges and unlock new opportunities. By providing the structure, resources, and a fertile ground for collaboration, we transform ambitious ideas into robust, impactful solutions. This is where vision meets execution, driving tangible value and defining the next frontier of our industry.
                </p>
            </div>

            {/* Pillar Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {aboutPillars.map((pillar) => (
                     <PillarCard 
                        key={pillar.title}
                        icon={pillar.icon} 
                        title={pillar.title} 
                        description={pillar.description} 
                    />
                ))}
            </div>
        </div>
    </Section>
);

const ApplicationModal = ({ project, role, onClose, onSubmit, isSubmitting, submitError }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" aria-label="Close modal">&times;</button>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Vote for Project</h3>
                <p className="text-lg text-purple-700 mb-1">{project.name}</p>
                <p className="text-md font-semibold text-gray-600 mb-6">as <span className="capitalize">{role === 'teamLead' ? 'Team Lead' : 'Team Member'}</span></p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="applicant-name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                        type="text"
                        id="applicant-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-slate-400 [color-scheme:light]"
                        placeholder="e.g., Jane Doe"
                        autoFocus
                        required
                    />
                     {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors" disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors shadow-[0_4px_14px_rgba(168,85,247,0.5)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.7)] disabled:bg-purple-400 disabled:cursor-wait" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Cast My Vote'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const getBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
        case 'very high': return 'bg-red-400/10 text-red-400 ring-1 ring-inset ring-red-400/30';
        case 'high': return 'bg-orange-400/10 text-orange-400 ring-1 ring-inset ring-orange-400/30';
        case 'medium': return 'bg-sky-400/10 text-sky-400 ring-1 ring-inset ring-sky-400/30';
        case 'low': return 'bg-green-400/10 text-green-400 ring-1 ring-inset ring-green-400/30';
        default: return 'bg-slate-400/10 text-slate-400 ring-1 ring-inset ring-slate-400/30';
    }
};

const ProjectCard = ({ project, onVote, applications, isCenter }) => {
    const { teamLead = [], teamMembers = [] } = applications || {};
    return (
        <div className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg transition-shadow duration-300 flex flex-col h-full w-full border border-slate-700 overflow-hidden ${isCenter ? 'shadow-purple-500/20 shadow-2xl' : 'shadow-black/20'}`}>
            <div className="flex-grow flex flex-col p-8 overflow-hidden">
                <div className="flex-grow overflow-y-auto -mr-6 pr-6">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-slate-900/70 rounded-2xl flex items-center justify-center text-purple-400 ring-1 ring-purple-500/30 shadow-lg">
                            {React.cloneElement(project.logo, { className: "w-9 h-9" })}
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-slate-100">{project.name}</h3>
                            <p className="text-purple-400 font-medium text-lg -mt-1">{project.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-6">
                        <span className={`text-base font-medium px-3 py-1 rounded-full ${getBadgeColor(project.effort)}`}>Effort: {project.effort}</span>
                        <span className={`text-base font-medium px-3 py-1 rounded-full ${getBadgeColor(project.priority)}`}>Priority: {project.priority}</span>
                    </div>
                    {Array.isArray(project.description) ? (
                        <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6 text-lg">
                            {project.description.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    ) : (
                        <p className="text-slate-300 mb-6 text-lg">{project.description}</p>
                    )}
                </div>

                <div className="pt-6 mt-auto border-t border-slate-700/80 flex-shrink-0">
                    <div className="flex space-x-4 mb-5">
                         <button onClick={() => onVote(project, 'teamLead')} className="flex-1 px-4 py-3 text-lg font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all shadow-md hover:scale-105 active:scale-100 disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!isCenter}>Vote as Team Lead</button>
                         <button onClick={() => onVote(project, 'teamMembers')} className="flex-1 px-4 py-3 text-lg font-semibold text-slate-100 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all shadow-md hover:scale-105 active:scale-100 disabled:bg-slate-800 disabled:cursor-not-allowed" disabled={!isCenter}>Vote as Team Member</button>
                    </div>
                    <div className="text-lg space-y-3">
                        <div>
                            <p className="font-semibold text-slate-200">Voted as Team Lead:</p>
                            <p className="text-slate-400 pl-2">{teamLead.length > 0 ? teamLead.join(', ') : 'No votes yet.'}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-200">Voted as Team Members:</p>
                            <p className="text-slate-400 pl-2">{teamMembers.length > 0 ? teamMembers.join(', ') : 'No votes yet.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ArrowButton = ({ direction, onClick, disabled }) => {
    const isLeft = direction === 'left';
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`absolute top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 backdrop-blur-sm p-3 text-white transition hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed ${isLeft ? 'left-0 md:-left-12' : 'right-0 md:-right-12'}`}
            aria-label={isLeft ? 'Previous project' : 'Next project'}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                {isLeft ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                )}
            </svg>
        </button>
    );
};

const Projects = () => {
    const [applications, setApplications] = useState({});
    const [modalInfo, setModalInfo] = useState({ isOpen: false, project: null, role: null });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleOpenModal = (project, role) => {
        setModalInfo({ isOpen: true, project, role });
    };

    const handleCloseModal = () => {
        setModalInfo({ isOpen: false, project: null, role: null });
        setSubmitError('');
    };

    const handleSubmitVote = async (name) => {
        if (!name.trim() || !modalInfo.project) return;
        if (!SCRIPT_URL) {
            setSubmitError("Google Apps Script URL is not configured. Please ask the administrator to set it up.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        
        const { project, role } = modalInfo;

        const data = {
            type: "vote",
            name: name,
            project: project.name,
            role: role === 'teamLead' ? 'Team Lead' : 'Team Member'
        };

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            setApplications(prev => {
                const currentProjectApps = prev[project.name] || { teamLead: [], teamMembers: [] };
                if (currentProjectApps[role].includes(name)) {
                    return prev;
                }
                const updatedRoleApps = [...currentProjectApps[role], name];
                return {
                    ...prev,
                    [project.name]: { ...currentProjectApps, [role]: updatedRoleApps }
                };
            });

            handleCloseModal();

        } catch (error) {
            console.error('Error submitting vote:', error);
            setSubmitError('Failed to cast vote. Please check the console or try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToPrevious = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : 0));
    const goToNext = () => setCurrentIndex(prev => (prev < projectsData.length - 1 ? prev + 1 : projectsData.length - 1));

    const getCardStyle = (index: number, currentIndex: number, totalCards: number) => {
        const offset = index - currentIndex;
        const isCenter = offset === 0;

        if (Math.abs(offset) > 1) {
            return { transform: `translateX(${offset > 0 ? 120 : -120}%) scale(0.7)`, opacity: 0, zIndex: 1, pointerEvents: 'none' as 'none' };
        }

        const translateX = `${offset * 75}%`;
        const scale = isCenter ? '1' : '0.8';
        const zIndex = isCenter ? totalCards : totalCards - Math.abs(offset);
        const opacity = isCenter ? 1 : 0.4;
        const filter = isCenter ? 'blur(0px)' : 'blur(4px)';
        const pointerEvents: 'auto' | 'none' = isCenter ? 'auto' : 'none';

        const finalTransform = `translateX(calc(-50% + ${translateX})) scale(${scale})`;

        return { transform: finalTransform, zIndex, opacity, filter, pointerEvents };
    };

    return (
        <Section id="projects" className="bg-black overflow-hidden">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-white">Vote For AI Projects</h2>
                <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed">
                    Here is a list of potential AI projects. Cast your vote for the projects that excite you the most. You can vote for multiple projects and roles.
                </p>
            </div>
            <div className="relative w-full flex items-center justify-center" style={{ height: '720px' }}>
                <div className="w-full h-full max-w-6xl relative">
                    <ArrowButton direction="left" onClick={goToPrevious} disabled={currentIndex === 0} />
                    <ArrowButton direction="right" onClick={goToNext} disabled={currentIndex === projectsData.length - 1} />
                    {projectsData.map((project, index) => (
                        <div
                            key={project.name}
                            className="absolute top-0 left-1/2 transition-all duration-500 ease-in-out"
                            style={getCardStyle(index, currentIndex, projectsData.length)}
                        >
                             <div className="w-[480px] h-[640px]">
                                <ProjectCard 
                                    project={project}
                                    onVote={handleOpenModal}
                                    applications={applications[project.name]}
                                    isCenter={index === currentIndex}
                                />
                             </div>
                        </div>
                    ))}
                </div>
            </div>
            {modalInfo.isOpen && (
                <ApplicationModal 
                    project={modalInfo.project}
                    role={modalInfo.role}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitVote}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                />
            )}
        </Section>
    );
};


const Recommendation = () => {
    const [name, setName] = useState('');
    const [recommendationText, setRecommendationText] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !recommendationText.trim()) return;
        if (!SCRIPT_URL) {
            setError("Google Apps Script URL is not configured. Please ask the administrator to set it up.");
            setStatus('error');
            return;
        }

        setStatus('submitting');
        setError('');

        const data = {
            type: "recommendation",
            name: name,
            recommendation: recommendationText
        };
        
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            
            setStatus('success');
            setName('');
            setRecommendationText('');
            setTimeout(() => setStatus('idle'), 5000);
        } catch (err) {
            console.error('Error submitting recommendation:', err);
            setError('Failed to submit recommendation. Please try again later.');
            setStatus('error');
        }
    };

    return (
        <Section id="recommendation" className="bg-slate-50" useMinHeight={false}>
            <div className="max-w-2xl mx-auto text-center">
                <div className="w-full">
                    <h2 className="text-4xl font-bold mb-4 text-gray-900">Have an Idea?</h2>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        If you have a project idea that's not on our list, we want to hear about it! Share your concept below and help shape the future of AI at our company.
                    </p>

                    {status === 'success' ? (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md text-left shadow-md" role="alert">
                            <p className="font-bold">Thank You!</p>
                            <p>Your brilliant idea has been submitted for review.</p>
                        </div>
                    ) : (
                         <form onSubmit={handleSubmit} className="space-y-6 text-left bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                            <div>
                                <label htmlFor="recommendation-name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    id="recommendation-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-slate-300 text-gray-900 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-slate-400"
                                    placeholder="e.g., Alex Doe"
                                    required
                                    disabled={status === 'submitting'}
                                />
                            </div>
                            <div>
                                <label htmlFor="recommendation-text" className="block text-sm font-medium text-gray-700 mb-2">Your Recommendation</label>
                                <textarea
                                    id="recommendation-text"
                                    value={recommendationText}
                                    onChange={(e) => setRecommendationText(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-2 bg-white border border-slate-300 text-gray-900 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-slate-400"
                                    placeholder="Describe your brilliant project idea here..."
                                    required
                                    disabled={status === 'submitting'}
                                />
                            </div>
                             {status === 'error' && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="text-right">
                                <button type="submit" className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-[0_4px_14px_rgba(168,85,247,0.4)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.6)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-wait" disabled={status === 'submitting'}>
                                    {status === 'submitting' ? 'Submitting...' : 'Submit Idea'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Section>
    );
};


const Contact = () => (
    <Section id="contact" className="bg-black" useMinHeight={false} padding="py-10">
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Get in Touch</h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
                Have a question or a project idea? We'd love to hear from you.
                Send an email and let's connect.
            </p>
            <div className="mt-8">
                <a 
                    href="mailto:vivek@elevarequity.com"
                    className="text-lg font-semibold leading-6 text-purple-400 hover:text-purple-300 transition-colors duration-300 underline-offset-4 hover:underline"
                >
                    vivek@elevarequity.com
                </a>
            </div>
        </div>
    </Section>
);


const App = () => {
    return (
        <div className="bg-white text-gray-800 font-sans">
            <Navbar />
            <main>
                <Hero />
                <About />
                <Projects />
                <Recommendation />
                <Contact />
            </main>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
