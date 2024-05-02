function UsernameInputChecker() {
    if (document.querySelector("LogInForm input[type=text]") == "")  {
        alert("Gelieve een geldige gebruikersnaam in te geven.");
        event.preventDefault();
    }
}
function PasswordInputChecker() {
    if (document.querySelector("LogInForm input[type=password]") == "")  {
        alert("Gelieve een geldig wachtwoord in te geven.");
        event.preventDefault();
    }
}