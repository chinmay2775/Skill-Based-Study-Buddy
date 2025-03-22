// Add debugging
console.log("Course details script file loaded");

document.addEventListener("DOMContentLoaded", function () {
    console.log("Course details DOM loaded");
    
    try {
        // Get course from localStorage
        const courseJSON = localStorage.getItem("selectedCourse");
        console.log("Retrieved from localStorage:", courseJSON);
        
        if (!courseJSON) {
            showNoCourseError();
            return;
        }
        
        // Parse the course
        const course = JSON.parse(courseJSON);
        console.log("Parsed course:", course);
        
        if (!course || !course.title) {
            showNoCourseError();
            return;
        }

        // Populate the course details
        const titleElement = document.getElementById("course-title");
        const descriptionElement = document.getElementById("course-description");
        const pdfLink = document.getElementById("course-pdf");
        
        if (titleElement) {
            titleElement.textContent = course.title;
        }
        
        if (descriptionElement) {
            descriptionElement.textContent = course.description || "No description available";
        }
        
        // Set up the PDF download link
        if (pdfLink) {
            if (course.pdf) {
                pdfLink.href = course.pdf;
                
                // Extract filename from path
                const filename = course.pdf.split('/').pop();
                pdfLink.setAttribute("download", filename);
                
                pdfLink.textContent = `Download ${course.title} Materials`;
                
                // Add event listener to check if PDF exists
                pdfLink.addEventListener('click', function(e) {
                    // Create a new XMLHttpRequest
                    const xhr = new XMLHttpRequest();
                    
                    // Use HEAD request to check if file exists without downloading it
                    xhr.open('HEAD', course.pdf, true);
                    
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 404) {
                                // File doesn't exist
                                e.preventDefault();
                                alert('PDF file not found. Please contact the administrator.');
                                console.error("PDF file not found:", course.pdf);
                            } else if (xhr.status === 200) {
                                console.log("PDF file exists, download will proceed");
                            }
                        }
                    };
                    
                    xhr.send();
                });
            } else {
                pdfLink.href = "#";
                pdfLink.textContent = "No PDF Available";
                pdfLink.classList.add("disabled");
                pdfLink.setAttribute("aria-disabled", "true");
                pdfLink.onclick = function(e) {
                    e.preventDefault();
                    alert("No PDF is available for this course.");
                };
            }
        }
        
        console.log("Course details populated successfully");
    } catch (error) {
        console.error("Error loading course details:", error);
        showNoCourseError();
    }
});

// Function to show error when no course is selected
function showNoCourseError() {
    console.log("Showing no course selected error");
    const errorContainer = document.getElementById("error-container");
    if (errorContainer) {
        errorContainer.style.display = "block";
    }
    
    const cardBody = document.querySelector(".card-body");
    if (cardBody) {
        cardBody.style.display = "none";
    }
}