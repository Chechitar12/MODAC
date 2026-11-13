const $=s=>document.querySelector(s);let data,category='',current,chosen,bag=[];const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const money=n=>'S/ '+Number(n).toFixed(2);const visible=p=>p.visible&&p.variantes.some(v=>v.visible);const photo=p=>{const path=String(p||'').replace(/^\/+/, '');if(!path.startsWith('assets/productos/')||path.split('/').includes('..'))return '';return path};function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',2600)}function wa(t){return 'https://wa.me/'+data.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(t)}
function render(){
  const search=$('#search').value.toLowerCase();
  const selectedSize=$('#size').value;
  const list=data.productos.filter(visible).filter(p=>
    (!category||p.categoria===category)&&
    p.nombre.toLowerCase().includes(search)&&
    (!selectedSize||p.variantes.some(v=>v.visible&&v.talla===selectedSize))
  );
  $('#products').innerHTML=list.map(p=>{
    const variants=p.variantes.filter(v=>v.visible);
    const cover=variants.find(v=>v.talla===selectedSize)||variants[0];
    const sizes=[...new Set(variants.map(v=>v.talla==='Consultar talla'?'Por confirmar':v.talla))];
    const sizeBadges=sizes.map(size=>`<span class="size-badge">${esc(size)}</span>`).join('');
    return `<button class="card" data-id="${esc(p.id)}" data-variant="${esc(cover.id)}"><div class="card-photo"><img src="${esc(photo(cover.foto))}" alt="Polo ${esc(p.nombre)} en ${esc(cover.color)}" loading="lazy" width="600" height="600"><span class="size-badges" aria-label="Tallas disponibles">${sizeBadges}</span><span class="hover-detail"><span><b>Color:</b> ${esc(cover.color)}</span><span><b>Talla:</b> ${esc(cover.talla==='Consultar talla'?'Por confirmar':cover.talla)}</span></span></div><div class="card-heading"><h3>${esc(p.nombre)}</h3><span class="card-arrow" aria-hidden="true">↗</span></div></button>`;
  }).join('')||'<p class="empty">No encontramos esa combinación. Prueba otro filtro.</p>';
  $('#products').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{openProduct(b.dataset.id);selectVariant(b.dataset.variant)});
}
function openProduct(id){current=data.productos.find(p=>p.id===id&&visible(p));if(!current)return;$('#detailName').textContent=current.nombre;$('#detailCategory').textContent=current.categoria;$('#variants').innerHTML=current.variantes.filter(v=>v.visible).map(v=>`<button data-v="${esc(v.id)}">${esc(v.color)}<br><strong>${esc(v.talla)}</strong></button>`).join('');$('#variants').querySelectorAll('button').forEach(b=>b.onclick=()=>selectVariant(b.dataset.v));selectVariant(current.variantes.find(v=>v.visible).id);$('#shareStatus').textContent='';$('#shareLink').hidden=true;if(!$('#detail').open)$('#detail').showModal();history.replaceState(null,'','#producto='+encodeURIComponent(id));}
function selectVariant(id){chosen=current.variantes.find(v=>v.id===id&&v.visible);$('#detailPhoto').src=photo(chosen.foto);$('#detailPhoto').alt=`${current.nombre} · ${chosen.color} · ${chosen.talla}`;$('#detailPrice').textContent='S/'+Number(chosen.precio).toFixed(2)+' · 2X S/'+Number(data.precio_duo).toFixed(2);$('#variantCode').textContent=chosen.id+' · '+chosen.color+' · '+chosen.talla;$('#variants').querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b.dataset.v===id);b.setAttribute('aria-pressed',b.dataset.v===id)});$('#whatsapp').href=wa(promotionInquiry);$('#shareLink').hidden=true;$('#shareStatus').textContent=''}

const promotionInquiry = '¡Hola! ¿Me puede dar más detalles sobre la promoción de polos 2X S/35.00?';

function renderDuoIdeas() {
  const combinations = [
    { name: 'Flores y lazos', ids: ['MODAC-023', 'MODAC-027'] },
    { name: 'Contraste de colores', ids: ['MODAC-007', 'MODAC-025'] }
  ];
  const variants = data.productos.filter(visible).flatMap(product =>
    product.variantes.filter(variant => variant.visible).map(variant => ({
      ...variant, nombre: product.nombre
    }))
  );
  const container = $('#duoIdeas');
  for (const combination of combinations) {
    const pair = combination.ids.map(id => variants.find(variant => variant.id === id));
    if (pair.some(variant => !variant)) continue;

    const article = document.createElement('article');
    article.className = 'duo-idea';
    article.innerHTML = `<div class="duo-idea-photos">${pair.map(variant =>
      `<figure><img src="${esc(photo(variant.foto))}" alt="${esc(variant.nombre)}" loading="lazy" width="600" height="600"><figcaption>${esc(variant.color)} · ${esc(variant.talla)}</figcaption></figure>`
    ).join('')}</div><div class="duo-idea-info"><div><h3>${esc(combination.name)}</h3><strong>2X S/${Number(data.precio_duo).toFixed(2)}</strong></div><button class="button" type="button">Añadir dúo</button></div>`;
    article.querySelector('button').onclick = () => {
      for (const variant of pair) {
        if (!bag.some(item => item.id === variant.id)) bag.push(variant);
      }
      updateBag();
      $('#selection').showModal();
    };
    container.append(article);
  }
  $('#duos').hidden = container.childElementCount === 0;
}

