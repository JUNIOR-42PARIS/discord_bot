var express = require('express');
var app = express();

const port = 2424;

app.get('/auth', function (req, res) {
    res.redirect("https://api.intra.42.fr/oauth/authorize?client_id=85572e681d846e10b545098ab236aaa69d0b8c36cbc8b026a87e71d948045fe0&redirect_uri=https%3A%2F%2Fdamien-hubleur.tech%3A2424&response_type=code");
});

app.listen(port, function () {
    console.log('App listening on port ' + port + '.');
});