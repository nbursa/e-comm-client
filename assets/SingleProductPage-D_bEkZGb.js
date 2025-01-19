import{Q as R}from"./QImg-BQ3WR208.js";import{c as g,a1 as W,aT as d,z,y as G,aU as j,aV as y,d as H,a4 as O,aW as X,al as Y,aj as J,ak as K,ab as Z,aX as tt,q as et,aY as at,A as st,o as _,a as ot,w as x,f as o,n as it,g as v,e as p,t as n,ag as b,Q as lt,h as Q,F as S,k as A,aG as ct,j as nt,aN as f}from"./index-D4xUG4uP.js";import{Q as rt}from"./QPage-pmDv6aKN.js";import{f as C}from"./currency-DilllrcX.js";import{u as ut}from"./products-BZOD4RJq.js";import{api as dt}from"./axios-BNnHKsoi.js";import"./rates-B5s1l_ys.js";function U(m){{const i={active:!0};if(typeof m=="function"){const u=g(m);i.val=u.value,W(u,r=>{i.val=r,i.active===!0&&d()})}else i.val=m;y.push(i),d(),z(()=>{i.active=!0,d()}),G(()=>{i.active=!1,d()}),j(()=>{y.splice(y.indexOf(i),1),d()})}}const pt={class:"q-mb-md q-mx-auto overflow-hidden",style:{"max-width":"1200px"}},mt={class:"col-12 col-md-4 q-py-lg tw-transition tw-duration-200 tw-ease-in-out hover:tw-scale-105"},vt={class:"col-12 col-md-8 sm:tw-p-3 !tw-align-top",style:{display:"flex","flex-direction":"column","flex-grow":"0",height:"auto","min-height":"100%"}},ft={class:"tw-flex tw-justify-start tw-gap-2"},gt={class:"tw-text-sm tw-mb-2"},ht={class:"tw-text-xs"},wt={class:"text-caption q-mt-sm"},yt={class:"q-mt-sm text-bold price-text"},_t={class:"text-grey"},xt={class:"text-positive q-ml-sm"},bt={class:"row justify-center q-mt-xl"},Qt=H({__name:"SingleProductPage",setup(m){const i=O("scrollToTop"),u="http://localhost:8080/api".replace(/\/$/,""),r=new Map,B=X(),h=Y(),c=J(),N=K(),{t:k}=Z(),q=ut(),V=tt(),t=et({id:0,title:"",name:"",price:0,quantity:0,description:"",category:"",image:"",rating:{rate:0,count:0}}),T=g(()=>c.dark.isActive?"white":"black"),$=g(()=>c.dark.isActive?"black":"white"),I=g(()=>`${t.value.name||t.value.title} - ${at}`),w=e=>{if(!e)return"/api/static/placeholder.webp";const a=r.get(e);if(a)return a;if(e.startsWith("/static")){const l=`${u}${e}`;return r.set(e,l),l}return e.startsWith("http")&&r.set(e,e),e},E=e=>{const a=[{src:w(e),name:t.value.name||t.value.title||""}];if(t.value.additionalImages?.length){const l=t.value.additionalImages.map(s=>({src:w(s),name:t.value.name||t.value.title||""}));a.push(...l)}V.openPreview(a)},D=e=>{N.addItem({...e,quantity:1}),i(),c.notify({color:"positive",position:"top",timeout:1e3,message:k("singleProduct.itemAdded"),icon:"check_circle"})},M=()=>{h.push(f)},F=async()=>{const{slug:e}=B.params;c.loading.show();try{const a=q.getViewedCache();if(a){const P=a.products.find(L=>L.id===Number(e));if(P){t.value=P,U({title:I.value});return}}const l=await dt.get(`${u}${f}/${e}`);if(t.value.id||h.push(f),l.status!==200)throw new Error("Failed to fetch product");const{data:s}=l.data;t.value={id:s.id,name:s.name,title:s.title||s.name,price:Number(s.price),description:s.description,image:s.image,additionalImages:s.additionalImages||[],category:s.category,discount:s.discount||0,discountedPrice:s.price-s.price*(s.discount||10)/100,quantity:s.quantity||0,rating:s.rating||{rate:0,count:0}},q.setViewedCache(t.value),U({title:I.value})}catch(a){console.warn("Error fetching product:",a),c.notify({color:"negative",position:"top",timeout:1e3,message:k("errors.fetchProduct"),icon:"error"}),t.value.id||h.push(f)}finally{c.loading.hide()}};return st(async()=>{await F()}),j(()=>{r.clear()}),(e,a)=>(_(),ot(rt,{padding:"",class:"!tw-pb-16 md:tw-pb-24 !tw-pt-4"},{default:x(()=>[o("div",pt,[o("div",{class:it(["row items-stretch full-height",{"col-reverse-md":v(c).screen.md}])},[o("div",mt,[p(R,{src:w(t.value.image),alt:t.value.name,fit:"contain",class:"cursor-pointer full-width full-height",onClick:a[0]||(a[0]=l=>E(t.value.image))},null,8,["src","alt"])]),o("div",vt,[p(lt,{class:"q-pa-sm !tw-pb-0",style:{flex:"1",display:"flex","flex-direction":"column",height:"100%"}},{default:x(()=>[o("h5",ft,[o("span",null,n(t.value.name||t.value.title),1),o("span",gt,[b("("+n(t.value.quantity)+" ",1),o("span",ht,n(e.$t("singleProduct.quantity")),1),a[2]||(a[2]=b(")"))])]),o("div",wt,n(t.value.description),1)]),_:1}),p(nt,{align:"right",class:"row justify-between items-end !tw-pt-0"},{default:x(()=>[o("div",yt,[t.value.discount?(_(),Q(S,{key:0},[o("s",_t,n(v(C)(t.value.price)),1),o("span",xt,n(v(C)(t.value.discountedPrice||t.value.price)),1)],64)):(_(),Q(S,{key:1},[b(n(v(C)(t.value.price)),1)],64))]),p(A,{color:T.value,"text-color":$.value,label:e.$t("singleProduct.addToCart"),class:"!tw-p-4 full-width",onClick:a[1]||(a[1]=ct(l=>D(t.value),["stop"]))},null,8,["color","text-color","label"])]),_:1})])],2)]),o("div",bt,[p(A,{color:T.value,"text-color":$.value,label:e.$t("singleProduct.backToProducts"),onClick:M},null,8,["color","text-color","label"])])]),_:1}))}});export{Qt as default};
