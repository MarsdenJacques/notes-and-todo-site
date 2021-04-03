import {useState, useEffect} from 'react'
import style from './todo.module.css'

export default function Todo(props){
    const [edited, setEdited] = useState([])
    const [id, setId] = useState(-1)
    const [title, setTitle] = useState('loading title')
    const [items, setItems] = useState([])
    const [editing, setEditing] = useState('no')

    useEffect(() => {
        setId(props.itemId)
        fetch('/api/todo/' + props.itemId, {
            method: 'GET'
          })
          .then((res) => res.json())
          .then((data) => {
                setTitle(data[0][0].title);
                setItems(data[1])
        })
    },[])
    useEffect(() => {
        if(edited.length > 0)
        {
            var edits = edited.slice()
            var change = edits.shift()
            setEdited(edits)
            var body = JSON.stringify({
                id: change.id, type: change.type, edit: change.edit, newVal: change.newVal
            });
            fetch('/api/todo/' + change.id,{
                method: 'PATCH',
                body: body
            })
            .then((res) => {
                if(res.status === 200)
                {
                    if(change.edit === 'title')
                    {
                        if(change.type === 'todo')
                        {
                            setTitle(change.newVal)
                        }
                        else
                        {
                            var changedItemIndex = -1
                            var newItems = items.slice()
                            for(var item = 0; item < items.length; item++)
                            {
                                if(items[item].id == change.id)
                                {
                                    changedItemIndex = item
                                    break
                                }
                            }
                            if(changedItemIndex === -1)
                            {
                                console.log("item doesn't exist")
                                return
                            }
                            newItems[changedItemIndex].item = change.newVal
                            setItems(newItems)
                        }
                    }
                    return
                }
                console.log('error')
            })
            //update database
        }
    },[edited])

    function AddTodoItem()
    {
        fetch('/api/todo/' + id,{
            method: 'POST',
        })
        .then((res) => {
            if(res.status === 200)
            {
                return res.json()
            }
            return 'error'
        })
        .then((data) => {
            if(data !== 'error')
            {
                var newItems = items.slice()
                newItems.push({title: title, item: '', state: 0, id: data[0].insertId})
                setItems(newItems)
            }
        })
    }
    
    function DeleteTodo()
    {
        props.DeleteItem(props.id, id, 'todo')
    }

    function DeleteItem(index, id)
    {
        var newItems = items.slice()
        newItems.splice(index, 1)
        setItems(newItems)
        var body = JSON.stringify({
            itemId: id
        });
        fetch('/api/todo/' + id,{
            method: 'DELETE',
            body: body
        })
    }


    function ToggleCheck(index, itemId)
    {
        var newItems = items.slice()
        var newState = newItems[index].state === 1 ? 0 : 1
        newItems[index].state = newState //create edit element
        setItems(newItems)
        var edits = edited.slice()
        edits.push({id: itemId, type: 'item', edit: 'state', newVal: newState})
        setEdited(edits)
    }

    const EditTitle = (e) => 
    {
        e.preventDefault()
        setEditing('no')
        var edits = edited.slice()
        edits.push({id: id, type: 'todo', edit: 'title', newVal: e.target.firstChild.value})
        setEdited(edits)
    }

    const EditItem = (e) => {
        e.preventDefault()
        setEditing('no')
        var edits = edited.slice()
        edits.push({id: e.target.firstChild.id, type: 'item', edit: 'title', newVal: e.target.firstChild.value})
        setEdited(edits)
    }

    return(
        <section className = {style.content}>
            <h1 className = {style.title}>
                <div onClick = {() => setEditing('title')}>{editing === 'title' ? 
                <form onSubmit = {EditTitle}>
                    <input type = 'text' defaultValue = {title}autoFocus/>
                    <button input-type = 'submit'>Save</button>
                </form> : 
                <p>{title}</p>}</div>
            </h1>
            <div className = {style.list}>
                {
                    items.map(({item, state, id}, index) => {
                        return (<div key = {index} className = {style.item} onClick = {() => setEditing(index)}>
                            <button onClick = {() => DeleteItem(index, id)} className = {style.deleteitem}>X</button>
                            {editing === index ?  <form onSubmit = {EditItem}>
                                <input type = 'text' defaultValue = {item} id = {id} autoFocus></input>
                                <button input-type = 'submit'>Save</button>
                            </form> : <p>{item}</p>
                            }
                            <button onClick = {() => ToggleCheck(index, id)} className = {style.checkbox}>{state === 1 ? 'Done' : 'Todo'}</button>
                        </div>)
                    })
                }

            </div>
            <button onClick = {() => AddTodoItem()} className = {style.newitem}>New Todo Item</button>
            <button onClick = {() => DeleteTodo()} className = {style.delete}>Delete</button>
        </section>
    )
}