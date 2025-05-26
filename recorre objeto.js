const user ={
    nombre: "Francisco",
    apellido: "Figueroa",
    edad: 21
}

const admin = Object.create(user)
    admin.antiguedad = "10 años"


function printCadena(obj){
    let nivel = 0
    while (obj !== null){
        console.log(`Nivel ${nivel}:`, obj)
        obj = Object.getPrototypeOf(obj);
        nivel++
    }
    console.log(`Null, nivel: ${nivel}`)
}

printCadena(admin)