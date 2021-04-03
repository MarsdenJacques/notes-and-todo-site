import {connection} from "../../../lib/db.js"

export default async (req, res) => {
    var conn = await connection;
    if(req.method === 'GET')
    {
      const { id } = req.query
      console.log('id: ' + id)
      const queryText = 'SELECT notes.title AS title, notes.content AS content FROM notes WHERE notes.id = ' + id
      console.log(queryText)
      const [data] = await conn.query(
        queryText
      );
      console.log(data)
      return res.status(200).json(data)
    }
    else if(req.method === 'POST')
    {
      return res.status(200)
    }
    else{
      return res.status(404).json({id: "lol", title: "lol"})
    }
  }