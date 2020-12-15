/* --- src/example-common.js --- */
var Example = {};

function extend(child, parent) {
    var F = function () {
    };
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    child.superclass = parent.prototype;
}


/* --- src/example-paintPanel.js --- */
/**
 * Paint panel.
 */

var temp_list = [];
var common_count = 0;	
var max_ram = [];		
var result_config = [];
var result_config_prices = [];
s = null;

Example.PaintPanel = function (containerId) {
    this.containerId = containerId;
};

Example.PaintPanel.prototype = {

    init: function () {
        s = this;
        this._initMarkup(this.containerId);
    },

    _initMarkup: function (containerId) {
        var container = $('#' + containerId);
        var optionSet = [];

        var self = this;
       container.append('<div class="sc-no-default-cmd">Агент подбора конфигурации стационарного ПК</div>');
               
		container.append('Название процессора:</br>');
                container.append('<select id="cpu_name"><option value = ""> </option></select><br>');
                container.append('Название графического процессора:</br>');
                container.append('<select id="videocard_name"><option value = ""> </option></select><br>');
		container.append('<button id="pick_up_process" type="button">Начать</button></br>');
		container.append('</br><div id="temp_part"></div>');
		container.append('</br><div id="result_table"></div>');

                self._findOptions('cpu_name', 'processor');
                self._findOptions('videocard_name', 'graphics');

		$('#pick_up_process').click(function () {
                        temp_list = [];
                        result_config = [];
                        result_config_prices = [];
                        common_count = 0;
			max_ram = [];
			result_config.push(document.getElementById('cpu_name').value);
			self._pushPrice(document.getElementById('cpu_name').value, 'nrel_cost_dollars'); 
                        document.getElementById('result_table').innerHTML = "";
			document.getElementById('temp_part').innerHTML = "";
			self._findVideoCard(document.getElementById('videocard_name').value, 'nrel_graphics_chip', 'graphics_card');
                        setTimeout(self._show_motherboards, 1000, temp_list, 'Выберите одну из доступных видеокарт');
			setTimeout(self._select_motherboard, 2000, container, self);
		});

                

    },

   _select_motherboard: function (container_initial, self_this) {
        var container = container_initial;
        var optionSet = [];

        var self = self_this;
		
	$('#continue_process').click(function () {
			result_config.push(document.querySelector('input[name="devRadio"]:checked').value);
			self._pushPrice(document.querySelector('input[name="devRadio"]:checked').value, 'nrel_cost_dollars');
                        temp_list = [];
                        common_count++;
                        document.getElementById('result_table').innerHTML = "";
			self._findMotherboards(document.getElementById('cpu_name').value, 'nrel_socket', 'motherboard');
                        setTimeout(self._show_motherboards, 1000, temp_list, 'Выберите одну из доступных материнских плат');
			setTimeout(self._select_cooling_system, 2000, container, self);
	});
                
    },


	_select_cooling_system: function (container_initial, self_this) {
        var container = container_initial;
        var optionSet = [];

        var self = self_this;
		
	$('#continue_process').click(function () {
			result_config.push(document.querySelector('input[name="devRadio"]:checked').value);
                        self._pushPrice(document.querySelector('input[name="devRadio"]:checked').value, 'nrel_cost_dollars');
                        temp_list = [];
                        common_count++;
                        document.getElementById('result_table').innerHTML = "";
			self._findMotherboards(document.getElementById('cpu_name').value, 'nrel_socket', 'air_cooling');
                        setTimeout(self._show_motherboards, 1000, temp_list, 'Выберите одну из доступных систем охлаждения');
			setTimeout(self._select_memory, 2000, container, self);
	});
                
    },


	_select_memory: function (container_initial, self_this) {
        var container = container_initial;
        var optionSet = [];

        var self = self_this;
		
	$('#continue_process').click(function () {
			result_config.push(document.querySelector('input[name="devRadio"]:checked').value);
                        self._pushPrice(document.querySelector('input[name="devRadio"]:checked').value, 'nrel_cost_dollars');
                        temp_list = [];
                        common_count++;
                        document.getElementById('result_table').innerHTML = "";
			document.getElementById('temp_part').innerHTML = "";
			document.getElementById('temp_part').innerHTML += 'Выберите количество ОЗУ:</br>';
			document.getElementById('temp_part').innerHTML += '<select id="memory_select"><option value = ""> </option></select><br>';
			document.getElementById('temp_part').innerHTML += '<br></br><button id="chose_memory" type="button">Продолжить</button></br>';
			self._findOptionsWithNrelAndMaxValue('memory_select', 'nrel_memory_volume', 'ram', result_config[2], 'nrel_max_memory_volume');

			$('#chose_memory').click(function () {
				var memory_volume = document.getElementById('memory_select').value;
				document.getElementById('temp_part').innerHTML = "";
				temp_list = [];
				self._findVideoCard(memory_volume, 'nrel_memory_volume', 'ram');
                        	setTimeout(self._show_motherboards, 1000, temp_list, 'Выберите одну из доступных ОЗУ');
				setTimeout(self._select_disk, 2000, container, self);
			});
	});
                
    },

  _select_disk: function (container_initial, self_this) {
        var container = container_initial;
        var optionSet = [];

        var self = self_this;
		
	$('#continue_process').click(function () {
			result_config.push(document.querySelector('input[name="devRadio"]:checked').value);
                        self._pushPrice(document.querySelector('input[name="devRadio"]:checked').value, 'nrel_cost_dollars');
                        temp_list = [];
                        common_count++;
                        document.getElementById('result_table').innerHTML = "";
			document.getElementById('temp_part').innerHTML = "";
			document.getElementById('temp_part').innerHTML += 'Выберите тип накопителя:</br>';
			document.getElementById('temp_part').innerHTML += '<input name="disk_type" type="radio" value="ssd"> SSD <br></br>';
			document.getElementById('temp_part').innerHTML += '<input name="disk_type" type="radio" value="hdd"> HDD';
			document.getElementById('temp_part').innerHTML += '<br></br><button id="chose_disk_type" type="button">Продолжить</button></br>';

			$('#chose_disk_type').click(function () {
				var disk_type = document.querySelector('input[name="disk_type"]:checked').value;
				temp_list = [];
				document.getElementById('temp_part').innerHTML = "";
				document.getElementById('temp_part').innerHTML += 'Выберите количество памяти (гб):</br>';
				document.getElementById('temp_part').innerHTML += '<select id="memory_select"><option value = ""> </option></select><br>';
				document.getElementById('temp_part').innerHTML += '<br></br><button id="chose_memory" type="button">Продолжить</button></br>';
				self._findOptionsWithNrel('memory_select', 'nrel_memory_volume', disk_type);

				$('#chose_memory').click(function () {
					var memory_volume = document.getElementById('memory_select').value;
					document.getElementById('temp_part').innerHTML = "";
					temp_list = [];
					self._findVideoCard(memory_volume, 'nrel_memory_volume', disk_type);
                        		setTimeout(self._show_motherboards, 1000, temp_list, 'Выберите один из доступных накопителей:');
					setTimeout(self._select_power_unit, 2000, container, self);
				});
			});
	});
                
    },


_select_power_unit: function (container_initial, self_this) {
        var container = container_initial;
        var optionSet = [];

        var self = self_this;
		
	$('#continue_process').click(function () {
			result_config.push(document.querySelector('input[name="devRadio"]:checked').value);
                        self._pushPrice(document.querySelector('input[name="devRadio"]:checked').value, 'nrel_cost_dollars');
                        temp_list = [];
                        common_count++;
                        document.getElementById('result_table').innerHTML = "";
			self._findValuesWithNrelAndMinValue('nrel_power', 'power_supply_unit', result_config[1], 'nrel_recommended_psu');
                        setTimeout(self._show_motherboards, 1000, temp_list, 'Выберите один из доступных блоков питания:');
			setTimeout(self._finish, 2000, container, self);
	});
                
    },


 _finish: function (container_initial, self_this) {
        var container = container_initial;
        var optionSet = [];

        var self = self_this;
		
	$('#continue_process').click(function () {
			result_config.push(document.querySelector('input[name="devRadio"]:checked').value);
                        self._pushPrice(document.querySelector('input[name="devRadio"]:checked').value, 'nrel_cost_dollars');
			var final_cost = 0;
                        temp_list = [];
                        common_count++;
                        document.getElementById('result_table').innerHTML = "<p>Конфигурация:</p><br>";
			for(var i = 0; i < result_config.length; i++){
				document.getElementById('result_table').innerHTML += "<p>"+ result_config[i] + ". Стоимость - " + result_config_prices[i] + "$</p>";
			}
			for(var i = 0; i < result_config_prices.length; i++){
				final_cost += Number(result_config_prices[i]);
			}
			document.getElementById('result_table').innerHTML += "<br><p>Финальная стоимость: "+ final_cost +"$</p>";
			document.getElementById('result_table').innerHTML += '<br></br><button id="close_table" type="button">Закрыть</button></br>';

			$('#close_table').click(function () {
				document.getElementById('result_table').innerHTML = "";

			});
	});
                
    },

	_searchElements: function(element_id, name_of_node) {
		if (document.getElementById(element_id).value != "") {
			common_count++;
			var valueField = document.getElementById(element_id).value;
			SCWeb.core.Server.findIdentifiersSubStr(valueField, function(sc_node_addr) {
				var sc_node_addr_numb = 0;

                                if (sc_node_addr.sys.length != 0){
                                    sc_node_addr_numb = sc_node_addr.sys[0][0];
                                } else if (sc_node_addr.main.length != 0){
                                    sc_node_addr_numb = sc_node_addr.main[0][0];
                                } else if (sc_node_addr.common.length != 0){
                                    sc_node_addr_numb = sc_node_addr.common[0][0];
                                }
				SCWeb.core.Server.resolveScAddr([name_of_node],function(keynodes){
					var name_of_nrel_node_numb = keynodes[name_of_node];
					window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F,[
						sc_type_node,
						sc_type_arc_common | sc_type_const,
						sc_node_addr_numb,
						sc_type_arc_pos_const_perm,
						name_of_nrel_node_numb]).done(function(elements){
							for (count = 0; count < elements.length; count++){
								window.scHelper.getIdentifier(elements[count][0],SCWeb.core.Server._current_language).done(function (element_name) {
									cpu_sockets.push(element_name);
								})
							}
						});
				});
			})
	};
},
        
        _findOptions : function (element_id, sc_addr) {
        var selectField = document.getElementById(element_id);
        SCWeb.core.Server.resolveScAddr([sc_addr],function(keynodes){
		var sc_addr_numb = keynodes[sc_addr];
		window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A,[
			sc_addr_numb,
			sc_type_arc_pos_const_perm,
                        0]).done(function(element_of_addr){
				for (count = 0; count < element_of_addr.length; count++){
				     window.scHelper.getIdentifier(element_of_addr[count][2],SCWeb.core.Server._current_language).done(function (name) { 
                                         selectField.innerHTML += '<option value="' + name + '">' + name + '</option>';
				     })
				}
		});
	});
},

