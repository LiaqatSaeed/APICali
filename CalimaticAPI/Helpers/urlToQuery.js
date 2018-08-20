
var GetParamsValue = (params, callback) => {
    params.replace(/\((.*?)\)/g, function (_, match) {
        callback(match);
    });

}


var isEmpty = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


module.exports =[(req,res,next)=>{
    req.sqlCommands = ["SELECT", "UPDATE", "INSERT", "DELETE"];
    req.WebSecret = '@Password!@#';
    next();
},(req,res,next)=>{//Get Sql Commands
    
    if (!isEmpty(req.query)) {
       var query = Object.getOwnPropertyNames(req.query);
        query.map(command => {
            req.sqlCommands.find(k => {
                if (k == command.toUpperCase()) {
                    req.Command = k;
    
                }
    
            })
        });
        next();  
    }else{
       next()
    }
},(req,res,next)=>{//Get db Column Name from Url
    try {

        
        if(req.query.$select != undefined){
            var columns = " ";
            
            req.query.$select = req.query.$select.split(",");
            req.query.$select.map(prop => {
                columns += req.Dto[prop.toString()] != undefined ? req.Dto[prop.toString()] + "," : "";
            })
            req.columns =  columns.substring(",", columns.length - 1);
            next()
        }else{
            next();
        }


    } catch (error) {
        console.log('Error While Matching DB Column name from Query String')
        res.send(500);
    }
},(req,res,next)=>{//Make params for DB Query
    
        if (req.query.$filter != undefined) {
            var where = req.query.$filter;
          req.top = req.query.$top;
            
            // First Step
            where = where.replace(new RegExp("eq", 'g'), " = ");


            //Second Step 
            where = where.replace(new RegExp("Or", 'g'), " or ");



            // GetParamsValue(params, (match) => {
            //     txtToReplace.push(match);
            // })

            //Second Step 
            where = where.replace(new RegExp("and", 'g'), " and ");
            var counter = 0;


            // GetParamsValue(where, (match) => {

            //     if (isNaN(match)) {
            //         where = where.replace("(" + match + ")", "'" + txtToReplace[counter] + "'");

            //     }
            //     else {
            //         where = where.replace("(" + match + ")", txtToReplace[counter]);
            //     }
            //     counter++;
            //     // console.log(where);
            // })
      
            where = where.toUpperCase()
            Object.getOwnPropertyNames(req.Dto).map(col => {
                
               var rexExp ="\\b"+ col.toUpperCase()+"\\b";
                where = where.replace(new RegExp(rexExp, 'g'), req.Dto[col.toString()])
            })

        }
        req.Where = where != undefined ? " Where " + where.toLowerCase() : "";
       
        next();
},(req,res,next)=>{

if(req.query.$skip != undefined && req.query.$take != undefined){
   req.pagging = " ORDER BY "+req.Dto["key"] +(req.query.$order != undefined ? " "+req.query.$order.toLowerCase():"")+" OFFSET    "+req.query.$skip+" ROWS  FETCH NEXT "+req.query.$take+" ROWS ONLY"; 
   next();
}else{
    next();
}

},(req,res,next)=>{//Make Query 
    switch (req.Command) {
        
        case "SELECT":
        req.sqlQuery = req.Command + (req.top = req.top != undefined ? " TOP(" + req.top + ") " : " ") 
        + (req.columns = req.columns != "" ? req.columns : " * ") + 
        " from " + req.TableName + req.Where + (req.pagging = req.pagging != undefined ? req.pagging:"");
            break;
        case "UPDATE":

            break;
        case "INSERT":

            break;
        case "DELETE":

            break;

        default:
        req.sqlQuery = req.Command = req.Command != undefined ? req.Command : "SELECT " + 
        (req.top = req.top != undefined ? " TOP(" + req.top + ") " : " ") + 
        (req.columns = (req.columns != "" && req.columns != undefined) ? req.columns : " * ") + 
        " from " + req.TableName + req.Where + (req.pagging = req.pagging != undefined ? req.pagging:"");
            break;
    }
    next();
}]




