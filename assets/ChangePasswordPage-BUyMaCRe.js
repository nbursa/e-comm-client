import{d as E,a as D,c as F,e as O,f as $,g as G,r as a,o as H,h as J,j as c,k as v,w as o,l as P,m as n,t as k,n as t,p as K,q as S,v as m,x as C,y as V,z as T,A as W}from"./index-C0JJa2YO.js";import{Q as X}from"./QForm-CKSKV2hQ.js";import{Q as Y}from"./QPage-BAchSC7v.js";const Z={class:"tw-w-full sm:tw-max-w-72 tw-mx-auto"},ee={class:"tw-text-3xl tw-text-center tw-mb-8 tw-font-semibold tw-font-serif"},se={class:"tw-w-full tw-flex tw-justify-center tw-items-center"},ae={key:2,class:"tw-text-red-500 tw-mb-4"},te={class:"tw-flex tw-flex-col tw-gap-2"},ue=E({__name:"ChangePasswordPage",setup(le){const Q=D(),b=F(),{t:e}=O(),N=$(),M=G(),f=a(""),r=a(""),p=a(""),u=a(null),g=a(!1),h=a(!1),y=a(!1),w=a(!1),_=a(null),B=a(null),i=a(!1),z=()=>{g.value=!g.value},L=()=>{h.value=!h.value},j=()=>{y.value=!y.value},I=()=>{N.back()},U=async()=>{if(u.value=null,r.value!==p.value){b.notify({type:"negative",message:e("changePassword.noMatch"),position:"top",timeout:5e3,icon:"error"}),u.value=e("changePassword.noMatch");return}try{let s;i.value?s=await Q.resetPassword(B.value,_.value,r.value):s=await Q.changePassword(f.value,r.value),s&&(b.notify({type:"positive",message:s,position:"top",timeout:5e3,icon:"check"}),f.value="",r.value="",p.value="",w.value=!0)}catch(s){const l=s;u.value=l.response?.data?.error||e("changePassword.errorMessage"),b.notify({type:"negative",message:u.value,position:"top",timeout:5e3,icon:"error"})}},x=s=>!!s||e("errors.validation.required"),R=s=>s.length<6?e("errors.validation.passwordMinLength",{minLength:6}):!0,A=s=>s===r.value||e("errors.validation.passwordMismatch");return H(()=>{B.value=M.query.email,_.value=M.query.token,_.value&&(i.value=!0)}),(s,l)=>{const q=J("QButton");return c(),v(Y,{padding:"",class:"!tw-pb-16 !tw-px-3 tw-flex tw-justify-center tw-items-center"},{default:o(()=>[P("div",Z,[n(W,{flat:"",bordered:"",class:"!tw-w-full !tw-max-w-54 tw-p-4 !tw-bg-transparent"},{default:o(()=>[P("h4",ee,k(i.value?t(e)("changePassword.titleReset"):t(e)("changePassword.titleChange")),1),n(X,{class:"!tw-w-full",onSubmit:K(U,["prevent"])},{default:o(()=>[w.value?(c(),v(S,{key:0},{default:o(()=>[P("div",se,k(i.value?t(e)("changePassword.successReset"):t(e)("changePassword.successChange")),1)]),_:1})):m("",!0),w.value?m("",!0):(c(),v(S,{key:1,class:"tw-flex tw-flex-col tw-gap-4 tw-w-full !tw-p-0 tw-mb-4"},{default:o(()=>[i.value?m("",!0):(c(),v(C,{key:0,modelValue:f.value,"onUpdate:modelValue":l[0]||(l[0]=d=>f.value=d),type:g.value?"text":"password",label:t(e)("changePassword.currentPassword"),dense:"","lazy-rules":"",rules:[x,R],class:"tw-w-full"},{append:o(()=>[n(V,{name:g.value?"visibility_off":"visibility",onClick:z},null,8,["name"])]),_:1},8,["modelValue","type","label","rules"])),n(C,{modelValue:r.value,"onUpdate:modelValue":l[1]||(l[1]=d=>r.value=d),type:h.value?"text":"password",label:t(e)("changePassword.newPassword"),dense:"","lazy-rules":"",rules:[x,R],class:"tw-w-full"},{append:o(()=>[n(V,{name:h.value?"visibility_off":"visibility",onClick:L},null,8,["name"])]),_:1},8,["modelValue","type","label","rules"]),n(C,{modelValue:p.value,"onUpdate:modelValue":l[2]||(l[2]=d=>p.value=d),type:y.value?"text":"password",label:t(e)("changePassword.confirmPassword"),dense:"","lazy-rules":"",rules:[x,A],class:"tw-w-full"},{append:o(()=>[n(V,{name:y.value?"visibility_off":"visibility",onClick:j},null,8,["name"])]),_:1},8,["modelValue","type","label","rules"])]),_:1})),u.value?(c(),T("div",ae,k(u.value),1)):m("",!0),P("div",te,[w.value?m("",!0):(c(),v(q,{key:0,type:"submit",label:i.value?t(e)("changePassword.reset"):t(e)("changePassword.change"),class:"!tw-w-full !tw-py-2.5"},null,8,["label"])),n(q,{secondary:"",label:w.value?t(e)("common.continue"):t(e)("changePassword.cancel"),class:"!tw-w-full !tw-py-2.5",onClick:I},null,8,["label"])])]),_:1})]),_:1})])]),_:1})}}});export{ue as default};
