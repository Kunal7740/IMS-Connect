$(document).ready(function () {
    const apiUrl = 'http://127.0.0.1:5000'; // API URL

    // Fetch and Display Ideas with Evaluations
    function fetchIdeasWithEvaluations() {
        $.ajax({
            url: `${apiUrl}/ideas-with-evaluations`, // Fetches ideas with evaluations
            method: 'GET',
            success: function (response) {
                const ideasList = $('#evaluatedIdeasList'); // Use unique ID
                ideasList.empty();
                response.forEach(function (idea) {
                    ideasList.append(`
                        <div class="card idea-card">
                            <div class="card-header">
                                <strong>${idea.title}</strong>
                            </div>
                            <div class="card-body">
                                <p>${idea.description}</p>
                                <p><strong>Status:</strong> ${idea.status}</p>
                                <p><strong>Score:</strong> ${idea.score}</p>
                                <p><strong>Feedback:</strong> ${idea.feedback}</p>
                            </div>
                        </div>
                    `);
                });
            },
            error: function (error) {
                console.error(error);
                alert('Failed to load ideas with evaluations!');
            },
        });
    }

    fetchIdeasWithEvaluations(); // Initial fetch on page load
});
