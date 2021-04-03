import {connection} from "../../../lib/db.js"

export default async (req, res) => {
    var conn = await connection;
    const { id } = req.query
    if(req.method === 'GET')
    {

      const queryText = 'SELECT notes.title AS title, notes.content AS content FROM notes WHERE notes.id = ' + id
      const [data] = await conn.query(
        queryText
      );
      return res.status(200).json(data)
    }
    else if(req.method === 'POST')
    {
      return res.status(200)
    }
    else if(req.method === 'PATCH')
    {
      var json = JSON.parse(req.body)
      if(json.edit === 'title')
      {
        const [data] = await conn.query(
          'UPDATE notes SET title = ? WHERE id = ?',
          [json.newVal, id],
        );
        return res.status(200).json(data)
      }
      else
      {
        const [data] = await conn.query(
          'UPDATE notes SET content = ? WHERE id = ?',
          [json.newVal, id],
        );
        return res.status(200).json(data)
      }
    }
    else if(req.method === 'DELETE')
    {
      var json = JSON.parse(req.body)
      const [data] = await conn.query(
        'DELETE FROM notes WHERE id = ?',
        [id],
      );
      return res.status(200).json(data)
    }
    else{
      return res.status(404).json({id: "lol", title: "lol"})
    }
  }