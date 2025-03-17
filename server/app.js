import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.SECONDARY_PUBLIC_PORT || 8000;

const app = express();

// Custom middleware function to log requests and response status
const logRequests = (req, res, next) => {
    const startTime = new Date();
    const originalEnd = res.end;

    res.end = function (chunk, encoding) {
        res.end = originalEnd;
        const duration = new Date() - startTime;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
        res.end(chunk, encoding);
    };

    next();
};

app.use(logRequests);
app.use(cors());
app.use(express.json());

const loadData = (key) => {
    try {
        const dbPath = path.resolve(__dirname, "db.json");
        if (!fs.existsSync(dbPath)) return {}; // Return empty object if file doesn't exist
        const dataJSON = fs.readFileSync(dbPath, "utf-8");
        const data = JSON.parse(dataJSON);
        return key ? data[key] || [] : data; // Ensure it returns an array for keys
    } catch (e) {
        console.error("Error loading data:", e);
        return {};
    }
};

const saveData = (key, data) => {
    try {
        const dbPath = path.resolve(__dirname, "db.json");
        const existingData = loadData();
        const newData = { ...existingData, [key]: data };
        fs.writeFileSync(dbPath, JSON.stringify(newData, null, 2));
        return data;
    } catch (e) {
        console.error("Error saving data:", e);
        return {};
    }
};

app.get("/doors", (_, res) => {
    const doorsData = loadData("doors");
    res.json(doorsData);
});

app.get("/doors/:id", (req, res) => {
    const doorsData = loadData("doors");
    const door = doorsData.find((door) => door.id === parseInt(req.params.id));
    if (door) {
        return res.json(door);
    }
    res.status(404).json({ message: "Door not found" });
});

app.post("/doors", (req, res) => {
    const doorsData = loadData("doors");
    const maxId = doorsData.reduce((max, door) => Math.max(max, door.id), 0);
    const newDoor = { id: (maxId + 1).toString(), ...req.body };
    doorsData.push(newDoor);
    saveData("doors", doorsData);
    res.status(201).json(newDoor);
});

app.put("/doors/:id", (req, res) => {
    const doorsData = loadData("doors");
    const doorIndex = doorsData.findIndex((door) => door.id === parseInt(req.params.id));

    if (doorIndex === -1) {
        return res.status(404).json({ message: "Door not found" });
    }

    delete req.body.id; // Prevent ID modification
    doorsData[doorIndex] = { ...doorsData[doorIndex], ...req.body };
    saveData("doors", doorsData);
    res.json(doorsData[doorIndex]);
});

app.delete("/doors/:id", (req, res) => {
    const doorsData = loadData("doors");
    const doorIndex = doorsData.findIndex((door) => door.id === parseInt(req.params.id));

    if (doorIndex === -1) {
        return res.status(404).json({ message: "Door not found" });
    }

    const deletedDoor = doorsData.splice(doorIndex, 1);
    saveData("doors", doorsData);
    res.json(deletedDoor[0]);
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
