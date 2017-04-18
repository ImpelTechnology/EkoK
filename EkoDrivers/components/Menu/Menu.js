'use strict';
app.Menu = kendo.observable({
	onShow: function () {
		sessionStorage.setItem("ServicioNovedad", "");
		sessionStorage.setItem("NovedadAVer", "");
		var perfilcond = JSON.parse(sessionStorage.getItem("PerfilConductor"));

		if (perfilcond.Fecha_Vencimiento_Licencia) {
			var hoy = new Date();
			var HoyMas5Dias = sumarDias(new Date(), 5);
			var VencimientoLicencia = new Date(perfilcond.Fecha_Vencimiento_Licencia);

			if (VencimientoLicencia < HoyMas5Dias) {
				var fechaInicio = (new Date(VencimientoLicencia)).getTime();
				var fechaFin = (new Date(hoy)).getTime();

				var diff = fechaInicio - fechaFin;
				var dias = diff / (1000 * 60 * 60 * 24);
				alert("Señor " + perfilcond.nombre + ", su licencia de conducción vence en " + Math.ceil(dias) + " días.");
			}
		}

		var conductor = perfilcond.id;
		kendo.ui.progress($("#homeScreen"), false);

		var datos = {
			query: "Select RTipoVehiculo, id, CarroceriaVehic,name, SOAT_Vencimiento from vehiculo1 where RProveedoresConductor = " + conductor,
			sessionId: SessionId,
			startRow: 0,
			maxRows: 100,
			output: "json"
		};

		var TiposVehiculosConductor = [];
		$.ajax({
			url: "https://www.impeltechnology.com/rest/api/selectQuery",
			type: "GET",
			dataType: "json",
			data: datos,
			async: false,
			success: function (data) {
				try {
					$.each(data, function (index, item) {
						TiposVehiculosConductor.push({
							RTipoVehiculo: item[0],
							Carroceria: item[2],
							id: item[1],
							Placa: item[3],
							FechaSOAT: item[4]
						});
					});
				} catch (e) {
					alert(e);
				}
			},
			error: function (err) {
				alert("s" + JSON.stringify(err));
			}
		});
		$.each(TiposVehiculosConductor, function (index, objeto) {
			if (objeto.FechaSOAT) {
				var hoy = new Date();
				var HoyMas5Dias = sumarDias(new Date(), 5);
				var VencimientoSOAT = new Date(objeto.FechaSOAT);

				if (VencimientoSOAT < HoyMas5Dias) {
					var fechaInicio = (new Date(VencimientoSOAT)).getTime();
					var fechaFin = (new Date(hoy)).getTime();

					var diff = fechaInicio - fechaFin;
					var dias = diff / (1000 * 60 * 60 * 24);
					if(Math.ceil(dias)>0){
						alert("Señor " + perfilcond.nombre + ", el SOAT de su vehículo de placa " + objeto.Placa + " vence en " + Math.ceil(dias) + " días.");
					}else{
						alert("Señor " + perfilcond.nombre + ", el SOAT de su vehículo de placa " + objeto.Placa + " venció hace " + ((Math.ceil(dias))*-1) + " días.");
					}
				}
			}
		});
		sessionStorage.setItem("TiposVehiculos", JSON.stringify(TiposVehiculosConductor));
	},
	afterShow: function () { },
	inicializa: function () { }
});
app.localization.registerView('Menu');
// START_CUSTOM_CODE_miKia2
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
function perfil() {
	kendo.ui.progress($("#MenuScreen"), true);
	kendo.mobile.application.navigate("components/perfil/perfil.html");
}
function vehiculos() {
	kendo.ui.progress($("#MenuScreen"), true);
	kendo.mobile.application.navigate("components/Vehiculos/vehiculos.html");
}
function novedades() {
	kendo.ui.progress($("#MenuScreen"), true);
	kendo.mobile.application.navigate("components/Novedades/novedades.html");
}
function buzon() {
	kendo.ui.progress($("#MenuScreen"), true);
	kendo.mobile.application.navigate("components/Buzon/buzon.html");
}
// END_CUSTOM_CODE_miKia2
function sumarDias(fecha, dias) {
	fecha.setDate(fecha.getDate() + dias);
	return fecha;
}