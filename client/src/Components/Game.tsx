import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap';
import ShareLink from 'react-twitter-share-link'
import Card from './Card';

import "./Game.css";

function Game() {
    const [finalSquare, setFinalSquare] = useState<number[]>([]);
    const [squares, setSqures] = useState<number[]>([0,0,0,0,0,0,0,0,0]);
    const [numSerie, setSerie] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [animating,setAnimating] = useState<number[]>([]);
    const [showShare, setShowShare] = useState(false);

    useEffect(()=>{
        var serie = [];
        var allNumbers = [1,2,3,4,5,6,7,8,9];
        var currentNumbers = [...allNumbers];
        for(var i = 0; i < 100; i ++)
        {
            const index = Math.floor(Math.random() * currentNumbers.length);
            serie.push(currentNumbers[index]);
            currentNumbers.splice(index, 1);

            if(currentNumbers.length === 0){currentNumbers = [...allNumbers];}
        }

        setSerie(serie);
    },[]);

    const ChangeNum = (index:number) => {
        var serie = [...squares];
        serie[index] = numSerie[0];

        setScore(old => old + numSerie[0]);

        //setSqures();
        const serieChecked = CheckRemove(serie);
        if(serieChecked.length > 0)
        {
            setTimeout(()=>{
                setSqures(serieChecked);

                setAnimating([]);
            },500);
            
            
            var nextNums = [...numSerie];
            nextNums.splice(0, 1);
            setSerie(nextNums);
        }else{
            console.log("Game Done");
        }
    }

    const CheckRemove = (newSquare:number[]) =>
    {
        var hasRemoved = false;
        var allFull = 0;
        var animation:{x:number,y:number}[] = [];

        const grid:number[][] = [];
        var count = 0;
        for(var x = 0; x < 3; x ++)
        {
            var array = [];
            for(var y = 0; y < 3; y ++)
            {
                array.push(newSquare[count]);

                count += 1;
            }

            grid.push(array);
        }

        for(var x = 0; x < 3; x ++)
        {
            var total = 0;
            var allNums = 0;
            for(var y = 0; y < 3; y ++)
            {
                total += grid[x][y];

                if(grid[x][y] !== 0){allNums += 1; allFull += 1;}
            }

            if(total === 15 && allNums === 3)
            {
                grid[x][0] = 0;
                grid[x][1] = 0;
                grid[x][2] = 0;

                animation.push({x:x,y:0});
                animation.push({x:x,y:1});
                animation.push({x:x,y:2});

                hasRemoved = true;
            }
        }

        for(var x = 0; x < 3; x ++)
        {
            var total = 0;
            var allNums = 0;
            for(var y = 0; y < 3; y ++)
            {
                total += grid[y][x];

                if(grid[y][x] !== 0){allNums += 1;}
            }

            if(total === 15 && allNums === 3)
            {
                grid[0][x] = 0;
                grid[1][x] = 0;
                grid[2][x] = 0;

                animation.push({x:0,y:x});
                animation.push({x:1,y:x});
                animation.push({x:2,y:x});

                hasRemoved = true;
            }
        }

        var serie: React.SetStateAction<number[]> = [];
        var indexAnimation: number[] = [];

        for(var x = 0; x < 3; x ++)
        {
            for(var y = 0; y < 3; y ++)
            {
                for(var i = 0; i < animation.length; i ++)
                {
                    if(animation[i].x === x && animation[i].y === y)
                    {
                        indexAnimation.push(serie.length);
                    }
                }

                serie.push(grid[x][y]);
            }
        }

        setAnimating(old=>[...old,...indexAnimation]);

        if(!hasRemoved && allFull === 9){
            setFinalSquare(serie);
            return [];
        }

        if(indexAnimation.length > 0){
            var timer = setTimeout(()=>{
                setSqures(serie);

                setAnimating([]);

                clearTimeout(timer);
            },3000);
        }else{
            setSqures(serie);
        }

        return serie;
    }

    const GetRenderSquare = () => {
        var grid:{number:number,isGrid:boolean,index:number,space:string}[] = [];
        var total = 0;
        var count = 0;
        var verticalCount: number[] = [0, 0, 0];

        var currentSquares = finalSquare.length > 0 ? finalSquare : squares;

        for(var i = 0; i < currentSquares.length; i ++)
        {
            total += currentSquares[i];
            verticalCount[count] += currentSquares[i];
            grid.push({number:currentSquares[i],isGrid:true,index:i,space:""});

            if(count === 2)
            {
                grid.push({number:total,isGrid:false,index:-1,space:"space-left"});
                total = 0;
                count = 0;
            }else{
                count += 1;
            }
        }

        for(var i = 0; i < verticalCount.length; i ++)
        {
            grid.push({index:100 + i, isGrid:false, number:verticalCount[i],space:"space-top"});
        }
        
        grid.push({index:104,isGrid:false, number:numSerie[0],space:"space-top space-left"})

        return grid;
    }

    const GetShareBox = () => {
{/*
                Countle # 1
                Points: 15
                1️⃣2️⃣3️⃣
                2️⃣1️⃣3️⃣
                3️⃣1️⃣2️⃣
            */}
        var output = "Countle #1\n";
        output += "Points: " + score + "\n";
        var count = 0;
        const numbers = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];
        for(var i = 0; i < finalSquare.length; i ++)
        {
            output += numbers[finalSquare[i] - 1];

            if(count === 2)
            {
                output += "\n";
                count = 0;
            }else{
                count += 1;
            }
        }

        return output;
    }

    useEffect(()=>{
        setTimeout(()=>{
            console.log("Snapt test");
            const item = document.getElementById("snap");
            if(item === null){return;}
            const script = item.innerHTML;
            window.eval(script);
        },100);
        
    },[showShare]);

    const Snap = () => {
        const item = document.getElementById("snap");
        if(item === null){return;}
        const script = item.innerHTML;
        window.eval(script);
    }

    return (
        <div>
            <h1 className="center">Countle #1</h1>
            <h1 className="score center">{`Score: ${score}`}</h1>
            <div className="parent">
                {GetRenderSquare().map((item)=>{
                    if(item.isGrid){
                        if(animating.includes(item.index))
                        {
                            return(<Card animating={true} animOffset={animating.indexOf(item.index)} changeNum={ChangeNum} index={item.index} number={item.number} type="animation"/>);
                        } else if(item.number === 0)
                        {
                            return(<Card animating={false} animOffset={0} changeNum={ChangeNum} index={item.index} number={0} type="empty"/>);
                        }else{
                            return(<Card animating={false} animOffset={0} changeNum={ChangeNum} index={item.index} number={item.number} type="number"/>);
                        }
                    }else if(item.space !== ""){
                        return(<div className={`cell full ${item.space}`}>{item.number}</div>)
                    }else{
                        return(<div className="cell full no-border"> </div>)
                    }
                })}
            </div>
            {finalSquare.length > 0 && 
            <div className="final">
                <h1 className="center">Final Score: {score}</h1>
                <button onClick={()=>setShowShare(true)}>Share</button>
            </div>}

            <Modal show={showShare}>
                <Modal.Header closeButton>
                  <Modal.Title>Share Todays Countle</Modal.Title>
                </Modal.Header>
              
                <Modal.Body>
                  <p>Twitter</p>
                <ShareLink link={GetShareBox()}>
                    {(link: string | undefined) => (
                        <a href={link} target='_blank'>Share this on Twitter</a>
                    )}
                </ShareLink>
                <div
      className="snapchat-creative-kit-share"
      data-theme="dark"
      data-size="large"
      data-text="false"
      data-share-url="www.count.hawaiidev.net"
    ></div>
                
                </Modal.Body>
              
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            <div dangerouslySetInnerHTML={{__html:`<script id="snap">(function (d, s, id) {
    var js,
      sjs = d.getElementsByTagName(s)[0];
    //if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://sdk.snapkit.com/js/v1/create.js";
    sjs.parentNode.insertBefore(js, sjs);
  })(document, "script", "snapkit-creative-kit-sdk");
			</script>`}}></div>
        </div>
    )
}

export default Game