
// ========================================
// TIKU NOTES — JAVASCRIPT
// Unit menus, exercise selection, and PDFs
// ========================================


// 1. FIND THE ELEMENTS WE NEED

const notesLayout = document.getElementById("notes-layout");
const landingPicture = document.getElementById("landing-picture");
const notesViewer = document.getElementById("notes-viewer");

const notesPlaceholder = document.getElementById("notes-placeholder");
const selectedNotes = document.getElementById("selected-notes");
const selectedExerciseTitle = document.getElementById("selected-exercise-title");

const pdfFrame = document.getElementById("pdf-frame");
const pdfUnavailable = document.getElementById("pdf-unavailable");
const downloadButton = document.getElementById("download-button");

const unitButtons = document.querySelectorAll(".unit-button");
const exerciseButtons = document.querySelectorAll(".exercise-button");
const aboutButton = document.getElementById("about-button");


// 2. CONNECT EXERCISES TO THEIR PDF FILES
//
// Put your PDFs in the "notes" folder.
// Example: notes/exercise-3.1.pdf

//const exercisePDFs = {
    //"3.1": "notes/exercise-3.1.pdf",
    //"3.2": "notes/exercise-3.2.pdf",
    //"3.3": "notes/exercise-3.3.pdf"
//};
const exercisePDFs = {
    "7.1": "notes/7ex%237.1.pdf",
    "3.2": null,
    "3.3": null
};

// 3. EXPAND OR COLLAPSE UNIT MENUS

unitButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const unitItem = button.closest(".unit-item");
        const exerciseList = unitItem.querySelector(".exercise-list");
        const arrow = button.querySelector(".unit-arrow");

        const isExpanded = button.getAttribute("aria-expanded") === "true";

        // Close the other unit menus.
        unitButtons.forEach(function (otherButton) {
            if (otherButton !== button) {
                otherButton.setAttribute("aria-expanded", "false");

                const otherItem = otherButton.closest(".unit-item");
                const otherList = otherItem.querySelector(".exercise-list");
                const otherArrow = otherButton.querySelector(".unit-arrow");

                otherList.hidden = true;
                otherArrow.textContent = "+";
            }
        });

        // Toggle the selected unit.
        button.setAttribute("aria-expanded", String(!isExpanded));
        exerciseList.hidden = isExpanded;
        arrow.textContent = isExpanded ? "+" : "−";
    });
});


// 4. OPEN AN EXERCISE

exerciseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const exerciseNumber = button.dataset.exercise;
        const pdfPath = exercisePDFs[exerciseNumber];

        // Highlight the exercise currently selected.
        exerciseButtons.forEach(function (exerciseButton) {
            exerciseButton.classList.remove("active");
        });

        button.classList.add("active");

        // Switch from the landing layout to reading mode.
        notesLayout.classList.add("exercise-selected");

        // Display the PDF viewer.
        landingPicture.hidden = true;
        notesViewer.hidden = false;

        notesPlaceholder.hidden = true;
        selectedNotes.hidden = false;

        // Update the selected exercise heading.
        selectedExerciseTitle.textContent =
            "Exercise " + exerciseNumber;

       
        // Prepare the new PDF viewer.
        const pdfViewerElement =
            document.getElementById("pdf-viewer");

        pdfViewerElement.hidden = true;

        downloadButton.removeAttribute("href");
        downloadButton.hidden = true;

        if (pdfPath) {
            // Show and render the selected exercise PDF.
            pdfViewerElement.hidden = false;
            console.log("PDF path:", pdfPath);
window.loadExercisePDF(pdfPath);

            // Keep the existing download option working.
            downloadButton.href = pdfPath;
            downloadButton.download =
                "Tiku-Notes-Exercise-" + exerciseNumber + ".pdf";
            downloadButton.hidden = false;

            pdfUnavailable.hidden = true;
        } else {
            // No PDF has been uploaded for this exercise.
            pdfUnavailable.hidden = false;
        }


        // Bring the notes area into view.
        notesViewer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});


// 5. ABOUT BUTTON
// Scroll down to the About section when ! is clicked.

if (aboutButton) {
    aboutButton.addEventListener("click", function () {
        document.getElementById("about").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}
