$(document).ready(function() {
    const apiUrl = 'http://127.0.0.1:5000'; // API URL

    // Submit Idea Form
    $('#submitIdeaForm').submit(function(event) {
        event.preventDefault();

        const title = $('#title').val();
        const description = $('#description').val();

        $.ajax({
            url: `${apiUrl}/ideas`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                title: title,
                description: description,
                submittedBy: 1 // Hardcoded user ID for now
            }),
            success: function(response) {
                alert('Idea submitted successfully!');
                $('#title').val('');
                $('#description').val('');
            },
            error: function(error) {
                console.log(error);
                alert('Failed to submit idea!');
            }
        });
    });

  
     
   
});
