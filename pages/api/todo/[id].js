import {connection} from "../../../lib/db.js"
import items from "../items.js";

export default async (req, res) => {
    const conn = await connection;
    const { id } = req.query
    if(req.method === 'GET')
    {
      const queryText = 'SELECT todo.title AS title FROM todo WHERE id = ' + id + '; SELECT todo_item.title AS item, todo_item.state AS state, todo_item.id AS id FROM todo_items JOIN todo_item ON todo_items.todoitem_id = todo_item.id WHERE todo_items.todo_id = ' + id//'SELECT todo.title AS title, todo_item.title AS item, todo_item.state AS state, todo_item.id AS id FROM todo_items JOIN todo_item ON todo_items.todoitem_id = todo_item.id JOIN todo ON todo_items.todo_id = todo.id where todo_items.todo_id = ' + id
      const [data] = await conn.query(
        queryText
      );
      return res.status(200).json(data)
    }
    else if(req.method === 'POST')
    {
      const [data] = await conn.query(
        'INSERT INTO todo_item VALUES (NULL,?,?); INSERT INTO todo_items VALUES (NULL,LAST_INSERT_ID(),?);',
        [0, '', id]
      );
      return res.status(200).json(data)
    }
    else if(req.method === 'PATCH')
    {
      var json = JSON.parse(req.body)
      if(json.type === 'item')
      {
        if(json.edit === 'title')
        {
          const [data] = await conn.query(
          'UPDATE todo_item SET title = ? WHERE id = ?',
          [json.newVal, id]);
          return res.status(200).json(data)
        }
        else
        {
          var state = parseInt(json.newVal)
          const [data] = await conn.query(
            'UPDATE todo_item SET state = ? WHERE id = ?',
            [state, id]);
          return res.status(200).json(data)
        }
      }
      else
      {
        const [data] = await conn.query(
          'UPDATE todo SET title = ? WHERE id = ?',
          [json.newVal, id]);
        return res.status(200).json(data)
      }
    }
    else if(req.method === 'DELETE')
    {
      var json = JSON.parse(req.body)
      const [data] = await conn.query(
        'DELETE FROM todo_item WHERE id = ?; DELETE FROM todo_items WHERE todoitem_id = ?',
        [json.itemId, json.itemId]);
      return res.status(200).json(data)
    }
    else{
      return res.status(404).json({id: "lol", title: "lol"})
    }
  }