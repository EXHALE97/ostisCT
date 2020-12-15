/**
 * Paint panel.
 */
cpu_set = [];
common_count = 0;
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
       container.append('<div class="sc-no-default-cmd">Агент подбора множества процессоров по заданным характеристикам</div>');
               
		container.append('Производитель:</br>');
                container.append('<select id="cpu_producer"><option value = ""> </option></select><br>');
                container.append('Сокет:</br>');
                container.append('<select id="socket"><option value = ""> </option></select><br>');
                container.append('Модельный ряд:</br>');
                container.append('<select id="model_range"><option value = ""> </option></select><br>');
		container.append('Кодовое название кристалла:</br>');
                container.append('<select id="code_crystal_name"><option value = ""> </option></select><br>');
		container.append('Максимальное количество потоков:</br>');
                container.append('<select id="max_flow_quantity"><option value = ""> </option></select><br>');
		container.append('Год производства:</br>');
                container.append('<select id="manufacture_year"><option value = ""> </option></select><br>');
		container.append('Тактовая частота(МГц):</br>');
                container.append('<select id="clock_frequency"><option value = ""> </option></select><br>');
		container.append('Количество ядер:</br>');
                container.append('<select id="kernel_quantity"><option value = ""> </option></select><br>');
                container.append('Turbo-частота(МГц):</br>');
                container.append('<select id="turbo_speed"><option value = ""> </option></select><br>');
		container.append('<button id="pick_up_cpus" type="button">Подобрать</button></br>');
		container.append('</br><table id="cpu_table" border="1"></table>');

                self._findOptions('cpu_producer', 'producer');
                self._findOptions('socket', 'socket');
                self._findOptions('model_range', 'proc_model_range');
                self._findOptions('code_crystal_name', 'code_crystal_name');
                self._findOptionsWithNrel('max_flow_quantity', 'nrel_max_flow_quantity');
                self._findOptions('manufacture_year', 'year');
                self._findOptionsWithNrel('clock_frequency', 'nrel_clock_frequency');
                self._findOptionsWithNrel('kernel_quantity', 'nrel_kernel_quantity');
                self._findOptionsWithNrel('turbo_speed', 'nrel_turbo_speed');

		$('#pick_up_cpus').click(function () {
			cpu_set = [];
			common_count = 0;		
			self._searchElements('cpu_producer', 'nrel_producer');
                        setTimeout(self._searchElements, 1000, 'socket', 'nrel_socket');	
			setTimeout(self._searchElements, 2000, 'model_range', 'nrel_model_range');
			setTimeout(self._searchElements, 3000, 'code_crystal_name', 'nrel_code_crystal_name');
			setTimeout(self._searchElements, 4000, 'max_flow_quantity', 'nrel_max_flow_quantity');
			setTimeout(self._searchElements, 5000, 'manufacture_year', 'nrel_manufacture_date');
			setTimeout(self._searchElements, 6000, 'clock_frequency', 'nrel_clock_frequency');
			setTimeout(self._searchElements, 7000, 'kernel_quantity', 'nrel_kernel_quantity');
			setTimeout(self._searchElements, 8000, 'turbo_speed', 'nrel_turbo_speed');
			setTimeout(self._sort_cpu_set, 9000);
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
								window.scHelper.getIdentifier(elements[count][0],SCWeb.core.Server._current_language).done(function (cpu_name) {
									cpu_set.push(cpu_name);
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

      _findOptionsWithNrel : function (element_id, sc_addr) {
        var selectField = document.getElementById(element_id);
        var processors = [];
        var quantities = [];
        SCWeb.core.Server.resolveScAddr([sc_addr, 'processor'],function(keynodes){
                var sc_addr_numb = keynodes[sc_addr];
                var processor_numb = keynodes['processor'];
                window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A,[
			processor_numb,
			sc_type_arc_pos_const_perm,
                        0]).done(function(element_of_addr){
				for (count = 0; count < element_of_addr.length; count++){
                                         processors.push(element_of_addr[count][2]);
				}
                        for (var count = 0; count < processors.length; count++) {
                                window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,[
			                 processors[count],
			                 sc_type_arc_common | sc_type_const,
			                 sc_type_node,
			                 sc_type_arc_pos_const_perm,
			                 sc_addr_numb]).done(function(element_of_addr){
				                for (count = 0; count < element_of_addr.length; count++){
                                                       window.scHelper.getIdentifier(element_of_addr[count][2],SCWeb.core.Server._current_language).done(function (name) {
                                                             if (!quantities.includes(name)) {
                                                                   quantities.push(name);
                                                                   selectField.innerHTML += '<option value="' + name + '">' + name + '</option>';
                                                             }
				                       })
				                }
		                });
                        }
                });
	});
        
        
},


	_sort_cpu_set: function () {
		var table = document.getElementById('cpu_table');
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
