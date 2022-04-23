import React, { useEffect, useState } from 'react'
import FlipCard from 'react-flipcard-2';

interface Props
{
    type:"number"|"empty"|"animation"
    number:number,
    index:number,
    changeNum:(index:number)=>void,
    animating:boolean,
    animOffset:number
}

function Card({type,number,index,changeNum,animating,animOffset}:Props) {
    const [flipped, setFlipped] = useState(false);

    useEffect(()=>{
        if(flipped !== false || animating === false){return;}
        setFlipped(false);

        var timer = setTimeout(()=>{
            setFlipped(true);
            clearTimeout(timer);
        },5 + animOffset * 80);
    },[animating])

    if(type === "animation")
    {
        return(
            <FlipCard
                disabled={true}
                flipped={flipped}
            >
                <div
                    className="cell full"
                    key={index}
                >{number}</div>
                <div
                    className="cell empty"
                    key={index}
                >{" "}</div>
            </FlipCard>
        )
    }

    if(type === "number")
    {
        return(
            <div
                className="cell full"
                key={index}
            >
                {number}
            </div>
        )
    }           
    if(type === "empty"){
        return (
            <div
                className="cell empty"
                key={index}
                onClick={()=>changeNum(index)}
            >{" "}</div>
        )
    }

    return<></>
}

export default Card
                        