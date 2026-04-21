"use strict";(self.webpackChunkstrapi=self.webpackChunkstrapi||[]).push([[2501],{84409:(D,d,e)=>{e.d(d,{p:()=>o});var t=e(67294),u=e(57993),E=e(88767);const o=(l={})=>{const{get:s}=(0,u.kY)(),{data:m,isLoading:a}=(0,E.useQuery)(["ee","providers"],async()=>{const{data:P}=await s("/admin/providers");return P},l);return{providers:t.useMemo(()=>m??[],[m]),isLoading:a}}},80090:(D,d,e)=>{e.d(d,{Z:()=>M});var t=e(67294),u=e(11047),E=e(84495),o=e(75515),l=e(11276),s=e(67819),m=e(45697),a=e.n(m),v=e(86896),P=e(73727),g=e(88972);const h=g.ZP.a`
  width: ${136/16}rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${48/16}rem;
  border: 1px solid ${({theme:n})=>n.colors.neutral150};
  border-radius: ${({theme:n})=>n.borderRadius};
  text-decoration: inherit;
  &:link {
    text-decoration: none;
  }
  color: ${({theme:n})=>n.colors.neutral600};
`,O=(0,g.ZP)(u.k)`
  & a:not(:first-child):not(:last-child) {
    margin: 0 ${({theme:n})=>n.spaces[2]};
  }
  & a:first-child {
    margin-right: ${({theme:n})=>n.spaces[2]};
  }
  & a:last-child {
    margin-left: ${({theme:n})=>n.spaces[2]};
  }
`,i=({provider:n})=>t.createElement(E.u,{label:n.displayName},t.createElement(h,{href:`${window.strapi.backendURL}/admin/connect/${n.uid}`},n.icon?t.createElement("img",{src:n.icon,"aria-hidden":!0,alt:"",height:"32px"}):t.createElement(o.Z,null,n.displayName)));i.propTypes={provider:a().shape({icon:a().string,displayName:a().string.isRequired,uid:a().string.isRequired}).isRequired};const p=({providers:n,displayAllProviders:f})=>{const{formatMessage:y}=(0,v.Z)();return f?t.createElement(l.r,{gap:4},n.map(r=>t.createElement(s.P,{key:r.uid,col:4},t.createElement(i,{provider:r})))):n.length>2&&!f?t.createElement(l.r,{gap:4},n.slice(0,2).map(r=>t.createElement(s.P,{key:r.uid,col:4},t.createElement(i,{provider:r}))),t.createElement(s.P,{col:4},t.createElement(E.u,{label:y({id:"global.see-more"})},t.createElement(h,{as:P.rU,to:"/auth/providers"},t.createElement("span",{"aria-hidden":!0},"\u2022\u2022\u2022"))))):t.createElement(O,{justifyContent:"center"},n.map(r=>t.createElement(i,{key:r.uid,provider:r})))};p.defaultProps={displayAllProviders:!0},p.propTypes={providers:a().arrayOf(a().object).isRequired,displayAllProviders:a().bool};const M=p},52501:(D,d,e)=>{e.r(d),e.d(d,{FORMS:()=>r});var t=e(67294),u=e(70004),E=e(185),o=e(41580),l=e(75515),s=e(11047),m=e(77197),a=e(29728),v=e(57993),P=e(86896),g=e(16550),h=e(88972),O=e(68890),i=e(50745),p=e(84409),M=e(80090);const n=(0,h.ZP)(u.i)`
  flex: 1;
`,r={providers:{Component:()=>{const{push:R}=(0,g.k6)(),{formatMessage:c}=(0,P.Z)(),{isLoading:C,providers:A}=(0,p.p)({enabled:window.strapi.features.isEnabled(window.strapi.features.SSO)}),L=()=>{R("/auth/login")};return!window.strapi.features.isEnabled(window.strapi.features.SSO)||!C&&A.length===0?t.createElement(g.l_,{to:"/auth/login"}):t.createElement(i.ZP,null,t.createElement(E.o,null,t.createElement(i.bU,null,t.createElement(i.sg,null,t.createElement(O.Z,null),t.createElement(o.x,{paddingTop:6,paddingBottom:1},t.createElement(l.Z,{as:"h1",variant:"alpha"},c({id:"Auth.form.welcome.title"}))),t.createElement(o.x,{paddingBottom:7},t.createElement(l.Z,{variant:"epsilon",textColor:"neutral600"},c({id:"Auth.login.sso.subtitle"})))),t.createElement(s.k,{direction:"column",alignItems:"stretch",gap:7},C?t.createElement(s.k,{justifyContent:"center"},t.createElement(m.a,null,c({id:"Auth.login.sso.loading"}))):t.createElement(M.Z,{providers:A}),t.createElement(s.k,null,t.createElement(n,null),t.createElement(o.x,{paddingLeft:3,paddingRight:3},t.createElement(l.Z,{variant:"sigma",textColor:"neutral600"},c({id:"or"}))),t.createElement(n,null)),t.createElement(a.z,{fullWidth:!0,size:"L",onClick:L},c({id:"Auth.form.button.login.strapi"})))),t.createElement(s.k,{justifyContent:"center"},t.createElement(o.x,{paddingTop:4},t.createElement(v.rU,{to:"/auth/forgot-password"},t.createElement(l.Z,{variant:"pi"},c({id:"Auth.link.forgot-password"})))))))},endPoint:null,fieldsToDisable:[],fieldsToOmit:[],schema:null,inputsPrefix:""}}}}]);
