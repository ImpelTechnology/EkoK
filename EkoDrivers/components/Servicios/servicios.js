'use strict';
var serviciosRutas;
app.Servicios = kendo.observable({
	onShow: function () {
		kendo.ui.progress($("#VehiculosScreen"), false);
	},
	afterShow: function () { },
	listViewClick: function (e) {
		try {
			kendo.ui.progress($("#ServiciosScreen"), true);
			sessionStorage.setItem("ServiciosRutas", JSON.stringify(e.dataItem));
			var datos = {
				query: "Select R7094975,R6522584,Secuencia from Entrega where R7094975 = " + e.dataItem.id,
				sessionId: SessionId,
				startRow: 0,
				maxRows: 100,
				output: "json"
			};
			var Paradas = [];
			$.ajax({
				url: "https://www.impeltechnology.com/rest/api/selectQuery",
				type: "GET",
				dataType: "json",
				data: datos,
				async: false,
				success: function (data) {
					try {
						if (data == "") {
							sessionStorage.setItem("Paradas", "");
						} else {
							$.each(data, function (index, item) {
								Paradas.push({
									Servicio: item[0],
									Parada: item[1],
									Secuencia: item[2]
								});
							});
						}
					} catch (e) {
						alert(e);
					}
				},
				error: function (err) {
					alert(JSON.stringify(err));
				}
			});
			if (Paradas.length != 0) {
				sessionStorage.setItem("Paradas", JSON.stringify( Paradas));
			}
			kendo.mobile.application.navigate("components/Rutas/rutas.html");
		} catch (d) {
			alert(d);
		}
	},
	datos: []
});
app.localization.registerView('Servicios');