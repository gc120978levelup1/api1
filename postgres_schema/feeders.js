
const router = require("express").Router();
let pgSchemaMaker = {
    /*******************  COLLECTION/TABLE NAME *****************************/
    tableName: "feeders"
    /***********  COLLECTION/TABLE COLUMN DESCRIPTION ***********************/
    ,createTable: async function(){
        this.client.query(`
            CREATE TABLE IF NOT EXISTS "public"."${this.tableName}" (
                
                      _id uuid NOT NULL DEFAULT gen_random_uuid(),
                     name varchar(255) COLLATE "pg_catalog"."default",
                  address varchar(255) COLLATE "pg_catalog"."default",
               geojson_id varchar(255) COLLATE "pg_catalog"."default",
               timestamps timestamp(6) DEFAULT CURRENT_TIMESTAMP

            );`, function(err, result) {
            if(err) return console.error(err);
        });
    },
    
};

/**************** CRUD ROUTING DECLARATIONS BELOW ****************/

router.route("/create").post((req,res) => { //upsert function
    let {name,address,geojson_id} = req.body;
    if (geojson_id === null) geojson_id = "";
    var query = `   
                    INSERT INTO ${pgSchemaMaker.tableName} (_id,name,address,geojson_id)
                    VALUES(gen_random_uuid(),'${name}','${address}','${geojson_id}') 
                    RETURNING *;
    `;
    pgSchemaMaker.client.query(query,(err, result) => {
        if (err) res.status(400).json("Error: "+err+" => "+query);else
        res.json(result.rows[0]);
    });
});

//READ - LIST ALL
router.route("/").get((req,res) => {
    pgSchemaMaker.client.query(`
                                    SELECT * FROM ${pgSchemaMaker.tableName} order by ${pgSchemaMaker.tableName}.name asc;
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else
        res.json(result.rows);
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

//READ - LIST MANY TO ONE
router.route("/ofuser/:id").get((req,res) => {
    pgSchemaMaker.client.query(`
                                    SELECT * FROM ${pgSchemaMaker.tableName} WHERE data2='${req.params.id}'
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else
        res.json(result.rows[0]);
    });
});


router.route("/update").post((req,res) => { //upsert function
    const {_id} = req.body[0],
        {name,address,geojson_id} = req.body[1];
    var query = `   
                    UPDATE ${pgSchemaMaker.tableName}
                        SET        name = '${name}',
                                address = '${address}',
                             geojson_id = '${geojson_id}'
                        WHERE ${pgSchemaMaker.tableName}._id = '${_id}'
                    RETURNING *;
    `;
    pgSchemaMaker.client.query(query,(err, result) => {
        if (err) res.status(400).json("Error: "+err+" => "+query);else
        res.json(result.rows[0]);
    });
});

//DELETE ONE
router.route("/delete").post((req,res) => {
    const {_id} = req.body;
    pgSchemaMaker.client.query(`
                                    DELETE FROM  ${pgSchemaMaker.tableName} WHERE _id='${_id}'
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else
        res.json(result.rows[0]);
    });
});

/**************** EXPORT TO OUTSIDE ****************/
module.exports = {pgSchemaMaker,router};
