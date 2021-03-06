describe('Creator Controller', function() {
	require('angular/angular.js');
	require('angular-mocks/angular-mocks.js');
	var $controller

	beforeEach(() => {
		jest.resetModules()
		angular.mock.module('creator')
		global.Materia = {
			CreatorCore: {
				start: jest.fn(),
				save: jest.fn(),
				cancelSave: jest.fn()
			}
		}

		require('./creator.coffee');

		// use angular mock to access angular modules
		inject(function(_$controller_) {
			$controller = _$controller_
		});
	})

	test('CreatorCtrl calls CreatorCore start', () => {
		var $scope = {}
		var controller = $controller('CreatorCtrl', { $scope })
		expect(global.Materia.CreatorCore.start).toHaveBeenCalledTimes(1)
	});

	test('CreatorCtrl defines expected callbacks', () => {
		var $scope = {}
		var controller = $controller('CreatorCtrl', { $scope })
		var materiaCallbacks = global.Materia.CreatorCore.start.mock.calls.pop()[0]
		expect(materiaCallbacks).toHaveProperty('initNewWidget', expect.any(Function))
		expect(materiaCallbacks).toHaveProperty('initExistingWidget', expect.any(Function))
		expect(materiaCallbacks).toHaveProperty('onSaveClicked', expect.any(Function))
	});

	test('CreatorCtrl initializes scope variables', () => {
		var $scope = {}
		var controller = $controller('CreatorCtrl', { $scope })
		expect($scope).toEqual({
			widget: {
				engineName: '',
				title: ''
			},
			state: {
				isEditingExistingWidget: false
			}
		})
	});


	test('initNewWidget sets expected scope params', () => {
		var $scope = { $apply: jest.fn() }
		var controller = $controller('CreatorCtrl', { $scope })
		var materiaCallbacks = global.Materia.CreatorCore.start.mock.calls.pop()[0]
		var widget = {name: 'mock-title'}

		materiaCallbacks.initNewWidget(widget)

		// manually exec $scope.$apply callback
		expect($scope.$apply).toHaveBeenCalledTimes(1)
		$scope.$apply.mock.calls.pop()[0]()

		// check scope vars
		expect($scope.widget.engineName).toBe('mock-title')
		expect($scope.widget.title).toBe('mock-title')
	});

	test('initExistingWidget sets expected scope params', () => {
		var $scope = { $apply: jest.fn() }
		var controller = $controller('CreatorCtrl', { $scope })
		var materiaCallbacks = global.Materia.CreatorCore.start.mock.calls.pop()[0]
		var widget = {name: 'mock-title'}
		var qset = {name: 'arbitrary-mock-qset'}

		materiaCallbacks.initExistingWidget('mock-title2', widget, qset, 2, 'base-url')

		// manually exec $scope.$apply callback
		expect($scope.$apply).toHaveBeenCalledTimes(1)
		$scope.$apply.mock.calls.pop()[0]()

		// check scope vars
		expect($scope.state.isEditingExistingWidget).toBe(true)
		expect($scope.widget.engineName).toBe('mock-title')
		expect($scope.widget.title).toBe('mock-title')
	});

	test('onSaveClicked calls save', () => {
		var $scope = { $apply: jest.fn() }
		var controller = $controller('CreatorCtrl', { $scope })
		var materiaCallbacks = global.Materia.CreatorCore.start.mock.calls.pop()[0]
		var widget = {name: 'mock-title'}
		var qset = {name: 'arbitrary-mock-qset'}

		// call initExistingWidget to initialize widget
		materiaCallbacks.initExistingWidget('mock-title2', widget, qset, 2, 'base-url')

		// manually exec $scope.$apply callback
		// to initialize widget data
		$scope.$apply.mock.calls.pop()[0]()

		materiaCallbacks.onSaveClicked()
		expect(Materia.CreatorCore.cancelSave).toHaveBeenCalledTimes(0)
		expect(Materia.CreatorCore.save).toHaveBeenCalledTimes(1)
		expect(Materia.CreatorCore.save).toHaveBeenCalledWith('mock-title', qset)
	});

	test('onSaveClicked calls cancel when title is missing', () => {
		var $scope = { $apply: jest.fn() }
		var controller = $controller('CreatorCtrl', { $scope })
		var materiaCallbacks = global.Materia.CreatorCore.start.mock.calls.pop()[0]
		var widget = {name: 'mock-title'}
		var qset = {name: 'arbitrary-mock-qset'}

		// call initExistingWidget to initialize widget
		materiaCallbacks.initExistingWidget('mock-title2', widget, qset, 2, 'base-url')

		// manually exec $scope.$apply callback
		// to initialize widget data
		$scope.$apply.mock.calls.pop()[0]()

		// make sure title is empty
		$scope.widget.title = ''

		materiaCallbacks.onSaveClicked()
		expect(Materia.CreatorCore.save).toHaveBeenCalledTimes(0)
		expect(Materia.CreatorCore.cancelSave).toHaveBeenCalledTimes(1)
		expect(Materia.CreatorCore.cancelSave).toHaveBeenCalledWith('This widget has no title!')
	});

	test('onSaveComplete returns expcted value', () => {
		var $scope = { $apply: jest.fn() }
		var controller = $controller('CreatorCtrl', { $scope })
		var materiaCallbacks = global.Materia.CreatorCore.start.mock.calls.pop()[0]
		let result = materiaCallbacks.onSaveComplete()
		expect(result).toBe(null)
	})

	test('onQuestionImportComplete returns expcted value', () => {
		var $scope = { $apply: jest.fn() }
		var controller = $controller('CreatorCtrl', { $scope })
		var materiaCallbacks = global.Materia.CreatorCore.start.mock.calls.pop()[0]
		let result = materiaCallbacks.onQuestionImportComplete()
		expect(result).toBe(null)
	})

})
