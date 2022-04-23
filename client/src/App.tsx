import React, { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Game from './Components/Game';

function App() {

    useEffect(()=>{
        const item = document.getElementById("snap");
        if(item === null){return;}
        const script = item.innerHTML;
        window.eval(script);
    })
	
	return(
		<div>
			<Game/>
			
		</div>
  	);
}

export default App;
