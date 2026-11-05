
import * as pdfjsLib from "./vendor/pdfjs/pdf.mjs";

// Tell PDF.js where its worker file is located.
pdfjsLib.GlobalWorkerOptions.workerSrc =
    new URL(
        "./vendor/pdfjs/pdf.worker.mjs",
        document.baseURI
    ).href;

const pdfViewer = document.getElementById("pdf-viewer");
const pdfPages = document.getElementById("pdf-pages");
const fullscreenButton = document.getElementById("fullscreen-button");

let currentLoadingTask = null;

// Load and display the selected exercise PDF.
window.loadExercisePDF = async function (pdfPath) {
    pdfPages.replaceChildren();

    if (!pdfPath) {
        console.error("No PDF path was provided.");
        return;
    }

    // Stop loading the previously selected PDF, if necessary.
    if (currentLoadingTask) {
        try {
            await currentLoadingTask.destroy();
        } catch (error) {
            // The previous loading task may already have finished.
        }

        currentLoadingTask = null;
    }

    try {
        const pdfUrl = new URL(pdfPath, document.baseURI).href;

        console.log("PDF path received:", pdfPath);
        console.log("Loading PDF from:", pdfUrl);

        // PDF.js expects an options object containing the URL.
       console.log("URL being passed to PDF.js:", pdfUrl);
console.log("getDocument type:", typeof pdfjsLib.getDocument);
console.log("PDF.js version:", pdfjsLib.version);

currentLoadingTask = pdfjsLib.getDocument({ url: pdfUrl });

        const pdf = await currentLoadingTask.promise;

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);

            // Fit each page within the viewer's available width.
            const originalViewport = page.getViewport({ scale: 1 });
            const availableWidth = Math.max(
                250,
                pdfViewer.clientWidth - 32
            );

            const scale = Math.min(
                1.5,
                availableWidth / originalViewport.width
            );

            const viewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            canvas.className = "pdf-page-canvas";

            // Render sharply on high-resolution screens.
            const pixelRatio = window.devicePixelRatio || 1;

            canvas.width = Math.floor(viewport.width * pixelRatio);
            canvas.height = Math.floor(viewport.height * pixelRatio);

            canvas.style.width = `${Math.floor(viewport.width)}px`;
            canvas.style.height = `${Math.floor(viewport.height)}px`;

            pdfPages.appendChild(canvas);

            const context = canvas.getContext("2d");

            await page.render({
                canvas,
                canvasContext: context,
                viewport,
                transform: pixelRatio !== 1
                    ? [pixelRatio, 0, 0, pixelRatio, 0, 0]
                    : null
            }).promise;
        }

        console.log("PDF loaded successfully:", pdf.numPages, "pages");
    } catch (error) {
        console.error("Could not load the PDF:", error);

        pdfPages.replaceChildren();

        const message = document.createElement("p");
        message.textContent =
            "Sorry, these notes could not be loaded. Please try again.";

        pdfPages.appendChild(message);
    }
};

// Fullscreen button.
fullscreenButton.addEventListener("click", async function () {
    try {
        if (!document.fullscreenElement) {
            await pdfViewer.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.error("Could not change fullscreen mode:", error);
    }
});

// Update the fullscreen icon when the mode changes.
document.addEventListener("fullscreenchange", function () {
    const icon = fullscreenButton.querySelector("i");

    if (!icon) {
        return;
    }

    if (document.fullscreenElement === pdfViewer) {
        icon.classList.remove("fa-expand");
        icon.classList.add("fa-compress");
        fullscreenButton.title = "Exit full screen";
        fullscreenButton.setAttribute(
            "aria-label",
            "Exit full screen"
        );
    } else {
        icon.classList.remove("fa-compress");
        icon.classList.add("fa-expand");
        fullscreenButton.title = "Full screen";
        fullscreenButton.setAttribute(
            "aria-label",
            "View notes in full screen"
        );
    }
});
