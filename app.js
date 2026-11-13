const $=s=>document.querySelector(s);let data,category='',current,chosen,bag=[];const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const money=n=>'S/ '+Number(n).toFixed(2);const visible=p=>p.visible&&p.variantes.some(v=>v.visible);const photo=p=>{const path=String(p||'').replace(/^\/+/, '');if(!path.startsWith('assets/productos/')||path.split('/').includes('..'))return '';return path};function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',2600)}function wa(t){return 'https://wa.me/'+data.whatsapp.replace(/\D/g,'')+'?text='+encodeURIComponent(t)}
function render(){
  const search=$('#search').value.toLowerCase();
  const selectedSize=$('#size').value;
  const selectedColor=$('#color').value;
  const list=data.productos.filter(visible).filter(p=>
    (!category||p.categoria===category)&&
    p.nombre.toLowerCase().includes(search)&&
    p.variantes.some(v=>v.visible&&(!selectedSize||v.talla===selectedSize)&&(!selectedColor||v.color===selectedColor))
  );
  $('#products').innerHTML=list.map(p=>{
    const variants=p.variantes.filter(v=>v.visible);
    const matches=variants.filter(v=>(!selectedSize||v.talla===selectedSize)&&(!selectedColor||v.color===selectedColor));
    const cover=matches[0]||variants[0];
    const colorOptions=[...new Map(variants.map(v=>[v.color,v])).values()].map(v=>
      `<button class="color-option" type="button" data-id="${esc(p.id)}" data-variant="${esc(v.id)}" style="--swatch:${colorSwatch(v.color)}" aria-label="Elegir color ${esc(v.color)}" title="${esc(v.color)}"></button>`
    ).join('');
    return `<article class="card"><button class="card-open" type="button" data-id="${esc(p.id)}" data-variant="${esc(cover.id)}"><span class="card-photo"><img src="${esc(photo(cover.foto))}" alt="Polo ${esc(p.nombre)} en ${esc(cover.color)}" loading="lazy" width="600" height="600"><span class="card-view">Ver producto</span></span><span class="card-heading"><span class="card-product-name">${esc(p.nombre)}</span><span class="card-price">${money(cover.precio)}</span></span></button><span class="card-options"><span class="color-options" aria-label="Colores disponibles">${colorOptions}</span></span></article>`;
  }).join('')||'<p class="empty">No encontramos esa combinación. Prueba otro filtro.</p>';
  $('#products').querySelectorAll('[data-id][data-variant]').forEach(button=>button.onclick=()=>{openProduct(button.dataset.id);selectVariant(button.dataset.variant)});
}
function colorSwatch(color){
  const name=color.toLocaleLowerCase('es');
  const palette=[
    [/blanco/,'#fff'],[/negro/,'#171717'],[/azul marino/,'#17243b'],[/azul/,'#3476aa'],
    [/celeste/,'#82c8e3'],[/rojo/,'#d90429'],[/vino/,'#70263b'],[/morado|lila/,'#8b6aa8'],
    [/rosado|rosa/,'#df8ca8'],[/taupe/,'#918174'],[/beige/,'#d7c3a2'],[/marr[oó]n/,'#745044'],
    [/gris/,'#929292'],[/oscuro/,'#424047']
  ];
  return palette.find(([pattern])=>pattern.test(name))?.[1]||'#b9b4ae';
}
function openProduct(id){current=data.productos.find(p=>p.id===id&&visible(p));if(!current)return;$('#detailName').textContent=current.nombre;$('#detailCategory').textContent=current.categoria;$('#variants').innerHTML=current.variantes.filter(v=>v.visible).map(v=>`<button data-v="${esc(v.id)}"><span class="variant-choice"><i class="color-swatch" style="--swatch:${colorSwatch(v.color)}" aria-hidden="true"></i><span>${esc(v.color)} - ${esc(v.talla==='Consultar talla'?'Por confirmar':v.talla)}</span></span></button>`).join('');$('#variants').querySelectorAll('button').forEach(b=>b.onclick=()=>selectVariant(b.dataset.v));selectVariant(current.variantes.find(v=>v.visible).id);$('#shareStatus').textContent='';$('#shareLink').hidden=true;if(!$('#detail').open)$('#detail').showModal();history.replaceState(null,'','#producto='+encodeURIComponent(id));}
function selectVariant(id){chosen=current.variantes.find(v=>v.id===id&&v.visible);$('#detailPhoto').src=photo(chosen.foto);$('#detailPhoto').alt=`${current.nombre} · ${chosen.color} · ${chosen.talla}`;$('#detailPrice').textContent='S/'+Number(chosen.precio).toFixed(2)+' · 2X S/'+Number(data.precio_duo).toFixed(2);$('#variantCode').innerHTML=`<span class="variant-choice"><i class="color-swatch" style="--swatch:${colorSwatch(chosen.color)}" aria-hidden="true"></i><span>${esc(chosen.color)} - ${esc(chosen.talla==='Consultar talla'?'Por confirmar':chosen.talla)}</span></span>`;$('#variants').querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b.dataset.v===id);b.setAttribute('aria-pressed',b.dataset.v===id)});$('#whatsapp').href=wa(promotionInquiry);$('#shareLink').hidden=true;$('#shareStatus').textContent=''}

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
      `<figure><img src="${esc(photo(variant.foto))}" alt="${esc(variant.nombre)}" loading="lazy" width="600" height="600"></figure>`
    ).join('')}</div><div class="duo-idea-info"><strong class="duo-price">2X S/${Number(data.precio_duo).toFixed(2)}</strong><button class="button" type="button">Añadir dúo</button></div>`;
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
$('#search').oninput=render;$('#size').onchange=render;$('#color').onchange=render;
$('#quoteForm').addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget;
  const status=$('#quoteStatus');
  const file=form.elements.artwork.files[0];
  if(!form.reportValidity())return;
  if(!file){status.textContent='Adjunta tu diseño para continuar.';return}
  if(file.size>10*1024*1024){status.textContent='El archivo supera el límite de 10 MB.';return}
  const allowed=/\.(png|jpe?g|webp|pdf)$/i;
  if(!allowed.test(file.name)){status.textContent='Adjunta una imagen PNG, JPG, WEBP o un PDF.';return}
  if(!data){status.textContent='Espera a que cargue el catálogo e inténtalo de nuevo.';return}
  const values=new FormData(form);
  const message=[
    '¡Hola, MODAC! Quiero cotizar un estampado personalizado.',
    `Nombre: ${values.get('name').trim()}`,
    `WhatsApp: ${values.get('phone').trim()}`,
    `Talla: ${values.get('size')}`,
    `Cantidad: ${values.get('quantity')}`,
    `Diseño: ${values.get('design').trim()}`,
    `Archivo para adjuntar: ${file.name}`
  ].join('\n');
  const url=`https://wa.me/${data.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`;
  window.open(url,'_blank','noopener,noreferrer');
  status.textContent='Se abrió WhatsApp. Adjunta allí el archivo de diseño seleccionado.';
});
fetch('productos.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{data=d;$('#categories').innerHTML=['',...new Set(d.productos.filter(visible).map(p=>p.categoria))].map(c=>`<button data-cat="${esc(c)}" class="${!c?'active':''}">${esc(c||'Todos')}</button>`).join('');$('#categories').querySelectorAll('button').forEach(b=>b.onclick=()=>{category=b.dataset.cat;$('#categories').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render()});const variants=d.productos.filter(visible).flatMap(p=>p.variantes.filter(v=>v.visible));const sizes=[...new Set(variants.map(v=>v.talla).filter(size=>size!=='Consultar talla'))].sort((a,b)=>['XS','S','M','L','XL','XXL'].indexOf(a)-['XS','S','M','L','XL','XXL'].indexOf(b));$('#size').insertAdjacentHTML('beforeend',sizes.map(size=>`<option value="${esc(size)}">${esc(size)}</option>`).join(''));const colors=[...new Set(variants.map(v=>v.color))].sort((a,b)=>a.localeCompare(b,'es'));$('#color').insertAdjacentHTML('beforeend',colors.map(color=>`<option value="${esc(color)}">${esc(color)}</option>`).join(''));initCarousel();render();renderDuoIdeas();updateBag();if(location.hash.startsWith('#producto=')){
  const variantId = new URLSearchParams(location.search).get('variante');
  openProduct(decodeURIComponent(location.hash.slice(10)));
  if(current?.variantes.some(v=>v.visible&&v.id===variantId))selectVariant(variantId);
}}).catch(()=>$('#products').innerHTML='<p class="empty">No pudimos cargar el catálogo. Actualiza la página o inténtalo más tarde.</p>');
