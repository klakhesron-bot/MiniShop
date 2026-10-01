const express = require("express");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const db = new sqlite3.Database("minishop.db");

console.log("Base de données SQLite connectée !");

app.use(express.static("."));

app.get("/produits", function(req, res) {
    res.sendFile(__dirname + "/produits.html");
});

app.get("/panier", function(req, res) {
    res.sendFile(__dirname + "/panier.html");
});

app.get("/api/produits", function(req, res) {

    db.all(
        "SELECT * FROM produits",
        function(error, rows) {

            if (error) {
                console.log(error.message);
                res.status(500).json({
                    error: "Erreur lors de la récupération des produits"
                });
                return;
            }

            res.json(rows);
        }
    );
});

app.get("/api/produits/:id", function(req, res) {

    const id = req.params.id;

    db.get(
        "SELECT * FROM produits WHERE id = ?",
        [id],
        function(error, row) {

            if (error) {
                console.log(error.message);
                res.status(500).json({
                    error: "Erreur lors de la récupération du produit"
                });
                return;
            }
            if (!row) {
            res.status(404).json({
            error: "Produit introuvable"
        });
    return;
}

            res.json(row);
        }
    );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log("Serveur démarré sur le port " + PORT);
});

app.post("/api/produits", function(req, res) {

   const { name, price, image } = req.body;

  if (!name || !image || price === undefined) {
    res.status(400).json({
        error: "Tous les champs sont obligatoires"
    });
    return;
}
if (typeof price !== "number" || price <= 0) {
    res.status(400).json({
        error: "Le prix doit être un nombre positif"
    });
    return;
}

db.run(
    `INSERT INTO produits (name, price, image)
     VALUES (?, ?, ?)`,
    [name, price, image],
    function(error) {

        if (error) {
            console.log(error.message);
            res.status(500).json({
                error: "Erreur lors de l'ajout du produit"
            });
            return;
        }

        res.status(201).json({
            message: "Produit ajouté",
            id: this.lastID
        });
    }
);
});

app.put("/api/produits/:id", function(req, res) {

    const id = req.params.id;

    const { name, price, image } = req.body;
    if (!name || !image || price === undefined) {
    res.status(400).json({
        error: "Tous les champs sont obligatoires"
    });
    return;
}
if (typeof price !== "number" || price <= 0) {
    res.status(400).json({
        error: "Le prix doit être un nombre positif"
    });
    return;
}
    db.get(
    "SELECT * FROM produits WHERE id = ?",
    [id],
    function(error, row) {

        if (error) {
            console.log(error.message);
            res.status(500).json({
                error: "Erreur lors de la recherche du produit"
            });
            return;
        }

        if (!row) {
            res.status(404).json({
                error: "Produit introuvable"
            });
            return;
        }
        db.run(
    `UPDATE produits
     SET name = ?, price = ?, image = ?
     WHERE id = ?`,
    [name, price, image, id],
    function(error) {

        if (error) {
            console.log(error.message);
            res.status(500).json({
                error: "Erreur lors de la modification du produit"
            });
            return;
        }

        res.json({
            message: "Produit modifié"
        });

    }
);

    }
);

});

app.delete("/api/produits/:id", function(req, res) {

    const id = req.params.id;

  db.get(
    "SELECT * FROM produits WHERE id = ?",
    [id],
    function(error, row) {

        if (error) {
            console.log(error.message);
            res.status(500).json({
                error: "Erreur lors de la recherche du produit"
            });
            return;
        }

        if (!row) {
            res.status(404).json({
                error: "Produit introuvable"
            });
            return;
        }
        db.run(
    "DELETE FROM produits WHERE id = ?",
    [id],
    function(error) {

        if (error) {
            console.log(error.message);
            res.status(500).json({
                error: "Erreur lors de la suppression du produit"
            });
            return;
        }

        res.json({
            message: "Produit supprimé"
        });

    }
);

    }
);
});
