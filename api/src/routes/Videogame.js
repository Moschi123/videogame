const axios = require('axios');
const { Router } = require('express');
const { API_KEY } = process.env;
const routerVid = require("express").Router();
const { Videogame, Genre } = require('../db');
/* ACA VAMOS A HACER LA RUTA DE LOS JUEGOS */
/* PRIMEROS HACEMOS LAS FUNCION
ES QUE MECITAMOS PARA TRAER INFO 
*/

const getApiInfo= async () => {
    let IOapi=[]; /* hacemos un array para poner la dbInfo */

    let apiURL;
    for(let i=1; IOapi.length<100;i++){
    if(IOapi.length ===1){
        apiURL= await   axios.get('https://api.rawg.io/api/games?key=' + API_KEY);
    }
    else{
        apiURL= await axios.get('https://api.rawg.io/api/games?key=' + API_KEY + '&page=' + i);
    }
    IOapi=apiURL.data.map(r=>{
        return {
            id: r.id,
            name: r.name,
            description: r.description,
            released: r.released,
            rating:r.rating,
            platform:r.platform.map(n=>{
                return {
                    name:n.platform.name
                }
            }),
            backdround_image:n.backdround_image,
            genre:r.genre.map(n=>{
                return{
                    name:n.genre.name
                }
            }),
          


        } 
    }); IOapi=[...IOapi,...apiURL];
    }

    
return IOapi



}
;
const dbInfo = async () =>{
/* okey ya hicimos lo de traeer la api, ahora debemos traernos lo de la base de datos */
return await Videogame.findAll({  
      include:{
      model:Genre,
      atributes:['id','name']


    },
    through: {
        attributes: []
    }
})
};

const Allinfo= async()=>{
    const apiInfo= await getApiInfo();
    const dataInfo= await dbInfo();
    return apiInfo.concat(dataInfo);
}/* aca traem,os toda l adata junta y la concatenamos */


routerVid.get('/',async(req,res)=>{
 const name= req.query.name;

 let infoTotal=await Allinfo();

 if(name){
    let videogameList = infoTotal.filter(v=> v.name.toLowerCase().includes(name.toLowerCase()));
    if(videogameList.length){
        let newList= videogameList.map( v=>{
            return{
                id:v.id,
                name:v.name,
                backdround_image:v.backdround_image,
                genre: v.genre,

            }
        });
        videogameList.length<15? res.send(newList) : res.send(newList.slice(0 , 15));
    }else{
        res.send(error)
    }
 }else{
    let newList= infoTotal.map(v=>{
        return{
            id: v.id,
            name:v.name,
            backdround_image:v.backdround_image,
            rating:v.rating,
            genre:v.genre,

        }
    })
    res.send(newList)
 }


});

module.exports=routerVid;