function updateBag(){ $('#bagCount').textContent=bag.length;$('#bagItems').innerHTML=bag.map(v=>`<div class="bag-item"><img src="${esc(photo(v.foto))}" alt="${esc(v.nombre)}"><div><strong>${esc(v.nombre)}</strong><br>${esc(v.color)} · ${esc(v.talla)}<br>${esc(v.id)}</div><button data-remove="${esc(v.id)}" aria-label="Quitar ${esc(v.nombre)}">Quitar</button></div>`).join('')||'<p>Aún no elegiste un polo. Encuentra tus favoritos en la colección.</p>';$('#bagItems').querySelectorAll('button').forEach(b=>b.onclick=()=>{bag=bag.filter(v=>v.id!==b.dataset.remove);updateBag()});const total=Math.floor(bag.length/2)*data.precio_duo+(bag.length%2?bag[bag.length-1].precio:0);$('#bagTotal').textContent=bag.length?'Total referencial: '+money(total):'';$('#bagWhatsapp').hidden=!bag.length;$('#bagWhatsapp').style.display=bag.length?'':'none';$('#bagWhatsapp').href=wa(promotionInquiry);
  const needsOneMore = bag.length % 2 === 1;
  $('#duoNotice').hidden = bag.length === 0;
  $('#duoMessage').textContent = bag.length === 2
    ? '¡Dúo armado! 2X S/35.00'
    : needsOneMore ? 'Agrega un polo más para aprovechar el 2X S/35.00.' : 'Promoción aplicada a cada dúo.';
  $('#chooseAnother').hidden = !needsOneMore;
  $('#bagTotal').classList.toggle('duo-total', bag.length === 2);
}
$('#chooseAnother').onclick = () => $('#selection').close();
$('#addBag').onclick=()=>{if(bag.some(v=>v.id===chosen.id)){toast('Este polo ya está en tu selección');return}bag.push({...chosen,nombre:current.nombre});updateBag();toast('Añadido a tu selección ♡')};$('#openBag').onclick=()=>{$('#detail').close();updateBag();$('#selection').showModal()};$('#closeBag').onclick=()=>$('#selection').close();$('#closeDetail').onclick=()=>$('#detail').close();$('#detail').addEventListener('close',()=>history.replaceState(null,'',location.pathname+location.search+'#coleccion'));$('#zoomPhoto').onclick=()=>{$('#zoomImage').src=$('#detailPhoto').src;$('#zoom').showModal()};$('#closeZoom').onclick=()=>$('#zoom').close();document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));$('#share').onclick = async () => {
  if (!current || !chosen) return;
  const link = new URL('https://chechitar12.github.io/MODAC/');
  link.searchParams.set('variante', chosen.id);
  link.hash = 'producto=' + encodeURIComponent(current.id);
  const field = $('#shareLink');
  const status = $('#shareStatus');
  field.value = link.href;
  field.hidden = false;
  status.textContent = '';
  if (navigator.share) {
    try {
      await navigator.share({ title: 'MODAC · ' + current.nombre, url: link.href });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(link.href);
    status.textContent = 'Enlace copiado.';
  } catch {
    field.focus();
    field.select();
    status.textContent = 'Enlace seleccionado. Presiona Ctrl + C o mantén pulsado para copiarlo.';
  }
};
$('#search').oninput=render;$('#size').onchange=render;
fetch('productos.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{data=d;$('#categories').innerHTML=['',...new Set(d.productos.filter(visible).map(p=>p.categoria))].map(c=>`<button data-cat="${esc(c)}" class="${!c?'active':''}">${esc(c||'Todos')}</button>`).join('');$('#categories').querySelectorAll('button').forEach(b=>b.onclick=()=>{category=b.dataset.cat;$('#categories').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render()});const hero=d.productos.find(p=>p.nombre==='Ramo de flores a color'&&visible(p))||d.productos.find(visible);initCarousel();render();renderDuoIdeas();updateBag();if(location.hash.startsWith('#producto=')){
  const variantId = new URLSearchParams(location.search).get('variante');
  openProduct(decodeURIComponent(location.hash.slice(10)));
  if(current?.variantes.some(v=>v.visible&&v.id===variantId))selectVariant(variantId);
}}).catch(()=>$('#products').innerHTML='<p class="empty">No pudimos cargar el catálogo. Actualiza la página o inténtalo más tarde.</p>');
