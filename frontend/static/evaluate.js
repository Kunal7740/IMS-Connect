$(document).ready(function () {
    const apiUrl = 'http://127.0.0.1:5000'; // API URL

    // Fetch and Display Ideas that need evaluation
    function fetchIdeasForEvaluation() {
        $.ajax({
            url: `${apiUrl}/ideas`, // Fetches ideas that need evaluation
            method: 'GET',
            success: function (response) {
                const ideasList = $('#evaluationIdeasList'); // Use unique ID
                ideasList.empty();
                response.forEach(function (idea) {
                    ideasList.append(`
                        <div class="card idea-card">
                            <div class="card-header">
                                <strong>${idea.title}</strong>
                            </div>
                            <div class="card-body">
                                <p>${idea.description}</p>

                                <div class="evaluation-form">
                                    <label for="score-${idea.ideaID}">Score (1-5):</label>
                                    <input type="number" class="form-control" id="score-${idea.ideaID}" min="1" max="5" required>
                                    
                                    <label for="feedback-${idea.ideaID}">Feedback:</label>
                                    <textarea class="form-control" id="feedback-${idea.ideaID}" rows="3" required></textarea>

                                    <button type="button" class="btn btn-primary mt-2" onclick="submitEvaluation(${idea.ideaID})">
                                        Submit Evaluation
                                    </button>
                                </div>
                            </div>
                        </div>
                    `);
                });
            },
            error: function (error) {
                console.error(error);
                alert('Failed to load ideas for evaluation!');
            },
        });
    }

    fetchIdeasForEvaluation(); // Initial fetch on page load

    // Submit Evaluation
    window.submitEvaluation = function (ideaID) {
        const score = $(`#score-${ideaID}`).val();
        const feedback = $(`#feedback-${ideaID}`).val();

        if (score && feedback) {
            $.ajax({
                url: `${apiUrl}/evaluations`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    ideaID: ideaID,
                    evaluatorID: 2, // Hardcoded evaluator ID
                    score: score,
                    feedback: feedback,
                }),
                success: function () {
                    alert('Evaluation submitted successfully!');
                },
                error: function (error) {
                    console.error(error);
                    alert('Failed to submit evaluation!');
                },
            });
        } else {
            alert('Please provide a valid score and feedback!');
        }
    };
});
