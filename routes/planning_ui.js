const Router = require("express-promise-router");
const { rows } = require("pg/lib/defaults");
let router = new Router();
const db = require("../configs/db")
const moment = require("moment")
router.post('/SaveData',async (req,res,next) => {
    try {
        let COLUMN = req.body.COLUMN;
        let RawData = req.body.DATA ;
        RawData = JSON.parse(RawData)
        let array_insert = [];
        RawData.forEach(function(item){
            array_insert.push(`('${item.join("','")}')`)
        });
        if(array_insert.length === 0) {
            return res.json("FAIL");
        }
        let sql = `INSERT INTO public.planning_m5(${COLUMN}) VALUES ${array_insert.join(",")}`
        const result =  await db.query(sql);
        if(result.rowCount > 0){
            res.json("OK")
        }else{
            res.json("FAIL")
        }
        
       
    } catch (err) {
        console.log(err)
    }
})

router.post('/SaveData_item_unable', async (req,res,next) => {
    let COLUMN = req.body.COLUMN;
    let RawData = req.body.DATA;
    let array_insert = [];

    RawData = JSON.parse(RawData);
    RawData.forEach(function(item){
        array_insert.push(`('${item.join("','")}')`)
    });
    if(array_insert.length === 0){
        return res.json("FAIL")
    }
    let sql = `INSERT INTO public.item_unable(${COLUMN}) VALUES ${array_insert.join(",")}`
    const result =  await db.query(sql);
    if(result.rowCount > 0){
        res.json("OK")
    }else{
        res.json("FAIL")
    }
})

router.post('/LoadData',async (req,res,next) => {
    let html_string = "<rows>";
    const DataRaw = await db.query(`SELECT po,so_line,order_item,oracle_item,rbo,qty,ups,sku,printing_size,inlay_position,inlay_code,needed_inlay_quantity,basesheet_code,needed_basesheet_quantity,inlay_status,basesheet_status,rm_status,wip_status,po_readiness,lasted_plan_time,adjusted_lasted_plan_time,service_priority,due_date,quantity_sheet,quantity_already_ran_sheet,quantity_need_to_run_sheet,service_risk,setup_time,run_time,total_needed_time,estimated_finish_time,po_note,machine,position_in_machine FROM public.planning_m5`);
    let number_key = 0 ;
    DataRaw.rows.forEach(function(row){
        html_string += `<row id='${number_key + 1}'>`;
        html_string += `<cell></cell>`
        html_string += `<cell>${row.po}</cell>`
        html_string += `<cell>${row.so_line}</cell>`
        html_string += `<cell>${row.order_item}</cell>`
        html_string += `<cell>${row.oracle_item}</cell>`
        html_string += `<cell>${row.rbo}</cell>`
        html_string += `<cell>${row.qty}</cell>`
        html_string += `<cell>${row.ups}</cell>`
        html_string += `<cell>${row.sku}</cell>`
        html_string += `<cell>${row.printing_size}</cell>`
        html_string += `<cell>${row.inlay_position}</cell>`
        html_string += `<cell>${row.inlay_code}</cell>`
        html_string += `<cell>${row.needed_inlay_quantity}</cell>`
        html_string += `<cell>${row.basesheet_code}</cell>`
        html_string += `<cell>${row.needed_basesheet_quantity}</cell>`
        html_string += `<cell>${row.inlay_status}</cell>`
        html_string += `<cell>${row.basesheet_status}</cell>`
        html_string += `<cell>${row.rm_status}</cell>`
        html_string += `<cell>${row.wip_status}</cell>`
        html_string += `<cell>${row.po_readiness}</cell>`
        html_string += `<cell>${row.lasted_plan_time}</cell>`
        html_string += `<cell>${row.adjusted_lasted_plan_time}</cell>`
        html_string += `<cell>${row.service_priority}</cell>`
        html_string += `<cell>${row.due_date}</cell>`
        html_string += `<cell>${row.quantity_sheet}</cell>`
        html_string += `<cell>${row.quantity_already_ran_sheet}</cell>`
        html_string += `<cell>${row.quantity_need_to_run_sheet}</cell>`
        html_string += `<cell>${row.service_risk}</cell>`
        html_string += `<cell>${row.setup_time}</cell>`
        html_string += `<cell>${row.run_time}</cell>`
        html_string += `<cell>${row.total_needed_time}</cell>`
        html_string += `<cell>${row.estimated_finish_time}</cell>`
        html_string += `<cell>${row.po_note}</cell>`
        html_string += `<cell>${row.machine}</cell>`
        html_string += `<cell>${row.position_in_machine}</cell>`
        html_string += `</row>`;
        number_key++ ;
    })
    html_string +="</rows>";
    res.type('application/xml');
    res.send(html_string)
})
function stringToDate(_date,_format,_delimiter)
{
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}

