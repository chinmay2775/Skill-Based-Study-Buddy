document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("Login form submitted");

        const loginButton = document.querySelector("button[type='submit']");
        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";

        const formData = {
            username: document.getElementById("username").value.trim(),
            password: document.getElementById("password").value.trim()
        };
             
        console.log("Login attempt for:", formData.username);

        if (!formData.username || !formData.password) {
            alert("Please enter both username and password.");
            loginButton.disabled = false;
            loginButton.textContent = "Login";
            return;
        }

        try {
            // For a real backend authentication:
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            // Check if response exists and is valid
            if (response && response.ok) {
                const result = await response.json();
                
                // Store username in session storage
                sessionStorage.setItem("username", formData.username);
                console.log("Username stored in session:", formData.username);
                
                // Redirect to home page
                console.log("Redirecting to home page...");
                window.location.href = "/home.html";  // Use direct HTML file for static sites
                // window.location.href = "/home";  // Use this if you're using Flask routes
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Invalid credentials. Please try again.");
                loginButton.disabled = false;
                loginButton.textContent = "Login";
            }
        } catch (error) {
            console.error("Error:", error);
            
            // For development/testing without a backend
            // Comment this section out when using a real backend
            console.log("No backend detected - proceeding with mock login");
            sessionStorage.setItem("username", formData.username);
            window.location.href = "/home.html";
            
            //Uncomment this when using a real backend
            alert("An error occurred during login. Please try again later.");
            loginButton.disabled = false;
            loginButton.textContent = "Login";
        }
    });
});