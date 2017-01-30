app = angular.module("Application", []);

app.controller("ContactsController", ['$scope', '$timeout', function($scope, $timeout) {

  $scope.guid = function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
  }

  $scope.getIndexOfObject = function(prop, value){
    for (var i = 0; i < $scope.contactList.length ; i++) {
      if ($scope.contactList[i][prop] === value) {
        return i;
      }
    }
  }

  $scope.contactList = [];
  $scope.selectedItem = null;
  $scope.selectedItemIndex = null;
  $scope.changesMade = false;
  $scope.savedVersion = {};
  $scope.alert = false;
  $scope.contact = [
    {id: null,
      firstName: null,
      lastName: null,
      img: '',
      city: null,
      country: null,
      address: null,
      zip: '',
      avatar: null,
      selected: false,
      savedVersionBool: false
  }];

  $scope.add = function() {
    var newContact = {
      id: $scope.guid(), 
      firstName: null,
      lastName: null,
      img: './img/placeholder.png',
      city: null,
      country: null,
      address: null,
      zip: '',
      avatar: null,
      selected: false,
      savedVersionBool: false,
    }
    $scope.contactList.push(newContact);
    console.log('contactList', $scope.contactList);
    $scope.selectedItemId = newContact.id;
    console.log('$scope.selectedItemId', $scope.selectedItemId);

    $scope.selectItem(newContact);
  }

  $scope.delete = function() {
    if ($scope.changesMade === true) {
      $scope.alert = true;
      $timeout($scope.callAtTimeout, 2000);
      return;
    }
    $scope.contactList.splice($scope.selectedItemIndex, 1);

    if ($scope.contactList.length >= 1) {
      $scope.selectItem($scope.contactList[0]);
    } else {
      $scope.selectedItem = null;
    }
  }

  $scope.selectItem = function(contact) {
    //verify if changes have not been saved
    if ($scope.changesMade === true) {
      $scope.alert = true;
      $timeout($scope.callAtTimeout, 2000);
      return;
    }
    // clean
    for (var i = 0; i < $scope.contactList.length; i++) {
      $scope.contactList[i].selected = false;
    };
    // select
    $scope.selectedItem = contact.id;
    contact.selected = true;
    $scope.selectedItemIndex = $scope.getIndexOfObject('id', $scope.selectedItem);
  }

  

  $scope.callAtTimeout = function() {
    $scope.alert = false;
  }
  
  $scope.focus = function () {
    if ($scope.contactList[$scope.selectedItemIndex].savedVersionBool === true) {
      return;
    };
    angular.extend($scope.savedVersion, $scope.contactList[$scope.selectedItemIndex]);
    $scope.contactList[$scope.selectedItemIndex].savedVersionBool = true;
  }

  $scope.change = function() {
    $scope.changesMade = true;
  }

  $scope.save = function() {
    $scope.changesMade = false;
    $scope.contactList[$scope.selectedItemIndex].savedVersionBool = false;
    angular.extend($scope.savedVersion, $scope.contactList[$scope.selectedItemIndex]);
  }

  $scope.undo = function () {
    angular.extend($scope.contactList[$scope.selectedItemIndex], $scope.savedVersion);
    $scope.changesMade = false;
    $scope.contactList[$scope.selectedItemIndex].savedVersionBool = false;
  }

  $scope.avatarChange = function(src) {
    //call functions to save the data, before changing it, for further SAVE and UNDO actions
    $scope.focus();
    $scope.change();
    $scope.contactList[$scope.selectedItemIndex].img = src;
    $scope.$apply();
  }

  $scope.validateInt = function (evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    var regex = /[0-9]|\./;
    if ($scope.contactList[$scope.selectedItemIndex].zip.toString() && $scope.contactList[$scope.selectedItemIndex].zip > 99999) {
      $scope.contactList[$scope.selectedItemIndex].zip = parseInt($scope.contactList[$scope.selectedItemIndex].zip.toString().slice(0, -1));
    } else  
    if( !regex.test(key)) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    } 
  }

  $scope.validateText = function (evt) {
    var regex = new RegExp("^[a-zA-Z ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }

}]);

app.directive('sideBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/side-bar.html'
  };
});

app.directive('contactPage', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/contact-page.html'
  };
});

app.directive('imageUpload', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/img.html',
    scope: {
      target: '@',
      setImageCb: '&'
    },
    link: function(scope, el, attrs) {
      scope.onFileSelected = function (fileEl) {
        var selectedFile = fileEl.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
          //call back function to send the image
          scope.setImageCb({src: event.target.result}) 
        };
        if(selectedFile) {reader.readAsDataURL(selectedFile);}
      };
    }
  };
});