router.post('/Cal',async (req,res,next) =>{
    // let today = stringToDate("24/01/2022 00:00","dd/MM/yyyy","/");
    let MainResult = [] ;

    const DataRaw = await db.query(`SELECT po,so_line,inlay_code,oracle_item,po_readiness,lasted_plan_time,adjusted_lasted_plan_time,
    service_priority::int
    ,due_date,quantity_sheet,quantity_already_ran_sheet,quantity_need_to_run_sheet,service_risk,setup_time,run_time,total_needed_time,estimated_finish_time,po_note,machine,position_in_machine 
    FROM public.planning_m5 
     WHERE lasted_plan_time::date <= '24/01/2022 00:00'
     ORDER BY service_priority`);
    if(DataRaw.rowCount > 0){
        MainResult = DataRaw.rows ;
    }
    let check_item_kl01 = false ;
    let check_item_kl02 = false ;
    let check_item_kl03 = false ;

    // total time 
    let total_time_kl01 = 1200 ;
    let total_time_kl02 = 1200 ;
    let total_time_kl03 = 1200 ;

    let calculate_time_kl01 = 0 ;
    let calculate_time_kl02 = 0 ;
    let calculate_time_kl03 = 0 ;

    let result_kl01 = [];
    let result_kl02 = [];   
    let result_kl03 = [];   

    let check_inlay_code_kl01 = false;
    let check_inlay_code_kl02 = false;
    let check_inlay_code_kl03 = false;

    let check_time_date_kl01 = null ;
    let check_time_date_kl02 = null ;
    let check_time_date_kl03 = null ;


    for(var i = 0 ; i < MainResult.length; i++){
        // Trạm Inlay
        const CheckResultItem_kl01 = await db.query(`SELECT kl01 FROM public.item_unable WHERE kl01 = '${MainResult[i].oracle_item}'`)
        if(CheckResultItem_kl01.rowCount > 0){
            check_item_kl01 = true ;
        }
        const CheckResultItem_kl02 = await db.query(`SELECT kl02 FROM public.item_unable WHERE kl02 = '${MainResult[i].oracle_item}'`)
        if(CheckResultItem_kl02.rowCount > 0){
            check_item_kl02 = true ;
        }
        const CheckResultItem_kl03 = await db.query(`SELECT kl03 FROM public.item_unable WHERE kl03 = '${MainResult[i].oracle_item}'`)
        if(CheckResultItem_kl03.rowCount > 0){
            check_item_kl03 = true ;
        }
        // No machine can run
        if(check_item_kl01 === true && check_item_kl02 === true && check_item_kl03 === true){
            MainResult[i].po_note = 'Cannot run due to unable item'
        }
        // >= 1 machine can run
            //calculate : available time of machine - total time of PO
            // - cal : kl01 
            if(check_item_kl01 === false){//check item
                calculate_time_kl01 = Number(total_time_kl01) -  Number(MainResult[i].total_needed_time);
            }else{
                  MainResult[i].po_note = 'Cannot run due to unable item'
            }
             // - cal : kl02 
             if(check_item_kl02 === false){//check item
                calculate_time_kl02 = total_time_kl02 -  Number(MainResult[i].total_needed_time);
            }else{
                  MainResult[i].po_note = 'Cannot run due to unable item'
            }
             // - cal : kl03 
             if(check_item_kl03 === false){//check item
                calculate_time_kl03 = total_time_kl03 -   Number(MainResult[i].total_needed_time);
            }else{
                  MainResult[i].po_note = 'Cannot run due to unable item'
            }
            // No machine having result calculate >= -30 min
            if(calculate_time_kl03 <= -30 && calculate_time_kl01 <= -30 && calculate_time_kl02 <= -30){
                MainResult[i].po_note = " Cannot run due to lack of cap";
            }

            //case : >= 1 machine having result >= -30 ;
            //KL01
            if(check_item_kl01 === false && calculate_time_kl01 >= -30){
                // search inlay code , check status
                if(result_kl01.length > 0){
                    let dr_kl1 = result_kl01.filter(R => R = `${ MainResult[i].inlay_code}` )
                    if(dr_kl1.length > 0){
                        check_inlay_code_kl01 = true;
                    }
                }else{
                    check_inlay_code_kl01 = false;

                }
            }
            //kl02
            if(check_item_kl02 === false && calculate_time_kl02 >= -30){
                // search inlay code , check status
                if(result_kl02.length > 0){
                    let dr_kl2 = result_kl02.filter(R => R = `${ MainResult[i].inlay_code}` )
                    if(dr_kl2.length > 0){
                        check_inlay_code_kl02 = true;
                    }
                }
            }
            //kl03
            if(check_item_kl03 === false && calculate_time_kl03 >= -30){
                // search inlay code , check status
                if(result_kl03.length > 0){
                    let dr_kl3 = result_kl03.filter(R => R = `${ MainResult[i].inlay_code}` )
                    if(dr_kl3.length > 0){
                        check_inlay_code_kl03 = true;
                    }
                }
            }

            // No machine having same inlay code 
            
            //KL01
            if( check_item_kl03 === false && calculate_time_kl03 >= -30 && check_inlay_code_kl01 === false){
            // CaLculate : Estimated finíh time of PO in machine  - adjusted lasted plan time of PO ;
             let Estimated_finish_time_po_machine = ""
                if(result_kl01.length>0){
                    Estimated_finish_time_po_machine  = moment(`'${result_kl01[result_kl01.length - 1].estimated_finish_time}','DD-MM-YYYY HH:mm'`).toDate()
                  
                }else{
                    Estimated_finish_time_po_machine =  moment('24/01/2022 00:00','DD-MM-YYYY HH:mm').toDate()
                  

                }
                let Adjust_lasted_po = moment(`'${MainResult[i].adjusted_lasted_plan_time}'`,'DD-MM-YYYY HH:mm').toDate()
                check_time_date_kl01 = Math.abs(Estimated_finish_time_po_machine - Adjust_lasted_po )
            }
            //KL02
            if(check_item_kl03 === false && calculate_time_kl03 >= -30 && check_inlay_code_kl02 === false){
                let Estimated_finish_time_po_machine = null
                if(result_kl02.length>0){
                    Estimated_finish_time_po_machine  = moment(`'${result_kl02[result_kl02.length - 1].estimated_finish_time}','DD-MM-YYYY HH:mm'`).toDate()
                }else{
                    Estimated_finish_time_po_machine =  moment('24/01/2022 00:00','DD-MM-YYYY HH:mm').toDate()
                }
                let Adjust_lasted_po = moment(`'${MainResult[i].adjusted_lasted_plan_time}'`,'DD-MM-YYYY HH:mm').toDate()
                check_time_date_kl02 = Math.abs(Estimated_finish_time_po_machine - Adjust_lasted_po )
            }else
            //KL03
            if(check_item_kl03 === false && calculate_time_kl03 >= -30 && check_inlay_code_kl03 === false){
                let Estimated_finish_time_po_machine = null
                if(result_kl03.length>0){
                    Estimated_finish_time_po_machine  = moment(`'${result_kl03[result_kl03.length - 1].estimated_finish_time}','DD-MM-YYYY HH:mm'`).toDate()
                }else{

                   Estimated_finish_time_po_machine =   moment('24/01/2022 00:00','DD-MM-YYYY HH:mm').toDate()
                   
                }
                let Adjust_lasted_po = moment(`'${MainResult[i].adjusted_lasted_plan_time}'`,'DD-MM-YYYY HH:mm').toDate()
                check_time_date_kl03 = Math.abs(Estimated_finish_time_po_machine - Adjust_lasted_po )
            }else
            // Case no code inlay :  Find machine having biggest result
            if(check_time_date_kl01 === check_time_date_kl02 && check_time_date_kl01 ===  check_time_date_kl03){
                result_kl01.push({
                    "po" : MainResult[i].po,
                    "so_line" : MainResult[i].so_line,
                    "oracle_item" : MainResult[i].oracle_item,
                    "lasted_plan_time" : MainResult[i].lasted_plan_time,
                    "adjusted_lasted_plan_time" : MainResult[i].adjusted_lasted_plan_time,
                    "service_priority" : MainResult[i].service_priority,
                    "estimated_finish_time" : MainResult[i].estimated_finish_time,
                    "po_note" : MainResult[i].po_note,
                    "inlay_code" : MainResult[i].inlay_code,
                 })
            }
            if(check_time_date_kl01 < check_time_date_kl02 &&  check_time_date_kl02 === check_time_date_kl02){
                result_kl02.push({
                    "po" : MainResult[i].po,
                    "so_line" : MainResult[i].so_line,
                    "oracle_item" : MainResult[i].oracle_item,
                    "lasted_plan_time" : MainResult[i].lasted_plan_time,
                    "adjusted_lasted_plan_time" : MainResult[i].adjusted_lasted_plan_time,
                    "service_priority" : MainResult[i].service_priority,
                    "estimated_finish_time" : MainResult[i].estimated_finish_time,
                    "po_note" : MainResult[i].po_note,
                    "inlay_code" : MainResult[i].inlay_code,
                 })
            }
            if(check_time_date_kl01 === check_time_date_kl02 &&  check_time_date_kl01 >  check_time_date_kl03){
                result_kl01.push({
                    "po" : MainResult[i].po,
                    "so_line" : MainResult[i].so_line,
                    "oracle_item" : MainResult[i].oracle_item,
                    "lasted_plan_time" : MainResult[i].lasted_plan_time,
                    "adjusted_lasted_plan_time" : MainResult[i].adjusted_lasted_plan_time,
                    "service_priority" : MainResult[i].service_priority,
                    "estimated_finish_time" : MainResult[i].estimated_finish_time,
                    "po_note" : MainResult[i].po_note,
                    "inlay_code" : MainResult[i].inlay_code,
                 })
            }
            if(check_time_date_kl01 > check_time_date_kl02 && calculate_time_kl01 > check_time_date_kl03){
                result_kl01.push({
                   "po" : MainResult[i].po,
                   "so_line" : MainResult[i].so_line,
                   "oracle_item" : MainResult[i].oracle_item,
                   "lasted_plan_time" : MainResult[i].lasted_plan_time,
                   "adjusted_lasted_plan_time" : MainResult[i].adjusted_lasted_plan_time,
                   "service_priority" : MainResult[i].service_priority,
                   "estimated_finish_time" : MainResult[i].estimated_finish_time,
                   "po_note" : MainResult[i].po_note,
                   "inlay_code" : MainResult[i].inlay_code,
                })
            }
            if(check_time_date_kl01 > check_time_date_kl02 && calculate_time_kl01 < check_time_date_kl03){
                result_kl03.push({
                   "po" : MainResult[i].po,
                   "so_line" : MainResult[i].so_line,
                   "oracle_item" : MainResult[i].oracle_item,
                   "lasted_plan_time" : MainResult[i].lasted_plan_time,
                   "adjusted_lasted_plan_time" : MainResult[i].adjusted_lasted_plan_time,
                   "service_priority" : MainResult[i].service_priority,
                   "estimated_finish_time" : MainResult[i].estimated_finish_time,
                   "po_note" : MainResult[i].po_note,
                   "inlay_code" : MainResult[i].inlay_code,
                })
            }
            if(check_time_date_kl01 < check_time_date_kl02 && calculate_time_kl01 < check_time_date_kl03){
                result_kl02.push({
                   "po" : MainResult[i].po,
                   "so_line" : MainResult[i].so_line,
                   "oracle_item" : MainResult[i].oracle_item,
                   "lasted_plan_time" : MainResult[i].lasted_plan_time,
                   "adjusted_lasted_plan_time" : MainResult[i].adjusted_lasted_plan_time,
                   "service_priority" : MainResult[i].service_priority,
                   "estimated_finish_time" : MainResult[i].estimated_finish_time,
                   "po_note" : MainResult[i].po_note,
                   "inlay_code" : MainResult[i].inlay_code,
                })
            }

        }
    res.send({
        "result_kl01" : result_kl01,
        "result_kl02" : result_kl02,
        "result_kl03" : result_kl03,

    })
})

module.exports = router