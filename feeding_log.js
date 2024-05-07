db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS feeding_log (
            id INTEGER PRIMARY KEY,
            timestamp TEXT,
            event_type TEXT
        )
    `);
});