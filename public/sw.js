if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,c)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const r=e=>a(e,i),d={module:{uri:i},exports:t,require:r};s[i]=Promise.all(n.map((e=>d[e]||r(e)))).then((e=>(c(...e),t)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Ad Images/ReachAd16x9.jpg",revision:"063f89f959abb7abea1699b754959406"},{url:"/Ad Images/UmeshCo.jpg",revision:"385f34a84e452717d1128afe8d097380"},{url:"/Ad Images/ayurveda.jpg",revision:"448cb8b935e7cc17b2badaf6c9d2468c"},{url:"/Ad Images/banner.gif",revision:"f02140e126d4cae4b372a9013d3c742b"},{url:"/Ad Images/kalari.jpg",revision:"75421adf9acaf622dacd5faf7ec93ba4"},{url:"/Ad Images/umesh banner.jpg",revision:"61d2a827cc0db9b610af905122038029"},{url:"/_next/static/chunks/172-e27a550a44b39731.js",revision:"e27a550a44b39731"},{url:"/_next/static/chunks/448-d7d9437980736b79.js",revision:"d7d9437980736b79"},{url:"/_next/static/chunks/456-89e725803a567066.js",revision:"89e725803a567066"},{url:"/_next/static/chunks/641-98069ed0cfbf17d4.js",revision:"98069ed0cfbf17d4"},{url:"/_next/static/chunks/763-4eb4c3f8db512752.js",revision:"4eb4c3f8db512752"},{url:"/_next/static/chunks/882-bd6b2c19d4fb3ec4.js",revision:"bd6b2c19d4fb3ec4"},{url:"/_next/static/chunks/framework-ecc4130bc7a58a64.js",revision:"ecc4130bc7a58a64"},{url:"/_next/static/chunks/main-5b00202cf239c0e6.js",revision:"5b00202cf239c0e6"},{url:"/_next/static/chunks/pages/%5Bcategory%5D-3adfd5ba2ac7332b.js",revision:"3adfd5ba2ac7332b"},{url:"/_next/static/chunks/pages/%5Bcategory%5D/%5Bid%5D-69a83f62bf4beebc.js",revision:"69a83f62bf4beebc"},{url:"/_next/static/chunks/pages/_app-477ccbaa60313af5.js",revision:"477ccbaa60313af5"},{url:"/_next/static/chunks/pages/_error-77823ddac6993d35.js",revision:"77823ddac6993d35"},{url:"/_next/static/chunks/pages/admin-b5c4a23a1f2d7b3f.js",revision:"b5c4a23a1f2d7b3f"},{url:"/_next/static/chunks/pages/admin/add-news-9c34d1191086b92c.js",revision:"9c34d1191086b92c"},{url:"/_next/static/chunks/pages/admin/add-news-bullet-f2a8f1363d5c0ad6.js",revision:"f2a8f1363d5c0ad6"},{url:"/_next/static/chunks/pages/admin/news-bullet-manager-502e41a024ffee70.js",revision:"502e41a024ffee70"},{url:"/_next/static/chunks/pages/admin/news-bullet-manager/edit/%5BnewsId%5D-01dd9b10c7869f2b.js",revision:"01dd9b10c7869f2b"},{url:"/_next/static/chunks/pages/admin/news-manager-169867cfcc4c1ce8.js",revision:"169867cfcc4c1ce8"},{url:"/_next/static/chunks/pages/admin/news-manager/edit-news/%5BnewsId%5D-641b1453d86e5ae9.js",revision:"641b1453d86e5ae9"},{url:"/_next/static/chunks/pages/admin/revalidate-a8d7ee617262dc3b.js",revision:"a8d7ee617262dc3b"},{url:"/_next/static/chunks/pages/index-f29361dd9a43e15e.js",revision:"f29361dd9a43e15e"},{url:"/_next/static/chunks/pages/login-3d4148fc68bb1aef.js",revision:"3d4148fc68bb1aef"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-87b3a303122f2f0d.js",revision:"87b3a303122f2f0d"},{url:"/_next/static/css/11583340c9877840.css",revision:"11583340c9877840"},{url:"/_next/static/css/1704ffd5531e06ca.css",revision:"1704ffd5531e06ca"},{url:"/_next/static/css/2dbd94681d60e613.css",revision:"2dbd94681d60e613"},{url:"/_next/static/css/9f1469606f30dc8d.css",revision:"9f1469606f30dc8d"},{url:"/_next/static/media/logo192.0aa9c9b6.png",revision:"0ca53235e8bbff01db337af0000849ef"},{url:"/_next/static/oPprN0PT4FXwwpr0RgUOU/_buildManifest.js",revision:"76b62080b0ccd2e74b79677ec8fb76b8"},{url:"/_next/static/oPprN0PT4FXwwpr0RgUOU/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/default-image.jpg",revision:"29788bc6ba5c8ed5769482b27be80c24"},{url:"/favicon.ico",revision:"050a582bb3a88d987942bbff97dfc964"},{url:"/images.jpeg",revision:"1a0a6313aad1e1dddd1631d947bc72ed"},{url:"/logo192.png",revision:"0ca53235e8bbff01db337af0000849ef"},{url:"/logo203.jpg",revision:"4ca7b0fc20e0205da9350417deb3cbfe"},{url:"/logo512.png",revision:"09afb7dc2c61d674cc27f45d1fa06b9c"},{url:"/manifest.json",revision:"c14523da13791b220fc7e65a177b225b"},{url:"/news alt images/news-small.jpg",revision:"ee8d20e58c173ce0d1884431e2e1ccd2"},{url:"/news alt images/news.jpg",revision:"54e632d76d600577444a4af85853b626"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/service-worker.js",revision:"eb66686633b3a9017bd0abe55cdff569"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
