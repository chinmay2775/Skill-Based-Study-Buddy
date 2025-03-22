from flask import Flask, render_template, request, jsonify, redirect, url_for, session,send_from_directory, send_file
import mysql.connector
import os
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "SkillBuddy_Secret_Key_2025_!@#$%" # Add this line for session support
bcrypt = Bcrypt(app)
CORS(app)

# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Krishn@_2707",
        database="skillbuddy"
    )

@app.route('/subscription.html')
def subscription_page():
    return render_template('subscription.html')

PDF_FOLDER = os.path.join(app.root_path, 'static', 'pdfs')
# Create the folder if it doesn't exist
os.makedirs(PDF_FOLDER, exist_ok=True)

# Dictionary mapping course IDs to PDF filenames
COURSE_PDFS = {
    1: "python.pdf",
    2: "webdev.pdf",
    3: "ml.pdf"
}

@app.route('/download-pdf/<int:course_id>')
def download_pdf(course_id):
    """Direct PDF download route by course ID"""
    try:
        # Map course ID to PDF filename
        if course_id not in COURSE_PDFS:
            return jsonify({"error": "Course ID not found"}), 404
            
        filename = COURSE_PDFS[course_id]
        
        # Check if the file exists
        full_path = os.path.join(PDF_FOLDER, filename)
        print(f"Checking for PDF at: {full_path}")
        
        if not os.path.isfile(full_path):
            print(f"PDF file not found: {filename}")
            return jsonify({"error": "PDF file not found"}), 404
            
        # Send the file to the client
        return send_from_directory(PDF_FOLDER, filename, as_attachment=True)
    except Exception as e:
        print(f"Error downloading PDF: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/pdfs/<path:filename>')
def serve_pdf(filename):
    """Serve PDF file from the pdfs directory"""
    try:
        print(f"Attempting to serve: {filename}")
        print(f"From directory: {PDF_FOLDER}")
        print(f"Full path: {os.path.join(PDF_FOLDER, filename)}")
        
        # Check if the file exists
        if not os.path.isfile(os.path.join(PDF_FOLDER, filename)):
            print(f"PDF file not found: {filename}")
            return jsonify({"error": "PDF file not found"}), 404
            
        # Send the file to the client
        return send_from_directory(PDF_FOLDER, filename, as_attachment=True)
    except Exception as e:
        print(f"Error serving PDF: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/test-pdfs')
def test_pdfs():
    """Test route to list available PDFs"""
    try:
        if not os.path.exists(PDF_FOLDER):
            return jsonify({"error": f"PDF directory does not exist: {PDF_FOLDER}"})
        
        files = os.listdir(PDF_FOLDER)
        pdf_files = [f for f in files if f.endswith('.pdf')]
        
        return jsonify({
            "pdf_directory": PDF_FOLDER,
            "exists": os.path.exists(PDF_FOLDER),
            "all_files": files,
            "pdf_files": pdf_files
        })
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/courses.html')
def courses_page():
    # Check if user is logged in (simplified)
    return render_template('courses.html')

# Route for course details page
@app.route('/course_details')
@app.route('/course_details.html')
def course_details():
    # Check if user is logged in (simplified)
    return render_template('course_details.html')

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    courses = [
        {"id": 1, "title": "Python for Beginners", "description": "Learn Python from scratch.", "pdf": "/download-pdf/1"},
        {"id": 2, "title": "Web Development", "description": "Master HTML, CSS, JavaScript.", "pdf": "/download-pdf/2"},
        {"id": 3, "title": "Machine Learning", "description": "Introduction to ML and AI.", "pdf": "/download-pdf/3"},
    ]
    
    course = next((c for c in courses if c['id'] == course_id), None)
    if course:
        return jsonify(course)
    return jsonify({"error": "Course not found"}), 404

@app.route("/")
def index():
    return redirect(url_for('login'))

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "GET":
        return render_template("signup.html")

    # Handle signup form submission (POST request)
    data = request.json

    print("📥 Received data:", data)  # Debugging print

    if not data:
        return jsonify({"error": "No data received"}), 400

    username = data.get("username")
    email = data.get("email")
    password = bcrypt.generate_password_hash(data.get("password")).decode("utf-8")
    skills = data.get("skills")
    learning_goals = data.get("learningGoals")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO users (username, email, password, skills, learning_goals) VALUES (%s, %s, %s, %s, %s)",
                      (username, email, password, skills, learning_goals))
        conn.commit()
        
        print("✅ Data inserted successfully!")  # Debugging print
        return jsonify({"message": "Signup successful!"}), 201
    except Exception as e:
        print("❌ Error inserting data:", str(e))  # Debugging print
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()
        conn.close()



@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")
        
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)  # Return results as dictionaries

    try:
        cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
        user = cursor.fetchone()

        if user and bcrypt.check_password_hash(user['password'], password):
            # Return user data along with success message
            return jsonify({
                "message": "Login successful!", 
                "username": username,
                "skills": user['skills'],
                "learningGoals": user['learning_goals']
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        print("❌ Error during login:", str(e))
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route("/home")
def home():
    return render_template("home.html")

@app.route('/profile')
def profile():
    # Check if user is logged in
    if 'user_id' in session:
        return redirect(url_for('/profile'))
    
    # Get user data from database
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)  # Using dictionary=True to get results as dictionaries
    
    try:
        cursor.execute('SELECT * FROM users WHERE id = %s', (session['user_id'],))
        user = cursor.fetchone()
        
        if user is None:
            # Handle case where user doesn't exist
            return redirect(url_for('logout'))
        
        return render_template('/profile.html', user=user)
    except Exception as e:
        print(f"Error retrieving user profile: {e}")
        return redirect(url_for('profile'))
    finally:
        cursor.close()
        conn.close()



@app.route('/update_profile', methods=['POST'])
def update_profile():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    data = request.json
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            UPDATE users 
            SET name = %s, bio = %s, skills = %s 
            WHERE id = %s
        ''', (data['name'], data['bio'], data['skills'], session['user_id']))
        conn.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})
    finally:
        cursor.close()
        conn.close()


# For profile picture upload
@app.route('/upload_profile_pic', methods=['POST'])
def upload_profile_pic():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    if 'profile_pic' not in request.files:
        return jsonify({'success': False, 'message': 'No file part'})
        
    file = request.files['profile_pic']
    
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'})
        
    # Process file upload (create upload folder if it doesn't exist)
    uploads_dir = os.path.join(app.static_folder, 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    
    filename = secure_filename(f"user_{session['user_id']}_{file.filename}")
    filepath = os.path.join(uploads_dir, filename)
    file.save(filepath)
    
    # Update user profile in database
    image_url = url_for('static', filename=f'uploads/{filename}')
    
    conn = get_db_connection()
    conn.execute('UPDATE users SET profile_pic = ? WHERE id = ?', 
                (image_url, session['user_id']))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'image_url': image_url})


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'success': True})


@app.route('/courses')
def courses():
    # You might want to add authentication check here
    return render_template('courses.html')

@app.route('/chat')
def chat():
    # You might want to add authentication check here
    return render_template('chat.html')

@app.route('/mentors')
def mentors():
    # You might want to add authentication check here
    return render_template('mentors.html')

if __name__ == "__main__":
    app.run(debug=True)