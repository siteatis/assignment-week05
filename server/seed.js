import pg from "pg";
import dotenv from "dotenv";
dotenv.config(); // Init dotenv
const log = console.log;
// Connect to DB (trxn pool) using the conn string in the env vars
const db = new pg.Pool({
  connectionString: process.env.database_url,
}); // log(db);

// Has to be async to chain them, otherwise the queries execute out of order
async function doReportingFormSeeding() {
  for (let q of [
    `DROP TABLE IF EXISTS bins, locations, incidents, reports`,
    `CREATE TABLE bins (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        lat NUMERIC,
        long NUMERIC,
        description VARCHAR(60),
        percent_full SMALLINT
    )`,
    `CREATE TABLE locations (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        lat NUMERIC,
        long NUMERIC
    )`,
    `CREATE TABLE incidents (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        type VARCHAR(1),
        lat NUMERIC,
        long NUMERIC,
        location_id INT
    )`,
    `CREATE TABLE reports (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        when_reported TIMESTAMP,
        username TEXT,
        bin_id INT,
        incident_id INT,
        comments TEXT
    )`,
    `INSERT INTO bins (lat,long,description,percent_full) VALUES (0,0,'Bin by main entrance',0)`,
    `INSERT INTO bins (lat,long,description,percent_full) VALUES (0,0,'Bin by newt pond',0)`,
    `INSERT INTO bins (lat,long,description,percent_full) VALUES (0,0,'Jumbo green dumpster',0)`,
    `INSERT INTO locations (lat,long) VALUES (0,0)`,
  ]) // TODO: Don't forget extra field needs adding to locations table
    await db.query(q);
  console.log("Reporting form tables (re-)created successfully!");
}
doReportingFormSeeding();
