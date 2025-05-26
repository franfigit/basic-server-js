import http from 'node:http' // node --watch
import { join } from 'node:path'
import { appendFile, readFile } from 'node:fs/promises'
import { extname } from 'node:path'

const LOG_FILE = "./mycoolserver.log"


/* async function readResource(filePath) {
    const data = await readFile(`${filePath}`,{encoding:'utf-8'})
    return data
} esta function no cargaba correctamente las fotos, por el encoding*/

async function readResource(filePath) {
    const ext = extname(filePath)
    // Leer como texto solo archivos de texto
    if (ext === '.html' || ext === '.css' || ext === '.js' || ext === '.svg') {
        return await readFile(filePath, { encoding: 'utf-8' })
    } else {
        // Leer como binario (Buffer) para imágenes y otros archivos
        return await readFile(filePath)
    }
}

async function nuevoLog(method, path, statusCode, statusMessage){
    let timestamp = new Date().toLocaleString()
    const logLine = `${timestamp} - ${method} ${path} - ${statusCode} ${statusMessage}\n`

    appendFile(LOG_FILE, logLine)
        .then(() => {
            return
        })
        .catch((err)=>{
            console.log('Error al escribir el log:', err.message)
            return
        })

    /* CODIGO VIEJO
    try{
    fs.appendFile(LOG_FILE, log)
    } catch(error) {
        console.error(`Error escribiendo el log: ${log}, ${error}`)
    }*/
}

const tiposdearchivo = { //diccionario, funciona parecido a un array
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
}

const server = http.createServer(async(req, res)=> {
    let filePath = req.url

    if(filePath === '/' || filePath === '/home' || filePath === '/home.html' || filePath === '/index'){
        filePath = '/index.html'
    }


    const absolutePath = join(process.cwd(), filePath)
    let statusCode
    if( req.method!=='GET'){
        statusCode = 405 //si el método es distinto de get statusCode=405
        res.writeHead(statusCode,{'content-type':'text/plain'})
        res.end('Acceso denegado')
        nuevoLog(req.method,filePath,statusCode,'Acceso denegado')
        return
    }
    try{
        const data = await readResource(absolutePath)
        const ext = extname(filePath)
        const contentType = tiposdearchivo[ext]
        res.writeHead(200,{'content-type': contentType})
        res.end(data)
        statusCode = 200
        nuevoLog(req.method,filePath,statusCode,'OK')
    } catch(err) {
        if(err.code === 'ENOENT') {
            statusCode = 404
            res.writeHead(statusCode,{'content-type':'text/plain'})
            res.end("Status code 404: resource not found!")
            nuevoLog(req.method,filePath,statusCode,'Resource not found')
        } else {
            console.error(err.message, err.code)
            statusCode = 500
            res.writeHead(statusCode,{'content-type':'text/plain'})
            res.end(`Status code 505: Internal server error!`)
            nuevoLog(req.method,filePath,statusCode,'Internal server error')
        }
    }
})

server.listen(3000)
console.log(`Server on: en http://localhost:3000/index.html`)