_findOptionsWithNrel : function (element_id, sc_addr, concept_addr) {
	var selectField = document.getElementById(element_id);
        var processors = [];
        SCWeb.core.Server.resolveScAddr([sc_addr, concept_addr],function(keynodes){
        	var sc_addr_numb = keynodes[sc_addr];
        	var processor_numb = keynodes[concept_addr];
                window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A,[
		processor_numb,
		sc_type_arc_pos_const_perm,
                0]).done(function(element_of_addr){
			for (var count = 0; count < element_of_addr.length; count++){
                		processors.push(element_of_addr[count][2]);
			}
                	for (var count = 0; count < processors.length; count++) {
                		window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,[
				processors[count],
				sc_type_arc_common | sc_type_const,
				sc_type_node,
				sc_type_arc_pos_const_perm,
				sc_addr_numb]).done(function(element_of_addr){
					for (var count = 0; count < element_of_addr.length; count++){
                				window.scHelper.getSystemIdentifier(element_of_addr[count][2]).done(function (name) {
                        				if (!selectField.innerHTML.includes(name)) {
                        					selectField.innerHTML += '<option value="' + name + '">' + name + '</option>';
                        				}
						});
					}
	       			});
                        }
                });
	});
},

      _findOptionsWithNrelAndMaxValue : function (element_id, sc_addr, concept_addr, max_value_field, max_value_nrel) {
	SCWeb.core.Server.findIdentifiersSubStr(max_value_field, function (data) {
             var sc_node_addr_numb = 0;

             if (data.sys.length != 0){
                   sc_node_addr_numb = data.sys[0][0];
             } else if (data.main.length != 0){
                   sc_node_addr_numb = data.main[0][0];
             } else if (data.common.length != 0){
                   sc_node_addr_numb = data.common[0][0];
             }

             SCWeb.core.Server.resolveScAddr([max_value_nrel],function(keynodes){
		       	var sc_addr_numb = keynodes[max_value_nrel];
		        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,[
			                 sc_node_addr_numb,
			                 sc_type_arc_common | sc_type_const,
			                 sc_type_node,
			                 sc_type_arc_pos_const_perm,
			                 sc_addr_numb]).done(function(max_value_element_of_addr){
                                         window.scHelper.getSystemIdentifier(max_value_element_of_addr[0][2]).done(function (max_value_element) {
						var selectField = document.getElementById(element_id);
        					var processors = [];
        					SCWeb.core.Server.resolveScAddr([sc_addr, concept_addr],function(keynodes){
                					var sc_addr_numb = keynodes[sc_addr];
                					var processor_numb = keynodes[concept_addr];
                					window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A,[
							processor_numb,
							sc_type_arc_pos_const_perm,
                        				0]).done(function(element_of_addr){
							for (var count = 0; count < element_of_addr.length; count++){
                                         			processors.push(element_of_addr[count][2]);
							}
                        				for (var count = 0; count < processors.length; count++) {
                                				window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,[
			                 			processors[count],
			                 			sc_type_arc_common | sc_type_const,
			                 			sc_type_node,
			                 			sc_type_arc_pos_const_perm,
			                 			sc_addr_numb]).done(function(element_of_addr){
				                		for (var count = 0; count < element_of_addr.length; count++){
                                                       			window.scHelper.getSystemIdentifier(element_of_addr[count][2]).done(function (name) {
                                                              			if ((Number(name) <= Number(max_value_element)) &&!(selectField.innerHTML.includes(name))) {
                                                                   			selectField.innerHTML += '<option value="' + name + '">' + name + '</option>';
                                                             			}
				                       			});
				                		}
		                				});
                        				}
                					});
						});
                                         })
		       });
	     }); 
        });     
},


