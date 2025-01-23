import{I as J,aa as X,ab as Y,B as u,K as k,a5 as Q,M as tt,a3 as et,b6 as h,aN as at,aM as st,b7 as ot,b8 as T,d as lt,a7 as nt,g as rt,f as it,c as ct,ak as ut,e as dt,aZ as wt,r as A,b9 as mt,o as vt,j as r,k as S,w as C,z as v,m as w,ba as ft,l as o,t as i,an as pt,G as gt,n as P,y as ht,ai as j,q as bt,F as E,Q as U,v as M,D as xt,ap as _t,aB as yt,aW as R}from"./index-C0JJa2YO.js";import{Q as kt}from"./QImg-RQP2TEwU.js";import{Q as Ct}from"./QPage-BAchSC7v.js";import{f as D}from"./currency-BkOr-9aM.js";import{u as Pt}from"./products-DYdG4mGm.js";import"./rates-Zxt8FUGH.js";const It=J({name:"QBanner",props:{...X,inlineActions:Boolean,dense:Boolean,rounded:Boolean},setup(n,{slots:l}){const{proxy:{$q:m}}=tt(),f=Y(n,m),p=u(()=>"q-banner row items-center"+(n.dense===!0?" q-banner--dense":"")+(f.value===!0?" q-banner--dark q-dark":"")+(n.rounded===!0?" rounded-borders":"")),c=u(()=>`q-banner__actions row items-center justify-end col-${n.inlineActions===!0?"auto":"all"}`);return()=>{const g=[k("div",{class:"q-banner__avatar col-auto row items-center self-start"},Q(l.avatar)),k("div",{class:"q-banner__content col text-body2"},Q(l.default))],d=Q(l.action);return d!==void 0&&g.push(k("div",{class:c.value},d)),k("div",{class:p.value+(n.inlineActions===!1&&d!==void 0?" q-banner--top-padding":""),role:"alert"},g)}}});function qt(n){{const l={active:!0};if(typeof n=="function"){const m=u(n);l.val=m.value,et(m,f=>{l.val=f,l.active===!0&&h()})}else l.val=n;T.push(l),h(),at(()=>{l.active=!0,h()}),st(()=>{l.active=!1,h()}),ot(()=>{T.splice(T.indexOf(l),1),h()})}}const $t={key:0,class:"tw-p-4"},Bt={key:1,class:"tw-p-4"},Qt={key:2,class:"tw-flex tw-w-full tw-mx-auto tw-flex-col tw-justify-center tw-items-center tw-gap-3",style:{"max-width":"1200px"}},Tt={class:"tw-flex tw-w-full !tw-flex-col tw-items-baseline !tw-justify-between sm:!tw-justify-start md:tw-mb-8"},At={class:"tw-text-3xl tw-mt-4 tw-font-semibold tw-font-serif tw-mr-4"},St={class:"tw-text-base"},jt={class:"tw-flex !tw-flex-col !tw-w-full tw-gap-4 sm:!tw-flex-row"},Ut={class:"tw-col-span-12 sm:!tw-col-span-6 tw-w-full tw-px-0 tw-transition tw-duration-500 tw-ease-in-out hover:tw-scale-105"},Dt={key:1,class:"tw-h-full tw-w-full tw-relative"},Nt={class:"tw-col-span-12 sm:!tw-col-span-6 tw-w-full tw-flex tw-flex-col tw-flex-grow-0 tw-h-auto tw-min-h-full sm:!tw-py-0 !tw-align-top"},Vt={class:"!tw-w-full tw-flex tw-font-serif tw-justify-end tw-gap-2"},zt={class:"tw-text-sm tw-mb-2"},Et={class:"tw-text-xs"},Mt={class:"tw-text-base"},Rt={class:"text-bold tw-text-xl tw-pb-5"},Ft={class:"tw-text-gray-500 tw-mr-1 tw-text-base tw-line-through"},Lt={class:"tw-text-green-600"},Gt={class:"tw-w-full tw-flex tw-justify-between tw-gap-4"},Xt=lt({__name:"SingleProductPage",setup(n){const l=nt("scrollToTop"),m="https://e-comm-api-8eba0f6c8782.herokuapp.com/api".replace(/\/$/,""),f=rt(),p=it(),c=ct(),g=ut(),{t:d}=dt(),I=Pt(),q=wt(),{slug:N}=f.params,t=A(null),b=A(!0),$=A(null),V=u(()=>c.dark.isActive),x=u(()=>c.dark.isActive?"white":"black"),_=u(()=>c.dark.isActive?"black":"white"),F=u(()=>`${t.value?.name||t.value?.title||""} - ${mt}`),z=u(()=>g.items.some(a=>a.id===t.value?.id)),B=a=>{if(!a)return"";const s=`${m}${a}`,e=q.getCachedImageUrl(s);return e||(q.cacheImageUrl(s),s)},L=()=>{p.push(_t)},G=u(()=>t.value?.image?B(t.value.image):""),H=a=>{const s=[{src:B(a),name:t.value?.name||t.value?.title||""}];if(t.value&&t.value.additionalImages?.length){const e=t.value.additionalImages.map(y=>({src:B(y),name:t.value&&(t.value.name||t.value.title)||""}));s.push(...e)}q.openPreview(s)},K=a=>{g.addItem({...a,quantity:1}),l(),c.notify({color:"positive",position:"top",timeout:1e3,message:d("singleProduct.itemAdded"),icon:"check_circle"})},O=()=>{p.back()},W=async()=>{b.value=!0,c.loading.show();try{I.initViewedCache();const a=I.getViewedCache();if(a){const y=a.products.find(Z=>Z.id===Number(N));if(y){t.value=y,b.value=!1;return}}const s=await yt.get(`${m}${R}/${N}`);if(s.status!==200)throw new Error("Failed to fetch product");const{data:e}=s.data;t.value={id:e.id,name:e.name,title:e.title||e.name,price:Number(e.price),description:e.description,image:e.image,additionalImages:e.additionalImages||[],category:e.category,discount:e.discount||0,discountedPrice:e.price-e.price*(e.discount||10)/100,quantity:e.quantity||0,rating:e.rating||{rate:0,count:0}},I.setViewedCache(t.value)}catch(a){console.warn("Error fetching product:",a),$.value=d("errors.fetchProduct"),c.notify({color:"negative",position:"top",timeout:1e3,message:d("errors.fetchProduct"),icon:"error"}),(!t.value||!t.value.id)&&p.push(R)}finally{c.loading.hide(),b.value=!1}};return vt(()=>{W(),qt({title:F.value})}),(a,s)=>(r(),S(Ct,{padding:"",class:"!tw-pb-16 md:!tw-pb-24 !tw-pt-4 !tw-px-3"},{default:C(()=>[b.value?(r(),v("div",$t,[w(ft,{color:_.value,size:"50px"},null,8,["color"])])):$.value?(r(),v("div",Bt,[w(It,{type:"negative",class:"q-mb-md"},{default:C(()=>[o("div",null,i($.value),1)]),_:1})])):(r(),v("div",Qt,[o("div",Tt,[o("span",At,i(t.value?.name),1),o("span",St,i(t.value?.category),1)]),w(pt),o("div",jt,[o("div",Ut,[t.value?.image?(r(),v("div",Dt,[w(ht,{name:"zoom_out_map",color:x.value,size:"lg",class:"tw-flex tw-items-center tw-justify-center !tw-absolute tw-bottom-0 tw-right-0 tw-m-2 tw-cursor-pointer tw-z-10"},null,8,["color"]),w(kt,{src:G.value,alt:t.value.name,fit:"contain",class:"cursor-pointer full-width full-height !tw-rounded-md",onClick:s[0]||(s[0]=e=>H(t.value.image))},null,8,["src","alt"])])):(r(),v("div",{key:0,class:gt(["tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center tw-rounded 0 tw-border tw-border-gray-400 tw-pb-2",V.value?"tw-text-gray-200  !tw-bg-gray-700":"tw-text-gray-70 !tw-bg-gray-200"])},i(P(d)("errors.noImage")),3))]),o("div",Nt,[o("h5",Vt,[o("span",zt,[j("("+i(t.value?.quantity)+" ",1),o("span",Et,i(a.$t("singleProduct.quantity")),1),s[2]||(s[2]=j(")"))])]),w(bt,{class:"tw-flex tw-flex-col tw-flex-1 tw-h-full !tw-px-0"},{default:C(()=>[o("div",Mt,i(t.value?.description),1)]),_:1}),w(xt,{class:"!tw-flex !tw-justify-between !tw-items-end tw-gap-2 !tw-p-0"},{default:C(()=>[o("div",Rt,[t.value?.discount?(r(),v(E,{key:0},[o("span",Ft,i(P(D)(t.value?.price)),1),o("span",Lt,i(P(D)(t.value?.discountedPrice||t.value?.price)),1)],64)):(r(),v(E,{key:1},[j(i(t.value?.price!==void 0?P(D)(t.value.price):""),1)],64))]),o("div",Gt,[w(U,{color:_.value,"text-color":x.value,outline:V.value,label:a.$t("singleProduct.goBack"),"class-name":"tw-flex-1 tw-basis-1/3 !tw-py-2.5",onClick:O},null,8,["color","text-color","outline","label"]),z.value?M("",!0):(r(),S(U,{key:0,color:x.value,"text-color":_.value,label:a.$t("singleProduct.addToCart"),"class-name":"tw-flex-1 tw-basis-2/3 !tw-py-2.5",onClick:s[1]||(s[1]=e=>t.value&&K(t.value))},null,8,["color","text-color","label"])),z.value?(r(),S(U,{key:1,color:x.value,"text-color":_.value,label:a.$t("singleProduct.viewCart"),"class-name":"tw-flex-1 tw-basis-2/3 !tw-py-2.5",onClick:L},null,8,["color","text-color","label"])):M("",!0)])]),_:1})])])]))]),_:1}))}});export{Xt as default};
