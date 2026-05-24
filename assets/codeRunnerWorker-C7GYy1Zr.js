(function(){self.onmessage=function(e){let{userCode:t,functionName:n,testInput:r}=e.data;try{let e=`
      ${t}
      return ${n}(${r});
    `,i=Function(e)();self.postMessage({success:!0,actual:i})}catch(e){self.postMessage({success:!1,error:e.message||e.toString()})}}})();