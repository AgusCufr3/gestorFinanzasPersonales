// Datos de los pagos y deudas
const pagos = []
const deudas = []

// Obtener los montos de los pagos
function getPaymentAmounts() {
	return pagos.map((pago) => pago.amount)
}

// Obtener los montos de las deudas
function getDebtAmounts() {
	return deudas.map((deuda) => deuda.amount)
}

$(document).ready(function () {
	// Inicializar el calendario
	$('#calendar').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay',
		},
		defaultView: 'month',
		selectable: true, // Habilitar la selección de fechas
		select: function (start, end) {
			// Mostrar modal para agregar un nuevo pago
			$('#paymentModal').css('display', 'block')

			$('#addPaymentBtn').click(function () {
				const title = $('#paymentTitle').val()
				const amount = parseFloat($('#paymentAmount').val())
				if (title && !isNaN(amount)) {
					const newPago = {
						id: pagos.length + 1,
						title: title,
						date: start.format('YYYY-MM-DD'),
						amount: amount,
					}
					pagos.push(newPago)

					// Agregar el nuevo pago al calendario
					$('#calendar').fullCalendar(
						'renderEvent',
						{
							id: newPago.id,
							title: newPago.title,
							start: newPago.date,
						},
						true
					)

					// Actualizar el gráfico de deudas y pagos
					updateDebtGraph()

					// Limpiar el formulario
					$('#paymentTitle').val('')
					$('#paymentAmount').val('')
				}
			})
		},
	})

	// Actualizar el gráfico de deudas y pagos
	function updateDebtGraph() {
		const paymentAmounts = getPaymentAmounts()
		const debtAmounts = getDebtAmounts()
		const totalPayments = paymentAmounts.reduce(
			(acc, amount) => acc + amount,
			0
		)
		const totalDebts = debtAmounts.reduce((acc, amount) => acc + amount, 0)

		const ctx = document.getElementById('debtChart').getContext('2d')
		const chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['Pagos', 'Deudas'],
				datasets: [
					{
						label: 'Monto',
						data: [totalPayments, totalDebts],
						backgroundColor: [
							'rgba(75, 192, 192, 0.5)',
							'rgba(255, 99, 132, 0.5)',
						],
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 100,
							callback: (value) => '$' + value,
						},
					},
				},
				plugins: {
					title: {
						display: true,
						text: 'Deudas y Pagos Totales',
					},
				},
			},
		})
	}

	// Agregar evento al botón "Agregar Deuda"
	$('#addDebtBtn').click(function () {
		const title = $('#debtTitle').val()
		const amount = parseFloat($('#debtAmount').val())
		if (title && !isNaN(amount)) {
			const newDeuda = {
				id: deudas.length + 1,
				title: title,
				date: moment().format('YYYY-MM-DD'),
				amount: amount,
			}
			deudas.push(newDeuda)

			// Actualizar el gráfico de deudas y pagos
			updateDebtGraph()

			// Limpiar el formulario
			$('#debtTitle').val('')
			$('#debtAmount').val('')
		}
	})

	// Inicializar el gráfico de deudas y pagos
	updateDebtGraph()
})
