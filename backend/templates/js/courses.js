// Define courses with proper PDF paths
const courses = [
    { id: 1, title: "Python for Beginners", description: "Learn Python from scratch.", pdf: "/download-pdf/1" },
    { id: 2, title: "Web Development", description: "Master HTML, CSS, JavaScript.", pdf: "/download-pdf/2" },
    { id: 3, title: "Machine Learning", description: "Introduction to ML and AI.", pdf: "/download-pdf/3" },
];

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {
    console.log("Courses script is running");
    
    // Get the container element
    const container = document.getElementById("courses-container");
    
    if (!container) {
        console.error("Could not find courses-container element!");
        return;
    }
    
    // Add course cards
    courses.forEach(course => {
        const courseCard = `
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${course.title}</h5>
                        <p class="card-text">${course.description}</p>
                        <button class="btn btn-primary mt-2" onclick="openCourse(${course.id})">View Course</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += courseCard;
    });
    
    console.log("Added", courses.length, "course cards");
});

// Function to open a course
function openCourse(id) {
    console.log("Opening course ID:", id);
    const course = courses.find(c => c.id === id);
    
    if (!course) {
        console.error("Course not found with ID:", id);
        return;
    }
    
    console.log("Course data:", course);
    
    // Save to localStorage
    localStorage.setItem("selectedCourse", JSON.stringify(course));
    console.log("Saved to localStorage:", localStorage.getItem("selectedCourse"));
    
    // Redirect
    window.location.href = "course_details.html";
}

// Function to handle logout
function logout() {
    sessionStorage.clear();
    window.location.href = "login.html";
}