document.getElementById("signupForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const formData = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        skills: document.getElementById("skills").value,
        learningGoals: document.getElementById("learningGoals").value
    };
    
    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        alert(result.message || result.error);
        
        if (result.message) {
            window.location.href = "/login";  // Use Flask route instead of direct HTML file
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during signup");
    }
});