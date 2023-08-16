export async function message(text, status) {
  let div = document.createElement('div');
  div.id = 'messageDiv';
  div.style.position = 'fixed'; // Используем 'fixed' для позиционирования относительно окна
  div.style.top = `${window.scrollY + 50}px`; // Учитываем текущую прокрутку
  div.style.left = '50%';
  div.style.transform = 'translateX(-50%)';
  div.style.color = 'white';
  div.style.fontFamily = "e-Ukraine";
  div.style.width = '500px';
  div.style.height = '50px';
  
  div.style.backgroundColor = '#28743b';
  if (!status) {
    div.style.backgroundColor = 'red';
  }
  div.style.border = '2px solid white';
  div.style.borderRadius = "5px";
  div.style.opacity = "0.6";
  
  // Добавим стили для выравнивания текста по центру
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.justifyContent = 'center';

  div.textContent = text;

  document.body.appendChild(div);

  setTimeout(() => {
    document.body.removeChild(div);
  }, 3000);
}