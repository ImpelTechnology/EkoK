'use strict';
var servicioNovedad;
var Servicio, Cliente, Vehiculo, Fecha, Manifiesto, Tipo, JustifOtro, Costo, Responsable, ResponsableTK, ReportoATiempo, TiempoRespuesta, RetencionPago, PQR, Detalle, PlanAccion, Resultado;
var CampoFecha;
app.Novedades = kendo.observable({
	Init: function () {
		try {
			$('#FechaC').kendoDatePicker();
			$("#Cliente").kendoComboBox();
			$("#Vehiculo").kendoComboBox();
			$("#Tipo").kendoComboBox();
			$("#Responsable").kendoComboBox();
			$("#ResponsableTK").kendoComboBox();
			$("#TiempoRespuesta").kendoComboBox();
			$("#ReportoATiempo").kendoMobileSwitch();
			$("#RetencionPago").kendoMobileSwitch();
			$("#PQR").kendoMobileSwitch();
		} catch (d) {
			alert(d);
		}

	},
	onShow: function () {
		try {
			CampoFecha = $('#FechaC').data("kendoDatePicker");
			CampoFecha.value(new Date());
			kendo.ui.progress($("#MenuScreen"), false);

			Servicio = document.getElementById("Servicio");
			Cliente = document.getElementById("Cliente");
			Vehiculo = document.getElementById("Vehiculo");
			Fecha = document.getElementById("FechaC");
			Manifiesto = document.getElementById("Manifiesto");
			Tipo = document.getElementById("Tipo");
			JustifOtro = document.getElementById("JustifOtro");
			Costo = document.getElementById("Costo");
			Responsable = document.getElementById("Responsable");
			ResponsableTK = document.getElementById("ResponsableTK");
			ReportoATiempo = document.getElementById("ReportoATiempo");
			TiempoRespuesta = document.getElementById("TiempoRespuesta");
			RetencionPago = document.getElementById("RetencionPago");
			PQR = document.getElementById("PQR");
			Detalle = document.getElementById("Detalle");
			PlanAccion = document.getElementById("PlanAccion");
			Resultado = document.getElementById("Resultado");
			/*
				Num_Servicio
				Origen
				Destino
				R6947057
				fecha_y_hora_de_cargue
				fecha_y_hora_de_descargue
				peso
				transito
				unidad
				Tipo_de_Servcicio
				status
				id
			 */


			if ((sessionStorage.getItem("ServicioNovedad")) && (sessionStorage.getItem("ServicioNovedad") != "")) {
				servicioNovedad = JSON.parse(sessionStorage.getItem("ServicioNovedad"));

				Servicio.value = servicioNovedad.Num_Servicio;
				Cliente.value = servicioNovedad.cliente;
				Vehiculo.value = servicioNovedad.Vehiculo;

				/*	Manifiesto.value = servicioNovedad.
						Tipo.value = servicioNovedad.
							JustifOtro.value = servicioNovedad.
							Costo.value = servicioNovedad.
								Responsable.value = servicioNovedad.
									ResponsableTK.value = servicioNovedad.
										ReportoATiempo.value = servicioNovedad.
											TiempoRespuesta.value = servicioNovedad.
												RetencionPago.value = servicioNovedad.
													PQR.value = servicioNovedad.
														Detalle.value = servicioNovedad.
															PlanAccion.value = servicioNovedad.
																Resultado.value = servicioNovedad.
																*/
			} else if ((sessionStorage.getItem("NovedadAVer")) && (sessionStorage.getItem("NovedadAVer") != "")) {

				var Novedad = JSON.parse(sessionStorage.getItem("NovedadAVer"));
				CampoFecha.value(new Date(Novedad.Fecha));
				//	value: new Date(Novedad.Fecha)

				Servicio.value = Novedad.Novedad;
				Cliente.value = Novedad.Cliente;
				Vehiculo.value = Novedad.Vehiculo;
				Manifiesto.value = Novedad.Manifiesto;
				Tipo.value = Novedad.Tipo;
				JustifOtro.value = Novedad.Justificacion_Otros;
				Costo.value = Novedad.Costo;
				Responsable.value = Novedad.Responsable;
				ResponsableTK.value = Novedad.Responsable_TKarga;
				if (Novedad.Reporto_a_Tiempo == 1) {
					var switchInstance = $("#ReportoATiempo").data("kendoMobileSwitch");
					switchInstance.check(true);
				}else{
					var switchInstance = $("#ReportoATiempo").data("kendoMobileSwitch");
					switchInstance.check(false);
				}
				TiempoRespuesta.value = Novedad.Tiempo_de_Respuesta;
				if (Novedad.Retencion_de_Pago == 1) {
					var switchInstance = $("#RetencionPago").data("kendoMobileSwitch");
					switchInstance.check(true);
				}else{
					var switchInstance = $("#RetencionPago").data("kendoMobileSwitch");
					switchInstance.check(false);
				}
				if (Novedad.PQR == 1) {
					var switchInstance = $("#PQR").data("kendoMobileSwitch");
					switchInstance.check(true);
				}else{
					var switchInstance = $("#PQR").data("kendoMobileSwitch");
					switchInstance.check(false);
				}
				Detalle.value = Novedad.Detalle;
				PlanAccion.value = Novedad.Plan_de_Accion;
				Resultado.value = Novedad.Resultado;
			} else {
				Servicio.value = "";

				var combobox = $("#Cliente").data("kendoComboBox");
				combobox.select(-1);

				var combobox = $("#Vehiculo").data("kendoComboBox");
				combobox.select(-1);

				var combobox = $("#Tipo").data("kendoComboBox");
				combobox.select(-1);

				var combobox = $("#Responsable").data("kendoComboBox");
				combobox.select(-1);

				var combobox = $("#ResponsableTK").data("kendoComboBox");
				combobox.select(-1);

				var combobox = $("#TiempoRespuesta").data("kendoComboBox");
				combobox.select(-1);
				Manifiesto.value = "";
				JustifOtro.value = "";
				Costo.value = "";
				ReportoATiempo.value = "";
				RetencionPago.value = "";
				PQR.value = "";
				Detalle.value = "";
				PlanAccion.value = "";
				Resultado.value = "";
			}
		} catch (s) {
			alert(s);
		}
	},
	afterShow: function () {
		try {

			var url2 = "https://www.impeltechnology.com/rest/api/getPicklist?output=json&objDefId=6983117&fieldDefId=6983234&sessionId=" + SessionId;
			$.ajax({
				url: url2,
				success: function (r) {
					try {
						$("#Tipo").kendoComboBox({
							dataTextField: "name",
							dataValueField: "id",
							dataSource: r,
							change: function (e) {
								var widget = e.sender;
								if (widget.value() && widget.select() === -1) {
									widget.value("");
								}
							}
						});
					} catch (h) {
						alert("h " + h);
					}
				},
				error: function (k) {
					alert("k2 " + k);
				}
			});



			var url2 = "https://www.impeltechnology.com/rest/api/getPicklist?output=json&objDefId=6983117&fieldDefId=6989860&sessionId=" + SessionId;
			$.ajax({
				url: url2,
				success: function (r) {
					try {
						$("#Responsable").kendoComboBox({
							dataTextField: "name",
							dataValueField: "id",
							dataSource: r,
							change: function (e) {
								var widget = e.sender;
								if (widget.value() && widget.select() === -1) {
									widget.value("");
								}
							}
						});
					} catch (h) {
						alert("h " + h);
					}
				},
				error: function (k) {
					alert("k2 " + k);
				}
			});

			var url2 = "https://www.impeltechnology.com/rest/api/getPicklist?output=json&objDefId=6983117&fieldDefId=6989885&sessionId=" + SessionId;
			$.ajax({
				url: url2,
				success: function (r) {
					try {
						$("#ResponsableTK").kendoComboBox({
							dataTextField: "name",
							dataValueField: "id",
							dataSource: r,
							change: function (e) {
								var widget = e.sender;
								if (widget.value() && widget.select() === -1) {
									widget.value("");
								}
							}
						});
					} catch (h) {
						alert("h " + h);
					}
				},
				error: function (k) {
					alert("k2 " + k);
				}
			});

			var url2 = "https://www.impeltechnology.com/rest/api/getPicklist?output=json&objDefId=6983117&fieldDefId=6983283&sessionId=" + SessionId;
			$.ajax({
				url: url2,
				success: function (r) {
					try {
						$("#TiempoRespuesta").kendoComboBox({
							dataTextField: "name",
							dataValueField: "id",
							dataSource: r,
							change: function (e) {
								var widget = e.sender;
								if (widget.value() && widget.select() === -1) {
									widget.value("");
								}
							}
						});
					} catch (h) {
						alert("h " + h);
					}
				},
				error: function (k) {
					alert("k2 " + k);
				}
			});

			var datos = {
				query: "Select name,id from Cliente1",
				sessionId: SessionId,
				startRow: 0,
				maxRows: 300,
				output: "json"
			};
			var clientes = [];
			$.ajax({
				url: "https://www.impeltechnology.com/rest/api/selectQuery",
				type: "GET",
				dataType: "json",
				data: datos,
				async: false,
				success: function (data) {
					try {
						$.each(data, function (index, item) {
							clientes.push({
								name: item[0],
								id: item[1]
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
			$("#Cliente").kendoComboBox({
				dataTextField: "name",
				dataValueField: "id",
				dataSource: clientes,
				change: function (e) {
					var widget = e.sender;
					if (widget.value() && widget.select() === -1) {
						widget.value("");
					}
				}
			});

			$("#Vehiculo").kendoComboBox({
				dataTextField: "name",
				dataValueField: "id",
				dataSource: JSON.parse(sessionStorage.getItem("MisVehic")),
				change: function (e) {
					var widget = e.sender;
					if (widget.value() && widget.select() === -1) {
						widget.value("");
					}
				}
			});
		} catch (s) {
			alert(s);
		}
	},
	inicializa: function () {
		try {

		}
		catch (s) {
			alert(s);
		}
	}
});
app.localization.registerView('Novedades');