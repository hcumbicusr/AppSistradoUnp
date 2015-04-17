/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/**
 * @author Cumbicus Rivera Henry (hcumbicusr@gmail.com)
 * @version v1.0
 */
$(document).ready(function(){

    initialize();
    // Application Constructor
    function initialize() {
        bindEvents();
    }
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    function bindEvents() {
        document.addEventListener('deviceready', onDeviceReady, false);
    }
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    function onDeviceReady() {
        console.log("Page: 1");
        receivedEvent('sistrado');
        console.log("Page: 2");
        //no cargar enlaces
        //$("#tblSistrado-popup").css("display","none");
        //--------- Aqui la carga se ha completado correctamente --------------
        $('#nroRegistro').keypress(function (){
            this.value = (this.value + '').replace(/[^0-9]/g, '');        
        });
        $('#nroDependencia').keypress(function (){
            this.value = (this.value + '').replace(/[^0-9]/g, '');        
        });
        $('#anio').keypress(function (){
            this.value = (this.value + '').replace(/[^0-9]/g, '');        
        });
        $('#correlativo').keypress(function (){
            this.value = (this.value + '').replace(/[^0-9]/g, '');        
        });
        //-----------------------
        function onBlud(e) {
            var val = $(this).val(), max = $(this).attr("maxlength");
            var ceros = "";
            for (var i = 0; i < max - 1; i++) {
                ceros += "0";
            };

            if (val != '') {
                var newval = (ceros + val).slice(-max);
                $(this).val(newval);
            }
        };

        function onKeyup(e) {
            var key = e.keyCode || event.which;
            if (key === 13) {
                $(this).blur();
                $(this).next().next().focus();
            }
        };
        
        $('#nroRegistro').blur(onBlud);
        $('#nroDependencia').blur(onBlud);
        $('#anio').blur(onBlud);
        $('#correlativo').blur(onBlud);

        $('#nroRegistro').keyup(onKeyup);
        $('#nroDependencia').keyup(onKeyup);
        $('#anio').keyup(onKeyup);
        $('#correlativo').keyup(function(e){
            var key = e.keyCode || event.which;
                if (key === 13) {
                    $(this).blur();
                    $("#btnBuscar").click();
                }
        });
        
        function vacio (value)
        {
            if (value.length == 0)
                return false;
            else
                return true;
        }
        
        $("#btnBuscar").click(function (){
           
            $("#asunto").html("");
            $("#solicitante").html("");
            $("#encabezado").html("");
            $("#table").html("");
            
            $("#asunto").css("text-align","justify");
                        
            $('#carga').html('<div><img src="img/loading.gif" width="30%"></div>');
            $('#carga').fadeIn(1000).css("display","block");
           
           if (vacio($('#nroRegistro').val()) && vacio($('#nroDependencia').val()) && vacio($('#anio').val()) && vacio($('#correlativo').val()))
           {            
                var request = $.ajax({
                    type: "post",
                    url: "http://200.60.47.81/sistrado/Home/ConsultarDocumento/",
                    dataType: "json",
                    data: {
                        NroRegistro: $('#nroRegistro').val(),
                        IdDependencia: $('#nroDependencia').val(),
                        Anio: $('#anio').val(),
                        Correlativo: $('#correlativo').val()
                    }
                });

                request.done(function(response){
                     var results = response.results;
                     var header = results.header;
                     var data = results.data;                                

                     console.log(header.Asunto);
                     //console.log(data[0].Accion);
                     console.log("DAta: "+data.length);
                     // tabla
                     var tabla = "<table data-role='table' id='tblSistrado' data-mode='columntoggle' "
                                        +"class='ui-body-d ui-shadow table-stripe ui-responsive' "
                                        +"data-column-btn-theme='b' "
                                        +"data-column-btn-text='Columns to display...' "
                                        +"data-column-popup-theme='a'>"
                                     +"<thead>"
                                         +"<tr class='ui-bar-inherit'>"
                                             +"<th data-priority='1' >N°</th>"
                                             +"<th data-priority='1' >Origen</th>"
                                             +"<th data-priority='1' >F. Envío</th>"
                                             +"<th data-priority='1' >Acción</th>"
                                             +"<th data-priority='1' >Destino</th>"
                                             +"<th data-priority='1' >F. Recepción</th>"
                                             +"<th data-priority='1' >Estado</th>"
                                         +"</tr>"
                                     +"</thead>"
                                     +"<tbody>";


                     if (data.length > 0)
                     {
                         $("#asunto").html("<label><b>Asunto:</b> "+header.Asunto+"</label><br>").css("color","#000000");
                         $("#solicitante").html("<label><b>Solicitante:</b> "+header.Solicitante+"</label><br>");
                         $("#encabezado").html("<label><b>Encabezado:</b> "+header.Encabezado+"</label><br>");

                         for(i = 0; i<data.length; i++){
                                 tabla +=
                                     "<tr><td>"+(i+1)+"</td><td>"
                                     +data[i].Origen+"</td><td>"
                                     +data[i].FechaEnvio+"</td><td>"
                                     +data[i].Accion+"</td><td>"
                                     +data[i].Destino+"</td><td>"
                                     +data[i].FechaRecepcion+"</td><td>"
                                     +data[i].Estado+"</td></tr>";
                         }
                         tabla +=  "</tbody>"
                                   +"</table>";

                         $('#carga').fadeOut(1000).css("display","none");// fin cargando
                         $("#table").html(tabla);

                     }else
                     {
                         $("#asunto").html("");
                         $("#solicitante").html("");
                         $("#encabezado").html("");

                         $("#table").html("");
                         $('#carga').fadeOut(1000).css("display","none");// fin cargando
                         $("#asunto").html("No se encontró el expediente").css("color","#FF0000");
                         $("#asunto").css("text-align","center");
                     }
                 });

                 request.fail(function (jqXHR,txtStatus){
                     console.log("Error: "+txtStatus);
                 });
                
           }else
           {
               $("#asunto").html("");
             $("#solicitante").html("");
             $("#encabezado").html("");

             $("#table").html("");
             $('#carga').fadeOut(1000).css("display","none");// fin cargando
             $("#asunto").html("Debe completar todos los campos").css("color","#FF0000");
             $("#asunto").css("text-align","center");
           }
           
        });
        
    }
    // Update DOM on a Received Event
    function receivedEvent(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        // solo se muestra si no hay conexion
        listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');                
        
        console.log('Received Event: ' + id);
    }
    
});