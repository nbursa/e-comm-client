import{api as n}from"./axios-DEl2N9Wm.js";import{ay as c,q as i,az as t}from"./index-Dxq9tPsp.js";const g="https://api.exchangerate-api.com/v4/latest/",l=24*60*60*1e3,R=c("rates",()=>{const e=i({});return{exchangeRates:e,loadExchangeRates:async(a="EUR")=>{const s=t.get("exchange_rates");if(s&&!t.isExpired("exchange_rates")){e.value=s;return}try{const o=(await n.get(`${g}${a}`)).data;e.value=o.rates,t.set("exchange_rates",e.value,{expiration:l,version:"1.0"})}catch(r){console.error("Failed to load exchange rates:",r)}},getRate:a=>e.value[a]||1}});export{R as u};
