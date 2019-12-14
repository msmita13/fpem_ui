(function(){var t,e=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++)if(e in this&&this[e]===t)return e;return-1},n=[].slice,r=function(t,e){return function(){return t.apply(e,arguments)}},a={}.hasOwnProperty;(t=function(t){return"object"==typeof exports&&"object"==typeof module?t(require("jquery")):"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)})(function(t){var o,i,l,s,u,c,h,d,p,f,m,g,v,b,C,y,w,A,x,S,N;return i=function(t,e,n){var r,a,o,i;for(t+="",a=t.split("."),o=a[0],i=a.length>1?n+a[1]:"",r=/(\d+)(\d{3})/;r.test(o);)o=o.replace(r,"$1"+e+"$2");return o+i},m=function(e){var n;return n={digitsAfterDecimal:2,scaler:1,thousandsSep:",",decimalSep:".",prefix:"",suffix:""},e=t.extend({},n,e),function(t){var n;return isNaN(t)||!isFinite(t)?"":(n=i((e.scaler*t).toFixed(e.digitsAfterDecimal),e.thousandsSep,e.decimalSep),""+e.prefix+n+e.suffix)}},A=m(),x=m({digitsAfterDecimal:0}),S=m({digitsAfterDecimal:1,scaler:100,suffix:"%"}),l={count:function(t){return null==t&&(t=x),function(){return function(e,n,r){return{count:0,push:function(){return this.count++},value:function(){return this.count},format:t}}}},uniques:function(t,n){return null==n&&(n=x),function(r){var a;return a=r[0],function(r,o,i){return{uniq:[],push:function(t){var n;if(n=t[a],e.call(this.uniq,n)<0)return this.uniq.push(t[a])},value:function(){return t(this.uniq)},format:n,numInputs:null!=a?0:1}}}},sum:function(t){return null==t&&(t=A),function(e){var n;return n=e[0],function(e,r,a){return{sum:0,push:function(t){if(!isNaN(parseFloat(t[n])))return this.sum+=parseFloat(t[n])},value:function(){return this.sum},format:t,numInputs:null!=n?0:1}}}},extremes:function(t,e){return null==e&&(e=A),function(n){var r;return r=n[0],function(n,a,o){return{val:null,sorter:h(null!=n?n.sorters:void 0,r),push:function(e){var n,a,o,i;if(i=e[r],"min"!==t&&"max"!==t||(i=parseFloat(i),isNaN(i)||(this.val=Math[t](i,null!=(n=this.val)?n:i))),"first"===t&&this.sorter(i,null!=(a=this.val)?a:i)<=0&&(this.val=i),"last"===t&&this.sorter(i,null!=(o=this.val)?o:i)>=0)return this.val=i},value:function(){return this.val},format:function(t){return isNaN(t)?t:e(t)},numInputs:null!=r?0:1}}}},quantile:function(t,e){return null==e&&(e=A),function(n){var r;return r=n[0],function(n,a,o){return{vals:[],push:function(t){var e;if(e=parseFloat(t[r]),!isNaN(e))return this.vals.push(e)},value:function(){var e;return 0===this.vals.length?null:(this.vals.sort(function(t,e){return t-e}),e=(this.vals.length-1)*t,(this.vals[Math.floor(e)]+this.vals[Math.ceil(e)])/2)},format:e,numInputs:null!=r?0:1}}}},runningStat:function(t,e,n){return null==t&&(t="mean"),null==e&&(e=1),null==n&&(n=A),function(r){var a;return a=r[0],function(r,o,i){return{n:0,m:0,s:0,push:function(t){var e,n;if(n=parseFloat(t[a]),!isNaN(n))return this.n+=1,1===this.n?this.m=n:(e=this.m+(n-this.m)/this.n,this.s=this.s+(n-this.m)*(n-e),this.m=e)},value:function(){if("mean"===t)return 0===this.n?NaN:this.m;if(this.n<=e)return 0;switch(t){case"var":return this.s/(this.n-e);case"stdev":return Math.sqrt(this.s/(this.n-e))}},format:n,numInputs:null!=a?0:1}}}},sumOverSum:function(t){return null==t&&(t=A),function(e){var n,r;return r=e[0],n=e[1],function(e,a,o){return{sumNum:0,sumDenom:0,push:function(t){if(isNaN(parseFloat(t[r]))||(this.sumNum+=parseFloat(t[r])),!isNaN(parseFloat(t[n])))return this.sumDenom+=parseFloat(t[n])},value:function(){return this.sumNum/this.sumDenom},format:t,numInputs:null!=r&&null!=n?0:2}}}},sumOverSumBound80:function(t,e){return null==t&&(t=!0),null==e&&(e=A),function(n){var r,a;return a=n[0],r=n[1],function(n,o,i){return{sumNum:0,sumDenom:0,push:function(t){if(isNaN(parseFloat(t[a]))||(this.sumNum+=parseFloat(t[a])),!isNaN(parseFloat(t[r])))return this.sumDenom+=parseFloat(t[r])},value:function(){var e;return e=t?1:-1,(.821187207574908/this.sumDenom+this.sumNum/this.sumDenom+1.2815515655446004*e*Math.sqrt(.410593603787454/(this.sumDenom*this.sumDenom)+this.sumNum*(1-this.sumNum/this.sumDenom)/(this.sumDenom*this.sumDenom)))/(1+1.642374415149816/this.sumDenom)},format:e,numInputs:null!=a&&null!=r?0:2}}}},fractionOf:function(t,e,r){return null==e&&(e="total"),null==r&&(r=S),function(){var a;return a=1<=arguments.length?n.call(arguments,0):[],function(n,o,i){return{selector:{total:[[],[]],row:[o,[]],col:[[],i]}[e],inner:t.apply(null,a)(n,o,i),push:function(t){return this.inner.push(t)},format:r,value:function(){return this.inner.value()/n.getAggregator.apply(n,this.selector).inner.value()},numInputs:t.apply(null,a)().numInputs}}}}},l.countUnique=function(t){return l.uniques(function(t){return t.length},t)},l.listUnique=function(t){return l.uniques(function(e){return e.sort(f).join(t)},function(t){return t})},l.max=function(t){return l.extremes("max",t)},l.min=function(t){return l.extremes("min",t)},l.first=function(t){return l.extremes("first",t)},l.last=function(t){return l.extremes("last",t)},l.median=function(t){return l.quantile(.5,t)},l.average=function(t){return l.runningStat("mean",1,t)},l["var"]=function(t,e){return l.runningStat("var",t,e)},l.stdev=function(t,e){return l.runningStat("stdev",t,e)},s=function(t){return{Count:t.count(x),"Count Unique Values":t.countUnique(x),"List Unique Values":t.listUnique(", "),Sum:t.sum(A),"Integer Sum":t.sum(x),Average:t.average(A),Median:t.median(A),"Sample Variance":t["var"](1,A),"Sample Standard Deviation":t.stdev(1,A),Minimum:t.min(A),Maximum:t.max(A),First:t.first(A),Last:t.last(A),"Sum over Sum":t.sumOverSum(A),"80% Upper Bound":t.sumOverSumBound80(!0,A),"80% Lower Bound":t.sumOverSumBound80(!1,A),"Sum as Fraction of Total":t.fractionOf(t.sum(),"total",S),"Sum as Fraction of Rows":t.fractionOf(t.sum(),"row",S),"Sum as Fraction of Columns":t.fractionOf(t.sum(),"col",S),"Count as Fraction of Total":t.fractionOf(t.count(),"total",S),"Count as Fraction of Rows":t.fractionOf(t.count(),"row",S),"Count as Fraction of Columns":t.fractionOf(t.count(),"col",S)}}(l),b={Table:function(t,e){return g(t,e)},"Table Barchart":function(e,n){return t(g(e,n)).barchart()},Heatmap:function(e,n){return t(g(e,n)).heatmap("heatmap",n)},"Row Heatmap":function(e,n){return t(g(e,n)).heatmap("rowheatmap",n)},"Col Heatmap":function(e,n){return t(g(e,n)).heatmap("colheatmap",n)}},d={en:{aggregators:s,renderers:b,localeStrings:{renderError:"An error occurred rendering the PivotTable results.",computeError:"An error occurred computing the PivotTable results.",uiRenderError:"An error occurred rendering the PivotTable UI.",selectAll:"Select All",selectNone:"Select None",tooMany:"(too many to list)",filterResults:"Filter values",apply:"Apply",cancel:"Cancel",totals:"Totals",vs:"vs",by:"by"}}},p=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],u=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],N=function(t){return("0"+t).substr(-2,2)},c={bin:function(t,e){return function(n){return n[t]-n[t]%e}},dateFormat:function(t,e,n,r,a){var o;return null==n&&(n=!1),null==r&&(r=p),null==a&&(a=u),o=n?"UTC":"",function(n){var i;return i=new Date(Date.parse(n[t])),isNaN(i)?"":e.replace(/%(.)/g,function(t,e){switch(e){case"y":return i["get"+o+"FullYear"]();case"m":return N(i["get"+o+"Month"]()+1);case"n":return r[i["get"+o+"Month"]()];case"d":return N(i["get"+o+"Date"]());case"w":return a[i["get"+o+"Day"]()];case"x":return i["get"+o+"Day"]();case"H":return N(i["get"+o+"Hours"]());case"M":return N(i["get"+o+"Minutes"]());case"S":return N(i["get"+o+"Seconds"]());default:return"%"+e}})}}},C=/(\d+)|(\D+)/g,v=/\d/,y=/^0/,f=function(t){return function(t,e){var n,r,a,o,i,l;if(null!=e&&null==t)return-1;if(null!=t&&null==e)return 1;if("number"==typeof t&&isNaN(t))return-1;if("number"==typeof e&&isNaN(e))return 1;if(i=+t,l=+e,i<l)return-1;if(i>l)return 1;if("number"==typeof t&&"number"!=typeof e)return-1;if("number"==typeof e&&"number"!=typeof t)return 1;if("number"==typeof t&&"number"==typeof e)return 0;if(isNaN(l)&&!isNaN(i))return-1;if(isNaN(i)&&!isNaN(l))return 1;if(n=String(t),a=String(e),n===a)return 0;if(!v.test(n)||!v.test(a))return n>a?1:-1;for(n=n.match(C),a=a.match(C);n.length&&a.length;)if(r=n.shift(),o=a.shift(),r!==o)return v.test(r)&&v.test(o)?r.replace(y,".0")-o.replace(y,".0"):r>o?1:-1;return n.length-a.length}}(this),w=function(t){var e,n,r,a;r={},n={};for(e in t)a=t[e],r[a]=e,"string"==typeof a&&(n[a.toLowerCase()]=e);return function(t,e){return null!=r[t]&&null!=r[e]?r[t]-r[e]:null!=r[t]?-1:null!=r[e]?1:null!=n[t]&&null!=n[e]?n[t]-n[e]:null!=n[t]?-1:null!=n[e]?1:f(t,e)}},h=function(e,n){var r;if(null!=e)if(t.isFunction(e)){if(r=e(n),t.isFunction(r))return r}else if(null!=e[n])return e[n];return f},o=function(){function e(t,n){var a,o,i,s,u,c,h,d,p,f;null==n&&(n={}),this.getAggregator=r(this.getAggregator,this),this.getRowKeys=r(this.getRowKeys,this),this.getColKeys=r(this.getColKeys,this),this.sortKeys=r(this.sortKeys,this),this.arrSort=r(this.arrSort,this),this.input=t,this.aggregator=null!=(a=n.aggregator)?a:l.count()(),this.aggregatorName=null!=(o=n.aggregatorName)?o:"Count",this.colAttrs=null!=(i=n.cols)?i:[],this.rowAttrs=null!=(s=n.rows)?s:[],this.valAttrs=null!=(u=n.vals)?u:[],this.sorters=null!=(c=n.sorters)?c:{},this.rowOrder=null!=(h=n.rowOrder)?h:"key_a_to_z",this.colOrder=null!=(d=n.colOrder)?d:"key_a_to_z",this.derivedAttributes=null!=(p=n.derivedAttributes)?p:{},this.filter=null!=(f=n.filter)?f:function(){return!0},this.tree={},this.rowKeys=[],this.colKeys=[],this.rowTotals={},this.colTotals={},this.allTotal=this.aggregator(this,[],[]),this.sorted=!1,e.forEachRecord(this.input,this.derivedAttributes,function(t){return function(e){if(t.filter(e))return t.processRecord(e)}}(this))}return e.forEachRecord=function(e,n,r){var o,i,l,s,u,c,h,d,p,f,m,g;if(o=t.isEmptyObject(n)?r:function(t){var e,a,o;for(e in n)o=n[e],t[e]=null!=(a=o(t))?a:t[e];return r(t)},t.isFunction(e))return e(o);if(t.isArray(e)){if(t.isArray(e[0])){f=[];for(l in e)if(a.call(e,l)&&(i=e[l],l>0)){d={},p=e[0];for(s in p)a.call(p,s)&&(u=p[s],d[u]=i[s]);f.push(o(d))}return f}for(m=[],c=0,h=e.length;c<h;c++)d=e[c],m.push(o(d));return m}if(e instanceof t)return g=[],t("thead > tr > th",e).each(function(e){return g.push(t(this).text())}),t("tbody > tr",e).each(function(e){return d={},t("td",this).each(function(e){return d[g[e]]=t(this).text()}),o(d)});throw new Error("unknown input format")},e.prototype.forEachMatchingRecord=function(t,n){return e.forEachRecord(this.input,this.derivedAttributes,function(e){return function(r){var a,o,i;if(e.filter(r)){for(a in t)if(i=t[a],i!==(null!=(o=r[a])?o:"null"))return;return n(r)}}}(this))},e.prototype.arrSort=function(t){var e,n;return n=function(){var n,r,a;for(a=[],n=0,r=t.length;n<r;n++)e=t[n],a.push(h(this.sorters,e));return a}.call(this),function(t,e){var r,o,i;for(o in n)if(a.call(n,o)&&(i=n[o],r=i(t[o],e[o]),0!==r))return r;return 0}},e.prototype.sortKeys=function(){var t;if(!this.sorted){switch(this.sorted=!0,t=function(t){return function(e,n){return t.getAggregator(e,n).value()}}(this),this.rowOrder){case"value_a_to_z":this.rowKeys.sort(function(e){return function(e,n){return f(t(e,[]),t(n,[]))}}(this));break;case"value_z_to_a":this.rowKeys.sort(function(e){return function(e,n){return-f(t(e,[]),t(n,[]))}}(this));break;default:this.rowKeys.sort(this.arrSort(this.rowAttrs))}switch(this.colOrder){case"value_a_to_z":return this.colKeys.sort(function(e){return function(e,n){return f(t([],e),t([],n))}}(this));case"value_z_to_a":return this.colKeys.sort(function(e){return function(e,n){return-f(t([],e),t([],n))}}(this));default:return this.colKeys.sort(this.arrSort(this.colAttrs))}}},e.prototype.getColKeys=function(){return this.sortKeys(),this.colKeys},e.prototype.getRowKeys=function(){return this.sortKeys(),this.rowKeys},e.prototype.processRecord=function(t){var e,n,r,a,o,i,l,s,u,c,h,d,p;for(e=[],d=[],s=this.colAttrs,a=0,o=s.length;a<o;a++)p=s[a],e.push(null!=(u=t[p])?u:"null");for(c=this.rowAttrs,l=0,i=c.length;l<i;l++)p=c[l],d.push(null!=(h=t[p])?h:"null");if(r=d.join(String.fromCharCode(0)),n=e.join(String.fromCharCode(0)),this.allTotal.push(t),0!==d.length&&(this.rowTotals[r]||(this.rowKeys.push(d),this.rowTotals[r]=this.aggregator(this,d,[])),this.rowTotals[r].push(t)),0!==e.length&&(this.colTotals[n]||(this.colKeys.push(e),this.colTotals[n]=this.aggregator(this,[],e)),this.colTotals[n].push(t)),0!==e.length&&0!==d.length)return this.tree[r]||(this.tree[r]={}),this.tree[r][n]||(this.tree[r][n]=this.aggregator(this,d,e)),this.tree[r][n].push(t)},e.prototype.getAggregator=function(t,e){var n,r,a;return a=t.join(String.fromCharCode(0)),r=e.join(String.fromCharCode(0)),n=0===t.length&&0===e.length?this.allTotal:0===t.length?this.colTotals[r]:0===e.length?this.rowTotals[a]:this.tree[a][r],null!=n?n:{value:function(){return null},format:function(){return""}}},e}(),t.pivotUtilities={aggregatorTemplates:l,aggregators:s,renderers:b,derivers:c,locales:d,naturalSort:f,numberFormat:m,sortAs:w,PivotData:o},g=function(e,n){var r,o,i,l,s,u,c,h,d,p,f,m,g,v,b,C,y,w,A,x,S,N,T,k;u={table:{clickCallback:null,rowTotals:!0,colTotals:!0},localeStrings:{totals:"Totals"}},n=t.extend(!0,{},u,n),i=e.colAttrs,m=e.rowAttrs,v=e.getRowKeys(),s=e.getColKeys(),n.table.clickCallback&&(c=function(t,r,o){var l,s,u;s={};for(u in i)a.call(i,u)&&(l=i[u],null!=o[u]&&(s[l]=o[u]));for(u in m)a.call(m,u)&&(l=m[u],null!=r[u]&&(s[l]=r[u]));return function(r){return n.table.clickCallback(r,t,s,e)}}),f=document.createElement("table"),f.className="pvtTable",b=function(t,e,n){var r,a,o,i,l,s,u,c;if(0!==e){for(i=!0,c=r=0,l=n;0<=l?r<=l:r>=l;c=0<=l?++r:--r)t[e-1][c]!==t[e][c]&&(i=!1);if(i)return-1}for(a=0;e+a<t.length;){for(u=!1,c=o=0,s=n;0<=s?o<=s:o>=s;c=0<=s?++o:--o)t[e][c]!==t[e+a][c]&&(u=!0);if(u)break;a++}return a},A=document.createElement("thead");for(d in i)if(a.call(i,d)){o=i[d],S=document.createElement("tr"),0===parseInt(d)&&0!==m.length&&(w=document.createElement("th"),w.setAttribute("colspan",m.length),w.setAttribute("rowspan",i.length),S.appendChild(w)),w=document.createElement("th"),w.className="pvtAxisLabel",w.textContent=o,S.appendChild(w);for(h in s)a.call(s,h)&&(l=s[h],k=b(s,parseInt(h),parseInt(d)),k!==-1&&(w=document.createElement("th"),w.className="pvtColLabel",w.textContent=l[d],w.setAttribute("colspan",k),parseInt(d)===i.length-1&&0!==m.length&&w.setAttribute("rowspan",2),S.appendChild(w)));0===parseInt(d)&&n.table.rowTotals&&(w=document.createElement("th"),w.className="pvtTotalLabel pvtRowTotalLabel",w.innerHTML=n.localeStrings.totals,w.setAttribute("rowspan",i.length+(0===m.length?0:1)),S.appendChild(w)),A.appendChild(S)}if(0!==m.length){S=document.createElement("tr");for(h in m)a.call(m,h)&&(p=m[h],w=document.createElement("th"),w.className="pvtAxisLabel",w.textContent=p,S.appendChild(w));w=document.createElement("th"),0===i.length&&(w.className="pvtTotalLabel pvtRowTotalLabel",w.innerHTML=n.localeStrings.totals),S.appendChild(w),A.appendChild(S)}f.appendChild(A),C=document.createElement("tbody");for(h in v)if(a.call(v,h)){g=v[h],S=document.createElement("tr");for(d in g)a.call(g,d)&&(N=g[d],k=b(v,parseInt(h),parseInt(d)),k!==-1&&(w=document.createElement("th"),w.className="pvtRowLabel",w.textContent=N,w.setAttribute("rowspan",k),parseInt(d)===m.length-1&&0!==i.length&&w.setAttribute("colspan",2),S.appendChild(w)));for(d in s)a.call(s,d)&&(l=s[d],r=e.getAggregator(g,l),T=r.value(),y=document.createElement("td"),y.className="pvtVal row"+h+" col"+d,y.textContent=r.format(T),y.setAttribute("data-value",T),null!=c&&(y.onclick=c(T,g,l)),S.appendChild(y));(n.table.rowTotals||0===i.length)&&(x=e.getAggregator(g,[]),T=x.value(),y=document.createElement("td"),y.className="pvtTotal rowTotal",y.textContent=x.format(T),y.setAttribute("data-value",T),null!=c&&(y.onclick=c(T,g,[])),y.setAttribute("data-for","row"+h),S.appendChild(y)),C.appendChild(S)}if(n.table.colTotals||0===m.length){S=document.createElement("tr"),(n.table.colTotals||0===m.length)&&(w=document.createElement("th"),w.className="pvtTotalLabel pvtColTotalLabel",w.innerHTML=n.localeStrings.totals,w.setAttribute("colspan",m.length+(0===i.length?0:1)),S.appendChild(w));for(d in s)a.call(s,d)&&(l=s[d],x=e.getAggregator([],l),T=x.value(),y=document.createElement("td"),y.className="pvtTotal colTotal",y.textContent=x.format(T),y.setAttribute("data-value",T),null!=c&&(y.onclick=c(T,[],l)),y.setAttribute("data-for","col"+d),S.appendChild(y));(n.table.rowTotals||0===i.length)&&(x=e.getAggregator([],[]),T=x.value(),y=document.createElement("td"),y.className="pvtGrandTotal",y.textContent=x.format(T),y.setAttribute("data-value",T),null!=c&&(y.onclick=c(T,[],[])),S.appendChild(y)),C.appendChild(S)}return f.appendChild(C),f.setAttribute("data-numrows",v.length),f.setAttribute("data-numcols",s.length),f},t.fn.pivot=function(e,n,r){var a,i,s,u,c,h,p,f;null==r&&(r="en"),null==d[r]&&(r="en"),a={cols:[],rows:[],vals:[],rowOrder:"key_a_to_z",colOrder:"key_a_to_z",dataClass:o,filter:function(){return!0},aggregator:l.count()(),aggregatorName:"Count",sorters:{},derivedAttributes:{},renderer:g},u=t.extend(!0,{},d.en.localeStrings,d[r].localeStrings),s={rendererOptions:{localeStrings:u},localeStrings:u},c=t.extend(!0,{},s,t.extend({},a,n)),p=null;try{h=new c.dataClass(e,c);try{p=c.renderer(h,c.rendererOptions)}catch(m){i=m,"undefined"!=typeof console&&null!==console&&console.error(i.stack),p=t("<span>").html(c.localeStrings.renderError)}}catch(m){i=m,"undefined"!=typeof console&&null!==console&&console.error(i.stack),p=t("<span>").html(c.localeStrings.computeError)}for(f=this[0];f.hasChildNodes();)f.removeChild(f.lastChild);return this.append(p)},t.fn.pivotUI=function(n,r,i,l){var s,u,c,p,m,g,v,b,C,y,w,A,x,S,N,T,k,O,_,F,D,E,M,R,I,L,U,K,q,z,V,j,H,B,P,J,G,W,$,Q,Y,X,Z,tt,et;null==i&&(i=!1),null==l&&(l="en"),null==d[l]&&(l="en"),b={derivedAttributes:{},aggregators:d[l].aggregators,renderers:d[l].renderers,hiddenAttributes:[],hiddenFromAggregators:[],hiddenFromDragDrop:[],menuLimit:500,cols:[],rows:[],vals:[],rowOrder:"key_a_to_z",colOrder:"key_a_to_z",dataClass:o,exclusions:{},inclusions:{},unusedAttrsVertical:85,autoSortUnusedAttrs:!1,onRefresh:null,showUI:!0,filter:function(){return!0},sorters:{}},_=t.extend(!0,{},d.en.localeStrings,d[l].localeStrings),O={rendererOptions:{localeStrings:_},localeStrings:_},y=this.data("pivotUIOptions"),M=null==y||i?t.extend(!0,{},O,t.extend({},b,r)):y;try{m={},F=[],L=0,o.forEachRecord(n,M.derivedAttributes,function(t){var e,n,r,o;if(M.filter(t)){F.push(t);for(e in t)a.call(t,e)&&null==m[e]&&(m[e]={},L>0&&(m[e]["null"]=L));for(e in m)o=null!=(r=t[e])?r:"null",null==(n=m[e])[o]&&(n[o]=0),m[e][o]++;return L++}}),Y=t("<table>",{"class":"pvtUi"}).attr("cellpadding",5),B=t("<td>").addClass("pvtUiCell"),H=t("<select>").addClass("pvtRenderer").appendTo(B).bind("change",function(){return V()}),U=M.renderers;for(et in U)a.call(U,et)&&t("<option>").val(et).html(et).appendTo(H);if(X=t("<td>").addClass("pvtAxisContainer pvtUnused pvtUiCell"),J=function(){var t;t=[];for(s in m)e.call(M.hiddenAttributes,s)<0&&t.push(s);return t}(),G=function(){var t,n,r;for(r=[],t=0,n=J.length;t<n;t++)g=J[t],e.call(M.hiddenFromAggregators,g)<0&&r.push(g);return r}(),W=function(){var t,n,r;for(r=[],t=0,n=J.length;t<n;t++)g=J[t],e.call(M.hiddenFromDragDrop,g)<0&&r.push(g);return r}(),tt=!1,Z="auto"===M.unusedAttrsVertical?120:parseInt(M.unusedAttrsVertical),!isNaN(Z)){for(p=0,S=0,N=W.length;S<N;S++)s=W[S],p+=s.length;tt=p>Z}M.unusedAttrsVertical===!0||tt?X.addClass("pvtVertList"):X.addClass("pvtHorizList"),w=function(n){var r,a,o,i,l,s,u,c,d,p,f,g,v,b,C,y,w,x,S;if(S=function(){var t;t=[];for(C in m[n])t.push(C);return t}(),c=!1,x=t("<div>").addClass("pvtFilterBox").hide(),x.append(t("<h4>").append(t("<span>").text(n),t("<span>").addClass("count").text("("+S.length+")"))),S.length>M.menuLimit)x.append(t("<p>").html(M.localeStrings.tooMany));else for(S.length>5&&(i=t("<p>").appendTo(x),v=h(M.sorters,n),f=M.localeStrings.filterResults,t("<input>",{type:"text"}).appendTo(i).attr({placeholder:f,"class":"pvtSearch"}).bind("keyup",function(){var n,r,a;return a=t(this).val().toLowerCase().trim(),r=function(t,n){return function(r){var o,i;return o=a.substring(t.length).trim(),0===o.length||(i=Math.sign(v(r.toLowerCase(),o)),e.call(n,i)>=0)}},n=0===a.indexOf(">=")?r(">=",[1,0]):0===a.indexOf("<=")?r("<=",[-1,0]):0===a.indexOf(">")?r(">",[1]):0===a.indexOf("<")?r("<",[-1]):0===a.indexOf("~")?function(t){return 0===a.substring(1).trim().length||t.toLowerCase().match(a.substring(1))}:function(t){return t.toLowerCase().indexOf(a)!==-1},x.find(".pvtCheckContainer p label span.value").each(function(){return n(t(this).text())?t(this).parent().parent().show():t(this).parent().parent().hide()})}),i.append(t("<br>")),t("<button>",{type:"button"}).appendTo(i).html(M.localeStrings.selectAll).bind("click",function(){return x.find("input:visible:not(:checked)").prop("checked",!0).toggleClass("changed"),!1}),t("<button>",{type:"button"}).appendTo(i).html(M.localeStrings.selectNone).bind("click",function(){return x.find("input:visible:checked").prop("checked",!1).toggleClass("changed"),!1})),a=t("<div>").addClass("pvtCheckContainer").appendTo(x),g=S.sort(h(M.sorters,n)),p=0,d=g.length;p<d;p++)y=g[p],w=m[n][y],l=t("<label>"),s=!1,M.inclusions[n]?s=e.call(M.inclusions[n],y)<0:M.exclusions[n]&&(s=e.call(M.exclusions[n],y)>=0),c||(c=s),t("<input>").attr("type","checkbox").addClass("pvtFilter").attr("checked",!s).data("filter",[n,y]).appendTo(l).bind("change",function(){return t(this).toggleClass("changed")}),l.append(t("<span>").addClass("value").text(y)),l.append(t("<span>").addClass("count").text("("+w+")")),a.append(t("<p>").append(l));return o=function(){return x.find("[type='checkbox']").length>x.find("[type='checkbox']:checked").length?r.addClass("pvtFilteredAttribute"):r.removeClass("pvtFilteredAttribute"),x.find(".pvtSearch").val(""),x.find(".pvtCheckContainer p").show(),x.hide()},u=t("<p>").appendTo(x),S.length<=M.menuLimit&&t("<button>",{type:"button"}).text(M.localeStrings.apply).appendTo(u).bind("click",function(){return x.find(".changed").removeClass("changed").length&&V(),o()}),t("<button>",{type:"button"}).text(M.localeStrings.cancel).appendTo(u).bind("click",function(){return x.find(".changed:checked").removeClass("changed").prop("checked",!1),x.find(".changed:not(:checked)").removeClass("changed").prop("checked",!0),o()}),b=t("<span>").addClass("pvtTriangle").html(" &#x25BE;").bind("click",function(e){var n,r,a;return r=t(e.currentTarget).position(),n=r.left,a=r.top,x.css({left:n+10,top:a+10}).show()}),r=t("<li>").addClass("axis_"+A).append(t("<span>").addClass("pvtAttr").text(n).data("attrName",n).append(b)),c&&r.addClass("pvtFilteredAttribute"),X.append(r).append(x)};for(A in W)a.call(W,A)&&(c=W[A],w(c));$=t("<tr>").appendTo(Y),u=t("<select>").addClass("pvtAggregator").bind("change",function(){return V()}),K=M.aggregators;for(et in K)a.call(K,et)&&u.append(t("<option>").val(et).html(et));for(R={key_a_to_z:{rowSymbol:"&varr;",colSymbol:"&harr;",next:"value_a_to_z"},value_a_to_z:{rowSymbol:"&darr;",colSymbol:"&rarr;",next:"value_z_to_a"},value_z_to_a:{rowSymbol:"&uarr;",colSymbol:"&larr;",next:"key_a_to_z"}},P=t("<a>",{role:"button"}).addClass("pvtRowOrder").data("order",M.rowOrder).html(R[M.rowOrder].rowSymbol).bind("click",function(){return t(this).data("order",R[t(this).data("order")].next),t(this).html(R[t(this).data("order")].rowSymbol),V()}),v=t("<a>",{role:"button"}).addClass("pvtColOrder").data("order",M.colOrder).html(R[M.colOrder].colSymbol).bind("click",function(){return t(this).data("order",R[t(this).data("order")].next),t(this).html(R[t(this).data("order")].colSymbol),V()}),t("<td>").addClass("pvtVals pvtUiCell").appendTo($).append(u).append(P).append(v).append(t("<br>")),t("<td>").addClass("pvtAxisContainer pvtHorizList pvtCols pvtUiCell").appendTo($),Q=t("<tr>").appendTo(Y),Q.append(t("<td>").addClass("pvtAxisContainer pvtRows pvtUiCell").attr("valign","top")),I=t("<td>").attr("valign","top").addClass("pvtRendererArea").appendTo(Q),M.unusedAttrsVertical===!0||tt?(Y.find("tr:nth-child(1)").prepend(B),Y.find("tr:nth-child(2)").prepend(X)):Y.prepend(t("<tr>").append(B).append(X)),this.html(Y),q=M.cols,D=0,T=q.length;D<T;D++)et=q[D],this.find(".pvtCols").append(this.find(".axis_"+t.inArray(et,W)));for(z=M.rows,E=0,k=z.length;E<k;E++)et=z[E],this.find(".pvtRows").append(this.find(".axis_"+t.inArray(et,W)));null!=M.aggregatorName&&this.find(".pvtAggregator").val(M.aggregatorName),null!=M.rendererName&&this.find(".pvtRenderer").val(M.rendererName),M.showUI||this.find(".pvtUiCell").hide(),x=!0,j=function(n){return function(){var r,a,o,i,l,s,h,d,p,m,g,b,C,y;if(m={derivedAttributes:M.derivedAttributes,localeStrings:M.localeStrings,rendererOptions:M.rendererOptions,sorters:M.sorters,cols:[],rows:[],dataClass:M.dataClass},l=null!=(d=M.aggregators[u.val()]([])().numInputs)?d:0,y=[],n.find(".pvtRows li span.pvtAttr").each(function(){return m.rows.push(t(this).data("attrName"))}),n.find(".pvtCols li span.pvtAttr").each(function(){return m.cols.push(t(this).data("attrName"))}),n.find(".pvtVals select.pvtAttrDropdown").each(function(){return 0===l?t(this).remove():(l--,""!==t(this).val()?y.push(t(this).val()):void 0)}),0!==l)for(h=n.find(".pvtVals"),et=g=0,p=l;0<=p?g<p:g>p;et=0<=p?++g:--g){for(i=t("<select>").addClass("pvtAttrDropdown").append(t("<option>")).bind("change",function(){return V()}),b=0,o=G.length;b<o;b++)c=G[b],i.append(t("<option>").val(c).text(c));h.append(i)}if(x&&(y=M.vals,A=0,n.find(".pvtVals select.pvtAttrDropdown").each(function(){return t(this).val(y[A]),A++}),x=!1),m.aggregatorName=u.val(),m.vals=y,m.aggregator=M.aggregators[u.val()](y),m.renderer=M.renderers[H.val()],m.rowOrder=P.data("order"),m.colOrder=v.data("order"),r={},n.find("input.pvtFilter").not(":checked").each(function(){var e;return e=t(this).data("filter"),null!=r[e[0]]?r[e[0]].push(e[1]):r[e[0]]=[e[1]]}),a={},n.find("input.pvtFilter:checked").each(function(){var e;if(e=t(this).data("filter"),null!=r[e[0]])return null!=a[e[0]]?a[e[0]].push(e[1]):a[e[0]]=[e[1]]}),m.filter=function(t){var n,a,o,i;if(!M.filter(t))return!1;for(a in r)if(n=r[a],o=""+(null!=(i=t[a])?i:"null"),e.call(n,o)>=0)return!1;return!0},I.pivot(F,m),s=t.extend({},M,{cols:m.cols,rows:m.rows,colOrder:m.colOrder,rowOrder:m.rowOrder,vals:y,exclusions:r,inclusions:a,inclusionsInfo:a,aggregatorName:u.val(),rendererName:H.val()}),n.data("pivotUIOptions",s),M.autoSortUnusedAttrs&&(C=n.find("td.pvtUnused.pvtAxisContainer"),t(C).children("li").sort(function(e,n){return f(t(e).text(),t(n).text())}).appendTo(C)),I.css("opacity",1),null!=M.onRefresh)return M.onRefresh(s)}}(this),V=function(t){return function(){return I.css("opacity",.5),setTimeout(j,10)}}(this),V(),this.find(".pvtAxisContainer").sortable({update:function(t,e){if(null==e.sender)return V()},connectWith:this.find(".pvtAxisContainer"),items:"li",placeholder:"pvtPlaceholder"})}catch(nt){C=nt,"undefined"!=typeof console&&null!==console&&console.error(C.stack),this.html(M.localeStrings.uiRenderError)}return this},t.fn.heatmap=function(e,n){var r,a,o,i,l,s,u,c,h,d,p;switch(null==e&&(e="heatmap"),c=this.data("numrows"),u=this.data("numcols"),r=null!=n&&null!=(h=n.heatmap)?h.colorScaleGenerator:void 0,null==r&&(r=function(t){var e,n;return n=Math.min.apply(Math,t),e=Math.max.apply(Math,t),function(t){var r;return r=255-Math.round(255*(t-n)/(e-n)),"rgb(255,"+r+","+r+")"}}),a=function(e){return function(n){var a,o,i;return o=function(r){return e.find(n).each(function(){var e;if(e=t(this).data("value"),null!=e&&isFinite(e))return r(e,t(this))})},i=[],o(function(t){return i.push(t)}),a=r(i),o(function(t,e){return e.css("background-color",a(t))})}}(this),e){case"heatmap":a(".pvtVal");break;case"rowheatmap":for(o=l=0,d=c;0<=d?l<d:l>d;o=0<=d?++l:--l)a(".pvtVal.row"+o);break;case"colheatmap":for(i=s=0,p=u;0<=p?s<p:s>p;i=0<=p?++s:--s)a(".pvtVal.col"+i)}return a(".pvtTotal.rowTotal"),a(".pvtTotal.colTotal"),this},t.fn.barchart=function(e){var n,r,a,o,i,l;for(i=this.data("numrows"),o=this.data("numcols"),n=function(e){return function(n){var r,a,o,i,l,s;return r=function(r){return e.find(n).each(function(){var e;if(e=t(this).data("value"),null!=e&&isFinite(e))return r(e,t(this))})},s=[],r(function(t){return s.push(t)}),a=Math.max.apply(Math,s),a<0&&(a=0),i=a,o=Math.min.apply(Math,s),o<0&&(i=a-o),l=function(t){return 100*t/(1.4*i)},r(function(e,n){var r,a,i,s;return i=n.text(),s=t("<div>").css({position:"relative",height:"55px"}),a="gray",r=0,o<0&&(r=l(-o)),e<0&&(r+=l(e),a="darkred",e=-e),s.append(t("<div>").css({position:"absolute",bottom:r+"%",left:0,right:0,height:l(e)+"%","background-color":a})),s.append(t("<div>").text(i).css({position:"relative","padding-left":"5px","padding-right":"5px"})),n.css({padding:0,"padding-top":"5px","text-align":"center"}).html(s)})}}(this),r=a=0,l=i;0<=l?a<l:a>l;r=0<=l?++a:--a)n(".pvtVal.row"+r);return n(".pvtTotal.colTotal"),this}})}).call(this);
//# sourceMappingURL=pivot.min.js.map

;(function() {
  var callWithJQuery,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery"], pivotModule);
    } else {
      return pivotModule(jQuery);
    }
  };

  callWithJQuery(function($) {
    var SubtotalPivotData, SubtotalRenderer, aggregatorTemplates, subtotalAggregatorTemplates, usFmtPct;
    SubtotalPivotData = (function(superClass) {
      var processKey;

      extend(SubtotalPivotData, superClass);

      function SubtotalPivotData(input, opts) {
        SubtotalPivotData.__super__.constructor.call(this, input, opts);
      }

      processKey = function(record, totals, keys, attrs, getAggregator) {
        var addKey, attr, flatKey, k, key, len, ref;
        key = [];
        addKey = false;
        for (k = 0, len = attrs.length; k < len; k++) {
          attr = attrs[k];
          key.push((ref = record[attr]) != null ? ref : "null");
          flatKey = key.join(String.fromCharCode(0));
          if (!totals[flatKey]) {
            totals[flatKey] = getAggregator(key.slice());
            addKey = true;
          }
          totals[flatKey].push(record);
        }
        if (addKey) {
          keys.push(key);
        }
        return key;
      };

      SubtotalPivotData.prototype.processRecord = function(record) {
        var colKey, fColKey, fRowKey, flatColKey, flatRowKey, i, j, k, m, n, ref, results, rowKey;
        rowKey = [];
        colKey = [];
        this.allTotal.push(record);
        rowKey = processKey(record, this.rowTotals, this.rowKeys, this.rowAttrs, (function(_this) {
          return function(key) {
            return _this.aggregator(_this, key, []);
          };
        })(this));
        colKey = processKey(record, this.colTotals, this.colKeys, this.colAttrs, (function(_this) {
          return function(key) {
            return _this.aggregator(_this, [], key);
          };
        })(this));
        m = rowKey.length - 1;
        n = colKey.length - 1;
        if (m < 0 || n < 0) {
          return;
        }
        results = [];
        for (i = k = 0, ref = m; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
          fRowKey = rowKey.slice(0, i + 1);
          flatRowKey = fRowKey.join(String.fromCharCode(0));
          if (!this.tree[flatRowKey]) {
            this.tree[flatRowKey] = {};
          }
          results.push((function() {
            var l, ref1, results1;
            results1 = [];
            for (j = l = 0, ref1 = n; 0 <= ref1 ? l <= ref1 : l >= ref1; j = 0 <= ref1 ? ++l : --l) {
              fColKey = colKey.slice(0, j + 1);
              flatColKey = fColKey.join(String.fromCharCode(0));
              if (!this.tree[flatRowKey][flatColKey]) {
                this.tree[flatRowKey][flatColKey] = this.aggregator(this, fRowKey, fColKey);
              }
              results1.push(this.tree[flatRowKey][flatColKey].push(record));
            }
            return results1;
          }).call(this));
        }
        return results;
      };

      return SubtotalPivotData;

    })($.pivotUtilities.PivotData);
    $.pivotUtilities.SubtotalPivotData = SubtotalPivotData;
    SubtotalRenderer = function(pivotData, opts) {
      var addClass, adjustAxisHeader, allTotal, arrowCollapsed, arrowExpanded, buildAxisHeader, buildColAxisHeaders, buildColHeader, buildColTotals, buildColTotalsHeader, buildGrandTotal, buildRowAxisHeaders, buildRowHeader, buildRowTotalsHeader, buildValues, classColCollapsed, classColExpanded, classColHide, classColShow, classCollapsed, classExpanded, classRowCollapsed, classRowExpanded, classRowHide, classRowShow, clickStatusCollapsed, clickStatusExpanded, colAttrs, colKeys, colTotals, collapseAxis, collapseAxisHeaders, collapseChildCol, collapseChildRow, collapseCol, collapseHiddenColSubtotal, collapseRow, collapseShowColSubtotal, collapseShowRowSubtotal, createElement, defaults, expandAxis, expandChildCol, expandChildRow, expandCol, expandHideColSubtotal, expandHideRowSubtotal, expandRow, expandShowColSubtotal, expandShowRowSubtotal, getHeaderText, getTableEventHandlers, hasClass, hideChildCol, hideChildRow, main, processKeys, removeClass, replaceClass, rowAttrs, rowKeys, rowTotals, setAttributes, showChildCol, showChildRow, tree;
      defaults = {
        table: {
          clickCallback: null
        },
        localeStrings: {
          totals: "Totals",
          subtotalOf: "Subtotal of"
        },
        arrowCollapsed: "\u25B6",
        arrowExpanded: "\u25E2",
        rowSubtotalDisplay: {
          displayOnTop: true,
          disableFrom: 99999,
          collapseAt: 99999,
          hideOnExpand: false,
          disableExpandCollapse: false
        },
        colSubtotalDisplay: {
          displayOnTop: true,
          disableFrom: 99999,
          collapseAt: 99999,
          hideOnExpand: false,
          disableExpandCollapse: false
        }
      };
      opts = $.extend(true, {}, defaults, opts);
      if (opts.rowSubtotalDisplay.disableSubtotal) {
        opts.rowSubtotalDisplay.disableFrom = 0;
      }
      if (typeof opts.rowSubtotalDisplay.disableAfter !== 'undefined' && opts.rowSubtotalDisplay.disableAfter !== null) {
        opts.rowSubtotalDisplay.disableFrom = opts.rowSubtotalDisplay.disableAfter + 1;
      }
      if (typeof opts.rowSubtotalDisplay.collapseAt !== 'undefined' && opts.collapseRowsAt !== null) {
        opts.rowSubtotalDisplay.collapseAt = opts.collapseRowsAt;
      }
      if (opts.colSubtotalDisplay.disableSubtotal) {
        opts.colSubtotalDisplay.disableFrom = 0;
      }
      if (typeof opts.colSubtotalDisplay.disableAfter !== 'undefined' && opts.colSubtotalDisplay.disableAfter !== null) {
        opts.colSubtotalDisplay.disableFrom = opts.colSubtotalDisplay.disableAfter + 1;
      }
      if (typeof opts.colSubtotalDisplay.collapseAt !== 'undefined' && opts.collapseColsAt !== null) {
        opts.colSubtotalDisplay.collapseAt = opts.collapseColsAt;
      }
      colAttrs = pivotData.colAttrs;
      rowAttrs = pivotData.rowAttrs;
      rowKeys = pivotData.getRowKeys();
      colKeys = pivotData.getColKeys();
      tree = pivotData.tree;
      rowTotals = pivotData.rowTotals;
      colTotals = pivotData.colTotals;
      allTotal = pivotData.allTotal;
      classRowHide = "rowhide";
      classRowShow = "rowshow";
      classColHide = "colhide";
      classColShow = "colshow";
      clickStatusExpanded = "expanded";
      clickStatusCollapsed = "collapsed";
      classExpanded = "expanded";
      classCollapsed = "collapsed";
      classRowExpanded = "rowexpanded";
      classRowCollapsed = "rowcollapsed";
      classColExpanded = "colexpanded";
      classColCollapsed = "colcollapsed";
      arrowExpanded = opts.arrowExpanded;
      arrowCollapsed = opts.arrowCollapsed;
      hasClass = function(element, className) {
        var regExp;
        regExp = new RegExp("(?:^|\\s)" + className + "(?!\\S)", "g");
        return element.className.match(regExp) !== null;
      };
      removeClass = function(element, className) {
        var k, len, name, ref, regExp, results;
        ref = className.split(" ");
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          name = ref[k];
          regExp = new RegExp("(?:^|\\s)" + name + "(?!\\S)", "g");
          results.push(element.className = element.className.replace(regExp, ''));
        }
        return results;
      };
      addClass = function(element, className) {
        var k, len, name, ref, results;
        ref = className.split(" ");
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          name = ref[k];
          if (!hasClass(element, name)) {
            results.push(element.className += " " + name);
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
      replaceClass = function(element, replaceClassName, byClassName) {
        removeClass(element, replaceClassName);
        return addClass(element, byClassName);
      };
      createElement = function(elementType, className, textContent, attributes, eventHandlers) {
        var attr, e, event, handler, val;
        e = document.createElement(elementType);
        if (className != null) {
          e.className = className;
        }
        if (textContent != null) {
          e.textContent = textContent;
        }
        if (attributes != null) {
          for (attr in attributes) {
            if (!hasProp.call(attributes, attr)) continue;
            val = attributes[attr];
            e.setAttribute(attr, val);
          }
        }
        if (eventHandlers != null) {
          for (event in eventHandlers) {
            if (!hasProp.call(eventHandlers, event)) continue;
            handler = eventHandlers[event];
            e.addEventListener(event, handler);
          }
        }
        return e;
      };
      setAttributes = function(e, attrs) {
        var a, results, v;
        results = [];
        for (a in attrs) {
          if (!hasProp.call(attrs, a)) continue;
          v = attrs[a];
          results.push(e.setAttribute(a, v));
        }
        return results;
      };
      processKeys = function(keysArr, className, opts) {
        var headers, lastIdx, row;
        lastIdx = keysArr[0].length - 1;
        headers = {
          children: []
        };
        row = 0;
        keysArr.reduce((function(_this) {
          return function(val0, k0) {
            var col;
            col = 0;
            k0.reduce(function(acc, curVal, curIdx, arr) {
              var i, k, key, node, ref;
              if (!acc[curVal]) {
                key = k0.slice(0, col + 1);
                acc[curVal] = {
                  row: row,
                  col: col,
                  descendants: 0,
                  children: [],
                  text: curVal,
                  key: key,
                  flatKey: key.join(String.fromCharCode(0)),
                  firstLeaf: null,
                  leaves: 0,
                  parent: col !== 0 ? acc : null,
                  th: createElement("th", className, curVal),
                  childrenSpan: 0
                };
                acc.children.push(curVal);
              }
              if (col > 0) {
                acc.descendants++;
              }
              col++;
              if (curIdx === lastIdx) {
                node = headers;
                for (i = k = 0, ref = lastIdx - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
                  if (!(lastIdx > 0)) {
                    continue;
                  }
                  node[k0[i]].leaves++;
                  if (!node[k0[i]].firstLeaf) {
                    node[k0[i]].firstLeaf = acc[curVal];
                  }
                  node = node[k0[i]];
                }
                return headers;
              }
              return acc[curVal];
            }, headers);
            row++;
            return headers;
          };
        })(this), headers);
        return headers;
      };
      buildAxisHeader = function(axisHeaders, col, attrs, opts) {
        var ah, arrow, hClass;
        ah = {
          text: attrs[col],
          expandedCount: 0,
          expandables: 0,
          attrHeaders: [],
          clickStatus: clickStatusExpanded,
          onClick: collapseAxis
        };
        arrow = arrowExpanded + " ";
        hClass = classExpanded;
        if (col >= opts.collapseAt) {
          arrow = arrowCollapsed + " ";
          hClass = classCollapsed;
          ah.clickStatus = clickStatusCollapsed;
          ah.onClick = expandAxis;
        }
        if (col === attrs.length - 1 || col >= opts.disableFrom || opts.disableExpandCollapse) {
          arrow = "";
        }
        ah.th = createElement("th", "pvtAxisLabel " + hClass, "" + arrow + ah.text);
        if (col < attrs.length - 1 && col < opts.disableFrom && !opts.disableExpandCollapse) {
          ah.th.onclick = function(event) {
            event = event || window.event;
            return ah.onClick(axisHeaders, col, attrs, opts);
          };
        }
        axisHeaders.ah.push(ah);
        return ah;
      };
      buildColAxisHeaders = function(thead, rowAttrs, colAttrs, opts) {
        var ah, attr, axisHeaders, col, k, len;
        axisHeaders = {
          collapseAttrHeader: collapseCol,
          expandAttrHeader: expandCol,
          ah: []
        };
        for (col = k = 0, len = colAttrs.length; k < len; col = ++k) {
          attr = colAttrs[col];
          ah = buildAxisHeader(axisHeaders, col, colAttrs, opts.colSubtotalDisplay);
          ah.tr = createElement("tr");
          if (col === 0 && rowAttrs.length !== 0) {
            ah.tr.appendChild(createElement("th", null, null, {
              colspan: rowAttrs.length,
              rowspan: colAttrs.length
            }));
          }
          ah.tr.appendChild(ah.th);
          thead.appendChild(ah.tr);
        }
        return axisHeaders;
      };
      buildRowAxisHeaders = function(thead, rowAttrs, colAttrs, opts) {
        var ah, axisHeaders, col, k, ref, th;
        axisHeaders = {
          collapseAttrHeader: collapseRow,
          expandAttrHeader: expandRow,
          ah: [],
          tr: createElement("tr")
        };
        for (col = k = 0, ref = rowAttrs.length - 1; 0 <= ref ? k <= ref : k >= ref; col = 0 <= ref ? ++k : --k) {
          ah = buildAxisHeader(axisHeaders, col, rowAttrs, opts.rowSubtotalDisplay);
          axisHeaders.tr.appendChild(ah.th);
        }
        if (colAttrs.length !== 0) {
          th = createElement("th");
          axisHeaders.tr.appendChild(th);
        }
        thead.appendChild(axisHeaders.tr);
        return axisHeaders;
      };
      getHeaderText = function(h, attrs, opts) {
        var arrow;
        arrow = " " + arrowExpanded + " ";
        if (h.col === attrs.length - 1 || h.col >= opts.disableFrom || opts.disableExpandCollapse || h.children.length === 0) {
          arrow = "";
        }
        return "" + arrow + h.text;
      };
      buildColHeader = function(axisHeaders, attrHeaders, h, rowAttrs, colAttrs, node, opts) {
        var ah, chKey, k, len, ref, ref1;
        ref = h.children;
        for (k = 0, len = ref.length; k < len; k++) {
          chKey = ref[k];
          buildColHeader(axisHeaders, attrHeaders, h[chKey], rowAttrs, colAttrs, node, opts);
        }
        ah = axisHeaders.ah[h.col];
        ah.attrHeaders.push(h);
        h.node = node.counter;
        h.onClick = collapseCol;
        addClass(h.th, classColShow + " col" + h.row + " colcol" + h.col + " " + classColExpanded);
        h.th.setAttribute("data-colnode", h.node);
        if (h.children.length !== 0) {
          h.th.colSpan = h.childrenSpan;
        }
        if (h.children.length === 0 && rowAttrs.length !== 0) {
          h.th.rowSpan = 2;
        }
        h.th.textContent = getHeaderText(h, colAttrs, opts.colSubtotalDisplay);
        if (h.children.length !== 0 && h.col < opts.colSubtotalDisplay.disableFrom) {
          ah.expandables++;
          ah.expandedCount += 1;
          if (!opts.colSubtotalDisplay.hideOnExpand) {
            h.th.colSpan++;
          }
          if (!opts.colSubtotalDisplay.disableExpandCollapse) {
            h.th.onclick = function(event) {
              event = event || window.event;
              return h.onClick(axisHeaders, h, opts.colSubtotalDisplay);
            };
          }
          h.sTh = createElement("th", "pvtColLabelFiller " + classColShow + " col" + h.row + " colcol" + h.col + " " + classColExpanded);
          h.sTh.setAttribute("data-colnode", h.node);
          h.sTh.rowSpan = colAttrs.length - h.col;
          if (opts.colSubtotalDisplay.hideOnExpand) {
            replaceClass(h.sTh, classColShow, classColHide);
          }
          h[h.children[0]].tr.appendChild(h.sTh);
        }
        if ((ref1 = h.parent) != null) {
          ref1.childrenSpan += h.th.colSpan;
        }
        h.clickStatus = clickStatusExpanded;
        ah.tr.appendChild(h.th);
        h.tr = ah.tr;
        attrHeaders.push(h);
        return node.counter++;
      };
      buildRowTotalsHeader = function(tr, rowAttrs, colAttrs) {
        var th;
        th = createElement("th", "pvtTotalLabel rowTotal", opts.localeStrings.totals, {
          rowspan: colAttrs.length === 0 ? 1 : colAttrs.length + (rowAttrs.length === 0 ? 0 : 1)
        });
        return tr.appendChild(th);
      };
      buildRowHeader = function(tbody, axisHeaders, attrHeaders, h, rowAttrs, colAttrs, node, opts) {
        var ah, chKey, firstChild, k, len, ref, ref1;
        ref = h.children;
        for (k = 0, len = ref.length; k < len; k++) {
          chKey = ref[k];
          buildRowHeader(tbody, axisHeaders, attrHeaders, h[chKey], rowAttrs, colAttrs, node, opts);
        }
        ah = axisHeaders.ah[h.col];
        ah.attrHeaders.push(h);
        h.node = node.counter;
        h.onClick = collapseRow;
        if (h.children.length !== 0) {
          firstChild = h[h.children[0]];
        }
        addClass(h.th, classRowShow + " row" + h.row + " rowcol" + h.col + " " + classRowExpanded);
        h.th.setAttribute("data-rownode", h.node);
        if (h.col === rowAttrs.length - 1 && colAttrs.length !== 0) {
          h.th.colSpan = 2;
        }
        if (h.children.length !== 0) {
          h.th.rowSpan = h.childrenSpan;
        }
        h.th.textContent = getHeaderText(h, rowAttrs, opts.rowSubtotalDisplay);
        h.tr = createElement("tr", "row" + h.row);
        h.tr.appendChild(h.th);
        if (h.children.length === 0) {
          tbody.appendChild(h.tr);
        } else {
          tbody.insertBefore(h.tr, firstChild.tr);
        }
        if (h.children.length !== 0 && h.col < opts.rowSubtotalDisplay.disableFrom) {
          ++ah.expandedCount;
          ++ah.expandables;
          if (!opts.rowSubtotalDisplay.disableExpandCollapse) {
            h.th.onclick = function(event) {
              event = event || window.event;
              return h.onClick(axisHeaders, h, opts.rowSubtotalDisplay);
            };
          }
          h.sTh = createElement("th", "pvtRowLabelFiller row" + h.row + " rowcol" + h.col + " " + classRowExpanded + " " + classRowShow);
          if (opts.rowSubtotalDisplay.hideOnExpand) {
            replaceClass(h.sTh, classRowShow, classRowHide);
          }
          h.sTh.setAttribute("data-rownode", h.node);
          h.sTh.colSpan = rowAttrs.length - (h.col + 1) + (colAttrs.length !== 0 ? 1 : 0);
          if (opts.rowSubtotalDisplay.displayOnTop) {
            h.tr.appendChild(h.sTh);
          } else {
            h.th.rowSpan += 1;
            h.sTr = createElement("tr", "row" + h.row);
            h.sTr.appendChild(h.sTh);
            tbody.appendChild(h.sTr);
          }
        }
        if (h.children.length !== 0) {
          h.th.rowSpan++;
        }
        if ((ref1 = h.parent) != null) {
          ref1.childrenSpan += h.th.rowSpan;
        }
        h.clickStatus = clickStatusExpanded;
        attrHeaders.push(h);
        return node.counter++;
      };
      getTableEventHandlers = function(value, rowKey, colKey, rowAttrs, colAttrs, opts) {
        var attr, event, eventHandlers, filters, handler, i, ref, ref1;
        if (!((ref = opts.table) != null ? ref.eventHandlers : void 0)) {
          return;
        }
        eventHandlers = {};
        ref1 = opts.table.eventHandlers;
        for (event in ref1) {
          if (!hasProp.call(ref1, event)) continue;
          handler = ref1[event];
          filters = {};
          for (i in colAttrs) {
            if (!hasProp.call(colAttrs, i)) continue;
            attr = colAttrs[i];
            if (colKey[i] != null) {
              filters[attr] = colKey[i];
            }
          }
          for (i in rowAttrs) {
            if (!hasProp.call(rowAttrs, i)) continue;
            attr = rowAttrs[i];
            if (rowKey[i] != null) {
              filters[attr] = rowKey[i];
            }
          }
          eventHandlers[event] = function(e) {
            return handler(e, value, filters, pivotData);
          };
        }
        return eventHandlers;
      };
      buildValues = function(tbody, colAttrHeaders, rowAttrHeaders, rowAttrs, colAttrs, opts) {
        var aggregator, ch, cls, k, l, len, len1, rCls, ref, results, rh, td, totalAggregator, tr, val;
        results = [];
        for (k = 0, len = rowAttrHeaders.length; k < len; k++) {
          rh = rowAttrHeaders[k];
          if (!(rh.col === rowAttrs.length - 1 || (rh.children.length !== 0 && rh.col < opts.rowSubtotalDisplay.disableFrom))) {
            continue;
          }
          rCls = "pvtVal row" + rh.row + " rowcol" + rh.col + " " + classRowExpanded;
          if (rh.children.length > 0) {
            rCls += " pvtRowSubtotal";
            rCls += opts.rowSubtotalDisplay.hideOnExpand ? " " + classRowHide : "  " + classRowShow;
          } else {
            rCls += " " + classRowShow;
          }
          tr = rh.sTr ? rh.sTr : rh.tr;
          for (l = 0, len1 = colAttrHeaders.length; l < len1; l++) {
            ch = colAttrHeaders[l];
            if (!(ch.col === colAttrs.length - 1 || (ch.children.length !== 0 && ch.col < opts.colSubtotalDisplay.disableFrom))) {
              continue;
            }
            aggregator = (ref = tree[rh.flatKey][ch.flatKey]) != null ? ref : {
              value: (function() {
                return null;
              }),
              format: function() {
                return "";
              }
            };
            val = aggregator.value();
            cls = " " + rCls + " col" + ch.row + " colcol" + ch.col + " " + classColExpanded;
            if (ch.children.length > 0) {
              cls += " pvtColSubtotal";
              cls += opts.colSubtotalDisplay.hideOnExpand ? " " + classColHide : " " + classColShow;
            } else {
              cls += " " + classColShow;
            }
            td = createElement("td", cls, aggregator.format(val), {
              "data-value": val,
              "data-rownode": rh.node,
              "data-colnode": ch.node
            }, getTableEventHandlers(val, rh.key, ch.key, rowAttrs, colAttrs, opts));
            tr.appendChild(td);
          }
          totalAggregator = rowTotals[rh.flatKey];
          val = totalAggregator.value();
          td = createElement("td", "pvtTotal rowTotal " + rCls, totalAggregator.format(val), {
            "data-value": val,
            "data-row": "row" + rh.row,
            "data-rowcol": "col" + rh.col,
            "data-rownode": rh.node
          });
          getTableEventHandlers(val, rh.key, [], rowAttrs, colAttrs, opts);
          results.push(tr.appendChild(td));
        }
        return results;
      };
      buildColTotalsHeader = function(rowAttrs, colAttrs) {
        var colspan, th, tr;
        tr = createElement("tr");
        colspan = rowAttrs.length + (colAttrs.length === 0 ? 0 : 1);
        th = createElement("th", "pvtTotalLabel colTotal", opts.localeStrings.totals, {
          colspan: colspan
        });
        tr.appendChild(th);
        return tr;
      };
      buildColTotals = function(tr, attrHeaders, rowAttrs, colAttrs, opts) {
        var clsNames, h, k, len, results, td, totalAggregator, val;
        results = [];
        for (k = 0, len = attrHeaders.length; k < len; k++) {
          h = attrHeaders[k];
          if (!(h.col === colAttrs.length - 1 || (h.children.length !== 0 && h.col < opts.colSubtotalDisplay.disableFrom))) {
            continue;
          }
          clsNames = "pvtVal pvtTotal colTotal " + classColExpanded + " col" + h.row + " colcol" + h.col;
          if (h.children.length !== 0) {
            clsNames += " pvtColSubtotal";
            clsNames += opts.colSubtotalDisplay.hideOnExpand ? " " + classColHide : " " + classColShow;
          } else {
            clsNames += " " + classColShow;
          }
          totalAggregator = colTotals[h.flatKey];
          val = totalAggregator.value();
          td = createElement("td", clsNames, totalAggregator.format(val), {
            "data-value": val,
            "data-for": "col" + h.col,
            "data-colnode": "" + h.node
          }, getTableEventHandlers(val, [], h.key, rowAttrs, colAttrs, opts));
          results.push(tr.appendChild(td));
        }
        return results;
      };
      buildGrandTotal = function(tbody, tr, rowAttrs, colAttrs, opts) {
        var td, totalAggregator, val;
        totalAggregator = allTotal;
        val = totalAggregator.value();
        td = createElement("td", "pvtGrandTotal", totalAggregator.format(val), {
          "data-value": val
        }, getTableEventHandlers(val, [], [], rowAttrs, colAttrs, opts));
        tr.appendChild(td);
        return tbody.appendChild(tr);
      };
      collapseAxisHeaders = function(axisHeaders, col, opts) {
        var ah, collapsible, i, k, ref, ref1, results;
        collapsible = Math.min(axisHeaders.ah.length - 2, opts.disableFrom - 1);
        if (col > collapsible) {
          return;
        }
        results = [];
        for (i = k = ref = col, ref1 = collapsible; ref <= ref1 ? k <= ref1 : k >= ref1; i = ref <= ref1 ? ++k : --k) {
          ah = axisHeaders.ah[i];
          replaceClass(ah.th, classExpanded, classCollapsed);
          ah.th.textContent = " " + arrowCollapsed + " " + ah.text;
          ah.clickStatus = clickStatusCollapsed;
          results.push(ah.onClick = expandAxis);
        }
        return results;
      };
      adjustAxisHeader = function(axisHeaders, col, opts) {
        var ah;
        ah = axisHeaders.ah[col];
        if (ah.expandedCount === 0) {
          return collapseAxisHeaders(axisHeaders, col, opts);
        } else if (ah.expandedCount === ah.expandables) {
          replaceClass(ah.th, classCollapsed, classExpanded);
          ah.th.textContent = " " + arrowExpanded + " " + ah.text;
          ah.clickStatus = clickStatusExpanded;
          return ah.onClick = collapseAxis;
        }
      };
      hideChildCol = function(ch) {
        return $(ch.th).closest('table.pvtTable').find("tbody tr td[data-colnode=\"" + ch.node + "\"], th[data-colnode=\"" + ch.node + "\"]").removeClass(classColShow).addClass(classColHide);
      };
      collapseHiddenColSubtotal = function(h, opts) {
        $(h.th).closest('table.pvtTable').find("tbody tr td[data-colnode=\"" + h.node + "\"], th[data-colnode=\"" + h.node + "\"]").removeClass(classColExpanded).addClass(classColCollapsed);
        if (h.children.length !== 0) {
          h.th.textContent = " " + arrowCollapsed + " " + h.text;
        }
        return h.th.colSpan = 1;
      };
      collapseShowColSubtotal = function(h, opts) {
        $(h.th).closest('table.pvtTable').find("tbody tr td[data-colnode=\"" + h.node + "\"], th[data-colnode=\"" + h.node + "\"]").removeClass(classColExpanded).addClass(classColCollapsed).removeClass(classColHide).addClass(classColShow);
        if (h.children.length !== 0) {
          h.th.textContent = " " + arrowCollapsed + " " + h.text;
        }
        return h.th.colSpan = 1;
      };
      collapseChildCol = function(ch, h) {
        var chKey, k, len, ref;
        ref = ch.children;
        for (k = 0, len = ref.length; k < len; k++) {
          chKey = ref[k];
          if (hasClass(ch[chKey].th, classColShow)) {
            collapseChildCol(ch[chKey], h);
          }
        }
        return hideChildCol(ch);
      };
      collapseCol = function(axisHeaders, h, opts) {
        var chKey, colSpan, k, len, p, ref;
        colSpan = h.th.colSpan - 1;
        ref = h.children;
        for (k = 0, len = ref.length; k < len; k++) {
          chKey = ref[k];
          if (hasClass(h[chKey].th, classColShow)) {
            collapseChildCol(h[chKey], h);
          }
        }
        if (h.col < opts.disableFrom) {
          if (hasClass(h.th, classColHide)) {
            collapseHiddenColSubtotal(h, opts);
          } else {
            collapseShowColSubtotal(h, opts);
          }
        }
        p = h.parent;
        while (p) {
          p.th.colSpan -= colSpan;
          p = p.parent;
        }
        h.clickStatus = clickStatusCollapsed;
        h.onClick = expandCol;
        axisHeaders.ah[h.col].expandedCount--;
        return adjustAxisHeader(axisHeaders, h.col, opts);
      };
      showChildCol = function(ch) {
        return $(ch.th).closest('table.pvtTable').find("tbody tr td[data-colnode=\"" + ch.node + "\"], th[data-colnode=\"" + ch.node + "\"]").removeClass(classColHide).addClass(classColShow);
      };
      expandHideColSubtotal = function(h) {
        $(h.th).closest('table.pvtTable').find("tbody tr td[data-colnode=\"" + h.node + "\"], th[data-colnode=\"" + h.node + "\"]").removeClass(classColCollapsed + " " + classColShow).addClass(classColExpanded + " " + classColHide);
        replaceClass(h.th, classColHide, classColShow);
        return h.th.textContent = " " + arrowExpanded + " " + h.text;
      };
      expandShowColSubtotal = function(h) {
        $(h.th).closest('table.pvtTable').find("tbody tr td[data-colnode=\"" + h.node + "\"], th[data-colnode=\"" + h.node + "\"]").removeClass(classColCollapsed + " " + classColHide).addClass(classColExpanded + " " + classColShow);
        h.th.colSpan++;
        return h.th.textContent = " " + arrowExpanded + " " + h.text;
      };
      expandChildCol = function(ch, opts) {
        var chKey, k, len, ref, results;
        if (ch.children.length !== 0 && opts.hideOnExpand && ch.clickStatus === clickStatusExpanded) {
          replaceClass(ch.th, classColHide, classColShow);
        } else {
          showChildCol(ch);
        }
        if (ch.sTh && ch.clickStatus === clickStatusExpanded && opts.hideOnExpand) {
          replaceClass(ch.sTh, classColShow, classColHide);
        }
        if (ch.clickStatus === clickStatusExpanded || ch.col >= opts.disableFrom) {
          ref = ch.children;
          results = [];
          for (k = 0, len = ref.length; k < len; k++) {
            chKey = ref[k];
            results.push(expandChildCol(ch[chKey], opts));
          }
          return results;
        }
      };
      expandCol = function(axisHeaders, h, opts) {
        var ch, chKey, colSpan, k, len, p, ref;
        if (h.clickStatus === clickStatusExpanded) {
          adjustAxisHeader(axisHeaders, h.col, opts);
          return;
        }
        colSpan = 0;
        ref = h.children;
        for (k = 0, len = ref.length; k < len; k++) {
          chKey = ref[k];
          ch = h[chKey];
          expandChildCol(ch, opts);
          colSpan += ch.th.colSpan;
        }
        h.th.colSpan = colSpan;
        if (h.col < opts.disableFrom) {
          if (opts.hideOnExpand) {
            expandHideColSubtotal(h);
            --colSpan;
          } else {
            expandShowColSubtotal(h);
          }
        }
        p = h.parent;
        while (p) {
          p.th.colSpan += colSpan;
          p = p.parent;
        }
        h.clickStatus = clickStatusExpanded;
        h.onClick = collapseCol;
        axisHeaders.ah[h.col].expandedCount++;
        return adjustAxisHeader(axisHeaders, h.col, opts);
      };
      hideChildRow = function(ch, opts) {
        var cell, k, l, len, len1, ref, ref1, results;
        ref = ch.tr.querySelectorAll("th, td");
        for (k = 0, len = ref.length; k < len; k++) {
          cell = ref[k];
          replaceClass(cell, classRowShow, classRowHide);
        }
        if (ch.sTr) {
          ref1 = ch.sTr.querySelectorAll("th, td");
          results = [];
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            cell = ref1[l];
            results.push(replaceClass(cell, classRowShow, classRowHide));
          }
          return results;
        }
      };
      collapseShowRowSubtotal = function(h, opts) {
        var cell, k, l, len, len1, ref, ref1, results;
        h.th.textContent = " " + arrowCollapsed + " " + h.text;
        ref = h.tr.querySelectorAll("th, td");
        for (k = 0, len = ref.length; k < len; k++) {
          cell = ref[k];
          removeClass(cell, classRowExpanded + " " + classRowHide);
          addClass(cell, classRowCollapsed + " " + classRowShow);
        }
        if (h.sTr) {
          ref1 = h.sTr.querySelectorAll("th, td");
          results = [];
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            cell = ref1[l];
            removeClass(cell, classRowExpanded + " " + classRowHide);
            results.push(addClass(cell, classRowCollapsed + " " + classRowShow));
          }
          return results;
        }
      };
      collapseChildRow = function(ch, h, opts) {
        var chKey, k, len, ref;
        ref = ch.children;
        for (k = 0, len = ref.length; k < len; k++) {
          chKey = ref[k];
          collapseChildRow(ch[chKey], h, opts);
        }
        return hideChildRow(ch, opts);
      };
      collapseRow = function(axisHeaders, h, opts) {
        var chKey, k, len, ref;
        ref = h.children;
        for (k = 0, len = ref.length; k < len; k++) {
          chKey = ref[k];
          collapseChildRow(h[chKey], h, opts);
        }
        collapseShowRowSubtotal(h, opts);
        h.clickStatus = clickStatusCollapsed;
        h.onClick = expandRow;
        axisHeaders.ah[h.col].expandedCount--;
        return adjustAxisHeader(axisHeaders, h.col, opts);
      };
      showChildRow = function(ch, opts) {
        var cell, k, l, len, len1, ref, ref1, results;
        ref = ch.tr.querySelectorAll("th, td");
        for (k = 0, len = ref.length; k < len; k++) {
          cell = ref[k];
          replaceClass(cell, classRowHide, classRowShow);
        }
        if (ch.sTr) {
          ref1 = ch.sTr.querySelectorAll("th, td");
          results = [];
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            cell = ref1[l];
            results.push(replaceClass(cell, classRowHide, classRowShow));
          }
          return results;
        }
      };
      expandShowRowSubtotal = function(h, opts) {
        var cell, k, l, len, len1, ref, ref1, results;
        h.th.textContent = " " + arrowExpanded + " " + h.text;
        ref = h.tr.querySelectorAll("th, td");
        for (k = 0, len = ref.length; k < len; k++) {
          cell = ref[k];
          removeClass(cell, classRowCollapsed + " " + classRowHide);
          addClass(cell, classRowExpanded + " " + classRowShow);
        }
        if (h.sTr) {
          ref1 = h.sTr.querySelectorAll("th, td");
          results = [];
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            cell = ref1[l];
            removeClass(cell, classRowCollapsed + " " + classRowHide);
            results.push(addClass(cell, classRowExpanded + " " + classRowShow));
          }
          return results;
        }
      };
      expandHideRowSubtotal = function(h, opts) {
        var cell, k, l, len, len1, ref, ref1, results;
        h.th.textContent = " " + arrowExpanded + " " + h.text;
        ref = h.tr.querySelectorAll("th, td");
        for (k = 0, len = ref.length; k < len; k++) {
          cell = ref[k];
          removeClass(cell, classRowCollapsed + " " + classRowShow);
          addClass(cell, classRowExpanded + " " + classRowHide);
        }
        removeClass(h.th, classRowCollapsed + " " + classRowHide);
        addClass(cell, classRowExpanded + " " + classRowShow);
        if (h.sTr) {
          ref1 = h.sTr.querySelectorAll("th, td");
          results = [];
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            cell = ref1[l];
            removeClass(cell, classRowCollapsed + " " + classRowShow);
            results.push(addClass(cell, classRowExpanded + " " + classRowHide));
          }
          return results;
        }
      };
      expandChildRow = function(ch, opts) {
        var chKey, k, len, ref, results;
        if (ch.children.length !== 0 && opts.hideOnExpand && ch.clickStatus === clickStatusExpanded) {
          replaceClass(ch.th, classRowHide, classRowShow);
        } else {
          showChildRow(ch, opts);
        }
        if (ch.sTh && ch.clickStatus === clickStatusExpanded && opts.hideOnExpand) {
          replaceClass(ch.sTh, classRowShow, classRowHide);
        }
        if (ch.clickStatus === clickStatusExpanded || ch.col >= opts.disableFrom) {
          ref = ch.children;
          results = [];
          for (k = 0, len = ref.length; k < len; k++) {
            chKey = ref[k];
            results.push(expandChildRow(ch[chKey], opts));
          }
          return results;
        }
      };
      expandRow = function(axisHeaders, h, opts) {
        var ch, chKey, k, len, ref;
        if (h.clickStatus === clickStatusExpanded) {
          adjustAxisHeader(axisHeaders, h.col, opts);
          return;
        }
        ref = h.children;
        for (k = 0, len = ref.length; k < len; k++) {
          chKey = ref[k];
          ch = h[chKey];
          expandChildRow(ch, opts);
        }
        if (h.children.length !== 0) {
          if (opts.hideOnExpand) {
            expandHideRowSubtotal(h, opts);
          } else {
            expandShowRowSubtotal(h, opts);
          }
        }
        h.clickStatus = clickStatusExpanded;
        h.onClick = collapseRow;
        axisHeaders.ah[h.col].expandedCount++;
        return adjustAxisHeader(axisHeaders, h.col, opts);
      };
      collapseAxis = function(axisHeaders, col, attrs, opts) {
        var collapsible, h, i, k, ref, ref1, results;
        collapsible = Math.min(attrs.length - 2, opts.disableFrom - 1);
        if (col > collapsible) {
          return;
        }
        results = [];
        for (i = k = ref = collapsible, ref1 = col; k >= ref1; i = k += -1) {
          results.push((function() {
            var l, len, ref2, results1;
            ref2 = axisHeaders.ah[i].attrHeaders;
            results1 = [];
            for (l = 0, len = ref2.length; l < len; l++) {
              h = ref2[l];
              if (h.clickStatus === clickStatusExpanded && h.children.length !== 0) {
                results1.push(axisHeaders.collapseAttrHeader(axisHeaders, h, opts));
              }
            }
            return results1;
          })());
        }
        return results;
      };
      expandAxis = function(axisHeaders, col, attrs, opts) {
        var ah, h, i, k, ref, results;
        ah = axisHeaders.ah[col];
        results = [];
        for (i = k = 0, ref = col; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
          results.push((function() {
            var l, len, ref1, results1;
            ref1 = axisHeaders.ah[i].attrHeaders;
            results1 = [];
            for (l = 0, len = ref1.length; l < len; l++) {
              h = ref1[l];
              results1.push(axisHeaders.expandAttrHeader(axisHeaders, h, opts));
            }
            return results1;
          })());
        }
        return results;
      };
      main = function(rowAttrs, rowKeys, colAttrs, colKeys) {
        var chKey, colAttrHeaders, colAxisHeaders, colKeyHeaders, k, l, len, len1, node, ref, ref1, result, rowAttrHeaders, rowAxisHeaders, rowKeyHeaders, tbody, thead, tr;
        rowAttrHeaders = [];
        colAttrHeaders = [];
        if (colAttrs.length !== 0 && colKeys.length !== 0) {
          colKeyHeaders = processKeys(colKeys, "pvtColLabel");
        }
        if (rowAttrs.length !== 0 && rowKeys.length !== 0) {
          rowKeyHeaders = processKeys(rowKeys, "pvtRowLabel");
        }
        result = createElement("table", "pvtTable", null, {
          style: "display: none;"
        });
        thead = createElement("thead");
        result.appendChild(thead);
        if (colAttrs.length !== 0) {
          colAxisHeaders = buildColAxisHeaders(thead, rowAttrs, colAttrs, opts);
          node = {
            counter: 0
          };
          ref = colKeyHeaders.children;
          for (k = 0, len = ref.length; k < len; k++) {
            chKey = ref[k];
            buildColHeader(colAxisHeaders, colAttrHeaders, colKeyHeaders[chKey], rowAttrs, colAttrs, node, opts);
          }
          buildRowTotalsHeader(colAxisHeaders.ah[0].tr, rowAttrs, colAttrs);
        }
        tbody = createElement("tbody");
        result.appendChild(tbody);
        if (rowAttrs.length !== 0) {
          rowAxisHeaders = buildRowAxisHeaders(thead, rowAttrs, colAttrs, opts);
          if (colAttrs.length === 0) {
            buildRowTotalsHeader(rowAxisHeaders.tr, rowAttrs, colAttrs);
          }
          node = {
            counter: 0
          };
          ref1 = rowKeyHeaders.children;
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            chKey = ref1[l];
            buildRowHeader(tbody, rowAxisHeaders, rowAttrHeaders, rowKeyHeaders[chKey], rowAttrs, colAttrs, node, opts);
          }
        }
        buildValues(tbody, colAttrHeaders, rowAttrHeaders, rowAttrs, colAttrs, opts);
        tr = buildColTotalsHeader(rowAttrs, colAttrs);
        if (colAttrs.length > 0) {
          buildColTotals(tr, colAttrHeaders, rowAttrs, colAttrs, opts);
        }
        buildGrandTotal(tbody, tr, rowAttrs, colAttrs, opts);
        collapseAxis(colAxisHeaders, opts.colSubtotalDisplay.collapseAt, colAttrs, opts.colSubtotalDisplay);
        collapseAxis(rowAxisHeaders, opts.rowSubtotalDisplay.collapseAt, rowAttrs, opts.rowSubtotalDisplay);
        result.setAttribute("data-numrows", rowKeys.length);
        result.setAttribute("data-numcols", colKeys.length);
        result.style.display = "";
        return result;
      };
      return main(rowAttrs, rowKeys, colAttrs, colKeys);
    };
    $.pivotUtilities.subtotal_renderers = {
      "Table With Subtotal": function(pvtData, opts) {
        return SubtotalRenderer(pvtData, opts);
      },
      "Table With Subtotal Bar Chart": function(pvtData, opts) {
        return $(SubtotalRenderer(pvtData, opts)).barchart();
      },
      "Table With Subtotal Heatmap": function(pvtData, opts) {
        return $(SubtotalRenderer(pvtData, opts)).heatmap("heatmap", opts);
      },
      "Table With Subtotal Row Heatmap": function(pvtData, opts) {
        return $(SubtotalRenderer(pvtData, opts)).heatmap("rowheatmap", opts);
      },
      "Table With Subtotal Col Heatmap": function(pvtData, opts) {
        return $(SubtotalRenderer(pvtData, opts)).heatmap("colheatmap", opts);
      }
    };
    usFmtPct = $.pivotUtilities.numberFormat({
      digitsAfterDecimal: 1,
      scaler: 100,
      suffix: "%"
    });
    aggregatorTemplates = $.pivotUtilities.aggregatorTemplates;
    subtotalAggregatorTemplates = {
      fractionOf: function(wrapped, type, formatter) {
        if (type == null) {
          type = "row";
        }
        if (formatter == null) {
          formatter = usFmtPct;
        }
        return function() {
          var x;
          x = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return function(data, rowKey, colKey) {
            if (typeof rowKey === "undefined") {
              rowKey = [];
            }
            if (typeof colKey === "undefined") {
              colKey = [];
            }
            return {
              selector: {
                row: [rowKey.slice(0, -1), []],
                col: [[], colKey.slice(0, -1)]
              }[type],
              inner: wrapped.apply(null, x)(data, rowKey, colKey),
              push: function(record) {
                return this.inner.push(record);
              },
              format: formatter,
              value: function() {
                return this.inner.value() / data.getAggregator.apply(data, this.selector).inner.value();
              },
              numInputs: wrapped.apply(null, x)().numInputs
            };
          };
        };
      }
    };
    $.pivotUtilities.subtotalAggregatorTemplates = subtotalAggregatorTemplates;
    return $.pivotUtilities.subtotal_aggregators = (function(tpl, sTpl) {
      return {
        "Sum As Fraction Of Parent Row": sTpl.fractionOf(tpl.sum(), "row", usFmtPct),
        "Sum As Fraction Of Parent Column": sTpl.fractionOf(tpl.sum(), "col", usFmtPct),
        "Count As Fraction Of Parent Row": sTpl.fractionOf(tpl.count(), "row", usFmtPct),
        "Count As Fraction Of Parent Column": sTpl.fractionOf(tpl.count(), "col", usFmtPct)
      };
    })(aggregatorTemplates, subtotalAggregatorTemplates);
  });

}).call(this);

//# sourceMappingURL=subtotal.js.map

;
//# sourceMappingURL=scripts.js.map