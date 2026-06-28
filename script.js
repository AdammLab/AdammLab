/**
 * Adam Mostafa - Resume Website Script
 * Provides simple print trigger capability
 */

document.addEventListener("DOMContentLoaded", () => {
    const printBtn = document.getElementById("print-btn");
    if (printBtn) {
        printBtn.addEventListener("click", () => {
            window.print();
        });
    }
});
