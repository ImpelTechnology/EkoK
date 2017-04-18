'use strict';
var tiposNovedades;
app.NovedadesCrear = kendo.observable({
	onInit: function () {
		try {
			var url2 = "https://www.impeltechnology.com/rest/api/getPicklist?output=json&objDefId=6983117&fieldDefId=6983234&sessionId=" + SessionId;
			$.ajax({
				url: url2,
				async: false,
				success: function (r) {
					try {
						tiposNovedades = r;
					} catch (h) {
						alert("h " + h);
					}
				},
				error: function (k) {
					alert("k2 " + k);
				}
			});

			var perfilcond = JSON.parse(sessionStorage.getItem("PerfilConductor"));
			var conductor = perfilcond.id;

			var datos = {
				query: "select name, RMarcas, modelo,NoMotor,RTipoVehiculo,RLineas,id from vehiculo1 where RProveedoresConductor = " + conductor,
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
								id: item[6]
							});
						});
						sessionStorage.setItem("MisVehic", JSON.stringify(Datos));
					} catch (e) {
						alert(e);
					}
				},
				error: function (err) {
					alert("1 " + JSON.stringify(err));
				}
			});

			var vehic = "";

			$.each(Datos, function (index, objeto) {
				if (index == 0) {
					vehic += objeto.id;
				} else {
					vehic += " OR R7028495 = " + objeto.id;
				}
			});
			/*
				Cliente
				R7032442 cliente
				comment
				Costo 
				Detalle
				Email_Cliente
				Fecha
				id
				Justificacion_Otros
				Manifiesto
				name
				Plan_de_Accion
				PQR
				Reporto_a_Tiempo
				Responsable
				Responsable_TKarga
				Resultado
				Retencion_de_Pago
				Secuencia
				R6983225 servicio
				Tiempo_de_Respuesta
				Tipo
				R7028495 vehiculo
				status
			
			 */

			var datos = {
				query: "select name, Detalle, R7028495,Tipo,Cliente,R7032442,Costo,Fecha,id,Justificacion_Otros,Manifiesto,Plan_de_Accion,PQR,Reporto_a_Tiempo,Responsable,Responsable_TKarga,Resultado,Retencion_de_Pago,Secuencia,R6983225,Tiempo_de_Respuesta,status from Novedad where R7028495 =" + vehic,
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

							var Vehi = {
								objName: "Vehiculo1",
								fieldList: "name",
								output: "json",
								id: item[2],
								sessionId: SessionId
							};
							var client = {
								objName: "Cliente1",
								fieldList: "name",
								output: "json",
								id: item[4],
								sessionId: SessionId
							};
							Datos.push({
								Novedad: item[0],
								Detalle: item[1],
								Vehiculo: ConsumirServicio(urlGet, "GET", Vehi, "name"),
								Tipo: CambiaTipoNovedad(item[3]),
								Cliente: ConsumirServicio(urlGet, "GET", client, "name"),
								R7032442: item[5],
								Costo: item[6],
								Fecha: item[7],
								id: item[8],
								Justificacion_Otros: item[9],
								Manifiesto: item[10],
								Plan_de_Accion: item[11],
								PQR: item[12],
								Reporto_a_Tiempo: item[13],
								Responsable: item[14],
								Responsable_TKarga: item[15],
								Resultado: item[16],
								Retencion_de_Pago: item[17],
								Secuencia: item[18],
								R6983225: item[19],
								Tiempo_de_Respuesta: item[20],
								status: item[21]
							});
						});
					} catch (e) {
						alert(e);
					}
				},
				error: function (err) {
					alert("2 " + JSON.stringify(err));
				}
			});
			var wdatos = new kendo.data.DataSource({
				data: Datos
			});
			app.NovedadesCrear.set("datos", wdatos);
		} catch (f) {
			alert(f);
		}
	},
	onShow: function () {
		kendo.ui.progress($("#MenuScreen"), false);
	},
	listViewClick: function (e) {
		try {
			sessionStorage.setItem("NovedadAVer", JSON.stringify(e.dataItem));
			kendo.mobile.application.navigate("components/NuevaNovedad/nuevanovedad.html");
		} catch (d) {
			alert(d);
		}
	},
	datos: []
});
function CambiaTipoNovedad(IdTipoNovedad) {
	try {
		var nombre;
		$.each(tiposNovedades, function (index, objeto) {
			if (objeto.id == IdTipoNovedad) {
				nombre = objeto.name;
			}
		});
		return nombre;
	} catch (g) {
		alert(g);
	}
}
app.localization.registerView('NovedadesCrear');
function NuevaNovedad2() {
	try {
		sessionStorage.setItem("ServicioNovedad", "");
		sessionStorage.setItem("NovedadAVer", "");
		kendo.mobile.application.navigate("components/NuevaNovedad/nuevanovedad.html");
	} catch (d) {
		alert(d);
	}

}
