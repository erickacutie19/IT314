const products=[
 {id:"kapeng",name:"Kapeng Barako",description:"Freshly brewed Batangas Liberica · bold cup",price:95,category:"ready",tag:"Local favorite",image:"assets/products/coffee/kapeng.jpg",imageAlt:"Kapeng Barako in a ceramic mug"},
 {id:"batangas-barako",name:"Batangas Barako",description:"Strong Batangas Liberica · rich and aromatic",price:120,category:"ready",tag:"Batangas classic",image:"assets/products/coffee/batangas-barako.jpg",imageAlt:"Batangas Barako coffee in a glass cup"},
 {id:"latte",name:"Barako Latte",description:"Batangas espresso · steamed milk · latte art",price:180,category:"ready",tag:"New",image:"assets/products/coffee/latte.jpg",imageAlt:"Barako latte with leaf latte art"},
 {id:"drip",name:"Daily Drip Pack",description:"10 individual drip sachets · bold blend",price:290,category:"beans",tag:"Easy brew",image:"assets/products/drip-pack.jpg",imageAlt:"Daily Drip Pack sachets beside a freshly brewed pour-over coffee"},
 {id:"brewbox",name:"Barako Brew Box",description:"Beans + guide + mug",price:780,category:"beans",tag:"Gift ready",image:"assets/products/brew-box.jpg",imageAlt:"Barako Brew Box gift set with individual coffee sachets"},
 {id:"spanish-latte",name:"Spanish Barako",description:"Batangas espresso · condensed milk",price:210,category:"ready",tag:"Creamy favorite",image:"assets/products/coffee/spanish-latte.jpg",imageAlt:"Spanish Barako with whipped cream in a glass mug"},
 {id:"barako-mocha",name:"Mocha Barako",description:"Barako · chocolate · cream",price:220,category:"ready",tag:"Chocolatey",image:"assets/products/coffee/barako-mocha.jpg",imageAlt:"Mocha Barako finished with whipped cream and chocolate"},
 {id:"matcha-latte",name:"Matcha Latte",description:"Whisked matcha · creamy milk",price:190,category:"ready",tag:"Green & smooth",image:"assets/products/coffee/matcha-latte.jpg",imageAlt:"Iced matcha latte with layers of green tea and milk"},
 {id:"vietnamese-coffee",name:"Vietnamese Coffee",description:"Strong coffee · sweet condensed milk",price:195,category:"ready",tag:"Bold & sweet",image:"assets/products/coffee/vietnamese-coffee.jpg",imageAlt:"Vietnamese coffee layered over condensed milk"},
 {id:"iced-coffee",name:"Iced Coffee",description:"Chilled coffee · served over ice",price:150,category:"ready",tag:"Cool pick",image:"assets/products/coffee/iced-coffee.jpg",imageAlt:"Iced coffee with milk in a glass"},
 {id:"caramel-latte",name:"Caramel Latte",description:"Espresso · steamed milk · caramel",price:200,category:"ready",tag:"Sweet favorite",image:"assets/products/coffee/caramel-latte.jpg",imageAlt:"Caramel latte with whipped cream and caramel drizzle"},
 {id:"vanilla-latte",name:"Vanilla Latte",description:"Espresso · steamed milk · vanilla",price:200,category:"ready",tag:"Smooth favorite",image:"assets/products/coffee/vanilla-latte.jpg",imageAlt:"Vanilla latte topped with whipped cream"},
 {id:"cappuccino",name:"Cappuccino",description:"Espresso · steamed milk · foam",price:175,category:"ready",tag:"Coffeehouse classic",image:"assets/products/coffee/cappuccino.jpg",imageAlt:"Cappuccino dusted with cocoa in a ceramic cup"},
 {id:"americano",name:"Americano",description:"Espresso · hot water",price:140,category:"ready",tag:"Simple & bold",image:"assets/products/coffee/americano.jpg",imageAlt:"Americano in a glass cup on a wooden coaster"},
 {id:"ensaymada",name:"Batangas Ensaymada",description:"Golden buttery brioche · cheese topping",price:150,category:"pastries",tag:"Pastry pick",image:"assets/products/ensaymada.jpg",imageAlt:"Golden Filipino ensaymada topped with cheese"},
 {id:"ube-roll",name:"Ube Coffee Roll",description:"Soft roll · purple ube cream swirl",price:165,category:"pastries",tag:"Filipino favorite",image:"assets/products/ube-roll.jpg",imageAlt:"Ube-filled Filipino roll cake with a purple swirl"},
 {id:"panutsa",name:"Panutsa",description:"Traditional Batangas peanut-and-sugar confection",price:85,category:"pastries",tag:"Batangas heritage",image:"assets/products/panutsa.jpg",imageAlt:"Peanut brittle candy, a close visual reference for panutsa"},
 {id:"barako-crinkles",name:"Kapeng Barako Crinkles",description:"Chocolate crinkle cookies infused with kapeng barako",price:110,category:"pastries",tag:"Coffee & chocolate",image:"assets/products/barako-crinkles.jpg",imageAlt:"Chocolate crinkle cookies dusted with powdered sugar"}
];
const defaultInventory={kapeng:18,"batangas-barako":14,latte:12,drip:4,brewbox:9,"spanish-latte":10,"barako-mocha":10,"matcha-latte":12,"vietnamese-coffee":12,"iced-coffee":14,"caramel-latte":10,"vanilla-latte":10,cappuccino:10,americano:12,ensaymada:16,"ube-roll":14,panutsa:12,"barako-crinkles":16};
const savedProductPrices=JSON.parse(localStorage.getItem("erickaffe-product-prices")||"{}");
products.forEach(product=>{if(Number.isFinite(savedProductPrices[product.id])&&savedProductPrices[product.id]>=0)product.price=savedProductPrices[product.id]});
localStorage.setItem("erickaffe-product-prices",JSON.stringify(Object.fromEntries(products.map(product=>[product.id,product.price]))));
const state={cart:JSON.parse(localStorage.getItem("erickaffe-cart")||"[]"),user:JSON.parse(localStorage.getItem("erickaffe-user")||"null"),orders:JSON.parse(localStorage.getItem("erickaffe-orders")||"[]"),inventory:JSON.parse(localStorage.getItem("erickaffe-inventory")||JSON.stringify(defaultInventory)),orderStatuses:JSON.parse(localStorage.getItem("erickaffe-order-statuses")||"{}"),loyaltyStars:Number(localStorage.getItem("erickaffe-loyalty-stars")||"0"),customerProfiles:JSON.parse(localStorage.getItem("erickaffe-customer-profiles")||"{}"),newsletterSubscribers:JSON.parse(localStorage.getItem("erickaffe-newsletter")||"[]"),filter:"all"};
state.cart=state.cart.filter(item=>item.id!=="coldbrew"&&item.name!=="Coco Cold Brew");
delete state.inventory.coldbrew;
localStorage.setItem("erickaffe-cart",JSON.stringify(state.cart));
localStorage.setItem("erickaffe-inventory",JSON.stringify(state.inventory));
state.cart.forEach(item=>{if(item.id==="barako-mocha"||item.name==="Barako Mocha")item.name="Mocha Barako"});
Object.keys(defaultInventory).forEach(id=>{if(state.inventory[id]===undefined)state.inventory[id]=defaultInventory[id]});
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const peso=n=>"₱"+n.toLocaleString("en-PH");
function showTab(tab){const target=document.querySelector(`[data-tab-panel="${tab}"]`);if(!target)return;$$("[data-tab-panel]").forEach(panel=>panel.classList.toggle("active",panel===target));$$("[data-tab-link]").forEach(link=>link.classList.toggle("active",link.dataset.tabLink===tab));if(location.hash!==`#${tab}`)history.replaceState(null,"",`#${tab}`);window.scrollTo({top:0,behavior:"smooth"})}
function save(){localStorage.setItem("erickaffe-cart",JSON.stringify(state.cart));localStorage.setItem("erickaffe-user",JSON.stringify(state.user));localStorage.setItem("erickaffe-orders",JSON.stringify(state.orders));localStorage.setItem("erickaffe-inventory",JSON.stringify(state.inventory));localStorage.setItem("erickaffe-order-statuses",JSON.stringify(state.orderStatuses));localStorage.setItem("erickaffe-loyalty-stars",String(state.loyaltyStars));localStorage.setItem("erickaffe-customer-profiles",JSON.stringify(state.customerProfiles));localStorage.setItem("erickaffe-newsletter",JSON.stringify(state.newsletterSubscribers));localStorage.setItem("erickaffe-product-prices",JSON.stringify(Object.fromEntries(products.map(product=>[product.id,product.price]))));}
function customerOrders(){return state.user?state.orders.filter(order=>order.customerEmail===state.user.email):[]}
function activateCustomer(user){const profile=state.customerProfiles[user.email]||{createdAt:user.createdAt||new Date().toISOString(),loyaltyStars:0,password:user.password};user.createdAt=profile.createdAt;user.loyaltyStars=profile.loyaltyStars;state.customerProfiles[user.email]=profile;state.user=user;state.loyaltyStars=profile.loyaltyStars;save()}
function accountIcon(){if(!state.user)return `<svg class="account-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.25"></circle><path d="M5.5 20c.7-3.25 3.05-5 6.5-5s5.8 1.75 6.5 5"></path></svg>`;const initials=String(state.user.name||"Coffee Friend").split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0].toUpperCase()).join("");return `<span class="account-avatar" aria-hidden="true">${initials}</span>`}
function updateAccountControls(){const signedIn=Boolean(state.user),header=$("#header-account"),footer=$("#footer-account");if(header){header.innerHTML=accountIcon();header.setAttribute("aria-label",signedIn?`Open ${state.user.name}'s profile`:"Open account");header.title=signedIn?`Open ${state.user.name}'s profile`:"Log in or create account"}if(footer){footer.innerHTML=`${accountIcon()}<span class="account-label">${signedIn?state.user.name:"Account"}</span>`;footer.setAttribute("aria-label",signedIn?`Open ${state.user.name}'s profile`:"Open account")}}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2800)}
function openModal(id){$(id).hidden=false;document.body.style.overflow="hidden"}
function closeModal(){ $$(".modal-backdrop").forEach(m=>m.hidden=true);document.body.style.overflow=""}
function updateFulfillment(){const method=$("#fulfillment-method")?.value,delivery=$("#delivery-details"),pickup=$("#pickup-details");if(!method||!delivery||!pickup)return;const isDelivery=method==="delivery";delivery.hidden=!isDelivery;pickup.hidden=isDelivery;const address=document.querySelector('[name="address"]');if(address)address.required=isDelivery}
function useCurrentLocation(){const status=$("#location-status");if(!navigator.geolocation){status.textContent="Location access is not available in this browser. Enter your address instead.";return}status.textContent="Finding your location…";navigator.geolocation.getCurrentPosition(position=>{const {latitude,longitude}=position.coords,distance=Math.max(.5,Math.sqrt(Math.pow((latitude-13.9411)*111,2)+Math.pow((longitude-121.1631)*106,2))),minutes=Math.round(18+distance*4);$("#delivery-distance").textContent=`Approximately ${distance.toFixed(1)} km from Erickaffe`;$("#delivery-eta").textContent=`${minutes}–${minutes+15} minutes`;status.textContent="Location found. Please confirm your delivery address.";const address=document.querySelector('[name="address"]');if(address&&!address.value)address.value=`Location pin: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`},()=>{status.textContent="We couldn’t access your location. Enter your delivery address instead."},{enableHighAccuracy:true,timeout:10000})}
function renderCustomizerProducts(){const options=$(".product-options"),selectable=products.filter(product=>product.category==="ready"||product.category==="pastries");options.innerHTML=selectable.map(product=>`<button type="button" class="choice-pill" data-custom-field="customProduct" data-value="${product.id}"><span class="choice-icon">${product.category==="ready"?"☕":"🥐"}</span><span><strong>${product.name}</strong><small>${product.description}</small></span></button>`).join("");if(!selectable.some(product=>product.id===$("#customProduct").value))$("#customProduct").value=selectable[0].id;$$('[data-custom-field="customProduct"]').forEach(option=>option.classList.toggle("active",option.dataset.value===$("#customProduct").value))}
function renderProducts(){const list=products.filter(p=>state.filter==="all"||p.category===state.filter);$("#product-grid").innerHTML=list.map(p=>`<article class="product-card"><div class="product-photo"><img src="${p.image}" alt="${p.imageAlt}"><span class="product-tag">${p.tag}</span></div><div class="product-info"><div><h3>${p.name}</h3><p>${p.description}</p></div><div class="product-price">${peso(p.price)}<small>per item</small></div></div>${p.category==="ready"?`<div class="menu-temperature"><button type="button" class="menu-choice active" data-menu-temp="hot">Hot</button><button type="button" class="menu-choice" data-menu-temp="iced">Iced</button></div>`:""}<button class="add-product" data-add="${p.id}">Add to basket <span>＋</span></button></article>`).join("")}
function customizerExtra(product,size,drinkType,finish){if(product.category==="ready"){const sizeExtra=drinkType==="iced"?({"12 oz":0,"16 oz":30,"22 oz":60}[size]||0):({"8 oz":0,"12 oz":25,"16 oz":50}[size]||0);return sizeExtra+(finish==="Oat milk (+₱25)"?25:0)}return finish==="Extra cheese (+₱15)"||finish==="Ube drizzle (+₱15)"?15:0}
function updateCustomizer(){const product=products.find(p=>p.id===$("#customProduct").value)||products.find(p=>p.category==="ready"),isDrink=product.category==="ready",drinkType=$("[name='drinkType']").value,image=$("#custom-product-image"),price=$("#custom-product-price"),size=$("#customSizeOptions"),sizeGroup=size.closest(".custom-option"),temperatureGroup=$(".custom-drink-option"),finishLabel=$("#finish-option-label"),finish=$("[name='finish']"),finishGroup=finishLabel.closest(".custom-option"),sweetnessGroup=$(".customizer-form > .custom-option:last-of-type");if(image){image.src=product.image;image.alt=product.imageAlt}if(temperatureGroup)temperatureGroup.hidden=!isDrink;if(sizeGroup)sizeGroup.hidden=!isDrink;if(sweetnessGroup)sweetnessGroup.hidden=!isDrink;if(finishLabel)finishLabel.textContent=isDrink?"Milk":"Pastry Finish";$$("[data-finish-category]").forEach(option=>{const milkOption=["Whole milk","Low-fat dairy","Oat milk (+₱25)"].includes(option.dataset.value),pastryOption=["Classic","Extra cheese (+₱15)","Ube drizzle (+₱15)"].includes(option.dataset.value);option.hidden=isDrink?!milkOption:!pastryOption});const visibleFinish=$(`[data-custom-field="finish"][data-value="${finish.value}"]`);if(visibleFinish?.hidden)finish.value=isDrink?"Whole milk":"Classic";$$('[data-custom-field="finish"]').forEach(option=>option.classList.toggle("active",option.dataset.value===finish.value));if(isDrink&&!["hot","iced"].includes($("[name='drinkType']").value))$("[name='drinkType']").value="hot";const currentSize=$("[name='size']").value,options=isDrink?(drinkType==="iced"?["12 oz","16 oz","22 oz"]:["8 oz","12 oz","16 oz"]):[];if(size){size.innerHTML=options.map((option,index)=>`<button type="button" class="choice-pill ${index===0?"active":""}" data-custom-field="size" data-value="${option}">${option}</button>`).join("");$("[name='size']").value=options.includes(currentSize)?currentSize:options[0];$$('[data-custom-field="size"]').forEach(option=>option.classList.toggle("active",option.dataset.value===$("[name='size']").value))}$$('[data-custom-field="drinkType"]').forEach(option=>option.classList.toggle("active",option.dataset.value===$("[name='drinkType']").value));if(price)price.textContent=peso(product.price+customizerExtra(product,$("[name='size']").value,drinkType,finish.value))}
function cartTotal(){return state.cart.reduce((sum,item)=>sum+item.price*item.qty,0)}
function renderCart(){const count=state.cart.reduce((sum,i)=>sum+i.qty,0),items=state.cart.length?state.cart.map(i=>`<div class="cart-item"><img src="${i.image}" alt=""><div class="cart-item-info"><strong>${i.name}</strong><small>${i.custom||"Standard"} · ${peso(i.price)} each</small></div><div class="qty-controls"><button data-qty="${i.id}" data-change="-1" aria-label="Remove one ${i.name}">−</button><b>${i.qty}</b><button data-qty="${i.id}" data-change="1" aria-label="Add one ${i.name}">+</button></div></div>`).join(""):`<p class="empty-cart-message">Your basket is waiting for its first bold pour.</p>`;$("#cart-count").textContent=count;$("#cart-total").textContent=peso(cartTotal());$("#shop-cart-total").textContent=peso(cartTotal());const checkoutTotal=$("#checkout-total");if(checkoutTotal)checkoutTotal.textContent=peso(cartTotal());$("#cart-items").innerHTML=items;$("#shop-cart-items").innerHTML=items}
function addToCart(id,custom="Standard"){const p=products.find(x=>x.id===id);const existing=state.cart.find(x=>x.id===id&&x.custom===custom);if(existing)existing.qty++;else state.cart.push({...p,qty:1,custom});save();renderCart();toast(`${p.name} added to your basket`)}
function addRewardToCart(reward){const rewardProduct={id:`reward-${reward}`,name:reward==="coffee"?"Free Barako Coffee":"Free Pastry",description:"Loyalty reward",price:0,category:"reward",tag:"Reward",image:reward==="coffee"?products.find(p=>p.id==="latte").image:products.find(p=>p.id==="ensaymada").image};state.cart.push({...rewardProduct,qty:1,custom:"Loyalty reward"});save();renderCart();toast(`${rewardProduct.name} added to your basket`)}
function showDashboard(tab){if(!state.user){openModal("#auth-modal");return}const staff=["staff","admin","hybrid"].includes(state.user.role);openModal("#dashboard-modal");renderDashboard(tab||(staff?"overview":"orders"))}
function renderDashboard(tab){const staff=["staff","admin","hybrid"].includes(state.user.role),orders=state.orders;const hybrid=state.user.role==="hybrid",title=state.user.role==="admin"?"Admin control room":hybrid?"Owner, admin & barista workspace":staff?"Barista dashboard":"Your coffee corner";$("#dashboard-content").innerHTML=`<div class="dashboard-head"><div><span class="role-badge">${hybrid?"customer + admin + barista":state.user.role}</span><h2>${title}</h2><p style="font-size:12px;color:#839087;margin:0">Good day, ${state.user.name||"coffee friend"}.</p></div><button class="text-link" data-action="logout">Log out</button></div><div class="dashboard-tabs">${staff?`<button class="${tab==="overview"?"active":""}" data-dash="overview">Orders</button><button class="${tab==="menu"?"active":""}" data-dash="menu">Menu & stock</button>${hybrid?`<button class="${tab==="customer"?"active":""}" data-dash="customer">Customer view</button>`:""}`:`<button class="${tab==="orders"?"active":""}" data-dash="orders">My orders</button><button class="${tab==="profile"?"active":""}" data-dash="profile">Profile</button>`}</div>${hybrid&&tab==="customer"?customerPanel("orders"):staff?staffPanel(tab):customerPanel(tab)}`;$$("[data-dash]").forEach(b=>b.onclick=()=>renderDashboard(b.dataset.dash))}
function loyaltyCard(){const coffeeReady=state.loyaltyStars>=10,pastryReady=state.loyaltyStars>=8;return `<div class="loyalty-card"><div class="loyalty-top"><div><span class="role-badge">Erickaffe rewards</span><h3>Every cup earns a little more.</h3><p>Collect stars from your orders and redeem a free coffee or pastry.</p></div><strong class="loyalty-count">★ ${state.loyaltyStars}</strong></div><div class="star-track">${Array.from({length:10},(_,i)=>`<span class="${i<state.loyaltyStars%10||state.loyaltyStars>=10?"earned":""}">★</span>`).join("")}</div><small class="loyalty-caption">${state.loyaltyStars>=10?"You reached a coffee reward!":"Earn "+(10-state.loyaltyStars)+" more star(s) for a free Barako coffee."}</small><div class="reward-actions"><button class="reward-btn" data-redeem="coffee" ${coffeeReady?"":"disabled"}>☕ Redeem coffee <small>10 stars</small></button><button class="reward-btn" data-redeem="pastry" ${pastryReady?"":"disabled"}>🥐 Redeem pastry <small>8 stars</small></button></div></div>`}
function customerPanel(tab){const orders=customerOrders(),joined=state.user.createdAt?new Date(state.user.createdAt).getFullYear():"2026";if(tab==="profile")return `${loyaltyCard()}<div class="profile-card"><div class="profile-identity">${accountIcon()}<div><span class="section-label">Customer profile</span><h3>${state.user.name||"Coffee Friend"}</h3><p>${state.user.email||"Your Erickaffe account"}</p></div></div><p class="profile-note">${orders.length?"Welcome back. Your order history and loyalty stars are saved to this account.":"New customer account · Your order history will appear here after your first purchase."}</p></div>`;return `<div class="dashboard-stats"><div class="dash-stat"><span>ORDERS PLACED</span><strong>${orders.length}</strong></div><div class="dash-stat"><span>COFFEE STARS</span><strong>${state.loyaltyStars}</strong></div><div class="dash-stat"><span>MEMBER SINCE</span><strong>${joined}</strong></div></div><h3 style="font:22px 'Playfair Display';margin:30px 0 8px">${orders.length?"Recent orders":"Welcome to Erickaffe"}</h3>${orders.length?orders.slice().reverse().map(order=>`<div class="order-row"><div><strong>${order.id}</strong><small>${order.date}</small></div><div>${order.items} item(s)</div><div>${peso(order.total)}</div><span class="status">${order.status}</span></div>`).join(""):`<p style="font-size:12px;color:#879189">You are a new customer. Your order history will appear after you place your first order.</p>`}`}
function getOrderStatus(order){return state.orderStatuses[order.id]||order.status}
document.addEventListener("click",e=>{const action=e.target.closest("[data-action]")?.dataset.action;if(action==="open-developer"){openModal("#developer-modal")}if(action==="open-auth"){if(state.user){showDashboard("profile")}else{closeModal();openModal("#auth-modal")}}if(action==="open-cart"){renderCart();openModal("#cart-modal")}if(action==="close-modal")closeModal();if(action==="open-checkout"){if(!state.cart.length)return toast("Add a coffee to your basket first");closeModal();openModal("#checkout-modal");updateFulfillment();updatePaymentDetails()}if(action==="use-location")useCurrentLocation();if(action==="scroll-menu")$("#menu").scrollIntoView();if(action==="toggle-menu")$(".main-nav").classList.toggle("mobile-open");if(action==="logout"){state.user=null;save();updateAccountControls();closeModal();toast("You have been logged out")}const add=e.target.closest("[data-add]");if(add){const temp=add.parentElement.querySelector(".menu-choice.active")?.dataset.menuTemp;addToCart(add.dataset.add,temp?`${temp} coffee`:"Standard")}const choice=e.target.closest("[data-custom-field]");if(choice){const field=choice.dataset.customField,input=$(`[name="${field}"]`);if(input)input.value=choice.dataset.value;choice.parentElement.querySelectorAll("[data-custom-field]").forEach(button=>button.classList.remove("active"));choice.classList.add("active");if(field==="customProduct"||field==="drinkType")updateCustomizer();else{const product=products.find(p=>p.id===$("#customProduct").value);$("#custom-product-price").textContent=peso(product.price+customizerExtra(product,$("[name='size']").value,$("[name='drinkType']").value,$("[name='finish']").value))}}const menuChoice=e.target.closest("[data-menu-temp]");if(menuChoice){menuChoice.parentElement.querySelectorAll("[data-menu-temp]").forEach(button=>button.classList.remove("active"));menuChoice.classList.add("active")}const custom=e.target.closest("[data-product]");if(custom)addToCart(custom.dataset.product,"Standard gift box");const redeem=e.target.closest("[data-redeem]");if(redeem&&!redeem.disabled){const reward=redeem.dataset.redeem,cost=reward==="coffee"?10:8;if(state.loyaltyStars<cost)return toast("Keep collecting stars for this reward");state.loyaltyStars-=cost;state.user.loyaltyStars=state.loyaltyStars;state.customerProfiles[state.user.email].loyaltyStars=state.loyaltyStars;save();addRewardToCart(reward);if($("#dashboard-modal")&&!$("#dashboard-modal").hidden)renderDashboard("orders")}const qty=e.target.closest("[data-qty]");if(qty){const item=state.cart.find(i=>i.id===qty.dataset.qty);item.qty+=Number(qty.dataset.change);if(item.qty<=0)state.cart=state.cart.filter(i=>i!==item);save();renderCart()}const stockSave=e.target.closest("[data-save-stock]");if(stockSave){const input=document.querySelector(`[data-stock-id="${stockSave.dataset.saveStock}"]`);state.inventory[stockSave.dataset.saveStock]=Math.max(0,Number(input.value)||0);save();toast("Stock quantity updated");renderDashboard("menu")}});
document.addEventListener("click",e=>{if(e.target.classList.contains("modal-backdrop"))closeModal()});
document.addEventListener("click",e=>{if(e.target.closest('[data-action="clear-cart"]')){state.cart=[];save();renderCart();toast("Your cart is clear")}})
document.addEventListener("click",e=>{const button=e.target.closest("[data-save-stock]");if(!button)return;const id=button.dataset.saveStock,stockInput=document.querySelector(`[data-stock-id="${id}"]`),priceInput=document.querySelector(`[data-price-id="${id}"]`),stock=stockInput?.valueAsNumber,price=priceInput?.valueAsNumber,product=products.find(item=>item.id===id);if(!stockInput||!priceInput||!product||!Number.isFinite(stock)||stock<0||!Number.isFinite(price)||price<0){e.preventDefault();e.stopImmediatePropagation();toast("Enter a valid non-negative price and stock quantity.");return}state.inventory[id]=stock;product.price=price;save();e.preventDefault();e.stopImmediatePropagation();renderProducts();toast("Product price and stock updated");renderDashboard("menu")},true);
document.addEventListener("click",e=>{const tabLink=e.target.closest("[data-tab-link]");if(tabLink){e.preventDefault();closeModal();showTab(tabLink.dataset.tabLink);$(".main-nav").classList.remove("mobile-open")}});
document.addEventListener("change",e=>{if(e.target.id==="customProduct")updateCustomizer();const status=e.target.closest("[data-order-status]");if(status){state.orderStatuses[status.dataset.orderStatus]=status.value;const order=state.orders.find(o=>o.id===status.dataset.orderStatus);if(order)order.status=status.value;save();toast(`Order ${status.dataset.orderStatus} marked ${status.value.toLowerCase()}`);renderDashboard("overview");return}if(e.target.id==="payment-method")updatePaymentDetails();if(e.target.id==="fulfillment-method")updateFulfillment()});
$$(".filter-btn").forEach(b=>b.onclick=()=>{$$(".filter-btn").forEach(x=>x.classList.toggle("active",x.dataset.filter===b.dataset.filter));state.filter=b.dataset.filter;renderProducts()});
$$("[data-auth-tab]").forEach(b=>b.onclick=()=>{$$("[data-auth-tab]").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#login-panel").hidden=b.dataset.authTab!=="login";$("#register-panel").hidden=b.dataset.authTab!=="register"});

$("#login-form").onsubmit = async e => {
  e.preventDefault();

  const data = new FormData(e.target);

  const email = String(data.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(data.get("password") || "");

  try {
    const response = await fetch("api/auth.php", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "login",
        email,
        password
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Login failed.");
    }

    const account = result.user;
    const oldProfile = state.customerProfiles[account.email] || {};

    state.user = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      createdAt: oldProfile.createdAt || new Date().toISOString(),
      loyaltyStars: Number(account.loyaltyStars) || 0
    };

    state.loyaltyStars = Number(account.loyaltyStars) || 0;

    state.customerProfiles[account.email] = {
      ...oldProfile,
      name: account.name,
      createdAt: state.user.createdAt,
      loyaltyStars: state.loyaltyStars
    };

    save();
    updateAccountControls();
    closeModal();

    toast("Login successful!");

    setTimeout(() => showDashboard(), 400);

    } catch (error) {
    console.error("Login error:", error);
    toast(error.message || "Unable to log in. Please try again.");
  }
};
$("#checkout-form").addEventListener("submit",()=>{const lines=state.cart.map(item=>({name:item.name,qty:item.qty,price:item.price,custom:item.custom||"Standard"}));setTimeout(()=>{const receipt=$("#checkout-content .receipt");if(!receipt||!lines.length)return;const summary=document.createElement("section");summary.className="order-summary-list";summary.innerHTML=`<h3>Order summary</h3>${lines.map(item=>`<div><span>${item.qty} × ${item.name}<small>${item.custom}</small></span><strong>${peso(item.price*item.qty)}</strong></div>`).join("")}`;receipt.insertBefore(summary,receipt.querySelector(".receipt-details"))},0)},true);
closeModal();updateAccountControls();renderCustomizerProducts();renderProducts();renderCart();updatePaymentDetails();updateCustomizer();
showTab(["history","shop","project"].includes(location.hash.slice(1))?location.hash.slice(1):"history");

const statusFlow={Pending:["Preparing","Cancelled"],Preparing:["Ready for Pickup","Out for Delivery","Cancelled"],"Ready for Pickup":["Received/Completed","Cancelled"],"Out for Delivery":["Received/Completed","Cancelled"],"Received/Completed":[],"Cancelled":[]};
state.inventoryHistory=JSON.parse(localStorage.getItem("erickaffe-inventory-history")||"[]");
state.products=JSON.parse(localStorage.getItem("erickaffe-products")||"{}");
const previousCoffeeImages={
  drip:"https://images.pexels.com/photos/39468351/pexels-photo-39468351/free-photo-of-pour-over-coffee-bag-in-striped-mug.jpeg?auto=compress&cs=tinysrgb&w=700",
  brewbox:"https://images.pexels.com/photos/7488464/pexels-photo-7488464.jpeg?auto=compress&cs=tinysrgb&w=700",
  kapeng:"https://images.pexels.com/photos/38523136/pexels-photo-38523136/free-photo-of-red-cup-of-coffee-with-wooden-saucer-on-wooden-table.jpeg?auto=compress&cs=tinysrgb&w=700",
  "batangas-barako":"https://images.pexels.com/photos/36879948/pexels-photo-36879948/free-photo-of-cozy-coffee-cup-with-dried-floral-decoration.jpeg?auto=compress&cs=tinysrgb&w=700",
  latte:"https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&w=700",
  "spanish-latte":"https://images.pexels.com/photos/34534271/pexels-photo-34534271.jpeg?auto=compress&cs=tinysrgb&w=700",
  "barako-mocha":"https://images.pexels.com/photos/14761085/pexels-photo-14761085.jpeg?auto=compress&cs=tinysrgb&w=700",
  "matcha-latte":"https://images.pexels.com/photos/31599066/pexels-photo-31599066/free-photo-of-refreshing-iced-matcha-latte-with-sunglasses.jpeg?auto=compress&cs=tinysrgb&w=700",
  "vietnamese-coffee":"https://images.pexels.com/photos/31990173/pexels-photo-31990173/free-photo-of-vietnamese-iced-coffee-and-vintage-camera-on-wooden-table.jpeg?auto=compress&cs=tinysrgb&w=700",
  "iced-coffee":"https://images.pexels.com/photos/35229818/pexels-photo-35229818-free-photo-of-chilled-ice-coffee-on-sunny-day-outdoors.jpeg?auto=compress&cs=tinysrgb&w=700",
  "caramel-latte":"https://images.pexels.com/photos/5112646/pexels-photo-5112646.jpeg?auto=compress&cs=tinysrgb&w=700",
  "vanilla-latte":"https://images.pexels.com/photos/5112649/pexels-photo-5112649.jpeg?auto=compress&cs=tinysrgb&w=700",
  cappuccino:"https://images.pexels.com/photos/459489/pexels-photo-459489.jpeg?auto=compress&cs=tinysrgb&w=700",
  americano:"https://images.pexels.com/photos/28625189/pexels-photo-28625189/free-photo-of-minimalist-coffee-cup-in-shadowy-light.jpeg?auto=compress&cs=tinysrgb&w=700"
};
let coffeeImagesMigrated=false;
Object.entries(previousCoffeeImages).forEach(([id,previousImage])=>{
  if(state.products[id]?.image===previousImage){
    state.products[id].image=products.find(product=>product.id===id).image;
    coffeeImagesMigrated=true;
  }
});
if(coffeeImagesMigrated)localStorage.setItem("erickaffe-products",JSON.stringify(state.products));
const previousPastryImages={
  ensaymada:"https://images.pexels.com/photos/5640027/pexels-photo-5640027.png?auto=compress&cs=tinysrgb&w=700",
  "ube-roll":"https://images.pexels.com/photos/6896282/pexels-photo-6896282.jpeg?auto=compress&cs=tinysrgb&w=700",
  panutsa:"https://images.pexels.com/photos/14513406/pexels-photo-14513406.jpeg?auto=compress&cs=tinysrgb&w=700",
  "barako-crinkles":"https://images.pexels.com/photos/18790381/pexels-photo-18790381/free-photo-of-cookies-on-black-background.jpeg?auto=compress&cs=tinysrgb&w=700"
};
let pastryImagesMigrated=false;
Object.entries(previousPastryImages).forEach(([id,previousImage])=>{
  if(state.products[id]?.image===previousImage){
    state.products[id].image=products.find(product=>product.id===id).image;
    pastryImagesMigrated=true;
  }
});
if(pastryImagesMigrated)localStorage.setItem("erickaffe-products",JSON.stringify(state.products));
const checkoutMarkup=$("#checkout-content").innerHTML;
$("#checkout-form").onsubmit=null;
const authNotice=$("#login-panel .demo-hint");if(authNotice)authNotice.textContent="Demo only: accounts, passwords, and roles are stored in this browser. Do not use real credentials; secure sign-in requires a backend.";
products.forEach(product=>Object.assign(product,state.products[product.id]||{}));
products.forEach(product=>{if(product.active===undefined)product.active=true});

function effectiveRole(user=state.user){
  if(!user)return "customer";
  if(user.email==="barista@erickaffe.com")return "barista";
  if(user.email==="admin@erickaffe.com")return "staff";
  if(user.email==="owner@erickaffe.com")return "owner";
  return "customer";
}
function save(){
  localStorage.setItem("erickaffe-cart",JSON.stringify(state.cart));
  localStorage.setItem("erickaffe-user",JSON.stringify(state.user));
  localStorage.setItem("erickaffe-orders",JSON.stringify(state.orders));
  localStorage.setItem("erickaffe-inventory",JSON.stringify(state.inventory));
  localStorage.setItem("erickaffe-order-statuses",JSON.stringify(state.orderStatuses));
  localStorage.setItem("erickaffe-loyalty-stars",String(state.loyaltyStars));
  localStorage.setItem("erickaffe-customer-profiles",JSON.stringify(state.customerProfiles));
  localStorage.setItem("erickaffe-newsletter",JSON.stringify(state.newsletterSubscribers));
  localStorage.setItem("erickaffe-product-prices",JSON.stringify(Object.fromEntries(products.map(product=>[product.id,product.price]))));
  localStorage.setItem("erickaffe-products",JSON.stringify(Object.fromEntries(products.map(product=>[product.id,{name:product.name,description:product.description,image:product.image,imageAlt:product.imageAlt,price:product.price,active:product.active,category:product.category,tag:product.tag}]))));
  localStorage.setItem("erickaffe-inventory-history",JSON.stringify(state.inventoryHistory));
}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]))}
function accountIcon(){
  if(!state.user)return `<svg class="account-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.25"></circle><path d="M5.5 20c.7-3.25 3.05-5 6.5-5s5.8 1.75 6.5 5"></path></svg>`;
  const initials=String(state.user.name||"Coffee Friend").split(/\s+/).filter(Boolean).slice(0,2).map(word=>word[0].toUpperCase()).join("");
  return `<span class="account-avatar" aria-hidden="true">${escapeHtml(initials)}</span>`;
}
function getOrderStatus(order){
  const saved=state.orderStatuses[order.id]||order.status||"Pending";
  if(saved==="Received")return "Pending";
  if(saved==="Ready")return order.fulfillment==="pickup"?"Ready for Pickup":"Out for Delivery";
  if(saved==="Completed")return "Received/Completed";
  return saved;
}
function statusBadge(status){return `<span class="status ${status==="Pending"?"pending":""}">${escapeHtml(status)}</span>`}
function orderLines(order){
  const lines=Array.isArray(order.lineItems)?order.lineItems:[];
  return lines.length?`<ul class="order-lines">${lines.map(item=>`<li><strong>${Number(item.qty)||1} × ${escapeHtml(item.name)}</strong><small>${escapeHtml(item.custom||"Standard")} · ${peso(Number(item.price)||0)} each</small>${item.specialInstructions?`<small>Note: ${escapeHtml(item.specialInstructions)}</small>`:""}</li>`).join("")}</ul>`:`<p>${Number(order.items)||0} item(s) · line-item details unavailable for this older order</p>`;
}
function transitionButtons(order){
  const allowed=(statusFlow[getOrderStatus(order)]||[]).filter(next=>getOrderStatus(order)!=="Preparing"||next==="Cancelled"||next===(order.fulfillment==="pickup"?"Ready for Pickup":"Out for Delivery"));
  return allowed.map(next=>`<button class="status-action ${next==="Cancelled"?"danger-action":""}" data-order-next="${escapeHtml(order.id)}" data-next-status="${escapeHtml(next)}">${next==="Preparing"?"Accept & prepare":next==="Ready for Pickup"?"Ready for pickup":next==="Out for Delivery"?"Handed to delivery":next==="Received/Completed"?"Confirm handoff":next}</button>`).join("");
}
function orderCard(order,withPayment=false){
  const status=getOrderStatus(order),flowMethod=order.fulfillment==="pickup"?"Self Pickup":"Delivery";
  return `<article class="management-order"><div class="management-order-head"><div><strong>${escapeHtml(order.id)}</strong><small>${escapeHtml(order.createdAt||order.date||"Order time unavailable")} · ${escapeHtml(order.receiver||"Customer")}</small></div><div>${statusBadge(status)}<span class="fulfillment-badge">${flowMethod}</span></div></div>${orderLines(order)}<div class="order-meta"><span>${escapeHtml(order.address||"")}</span><strong>${peso(Number(order.total)||0)}</strong></div><div class="order-meta"><span>Payment: ${escapeHtml(order.payment||"Not recorded")} · ${escapeHtml(order.paymentStatus||"Pending")}</span><span>${order.eta?`ETA ${escapeHtml(order.eta)}`:""}</span></div>${withPayment?`<label class="payment-status-control">Payment status<select data-payment-order="${escapeHtml(order.id)}"><option ${order.paymentStatus==="Pending"?"selected":""}>Pending</option><option ${order.paymentStatus==="Paid"?"selected":""}>Paid</option><option ${order.paymentStatus==="Failed"?"selected":""}>Failed</option><option ${order.paymentStatus==="Refunded"?"selected":""}>Refunded</option></select></label>`:""}<div class="status-actions">${transitionButtons(order)}</div></article>`;
}
function customerPanel(tab){
  const orders=customerOrders(),joined=state.user.createdAt?new Date(state.user.createdAt).getFullYear():"2026";
  if(tab==="profile")return `${loyaltyCard()}<div class="profile-card"><div class="profile-identity">${accountIcon()}<div><span class="section-label">Customer profile</span><h3>${escapeHtml(state.user.name||"Coffee Friend")}</h3><p>${escapeHtml(state.user.email||"Your Erickaffe account")}</p></div></div><p class="profile-note">${orders.length?"Your order tracking and loyalty stars are saved in this browser.":"New customer account · Your order history will appear here after your first purchase."}</p></div>`;
  return `<div class="dashboard-stats"><div class="dash-stat"><span>ORDERS PLACED</span><strong>${orders.length}</strong></div><div class="dash-stat"><span>COFFEE STARS</span><strong>${state.loyaltyStars}</strong></div><div class="dash-stat"><span>MEMBER SINCE</span><strong>${joined}</strong></div></div><h3 class="dashboard-section-title">${orders.length?"Order tracking":"Welcome to Erickaffe"}</h3>${orders.length?orders.slice().reverse().map(order=>`<article class="management-order"><div class="management-order-head"><div><strong>${escapeHtml(order.id)}</strong><small>${escapeHtml(order.createdAt||order.date)}</small></div>${statusBadge(getOrderStatus(order))}</div>${orderLines(order)}<div class="order-meta"><span>${escapeHtml(order.fulfillment==="pickup"?"Self Pickup":"Delivery")} · ${escapeHtml(order.address||"")}</span><strong>${peso(Number(order.total)||0)}</strong></div><div class="order-meta"><span>Payment: ${escapeHtml(order.payment||"Not recorded")} · ${escapeHtml(order.paymentStatus||"Pending")}</span><span>${escapeHtml(order.eta||"")}</span></div></article>`).join(""):`<p class="dashboard-note">Your order history will appear here after your first purchase.</p>`}`;
}
function showDashboard(tab){
  if(!state.user){openModal("#auth-modal");return}
  const role=effectiveRole();
  openModal("#dashboard-modal");
  renderDashboard(tab||(role==="customer"?"orders":"overview"));
}
function renderDashboard(tab){
  const role=effectiveRole(),tabs=role==="barista"?[["overview","Orders"]]:role==="staff"?[["inventory","Inventory"]]:role==="owner"?[["overview","Overview"],["orders","Orders"],["menu","Menu"],["inventory","Inventory"],["newsletters","Newsletters"]]:[["orders","My orders"],["profile","Profile"]];
  const selected=tabs.some(([key])=>key===tab)?tab:tabs[0][0],title={barista:"Barista dashboard",staff:"Staff inventory",owner:"Owner dashboard",customer:"Your coffee corner"}[role];
  $("#dashboard-content").innerHTML=`<div class="dashboard-head"><div><span class="role-badge">${escapeHtml(role)}</span><h2>${title}</h2><p class="dashboard-greeting">Good day, ${escapeHtml(state.user.name||"coffee friend")}.</p></div><button class="text-link" data-action="logout">Log out</button></div><div class="dashboard-tabs">${tabs.map(([key,label])=>`<button class="${selected===key?"active":""}" data-dash="${key}">${label}</button>`).join("")}</div>${role==="barista"?baristaPanel():role==="staff"?inventoryPanel(true):role==="owner"?ownerPanel(selected):customerPanel(selected)}`;
  const securityNote=selected==="newsletters"?"Newsletter management is protected by the server session. Campaign results are simulations only; no emails are sent.":"Standalone demo: records stay in this browser and role screens are not secure authentication. Do not use this site for real customer data or business administration without a backend.";
  $("#dashboard-content").insertAdjacentHTML("beforeend",`<p class="dashboard-note role-security-note">${securityNote}</p>`);
  if(role==="owner"&&selected==="newsletters")loadNewsletterDashboard();
  $$("[data-dash]").forEach(button=>button.onclick=()=>renderDashboard(button.dataset.dash));
}
function baristaPanel(){
  const groups=["Pending","Preparing","Ready for Pickup","Out for Delivery"];
  return `<p class="dashboard-note">Orders are saved in this browser only. Confirm each handoff after the customer receives the order.</p>${groups.map(status=>{const orders=state.orders.filter(order=>getOrderStatus(order)===status);return `<section class="order-group"><h3>${status} <span>${orders.length}</span></h3>${orders.length?orders.slice().reverse().map(order=>orderCard(order)).join(""):`<p class="dashboard-note">No ${status.toLowerCase()} orders.</p>`}</section>`}).join("")}`;
}
function inventoryRows(){
  return products.map(product=>`<div class="inventory-item ${effectiveRole()==="staff"?"inventory-staff-row":""}"><div><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.category)} · ${Number(state.inventory[product.id])||0} in stock</small></div><span class="stock-alert ${(Number(state.inventory[product.id])||0)<=5?"low-stock":""}">${(Number(state.inventory[product.id])||0)<=5?"Low stock":"In stock"}</span>${effectiveRole()==="staff"?`<label class="restock-input">Quantity<input type="number" min="1" step="1" inputmode="numeric" data-restock-qty="${escapeHtml(product.id)}"></label><button class="status-action" data-restock="${escapeHtml(product.id)}">Record restock</button><button class="status-action danger-action" data-adjust-stock="${escapeHtml(product.id)}">Adjust stock down</button>`:""}</div>`).join("");
}
function inventoryPanel(canRestock=false){
  const history=state.inventoryHistory.slice().reverse().slice(0,30);
  return `<div class="dashboard-stats"><div class="dash-stat"><span>PRODUCT STOCK ITEMS</span><strong>${products.length}</strong></div><div class="dash-stat"><span>LOW STOCK ALERTS</span><strong>${products.filter(product=>(Number(state.inventory[product.id])||0)<=5).length}</strong></div><div class="dash-stat"><span>RESTOCK EVENTS</span><strong>${state.inventoryHistory.length}</strong></div></div><h3 class="dashboard-section-title">Current product stock</h3><p class="dashboard-note">These are the existing product-level stock counts in the project; separate bean, milk, cup, and syrup stock records do not exist.</p><div class="inventory-list">${inventoryRows()}</div><h3 class="dashboard-section-title">Inventory movement history</h3>${history.length?history.map(move=>`<div class="history-row"><strong>${escapeHtml(move.productName)}</strong><span>${move.delta>0?"+":"−"}${move.quantity} · ${escapeHtml(move.type)}</span><small>${escapeHtml(move.at)} · ${escapeHtml(move.by)}</small></div>`).join(""):`<p class="dashboard-note">No inventory movements have been recorded.</p>`}`;
}
function ownerPanel(tab){
  if(tab==="newsletters")return `<section class="newsletter-admin" id="newsletter-admin-panel"><p class="dashboard-note">Mock newsletter system for this school project. All previews and campaign results are simulated; no emails are sent.</p><p>Loading newsletter management…</p></section>`;
  if(tab==="orders")return `<h3 class="dashboard-section-title">All orders and payment records</h3>${state.orders.length?state.orders.slice().reverse().map(order=>orderCard(order,true)).join(""):`<p class="dashboard-note">No recorded orders yet.</p>`}`;
  if(tab==="menu")return `<h3 class="dashboard-section-title">Menu & product management</h3><form class="product-add-form" id="product-add-form"><label>Product name<input name="name" required maxlength="80"></label><label>Description<input name="description" required maxlength="180"></label><div class="product-form-row"><label>Price (₱)<input name="price" type="number" min="0" step="0.01" required></label><label>Image URL<input name="image" type="url" required placeholder="https://…"></label><label>Category<select name="category"><option value="ready">Ready-to-drink</option><option value="beans">Coffee & beans</option><option value="pastries">Pastries</option></select></label></div><button class="status-action">Add product</button></form>${products.map(product=>`<form class="owner-product-form" data-product-form="${escapeHtml(product.id)}"><strong>${escapeHtml(product.name)}</strong><div class="product-form-row"><label>Name<input name="name" value="${escapeHtml(product.name)}" required maxlength="80"></label><label>Description<input name="description" value="${escapeHtml(product.description)}" required maxlength="180"></label><label>Price (₱)<input name="price" type="number" min="0" step="0.01" value="${Number(product.price)}" required></label><label>Image URL<input name="image" type="text" inputmode="url" value="${escapeHtml(product.image)}" required></label></div><label class="availability-control"><input name="active" type="checkbox" ${product.active!==false?"checked":""}> Available on customer menu</label><button class="status-action">Save product</button></form>`).join("")}`;
  if(tab==="inventory")return inventoryPanel(false);
  const timestamp=order=>new Date(order.createdAtIso||order.createdAt||0).getTime(),now=Date.now(),orders=state.orders,paid=orders.filter(order=>order.paymentStatus==="Paid"),sum=items=>items.reduce((total,order)=>total+(Number(order.total)||0),0),period=milliseconds=>orders.filter(order=>now-timestamp(order)<milliseconds),counts={daily:period(86400000),weekly:period(7*86400000),monthly:period(30*86400000)},sales={daily:sum(paid.filter(order=>now-timestamp(order)<86400000)),weekly:sum(paid.filter(order=>now-timestamp(order)<7*86400000)),monthly:sum(paid.filter(order=>now-timestamp(order)<30*86400000))};
  const best={};orders.filter(order=>getOrderStatus(order)==="Received/Completed").forEach(order=>(order.lineItems||[]).forEach(item=>best[item.name]=(best[item.name]||0)+(Number(item.qty)||1)));const winners=Object.entries(best).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const trend=Array.from({length:7},(_,index)=>{const day=new Date(now);day.setHours(0,0,0,0);day.setDate(day.getDate()-(6-index));const key=day.toDateString(),amount=sum(paid.filter(order=>new Date(timestamp(order)).toDateString()===key));return {label:day.toLocaleDateString("en-PH",{weekday:"short"}),amount}}),maxTrend=Math.max(1,...trend.map(day=>day.amount));
  return `<div class="dashboard-stats"><div class="dash-stat"><span>PAID TODAY</span><strong>${peso(sales.daily)}</strong></div><div class="dash-stat"><span>PAID THIS WEEK</span><strong>${peso(sales.weekly)}</strong></div><div class="dash-stat"><span>PAID THIS MONTH</span><strong>${peso(sales.monthly)}</strong></div></div><div class="dashboard-stats owner-counts"><div class="dash-stat"><span>ORDERS TODAY</span><strong>${counts.daily.length}</strong></div><div class="dash-stat"><span>ORDERS THIS WEEK</span><strong>${counts.weekly.length}</strong></div><div class="dash-stat"><span>ORDERS THIS MONTH</span><strong>${counts.monthly.length}</strong></div></div><p class="dashboard-note">Paid totals include only orders manually marked Paid after out-of-band verification. Pending-payment orders are not reported as revenue.</p><h3 class="dashboard-section-title">Paid order value · last 7 days</h3><div class="trend-chart" role="img" aria-label="Paid order value for each of the last seven days">${trend.map(day=>`<div class="trend-day" title="${day.label}: ${peso(day.amount)}"><span class="trend-bar" style="height:${Math.max(5,day.amount/maxTrend*100)}%"></span><small>${day.label}</small></div>`).join("")}</div><h3 class="dashboard-section-title">Best-selling completed products</h3>${winners.length?winners.map(([name,qty])=>`<div class="history-row"><strong>${escapeHtml(name)}</strong><span>${qty} sold</span></div>`).join(""):`<p class="dashboard-note">No completed product sales have been recorded yet.</p>`}<h3 class="dashboard-section-title">Current order status totals</h3>${["Pending","Preparing","Ready for Pickup","Out for Delivery","Received/Completed","Cancelled"].map(status=>`<div class="history-row"><strong>${status}</strong><span>${orders.filter(order=>getOrderStatus(order)===status).length}</span></div>`).join("")}`;
}
let newsletterCsrfToken="";
let newsletterActiveCount=0;
async function newsletterRequest(payload){
  if(!newsletterCsrfToken){
    const tokenResponse=await fetch("api/newsletter.php?action=token",{credentials:"same-origin"});
    const tokenResult=await tokenResponse.json();
    if(!tokenResponse.ok||!tokenResult.success)throw new Error(tokenResult.message||"Unable to start the newsletter request.");
    newsletterCsrfToken=tokenResult.csrfToken;
  }
  const response=await fetch("api/newsletter.php",{
    method:"POST",
    credentials:"same-origin",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({...payload,csrfToken:newsletterCsrfToken})
  });
  const result=await response.json();
  if(!response.ok||!result.success)throw new Error(result.message||"Newsletter request failed.");
  return result;
}
function renderNewsletterAdmin(data){
  const target=$("#newsletter-admin-panel");
  if(!target)return;
  const recipients=data.recipients||[],subscribers=data.subscribers||[],campaigns=data.campaigns||[];
  newsletterActiveCount=Number(data.recipientCount)||0;
  target.innerHTML=`<p class="dashboard-note">Mock newsletter system for this school project. All previews and campaign results are simulated; no emails are sent.</p><h3 class="dashboard-section-title">Create a mock campaign</h3><form id="newsletter-campaign-form" class="newsletter-campaign-form"><label>Campaign subject<input name="subject" maxlength="200" required></label><label>Message<textarea name="message" maxlength="10000" required></textarea></label><button type="submit" class="status-action">Preview campaign</button></form><div id="newsletter-campaign-preview" class="newsletter-campaign-preview" hidden></div><p id="newsletter-admin-feedback" class="newsletter-feedback" role="status" aria-live="polite"></p><h3 class="dashboard-section-title">Recipients (${newsletterActiveCount} subscribed)</h3>${recipients.length?`<div class="newsletter-subscriber-list">${recipients.map(recipient=>`<div class="newsletter-subscriber"><span><strong>${escapeHtml(recipient.email)}</strong><small>Active recipient · subscribed ${escapeHtml(recipient.subscribed_at||"")}</small></span></div>`).join("")}</div>`:`<p class="dashboard-note">No active newsletter recipients.</p>`}<h3 class="dashboard-section-title">All subscriptions (${subscribers.length})</h3>${subscribers.length?`<div class="newsletter-subscriber-list">${subscribers.map(subscriber=>`<div class="newsletter-subscriber"><span><strong>${escapeHtml(subscriber.email)}</strong><small>Subscribed ${escapeHtml(subscriber.subscribed_at||"")} · ${escapeHtml(subscriber.status)}</small></span>${subscriber.status==="subscribed"?`<button type="button" class="status-action danger-action" data-newsletter-unsubscribe="${Number(subscriber.subscriber_id)}">Mark unsubscribed</button>`:""}</div>`).join("")}</div>`:`<p class="dashboard-note">No newsletter subscriptions yet.</p>`}<h3 class="dashboard-section-title">Saved campaign simulations</h3>${campaigns.length?campaigns.map(campaign=>`<div class="newsletter-campaign-row"><strong>${escapeHtml(campaign.subject)}</strong><span>${Number(campaign.recipient_count)} subscribed recipient(s) · ${escapeHtml(campaign.simulation_status)} · ${escapeHtml(campaign.created_at)}</span></div>`).join(""):`<p class="dashboard-note">No campaigns have been simulated.</p>`}`;
}
async function loadNewsletterDashboard(){
  const target=$("#newsletter-admin-panel");
  if(!target)return;
  try{
    const data=await newsletterRequest({action:"list"});
    renderNewsletterAdmin(data);
  }catch(error){
    target.innerHTML=`<p class="newsletter-feedback error">${escapeHtml(error.message||"Unable to load newsletter management.")}</p>`;
  }
}
function makeNewsletterRequestKey(){
  return Array.from(crypto.getRandomValues(new Uint8Array(32)),byte=>byte.toString(16).padStart(2,"0")).join("");
}
document.addEventListener("submit",async event=>{
  const form=event.target;
  if(form.id==="newsletter-form"){
    event.preventDefault();
    event.stopImmediatePropagation();
    const feedback=$("#newsletter-feedback");
    const submit=form.querySelector('[type="submit"]');
    if(form.dataset.submitting==="true")return;
    form.dataset.submitting="true";
    if(submit)submit.disabled=true;
    feedback.textContent="Saving your subscription…";
    feedback.className="newsletter-feedback";
    try{
      const result=await newsletterRequest({action:"subscribe",email:new FormData(form).get("email")});
      const email=result.welcomeEmail;
      feedback.innerHTML=`<p>${escapeHtml(result.message)}</p><article class="mock-welcome-email"><strong>SIMULATED WELCOME EMAIL · NOT SENT</strong><dl><dt>From</dt><dd>${escapeHtml(email.sender)}</dd><dt>To</dt><dd>${escapeHtml(email.recipient)}</dd><dt>Subject</dt><dd>${escapeHtml(email.subject)}</dd></dl><p>${escapeHtml(email.preview)}</p></article>`;
      form.reset();
    }catch(error){
      feedback.textContent=error.message||"Unable to subscribe. Please try again.";
      feedback.className=`newsletter-feedback ${error.message?.includes("already subscribed")?"notice":"error"}`;
    }finally{
      delete form.dataset.submitting;
      if(submit)submit.disabled=false;
    }
    return;
  }
  if(form.id==="newsletter-campaign-form"){
    event.preventDefault();
    event.stopImmediatePropagation();
    const data=new FormData(form),subject=String(data.get("subject")||"").trim(),message=String(data.get("message")||"").trim();
    const preview=$("#newsletter-campaign-preview");
    if(!subject||!message){preview.hidden=true;return}
    preview.dataset.subject=subject;
    preview.dataset.message=message;
    preview.dataset.requestKey=makeNewsletterRequestKey();
    preview.innerHTML=`<p class="newsletter-simulation-label">CAMPAIGN PREVIEW · SIMULATION ONLY</p><h4>${escapeHtml(subject)}</h4><p>${escapeHtml(message).replace(/\n/g,"<br>")}</p><p>Would simulate for ${newsletterActiveCount} currently subscribed recipient(s). No emails will be sent.</p><button type="button" class="status-action" data-newsletter-confirm>Confirm simulated campaign</button>`;
    preview.hidden=false;
    $("#newsletter-admin-feedback").textContent="";
  }
},{capture:true});
document.addEventListener("click",async event=>{
  const unsubscribe=event.target.closest("[data-newsletter-unsubscribe]");
  if(unsubscribe){
    event.preventDefault();
    if(unsubscribe.disabled)return;
    unsubscribe.disabled=true;
    const feedback=$("#newsletter-admin-feedback");
    try{
      const result=await newsletterRequest({action:"unsubscribe",subscriberId:unsubscribe.dataset.newsletterUnsubscribe});
      await loadNewsletterDashboard();
      $("#newsletter-admin-feedback").textContent=result.message;
    }catch(error){
      feedback.textContent=error.message||"Unable to update subscriber status.";
      feedback.className="newsletter-feedback error";
      unsubscribe.disabled=false;
    }
    return;
  }
  const confirmButton=event.target.closest("[data-newsletter-confirm]");
  if(!confirmButton)return;
  event.preventDefault();
  if(confirmButton.disabled)return;
  confirmButton.disabled=true;
  const preview=$("#newsletter-campaign-preview"),feedback=$("#newsletter-admin-feedback");
  try{
    const result=await newsletterRequest({
      action:"simulate",
      subject:preview.dataset.subject,
      message:preview.dataset.message,
      requestKey:preview.dataset.requestKey
    });
    await loadNewsletterDashboard();
    $("#newsletter-admin-feedback").textContent=`${result.message} Simulated recipients: ${result.recipientCount}.`;
  }catch(error){
    feedback.textContent=error.message||"Unable to record the campaign simulation.";
    feedback.className="newsletter-feedback error";
    confirmButton.disabled=false;
  }
});
function renderProducts(){
  const list=products.filter(product=>product.active!==false&&(state.filter==="all"||product.category===state.filter));
  $("#product-grid").innerHTML=list.map(product=>{const inStock=(Number(state.inventory[product.id])||0)>0;return `<article class="product-card"><div class="product-photo"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.imageAlt||product.name)}"><span class="product-tag">${escapeHtml(product.tag||"Erickaffe")}</span></div><div class="product-info"><div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description)}</p></div><div class="product-price">${peso(product.price)}<small>per item</small></div></div>${product.category==="ready"?`<div class="menu-temperature"><button type="button" class="menu-choice active" data-menu-temp="hot">Hot</button><button type="button" class="menu-choice" data-menu-temp="iced">Iced</button></div>`:""}<button class="add-product" data-add="${escapeHtml(product.id)}" ${inStock?"":"disabled"}>${inStock?"Add to basket":"Out of stock"} <span>＋</span></button></article>`}).join("");
}
function renderCustomizerProducts(){
  const options=$(".product-options"),selectable=products.filter(product=>product.active!==false&&(Number(state.inventory[product.id])||0)>0&&(product.category==="ready"||product.category==="pastries"));
  options.innerHTML=selectable.map(product=>`<button type="button" class="choice-pill" data-custom-field="customProduct" data-value="${escapeHtml(product.id)}"><span class="choice-icon">${product.category==="ready"?"☕":"🥐"}</span><span><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.description)}</small></span></button>`).join("");
  if(!selectable.some(product=>product.id===$("#customProduct").value))$("#customProduct").value=selectable[0]?.id||"";
  $$('[data-custom-field="customProduct"]').forEach(option=>option.classList.toggle("active",option.dataset.value===$("#customProduct").value));
  const submit=$("#customizer-form button[type='submit']");if(submit)submit.disabled=selectable.length===0;
}
function updateFulfillment(){
  const method=$("#fulfillment-method")?.value,delivery=$("#delivery-details"),pickup=$("#pickup-details");
  if(!method||!delivery||!pickup)return;
  const isDelivery=method==="delivery";delivery.hidden=!isDelivery;pickup.hidden=isDelivery;
  const address=document.querySelector('[name="address"]');if(address)address.required=isDelivery;
  updatePaymentDetails();
}
function updatePaymentDetails(){
  const payment=$("#payment-method"),method=payment?.value,fulfillment=$("#fulfillment-method")?.value;
  if(!payment)return;
  const cardOption=[...payment.options].find(option=>option.value==="Card");if(cardOption)cardOption.remove();
  const cod=[...payment.options].find(option=>option.value==="Cash on Delivery");
  if(cod)cod.hidden=fulfillment==="pickup";
  if(fulfillment==="pickup"&&method==="Cash on Delivery")payment.value="GCash";
  if($("#qr-payment"))$("#qr-payment").hidden=true;if($("#card-payment"))$("#card-payment").hidden=true;
  const qr=$("#payment-qr");if(qr)qr.removeAttribute("src");
  let notice=$("#payment-notice");
  if(!notice){notice=document.createElement("p");notice.id="payment-notice";notice.className="payment-notice";payment.closest("label").after(notice)}
  notice.textContent="Erickaffe has no configured payment gateway. GCash and Maya are recorded as payment pending; do not enter card details or treat an order as paid. Staff must verify payment separately.";
  let summary=$("#checkout-order-summary");
  if(!summary){summary=document.createElement("section");summary.id="checkout-order-summary";summary.className="order-summary-list";summary.setAttribute("aria-live","polite");const total=$("#checkout-total")?.closest(".checkout-total");total?.before(summary)}
  summary.innerHTML=`<h3>Order summary</h3>${state.cart.map(item=>`<div><span>${item.qty} × ${escapeHtml(item.name)}<small>${escapeHtml(item.custom||"Standard")}</small></span><strong>${peso(item.price*item.qty)}</strong></div>`).join("")}<div><span>Total</span><strong>${peso(cartTotal())}</strong></div>`;
  const total=$("#checkout-total");if(total)total.textContent=peso(cartTotal());
}
function recordInventory(productId,quantity,type,orderId=""){
  const product=products.find(item=>item.id===productId);if(!product)return;
  state.inventory[productId]=(Number(state.inventory[productId])||0)+quantity;
  state.inventoryHistory.push({productId,productName:product.name,quantity:Math.abs(quantity),delta:quantity,type,orderId,at:new Date().toLocaleString("en-PH"),by:state.user?.email||"system"});
}
async function transitionOrder(order, next) {
  const role = effectiveRole();
  const previous = getOrderStatus(order);

  if (!["barista", "owner"].includes(role)) {
    toast("Only baristas or the owner can update order status.");
    return;
  }

  if (!(statusFlow[previous] || []).includes(next)) {
    toast(`Invalid order transition: ${previous} → ${next}.`);
    return;
  }

  if (
    previous === "Preparing" &&
    next !== "Cancelled" &&
    next !== (
      order.fulfillment === "pickup"
        ? "Ready for Pickup"
        : "Out for Delivery"
    )
  ) {
    toast("The next status must match the order's fulfillment method.");
    return;
  }

  try {
    const response = await fetch("api/order-status.php", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reference: order.reference || order.id,
        status: next
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Unable to update the order status."
      );
    }

    // Update the browser only after MySQL confirms success.
    const savedStatus = result.status || next;

    state.orderStatuses[order.id] = savedStatus;
    order.status = savedStatus;

    if (savedStatus === "Received/Completed") {
      order.loyaltyAwarded = true;
      order.earnedStars = Number(result.starsAwarded) || 0;

      const email = order.customerEmail;

      if (
        email &&
        result.customerLoyaltyStars !== null &&
        result.customerLoyaltyStars !== undefined
      ) {
        const profile = state.customerProfiles[email] || {
          createdAt: order.createdAtIso || new Date().toISOString(),
          loyaltyStars: 0
        };

        profile.loyaltyStars =
          Number(result.customerLoyaltyStars) || 0;

        state.customerProfiles[email] = profile;

        if (state.user?.email === email) {
          state.loyaltyStars = profile.loyaltyStars;
        }
      }
    }

    save();

    renderDashboard(
      role === "barista" ? "overview" : "orders"
    );

    if (
      savedStatus === "Received/Completed" &&
      Number(result.starsAwarded) > 0
    ) {
      toast(
        `Order completed! ${result.starsAwarded} loyalty star(s) saved.`
      );
    } else {
      toast(`Order marked ${savedStatus}.`);
    }

  } catch (error) {
    console.error("Order status update error:", error);
    toast(error.message || "Unable to update the order status.");
  }
}
document.addEventListener("click",event=>{
  const nextButton=event.target.closest("[data-order-next]");
  if(nextButton){const order=state.orders.find(item=>item.id===nextButton.dataset.orderNext);if(order)transitionOrder(order,nextButton.dataset.nextStatus);return}
  const restock=event.target.closest("[data-restock]");
  if(restock){
    if(effectiveRole()!=="staff"){toast("Only inventory staff can record a restock.");return}
    const input=document.querySelector(`[data-restock-qty="${CSS.escape(restock.dataset.restock)}"]`),quantity=input?.valueAsNumber;
    if(!input||!Number.isSafeInteger(quantity)||quantity<1||!Number.isSafeInteger((Number(state.inventory[restock.dataset.restock])||0)+quantity)){toast("Enter a valid positive whole-number restock quantity.");return}
    recordInventory(restock.dataset.restock,quantity,"Staff restock");save();renderDashboard("inventory");renderProducts();renderCustomizerProducts();updateCustomizer();toast("Restock recorded in inventory history.");return;
  }
  const adjustment=event.target.closest("[data-adjust-stock]");
  if(adjustment){
    if(effectiveRole()!=="staff"){toast("Only inventory staff can adjust product stock.");return}
    const id=adjustment.dataset.adjustStock,input=document.querySelector(`[data-restock-qty="${CSS.escape(id)}"]`),quantity=input?.valueAsNumber,current=Number(state.inventory[id])||0;
    if(!input||!Number.isSafeInteger(quantity)||quantity<1||quantity>current){toast("Enter a positive whole-number adjustment no greater than current stock.");return}
    recordInventory(id,-quantity,"Staff stock adjustment");save();renderDashboard("inventory");renderProducts();renderCustomizerProducts();updateCustomizer();toast("Stock adjustment recorded in inventory history.");return;
  }
  const addForm=event.target.closest("#product-add-form");
  if(addForm){
    if(effectiveRole()!=="owner"){event.preventDefault();toast("Only the owner can add products.");return}
    event.preventDefault();const data=new FormData(addForm),name=String(data.get("name")).trim(),image=String(data.get("image")).trim(),price=Number(data.get("price"));
    if(!name||!Number.isFinite(price)||price<0||!/^https?:\/\//i.test(image)){toast("Enter a product name, valid non-negative price, and http(s) image URL.");return}
    let id=name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||`product-${Date.now()}`;while(products.some(product=>product.id===id))id+=`-${Date.now()}`;
    products.push({id,name,description:String(data.get("description")).trim(),price,category:String(data.get("category")),tag:"New",image,imageAlt:name,active:true});
    state.inventory[id]=0;save();renderDashboard("menu");renderProducts();renderCustomizerProducts();updateCustomizer();toast("Product added to the menu with zero stock.");return;
  }
  const productForm=event.target.closest("[data-product-form]");
  if(productForm){
    if(effectiveRole()!=="owner"){event.preventDefault();toast("Only the owner can edit products.");return}
    event.preventDefault();const product=products.find(item=>item.id===productForm.dataset.productForm),data=new FormData(productForm),price=Number(data.get("price")),image=String(data.get("image")).trim();
    if(!product||!Number.isFinite(price)||price<0||!(/^(https?:\/\/|assets\/products\/[a-z0-9_-]+\.(?:avif|gif|jpe?g|png|webp)$)/i.test(image))){toast("Enter a valid non-negative price and image URL.");return}
    product.name=String(data.get("name")).trim();product.description=String(data.get("description")).trim();product.price=price;product.image=image;product.imageAlt=product.name;product.active=data.has("active");
    save();renderDashboard("menu");renderProducts();renderCustomizerProducts();updateCustomizer();toast("Product changes saved.");return;
  }
});

document.addEventListener("submit", async event => {
  const form = event.target;

  if (form.id !== "checkout-form") return;

  event.preventDefault();
  event.stopImmediatePropagation();

  if (!state.cart.length) {
    toast("Your cart is empty.");
    return;
  }

  if (!state.user) {
    closeModal();
    openModal("#auth-modal");
    toast("Please log in before checking out.");
    return;
  }

  if (form.dataset.submitting === "true") return;

  const data = new FormData(form);
  const fulfillment = data.get("fulfillment");
  const payment = data.get("payment");
  const address = String(data.get("address") || "").trim();

  if (
    !["pickup", "delivery"].includes(fulfillment) ||
    !["GCash", "Maya", "Cash on Delivery"].includes(payment)
  ) {
    toast("Choose a valid fulfillment and payment method.");
    return;
  }

  if (fulfillment === "pickup" && payment === "Cash on Delivery") {
    toast("Cash on Delivery is unavailable for self pickup.");
    return;
  }

  if (fulfillment === "delivery" && !address) {
    toast("Enter your delivery address.");
    return;
  }

  if (state.cart.some(item => item.category === "reward")) {
    toast("Reward checkout is not connected yet. Please remove the reward.");
    return;
  }

  const lineItems = state.cart.map(item => {
    const product = products.find(candidate =>
      candidate.id === (item.productId || item.id) ||
      candidate.name === item.name
    );

    return {
      productId: item.productId || product?.id || item.id,
      qty: Number(item.qty),
      custom: item.custom || "",
      category: item.category || product?.category
    };
  });

  if (!lineItems.every(item =>
    item.productId &&
    Number.isSafeInteger(item.qty) &&
    item.qty > 0
  )) {
    toast("Your basket contains an invalid item. Please review it.");
    return;
  }

  const now = new Date();
  const reference = "#EK-" + now.getTime().toString().slice(-8);

  const eta = fulfillment === "pickup"
    ? "15–20 minutes"
    : ($("#delivery-eta")?.textContent || "30–45 minutes");

  form.dataset.submitting = "true";

  const submitButton = form.querySelector(
    'button[type="submit"], input[type="submit"]'
  );

  if (submitButton) submitButton.disabled = true;

  try {
    const response = await fetch("api/orders.php", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reference,
        fulfillment,
        payment,
        address,
        eta,
        receiver: state.user.name || "Coffee Friend",
        items: lineItems
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Unable to save your order."
      );
    }

    const savedItems = result.items.map(item => ({
      productId: item.productId,
      name: item.name,
      custom: item.customization || "",
      qty: Number(item.quantity),
      price: Number(item.price)
    }));

    const order = {
      id: result.reference,
      reference: result.reference,
      databaseOrderId: result.orderId,
      customerEmail: state.user.email,
      date: now.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      createdAt: now.toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short"
      }),
      createdAtIso: now.toISOString(),
      items: savedItems.reduce((sum, item) => sum + item.qty, 0),
      lineItems: savedItems,
      total: Number(result.total),
      status: "Pending",
      fulfillment,
      eta,
      address: fulfillment === "pickup"
        ? "Erickaffe Coffee Co., Lipa City, Batangas"
        : address,
      payment,
      paymentStatus: "Pending",
      paymentVerifiedAt: null,
      receiver: state.user.name || "Coffee Friend",
      earnedStars: 0,
      inventoryDeducted: false
    };

    // Clear the cart only after MySQL confirms success.
    state.orders.push(order);
    state.cart = [];
    save();

    $("#checkout-content").innerHTML = `
      <div class="receipt">
        <p class="eyebrow">Order placed</p>
        <h2 style="font-size:38px">
          Thanks for<br><em>choosing Erickaffe.</em>
        </h2>

        <p class="receipt-message">
          Your order is <strong>Pending</strong> staff confirmation.
          Payment is <strong>Pending</strong>.
        </p>

        <section class="order-summary-list">
          <h3>Order summary</h3>

          ${order.lineItems.map(item => `
            <div>
              <span>
                ${item.qty} × ${escapeHtml(item.name)}
                <small>${escapeHtml(item.custom || "Standard")}</small>
              </span>
              <strong>${peso(item.price * item.qty)}</strong>
            </div>
          `).join("")}

          <div>
            <span>Total</span>
            <strong>${peso(order.total)}</strong>
          </div>
        </section>

        <div class="receipt-details">
          <div>
            <span>Reference number</span>
            <strong>${escapeHtml(order.reference)}</strong>
          </div>

          <div>
            <span>Fulfillment</span>
            <strong>${fulfillment === "pickup" ? "Self pickup" : "Delivery"}</strong>
          </div>

          <div>
            <span>Payment status</span>
            <strong>Pending · ${escapeHtml(payment)}</strong>
          </div>

          <div>
            <span>${fulfillment === "pickup" ? "Pickup location" : "Delivery address"}</span>
            <strong>${escapeHtml(order.address)}</strong>
          </div>
        </div>

        <p class="receipt-message">
          Your order is saved and awaiting staff confirmation.
        </p>

        <button class="btn btn-dark full" data-action="close-modal">
          Done
        </button>
      </div>
    `;

    renderCart();
    toast("Order saved! Awaiting staff confirmation.");

  } catch (error) {
    console.error("Checkout error:", error);

    toast(
      error.message ||
      "Unable to save your order. Please try again."
    );

  } finally {
    delete form.dataset.submitting;

    if (submitButton) submitButton.disabled = false;
  }
}, { capture: true });