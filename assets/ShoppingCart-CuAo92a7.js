import{c as P,l as v,h as V,g as D,S as L,I as N,ab as z,aa as A,ac as G,ad as M,e as R,U as h,V as B,W as e,$ as i,a0 as Q,X as t,Q as U,Z as c,_ as l,a4 as f,a2 as E,a1 as F,ag as n,al as O,af as x,ai as u,a5 as d,am as W,a3 as X,a6 as Z,an as q,a8 as H}from"./index-CY_Uy3Wh.js";import{f as _,Q as J}from"./currencyUtils-BtTZZk7y.js";import{Q as K}from"./QPage-D4NmoIUB.js";import"./rates-Dy13-so9.js";const Y=P({name:"QBtnGroup",props:{unelevated:Boolean,outline:Boolean,flat:Boolean,rounded:Boolean,square:Boolean,push:Boolean,stretch:Boolean,glossy:Boolean,spread:Boolean},setup(b,{slots:k}){const o=v(()=>{const w=["unelevated","outline","flat","rounded","square","push","stretch","glossy"].filter(m=>b[m]===!0).map(m=>`q-btn-group--${m}`).join(" ");return`q-btn-group row no-wrap${w.length!==0?" "+w:""}`+(b.spread===!0?" q-btn-group--spread":" inline")});return()=>V("div",{class:o.value},D(k.default))}}),tt={key:0,class:"tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-screen -tw-mt-32"},et=["color"],at={key:1,class:"tw-container tw-max-w-screen-xl tw-mx-auto"},lt={class:"row q-col-gutter-lg"},st={class:"col-12 col-md-8 tw-space-y-4"},ot={class:"tw-flex tw-flex-col tw-flex-grow tw-items-center tw-gap-2 md:tw-text-left"},ct={class:"tw-flex tw-items-center tw-h-full"},nt={class:"text-subtitle1 text-weight-bold mobile-price"},rt={class:"col-12 col-md-4"},it={class:"tw-text-xl tw-mb-4"},ut={class:"text-subtitle1 text-weight-bold"},dt={class:"text-subtitle1 text-weight-bold"},wt=L({__name:"ShoppingCart",setup(b){const k=N("scrollToTop"),o=z(),w=A(),m=G(),{t:p}=M(),r=v(()=>w.dark.isActive),g=v(()=>r.value?"white":"dark"),j=v(()=>r.value?"dark":"white"),I=a=>a,$=(a,y)=>{y<1||o.updateQuantity(a,y)},S=()=>{o.items.length&&m.push("/checkout")},T=a=>{w.dialog({class:"custom-dialog",title:p("cart.confirmDelete"),message:p("cart.deleteMessage"),cancel:{color:"grey",outline:!0,label:p("cart.cancel")},ok:{color:g.value,flat:!0,label:p("cart.delete")},persistent:!0}).onOk(()=>{o.removeItem(a),w.notify({color:"positive",timeout:1e3,message:p("cart.itemRemoved"),icon:"delete",position:"top"})})};return R(()=>{k()}),(a,y)=>(h(),B(K,{padding:""},{default:e(()=>[i(o).items.length===0?(h(),Q("div",tt,[t(U,{name:"shopping_cart",size:"4rem",color:g.value},null,8,["color"]),c("h5",{class:"q-mb-md",color:g.value},l(a.$t("cart.emptyCart")),9,et),t(f,{to:"/products",color:g.value,"text-color":j.value,label:a.$t("cart.continue")},null,8,["color","text-color","label"])])):(h(),Q("div",at,[c("div",lt,[c("div",st,[(h(!0),Q(E,null,F(i(o).items,s=>(h(),B(Z,{key:s.id,flat:"",bordered:"",class:d(["tw-flex tw-flex-col md:tw-flex-row md:!tw-justify-between !tw-gap-3 tw-p-3 tw-rounded-md",r.value?"tw-bg-transparent text-light":"bg-light text-dark"])},{default:e(()=>[t(n,{class:"tw-w-full md:!tw-max-w-44 !tw-flex-shrink-1 md:tw-min-w-[50px]"},{default:e(()=>[t(J,{src:`${I(s.image)}`,ratio:1,class:"tw-w-full sm:tw-h-44",fit:"contain"},null,8,["src"])]),_:2},1024),t(n,{class:"tw-flex-1 tw-min-w-0 md:tw-flex md:!tw-flex-col md:!tw-justify-between"},{default:e(()=>[t(q,{class:"text-subtitle2 text-weight-medium tw-truncate"},{default:e(()=>[u(l(s.name||s.title),1)]),_:2},1024),t(q,{caption:"",class:d(["!tw-text-xs",r.value&&"!tw-text-white"])},{default:e(()=>[u(l(i(_)(s.price))+" "+l(a.$t("cart.each")),1)]),_:2},1032,["class"]),c("div",ot,[c("div",ct,[t(Y,{flat:"",class:""},{default:e(()=>[t(f,{flat:"",dense:"",icon:"remove",onClick:C=>$(s.id,s.quantity-1)},null,8,["onClick"]),t(f,{flat:"",dense:"",class:"text-weight-bold"},{default:e(()=>[u(l(s.quantity),1)]),_:2},1024),t(f,{flat:"",dense:"",icon:"add",onClick:C=>$(s.id,s.quantity+1)},null,8,["onClick"])]),_:2},1024)]),c("div",nt,l(a.$t("cart.total"))+": "+l(i(_)(s.price*s.quantity)),1)])]),_:2},1024),t(n,{class:"!tw-flex-shrink-0 tw-flex tw-items-center tw-justify-center md:!tw-max-w-[60px] md:tw-ml-4"},{default:e(()=>[t(f,{flat:"",round:"",rectangle:"",color:"negative",icon:"delete",onClick:C=>T(s.id)},null,8,["onClick"])]),_:2},1024)]),_:2},1032,["class"]))),128))]),c("div",rt,[t(x,{class:d(["tw-flex tw-justify-between tw-flex-col tw-gap-4 !tw-pt-4 !tw-pb-3 tw-rounded-md",r.value?"tw-bg-transparent text-light":"bg-light text-dark"])},{default:e(()=>[t(n,{class:"tw-w-full"},{default:e(()=>[c("div",it,l(a.$t("cart.orderSummary")),1),t(O,{dense:"",class:"tw-w-full tw-flex tw-flex-col tw-justify-between"},{default:e(()=>[t(x,{class:"tw-justify-between"},{default:e(()=>[t(n,null,{default:e(()=>[u(l(a.$t("cart.items"))+" ("+l(i(o).totalItems)+")",1)]),_:1}),t(n,{side:"",class:d(r.value?"text-light":"text-dark")},{default:e(()=>[u(l(i(_)(i(o).totalPrice)),1)]),_:1},8,["class"])]),_:1}),t(x,{class:"tw-justify-between"},{default:e(()=>[t(n,null,{default:e(()=>[u(l(a.$t("cart.shipping")),1)]),_:1}),t(n,{side:"",class:d(r.value?"text-light":"text-dark")},{default:e(()=>[u(l(a.$t("cart.free")),1)]),_:1},8,["class"])]),_:1}),t(W,{class:"q-my-md"}),t(x,{class:"tw-justify-between"},{default:e(()=>[t(n,null,{default:e(()=>[c("span",ut,l(a.$t("cart.total")),1)]),_:1}),t(n,{side:"",class:d(r.value?"text-light":"text-dark")},{default:e(()=>[c("span",dt,l(i(_)(i(o).totalPrice)),1)]),_:1},8,["class"])]),_:1})]),_:1})]),_:1}),t(X,{align:"center"},{default:e(()=>[t(f,{label:a.$t("cart.checkout"),class:d(["full-width !tw-p-4",r.value?"bg-white text-dark":"bg-dark text-white"]),onClick:S},null,8,["label","class"])]),_:1})]),_:1},8,["class"])])])]))]),_:1}))}}),gt=H(wt,[["__scopeId","data-v-1aa69954"]]);export{gt as default};