_findValuesWithNrelAndMinValue : function (sc_addr, concept_addr, min_value_field, min_value_nrel) {
	SCWeb.core.Server.findIdentifiersSubStr(min_value_field, function (data) {
             var sc_node_addr_numb = 0;

             if (data.sys.length != 0){
                   sc_node_addr_numb = data.sys[0][0];
             } else if (data.main.length != 0){
                   sc_node_addr_numb = data.main[0][0];
             } else if (data.common.length != 0){
                   sc_node_addr_numb = data.common[0][0];
             }

             SCWeb.core.Server.resolveScAddr([min_value_nrel],function(keynodes){
		       	var sc_addr_numb = keynodes[min_value_nrel];
		        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,[
			                 sc_node_addr_numb,
			                 sc_type_arc_common | sc_type_const,
			                 sc_type_node,
			                 sc_type_arc_pos_const_perm,
			                 sc_addr_numb]).done(function(min_value_element_of_addr){
                                         window.scHelper.getSystemIdentifier(min_value_element_of_addr[0][2]).done(function (min_value_element) {
        					var processors = [];
        					SCWeb.core.Server.resolveScAddr([sc_addr, concept_addr],function(keynodes){
                					var sc_addr_numb = keynodes[sc_addr];
                					var processor_numb = keynodes[concept_addr];
                					window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A,[
							processor_numb,
							sc_type_arc_pos_const_perm,
                        				0]).done(function(element_of_addr){
							for (var count = 0; count < element_of_addr.length; count++){
                                         			processors.push(element_of_addr[count][2]);
							}
                        				for (var count = 0; count < processors.length; count++) {
                                				window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,[
			                 			processors[count],
			                 			sc_type_arc_common | sc_type_const,
			                 			sc_type_node,
			                 			sc_type_arc_pos_const_perm,
			                 			sc_addr_numb]).done(function(element_of_addr){
				                		for (var count = 0; count < element_of_addr.length; count++){
									var number = count;
                                                       			window.scHelper.getSystemIdentifier(element_of_addr[count][2]).done(function (name) {
                                                              			if (Number(name) > Number(min_value_element)) {
											window.scHelper.getIdentifier(element_of_addr[number][0],SCWeb.core.Server._current_language).done(function (name) { 
                                         							temp_list.push(name);
				     							});
                                                             			}
				                       			});
				                		}
		                				});
                        				}
                					});
						});
                                         })
		       });
	     }); 
        });     
},


