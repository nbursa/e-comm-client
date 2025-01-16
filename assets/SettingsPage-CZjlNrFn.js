import{W as O,u as P,ag as Q,ad as A,q as c,X as B,Y as U,Z as i,a0 as t,a1 as n,_ as l,ap as T,aE as D,aF as L,aG as N,$ as b,a6 as k,a7 as y,a8 as C,al as w,a9 as $,aH as x}from"./index-DOXkhBEM.js";import{Q as z}from"./QPage-Ddka7GEn.js";const E={class:"q-m-sm tw-font-serif"},F={class:"row q-col-gutter-md q-mb-lg"},G={class:"col-12"},H={class:"text-subtitle1 text-weight-regular"},I={class:"col-12 col-sm-6"},M={class:"col-12 col-sm-6"},W={class:"row q-col-gutter-md q-mb-lg"},X={class:"col-12"},Y={class:"text-subtitle1 text-weight-regular"},Z={class:"col-12"},j={class:"row q-col-gutter-md"},J={class:"col-12"},K={class:"text-subtitle1 text-weight-regular"},R={class:"col-12 col-sm-6"},ee={class:"text-subtitle2"},te={class:"text-caption"},se={class:"col-12 col-sm-6"},ae={class:"text-subtitle2"},le={class:"text-caption"},ce=O({__name:"SettingsPage",setup(oe){const a=P(),{t:s}=Q(),o=A(),p=c(()=>a.settings.theme==="dark"),d=c(()=>a.languageOptions.map(e=>({...e,label:s(`language.${e.value}`)}))),g=c(()=>a.themeOptions.map(e=>({...e,label:s(`theme.${e.value}`)}))),m=c(()=>a.currencyOptions.map(e=>({...e,label:s(`currencyLabel.${e.value}`)}))),v=c({get:()=>d.value.find(e=>e.value===a.settings.language)||d.value[0],set:e=>a.setLanguage(e.value)}),_=c({get:()=>m.value.find(e=>e.value===a.settings.currency)||m.value[0],set:e=>a.setCurrency(e.value)}),f=c({get:()=>g.value.find(e=>e.value===a.settings.theme)||g.value[0],set:e=>a.setTheme(e.value)}),h=c({get:()=>a.settings.useSystemPreference,set:e=>a.setSystemPreference(e)}),S=e=>{h.value=e},V=()=>{o.dialog({title:s("settings.clearCacheTitle"),message:s("settings.clearCacheConfirm"),ok:{label:s("common.yes"),flat:!0,color:o.dark.isActive?"bg-white":"bg-dark",textColor:o.dark.isActive?"text-black":"text-white"},cancel:{label:s("common.no"),flat:!0,color:"transparent",textColor:o.dark.isActive?"white":"black"}}).onOk(()=>{x.clearProductsCache(),o.notify({type:"positive",message:s("settings.clearCacheSuccess"),position:"top",timeout:1e3})})},q=()=>{o.dialog({title:s("settings.resetTitle"),message:s("settings.resetConfirm"),ok:{label:s("common.yes"),flat:!0,color:o.dark.isActive?"bg-white":"bg-dark",textColor:o.dark.isActive?"text-black":"text-white"},cancel:{label:s("common.no"),flat:!0,color:"transparent",textColor:o.dark.isActive?"white":"black"}}).onOk(()=>{x.clearUserSettings(),o.notify({type:"positive",message:s("settings.resetSuccess"),position:"top",timeout:1e3}),window.location.reload()})};return(e,r)=>(B(),U(z,{padding:""},{default:i(()=>[t("h5",E,n(e.$t("settings.title")),1),l(T,{class:"q-my-md"}),t("div",F,[t("div",G,[t("h6",H,n(e.$t("settings.preferences")),1)]),t("div",I,[l(D,{modelValue:v.value,"onUpdate:modelValue":r[0]||(r[0]=u=>v.value=u),"language-options":d.value},null,8,["modelValue","language-options"])]),t("div",M,[l(L,{modelValue:_.value,"onUpdate:modelValue":r[1]||(r[1]=u=>_.value=u),"use-system-preference":h.value,"currency-options":m.value},null,8,["modelValue","use-system-preference","currency-options"])])]),t("div",W,[t("div",X,[t("h6",Y,n(e.$t("settings.appearance")),1)]),t("div",Z,[l(N,{modelValue:f.value,"onUpdate:modelValue":r[2]||(r[2]=u=>f.value=u),"theme-options":g.value,"use-system-preference":h.value,"onUpdate:useSystemPreference":S},null,8,["modelValue","theme-options","use-system-preference"])])]),t("div",j,[t("div",J,[t("h6",K,n(e.$t("settings.dataManagement")),1)]),t("div",R,[l($,{flat:"",class:"!tw-bg-transparent"},{default:i(()=>[l(b,null,{default:i(()=>[t("div",ee,n(e.$t("settings.clearCache")),1),t("div",te,n(e.$t("settings.clearCacheDescription")),1)]),_:1}),l(k,{align:"right"},{default:i(()=>[l(y,{flat:"",class:C(p.value?"bg-white text-black":"bg-dark text-white"),onClick:V},{default:i(()=>[w(n(e.$t("settings.clearCacheButton")),1)]),_:1},8,["class"])]),_:1})]),_:1})]),t("div",se,[l($,{flat:"",class:"!tw-bg-transparent"},{default:i(()=>[l(b,null,{default:i(()=>[t("div",ae,n(e.$t("settings.clearSettingsTitle")),1),t("div",le,n(e.$t("settings.resetDescription")),1)]),_:1}),l(k,{align:"right"},{default:i(()=>[l(y,{flat:"",class:C(p.value?"bg-white text-black":"bg-dark text-white"),onClick:q},{default:i(()=>[w(n(e.$t("settings.resetButton")),1)]),_:1},8,["class"])]),_:1})]),_:1})])])]),_:1}))}});export{ce as default};
