
const router = require("express").Router();
let pgSchemaMaker = {
    /*******************  COLLECTION/TABLE NAME *****************************/
    tableName: "feedersonsubstations"
    /***********  COLLECTION/TABLE COLUMN DESCRIPTION ***********************/
    ,createTable: async function(){
        this.client.query(`
            CREATE TABLE IF NOT EXISTS "public"."${this.tableName}" (
                
                          _id uuid NOT NULL DEFAULT gen_random_uuid(),
                substation_id varchar(255) COLLATE "pg_catalog"."default",
                    feeder_id varchar(255) COLLATE "pg_catalog"."default",
                   timestamps timestamp(6) DEFAULT CURRENT_TIMESTAMP

            );`, function(err, result) {
            if(err) return console.error(err);
        });
    },
    
};

/**************** CRUD ROUTING DECLARATIONS BELOW ****************/

router.route("/create").post((req,res) => { //upsert function
    const {substation_id, feeder_id} = req.body;
    var query = `   
                    INSERT INTO ${pgSchemaMaker.tableName} (_id,substation_id, feeder_id)
                    VALUES(gen_random_uuid(),'${substation_id}', '${feeder_id}') 
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
                                    SELECT * FROM ${pgSchemaMaker.tableName}
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
router.route("/substation/:id").get((req,res) => {
    pgSchemaMaker.client.query(`
                                    SELECT * FROM ${pgSchemaMaker.tableName} WHERE substation_id='${req.params.id}'
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else
        res.json(result.rows);
    });
});

router.route("/update").post((req,res) => { //upsert function
    const {_id} = req.body[0],
          {substation_id, feeder_id} = req.body[1];
    var query = `   
                    UPDATE ${pgSchemaMaker.tableName}
                        SET  substation_id =  ${substation_id}',
                                 feeder_id = '${feeder_id}'
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
