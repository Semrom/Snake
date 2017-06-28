/**
* @author   Romain Semler ©2017
* @name     snake.js
* @version  1.0
*/

$(document).ready(function() {

    /*********************************/
    /*  VARIABLES GLOBALES
    **********************************/

    var LARGEUR = 900;
    var HAUTEUR = 500;
    var TAILLECASE = 20;
    var VITESSE = 80;



    /*********************************/
    /*  CREATION DU CANVAS
    **********************************/

    /**
    *   Crée l'élément HTML <canvas>.
    *   @param l
    *       La largeur du canvas.
    *   @param h
    *       La hauteur du canvas.
    */
    function creerCanvas(l, h) {

        $('#jeu').append(
            $('<canvas />')
				.attr('id', 'canvas')
                .attr('width', l)
                .attr('height', h)
				.text("Quel dommage ! Votre navigateur internet ne supporte pas la technologie utilisée pour le jeu.")
                .css({
                    'border' : '2px solid #DF691A',
                    'border-radius' : '20px',
                    'display': 'none'
                })
        );
    }

    /* Création du canvas. */
    creerCanvas(LARGEUR, HAUTEUR);

    /* Attribution du canvas. */
    var canvas = $('#canvas');

    /* Définition du contexte (2 dimensions). */
    var ctx = canvas[0].getContext("2d");



    /*********************************/
    /*  ALGORITHME DU JEU
    **********************************/

    /* Définition de variables utiles. */
    var direction;
    var nourriture;
    var serpent;
    var score;
    var enPause;
    var touchePressee;

    /* Contrôles du serpent. */
    $(document).keydown(function (e) {

        var key = e.which;

        if (key == "37" && direction != "droite" && !touchePressee) {
            direction = "gauche";
            touchePressee = true;
        }

        else if (key == "38" && direction != "bas" && !touchePressee) {
            direction = "haut";
            touchePressee = true;
        }

        else if (key == "39" && direction != "gauche" && !touchePressee) {
            direction = "droite";
            touchePressee = true;
        }

        else if (key == "40" && direction != "haut" && !touchePressee) {
            direction = "bas";
            touchePressee = true;
        }
    });


    /* Clic sur le bouton "Commencer". */
    $('#commencer').click(function() {
        $('footer').fadeOut(500);
        $('#menu').fadeOut(500, function() {
            $('header').slideDown(500);
            canvas.slideDown(500, function() {
                $('footer').slideDown(500, function() {
                    enPause = false;
                    touchePressee = false;
                    canvas.focus();
                    initialisation();
                    jouer();
                })
            });
        });
    });


    /* Clic sur le bouton "Recommencer" du menu de fin. */
    $('#recommencer').click(function() {
        $('footer').fadeOut(500);
        $('#fin').fadeOut(500, function() {
            $('#fin-desc').text('Le serpent a touché sa queue !');
            $('header').slideDown(500);
            canvas.slideDown(500, function() {
                $('footer').slideDown(500, function() {
                    enPause = false;
                    touchePressee = false;
                    canvas.focus();
                    initialisation();
                    jouer();
                })
            });
        });
    });


    /* Clic sur le bouton "Pause". */
    $('#pause').click(function() {
        if (enPause) {
            canvas.focus();
            $('#pause').text("Pause");
            enPause = false;
            jouer();
        } else {
            $('#pause').text("Continuer");
            enPause = true;
            pause();
        }
    });


    /* Clic sur le bouton "Recommencer". */
    $('#reset').click(function() {
        pause();
        $('#pause').text("Pause");
        $('#pause').addClass("disabled");
        $(this).addClass("disabled");
        $('footer').slideUp(500);
        canvas.slideUp(500, function() {
            ctx.clearRect(0, 0, LARGEUR, HAUTEUR);
            canvas.slideDown(500, function() {
                $('footer').slideDown(500, function() {
                    enPause = false;
                    touchePressee = false;
                    canvas.focus();
                    $('#pause').removeClass("disabled");
                    $('#reset').removeClass("disabled");
                    initialisation();
                    jouer();
                })
            })
        });
    });


    /**
    *   Initialise le jeu.
    */
    function initialisation() {

        direction = "droite";
        creerSerpent();
        creerNourriture();
        score = 0;
    }


    /**
    *   Lance le jeu.
    */
    function jouer() {

        if (typeof Game_Interval != "undefined") {
            clearInterval(Game_Interval);
        }

        /* On actualise les éléments selon la constante de vitesse. */
        Game_Interval = setInterval(actualiser, VITESSE);
        allowPressKeys = true;
    }


    /**
    *   Arrête le jeu.
    */
    function pause() {

        clearInterval(Game_Interval);
        allowPressKeys = false;
    }


    /**
    *   Termine le jeu et affiche le score.
    *   @param score
    *       Le score du jeu en cours.
    */
    function fin(score) {

        $('footer').delay(600).slideUp(500, function() {
            canvas.slideUp(500, function() {
                ctx.clearRect(0, 0, LARGEUR, HAUTEUR);
            });
            $('header').slideUp(500, function() {
                $('#fin').fadeIn(500, function() {
                    $('#fin-desc').append('<br />Votre score est de ' + score + '.');
                })
                $('footer').fadeIn(500);
            })
        });
    }


    /**
    *   Crée le serpent.
    */
    function creerSerpent() {

        var longueurDepart = 5;
        serpent = [];
        for (var i = longueurDepart - 1; i >= 0; i--) {
            serpent.push({x: i, y: 0});
        }
    }


    /**
    *   Crée la nourriture.
    */
    function creerNourriture() {

        nourriture = {
            x: Math.round(Math.random() * (LARGEUR - 20) / TAILLECASE),
            y: Math.round(Math.random() * (HAUTEUR - 20) / TAILLECASE)
        };
    }


    /**
    *   Dessine les éléments du jeu sur une case.
    *   @param caseX
    *       La coordonnée x de la case.
    *   @param caseY
    *       La coordonnée y de la case.
    *   @param couleur
    *       La couleur de la case.
    */
    function dessiner(caseX, caseY, couleur) {

        ctx.fillStyle = couleur;
        ctx.fillRect(caseX * TAILLECASE, caseY * TAILLECASE, TAILLECASE, TAILLECASE);
        ctx.strokeStyle = "white";
        ctx.strokeRect(caseX * TAILLECASE, caseY * TAILLECASE, TAILLECASE, TAILLECASE);
    }


    /**
    *   Vérifie si une collision s'est produite avec une case du serpent.
    *   @param caseX
    *       La coordonnée x de la case.
    *   @param caseY
    *       La coordonnée y de la case.
    *   @param seprent
    *       Le serpent.
    */
    function collision(caseX, caseY, serpent) {

        for (var i = 0; i < serpent.length; i++) {
            if (serpent[i].x == caseX && serpent[i].y == caseY) {
                return true;
            }
        }

        return false;
    }


    /**
    *   Actualise le jeu (tests, dessins, mouvements...).
    */
    function actualiser() {

        ctx.fillStyle = "#2B3E50";
        ctx.fillRect(0, 0, LARGEUR, HAUTEUR);

        var caseX = serpent[0].x;
        var caseY = serpent[0].y;

        /* Avancement du serpent */
        if (direction == "droite") {
            caseX++;
            touchePressee = false;
        }

        else if (direction == "gauche") {
            caseX--;
            touchePressee = false;
        }

        else if (direction == "haut") {
            caseY--;
            touchePressee = false;
        }

        else if (direction == "bas") {
            caseY++;
            touchePressee = false;
        }

        /* Gestion du dépassement des bordures verticales. */
        if (caseX == -1) {
            caseX = (LARGEUR / TAILLECASE) - 1;
        } else if (caseX == LARGEUR / TAILLECASE) {
            caseX = 0;
        }

        /* Gestion du dépassement des bordures horizontales. */
        if (caseY == -1) {
            caseY = (HAUTEUR / TAILLECASE) - 1;
        } else if (caseY == HAUTEUR / TAILLECASE) {
            caseY = 0;
        }

        /* Gestion des collisions du serpent. */
        if (collision(caseX, caseY, serpent)) {
            pause();
            fin(score);
        }

        /* Si le serpent tombe sur la nourriture. */
        if (caseX == nourriture.x && caseY == nourriture.y) {
            var queue = {x: caseX, y: caseY};
            score++;
            creerNourriture();
        } else {
            var queue = serpent.pop();
            queue.x = caseX;
            queue.y = caseY;
        }

        /* Ajout de la queue au serpent */
        serpent.unshift(queue);

        /* Mise à jour du serpent. */
        for (var i = 0; i < serpent.length; i++) {
            var corps = serpent[i];
            dessiner(corps.x, corps.y, "#5CB85C");
        }

        dessiner(nourriture.x, nourriture.y, "#FFFF00");
        $('#score').text("Score : " + score);
    }
});
