'use strict';
var map, marker, color, icon, geocoder, idservicio;
app.Rutas = kendo.observable({
	onShow: function () {
		try {
			kendo.ui.progress($("#ServiciosScreen"), false);
			var paradas = sessionStorage.getItem("Paradas");

			var height = (screen.height * 25.46875) / 100;
			var height1 = screen.height - height; //resto el valor en px que corresponde al % que sobra 
			document.getElementById("map").style = "height:" + height1 + "px";

			var serv = JSON.parse(sessionStorage.getItem("ServiciosRutas"));
			idservicio = serv.id;
			directionsDisplay = new google.maps.DirectionsRenderer;
			directionsService = new google.maps.DirectionsService;

			var mapOptions = {
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			map = new google.maps.Map(document.getElementById("map"), mapOptions);
			directionsDisplay.setMap(map);
			geocoder = new google.maps.Geocoder;

			dibuja1servicio(serv, paradas);

		} catch (s) {
			alert(s);
		}
	},
	afterShow: function () { }
});
app.localization.registerView('Rutas');

var directionsDisplay;
var directionsService;
function dibuja1servicio(serv, paradas) {
	try {
		var origenlat;
		var origenlon;
		var destinolat;
		var destinolon;

		var FechaCargue = serv.fecha_y_hora_de_cargue;
		var FechaDescargue = serv.fecha_y_hora_de_descargue;

		var origen = convierteaCords(serv.Origen);
		var destino = convierteaCords(serv.Destino);

		origenlat = origen.lat;
		origenlon = origen.lon;
		destinolat = destino.lat;
		destinolon = destino.lon;

		calculateAndDisplayRoute(directionsService, directionsDisplay, origenlat, origenlon, destinolat, destinolon, paradas);
	} catch (g) {
		alert(g);
	}
}
function calculateAndDisplayRoute(directionsService, directionsDisplay, lat1, long1, lat2, long2, paradas) {
	try {
		var selectedMode = "DRIVING";
		if (paradas) {
			paradas = JSON.parse(paradas);
			var paradasCords = [];
			$.each(paradas, function (index, item) {
				paradasCords.push(convierteaCords(traesede(item.Parada)));
			});
			var waypts = [];
			$.each(paradasCords, function (index, item) {
				var parada = item.lat + "," + item.lon;
				waypts.push({
					location: parada,
					stopover: true
				});
			});
			var request = {
				origin: { lat: lat1, lng: long1 },
				destination: { lat: lat2, lng: long2 },
				waypoints: waypts,
				travelMode: google.maps.TravelMode.DRIVING
			};
		} else {
			var request = {
				origin: { lat: lat1, lng: long1 },
				destination: { lat: lat2, lng: long2 },
				travelMode: google.maps.TravelMode.DRIVING
			};
		}

		directionsService.route(request, function (result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
			} else {
				alert('Directions request failed due to ' + status);
			}
		});
	} catch (k) {
		alert("k " + k);
	}
}

function calculardistancia(lat1, long1, lat2, long2) {
	try {
		var origin1 = { lat: lat1, lng: long1 };
		var destinationA = { lat: lat2, lng: long2 };
		var origens = [origin1];
		var destins = [destinationA];
		var distancia;
		var service = new google.maps.DistanceMatrixService;
		service.getDistanceMatrix({
			origins: origens,
			destinations: destins,
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: true,
		}, function (response, status) {
			try {
				if (response.rows[0].elements[0].status == "ZERO_RESULTS") {
					alert("No se encuentra la distancia");
					return;
				} else {
					var originList = response.originAddresses;
					var destinationList = response.destinationAddresses;

					distancia = response.rows[0].elements[0].distance.value;
					var duracion = response.rows[0].elements[0].duration.value;
				}
			} catch (l) {
				alert(l);
			}
		});
	} catch (s) {
		alert("s " + s);
	}
}

function convierteaCords(sitio) {
	try {
		var sitiolat;
		var sitiolon;

		var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + sitio;
		$.ajax({
			url: url,
			async: false,
			success: function (e) {
				try {
					if (e.status == "ZERO_RESULTS") {
						alert(" Es posible que la dirección no exista");
						return;
					}
					sitiolat = e.results[0].geometry.location.lat;
					sitiolon = e.results[0].geometry.location.lng;
				} catch (h) {
					alert("h2 " + h);
				}
			},
			error: function (d) {
				alert("d " + d);
			}
		});
		var sitio = { lat: sitiolat, lon: sitiolon };
		return (sitio);
	} catch (h) {
		alert("h2 " + h);
	}
}
function traesede(id) {
	var datos = {
		query: "Select direccion from sede where id = " + id,
		sessionId: SessionId,
		startRow: 0,
		maxRows: 100,
		output: "json"
	};
	var sede;
	$.ajax({
		url: "https://www.impeltechnology.com/rest/api/selectQuery",
		type: "GET",
		dataType: "json",
		data: datos,
		async: false,
		success: function (data) {
			try {
				sede = data;
			} catch (e) {
				alert(e);
			}
		},
		error: function (err) {
			alert(JSON.stringify(err));
		}
	});
	return (sede);
}
function FotoCumplido() {
	try {
		var that = this;
		navigator.camera.getPicture(onPictureSuccess, function () {
			alert("Error");
		}, {
				quality: 50, destinationType: Camera.DestinationType.DATA_URL
			});
	} catch (d) {
		alert(d);
	}
}
function onPictureSuccess(imageData) {
	kendo.ui.progress($("#RutasScreen"), true);
	var file = {
		Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
		ContentType: "image/jpeg",
		base64: imageData
	};
	var url = "https://www.impeltechnology.com/rest/api/setBinaryData";
	var content = {
		id: idservicio,
		fieldName: "Cumplido_Servicio",
		fileName: file.Filename,
		contentType: file.ContentType,
		value: file.base64,
		sessionId: SessionId,
		output: "json"
	};

	$.ajax({
		url: url,
		type: "POST",
		data: content,
		async: false,
		success: function (data) {
			if (data.status == "ok") {
				alert("Imagen cargada satisfactoriamente")
			}
			kendo.ui.progress($("#RutasScreen"), false);
		},
		error: function (err) {
			alert(JSON.stringify(err));
			kendo.ui.progress($("#RutasScreen"), false);
			return;
		}
	});
}
function SubeNovedad() {
	sessionStorage.setItem("ServicioNovedad", sessionStorage.getItem("ServiciosRutas"));
	kendo.mobile.application.navigate("components/NuevaNovedad/nuevanovedad.html");

}