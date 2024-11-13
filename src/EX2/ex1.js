document.addEventListener("DOMContentLoaded", async () => {
    try {
        await showIPC("Total Nacional. Índice general. Media anual. ");
        main();
    } catch (error) {
        console.error('Error en la carga inicial:', error);
    }
});

const getData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status ${response.status}`);
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.log('error', error);
        throw error;
    }
};

const getRentPrices = async () => {
    const url = `https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/59057?nult=10`;

    try {
        const data = await getData(url);
        //Filtrar dades
        const catalunya = data.filter((element) => element.Nombre.includes('Cataluña. Total'))
        return catalunya
    } catch (error) {
        console.log('error', error);
        return [];
    }
};

const showRentPrices = (data) => {
    const divs = document.querySelectorAll('.contenidor > div');

    //Crear Element llista
    const ulElementVariacio = document.createElement('ul');
    const ulElementIndex = document.createElement('ul');

    data.forEach(element => {
        element.Data.forEach(elementData => {
            const liElement = document.createElement('li');

            if (element.Nombre.includes('Índice')) {
                liElement.innerHTML = `<b>${elementData.Anyo} - ${elementData.Valor}</b>`;
                ulElementIndex.appendChild(liElement)
            } else if (element.Nombre.includes('Variación')) {
                liElement.innerHTML = `<b>${elementData.Anyo} - ${elementData.Valor}</b>`;
                ulElementVariacio.appendChild(liElement)
            }
        })
    });
    divs[0].appendChild(ulElementIndex)
    divs[1].appendChild(ulElementVariacio)
};

const getIPC = async () => {
    const url = 'https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/50934?nult=10';

    try {
        const data = await getData(url);
        return data;
    } catch (error) {
        console.log('Error: ', error);
        return [];
    }
}

const showIPC = async (selectedIPC) => {
    const data = await getIPC();
    const select = document.getElementById('ipc-selector');
    const options = new Set(data.map(element => element.Nombre))

    options.forEach(op => {
        const option = document.createElement('option');
        option.value = op;
        option.textContent = op;
        select.appendChild(option)
    })
    const IPC = data.find((element) => element.Nombre == selectedIPC);
    const anyo = IPC.Data.map(({Anyo}) => Anyo).reverse();
    const valor = IPC.Data.map(({Valor}) => Valor).reverse();

    myChart(anyo,valor)
}

let chart = null;

const myChart = (labels, data) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Índex de Preus',
                backgroundColor: 'rgb(255,99,132)',
                borderColor: 'rgb(255,99,132)',
                data: data
            }]
        },
        options: {}
    });
}

const main = async () => {
    try {
        const data = await getRentPrices();
        showRentPrices(data);
        const select = document.getElementById('ipc-selector');
        select.addEventListener('change', (event) => {
            const selectedIPC = event.target.value;
            showIPC(selectedIPC);
        });
    } catch (error) {
        console.log(`Error: ${error}`);
        throw error;
    }
}