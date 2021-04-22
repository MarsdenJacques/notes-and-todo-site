import color from './colors.module.css'

const colors = [color.red, color.yellow, color.blue, color.green, color.purple, color.orange]

var lastIndex = -1

export default function GetColor()
{
    var index = Math.floor(Math.random() * 6)
    if(index === lastIndex)
    {
        index++;
    }
    if(index >= 6)
    {
        index = 6 - index;
    }
    lastIndex = index
    return (colors[index])
}