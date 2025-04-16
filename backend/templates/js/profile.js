// static/js/profile.js
function saveProfile() {
    // Get values from form
    const name = document.getElementById('name').value;
    const bio = document.getElementById('bio').value;
    const skills = document.getElementById('skills').value;
    
    // Send data to server
    fetch('/update_profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            bio: bio,
            skills: skills
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating your profile.');
    });
}

// For profile picture upload
document.getElementById('upload-pic').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('profile_pic', file);
        
        fetch('/upload_profile_pic', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('profile-pic').src = data.image_url;
                alert('Profile picture updated!');
            } else {
                alert('Failed to upload image: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Load user data from session storage
    const username = sessionStorage.getItem('username');
    const skills = sessionStorage.getItem('skills');
    const learningGoals = sessionStorage.getItem('learningGoals');
    
    // Check if user is logged in
    if (!username) {
        console.log("No username found in sessionStorage, redirecting to login");
        window.location.href = '/login';
        return;
    }
    else{
        window.location.href = '/profile';
    }
    
    // Populate form fields
    document.getElementById('username').value = username;
    document.getElementById('skills').value = skills || '';
    document.getElementById('learningGoals').value = learningGoals || '';
    
    console.log("Profile page loaded successfully with user data");
});

window.addEventListener('DOMContentLoaded', () => {
    const username = sessionStorage.getItem('username');
    fetch(`/get_profile_pic?username=${username}`)
      .then(res => res.json())
      .then(data => {
        if (data.image) {
          document.getElementById('profile-pic').src = 'data:image/png;base64,' + data.image;
        }
      });
  });
  

function logout() {
    fetch('/logout', {
        method: 'POST'
    })
    .then(() => {
        window.location.href = '/login';
    });
}