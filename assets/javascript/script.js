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
    const currencyName = currencySelect.options[currencySelect.selectedIndex].text;

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

    
    renderChart(selectedCurrency, rates, currencyName);
    } else {
        const resultText = document.getElementById("resultValue");
        resultText.textContent = `Ha ocurrido un error.`;
        resultText.style.color = "red";
        resultText.style.fontWeight = "bold"
    }

    
});


/* Gráfico */

const chartDOM = document.getElementById("currencyChart");

let currencyChart = ""; // variable global
const currencyName = currencySelect.options[currencySelect.selectedIndex].text;
const getHistoricalData = async (selectedCurrency) => {
    const respuesta = await fetch(`https://mindicador.cl/api/${selectedCurrency}`);
    const data = await respuesta.json();

    console.log('Datos históricos recibidos:', data);//para verificar

    /* se extraen las últimas 10 fechas y valores (splice) [Datos Históricos] */

    const dates = data.serie.slice(0, 10).map((entry) => entry.fecha.split("T")[0]); // 'T' representa el formato de la fecha 

    const values = data.serie.slice(0, 10).map((entry) => entry.valor);

    return {dates, values};

}

/* configuración gráfico */

const chartConfigPrep = (dates, values, currencyName) => {

    const config = {
        type: "line",
        data: {
            labels: dates,
            datasets:[{
                label: `Últimos 10 dias de ${currencyName}`,
                data: values,
                borderColor: "blue",
            }]
        }
    }

    return config;
    
}

/* renderizar gráfico */

const renderChart = async (selectedCurrency, rates, currencyName) => {
    const historicalData = await getHistoricalData(selectedCurrency);
    
    if (historicalData) {
        const {dates, values} = historicalData;

        if (currencyChart) {
            currencyChart.destroy(); // Si currencyChart = true, se elimina para dar paso al siguiente
        }

        const config = chartConfigPrep(dates, values, currencyName);
        currencyChart = new Chart(chartDOM, config);
    }
}

