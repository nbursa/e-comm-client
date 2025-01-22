import{q as D,c as v,x as N,W as V,d as z,Y as A,am as L,al as R,an as U,ac as F,a8 as G,o as p,a as j,w as e,h as o,t as s,j as n,k as g,e as t,z as M,m as h,F as O,r as E,f as H,n as i,ah as c,aj as W,aq as q,ad as u,ag as _,ap as Y,ar as J,l as K,Q as X,aU as Z,_ as tt}from"./index-C5YdPelo.js";import{Q as et}from"./QImg-H-WihV-P.js";import{Q as at}from"./QPage-Bca29qbV.js";import{f as b}from"./currency-BDqL5jDB.js";import"./rates-ChCCUG2K.js";import"./axios-DLM_JtLB.js";const st=D({name:"QBtnGroup",props:{unelevated:Boolean,outline:Boolean,flat:Boolean,rounded:Boolean,square:Boolean,push:Boolean,stretch:Boolean,glossy:Boolean,spread:Boolean},setup(y,{slots:k}){const r=v(()=>{const d=["unelevated","outline","flat","rounded","square","push","stretch","glossy"].filter(m=>y[m]===!0).map(m=>`q-btn-group--${m}`).join(" ");return`q-btn-group row no-wrap${d.length!==0?" "+d:""}`+(y.spread===!0?" q-btn-group--spread":" inline")});return()=>N("div",{class:r.value},V(k.default))}}),lt={class:"tw-text-3xl tw-mt-4 tw-font-semibold tw-font-serif tw-my-4 tw-text-left md:tw-text-center tw-mb-8"},ot={key:0,class:"tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-screen -tw-mt-32"},rt=["color"],nt={key:1,class:"tw-max-w-screen-xl tw-mx-auto tw-flex tw-justify-between !tw-py-4"},ct={class:"tw-w-full tw-flex tw-flex-col tw-items-start tw-justify-center !tw-mx-auto sm:tw-flex-row sm:tw-gap-4"},wt={class:"tw-flex !tw-flex-col tw-w-full sm:tw-flex-row sm:tw-w-1/2 md:tw-w-2/3 tw-space-y-4 tw-mx-auto sm:tw-mx-0 sm:tw-max-w-md"},it={class:"tw-flex tw-flex-col tw-flex-grow tw-items-center tw-gap-2 md:tw-text-left"},ut={class:"tw-flex tw-items-center tw-py-6 tw-h-full"},dt={class:"text-subtitle1 text-weight-bold mobile-price"},mt={class:"tw-flex-col tw-w-full tw-mx-auto sm:tw-w-1/2 md:!tw-w-1/3 sm:tw-ml-4 sm:tw-mx-0 sm:tw-max-w-sm sm:tw-sticky sm:tw-top-8"},ft={class:"tw-text-xl tw-font-semibold tw-font-serif md:tw-text-2xl tw-mb-4"},pt={class:"text-subtitle1 text-weight-bold"},xt={class:"text-subtitle1 text-weight-bold"},ht=z({__name:"ShoppingCart",setup(y){const k=A("scrollToTop"),r=L(),d=R(),m=U(),{t:f}=F(),w=v(()=>d.dark.isActive),x=v(()=>w.value?"white":"dark"),Q=v(()=>w.value?"dark":"white"),I=a=>a,B=(a,C)=>{C<1||r.updateQuantity(a,C)},S=()=>{r.items.length&&m.push("/checkout")},P=a=>{m.push(`${Z}/${a}`)},T=a=>{d.dialog({class:"custom-dialog",title:f("cart.confirmDelete"),message:f("cart.deleteMessage"),cancel:{color:"grey",outline:!0,label:f("cart.cancel")},ok:{color:x.value,flat:!0,label:f("cart.delete")},persistent:!0}).onOk(()=>{r.removeItem(a),d.notify({color:"positive",timeout:1e3,message:f("cart.itemRemoved"),icon:"delete",position:"top"})})};return G(()=>{k()}),(a,C)=>(p(),j(at,{padding:"",class:"!tw-pb-16 !tw-pt-4 !tw-px-4 tw-max-w-screen-xl tw-mx-auto"},{default:e(()=>[o("h5",lt,s(a.$t("cart.shoppingCart")),1),n(r).items.length===0?(p(),g("div",ot,[t(M,{name:"shopping_cart",size:"4rem",color:x.value},null,8,["color"]),o("h5",{class:"q-mb-md",color:x.value},s(a.$t("cart.emptyCart")),9,rt),t(h,{to:"/products",color:x.value,"text-color":Q.value,label:a.$t("cart.continue")},null,8,["color","text-color","label"])])):(p(),g("div",nt,[o("div",ct,[o("div",wt,[(p(!0),g(O,null,E(n(r).items,l=>(p(),j(H,{key:l.id,flat:"",bordered:"",class:i(["tw-flex tw-flex-col md:tw-flex-row md:!tw-justify-between !tw-gap-3 tw-p-3 tw-rounded-md tw-cursor-pointer",w.value?"tw-bg-transparent text-light":"bg-light text-dark"]),onClick:$=>P(l.id)},{default:e(()=>[t(c,{class:"tw-w-full md:!tw-max-w-44 !tw-flex-shrink-1 md:tw-min-w-[50px]"},{default:e(()=>[l.image?W("",!0):(p(),g("div",{key:0,class:i(["tw-h-full tw-w-full tw-max-h-44 tw-flex tw-items-center tw-justify-center tw-rounded 0 tw-border tw-bg-transparent tw-border-gray-400",w.value?"tw-text-gray-200":"!tw-bg-gray-200"])},s(n(f)("errors.noImage")),3)),t(et,{src:`${I(l.image)}`,ratio:1,class:"tw-w-full sm:tw-h-44",fit:"contain"},null,8,["src"])]),_:2},1024),t(c,{class:"tw-flex-1 tw-min-w-0 md:tw-flex md:!tw-flex-col md:!tw-justify-between"},{default:e(()=>[t(q,{class:"text-subtitle2 text-weight-medium tw-truncate"},{default:e(()=>[u(s(l.name||l.title),1)]),_:2},1024),t(q,{caption:"",class:i(["!tw-text-xs",w.value&&"!tw-text-white"])},{default:e(()=>[u(s(n(b)(l.price))+" "+s(a.$t("cart.each")),1)]),_:2},1032,["class"]),o("div",it,[o("div",ut,[t(st,{flat:"",class:""},{default:e(()=>[t(h,{flat:"",dense:"",icon:"remove",onClick:$=>B(l.id,l.quantity-1)},null,8,["onClick"]),t(h,{flat:"",dense:"",class:"text-weight-bold"},{default:e(()=>[u(s(l.quantity),1)]),_:2},1024),t(h,{flat:"",dense:"",icon:"add",onClick:$=>B(l.id,l.quantity+1)},null,8,["onClick"])]),_:2},1024)]),o("div",dt,s(a.$t("cart.total"))+": "+s(n(b)(l.price*l.quantity)),1)])]),_:2},1024),t(c,{class:"!tw-flex-shrink-0 tw-flex tw-items-center tw-justify-center md:!tw-max-w-[60px] md:tw-ml-4"},{default:e(()=>[t(h,{flat:"",round:"",rectangle:"",color:"negative",icon:"delete",onClick:$=>T(l.id)},null,8,["onClick"])]),_:2},1024)]),_:2},1032,["class","onClick"]))),128))]),o("div",mt,[t(_,{class:i(["tw-flex tw-justify-between tw-flex-col tw-gap-4 !tw-pt-4 !tw-pb-3 !tw-px-0 tw-rounded-md sm:!tw-pt-0 tw-w-full",w.value?"tw-bg-transparent text-light":"bg-light text-dark"])},{default:e(()=>[t(c,{class:"tw-w-full"},{default:e(()=>[o("div",ft,s(a.$t("cart.orderSummary")),1),t(Y,{dense:"",class:"tw-w-full tw-flex tw-flex-col tw-justify-between"},{default:e(()=>[t(_,{class:"tw-justify-between"},{default:e(()=>[t(c,null,{default:e(()=>[u(s(a.$t("cart.items"))+" ("+s(n(r).totalItems)+")",1)]),_:1}),t(c,{side:"",class:i(w.value?"text-light":"text-dark")},{default:e(()=>[u(s(n(b)(n(r).totalPrice)),1)]),_:1},8,["class"])]),_:1}),t(_,{class:"tw-justify-between"},{default:e(()=>[t(c,null,{default:e(()=>[u(s(a.$t("cart.shipping")),1)]),_:1}),t(c,{side:"",class:i(w.value?"text-light":"text-dark")},{default:e(()=>[u(s(a.$t("cart.free")),1)]),_:1},8,["class"])]),_:1}),t(J,{class:"q-my-md"}),t(_,{class:"tw-justify-between"},{default:e(()=>[t(c,null,{default:e(()=>[o("span",pt,s(a.$t("cart.total")),1)]),_:1}),t(c,{side:"",class:i(w.value?"text-light":"text-dark")},{default:e(()=>[o("span",xt,s(n(b)(n(r).totalPrice)),1)]),_:1},8,["class"])]),_:1})]),_:1})]),_:1}),t(K,{align:"center"},{default:e(()=>[t(X,{color:x.value,"text-color":Q.value,label:a.$t("cart.checkout"),"class-name":"tw-flex-1 tw-basis-2/3 !tw-m-0",onClick:S},null,8,["color","text-color","label"])]),_:1})]),_:1},8,["class"])])])]))]),_:1}))}}),Ct=tt(ht,[["__scopeId","data-v-da05ab39"]]);export{Ct as default};
