
const router = require("express").Router();
let pgSchemaMaker = {
    /*******************  COLLECTION/TABLE NAME *****************************/
    tableName: "c2users"
    /***********  COLLECTION/TABLE COLUMN DESCRIPTION ***********************/
    ,createTable: async function(){
        this.client.query(`
            CREATE TABLE IF NOT EXISTS "public"."${this.tableName}" (
                
                      _id uuid NOT NULL DEFAULT gen_random_uuid(),
                encrypted text COLLATE "pg_catalog"."default",
               timestamps timestamp(6) DEFAULT CURRENT_TIMESTAMP

            );`, function(err, result) {
            if(err) return console.error(err);
        });
    },
};

/**************** CRUD ROUTING DECLARATIONS BELOW ****************/

//upsert one
router.route("/update").post((req,res) => { //upsert function
    const {_id} = req.body[0],
          {encrypted} = req.body[1];
    var query = `   
            INSERT INTO ${pgSchemaMaker.tableName} (_id, encrypted)
            VALUES ('${_id}','${encrypted}')
    `;
    pgSchemaMaker.client.query(query,(err, result) => {
        if (err) res.status(400).json("Error: "+err+" => "+query);else
        res.json(result.rows[0]);
    });
});

//READ - LIST ALL
router.route("/").get((req,res) => {
    pgSchemaMaker.client.query(`
                                    SELECT * FROM ${pgSchemaMaker.tableName}
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else
        res.json(result.rows[0]);
    });
});

//READ - LIST one
router.route("/:id").get((req,res) => {
    pgSchemaMaker.client.query(`
                                    SELECT * FROM ${pgSchemaMaker.tableName} WHERE _id='${req.params.id}'
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else
        res.json(result.rows[0]);
    });
});

/**************** EXPORT TO OUTSIDE ****************/
module.exports = {pgSchemaMaker,router};
