import Link from 'next/Link'
import {useState, useEffect} from 'react'
import Note from '../components/note.js'
import Todo from '../components/todo.js'
import Toggle from '../components/state-toggle.js'
import style from './indevmain.module.css'



//don't state and effect for adding/removing items, instead just update db and items from the add/delete functions
//pass deleteitemn as callback to item for delete? yes

export default function Indevmain(props)
{

    function AddItem(type)
    {
        if(type === 'note')
        {
            AddNote()
        }
        else
        {
            AddTodo()
        }
    }

    function AddNote()
    {
        var body = JSON.stringify({
            taxonomy: 1
        });
        fetch('/api/items/',{
            method: 'POST',
            body: body
        })
            .then((res) => {
                if(res.status === 200)
                {
                    setloadingState('load') //change to manually adding later?
                }
            })
    }

    function AddTodo()
    {
        var body = JSON.stringify({
            taxonomy: 2
        });
        fetch('/api/items/',{
            method: 'POST',
            body: body
        })
            .then((res) => {
                if(res.status === 200)
                {
                    setloadingState('load')
                }
            })
    }

    function DeleteItem(id, itemId, type) //this is the item id not the id of the note/todo
    {
        var body = JSON.stringify({
            id: id, itemId: itemId, type: type
        });
        fetch('/api/items/' + id,{
            method: 'DELETE',
            body: body
        })
        .then((res) => {
            if(res.status !== 200)
            {
                console.log('error')
                return NULL
            }
            var newItems = items.slice()
            var index = -1;
            for(var item = 0; item < newItems.length; item++)
            {
                if(newItems[item].id === id)
                {
                    index = item
                    break;
                }
            }
            if(index === -1)
            {
                console.log("item doesn't exist")
                return
            }
            newItems.splice(index, 1)
            setItems(newItems)
        })
    }

    const [loadingState, setloadingState] = useState('notLoaded')
    const [items, setItems] = useState([])

    useEffect(() => {
        if(props.signedIn === 'signedIn')
        {
            loadingState === 'load' ? null : setloadingState('load')
        }
        else
        {
            setloadingState('notLoaded')
        }
    }, [])

    useEffect(() => {
        if(loadingState === 'load')
        {
            fetch('/api/items',{
                method: 'GET'
            })
                .then((res) => {
                    if(res.status !== 200){
                        console.log('status not 200')
                        return null
                    }
                    return res.json()
                })
                .then((data) => {
                    if(data !== null)
                    {
                        if(loadingState === 'load')//&& successful
                        {
                            setItems(data)
                            setloadingState('loaded')
                        }
                        else
                        {
                            console.log('error or canceled')
                            setloadingState('notLoaded')
                        }
                    }
                    else
                    {
                        console.log('error, no data')
                    }
                })
                .catch(() => console.log('error'))
        }
    }, [loadingState])
    useEffect(() => {
        if(props.signedIn === 'signedIn')
        {
            loadingState === 'load' ? null : setloadingState('load')
        }
        else if(props.signedIn === 'signedOut')
        {
            if(loadingState === 'loaded')
            {
                console.log('unload') //unload function
            }
            else if(loadingState === 'load')
            {
                console.log('cancel load') //check if state is still 'load' when mapping fetched data to check if still should load or not
            }
            setloadingState('notLoaded')
        }
        else
        {
            console.log('wait for sign in')
        }
    }, [props.signedIn])

    return(
        <div>
            {props.signedIn === 'signedIn' && loadingState === 'loaded' && <AddItemButton AddItem = {AddItem} className = {style.addItem}/>}
            <ItemsCanvas data = {items} loadingState = {loadingState} DeleteItem = {DeleteItem}/>
        </div>
    )
}

function ItemsCanvas(props){
    if(props.loadingState === 'loaded')
    {
        return(
            <Items data = {props.data} DeleteItem = {props.DeleteItem}/>
        )
    }
    else
    {
        return(
            <div>
                loading...
            </div>
        )
    }

}

function Items(props){
    return(
        <div className = {style.canvas}>
            {props.data.map((item) => {
                if(item.taxonomy === 'note')
                {
                    return <Note key = {item.id} id = {item.id} itemId = {item.itemId} DeleteItem = {props.DeleteItem}/>
                }
                else if(item.taxonomy === 'todo')
                {
                    return <Todo key = {item.id} id = {item.id} itemId = {item.itemId}  DeleteItem = {props.DeleteItem}/>
                }
                else
                {
                    return <div key = {item.id}>error</div>
                }
            })}
        </div>
    )
}

function AddItemButton(props)
{

    const [dropDown, setDropdown] = Toggle()

    return(
        <div onMouseEnter = {() => setDropdown()} onMouseLeave = {() => setDropdown()}>
            <button onClick = {() => {if(!dropDown){setDropdown()}}}>
                New Item
            </button>
            {dropDown && <div className = {style.dropdown}>
                <button onClick = {() => {
                    props.AddItem('note')
                }}>Note</button>
                <button onClick = {() => {
                    props.AddItem('todo')
                }}>Todo List</button>
            </div>}
        </div>
    )
}