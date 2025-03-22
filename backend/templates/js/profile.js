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

function logout() {
    fetch('/logout', {
        method: 'POST'
    })
    .then(() => {
        window.location.href = '/login';
    });
}