_pushPrice : function (selectField, sc_addr) {
	var finding_element = "";
        var motherboards_list = [];

        SCWeb.core.Server.findIdentifiersSubStr(selectField, function (data) {
             var sc_node_addr_numb = 0;

             if (data.sys.length != 0){
                   sc_node_addr_numb = data.sys[0][0];
             } else if (data.main.length != 0){
                   sc_node_addr_numb = data.main[0][0];
             } else if (data.common.length != 0){
                   sc_node_addr_numb = data.common[0][0];
             }

             SCWeb.core.Server.resolveScAddr([sc_addr],function(keynodes){
		       var sc_addr_numb = keynodes[sc_addr];
		       window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,[
			                 sc_node_addr_numb,
			                 sc_type_arc_common | sc_type_const,
			                 sc_type_node,
			                 sc_type_arc_pos_const_perm,
			                 sc_addr_numb]).done(function(element_of_addr){
                                         window.scHelper.getSystemIdentifier(element_of_addr[0][2]).done(function (element) {
                                                    result_config_prices.push(element);
                                         })
		       });
	     }); 
        });   
},


      _findMotherboards : function (selectField, sc_addr, sc_addr_concept) {
	var finding_element = "";
        var motherboards_list = [];

        SCWeb.core.Server.findIdentifiersSubStr(selectField, function (data) {
             var sc_node_addr_numb = 0;

             if (data.sys.length != 0){
                   sc_node_addr_numb = data.sys[0][0];
             } else if (data.main.length != 0){
                   sc_node_addr_numb = data.main[0][0];
             } else if (data.common.length != 0){
                   sc_node_addr_numb = data.common[0][0];
             }

             SCWeb.core.Server.resolveScAddr([sc_addr],function(keynodes){
		       var sc_addr_numb = keynodes[sc_addr];
		       window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,[
			                 sc_node_addr_numb,
			                 sc_type_arc_common | sc_type_const,
			                 sc_type_node,
			                 sc_type_arc_pos_const_perm,
			                 sc_addr_numb]).done(function(element_of_addr){
                                              var socket_idtf = element_of_addr[0][2];
		                              SCWeb.core.Server.resolveScAddr([sc_addr_concept],function(keynodes){
		                                   var motherboard_sc_addr_numb = keynodes[sc_addr_concept];
		                                   window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A,[
			                                     motherboard_sc_addr_numb,
			                                     sc_type_arc_pos_const_perm,
                                                             0]).done(function(element_of_addr_motherboard){
				                             for (count = 0; count < element_of_addr_motherboard.length; count++){
				                                   motherboards_list.push(element_of_addr_motherboard[count][2]);
				                             }
                                                             window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F,[
			                                                   sc_type_node,
			                                                   sc_type_arc_common | sc_type_const,
			                                                   socket_idtf,
			                                                   sc_type_arc_pos_const_perm,
			                                                   sc_addr_numb]).done(function(element_of_addr){
				                                           for (count = 0; count < element_of_addr.length; count++){
                                                                                  for(var new_count = 0; new_count < element_of_addr.length; new_count++){
                                                                                    if(element_of_addr[count][0] == motherboards_list[new_count]){
                                                                                      window.scHelper.getIdentifier(element_of_addr[count][0],SCWeb.core.Server._current_language).done(function (name) {
                                                                                             temp_list.push(name);
				                                                      })
                                                                                    }
                                                                                  }
                                                                                  
                                                                                  
				                                           }
		                                              });
		                                   });
	                                      });
		                         });
	     }); 
        });   
},

