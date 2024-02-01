document.addEventListener('DOMContentLoaded', function () {
    // Parámetros del oscilador
    let dampingFactor = 0.1;
    let angularFrequency = 1;
    let amplitude = 60;
    let phase = 0;

    // Obtén el contexto del lienzo
    const canvas = document.getElementById('oscillatorChart');
    const ctx = canvas.getContext('2d');

    // Inicializa la gráfica con un número inicial de puntos
    const initialPoints = 500; // Mayor número de puntos iniciales para una representación más suave
    const data = [];
    const labels = [];
    let currentTime = 0;

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Oscilador Amortiguado',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    tension: 0.2  // Ajusta la tensión para una curva más suave
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 60,  // Muestra los últimos 60 segundos
                },
                y: {
                    min: -amplitude,
                    max: amplitude
                }
            }
        }
    });

    // Función para actualizar la gráfica con nuevos datos del oscilador y los parámetros
    function updateChart() {
        // Calcula el nuevo punto y tiempo
        const newTime = currentTime;
        const newDisplacement = amplitude * Math.exp(-dampingFactor * newTime) * Math.cos(angularFrequency * newTime + phase);

        // Agrega el nuevo punto
        data.push(newDisplacement);
        labels.push(newTime);

        // Actualiza la gráfica
        chart.update();

        // Desplaza el rango del eje x hacia la derecha
        chart.options.scales.x.min = Math.max(newTime - 10, 0);
        chart.options.scales.x.max = Math.max(newTime, 10);  // Mostrará siempre los últimos 10 segundos

        // Incrementa el tiempo actual
        currentTime += 0.02;  // Reducido el intervalo de tiempo para una actualización más frecuente

        // Actualiza los elementos HTML con los parámetros del oscilador
        document.getElementById('dampingFactorDisplay').textContent = dampingFactor.toFixed(2);
        document.getElementById('angularFrequencyDisplay').textContent = angularFrequency;
        document.getElementById('amplitudeDisplay').textContent = amplitude;
        document.getElementById('phaseDisplay').textContent = phase.toFixed(2);
    }

    // Actualiza la gráfica periódicamente (cada 20 ms)
    setInterval(updateChart, 20);  // Reducido el intervalo de actualización

    // Agrega un control deslizante para cambiar el factor de amortiguamiento
    const dampingSlider = document.createElement('input');
    dampingSlider.type = 'range';
    dampingSlider.min = '0';
    dampingSlider.max = '1';
    dampingSlider.step = '0.01';
    dampingSlider.value = dampingFactor.toString();
    dampingSlider.addEventListener('input', function () {
        dampingFactor = parseFloat(this.value);
    });

    // Agrega el control deslizante al cuerpo del documento
    document.body.appendChild(dampingSlider);
});
