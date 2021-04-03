import {connection} from "../../lib/db.js"

export default async (req, res) => {
  var conn = await connection;
  if(req.method === 'GET')
  {
      var url = window.location.search
    console.log(url)
    const [data] = await conn.query(
      'SELECT notes.id AS id, notes.title AS title, notes.content AS content FROM notes'
    );
    console.log(data)
    return res.status(200).json(data)
  }
  else if(req.method === 'POST')
  {
    /*
      var values = req.body{} json into array
      connection.query(
      "INSERT INTO taxonomies (title) VALUES (?)",
      values
      function(err, result){
        if(err) throw err;
        console.log('test')
        res.status(203)
      }
    )*/
    return res.status(200)
  }
  else{
    return res.status(404).json({id: "lol", title: "lol"})
  }
}