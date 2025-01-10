import{c as j,l as v,h as I,g as P,S as V,W as A,V as L,X as N,Y as D,Z as w,_ as Q,$ as e,aa as u,a8 as b,a1 as t,Q as F,a0 as c,a6 as l,ah as f,ab as G,a9 as R,a3 as z,a7 as E,ad as _,ae as r,af as i,ac as M,ag as O,a2 as T,ai as B}from"./index-DcyqwVvW.js";import{Q as U}from"./QImg-BBScqgRs.js";import{Q as W}from"./QPage-BYl8AXng.js";const X=j({name:"QBtnGroup",props:{unelevated:Boolean,outline:Boolean,flat:Boolean,rounded:Boolean,square:Boolean,push:Boolean,stretch:Boolean,glossy:Boolean,spread:Boolean},setup(g,{slots:o}){const d=v(()=>{const m=["unelevated","outline","flat","rounded","square","push","stretch","glossy"].filter(n=>g[n]===!0).map(n=>`q-btn-group--${n}`).join(" ");return`q-btn-group row no-wrap${m.length!==0?" "+m:""}`+(g.spread===!0?" q-btn-group--spread":" inline")});return()=>I("div",{class:d.value},P(o.default))}}),Y={key:0,class:"text-center q-pa-xl"},Z=["color"],H={key:1,class:"tw-container tw-max-w-screen-xl tw-mx-auto"},J={class:"row q-col-gutter-lg"},K={class:"col-12 col-md-8 tw-space-y-4"},tt={class:"tw-flex tw-flex-col tw-flex-grow tw-items-center tw-gap-2 md:tw-text-left"},et={class:"tw-flex tw-items-center tw-h-full"},at={class:"text-subtitle1 text-weight-bold mobile-price"},lt={class:"col-12 col-md-4"},st={class:"tw-text-xl tw-mb-4"},ot={class:"text-subtitle1 text-weight-bold"},ct={class:"text-subtitle1 text-weight-bold"},dt=V({__name:"ShoppingCart",setup(g){const o=A(),d=L(),m=N(),{t:n}=D(),C="https://fakestoreapi.com",p=v(()=>d.dark.isActive?"white":"black"),y=v(()=>d.dark.isActive?"black":"white"),h=a=>`$${a.toFixed(2)}`,k=(a,x)=>{x<1||o.updateQuantity(a,x)},q=()=>{o.items.length&&m.push("/checkout")},S=a=>{d.dialog({class:"custom-dialog",title:n("cart.confirmDelete"),message:n("cart.deleteMessage"),cancel:{color:"grey",flat:!0,label:n("cart.cancel")},ok:{color:"negative",flat:!0,label:n("cart.delete")},persistent:!0}).onOk(()=>{o.removeItem(a),d.notify({color:"positive",message:n("cart.itemRemoved"),icon:"delete",position:"top"})})};return(a,x)=>(w(),Q(W,{padding:""},{default:e(()=>[u(o).items.length===0?(w(),b("div",Y,[t(F,{name:"shopping_cart",size:"6rem",color:p.value},null,8,["color"]),c("h5",{class:"q-mb-md",color:p.value},l(a.$t("cart.emptyCart")),9,Z),t(f,{to:"/products",color:p.value,"text-color":y.value,label:a.$t("cart.continue")},null,8,["color","text-color","label"])])):(w(),b("div",H,[c("div",J,[c("div",K,[(w(!0),b(G,null,R(u(o).items,s=>(w(),Q(_,{key:s.id,class:"tw-flex tw-flex-col md:tw-flex-row md:!tw-justify-end !tw-gap-3 tw-p-3 !tw-bg-grey-1 tw-rounded-lg tw-shadow-md"},{default:e(()=>[t(r,{class:"tw-w-full md:tw-w-32 !tw-flex-shrink-0"},{default:e(()=>[t(U,{src:`${u(C)}${s.image}`,ratio:1,class:"tw-w-full",fit:"contain"},null,8,["src"])]),_:2},1024),t(r,{class:"tw-flex-1 tw-min-w-0 md:tw-flex md:!tw-flex-col md:!tw-justify-between"},{default:e(()=>[t(B,{class:"text-subtitle2 text-weight-medium tw-truncate"},{default:e(()=>[i(l(s.name||s.title),1)]),_:2},1024),t(B,{caption:"",class:"!tw-text-xs"},{default:e(()=>[i(l(h(s.price))+" "+l(a.$t("cart.each")),1)]),_:2},1024),c("div",tt,[c("div",et,[t(X,{flat:"",class:""},{default:e(()=>[t(f,{flat:"",dense:"",icon:"remove",onClick:$=>k(s.id,s.quantity-1)},null,8,["onClick"]),t(f,{flat:"",dense:"",class:"text-weight-bold"},{default:e(()=>[i(l(s.quantity),1)]),_:2},1024),t(f,{flat:"",dense:"",icon:"add",onClick:$=>k(s.id,s.quantity+1)},null,8,["onClick"])]),_:2},1024)]),c("div",at,l(a.$t("cart.total"))+": "+l(h(s.price*s.quantity)),1)])]),_:2},1024),t(r,{class:"!tw-flex-shrink-0 tw-flex tw-items-center tw-justify-center md:!tw-max-w-[60px] md:tw-ml-4"},{default:e(()=>[t(f,{flat:"",round:"",rectangle:"",color:"negative",icon:"delete",onClick:$=>S(s.id)},null,8,["onClick"])]),_:2},1024)]),_:2},1024))),128))]),c("div",lt,[t(T,{class:"tw-flex tw-justify-between"},{default:e(()=>[t(z,{class:"tw-w-full"},{default:e(()=>[c("div",st,l(a.$t("cart.orderSummary")),1),t(E,{dense:"",class:"tw-w-full tw-flex tw-flex-col tw-justify-between"},{default:e(()=>[t(_,{class:"tw-justify-between"},{default:e(()=>[t(r,null,{default:e(()=>[i(l(a.$t("cart.items"))+" ("+l(u(o).totalItems)+")",1)]),_:1}),t(r,{side:""},{default:e(()=>[i(l(h(u(o).totalPrice)),1)]),_:1})]),_:1}),t(_,{class:"tw-justify-between"},{default:e(()=>[t(r,null,{default:e(()=>[i(l(a.$t("cart.shipping")),1)]),_:1}),t(r,{side:""},{default:e(()=>[i(l(a.$t("cart.free")),1)]),_:1})]),_:1}),t(M,{class:"q-my-md"}),t(_,{class:"tw-justify-between"},{default:e(()=>[t(r,null,{default:e(()=>[c("span",ot,l(a.$t("cart.total")),1)]),_:1}),t(r,{side:""},{default:e(()=>[c("span",ct,l(h(u(o).totalPrice)),1)]),_:1})]),_:1})]),_:1})]),_:1}),t(O,{align:"center"},{default:e(()=>[t(f,{color:p.value,"text-color":y.value,label:a.$t("cart.checkout"),class:"full-width",onClick:q},null,8,["color","text-color","label"])]),_:1})]),_:1})])])]))]),_:1}))}});export{dt as default};
