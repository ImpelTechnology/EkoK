'use strict';
app.Serviciosdisponibles = kendo.observable({
	onInit: function () {
		try {
			var tiposVehiculos = JSON.parse(sessionStorage.getItem("TiposVehiculos"));
			var tipos = "";
			var carrocerias = "";

			$.each(tiposVehiculos, function (index, objeto) {
				if (index == 0) {
					if (tiposVehiculos.length == 1) {
						tipos += objeto.RTipoVehiculo + ")";
						carrocerias += objeto.Carroceria + ")";
					} else {
						tipos += objeto.RTipoVehiculo;
						carrocerias += objeto.Carroceria;
					}
				} else {
					tipos += " OR R7074667 = " + objeto.RTipoVehiculo + ")";
					carrocerias += " OR CarroceriaServ = " + objeto.Carroceria + ")";
				}
			});

			var datos = {
				query: "select Num_Servicio,Origen,Destino,R6947057,fecha_y_hora_de_cargue,fecha_y_hora_de_descargue,peso,transito,unidad,Tipo_de_Servcicio,status,R7074667,CarroceriaServ from Servicio where status = 6948340 AND (R7074667 =" + tipos + " AND (CarroceriaServ =" + carrocerias,
				sessionId: SessionId,
				startRow: 0,
				maxRows: 300,
				output: "json"
			};

			var Datos = [];
			$.ajax({
				url: "https://www.impeltechnology.com/rest/api/selectQuery",
				type: "GET",
				dataType: "json",
				data: datos,
				async: false,
				success: function (data) {
					try {
						$.each(data, function (index, item) {
							var urlGet = "https://www.impeltechnology.com/rest/api/getRecord";
							var orig = {
								objName: "Ciudad",
								fieldList: "Nombre",
								output: "json",
								id: item[1],
								sessionId: SessionId
							};
							var dest = {
								objName: "Ciudad",
								fieldList: "Nombre",
								output: "json",
								id: item[2],
								sessionId: SessionId
							};
							Datos.push({
								Num_Servicio: item[0],
								Origen: ConsumirServicio(urlGet, "GET", orig, "Nombre"),
								Destino: ConsumirServicio(urlGet, "GET", dest, "Nombre"),
								R6947057: item[3],
								fecha_y_hora_de_cargue: item[4],
								fecha_y_hora_de_descargue: item[5],
								peso: item[6],
								transito: item[7],
								unidad: item[8],
								Tipo_de_Servcicio: item[9],
								status: item[10],
								tipoVeh: item[11],
								Carroceria: item[12],
								vehiculoPosible: sugiereveh(item[12])
							});
						});
					} catch (e) {
						alert(e);
					}
				},
				error: function (err) {
					alert(JSON.stringify(err));
				}
			});
			var wdatos = new kendo.data.DataSource({
				data: Datos,
				group: { field: "vehiculoPosible" }
			});
			app.Serviciosdisponibles.set("datos", wdatos);
		} catch (f) {
			alert(f);
		}
	},
	onShow: function () {
		kendo.ui.progress($("#MenuScreen"), false);
	},
	listViewClick: function (e) {
		try {
			sessionStorage.setItem("ServiciosRutas", JSON.stringify(e.dataItem));
			kendo.mobile.application.navigate("components/Rutas/rutas.html");
		} catch (d) {
			alert(d);
		}
	},
	datos: []
});
app.localization.registerView('Serviciosdisponibles');
function sugiereveh(idTipo) {
	var tiposVehiculos = JSON.parse(sessionStorage.getItem("TiposVehiculos"));
	var vehiculos = "";

	$.each(tiposVehiculos, function (index, objeto) {
		if(objeto.Carroceria==idTipo){
			vehiculos += objeto.Placa;
		}
	});
	return (vehiculos);
}
