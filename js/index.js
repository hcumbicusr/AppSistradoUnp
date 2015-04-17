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
        $('#dependencia').keypress(function (){
            this.value = (this.value + '').replace(/[^0-9]/g, '');        
        });
        $('#correlativo').keypress(function (){
            this.value = (this.value + '').replace(/[^0-9]/g, '');        
        });
        //-----------------------
        
        $("#btnBuscar").click(function (){
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
                
                $("#tblSistrado tbody").html("");
                
                console.log(header.Asunto);
                console.log(data[0].Accion);
                
                if (header.Asunto != null)
                {
                    $("#asunto").html("<label><b>Asunto:</b> "+header.Asunto+"</label><br>");
                    $("#solicitante").html("<label><b>Solicitante:</b> "+header.Solicitante+"</label><br>");
                    $("#encabezado").html("<label><b>Encabezado:</b> "+header.Encabezado+"</label><br>");
                    
                    for(i = 0; i<data.length; i++){
                            $("#tblSistrado tbody").append(
                                "<tr><td>"+(i+1)+"</td><td>"
                                +data[i].Origen+"</td><td>"
                                +data[i].FechaEnvio+"</td><td>"
                                +data[i].Accion+"</td><td>"
                                +data[i].Destino+"</td><td>"
                                +data[i].FechaRecepcion+"</td><td>"
                                +data[i].Estado+"</td></tr>"
                            );
                    }
                }else
                {
                    $("#tblSistrado tbody").html("Sin datos para mostrar");
                }
            });

            request.fail(function (jqXHR,txtStatus){
                console.log("Error: "+txtStatus);
            });
           
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