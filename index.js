//connects the declared table to the PostGre Client
function assignClientToTable(pgClient,xTableSchema){
    let {pgSchemaMaker,router} = require(xTableSchema); // activate schema and router modules
    pgSchemaMaker.client = pgClient; // link schema to postgre client module
    pgSchemaMaker.createTable();     // cannot execute this if pgSchemaMaker.client is null
    return router;                   // 
}

const express = require("express"); // express is a node.js module that handles server side counications
const cors = require('cors');       // cors is a Cross-Origin Resource Sharing module used by express 
const { Client } = require('pg');   // pg is a PostGres Database Client module
require("dotenv").config;           // dotenv is for environental variables say 'process.env.PORT'

const app = express();                  // initialize app as an express constant
app.use(cors());                        // enables cross-origin resource sharing of app
app.use(express.json({limit: '50mb'})); // make json serializer available with max of 50MB payload

const                      port =   process.env.PORT || 5000;                     // auto assign port by Heroku 
//const       connecting_String =   "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase";
const         connecting_String =   process.env.DATABASE_URL || "postgres://postgres:sa@localhost:5432/postgres";  // auto assign db con str by Heroku
let client = new Client({                // initialize pg client module
    connectionString: connecting_String, // assign pg database connection string
    ssl: {rejectUnauthorized: false}     // disable certificate checking //comment out for local connections
});

client.connect();                        // connect pg client to actual database described in the connection string
console.log(`Postgres database connection is OK! @ ${ connecting_String }`);

// assign api route to postgres database schema controller
app.use('/test',                 assignClientToTable(client,"./postgres_schema/test")); 
app.use('/loginlist',            assignClientToTable(client,"./postgres_schema/c2users"));
app.use('/towns',                assignClientToTable(client,"./postgres_schema/towns"));
app.use('/feeders',              assignClientToTable(client,"./postgres_schema/feeders"));
app.use('/substations',          assignClientToTable(client,"./postgres_schema/substations"));
app.use('/geojsons',             assignClientToTable(client,"./postgres_schema/geojsons"));
app.use('/geojsonfiles',         assignClientToTable(client,"./postgres_schema/geojsonfiles"));
app.use('/feedersontowns',       assignClientToTable(client,"./postgres_schema/feedersontowns"));
app.use('/feedersonsubstations', assignClientToTable(client,"./postgres_schema/feedersonsubstations"));
app.use('/custsongeojsons',      assignClientToTable(client,"./postgres_schema/custsongeojsons"));

// start node js api server
console.log("Starting backend API server ....");
app.listen(port, () => {
    console.log(`Server is running on port: ${ port }`);
});