_findMemory : function (selectField, sc_addr) {
	var finding_element = "";
        var motherboards_list = [];

        SCWeb.core.Server.findIdentifiersSubStr(selectField, function (data) {
             var sc_node_addr_numb = 0;

             if (data.sys.length != 0){
                   sc_node_addr_numb = data.sys[0][0];
             } else if (data.main.length != 0){
                   sc_node_addr_numb = data.main[0][0];
             } else if (data.common.length != 0){
                   sc_node_addr_numb = data.common[0][0];
             }

             SCWeb.core.Server.resolveScAddr([sc_addr],function(keynodes){
		       var sc_addr_numb = keynodes[sc_addr];
		       window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,[
			                 sc_node_addr_numb,
			                 sc_type_arc_common | sc_type_const,
			                 sc_type_node,
			                 sc_type_arc_pos_const_perm,
			                 sc_addr_numb]).done(function(element_of_addr){
                                         window.scHelper.getSystemIdentifier(element_of_addr[0][2]).done(function (element) {
                                                    result_config_prices.push(element);
                                         })
		       });
	     }); 
        });   
},

_findVideoCard : function (selectField, sc_addr, sc_addr_concept) {
	var finding_element = "";
        var motherboards_list = [];

        SCWeb.core.Server.findIdentifiersSubStr(selectField, function (data) {
             var sc_node_addr_numb = 0;

             if (data.sys.length != 0){
                   sc_node_addr_numb = data.sys[0][0];
             } else if (data.main.length != 0){
                   sc_node_addr_numb = data.main[0][0];
             } else if (data.common.length != 0){
                   sc_node_addr_numb = data.common[0][0];
             }

             SCWeb.core.Server.resolveScAddr([sc_addr],function(keynodes){
		       var sc_addr_numb = keynodes[sc_addr];
		       window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5A_A_F_A_F,[
			                 sc_type_node,
			                 sc_type_arc_common | sc_type_const,
			                 sc_node_addr_numb,
			                 sc_type_arc_pos_const_perm,
			                 sc_addr_numb]).done(function(element_of_addr){
                                              for(var count = 0; count < element_of_addr.length; count++){
                                                                                      window.scHelper.getIdentifier(element_of_addr[count][0],SCWeb.core.Server._current_language).done(function (name) {
                                                                                             temp_list.push(name);
				                                                      })
                                                                                  }
		                         });
	     }); 
        });   
},

        _show_motherboards: function (list, title) {
		var table = document.getElementById('result_table');
		table.innerHTML = "";
                table.innerHTML += '<div class="table_title">' + title +'</div>';
                table.innerHTML += '<table id="result_table_inner" border="1"></table>';
		for (count = 0; count < list.length; count++) {
			table.innerHTML+='<p><input name="devRadio" type="radio" value="'+list[count]+'">'+list[count] + '    ' + '<button id="devButton'+count+'" type="button" value="'+list[count]+'">'+'Посмотреть определение'+'</button></p>';
		}
                table.innerHTML += '<br></br><button id="continue_process" type="button">Продолжить</button></br>';
                s._setButtonsClick(list.length);
},

	_sort_cpu_set: function () {
		var table = document.getElementById('result_table');
		table.innerHTML = "";
		var result_cpu_set = [];
		var control_count = 0;
		for (var count = 0; count < cpu_set.length; count++){
			control_count = 0;	
			for (var count1 = 0; count1 < cpu_set.length; count1++){
				if (cpu_set[count] == cpu_set[count1]) {
					control_count++;
				}
			}	
			if (control_count == common_count) {
				result_cpu_set.push(cpu_set[count])
			}
		}
		for (var count = 0; count < result_cpu_set.length; count++){
			for (var count1 = count+1; count1 < result_cpu_set.length; count1++){
				if (result_cpu_set[count] == result_cpu_set[count1]) {
					result_cpu_set.splice(count1, 1);
					count1--;
				}
			}
		}
		for (count = 0; count < result_cpu_set.length; count++) {
			table.innerHTML+='<tr><td>' + '<button id="devButton'+count+'" type="button" value="'+result_cpu_set[count]+'">'+result_cpu_set[count]+'</button>' + '</td></tr>';
		}

                s._setButtonsClick(result_cpu_set.length);
	},

        

        _setButtonsClick : function(buttonCount) {
		var self = this;
		for (var i = 0; i < buttonCount; i++) {
			$('#devButton'+i).click(function () {
				self._forward(this.value);
			});
		}
	},

	

        _forward: function (value) {
		var v;
		SCWeb.core.Server.findIdentifiersSubStr(value,function(devIdtf){
			v = devIdtf.main[0][0];
			SCWeb.core.Server.resolveScAddr(["ui_menu_view_full_semantic_neighborhood"],
			function (data) {
				var cmd = data["ui_menu_view_full_semantic_neighborhood"];
				SCWeb.core.Main.doCommand(cmd,
				[v], function (result) {
					if (result.question != undefined) {
						SCWeb.ui.WindowManager.appendHistoryItem(result.question);
					}
				});
			});
		});
	}

};


