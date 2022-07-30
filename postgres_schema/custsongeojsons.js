
const router = require("express").Router();
let pgSchemaMaker = {
    /*******************  COLLECTION/TABLE NAME *****************************/
    tableName: "custsongeojsons_new"
    /***********  COLLECTION/TABLE COLUMN DESCRIPTION ***********************/
    ,createTable: async function(){
        this.client.query(`
            CREATE TABLE IF NOT EXISTS "public"."${this.tableName}" (
                
                      _id uuid NOT NULL DEFAULT gen_random_uuid(),
                 custdata json,   
               geojson_id varchar(255) COLLATE "pg_catalog"."default",
               timestamps timestamp(6) DEFAULT CURRENT_TIMESTAMP

            );`, function(err, result) {
            if(err) return console.error(err);
        });
    },
};

/**************** CRUD ROUTING DECLARATIONS BELOW ****************/

router.route("/update").post((req,res) => { //upsert function
    const  {geojson_id} = req.body[0];
    const  {custdata} = req.body[1];
    var query = `   
                    INSERT INTO ${pgSchemaMaker.tableName} (_id,custdata,geojson_id)
                    VALUES(gen_random_uuid(),'${JSON.stringify(custdata)}','${geojson_id}') 
                    ON CONFLICT (geojson_id) 
                    DO 
                    UPDATE
                        SET        
                            custdata = '${JSON.stringify(custdata)}'
                        WHERE ${pgSchemaMaker.tableName}.geojson_id = '${geojson_id}' 
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
        if (err) res.status(400).json("Error: "+err);
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
//SELECT * FROM "t1" where (CAST( data4 AS TEXT ) like '%john%') casting json to text
router.route("/ofcid/:id").get((req,res) => {
    pgSchemaMaker.client.query(`
             SELECT * FROM ${pgSchemaMaker.tableName} WHERE (CAST( custdata AS TEXT ) like '%${req.params.id}%');
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else{
            if (result.rows.length > 0){
                const cid = req.params.id;
                const {geojson_id} =  result.rows[0];
                res.json([{cid,geojson_id}]);
            }else{
                res.json([{cid: req.params.id, geojson_id: "no feeder found"}]);
            }
        }
    });
});

//READ - LIST MANY TO ONE
router.route("/ofgeojson_id/:id").get((req,res) => {
    pgSchemaMaker.client.query(`
            SELECT * FROM ${pgSchemaMaker.tableName} WHERE geojson_id='${req.params.id}'
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else
        res.json(result.rows);
    });
});
//SELECT * FROM "t1" where (CAST( data4 AS TEXT ) like '%john%') casting json to text
//UPDATE ONE

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
