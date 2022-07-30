
const router = require("express").Router();
let pgSchemaMaker = {
    /*******************  COLLECTION/TABLE NAME *****************************/
    tableName: "geojsons"
    /***********  COLLECTION/TABLE COLUMN DESCRIPTION ***********************/
    ,createTable: async function(){
        this.client.query(`
            CREATE TABLE IF NOT EXISTS "public"."${this.tableName}" (
                
                               _id uuid NOT NULL DEFAULT gen_random_uuid(),
                    DTDataFilename varchar(255) COLLATE "pg_catalog"."default",
                  PoleDataFilename varchar(255) COLLATE "pg_catalog"."default",
                  CustDataFilename varchar(255) COLLATE "pg_catalog"."default",
                 PLineDataFilename varchar(255) COLLATE "pg_catalog"."default",
                            DTData varchar(255) COLLATE "pg_catalog"."default",
                          PoleData varchar(255) COLLATE "pg_catalog"."default",
                          CustData varchar(255) COLLATE "pg_catalog"."default",
                         PLineData varchar(255) COLLATE "pg_catalog"."default",
                        timestamps timestamp(6) DEFAULT CURRENT_TIMESTAMP

            );`, function(err, result) {
            if(err) return console.error(err);
        });
    },
    
};

/**************** CRUD ROUTING DECLARATIONS BELOW ****************/

router.route("/create").post((req,res) => { //upsert function
    let {DTDataFilename,PoleDataFilename,CustDataFilename,PLineDataFilename,DTData,PoleData,CustData,PLineData} = req.body;
    if (DTDataFilename === null) DTDataFilename = "";
    if (PoleDataFilename === null) PoleDataFilename = "";
    if (CustDataFilename === null) CustDataFilename = "";
    if (PLineDataFilename === null) PLineDataFilename = "";
    if (DTData === null) DTData = "";
    if (PoleData === null) PoleData = "";
    if (CustData === null) CustData = "";
    if (PLineData === null) PLineData = "";
    var query = `   
                    INSERT INTO ${pgSchemaMaker.tableName} (_id,DTDataFilename,PoleDataFilename,CustDataFilename,PLineDataFilename,DTData,PoleData,CustData,PLineData)
                    VALUES(gen_random_uuid(),'${DTDataFilename}','${PoleDataFilename}','${CustDataFilename}','${PLineDataFilename}','${DTData}','${PoleData}','${CustData}','${PLineData}') 
                    RETURNING *;
    `;
    pgSchemaMaker.client.query(query,(err, result) => {
        if (err) res.status(400).json("Error: "+err+" => "+query);else
        res.json(result.rows[0]);
    });
});

router.route("/update").post((req,res) => { //upsert function
    const {_id} = req.body[0],
          {DTDataFilename,PoleDataFilename,CustDataFilename,PLineDataFilename,DTData,PoleData,CustData,PLineData} = req.body[1];
    var query = `   
                    UPDATE ${pgSchemaMaker.tableName}
                        SET     DTDataFilename = '${DTDataFilename}',
                              PoleDataFilename = '${PoleDataFilename}',
                              CustDataFilename = '${CustDataFilename}'
                             PLineDataFilename = '${PLineDataFilename}',
                                        DTData = '${DTData}',
                                      PoleData = '${PoleData}',
                                      CustData = '${CustData}'
                                     PLineData = '${PLineData}'
                        WHERE ${pgSchemaMaker.tableName}._id = '${_id}' 
                    RETURNING *;
    `;
    pgSchemaMaker.client.query(query,(err, result) => {
        if (err) res.status(400).json("Error: "+err+" => "+query);else
        res.json(result.rows[0]);
    });
});

router.route("/update/DTData").post((req,res) => { //upsert function
    const {_id} = req.body[0],
          {DTDataFilename,DTData} = req.body[1];
    var query = `   
                    UPDATE ${pgSchemaMaker.tableName}
                        SET     DTDataFilename = '${DTDataFilename}',
                                        DTData = '${DTData}'
                        WHERE ${pgSchemaMaker.tableName}._id = '${_id}' 
                    RETURNING *;
    `;
    pgSchemaMaker.client.query(query,(err, result) => {
        if (err) res.status(400).json("Error: "+err+" => "+query);else
        res.json(result.rows[0]);
    });
});

router.route("/update/PoleData").post((req,res) => { //upsert function
    const {_id} = req.body[0],
          {PoleDataFilename,PoleData} = req.body[1];
    var query = `   
                    UPDATE ${pgSchemaMaker.tableName}
                        SET     PoleDataFilename = '${PoleDataFilename}',
                                        PoleData = '${PoleData}'
                        WHERE ${pgSchemaMaker.tableName}._id = '${_id}' 
                    RETURNING *;
    `;
    pgSchemaMaker.client.query(query,(err, result) => {
        if (err) res.status(400).json("Error: "+err+" => "+query);else
        res.json(result.rows[0]);
    });
});


router.route("/update/CustData").post((req,res) => { //upsert function
    const {_id} = req.body[0],
          {CustDataFilename,CustData} = req.body[1];
    var query = `   
                    UPDATE ${pgSchemaMaker.tableName}
                        SET     CustDataFilename = '${CustDataFilename}',
                                        CustData = '${CustData}'
                        WHERE ${pgSchemaMaker.tableName}._id = '${_id}' 
                    RETURNING *;
    `;
    pgSchemaMaker.client.query(query,(err, result) => {
        if (err) res.status(400).json("Error: "+err+" => "+query);else
        res.json(result.rows[0]);
    });
});

router.route("/update/PLineData").post((req,res) => { //upsert function
    const {_id} = req.body[0],
          {PLineDataFilename,PLineData} = req.body[1];
    var query = `   
                    UPDATE ${pgSchemaMaker.tableName}
                        SET     PLineDataFilename = '${PLineDataFilename}',
                                        PLineData = '${PLineData}'
                        WHERE ${pgSchemaMaker.tableName}._id = '${_id}' 
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
        res.json(result.rows[0]);
    });
});

//READ - LIST one
router.route("/:id").get((req,res) => {
    pgSchemaMaker.client.query(`
            SELECT * FROM ${pgSchemaMaker.tableName} WHERE _id='${req.params.id}'
        `,(err, result) => {
        if (err) res.status(400).json("Error: "+err);else{
            const {dtdatafilename,poledatafilename,custdatafilename,plinedatafilename,dtdata,poledata,custdata,plinedata} = result.rows[0];
            let DTDataFilename = dtdatafilename ,
                PoleDataFilename = poledatafilename,
                CustDataFilename = custdatafilename,
                PLineDataFilename = plinedatafilename,
                DTData = dtdata,
                PoleData = poledata,
                CustData = custdata,
                PLineData = plinedata;
            res.json({DTDataFilename,PoleDataFilename,CustDataFilename,PLineDataFilename,DTData,PoleData,CustData,PLineData});
        }
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
