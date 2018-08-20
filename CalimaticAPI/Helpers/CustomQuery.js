var sqlCommands = ["SELECT", "UPDATE", "INSERT", "DELETE"];


var Custom = {

    GetQuery: (query, TableName, Dto, callback) => {
        Custom.GetCommand(query,
            (Command) => {
                console.log(Command);
                Custom.GlobalFunctions(query, Dto,
                    (column) => {
                        console.log(column);
                        if (column != "error" && column !=  "") {
                            Custom.MakeParams(query.where, Dto,
                                (params) => {

                                    Custom.MakeQuery(Command, TableName, column, query.top, query.results, params,
                                        (Query) => {
                                            console.log(Query);
                                            callback(Query)
                                        })
                                })
                        }else{
                            callback("error");
                        }


                    }
                )


            }
        );

    },
    GetCommand: (qyeryName, callback) => {
        // Array.prototype.contains = function(k, callback) {
        //     var self = this;
        //     return (function check(i) {
        //         if (i >= self.length) {
        //             return callback(false);
        //         }

        //         if (self[i] === k) {
        //             return callback(true);
        //         }

        //         return process.nextTick(check.bind(null, i+1));
        //     }(0));
        // }
        var Command = "";
        if (!Custom.isEmpty(qyeryName)) {
            qyeryName = Object.getOwnPropertyNames(qyeryName);
            qyeryName.map(command => {

                sqlCommands.find(k => {
                    if (k == command.toUpperCase()) {
                        Command = k;

                    }

                })
            });
            callback(Command);
        }

    },
    MakeQuery: (command, Table, column, Top, results, params, callback) => {
        var Query = "";
        switch (command) {
            case "SELECT":
                Query = command + (Top = Top != undefined ? " TOP(" + Top + ") " : " ") + (column = column != "" ? column : " * ") + " from " + Table + (params = params != undefined ? params : "");
                break;
            case "UPDATE":

                break;
            case "INSERT":

                break;
            case "DELETE":

                break;

            default:
                break;
        }
        callback(Query);
    },
    MakeParams: (params, Dto, callback) => {
        var where = params;
        var txtToReplace = [];
        if (params != undefined) {

            // First Step
            where = params.replace(new RegExp("/", 'g'), " = ");


            //Second Step 
            where = where.replace(new RegExp("or", 'g'), " or ");



            Custom.GetParamsValue(params, (match) => {
                txtToReplace.push(match);
            })

            //Second Step 
            where = where.replace(new RegExp("and", 'g'), " and ");
            var counter = 0;


            Custom.GetParamsValue(where, (match) => {

                if (isNaN(match)) {
                    where = where.replace("(" + match + ")", "'" + txtToReplace[counter] + "'");

                }
                else {
                    where = where.replace("(" + match + ")", txtToReplace[counter]);
                }
                counter++;
                // console.log(where);
            })

            where = where.toUpperCase()
            Object.getOwnPropertyNames(Dto).map(col => {
                where = where.replace(new RegExp("KEY", 'g'), Dto[col.toString()])
            })

        }
        where = where != undefined ? " Where " + where : ""
        callback(where);
    },
    GetParamsValue: (params, callback) => {
        params.replace(/\((.*?)\)/g, function (_, match) {
            callback(match);
        });

    },
    GlobalFunctions: (query, Dto, callback) => {
        var subQuery = "";
        if (!Custom.isEmpty(query)) {

            if (query.Top != undefined) {
                subQuery = " TOP(" + query.Top.trim() + ")";
            }
            else if (query.select != undefined) {
                subQuery = Custom.GetValuePropertyNameBy(Dto, query.select);
            }

        }

        callback(subQuery);
    },
    isEmpty: (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },
    GetPropertyNameByValue: (Dto, dataObj) => {
        var Obj = new Object();
        Object.getOwnPropertyNames(Dto).map(prop => {
            if (dataObj[Dto[prop.toString()]] != undefined) {
                Obj[prop] = dataObj[Dto[prop.toString()]];
            }

        })
        return (Obj);
    },
    GetValuePropertyNameBy: (Dto, subQuery) => {

        try {
            var columns = " ";
            subQuery = subQuery.split(",");

            subQuery.map(prop => {
                columns += Dto[prop.toString()] != undefined ? Dto[prop.toString()] + "," : "";
            })
            return  columns.substring(",", columns.length - 1);

        } catch (error) {
            return "error";
        }

    },
    stringToByte: (str) => {
        var bytes = [];
        //         for (var i = 0; i < str.length; ++i)
        //         {
        //             bytes.push(str.charCodeAt(i));
        //         }
        //         var base64data = new Buffer(str, 'binary').toString('base64');
        //         console.log(str.toString());
        // var buf = Buffer.from(str);
        //         console.log("Buffer"+ buf )

        //         console.log(Custom.ByteToString(bytes));
        var buffer = new Buffer(str, "utf-8");

        return bytes;
    },
    ByteToString: (bytes) => {
        return String.fromCharCode.apply(String, bytes);
    }

}


module.exports = Custom;