/* --- src/example-component.js --- */
/**
 * Example component.
 */
Example.DrawComponent = {
    ext_lang: 'picking_configurations',
    formats: ['format_picking_configurations_json'],
    struct_support: true,
    factory: function (sandbox) {
        return new Example.DrawWindow(sandbox);
    }
};

Example.DrawWindow = function (sandbox) {
    this.sandbox = sandbox;
    this.paintPanel = new Example.PaintPanel(this.sandbox.container);
    this.paintPanel.init();
    this.recieveData = function (data) {
        console.log("in recieve data" + data);
    };

    var scElements = {};

    function drawAllElements() {
        var dfd = new jQuery.Deferred();
       // for (var addr in scElements) {
            jQuery.each(scElements, function(j, val){
                var obj = scElements[j];
                if (!obj || obj.translated) return;
// check if object is an arc
                if (obj.data.type & sc_type_arc_pos_const_perm) {
                    var begin = obj.data.begin;
                    var end = obj.data.end;
                    // logic for component update should go here
                }

        });
        SCWeb.ui.Locker.hide();
        dfd.resolve();
        return dfd.promise();
    }

// resolve keynodes
    var self = this;
    this.needUpdate = false;
    this.requestUpdate = function () {
        var updateVisual = function () {
// check if object is an arc
            var dfd1 = drawAllElements();
            dfd1.done(function (r) {
                return;
            });


/// @todo: Don't update if there are no new elements
            window.clearTimeout(self.structTimeout);
            delete self.structTimeout;
            if (self.needUpdate)
                self.requestUpdate();
            return dfd1.promise();
        };
        self.needUpdate = true;
        if (!self.structTimeout) {
            self.needUpdate = false;
            SCWeb.ui.Locker.show();
            self.structTimeout = window.setTimeout(updateVisual, 1000);
        }
    }
    
    this.eventStructUpdate = function (added, element, arc) {
        window.sctpClient.get_arc(arc).done(function (r) {
            var addr = r[1];
            window.sctpClient.get_element_type(addr).done(function (t) {
                var type = t;
                var obj = new Object();
                obj.data = new Object();
                obj.data.type = type;
                obj.data.addr = addr;
                if (type & sc_type_arc_mask) {
                    window.sctpClient.get_arc(addr).done(function (a) {
                        obj.data.begin = a[0];
                        obj.data.end = a[1];
                        scElements[addr] = obj;
                        self.requestUpdate();
                    });
                }
            });
        });
    };
// delegate event handlers
    this.sandbox.eventDataAppend = $.proxy(this.receiveData, this);
    this.sandbox.eventStructUpdate = $.proxy(this.eventStructUpdate, this);
    this.sandbox.updateContent();
};
SCWeb.core.ComponentManager.appendComponentInitialize(Example.DrawComponent);


