const Router = require("express-promise-router");
let router = new Router();

router.post('/SaveData',async (req,res,next) => {
    try {
        let COLUMN = req.body.COLUMN;
        let RawData = req.body.DATA ;
        RawData = JSON.parse(RawData)
        let array_dt = [];
        let array_insert = [];
        RawData.forEach(function(item){
            array_insert.push(`('${item.join("','")}')`)
        });
        if(array_insert.length === 0) {
            return res.json("FAIL");
        }
        let sql = `INSERT INTO public.test(${COLUMN}) VALUES ${array_insert.join(",")}`
        // pool query
        res.json("OK")
    } catch (err) {
        console.log(err)
    }
})

module.exports = router