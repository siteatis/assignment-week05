import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import cors from "cors";

dotenv.config();
const db = new pg.Pool({ connectionString: process.env.database_url });
const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, () => console.log("Server running on 3000"));

app.post("/submitReport", (req, rsp) => {
  const qrystr = `INSERT INTO reports (when_reported, username, bin_id, incident_id, comments) VALUES ($1,$2,$3,$4,$5)`;
  const b = req.body;
  rsp.json(
    db.query(qrystr, [b.when_reported, b.username, b.bin_id, 0, b.comments])
  );
});

app.get("/getBins", async (req, rsp) => {
  const qResult = await db.query(`SELECT id, description FROM bins`);
  rsp.json(qResult.rows);
});

app.post("/addMsg", async (req, res) => {
  const body = req.body;
  const query = await db.query(
    `INSERT INTO messages (username, message, timestamp, messageboardid) VALUES ($1, $2, $3, $4) RETURNING id`,
    [body.user_name, body.message, body.time_stamp, body.message_board_id]
  );
  res.json(query.rows);
});

app.post("/addMsgBoard", async (req, res) => {
  const body = req.body;
  const query = await db.query(
    `INSERT INTO messageboards (name, updated) VALUES ($1, $2) RETURNING id`,
    [body.name, body.time_stamp]
  );
  res.json(query.rows);
});

app.get("/getMsgs/:id", async (req, res) => {
  const params = req.params;
  const query = await db.query(
    `SELECT * FROM messages WHERE messageboardid=($1) ORDER BY id ASC`,
    [params.id]
  );
  let data = query.rows;
  res.json(data);
});

app.get("/getMsgBoards", async (req, res) => {
  const query = await db.query(`SELECT * FROM messageboards ORDER BY id ASC`);
  let data = query.rows;
  res.json(data);
});

app.put("/updateMsgBoard/:id/:timestamp", (req, res) => {
  const params = req.params;
  const query = db.query(
    `UPDATE messageboards SET updated=($1) WHERE id=($2)`,
    [params.timestamp, params.id]
  );
  res.json(query);
});

app.delete("/deleteMsg/:id", (req, res) => {
  const params = req.params;
  const query = db.query(`DELETE FROM messages WHERE id=($1)`, [params.id]);
  res.json(query);
});

app.delete("/deleteMsgBoard/:id", (req, res) => {
  const params = req.params;
  const query = db.query(`DELETE FROM messageboards WHERE id=($1)`, [
    params.id,
  ]);
  res.json(query);
});
