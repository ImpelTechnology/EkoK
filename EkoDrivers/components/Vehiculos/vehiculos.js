'use strict';

app.Vehiculos = kendo.observable({
	onShow: function () {
		try {
			kendo.ui.progress($("#MenuScreen"), false);

			var perfilcond = JSON.parse(sessionStorage.getItem("PerfilConductor"));
			var conductor = perfilcond.id;
			var arregloamostrar = [];

			var datos = {
				query: "select name, RMarcas, modelo,NoMotor,RTipoVehiculo,RLineas,id,status from vehiculo1 where RProveedoresConductor = " + conductor,
				sessionId: SessionId,
				startRow: 0,
				maxRows: 100,
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
							Datos.push({
								name: item[0],
								RMarcas: item[1],
								modelo: item[2],
								NoMotor: item[3],
								RTipoVehiculo: item[4],
								RLineas: item[5],
								id: item[6],
								status: cambiaestado(item[7])
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
				group: { field: "status" }
			});

			app.Vehiculos.set("datos", wdatos);
		} catch (f) {
			alert(f);
		}
	},
	afterShow: function () { },
	inicializa: function () { },
	listViewClick: function (e) {
		try {
			kendo.ui.progress($("#VehiculosScreen"), true);
			var IdVehi = e.dataItem.id;
			var datos = {
				query: "select Num_Servicio,Origen,Destino,R6947057,fecha_y_hora_de_cargue,fecha_y_hora_de_descargue,peso,transito,unidad,Tipo_de_Servcicio,status,id,R6311987 from Servicio where R6947057 =" + IdVehi,
				sessionId: SessionId,
				startRow: 0,
				maxRows: 100,
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
						if (data == "") {
							alert("El vehículo no tiene servicios asignados");
							kendo.ui.progress($("#VehiculosScreen"), false);
							return;
						} else {
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
								var vehi = {
									objName: "vehiculo1",
									fieldList: "name",
									output: "json",
									id: item[3],
									sessionId: SessionId
								};
								var client = {
									objName: "Cliente1",
									fieldList: "name",
									output: "json",
									id: item[12],
									sessionId: SessionId
								};
								Datos.push({
									Num_Servicio: item[0],
									Origen: ConsumirServicio(urlGet, "GET", orig, "Nombre"),
									Destino: ConsumirServicio(urlGet, "GET", dest, "Nombre"),
									Vehiculo: ConsumirServicio(urlGet, "GET", vehi, "name"),
									fecha_y_hora_de_cargue: item[4],
									fecha_y_hora_de_descargue: item[5],
									peso: item[6],
									transito: item[7],
									unidad: item[8],
									Tipo_de_Servcicio: item[9],
									status: cambiaestado(item[10]),
									id: item[11],
									cliente: ConsumirServicio(urlGet, "GET", client, "name")
								});
							});

							var wdatos = new kendo.data.DataSource({
								data: Datos,
								group: { field: "status" }
							});

							app.Servicios.set("datos", wdatos);
							kendo.mobile.application.navigate("components/Servicios/servicios.html");
						}
					} catch (e) {
						alert(e);
					}
				},
				error: function (err) {
					alert(JSON.stringify(err));
				}
			});
		} catch (d) {
			alert(d);
		}
	},
	datos: []
});
app.localization.registerView('Vehiculos');