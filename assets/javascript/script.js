/* Obtener datos de API */

const divisaApiURL = "https://mindicador.cl/api/";

/* Función */

const getCurrency = async () =>{
    try{
        const respuesta = await fetch(divisaApiURL);
        const data = await respuesta.json();
        return data;
    }
    catch(error){
      console.error('Error al obtener los datos: ', error);
      const resultSection = document.querySelector('.result-section');
      resultSection.textContent = `Algo salió mal | Error: ${error.message}`;
      resultSection.style.color = "red";
      resultSection.style.fontWeight = "bold"
    }
}

getCurrency();

/* Evento de botón --> Esperar función y verificar | Capturar valores | Conversión | Mostrar resultado */

document.getElementById("btnConvert").addEventListener('click', async () => {
    const rates = await getCurrency(); //el objeto completo de 'data' ahora está contenido en la constante rates
    if (rates) {
        console.log('Datos obtenidos correctamente: ', rates); 
    
    /* Capturar valores de Input y Select */

    const amountInput = document.getElementById('amountInput');
    const currencySelect = document.getElementById('currencySelect');
    const amount = parseFloat(amountInput.value); // Convierte cualquier 'string' dentro del value a número
    const selectedCurrency = currencySelect.value;

    /* validar */

    if (isNaN(amount) || amount <= 0) {
        alert('Ingresa un monto válido.');
        return; // si la condición no se cumple, la función no sigue ejecutándose
       }
    if (/[.,]/.test(amount)) {
        alert('Ingresa un monto sin puntos ni comas');
        return;
    }
    if (!selectedCurrency) {
        alert('Selecciona una moneda.');
        return;
       }


    /* Conversión según datos */

    const conversionRate = rates[selectedCurrency].valor; // Selecciona el valor de rates dentro de cada divisa seleccionada
    const convertedAmount = amount / conversionRate; // conversión

    /* Mostrar resultado en DOM */
    const resultText = document.getElementById("resultValue");
    resultText.textContent = `${convertedAmount.toFixed(2)} ${selectedCurrency}` //toFixed asegura solo (dos) decimales
    } else {
        resultText.textContent = `Ha ocurrido un error.`;
        resultText.style.color = "red";
        resultText.style.fontWeight = "bold"
    }
});



