// اليمين مش شغال

//  const onlyDigits = s => s.replace(/\D/g,'');
//   const luhn = number => {
//     const digits = onlyDigits(number).split('').reverse().map(Number);
//     let sum = 0;
//     for (let i=0;i<digits.length;i++){
//       let d = digits[i];
//       if (i%2===1){ d*=2; if (d>9) d-=9; }
//       sum+=d;
//     }
//     return sum%10===0;
//   };
//   const detectBrand = num => {
//     const n = onlyDigits(num);
//     if (/^3[47]\d{13}$/.test(n)) return 'amex';
//     if (/^4\d{12,18}$/.test(n)) return 'visa';
//     if (/^5[1-5]\d{14}$/.test(n) || /^2(2[2-9]|[3-7]\d)\d{12}$/.test(n)) return 'mc';
//     if (/^6(?:011|5)\d{12,}$/.test(n)) return 'disc';
//     return 'unknown';
//   };

//   const cardNumber = document.getElementById('cardNumber');
//   const exp        = document.getElementById('exp');
//   const cvv        = document.getElementById('cvv');
//   const nameOnCard = document.getElementById('name');
//   const payBtn     = document.getElementById('payBtn');
//   const res        = document.getElementById('result');

//   const errs = {
//     cardNumber: document.getElementById('cardNumberErr'),
//     exp:        document.getElementById('expErr'),
//     cvv:        document.getElementById('cvvErr'),
//     name:       document.getElementById('nameErr'),
//   };

//   cardNumber.addEventListener('input', e=>{
//     let n = onlyDigits(e.target.value).slice(0,19);
//     const brand = detectBrand(n);

//     if (brand==='amex'){
//       n = n.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*$/, (_,a,b,c)=>[a,b,c].filter(Boolean).join(' '));
//     } else {
//       n = n.replace(/(\d{4})(?=\d)/g,'$1 ').trim();
//     }
//     e.target.value = n;

//     cvv.maxLength = brand==='amex' ? 4 : 3;
//   });


//   exp.addEventListener('input', e=>{
//     let v = onlyDigits(e.target.value).slice(0,4);
//     if (v.length>=3) v = v.slice(0,2)+' / '+v.slice(2);
//     e.target.value = v;
//   });


//   function validateCardNumber(){
//     const n = cardNumber.value;
//     const digits = onlyDigits(n);
//     let msg = '';
//     if (digits.length < 13 || digits.length > 19) msg='Enter a valid card number';
//     else if (!luhn(digits)) msg='Enter a valid card number';
//     errs.cardNumber.textContent = msg;
//     cardNumber.classList.toggle('is-invalid', !!msg);
//     return !msg;
//   }

//   function validateExp(){
//     const raw = onlyDigits(exp.value);
//     let msg = '';
//     if (raw.length !== 4) msg = 'Enter a valid expiration date';
//     else {
//       const mm = parseInt(raw.slice(0,2),10);
//       const yy = parseInt('20'+raw.slice(2),10);
//       const now = new Date();
//       const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       const expMonth  = new Date(yy, mm-1, 1);
//       if (mm<1 || mm>12) msg='Enter a valid expiration date';
//       else if (expMonth < thisMonth) msg='Enter a valid expiration date';
//     }
//     errs.exp.textContent = msg;
//     exp.classList.toggle('is-invalid', !!msg);
//     return !msg;
//   }

//   function validateCvv(){
//     const brand = detectBrand(cardNumber.value);
//     const d = onlyDigits(cvv.value);
//     const need = brand==='amex' ? 4 : 3;
//     const msg = d.length===need ? '' : `Enter the CVV or security code on your card`;
//     errs.cvv.textContent = msg;
//     cvv.classList.toggle('is-invalid', !!msg);
//     return !msg;
//   }

//   function validateName(){
//     const v = nameOnCard.value.trim();
//     const ok = v.length >= 2;
//     const msg = ok ? '' : 'Enter the name on your card';
//     errs.name.textContent = msg;
//     nameOnCard.classList.toggle('is-invalid', !!msg);
//     return ok;
//   }

//   cardNumber.addEventListener('blur', validateCardNumber);
//   exp.addEventListener('blur', validateExp);
//   cvv.addEventListener('blur', validateCvv);
//   nameOnCard.addEventListener('blur', validateName);

//   payBtn.addEventListener('click', ()=>{
//     const ok =
//       validateCardNumber() &
//       validateExp() &
//       validateCvv() &
//       validateName();

//     if (ok){
//       res.textContent = '✓ All good. (Demo only — no real charge.)';
//       res.style.color = 'green';
//     } else {
//       res.textContent = 'Please fix the highlighted fields.';
//       res.style.color = 'var(--red)';
//     }
//   });



  document.addEventListener("DOMContentLoaded", () => {  // الشماااااااااااااااااااااااااااااااااااااااااااااااااااااال
  const cart = JSON.parse(localStorage.getItem("checkoutCart")) || {};
  const summaryItems = document.getElementById("summaryItems");
  const subtotalEl = document.getElementById("summarySubtotal");
  const shippingEl = document.getElementById("summaryShipping");
  const totalEl = document.getElementById("summaryTotal");

  let subtotal = 0;
  summaryItems.innerHTML = "";

  Object.values(cart).forEach(item => {
    subtotal += item.price * item.qty;

    const itemRow = document.createElement("div");
    itemRow.className = "item";
    itemRow.innerHTML = `
      <img src="${item.imgSrc}" alt="${item.name}" width="60">
      <div class="info">
        <h4>${item.name}</h4>
        <p>Qty: ${item.qty}</p>
      </div>
      <span class="price">$${(item.price * item.qty).toFixed(2)}</span>
    `;
    summaryItems.appendChild(itemRow);
  });

  const shipping = 10.00;
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = `$${shipping.toFixed(2)}`;
  totalEl.textContent = `$${(subtotal + shipping).toFixed(2)}`;
});
