il.Form = {

	sub_active: [],	// active sub forms for each context

	//
	// General functions
	//

	// init
	init: function () {
		il.Form.initLinkInput();
	},

	// hide sub forms
	hideSubForm: function (id) {
		$("#" + id).css('overflow', 'hidden').css('height', '0px').css('display', 'none');
	},

	// show Subform
	showSubForm: function (id, cont_id, cb) {
		var nh, obj, k, m;

		if (cb == null) {
			il.Form.sub_active[cont_id] = id;
		} else {
			if (cb.checked) {
				il.Form.sub_active[cont_id] = id;
			} else {
				il.Form.sub_active[cont_id] = null;
			}
		}

		$("#" + cont_id + " div.ilSubForm[id!='" + id + "']").animate({
			height: 0
		}, 400, function () {
			$(this).css('display', 'none');

			// activated in the meantime?
			for (m = 0; m < il.Form.sub_active.length; m++) {
				if (this.id == il.Form.sub_active[m]) {
					$(this).css('display', '');
				}
			}
			$(this).css('height', 'auto');
		});

		// activate subform
		obj = document.getElementById(id);
		if (obj && obj.style.display == 'none' && (cb == null || cb.checked == true)) {
			obj.style.display = '';
			obj.style.position = 'relative';
			obj.style.left = '-1000px';
			obj.style.display = 'block';
			nh = obj.scrollHeight;
			obj.style.height = '0px';
			obj.style.position = '';
			obj.style.left = '';
			obj.style.overflow = 'hidden';

			obj.style.display = '';
			$(obj).animate({
				height: nh
			}, 400, function () {
				$(this).css('height', 'auto');
			});
		}

		// deactivate subform of checkbox
		if (obj && (cb != null && cb.checked == false)) {
			obj.style.overflow = 'hidden';

			$(obj).animate({
				height: 0
			}, 400, function () {
				$(this).css('display', 'none');
				// activated in the meantime?
				for (k = 0; k < il.Form.sub_active.length; k++) {
					if (this.id == il.Form.sub_active[k]) {
						$(this).css('display', '');
					}
				}
				$(this).css('height', 'auto');
			});
		}
	},


	//
	// ilLinkInputGUI
	//

	initLinkInput: function () {
		$("a.ilLinkInputRemove").click(function (e) {
			var id = this.parentNode.id;
			id = id.substr(0, id.length - 4);
			$("input[name=" + id + "_ajax_type]").val('');
			$("input[name=" + id + "_ajax_id]").val('');
			$("input[name=" + id + "_ajax_target]").val('');
			$("#" + id + "_value").html('');
			$(this.parentNode).css('display', 'none');
			console.log(id);
		});
	},
	
	// set internal link in form item
	addInternalLink: function (link, title, input_id, ev) {
		var type, id, part, target = "";

		$("#" + input_id + "_value").html($(ev.target).html());

		link = link.split(' ');
		part = link[1].split('="');
		type = part[0];
		id = part[1].split('"')[0];
		if (link[2] !== undefined) {
			target = link[2].split('="');
			target = target[1].split('"')[0];
		}
		$("input[name=" + input_id + "_ajax_type]").val(type);
		$("input[name=" + input_id + "_ajax_id]").val(id);
		$("input[name=" + input_id + "_ajax_target]").val(target);
		
		$("#" + input_id + "_rem").css('display', 'block');
	},

	//
	// ilNumberInputGUI
	//

	// initialisation for number fields
	initNumericCheck: function (id, decimals_allowed) {
		var current;

		$('#' + id).keydown(function (event) {

			if (event.keyCode == 190) {
				// decimals are not allowed
				if (decimals_allowed == undefined || decimals_allowed == 0) {
					event.preventDefault();
				} else {
					// decimal point is only allowed once
					current = $('#' + id).val();
					if (current.indexOf('.') > -1) {
						event.preventDefault();
					}
				}
			// Allow: backspace, delete, tab, escape, and enter
			} else if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
					 // Allow: Ctrl+A
					(event.keyCode == 65 && event.ctrlKey === true) ||
					 // Allow: home, end, left, right
					(event.keyCode >= 35 && event.keyCode <= 39)) {
				// let it happen, don't do anything
				return;
			} else {
				// Ensure that it is a number and stop the keypress
				if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
					event.preventDefault();
				}
			}
		});
	}
};

// init forms
il.Util.addOnLoad(il.Form.init);
