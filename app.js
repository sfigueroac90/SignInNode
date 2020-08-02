const fs=require('fs');
const express = require('express')
const bodyParser = require('body-parser');
const https = require('https');
const { response } = require('express');

const PORT = process.env.PORT || 3000

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

function onDataResponse(respone){
    response.on("data",(response)=>{
        const json = JSON.parse(data);
        console.log(json);
    })
}

app.get("/",function(req,res){
    
    res.sendFile(__dirname + "/signup.html");

})

app.post("/", function(req,res){
    const body = req.body;
    console.log(req.body);

    const firstName = body.firstName;
    const lastName = body.lastName;
    const email = body.email;

    //Create json
    const data = {
        members:[{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        }
        ]
    };

    const jsonData = JSON.stringify(data);
    console.log(jsonData);

    const options = {
        auth:"SebasF:c8ccfa8488ca3f4db77b64b64a1bd7bf-us19",
        method:'POST'
    };

    const url = "https://us19.api.mailchimp.com/3.0/lists/a2ad603fc6";
    const request = https.request(url,options,function (response){

        console.log("response is " + response.statusCode);

       

        response.on("data",function(rdata){
            const data = JSON.parse(rdata);
            console.log(data)
            console.log(data.errors.length)
            if(response.statusCode === 200 && data.errors.length === 0){
                res.sendFile(__dirname + "/sucess.html");
            }else{
                res.sendFile(__dirname + "/failure.html");
            }
            
        })
    });
    request.write(jsonData);
    request.end();

})

app.post("/failure",(req,res)=>{
    res.sendFile(__dirname + "/signup.html");
})
    


app.listen(PORT,function(){
    console.log("Server running in port 3000");
})

/*Audiece
a2ad603fc6
c8ccfa8488ca3f4db77b64b64a1bd7bf-us19
*/




