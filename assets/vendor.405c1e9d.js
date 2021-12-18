/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const N=window.ShadowRoot&&(window.ShadyCSS===void 0||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),I=new Map;class it{constructor(t,e){if(this._$cssResult$=!0,e!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){let t=I.get(this.cssText);return N&&t===void 0&&(I.set(this.cssText,t=new CSSStyleSheet),t.replaceSync(this.cssText)),t}toString(){return this.cssText}}const st=n=>new it(typeof n=="string"?n:n+"",B),nt=(n,t)=>{N?n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):t.forEach(e=>{const i=document.createElement("style"),s=window.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,n.appendChild(i)})},D=N?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return st(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var M;const j=window.trustedTypes,ot=j?j.emptyScript:"",V=window.reactiveElementPolyfillSupport,O={toAttribute(n,t){switch(t){case Boolean:n=n?ot:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},W=(n,t)=>t!==n&&(t==t||n==n),R={attribute:!0,type:String,converter:O,reflect:!1,hasChanged:W};class A extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(t){var e;(e=this.l)!==null&&e!==void 0||(this.l=[]),this.l.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Eh(i,e);s!==void 0&&(this._$Eu.set(s,i),t.push(s))}),t}static createProperty(t,e=R){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i=typeof t=="symbol"?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const r=this[t];this[e]=s,this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||R}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const e=this.properties,i=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const s of i)this.createProperty(s,e[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(D(s))}else t!==void 0&&e.push(D(t));return e}static _$Eh(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$Em(),this.requestUpdate(),(t=this.constructor.l)===null||t===void 0||t.forEach(e=>e(this))}addController(t){var e,i;((e=this._$Eg)!==null&&e!==void 0?e:this._$Eg=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)===null||i===void 0||i.call(t))}removeController(t){var e;(e=this._$Eg)===null||e===void 0||e.splice(this._$Eg.indexOf(t)>>>0,1)}_$Em(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Et.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const e=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return nt(e,this.constructor.elementStyles),e}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$Eg)===null||t===void 0||t.forEach(e=>{var i;return(i=e.hostConnected)===null||i===void 0?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$Eg)===null||t===void 0||t.forEach(e=>{var i;return(i=e.hostDisconnected)===null||i===void 0?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ES(t,e,i=R){var s,r;const o=this.constructor._$Eh(t,i);if(o!==void 0&&i.reflect===!0){const d=((r=(s=i.converter)===null||s===void 0?void 0:s.toAttribute)!==null&&r!==void 0?r:O.toAttribute)(e,i.type);this._$Ei=t,d==null?this.removeAttribute(o):this.setAttribute(o,d),this._$Ei=null}}_$AK(t,e){var i,s,r;const o=this.constructor,d=o._$Eu.get(t);if(d!==void 0&&this._$Ei!==d){const l=o.getPropertyOptions(d),h=l.converter,p=(r=(s=(i=h)===null||i===void 0?void 0:i.fromAttribute)!==null&&s!==void 0?s:typeof h=="function"?h:null)!==null&&r!==void 0?r:O.fromAttribute;this._$Ei=d,this[d]=p(e,l.type),this._$Ei=null}}requestUpdate(t,e,i){let s=!0;t!==void 0&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||W)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Ei!==t&&(this._$E_===void 0&&(this._$E_=new Map),this._$E_.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$Ep=this._$EC())}async _$EC(){this.isUpdatePending=!0;try{await this._$Ep}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach((s,r)=>this[r]=s),this._$Et=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$Eg)===null||t===void 0||t.forEach(s=>{var r;return(r=s.hostUpdate)===null||r===void 0?void 0:r.call(s)}),this.update(i)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$Eg)===null||e===void 0||e.forEach(i=>{var s;return(s=i.hostUpdated)===null||s===void 0?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return!0}update(t){this._$E_!==void 0&&(this._$E_.forEach((e,i)=>this._$ES(i,this[i],e)),this._$E_=void 0),this._$EU()}updated(t){}firstUpdated(t){}}A.finalized=!0,A.elementProperties=new Map,A.elementStyles=[],A.shadowRootOptions={mode:"open"},V==null||V({ReactiveElement:A}),((M=globalThis.reactiveElementVersions)!==null&&M!==void 0?M:globalThis.reactiveElementVersions=[]).push("1.0.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var k;const g=globalThis.trustedTypes,q=g?g.createPolicy("lit-html",{createHTML:n=>n}):void 0,v=`lit$${(Math.random()+"").slice(9)}$`,J="?"+v,rt=`<${J}>`,f=document,S=(n="")=>f.createComment(n),b=n=>n===null||typeof n!="object"&&typeof n!="function",K=Array.isArray,lt=n=>{var t;return K(n)||typeof((t=n)===null||t===void 0?void 0:t[Symbol.iterator])=="function"},w=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Z=/-->/g,F=/>/g,_=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,G=/'/g,Q=/"/g,X=/^(?:script|style|textarea)$/i,ht=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),At=ht(1),m=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),Y=new WeakMap,at=(n,t,e)=>{var i,s;const r=(i=e==null?void 0:e.renderBefore)!==null&&i!==void 0?i:t;let o=r._$litPart$;if(o===void 0){const d=(s=e==null?void 0:e.renderBefore)!==null&&s!==void 0?s:null;r._$litPart$=o=new U(t.insertBefore(S(),d),d,void 0,e!=null?e:{})}return o._$AI(n),o},y=f.createTreeWalker(f,129,null,!1),dt=(n,t)=>{const e=n.length-1,i=[];let s,r=t===2?"<svg>":"",o=w;for(let l=0;l<e;l++){const h=n[l];let p,a,c=-1,$=0;for(;$<h.length&&(o.lastIndex=$,a=o.exec(h),a!==null);)$=o.lastIndex,o===w?a[1]==="!--"?o=Z:a[1]!==void 0?o=F:a[2]!==void 0?(X.test(a[2])&&(s=RegExp("</"+a[2],"g")),o=_):a[3]!==void 0&&(o=_):o===_?a[0]===">"?(o=s!=null?s:w,c=-1):a[1]===void 0?c=-2:(c=o.lastIndex-a[2].length,p=a[1],o=a[3]===void 0?_:a[3]==='"'?Q:G):o===Q||o===G?o=_:o===Z||o===F?o=w:(o=_,s=void 0);const x=o===_&&n[l+1].startsWith("/>")?" ":"";r+=o===w?h+rt:c>=0?(i.push(p),h.slice(0,c)+"$lit$"+h.slice(c)+v+x):h+v+(c===-2?(i.push(void 0),l):x)}const d=r+(n[e]||"<?>")+(t===2?"</svg>":"");return[q!==void 0?q.createHTML(d):d,i]};class C{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const d=t.length-1,l=this.parts,[h,p]=dt(t,e);if(this.el=C.createElement(h,i),y.currentNode=this.el.content,e===2){const a=this.el.content,c=a.firstChild;c.remove(),a.append(...c.childNodes)}for(;(s=y.nextNode())!==null&&l.length<d;){if(s.nodeType===1){if(s.hasAttributes()){const a=[];for(const c of s.getAttributeNames())if(c.endsWith("$lit$")||c.startsWith(v)){const $=p[o++];if(a.push(c),$!==void 0){const x=s.getAttribute($.toLowerCase()+"$lit$").split(v),P=/([.?@])?(.*)/.exec($);l.push({type:1,index:r,name:P[2],strings:x,ctor:P[1]==="."?ut:P[1]==="?"?$t:P[1]==="@"?vt:H})}else l.push({type:6,index:r})}for(const c of a)s.removeAttribute(c)}if(X.test(s.tagName)){const a=s.textContent.split(v),c=a.length-1;if(c>0){s.textContent=g?g.emptyScript:"";for(let $=0;$<c;$++)s.append(a[$],S()),y.nextNode(),l.push({type:2,index:++r});s.append(a[c],S())}}}else if(s.nodeType===8)if(s.data===J)l.push({type:2,index:r});else{let a=-1;for(;(a=s.data.indexOf(v,a+1))!==-1;)l.push({type:7,index:r}),a+=v.length-1}r++}}static createElement(t,e){const i=f.createElement("template");return i.innerHTML=t,i}}function E(n,t,e=n,i){var s,r,o,d;if(t===m)return t;let l=i!==void 0?(s=e._$Cl)===null||s===void 0?void 0:s[i]:e._$Cu;const h=b(t)?void 0:t._$litDirective$;return(l==null?void 0:l.constructor)!==h&&((r=l==null?void 0:l._$AO)===null||r===void 0||r.call(l,!1),h===void 0?l=void 0:(l=new h(n),l._$AT(n,e,i)),i!==void 0?((o=(d=e)._$Cl)!==null&&o!==void 0?o:d._$Cl=[])[i]=l:e._$Cu=l),l!==void 0&&(t=E(n,l._$AS(n,t.values),l,i)),t}class ct{constructor(t,e){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var e;const{el:{content:i},parts:s}=this._$AD,r=((e=t==null?void 0:t.creationScope)!==null&&e!==void 0?e:f).importNode(i,!0);y.currentNode=r;let o=y.nextNode(),d=0,l=0,h=s[0];for(;h!==void 0;){if(d===h.index){let p;h.type===2?p=new U(o,o.nextSibling,this,t):h.type===1?p=new h.ctor(o,h.name,h.strings,this,t):h.type===6&&(p=new _t(o,this,t)),this.v.push(p),h=s[++l]}d!==(h==null?void 0:h.index)&&(o=y.nextNode(),d++)}return r}m(t){let e=0;for(const i of this.v)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class U{constructor(t,e,i,s){var r;this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cg=(r=s==null?void 0:s.isConnected)===null||r===void 0||r}get _$AU(){var t,e;return(e=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&e!==void 0?e:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),b(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==m&&this.$(t):t._$litType$!==void 0?this.T(t):t.nodeType!==void 0?this.S(t):lt(t)?this.M(t):this.$(t)}A(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}S(t){this._$AH!==t&&(this._$AR(),this._$AH=this.A(t))}$(t){this._$AH!==u&&b(this._$AH)?this._$AA.nextSibling.data=t:this.S(f.createTextNode(t)),this._$AH=t}T(t){var e;const{values:i,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=C.createElement(s.h,this.options)),s);if(((e=this._$AH)===null||e===void 0?void 0:e._$AD)===r)this._$AH.m(i);else{const o=new ct(r,this),d=o.p(this.options);o.m(i),this.S(d),this._$AH=o}}_$AC(t){let e=Y.get(t.strings);return e===void 0&&Y.set(t.strings,e=new C(t)),e}M(t){K(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new U(this.A(S()),this.A(S()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)===null||i===void 0||i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cg=t,(e=this._$AP)===null||e===void 0||e.call(this,t))}}class H{constructor(t,e,i,s,r){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=u}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(r===void 0)t=E(this,t,e,0),o=!b(t)||t!==this._$AH&&t!==m,o&&(this._$AH=t);else{const d=t;let l,h;for(t=r[0],l=0;l<r.length-1;l++)h=E(this,d[i+l],e,l),h===m&&(h=this._$AH[l]),o||(o=!b(h)||h!==this._$AH[l]),h===u?t=u:t!==u&&(t+=(h!=null?h:"")+r[l+1]),this._$AH[l]=h}o&&!s&&this.k(t)}k(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}}class ut extends H{constructor(){super(...arguments),this.type=3}k(t){this.element[this.name]=t===u?void 0:t}}const pt=g?g.emptyScript:"";class $t extends H{constructor(){super(...arguments),this.type=4}k(t){t&&t!==u?this.element.setAttribute(this.name,pt):this.element.removeAttribute(this.name)}}class vt extends H{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){var i;if((t=(i=E(this,t,e,0))!==null&&i!==void 0?i:u)===m)return;const s=this._$AH,r=t===u&&s!==u||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==u&&(s===u||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;typeof this._$AH=="function"?this._$AH.call((i=(e=this.options)===null||e===void 0?void 0:e.host)!==null&&i!==void 0?i:this.element,t):this._$AH.handleEvent(t)}}class _t{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}}const tt=window.litHtmlPolyfillSupport;tt==null||tt(C,U),((k=globalThis.litHtmlVersions)!==null&&k!==void 0?k:globalThis.litHtmlVersions=[]).push("2.0.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var L,z;class T extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return(t=(e=this.renderOptions).renderBefore)!==null&&t!==void 0||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=at(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Dt)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Dt)===null||t===void 0||t.setConnected(!1)}render(){return m}}T.finalized=!0,T._$litElement$=!0,(L=globalThis.litElementHydrateSupport)===null||L===void 0||L.call(globalThis,{LitElement:T});const et=globalThis.litElementPolyfillSupport;et==null||et({LitElement:T});((z=globalThis.litElementVersions)!==null&&z!==void 0?z:globalThis.litElementVersions=[]).push("3.0.2");export{At as p,at as w};
