/**
 * Paint panel.
 */

cpu_adding.PaintPanel = function (containerId) {
    this.containerId = containerId;
};

cpu_adding.PaintPanel.prototype = {


    init: function () {
        this._initMarkup(this.containerId);
    },

    _initMarkup: function (containerId) {
        var container = $('#' + containerId);
	 var self = this;

                container.append('<div class="sc-no-default-cmd_add">Агент добавления процессоров по заданным характеристикам</div>');
                container.append('Идентификатор:</br>');
		container.append('<input type="text" value="" id="cpu_identifier_add" /></br>');
                container.append('Название:</br>');
		container.append('<input type="text" value="" id="cpu_name_add" /></br>');
		container.append('Производитель:</br>');
		container.append('<input type="text" value="" id="cpu_producer_add" /></br>');
		container.append('Максимальное количество потоков:</br>');
		container.append('<input type="text" value="" id="max_flow_quantity_add" /></br>');
		container.append('Год производства:</br>');
		container.append('<input type="text" value="" id="manufacture_year_add" /></br>');
		container.append('Тактовая частота(МГц):</br>');
		container.append('<input type="text" value="" id="clock_frequency_add" /></br>');
		container.append('Количество ядер:</br>');
		container.append('<input type="text" value="" id="kernel_quantity_add" /></br>');
		container.append('Сокет:</br>');
		container.append('<input type="text" value="" id="socket_add" /></br>');
		container.append('Модельный ряд:</br>');
		container.append('<input type="text" value="" id="model_range_add" /></br>');
		container.append('Кодовое название кристалла:</br>');
		container.append('<input type="text" value="" id="code_crystal_name_add" /></br>');
                container.append('Turbo-частота(МГц):</br>');
		container.append('<input type="text" value="" id="turbo_speed_add" /></br>');
		container.append('<button id="add_cpus" type="button">Добавить</button></br>');




          $('#add_cpus').click(function () {
               if(isValidUserInput()){
                  self._generateNodesProcessor();
               } else alert('Необходимые данные для работы: Идентификатор, Название!');
          });
    },



    _generateNodesProcessor: function () {

     var idtf_value = document.getElementById("cpu_identifier_add").value;
     var name_value = document.getElementById("cpu_name_add").value;
     var producer_value = document.getElementById("cpu_producer_add").value;
     var maxFlow_value = document.getElementById("max_flow_quantity_add").value;
     var manufactureYear_value = document.getElementById("manufacture_year_add").value;
     var clockFreq_value = document.getElementById("clock_frequency_add").value;
     var kernel_value = document.getElementById("kernel_quantity_add").value;
     var socket_value = document.getElementById("socket_add").value;
     var modelRange_value = document.getElementById("model_range_add").value;
     var codeCrystal_value = document.getElementById("code_crystal_name_add").value;
     var turboSpeed_value = document.getElementById("turbo_speed_add").value;

     var keynodes_to_search = ['processor', 'nrel_main_idtf', 'sc_node_not_relation','nrel_producer', 'nrel_manufacture_date',
                               'nrel_model_range', 'nrel_code_crystal_name', 'nrel_socket', 'nrel_kernel_quantity', 
                               'nrel_max_flow_quantity','nrel_clock_frequency', 'nrel_turbo_speed', 'nrel_system_idtf', 'quantity',
                               'producer', 'socket', 'proc_model_range', 'code_crystal_name'];

		SCWeb.core.Server.resolveScAddr(keynodes_to_search, function (keynodes) {
			var processor_concept = keynodes['processor'];
                        var producer_concept = keynodes['producer'];
                        var socket_concept = keynodes['socket'];
                        var model_range_concept = keynodes['proc_model_range'];
                        var code_crystal_name_concept = keynodes['code_crystal_name'];
                        var nrel_producer = keynodes['nrel_producer'];
                        var nrel_manufacture_date = keynodes['nrel_manufacture_date'];
                        var nrel_model_range = keynodes['nrel_model_range'];
                        var nrel_code_crystal_name = keynodes['nrel_code_crystal_name'];
                        var nrel_socket = keynodes['nrel_socket'];
                        var nrel_kernel_quantity = keynodes['nrel_kernel_quantity'];
                        var nrel_max_flow_quantity = keynodes['nrel_max_flow_quantity'];
                        var nrel_clock_frequency = keynodes['nrel_clock_frequency'];
                        var nrel_turbo_speed = keynodes['nrel_turbo_speed'];
                        var nrel_main_idtf = keynodes['nrel_main_idtf'];
                        var nrel_system_idtf = keynodes['nrel_system_idtf'];
                        var quantity = keynodes['quantity'];
                        var norole_relation = keynodes['sc_node_not_relation'];
                       
                        window.sctpClient.create_node(sc_type_const).done(function (nodeProc) {
                              
                               window.sctpClient.create_link().done(function (linkIdtf) {
			              window.sctpClient.set_link_content(linkIdtf, idtf_value);
                                      window.sctpClient.create_arc(sc_type_const, nodeProc, linkIdtf).done(function (generatedCommonArc) {
                                               window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_system_idtf, generatedCommonArc);
                                      });
                                      window.sctpClient.create_arc(sc_type_arc_pos_const_perm, norole_relation, nodeProc);
                                      addRelationIntoScs(idtf_value, 'sc_node_not_relation');
			       

                               window.sctpClient.create_link().done(function (linkName) {
			              window.sctpClient.set_link_content(linkName, name_value);
                                      window.sctpClient.create_arc(sc_type_const, nodeProc, linkName).done(function (generatedCommonArc) {
                                               window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_main_idtf, generatedCommonArc);
                                      });
                                      window.sctpClient.create_arc(sc_type_arc_pos_const_perm, processor_concept, nodeProc);
                                      addProcessorConceptIntoScs(idtf_value, name_value, 'processor');
                                      addMainIdtfIntoScs(idtf_value, name_value, 'nrel_main_idtf');
			       });

                               if(producer_value != ""){
                               window.sctpClient.create_link().done(function (linkProducer) {
			              window.sctpClient.set_link_content(linkProducer, producer_value);
                                      window.sctpClient.create_arc(sc_type_const, nodeProc, linkProducer).done(function (generatedCommonArc) {
                                               window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_producer, generatedCommonArc);
                                      });
                                      window.sctpClient.create_arc(sc_type_arc_pos_const_perm, producer_concept, linkProducer);
                                      addJustNrelIntoScs(idtf_value, producer_value, 'nrel_producer'); 
			       });
                               }

                               if(maxFlow_value != ""){
                               window.sctpClient.create_link().done(function (linkMaxFlow) {
			              window.sctpClient.set_link_content(linkMaxFlow, maxFlow_value);
                                      window.sctpClient.create_arc(sc_type_const, nodeProc, linkMaxFlow).done(function (generatedCommonArc) {
                                               window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_max_flow_quantity, generatedCommonArc);
                                      });
                                      window.sctpClient.create_arc(sc_type_arc_pos_const_perm, quantity, linkMaxFlow);
                                      addWithQuantityIntoScs(idtf_value, maxFlow_value, 'nrel_max_flow_quantity');
			       });
                               }

                               if(manufactureYear_value != ""){
                               window.sctpClient.create_link().done(function (linkManufYear) {
			              window.sctpClient.set_link_content(linkManufYear, manufactureYear_value);
                                      window.sctpClient.create_arc(sc_type_const, nodeProc, linkManufYear).done(function (generatedCommonArc) {
                                               window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_manufacture_date, generatedCommonArc);
                                      });
                                      window.sctpClient.create_arc(sc_type_arc_pos_const_perm, quantity, linkManufYear);
                                      addWithYearScs(idtf_value, manufactureYear_value, 'nrel_manufacture_date'); 
			       });
                               }

                               if(clockFreq_value != ""){
                               window.sctpClient.create_link().done(function (linkClockFreq) {
			              window.sctpClient.set_link_content(linkClockFreq, clockFreq_value);
                                      window.sctpClient.create_arc(sc_type_const, nodeProc, linkClockFreq).done(function (generatedCommonArc) {
                                               window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_clock_frequency, generatedCommonArc);
                                      });
                                      window.sctpClient.create_arc(sc_type_arc_pos_const_perm, quantity, linkClockFreq);
                                      addWithQuantityIntoScs(idtf_value, clockFreq_value, 'nrel_clock_frequency');
			       });
                               }

                               if(kernel_value != ""){
                               window.sctpClient.create_link().done(function (linkKernel) {
			              window.sctpClient.set_link_content(linkKernel, kernel_value);
                                      window.sctpClient.create_arc(sc_type_const, nodeProc, linkKernel).done(function (generatedCommonArc) {
                                               window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_kernel_quantity, generatedCommonArc);
                                      });
                                      window.sctpClient.create_arc(sc_type_arc_pos_const_perm, quantity, linkKernel);
                                      addWithQuantityIntoScs(idtf_value, kernel_value, 'nrel_kernel_quantity');
			       });
                               }

                               if(socket_value != ""){
                               window.sctpClient.create_link().done(function (linkSocket) {
			              window.sctpClient.set_link_content(linkSocket, socket_value);
                                      window.sctpClient.create_arc(sc_type_const, nodeProc, linkSocket).done(function (generatedCommonArc) {
                                               window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_socket, generatedCommonArc);
                                      });
                                      window.sctpClient.create_arc(sc_type_arc_pos_const_perm, socket_concept, linkSocket);
                                      addJustNrelIntoScs(idtf_value, socket_value, 'nrel_socket'); 
			       });
                               }

                               if(modelRange_value != ""){
                               window.sctpClient.create_link().done(function (linkModelRange) {
 			              window.sctpClient.set_link_content(linkModelRange, modelRange_value);
                                      window.sctpClient.create_arc(sc_type_const, nodeProc, linkModelRange).done(function (generatedCommonArc) {
                                               window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_model_range, generatedCommonArc);
                                      });
                                      window.sctpClient.create_arc(sc_type_arc_pos_const_perm, model_range_concept, linkModelRange);
                                      addJustNrelIntoScs(idtf_value, modelRange_value, 'nrel_model_range'); 
			       });
                               }
 
                               if(codeCrystal_value != ""){
                               window.sctpClient.create_link().done(function (linkCodeCrystal) {
			              window.sctpClient.set_link_content(linkCodeCrystal, codeCrystal_value);
                                      window.sctpClient.create_arc(sc_type_const, nodeProc, linkCodeCrystal).done(function (generatedCommonArc) {
                                               window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_code_crystal_name, generatedCommonArc);
                                      });
                                      window.sctpClient.create_arc(sc_type_arc_pos_const_perm, code_crystal_name_concept, linkCodeCrystal);
                                      addJustNrelIntoScs(idtf_value, codeCrystal_value, 'nrel_code_crystal_name'); 
			       });
                               }
               
                               if(turboSpeed_value != ""){
                               window.sctpClient.create_link().done(function (linkTurboSpeed) {
			              window.sctpClient.set_link_content(linkTurboSpeed, turboSpeed_value);
                                      window.sctpClient.create_arc(sc_type_const, nodeProc, linkTurboSpeed).done(function (generatedCommonArc) {
                                               window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_turbo_speed, generatedCommonArc);
                                      });
                                      window.sctpClient.create_arc(sc_type_arc_pos_const_perm, quantity, linkTurboSpeed);
                                      addWithQuantityIntoScs(idtf_value, turboSpeed_value, 'nrel_turbo_speed');
			       });
                               }

                            });   
                        });
               });
	},

};

function isValidUserInput() {
    if (document.getElementById("cpu_identifier_add").value == "" || 
        document.getElementById("cpu_name_add").value == "") {
        return false;
    }
    return true;
}
