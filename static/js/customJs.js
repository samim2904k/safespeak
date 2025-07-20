function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

function logInVerify(event){
    // showLoadingScreen();
    event.preventDefault();
    var email = document.getElementById('inputUsername3').value;
    var password = document.getElementById('inputPassword3').value;

    if (!email || !password) {
        toastr.error('Please fill in all the required fields.', 'Error');
    } else {
        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')  
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                toastr.error(data.error, 'Error');
            } else {
                toastr.success(data.message, 'Success');
                setTimeout(function() {
                    window.location.href = data.redirect_url;  
                }, 2000);
            }
        })
        .catch(error => {
            toastr.error('There was a problem submitting the form.', 'Error');
            console.error('There was a problem with the fetch operation:', error);
        });
    }

}
