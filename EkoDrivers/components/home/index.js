'use strict';

app.home = kendo.observable({
	onShow: function () {
		try {
			document.getElementById("email").value = "impel";
			document.getElementById("password").value = "impel";

			var button = $("#buttonIniciaSesion").kendoButton();
			button.bind("click", function (e) {
				kendo.ui.progress($("#homeScreen"), true);
				var usuario = "ekokarga.conductor";//document.getElementById("email").value;
				var contras = "ConductorEko";//document.getElementById("password").value;

				var Url = "https://www.impeltechnology.com/rest/api/login?output=json";

				var usuarioLogIn = {
					loginName: usuario,
					password: contras
				};

				$.ajax({
					url: Url,
					type: "GET",
					dataType: "json",
					data: usuarioLogIn,
					async: false,
					success: function (data) {
						if (data.status == "ok") {
							SessionId = data.sessionId;
						}
					},
					error: function (err) {
						alert(JSON.stringify(err));
						return;
					}
				});
				VerificaConductor();
			});

		} catch (s) {
			alert(s);
		}
	},
	afterShow: function () { }
});
app.localization.registerView('home');
function VerificaConductor() {
	var usuario = document.getElementById("email").value;
	var contras = document.getElementById("password").value;

	var datos = {
		query: "select nombre,nit,celular,direccion,email,Licencia_de_Conduccin,Fecha_Vencimiento_Licencia,id from Proveedor where Login_Conductor ='" + usuario + "' AND Clave_Conductor='" + contras + "'",
		sessionId: SessionId,
		startRow: 0,
		maxRows: 100,
		output: "json"
	};
	var PerfilConductor = [];
	$.ajax({
		url: "https://www.impeltechnology.com/rest/api/selectQuery",
		type: "GET",
		dataType: "json",
		data: datos,
		async: false,
		success: function (data) {
			try {
				if (data == "") {
					alert("Usuario o contraseña incorrectos");
					return;
				}
				$.each(data, function (index, item) {
					PerfilConductor.push({
						nombre: item[0],
						nit: item[1],
						celular: item[2],
						direccion: item[3],
						email: item[4],
						Licencia_de_Conduccin: item[5],
						Fecha_Vencimiento_Licencia: item[6],
						id: item[7]
					});
				});
				sessionStorage.setItem("PerfilConductor", JSON.stringify(PerfilConductor[0]));
				kendo.mobile.application.navigate("components/Menu/Menu.html");
			} catch (e) {
				alert(e);
			}
		},
		error: function (err) {
			alert(JSON.stringify(err));
			return;
		}
	});
}