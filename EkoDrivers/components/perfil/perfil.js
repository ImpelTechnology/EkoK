'use strict';

app.Perfil = kendo.observable({
	onShow: function () {
		kendo.ui.progress($("#MenuScreen"), false);
		$("#VencLicenciaConductor").kendoDatePicker();
		/*PerfilConductor.push({
			nombre: item[0],
			nit: item[1],
			celular: item[2],
			direccion: item[3],
			email: item[4],
			Licencia_de_Conduccin: item[5],
			Fecha_Vencimiento_Licencia: item[6],
			id: item[7]
		}); */
		var datosConductor = JSON.parse(sessionStorage.getItem("PerfilConductor"));

		document.getElementById("nombreConductor").value = datosConductor.nombre;
		document.getElementById("CedulaConductor").value = datosConductor.nit;
		document.getElementById("CelularConductor").value = datosConductor.celular;
		document.getElementById("DireccionConductor").value = datosConductor.direccion;
		document.getElementById("EmailConductor").value = datosConductor.email;
		document.getElementById("LicenciaConductor").value = datosConductor.Licencia_de_Conduccin;
		var CampoFecha = $('#VencLicenciaConductor').data("kendoDatePicker");
		CampoFecha.value(new Date(datosConductor.Fecha_Vencimiento_Licencia));

	},
	afterShow: function () { },
	inicializa: function () {

	}
});
app.localization.registerView('Perfil');

// START_CUSTOM_CODE_miKia2
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_miKia2