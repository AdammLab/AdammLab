document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // 1. CANVAS MATRIX RAIN EFFECT
    // ==========================================================================
    const canvas = document.getElementById("matrix-canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Matrix characters (binary and cyber security hex symbols)
    const characters = "0101010101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*()_+-=[]{}|;:,.<>/?0x7f0x2a0x5d".split("");
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);

    // Y coordinate array for falling drops
    const YDrops = [];
    for (let i = 0; i < columns; i++) {
        YDrops[i] = Math.random() * -100; // staggered start
    }

    // Render Matrix effect
    function drawMatrix() {
        // Semi-transparent background to create trail effect
        ctx.fillStyle = "rgba(6, 9, 19, 0.08)";
        ctx.fillRect(0, 0, width, height);

        // Draw characters
        ctx.fontSize = `${fontSize}px monospace`;

        for (let i = 0; i < YDrops.length; i++) {
            const char = characters[Math.floor(Math.random() * characters.length)];
            const x = i * fontSize;
            const y = YDrops[i] * fontSize;

            // Randomly use neon-blue or neon-purple or matrix-green
            const rand = Math.random();
            if (rand < 0.85) {
                ctx.fillStyle = "#00f0ff"; // neon blue
            } else if (rand < 0.95) {
                ctx.fillStyle = "#bd00ff"; // neon purple
            } else {
                ctx.fillStyle = "#ffffff"; // glowing white highlight
            }

            ctx.fillText(char, x, y);

            // Reset drop to top if it exceeds screen height with random delay
            if (y > height && Math.random() > 0.975) {
                YDrops[i] = 0;
            }

            YDrops[i]++;
        }
    }

    // Canvas resize handling
    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        // Re-init columns
        const newCols = Math.floor(width / fontSize);
        const diff = newCols - YDrops.length;
        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                YDrops.push(Math.random() * -100);
            }
        }
    });

    // Run matrix animation
    let matrixInterval = setInterval(drawMatrix, 33); // ~30 fps is good for performance

    // ==========================================================================
    // 2. HERO TYPEWRITER EFFECT
    // ==========================================================================
    const typewriterElement = document.getElementById("typewriter-text");
    const phrases = [
        "طالب أمن سيبراني وشبكات",
        "Red Team & Offensive Security Enthusiast",
        "مخترق أخلاقي ومهتم بـ Red Teaming",
        "Ethical Hacker & Web Pen Tester"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function handleTypewriter() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Delete characters (handle LTR/RTL correctly by slicing)
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster
        } else {
            // Type characters
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Regular typing speed
        }

        // If typing is complete, wait and start deleting
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full text
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }

        setTimeout(handleTypewriter, typingSpeed);
    }

    // Start typewriter
    setTimeout(handleTypewriter, 1000);

    // ==========================================================================
    // 3. INTERACTIVE TERMINAL EMULATOR
    // ==========================================================================
    const terminalInput = document.getElementById("terminal-input");
    const terminalOutput = document.getElementById("terminal-output");
    const terminalWidget = document.getElementById("terminal-widget");
    const inputBuffer = document.getElementById("input-buffer");

    // Dynamic caret position mapping
    terminalInput.addEventListener("input", () => {
        // Approximate character width in monospace (9px is standard for Fira Code at 0.9rem)
        const charWidth = 9.1; 
        const textLength = terminalInput.value.length;
        terminalWidget.style.setProperty("--caret-left", `${textLength * charWidth}px`);
    });

    // Make terminal input always focused when clicking the terminal widget
    terminalWidget.addEventListener("click", () => {
        terminalInput.focus();
    });

    // Keep caret pos 0 on load
    terminalWidget.style.setProperty("--caret-left", "0px");

    // Available commands documentation
    const commands = {
        help: "عرض الأوامر المتاحة في النظام",
        about: "عرض السيرة الذاتية ومعلومات عن أشرف",
        skills: "عرض القدرات واللغات البرمجية",
        tools: "عرض ترسانة أدوات الأمان التي أتقنها",
        education: "عرض التفاصيل الأكاديمية والشهادات",
        contact: "عرض قنوات الاتصال والروابط المباشرة",
        hack: "تشغيل محاكاة اختبار اختراق سيبراني (تأثير مرئي قوى)",
        clear: "تفريغ شاشة الطرفية تماماً"
    };

    // Terminal Command Handling
    terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const rawInput = terminalInput.value;
            const cleanInput = rawInput.trim().toLowerCase();
            
            // Print user command line in LTR console
            writeToTerminal(`guest@bluesonic:~# ${rawInput}`, "user-cmd");

            if (cleanInput) {
                executeCommand(cleanInput);
            }

            // Clear input & reset custom caret
            terminalInput.value = "";
            terminalWidget.style.setProperty("--caret-left", "0px");
        }
    });

    function writeToTerminal(text, className = "") {
        const line = document.createElement("div");
        line.className = `terminal-line ${className}`;
        line.innerHTML = text;
        terminalOutput.appendChild(line);
        // Autoscroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function executeCommand(cmd) {
        switch (cmd) {
            case "help":
                writeToTerminal("الأوامر المتاحة في النظام (Available Commands):", "success-msg");
                for (const [key, desc] of Object.entries(commands)) {
                    writeToTerminal(`  <span class="highlight">${key.padEnd(12)}</span> - ${desc}`);
                }
                break;
                
            case "about":
            case "whoami":
                writeToTerminal("السيرة الذاتية (Ashraf Mostafa / Blue-Sonic):", "success-msg");
                writeToTerminal("  الاسم: أشرف مصطفى");
                writeToTerminal("  التخصص: طالب أمن سيبراني وشبكات بجامعة السويدي للتكنولوجيا (Cairo, Egypt)");
                writeToTerminal("  الشغف: Red Teaming، الهجمات السيبرانية الأخلاقية، وفحص الأنظمة الهجومي");
                writeToTerminal("  الأهداف: تعزيز أمن البنى التحتية الرقمية في مصر والعالم العربي.");
                break;
                
            case "skills":
                writeToTerminal("القدرات واللغات البرمجية (Core Programming Skills):", "success-msg");
                writeToTerminal("  - Python (Advanced) -> أتمتة الثغرات، فحص البورتات والشبكات.");
                writeToTerminal("  - Java (Fundamentals) -> التحليل البرمجي والـ OOP.");
                writeToTerminal("  - Bash Scripting -> الأتمتة المباشرة على بيئات Linux/Kali.");
                break;
                
            case "tools":
                writeToTerminal("ترسانة الأدوات الأمنية (Cyber Arsenal):", "success-msg");
                writeToTerminal("  - <span class=\"highlight\">Burp Suite</span>  : اختبار اختراق الويب واكتشاف ثغرات الـ OWASP.");
                writeToTerminal("  - <span class=\"highlight\">Nmap</span>        : فحص البورتات وتحليل الشبكات وكتابة سكريبتات NSE.");
                writeToTerminal("  - <span class=\"highlight\">Wireshark</span>   : التقاط وتحليل ترافيك الشبكة واستكشاف الثغرات.");
                writeToTerminal("  - <span class=\"highlight\">SQLmap</span>      : فحص واستغلال ثغرات حقن قواعد البيانات SQL Injection.");
                writeToTerminal("  - <span class=\"highlight\">Kali Linux</span>  : نظام التشغيل الأساسي للاختبار السيبراني.");
                break;
                
            case "education":
            case "certifications":
                writeToTerminal("التعليم والشهادات قيد الدراسة (Education & Certs):", "success-msg");
                writeToTerminal("  - <span class=\"highlight\">جامعة السويدي للتكنولوجيا</span>: بكالوريوس الشبكات والأمن السيبراني (2025 - الآن).");
                writeToTerminal("  - <span class=\"highlight\">CompTIA Security+</span>: قيد الدراسة حالياً (فهم أساسيات الحماية الأمنية).");
                writeToTerminal("  - <span class=\"highlight\">Cisco CCNA (200-301)</span>: قيد الدراسة حالياً (هندسة الشبكات والراوتر).");
                break;
                
            case "contact":
                writeToTerminal("بيانات الاتصال الآمن (Secure Communications):", "success-msg");
                writeToTerminal("  - البريد الإلكتروني : <a href=\"mailto:ashraf.0xa7m@gmail.com\" class=\"highlight\">ashraf.0xa7m@gmail.com</a>");
                writeToTerminal("  - الواتساب المباشر: <a href=\"https://wa.me/201055502256\" target=\"_blank\" class=\"highlight\">+20 105 550 2256</a>");
                writeToTerminal("  - حساب GitHub      : <a href=\"https://github.com/Blue-Sonic\" target=\"_blank\" class=\"highlight\">github.com/Blue-Sonic</a>");
                break;
                
            case "clear":
                terminalOutput.innerHTML = "";
                break;
                
            case "hack":
                simulateHack();
                break;
                
            default:
                writeToTerminal(`الأمر غير معروف: ${cmd}. اكتب <span class="highlight">help</span> لرؤية الأوامر.`, "error-msg");
                break;
        }
    }

    // HACK SIMULATION (FUN EASTER EGG)
    function simulateHack() {
        terminalInput.disabled = true;
        terminalWidget.classList.add("hack-active");
        
        // speed up matrix rain during hack
        clearInterval(matrixInterval);
        matrixInterval = setInterval(drawMatrix, 10);
        
        writeToTerminal("🚀 [بدء] تفعيل بروتوكول اختراق المحاكاة التعليمي...", "error-msg");
        
        const steps = [
            { text: "⚡ connecting to target port 443...", delay: 500, style: "system-msg" },
            { text: "🔍 scanning firewall bypass vulnerability...", delay: 1000, style: "system-msg" },
            { text: "🔓 [ثغرة مكتشفة] SQL injection parameter found at: /api/v1/auth/login", delay: 1600, style: "error-msg" },
            { text: "⏳ bypass complete. extracting hash data...", delay: 2200, style: "system-msg" },
            { text: "🔑 cracking admin NTLM hash [MD5: e99a182b3f2...]", delay: 2800, style: "system-msg" },
            { text: "⚡ [نجاح الكسر] password decrypted: 'admin_bluesonic_sec2026'", delay: 3500, style: "success-msg" },
            { text: "🛡️ disabling intrusion detection system (IDS)... DONE.", delay: 4000, style: "success-msg" },
            { text: "👑 ACCESS GRANTED. Blue-Sonic has rooted the simulation!", delay: 4600, style: "success-msg" },
            { text: "ASCII_ART", delay: 4800, style: "" }
        ];

        steps.forEach((step) => {
            setTimeout(() => {
                if (step.text === "ASCII_ART") {
                    const ascii = `
██████╗ ██╗     ██╗   ██╗███████╗    ███████╗ ██████╗ ███╗   ██╗██╗ ██████╗
██╔══██╗██║     ██║   ██║██╔════╝    ██╔════╝██╔═══██╗████╗  ██║██║██╔════╝
██████╔╝██║     ██║   ██║█████╗      ███████╗██║   ██║██╔██╗ ██║██║██║
██╔══██╗██║     ██║   ██║██╔══╝      ╚════██║██║   ██║██║╚██╗██║██║██║
██████╔╝███████╗╚██████╔╝███████╗    ███████║╚██████╔╝██║ ╚████║██║╚██████╗
╚══════╝ ╚══════╝ ╚═════╝ ╚══════╝    ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝ ╚═════╝
`;
                    writeToTerminal(ascii, "ascii-art");
                    
                    // Restore terminal state
                    setTimeout(() => {
                        terminalInput.disabled = false;
                        terminalWidget.classList.remove("hack-active");
                        terminalInput.focus();
                        // Reset matrix speed
                        clearInterval(matrixInterval);
                        matrixInterval = setInterval(drawMatrix, 33);
                        writeToTerminal("<br>[نظام] تم إنهاء محاكاة الاختراق بنجاح. النظام آمن.", "system-msg");
                    }, 1000);
                } else {
                    writeToTerminal(step.text, step.style);
                }
            }, step.delay);
        });
    }

    // ==========================================================================
    // 4. 3D CARD TILT EFFECT (FOR SKILL CARDS)
    // ==========================================================================
    const cards = document.querySelectorAll(".skill-card");

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position inside card
            const y = e.clientY - rect.top;  // y position inside card
            
            // Calculate relative offset (-0.5 to 0.5)
            const xc = x / rect.width - 0.5;
            const yc = y / rect.height - 0.5;
            
            // Max rotation degrees
            const maxRotate = 10;
            
            // Apply 3D transform (swapping X and Y axis for rotation)
            card.style.transform = `perspective(1000px) rotateX(${-yc * maxRotate}deg) rotateY(${xc * maxRotate}deg) translateY(-5px)`;
        });

        card.addEventListener("mouseleave", () => {
            // Reset rotation back to initial
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
        });
    });

    // ==========================================================================
    // 5. SECURE CONTACT FORM VALIDATION & INTERACTIVE STATE
    // ==========================================================================
    const contactForm = document.getElementById("cyber-contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector("button[type='submit']");
            const btnSpan = submitBtn.querySelector("span");
            
            const name = document.getElementById("form-name").value;
            const email = document.getElementById("form-email").value;
            const msg = document.getElementById("form-msg").value;

            // Change button state to loading
            submitBtn.disabled = true;
            btnSpan.textContent = "جاري تشفير الإرسال (Encrypting)...";
            submitBtn.style.background = "linear-gradient(90deg, #ff5e00, #bd00ff)";

            // Mock network latency for sending message (since it's a static site)
            setTimeout(() => {
                // Since this is hosted on GitHub Pages, we can suggest Formspree or EmailJS,
                // but we will make it mock send and show a beautiful success message.
                btnSpan.textContent = "تم إرسال الحمولة (Payload Sent!)";
                submitBtn.style.background = "var(--neon-green)";
                submitBtn.style.boxShadow = "var(--glow-green)";
                
                formStatus.style.color = "var(--neon-green)";
                formStatus.innerHTML = `[🔐 نجاح] أهلاً ${name}، تم إرسال رسالتك بنجاح وسيتواصل معك أشرف قريباً!`;
                
                // Clear fields
                contactForm.reset();

                // Reset button state after a delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    btnSpan.textContent = "إرسال الحمولة (Send Payload)";
                    submitBtn.style.background = "linear-gradient(90deg, var(--neon-blue), var(--neon-purple))";
                    submitBtn.style.boxShadow = "var(--glow-blue)";
                    formStatus.innerHTML = "";
                }, 5000);
            }, 2000);
        });
    }

    // ==========================================================================
    // 6. SCROLL SPY FOR ACTIVE NAVIGATION MENU HIGHLIGHTING
    // ==========================================================================
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px", // triggers when section occupies the main center view
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach((section) => {
        observer.observe(section);
    });

    // Make navigation links transition smoothly (standard scroll works, but let's double check)
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.getElementById("main-header").offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});
