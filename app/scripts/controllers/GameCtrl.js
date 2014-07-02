'use strict';

angular.module('previewGruntApp')
.controller('GameCtrl', function($scope, $routeParams){

  var unique;
  unique = require('prelude-ls').unique;
  
  $scope.levels = [
      [2,2],
      [2,6,3],
      [2,3,4,6],
      [6,10,15],
      [2,12,10,30,2],
      [3,6,4,12,14,42,2],
      [6,6,6,6,9],
      [4,4,6,6,9],
      [14,22,30,105,198],
      [4,4,8,8],
      [4,6,12,18],
      [2,4,8],
      [3,9,27],
      [125,25,125],
      [10,15,22,33],
      [14,15,30,63],
      [4,36,9],
      [4,4,7,7,10,84,840],
      [5,6,9,10,12],
      [2,4,6,9,14,30,315],
      [44,63,180,385]
    ];

  var comDiv, endCheck;
  $scope.currentLevel = $routeParams.levelId - 1;
  $scope.startingNums = $scope.levels[$scope.currentLevel];
  $scope.started = false;
  $scope.numbers = $scope.startingNums.concat([]);
  $scope.winFlag = false;
  $scope.loseFlag = false;
  $scope.prev = -1;
  $scope.positions = [[[]], [[]], [[10, 10], [100, 100]], [[10, 10], [10, 100], [50, 50]], [[10, 10], [10, 100], [100, 10], [100, 100]]];
  comDiv = function(a, b){
    var best, i$, i;
    if (a > b) {
      return comDiv(b, a);
    } else {
      best = a;
      for (i$ = Math.floor(a / 2); i$ >= 2; --i$) {
        i = i$;
        if (a % i === 0 && b % i === 0) {
          best = i;
        }
      }
      if (best === a && b % a !== 0) {
        best = 1;
      }
      return best;
    }
  };
  endCheck = function(){
    if (unique($scope.numbers).length === 1 && $scope.numbers[0] === 1) {
      return $scope.winFlag = true;
    } else {
      return $scope.loseFlag = true;
    }
  };
  $scope.handleDrop = function(item, bin){
    var div;
    if(item===bin) {return;}
    if (item === $scope.prev || $scope.prev === -1) {
      div = comDiv($scope.numbers[item], $scope.numbers[bin]);
      $scope.numbers[item] /= div;
      $scope.numbers[bin] /= div;
      if (div !== 1) {
        $scope.prev = bin;
      }
    }
    if ($scope.numbers[$scope.prev] === 1) {
      return endCheck();
    }
  };
  return $scope.reset = function(){
    $scope.prev = -1;
    $scope.winFlag = false;
    $scope.loseFlag = false;
    $scope.started = false;
    return $scope.numbers = $scope.startingNums.concat([]);
  }; 
})


.directive('draggable', function() {
  return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];
    
    el.draggable = true;
    
    el.addEventListener(
      'dragstart',
      function(e) {
        e.dataTransfer.effectAllowed = 'move'; 
        this.style.opacity = '0.4';
        e.dataTransfer.setData('Text', this.id);
        this.classList.add('drag');
        return false;
      },
      false
    );
    
    el.addEventListener(
      'dragend',
      function(e) {
        this.style.opacity = '1.0';
        this.classList.remove('drag');
        return false;
      },
      false
    );
  };
})

.directive('droppable', function() {
  return {
    scope: {
      drop: '&',
      bin: '='
    },
    link: function(scope, element) {
      // again we need the native object
      var el = element[0];
      
      el.addEventListener(
        'dragover',
        function(e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) e.preventDefault();
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragenter',
        function(e) {
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragleave',
        function(e) {
          this.classList.remove('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'drop',
        function(e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();
          
          this.classList.remove('over');
          
          var binId = this.id;
          var item = document.getElementById(e.dataTransfer.getData('Text'));
          // call the passed drop function
          scope.$apply(function(scope) {
            var fn = scope.drop();
            if ('undefined' !== typeof fn) {            
              fn(item.id, binId);
            }
          });
          
          return false;
        },
        false
      );
    }
  };
});
