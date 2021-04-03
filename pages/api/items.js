// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {connection} from "../../lib/db.js"

export default async (req, res) => {
  var conn = await connection;
  if(req.method === 'GET')
  {
    const [data] = await conn.query(
      'SELECT items.id AS id, taxonomies.title AS taxonomy, items.item_id AS itemId FROM items JOIN taxonomies ON items.taxonomy = taxonomies.id'
    );
    return res.status(200).json(data)
  }
  else if(req.method === 'POST')
  {
    var json = JSON.parse(req.body)
    if(json.taxonomy === 1)
    {
      const [data] = await conn.query(
        'INSERT INTO notes VALUES (NULL,?,?); INSERT INTO items VALUES (NULL,1,LAST_INSERT_ID());',
        ['note', 'content']
      );
      return res.status(200).json(data)
    }
    else
    {
      const [data] = await conn.query(
        'INSERT INTO todo VALUES (NULL,?); INSERT IGNORE INTO items VALUES (NULL,2,LAST_INSERT_ID())',
        ['todo']
      );
      return res.status(200).json(data)
    }
  }
  else if(req.method === 'DELETE')
  {
    var json = JSON.parse(req.body)
    if(json.type === 'notes')
    {
      const [data] = await conn.query(
        'DELETE FROM notes WHERE id = ?',
        [json.id],
      );
      return res.status(200).json(data)
    }
    else
    {
      const [data] = await conn.query(
        'DELETE FROM todo WHERE id = ?; DELETE todo_item FROM todo_items JOIN todo_item ON todo_items.todoitem_id = todo_item.id WHERE todo_items.todo_id = ?',
        [json.id,json.id],
      );
      return res.status(200).json(data)
    }
  }
  else{
    return res.status(404).json({id: "lol", title: "lol"})
  }
}
