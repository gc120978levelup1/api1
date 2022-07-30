
const router = require("express").Router();
let pgSchemaMaker = {
    /*******************  COLLECTION/TABLE NAME *****************************/
    tableName: "t1"
    /***********  COLLECTION/TABLE COLUMN DESCRIPTION ***********************/
    ,createTable: async function(){
        this.client.query(`
            CREATE TABLE IF NOT EXISTS "public"."${ this.tableName }" ("_id" uuid NOT NULL DEFAULT gen_random_uuid(),
                    
                "data1" varchar(255) COLLATE "pg_catalog"."default",
                "datax" text COLLATE "pg_catalog"."default",
                "data2" numeric,
                "data3" bool,
                "data4" json,
                "data5" date, 
                    
            "updatedAt" timestamp(6) DEFAULT CURRENT_TIMESTAMP);`, function(err, result) {
            if(err) return console.error(err);
        });
    },
    
};

/**************** CRUD ROUTING DECLARATIONS BELOW ****************/

router.route("/create").post((req,res) => { //upsert function
    const {data1,data2,data3,data4,data5} = req.body;
    var query = `   
            INSERT INTO ${ pgSchemaMaker.tableName } (_id,
                data1,data2,data3,data4,data5
            )
            VALUES(gen_random_uuid(),
                '${ data1 }', ${ data2 }, ${ data3 }, '${ JSON.stringify(data4) }', '${ data5 }'
            ) 
            ON CONFLICT (data1) 
            DO 
            UPDATE
                SET  
                    data2 =  ${ data2 },
                    data3 =  ${ data3 },
                    data4 = '${ JSON.stringify(data4) }',
                    data5 = '${data5}'
                WHERE ${ pgSchemaMaker.tableName }.data1 = '${data1}' 
            RETURNING *;
    `;
    pgSchemaMaker.client.query(query,(err, result) => {
        if (err) res.status(400).json("Error: "+err+" => "+query);else res.json(result.rows);
    });
});

//READ - LIST ALL
router.route("/").get((req,res) => {
    pgSchemaMaker.client.query(`
            SELECT * FROM ${ pgSchemaMaker.tableName }
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else res.json(result.rows);
    });
});

//READ - LIST one
router.route("/:id").get((req,res) => {
    pgSchemaMaker.client.query(`
            SELECT * FROM ${ pgSchemaMaker.tableName } WHERE _id='${ req.params.id }'
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else res.json(result.rows);
    });
});

//READ - LIST MANY TO ONE
router.route("/ofuser/:id").get((req,res) => {
    pgSchemaMaker.client.query(`
            SELECT * FROM ${ pgSchemaMaker.tableName } WHERE data2='${ req.params.id }'
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else res.json(result.rows);
    });
});

//SELECT * FROM "t1" where (CAST( data4 AS TEXT ) like '%john%') casting json to text
//UPDATE ONE
router.route("/update").post((req,res) => { //upsert function
    const {_id} =  req.body[0];
    const {data1,data2,data3,data4,data5} = req.body[1];
    var query = `   
            UPDATE ${ pgSchemaMaker.tableName }
                SET  
                        data1 = ${ data1 },
                        data2 = ${ data2 },
                        data3 = ${ data3 },
                        data4 = '${ JSON.stringify(data4) }',
                        data5 = '${ data5 }'
                WHERE ${ pgSchemaMaker.tableName }._id = '${ _id }' 
            RETURNING *;
    `;
    pgSchemaMaker.client.query(query,(err, result) => {
        if (err) res.status(400).json("Error: "+err+" => "+query);else res.json(result.rows);
    });
});

//DELETE ONE
router.route("/delete").post((req,res) => {
    const {_id} = req.body;
    pgSchemaMaker.client.query(`
            DELETE FROM  ${ pgSchemaMaker.tableName } WHERE _id = '${ _id }' RETURNING *;
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else res.json(result.rows);
    });
});


/**************** EXPORT TO OUTSIDE ****************/
module.exports = {pgSchemaMaker,router};
