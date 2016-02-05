'use strict';

var todo = (function($){

	var exports = {
		add: _add,
		done: _done,
		remove: _remove
	}

	function _add (data) {
		$('#sortable').append(_createTodoItem(data));
	}

	function _done (data) {
		$('#done-items').append(_createDoneItem(data));
	}

	function _remove (object){
		object.remove();
	}

	function _setItemLeft () {
		$('.count-todos').text(_calculateItemLeft());
	}

	function _createTodoItem (data) {
		var li = $('<li>').addClass('ui-state-default'),
				div = $('<div>').addClass('checkbox'),
				label = $('<label>'),
				checkbox = $('<input>').attr('type','checkbox');

		var object = li.append(div.append(label.append(checkbox).append(data)));
		return object;		
	}

	function _createDoneItem (data) {
		var li = $('<li>').addClass('ui-state-default').text(data),
				button = $('<button>').addClass('remove-item btn btn-default btn-xs pull-right'),
				icon = $('<span>').addClass('glyphicon glyphicon-remove');

		var object = li.append(button.append(icon));
		return object;
	}

	function _calculateItemLeft () {
		return $('#sortable').find('li').length;
	}

	function _save (data) {
		var notDone = [],
				done = [];

		$('#sortable li').each(function(){
			notDone.push(this.innerText);
		});
		$('#done-items li').each(function(){
			done.push(this.innerText);
		});

		storage.set(notDone, 'notDone');
		storage.set(done, 'done');
	}

	function _load () {
		var notDone = storage.get('notDone'),
				done = storage.get('done');

		_clearAll();
		$(notDone).each(function(){
				_add(this);
		});
		$(done).each(function(){
				_done(this);
		});

		_setItemLeft();
	}

	function _clearAll () {
		$('#sortable li').remove();
		$('#done-items li').remove();
		_setItemLeft();
	}

	function _trigger () {

		//Add todo list
		$('.not-done').on('keydown', '.add-todo', function(e){
			var keypressed = event.keyCode || event.which;
	    if (keypressed == 13) {
				var data = $('.add-todo').val();
				todo.add(data);
				$('.add-todo').val('');
				_setItemLeft();
				_save();
	    }
		});

		//Move to done
		$('#sortable').on('click', 'li', function(e){
			e.preventDefault();
			var data = this.innerText;
			todo.done(data);
			this.remove();
			_setItemLeft();
			_save();
		});

		//Remove done item
		$('#done-items').on('click', '.glyphicon-remove', function(e){
			e.preventDefault();
			var object = $(this).closest('li');
			todo.remove(object);
			_save();
		});

		//Mark as All done
		$('.not-done').on('click', '#checkAll', function(e){
			e.preventDefault();
			$('#sortable li').each(function(){
				_done(this.innerText);
				$(this).remove();
				_setItemLeft();
				_save();
			})
		});

	}

	var storage = (function($){
		var exports = {
			get: _get,
			set: _set
		};
		function _set (data, key) {
			if(typeof(Storage) !== "undefined") {
				localStorage[key] = JSON.stringify(data);
			}
		}
		function _get (key) {
			var result, data;
			if(typeof(Storage) !== "undefined") {
				data = localStorage[key];
				if (data != undefined) {
					result = JSON.parse(localStorage[key]);
				}
			}
			return result;
		}

		return exports;
	})(jQuery);

	_load();
	_setItemLeft();
	_trigger();
	return exports;
})(jQuery);