const http = require('http')
const fs = require('fs')
const url = require('url')
const tasks = require('./tasks.json')

const todoServer  = http.createServer((req,res)=>{
    todoUrl = url.parse(req.url,true)
    const URLPARTS = req.url.split('/')
    
            if (req.method==='GET'){ 
                res.end(JSON.stringify(tasks))
            }
            if (req.method==='POST'){ 

                let body = ''
                req.on('data',chunk=>{
                    body+=chunk
                })
                req.on('end',()=>{
                    const data =JSON.parse(body)
                    const NewTask = {
                        id:tasks.length+1,
                        title:data.title,
                        description:data.description || "",
                        status:"incomplete"
                    }
                    tasks.push(NewTask)
                    fs.writeFile('./tasks.json',JSON.stringify(tasks),(err,data)=>{
                        console.log(err)
                    })
                    res.end("Success!")
                })
            }
            if (req.method==='DELETE'){
                const id = Number(URLPARTS[2])
                console.log(id)
                const taskIndx = tasks.findIndex(task => task.id === id)
                const taskDeleted = tasks.splice(taskIndx,1)[0]
                console.log(taskDeleted)
                fs.writeFile('./tasks.json',JSON.stringify(tasks),(err,data)=>{
                    console.log(err)
                })
                res.end("Sucessfully Deleted!")
            } 
            if (req.method==='PATCH'){
                const id = Number(URLPARTS[2])
                const taskIndx = tasks.findIndex(task => task.id === id)
                
                let body = ''
                req.on('data',chunk=>{
                    body+=chunk
                })
                req.on('end',()=>{
                    const data =JSON.parse(body)
                    tasks[taskIndx]= {...tasks[taskIndx], ...data}

                    fs.writeFile('./tasks.json',JSON.stringify(tasks),(err,data)=>{
                        console.log(err)
                    })
                    res.end("Success!")
                })
            }

       
})

todoServer.listen(8000,()=>console.log("Server Started!"))