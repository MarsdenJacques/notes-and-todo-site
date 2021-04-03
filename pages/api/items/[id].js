// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {connection} from "../../../lib/db.js"

export default async (req, res) => {
  var conn = await connection;
  const { id } = req.query
  if(req.method === 'GET')
  {
    const [data] = await conn.query(
      'SELECT items.id AS id, taxonomies.title AS taxonomy, items.item_id AS itemId FROM items JOIN taxonomies ON items.taxonomy = taxonomies.id WHERE id = ?',
      [id]
    );
    return res.status(200).json(data)
  }
  else if(req.method === 'POST')
  {
    return res.status(404)
  }
  else if(req.method === 'DELETE')
  {
    var json = JSON.parse(req.body)
    var itemId = parseInt(json.itemId)
    if(json.type === 'notes')
    {
      const [data] = await conn.query(
        'DELETE FROM notes WHERE id = ?; DELETE FROM items WHERE id = ?', //also delete from items, also get id from items.id
        [itemId,id],
      );
      return res.status(200).json(data)
    }
    else
    {
      var json = JSON.parse(req.body)
      const [data] = await conn.query(
        'DELETE FROM todo WHERE id = ?; DELETE todo_item FROM todo_items JOIN todo_item ON todo_items.todoitem_id = todo_item.id WHERE todo_items.todo_id = ?; DELETE FROM items WHERE id = ?', //also delte from items also get id form items.id
        [itemId,itemId,id],
      );
      return res.status(200).json(data)
    }
  }
  else{
    return res.status(404).json({id: "lol", title: "lol"})
  }
}
