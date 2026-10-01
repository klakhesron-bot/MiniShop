const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("minishop.db");

console.log("Base de données connectée !");


db.run(`
    CREATE TABLE IF NOT EXISTS produits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        image TEXT NOT NULL
    )
`, function(error) {

    if (error) {
        console.log(error.message);
        return;
    }

    console.log("Table produits créée !");
});


db.all(
    "SELECT * FROM produits",
    function(error, rows) {

        if (error) {
            console.log(error.message);
            return;
        }

        console.log(rows);
    }
);