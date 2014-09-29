(function($angular) {

    "use strict";

    // No, no! The adventures first; explanations take such a dreadful time.
    $angular.module('ngRangeSlider', []).directive('rangeSlider', ['$window', function ngRangeSlider($window) {

        return {

            /**
             * @property restrict
             * @type {String}
             */
            restrict: 'EA',

            /**
             * @method controller
             * @param $scope {Object}
             * @return {void}
             */
            controller: ['$scope', function controller($scope) {

                /**
                 * @method iter
                 * @param max {Number}
                 * @return {Array}
                 */
                $scope.iter = function iter(max) {

                    var iterator = [];

                    for (var index = 0; index <= max; index++) {
                        iterator.push(index);
                    }

                    return iterator;

                };

            }],

            /**
             * @property template
             * @type {String}
             */
            template: '<section><datalist id="numbers"><option ng-repeat="index in iter(max)">{{index}}</option></datalist><input list="numbers" type="range" ng-change="_which = 0" ng-model="_model[0]" min="{{_min}}" max="{{_max}}" /><input type="range" ng-change="_which = 1" ng-model="_model[1]" min="{{_min}}" max="{{_max}}" /></section>',

            /**
             * @property replace
             * @type {Boolean}
             */
            replace: true,

            /**
             * @property require
             * @type {String}
             */
            require: 'ngModel',

            /**
             * @property scope
             * @type {Object}
             */
            scope: {
                model: '=ngModel',
                max: '=',
                min: '='
            },

            /**
             * @method link
             * @param scope {Object}
             * @param element {Object}
             * @return {void}
             */
            link: function link(scope, element) {

                /**
                 * @property _model
                 * @type {Array}
                 * @private
                 */
                scope._model = [scope.model.from, scope.model.to];

                /**
                 * @property _min
                 * @type {Number}
                 * @private
                 */
                scope._min = scope.min || 0;

                /**
                 * @property _max
                 * @type {Number}
                 * @private
                 */
                scope._max = scope.max || 100;

                /**
                 * Force the re-evaluation of the input slider values.
                 *
                 * @method _reevaluateInputs
                 * @return {void}
                 * @private
                 */
                var _reevaluateInputs = function _reevaluateInputs() {

                    var inputElements = element.find('input');

                    $angular.forEach(inputElements, function forEach(inputElement, index) {

                        inputElement = $angular.element(inputElement);

                        inputElement.val('');
                        inputElement.val(scope._model[index]);

                    });

                };

                scope.$watch('min', function alteredMin() {
                    scope._min = scope.min;
                    _reevaluateInputs();
                });

                scope.$watch('max', function alteredMax() {
                    scope._max = scope.max;
                    _reevaluateInputs();
                });

                /**
                 * Responsible for determining which slider the user was moving, which help us resolve
                 * occurrences of sliders overlapping.
                 *
                 * @property _which
                 * @type {Number}
                 * @private
                 */
                scope._which = 0;

                // Observe the `_model` for any changes.
                scope.$watchCollection('_model', function modelChanged() {

                    scope._model[0] = $window.parseInt(scope._model[0]);
                    scope._model[1] = $window.parseInt(scope._model[1]);

                    // User was moving the first slider.
                    if (scope._which === 0 && scope._model[1] < scope._model[0]) {
                        scope._model[1] = scope._model[0];
                    }

                    // Otherwise they were moving the second slider.
                    if (scope._which === 1 && scope._model[0] > scope._model[1]) {
                        scope._model[0] = scope._model[1];
                    }

                    // Update the model!
                    scope.model = { from: scope._model[0], to: scope._model[1] };

                });

            }

        };

    }]);

})(window.angular);