from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ims_connect.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models (User, Idea, Evaluation, AuditLog)
class User(db.Model):
    userID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(50), nullable=False)

class Idea(db.Model):
    ideaID = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='Submitted')
    submittedBy = db.Column(db.Integer, db.ForeignKey('user.userID'), nullable=False)

class Evaluation(db.Model):
    evaluationID = db.Column(db.Integer, primary_key=True)
    ideaID = db.Column(db.Integer, db.ForeignKey('idea.ideaID'), nullable=False)
    evaluatorID = db.Column(db.Integer, db.ForeignKey('user.userID'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.Text)

# Home Route (Serve the Index Page)
@app.route('/')
def index():
    return render_template('index.html')

# Serve the Evaluate Page
@app.route('/evaluate')
def evaluate_page():
    return render_template('evaluate.html')

# Serve the Ideas with Evaluations Page
@app.route('/ideas-with-evaluations')
def ideas_with_evaluations_page():
    return render_template('ideas-with-evaluations.html')

# APIs
@app.route('/ideas', methods=['GET'])
def get_ideas_for_evaluation():
    ideas = Idea.query.filter(Idea.status != 'Reviewed').all()
    result = [{"ideaID": i.ideaID, "title": i.title, "description": i.description, "status": i.status} for i in ideas]
    return jsonify(result)

@app.route('/ideas-with-evaluations', methods=['GET'])
def get_ideas_with_evaluations():
    ideas = db.session.query(Idea, Evaluation).join(Evaluation, Idea.ideaID == Evaluation.ideaID).all()
    result = []
    for idea, evaluation in ideas:
        result.append({
            "ideaID": idea.ideaID,
            "title": idea.title,
            "description": idea.description,
            "status": idea.status,
            "score": evaluation.score,
            "feedback": evaluation.feedback
        })
    return jsonify(result)

@app.route('/evaluations', methods=['POST'])
def submit_evaluation():
    data = request.json
    new_eval = Evaluation(
        ideaID=data['ideaID'],
        evaluatorID=data['evaluatorID'],
        score=data['score'],
        feedback=data['feedback']
    )
    db.session.add(new_eval)
    db.session.commit()
    return jsonify({"message": "Evaluation submitted successfully!"})

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=port)
